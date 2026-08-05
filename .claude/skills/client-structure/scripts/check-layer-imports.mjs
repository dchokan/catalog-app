#!/usr/bin/env node
// Layer dependency checker for a Feature-Sliced Design tree.
//
// Enforces the two rules nothing in a TypeScript toolchain can see:
//   1. imports flow DOWNWARD only across layers;
//   2. a slice never imports a SIBLING slice in the same layer.
// Both stay green under type-check, lint and build, so they regress silently.
//
// Specifiers are resolved to absolute paths before comparing, because an alias
// (`@/<layer>/<slice>`) and a relative path (`../../<slice>`) reach the same
// target — a grep for one spelling silently misses the other. Side-effect
// imports (`import '<slice>'`) count too: a registration barrel is still an edge.
//
// Zero dependencies. Two entry points:
//   CLI   node check-layer-imports.mjs [--root src/app] [--alias @/=src/] [--allow shared>entities=44]
//   API   import { checkLayerImports } from './check-layer-imports.mjs'

import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'

// Highest first. Override with --layers when a project names them differently
// (FSD's own `pages` is frequently renamed).
const DEFAULT_LAYERS = ['modules', 'widgets', 'features', 'entities', 'shared']

// Layers whose children are business slices, so a sibling import is a real
// violation. Layers that group by SEGMENT rather than by slice are excluded:
// their members are independent files, and the bottom layer has nowhere to lift
// a shared primitive to.
const DEFAULT_SLICED = ['modules', 'widgets', 'features']

const SPECIFIER = /(from\s*|import\(\s*|require\(\s*|(?:^|\n)\s*import\s+)(['"])([^'"\n]+)\2/g

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
 * @param {string} options.cwd            project root
 * @param {string} [options.root]         layer root, relative to cwd (default `src/app`)
 * @param {[string,string]} [options.alias] `['@/', 'src/']` — prefix and what it resolves to
 * @param {string[]} [options.layers]     layer names, highest first
 * @param {string[]} [options.sliced]     layers where sibling imports are violations
 * @returns {{ sibling: Array, upward: Array, format: (list:Array)=>string }}
 */
export const checkLayerImports = (options) => {
  const cwd = options.cwd
  const root = path.resolve(cwd, options.root ?? 'src/app')
  const [aliasPrefix, aliasTarget] = options.alias ?? ['@/', 'src/']
  const layers = options.layers ?? DEFAULT_LAYERS
  const sliced = options.sliced ?? DEFAULT_SLICED

  const layerOf = (absolute) => {
    const relative = path.relative(root, absolute)
    if (relative.startsWith('..')) return null
    const segment = relative.split(path.sep)[0]
    return layers.includes(segment) ? segment : null
  }
  // `<layer>/<slice>` — the unit the sibling rule is about.
  const sliceOf = (absolute) => path.relative(root, absolute).split(path.sep).slice(0, 2).join('/')

  const sibling = []
  const upward = []

  for (const file of walk(root)) {
    const from = layerOf(file)
    if (!from) continue

    const source = readFileSync(file, 'utf8')
    SPECIFIER.lastIndex = 0

    let match
    while ((match = SPECIFIER.exec(source))) {
      const specifier = match[3]

      let target = null
      if (specifier.startsWith(aliasPrefix)) target = path.join(cwd, aliasTarget, specifier.slice(aliasPrefix.length))
      else if (specifier.startsWith('.')) target = path.resolve(path.dirname(file), specifier)
      else continue

      const to = layerOf(target)
      if (!to) continue

      const edge = { file: path.relative(cwd, file), specifier, from, to }
      if (to === from) {
        if (sliced.includes(from) && sliceOf(target) !== sliceOf(file)) sibling.push(edge)
      } else if (layers.indexOf(to) < layers.indexOf(from)) {
        upward.push(edge)
      }
    }
  }

  const format = (list) => list.map((e) => `  ${e.from} → ${e.to}  ${e.file}  ->  ${e.specifier}`).join('\n')
  return { sibling, upward, format }
}

// CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2)
  const flag = (name, fallback) => {
    const i = args.indexOf(`--${name}`)
    return i === -1 ? fallback : args[i + 1]
  }
  // `--allow shared>entities=44` pins a known debt to a CEILING so it can only shrink.
  const allowances = new Map()
  for (let i = 0; i < args.length; i++) {
    if (args[i] !== '--allow') continue
    const [pair, max] = args[i + 1].split('=')
    allowances.set(pair, Number(max))
  }

  const { sibling, upward, format } = checkLayerImports({
    cwd: process.cwd(),
    root: flag('root', 'src/app'),
    alias: (flag('alias', '@/=src/') || '').split('='),
    layers: flag('layers', '')?.split(',').filter(Boolean).length ? flag('layers').split(',') : undefined,
    sliced: flag('sliced', '')?.split(',').filter(Boolean).length ? flag('sliced').split(',') : undefined,
  })

  let failed = false

  if (sibling.length) {
    failed = true
    console.error(
      `\n✖ ${sibling.length} sibling import(s) — a slice imported another slice in the SAME layer.\n` +
        `  Lift the shared part one layer DOWN, fold it into the consuming slice when it is a\n` +
        `  variant of it, or invert it through a slot the routing layer supplies.\n\n` +
        format(sibling),
    )
  }

  const counted = new Map()
  const hardUpward = []
  for (const edge of upward) {
    const key = `${edge.from}>${edge.to}`
    if (allowances.has(key)) counted.set(key, (counted.get(key) ?? 0) + 1)
    else hardUpward.push(edge)
  }

  if (hardUpward.length) {
    failed = true
    console.error(`\n✖ ${hardUpward.length} upward import(s) — imports must flow downward only.\n\n${format(hardUpward)}`)
  }
  for (const [key, max] of allowances) {
    const found = counted.get(key) ?? 0
    if (found > max) {
      failed = true
      console.error(`\n✖ ${key} is ${found}, above its pinned ceiling of ${max}. This debt may shrink, never grow.`)
    } else {
      console.log(`✓ ${key} ${found}/${max} (pinned debt)`)
    }
  }

  if (!failed) console.log('✓ layer dependency rule holds')
  process.exit(failed ? 1 : 0)
}
