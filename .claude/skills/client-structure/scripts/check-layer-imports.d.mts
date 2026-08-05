// Types for the layer-dependency checker, so a TypeScript test can consume it.
export interface ILayerEdge {
  file: string
  specifier: string
  from: string
  to: string
}
export interface ICheckLayerImportsOptions {
  cwd: string
  root?: string
  alias?: [string, string]
  layers?: string[]
  sliced?: string[]
}
export interface ICheckLayerImportsResult {
  sibling: ILayerEdge[]
  upward: ILayerEdge[]
  format: (list: ILayerEdge[]) => string
}
export declare const checkLayerImports: (options: ICheckLayerImportsOptions) => ICheckLayerImportsResult
