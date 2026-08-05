#!/usr/bin/env node
// Barrel checker for a Feature-Sliced Design tree.
//
// A barrel (`index.ts`) is the public face of ONE subject expressed in several
// ROLES — a unit's component plus its service/interface/constant, or an api
// unit's fetcher/query/mutation. A folder that merely GROUPS independent units
// (a layer, a folder of slices, a role folder of unrelated members) must not
// have one: the barrel becomes a single module with an edge per member, so any
// consumer of one symbol takes on all of them. Bundlers group shared modules
// into chunks, so tree shaking does not reliably undo it.
//
// Three checks:
//   grouping  an `index.ts` on a folder that GROUPS independent members (a layer,
//             or a plural role folder) rather than naming one subject.
//   bypass    an import that resolves INSIDE a folder which ships an `index.ts`,
//             from outside that folder — the boundary exists, so use it.
//
// Zero dependencies. Two entry points:
//   CLI   node check-barrels.mjs [--root src] [--alias @/=src/] [--ignore <frag,frag>]
//   API   import { checkBarrels } from './check-barrels.mjs'

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'

const SPECIFIER = /(from\s*|import\(\s*|require\(\s*|(?:^|\n)\s*import\s+)(['"])([^'"\n]+)\2/g

const barrelIn = (dir) => ['index.ts', 'index.tsx'].map((f) => path.join(dir, f)).find(existsSync) ?? null

const walk = (dir, out = []) => {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry.startsWith('.')) continue
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, out)
    else if (/\.[cm]?[jt]sx?$/.test(entry)) out.push(full)
  }
  return out
}

/**
 * @param {object} options
 * @param {string} options.cwd             project root
 * @param {string} [options.root]          tree to scan, relative to cwd (default `src`)
 * @param {[string,string]} [options.alias] `['@/', 'src/']`
 * @param {string[]} [options.ignore]      path fragments to skip (generated trees, vendored code)
 * @param {string} [options.sliceRoot]     folder whose grandchildren are slices (default `<root>/app`)
 * @returns {{ grouping: Array, bypass: Array, mixed: Array, format: (list:Array)=>string }}
 */
export const checkBarrels = (options) => {
  const cwd = options.cwd
  const root = path.resolve(cwd, options.root ?? 'src')
  const [aliasPrefix, aliasTarget] = options.alias ?? ['@/', 'src/']
  const ignore = options.ignore ?? []
  const skipped = (p) => ignore.some((frag) => p.includes(frag))
  // A slice is closed to the OUTSIDE only. Code inside the same slice reaches its own
  // internals by path — that is what keeps a store↔service pair from closing a cycle
  // through a shared barrel. `<sliceRoot>/<layer>/<slice>` identifies the unit.
  const sliceRoot = path.resolve(cwd, options.sliceRoot ?? path.join(options.root ?? 'src', 'app'))
  // Folder names that GROUP independent members rather than naming one subject. Extend per
  // project; the defaults are the layer names and the plural role segments FSD prescribes.
  const groupingNames = new Set(
    options.groupingNames ?? [
      'modules', 'widgets', 'features', 'entities', 'shared', 'pkg',
      'elements', 'services', 'hooks', 'utils', 'stores', 'constants',
      'interfaces', 'models', 'api', 'components', 'views', 'assets',
      'providers', 'registries', 'validation', 'systems',
    ],
  )
  const sliceOf = (absolute) => {
    if (!absolute.startsWith(sliceRoot)) return null
    const parts = path.relative(sliceRoot, absolute).split(path.sep)
    return parts.length >= 2 ? parts.slice(0, 2).join('/') : null
  }

  const files = walk(root).filter((f) => !skipped(f))
  const barrels = files.filter((f) => /[\\/]index\.tsx?$/.test(f))

  // A folder is either a UNIT (a named thing: a slice, an element, an api entity) or a
  // GROUPING folder (a layer, or a plural role folder whose members are independent of one
  // another). A unit publishes a barrel and MAY re-export its own internals through it —
  // that is the only legal way to expose one. A grouping folder must not publish a barrel
  // at all: it would become one module with an edge per member, so importing any symbol
  // pulls them all, and bundler chunk grouping means tree shaking does not undo it.
  const grouping = []

  for (const barrel of barrels) {
    const dir = path.dirname(barrel)
    if (!groupingNames.has(path.basename(dir))) continue
    grouping.push({ file: path.relative(cwd, barrel), specifier: '(grouping folder must not publish a barrel)' })
  }

  // Bypass: an import landing inside a foldered unit that publishes a barrel.
  const barrelDirs = new Set(barrels.map((b) => path.dirname(b)))
  const bypass = []

  for (const file of files) {
    const source = readFileSync(file, 'utf8')
    SPECIFIER.lastIndex = 0

    let match
    while ((match = SPECIFIER.exec(source))) {
      const specifier = match[3]
      let target = null
      if (specifier.startsWith(aliasPrefix)) target = path.join(cwd, aliasTarget, specifier.slice(aliasPrefix.length))
      else if (specifier.startsWith('.')) target = path.resolve(path.dirname(file), specifier)
      else continue
      if (!target.startsWith(root) || skipped(target)) continue

      // Walk up from the target looking for a barrelled folder the importer is
      // not itself inside. The nearest one wins: reaching two levels deep is the
      // same violation as reaching one.
      let dir = path.dirname(target)
      while (dir.startsWith(root)) {
        const sameSlice = sliceOf(file) !== null && sliceOf(file) === sliceOf(target)
        if (barrelDirs.has(dir) && !file.startsWith(dir + path.sep) && !sameSlice) {
          bypass.push({ file: path.relative(cwd, file), specifier, boundary: path.relative(cwd, dir) })
          break
        }
        const parent = path.dirname(dir)
        if (parent === dir) break
        dir = parent
      }
    }
  }

  const format = (list) =>
    list.map((e) => `  ${e.file}  ->  ${e.specifier}${e.boundary ? `   (boundary: ${e.boundary})` : ''}`).join('\n')
  return { grouping, bypass, format }
}

// CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2)
  const flag = (name, fallback) => {
    const i = args.indexOf(`--${name}`)
    return i === -1 ? fallback : args[i + 1]
  }

  const { grouping, bypass, format } = checkBarrels({
    cwd: process.cwd(),
    root: flag('root', 'src'),
    alias: (flag('alias', '@/=src/') || '').split('='),
    ignore: (flag('ignore', '') || '').split(',').filter(Boolean),
  })

  let failed = false


  if (grouping.length) {
    failed = true
    console.error(
      `\n✖ ${grouping.length} grouping barrel(s) — an \`index.ts\` on a folder that groups\n` +
        `  independent members rather than naming one subject. Delete it and let consumers import\n` +
        `  the member they want; a UNIT folder keeps its barrel and publishes internals through it.\n\n` +
        format(grouping),
    )
  }
  if (bypass.length) {
    failed = true
    // Aggregate by boundary: a barrel with many bypasses is itself the finding.
    // Consumers dodging a barrel en masse means the barrel is a grouping barrel,
    // not that hundreds of call sites are individually wrong.
    const byBoundary = new Map()
    for (const entry of bypass) byBoundary.set(entry.boundary, (byBoundary.get(entry.boundary) ?? 0) + 1)
    const ranked = [...byBoundary.entries()].sort((a, b) => b[1] - a[1])
    console.error(
      `\n✖ ${bypass.length} barrel bypass(es) across ${ranked.length} boundaries.\n` +
        `  A high count against one boundary is the diagnosis: that folder groups independent\n` +
        `  units, so delete its barrel. A low count is the opposite — route those imports\n` +
        `  through the existing barrel.\n\n` +
        ranked.map(([dir, n]) => `  ${String(n).padStart(4)}  ${dir}`).join('\n'),
    )
  }
  if (!failed) console.log('✓ barrel rule holds')
  process.exit(failed ? 1 : 0)
}
