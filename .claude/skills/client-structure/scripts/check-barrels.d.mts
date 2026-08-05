// Types for the barrel checker, so a TypeScript test can consume it.
export interface IBarrelFinding {
  file: string
  specifier: string
  boundary?: string
}
export interface ICheckBarrelsOptions {
  cwd: string
  root?: string
  alias?: [string, string]
  ignore?: string[]
  sliceRoot?: string
  groupingNames?: string[]
}
export interface ICheckBarrelsResult {
  grouping: IBarrelFinding[]
  bypass: IBarrelFinding[]
  format: (list: IBarrelFinding[]) => string
}
export declare const checkBarrels: (options: ICheckBarrelsOptions) => ICheckBarrelsResult
