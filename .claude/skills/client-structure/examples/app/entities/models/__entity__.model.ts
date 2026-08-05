// endpoints
export enum E<Entity>Api {
  LIST = '/<entity>',
  BY_ID = '/<entity>/:id',
}

// TanStack query keys — this entity owns its own, there is no project-wide enum
export enum E<Entity>Key {
  QUERY_<API> = 'query-<api>',
}

// request body
export interface I<Api>Body {
  <field>: string
  <count>?: number
}

// query params
export interface I<Api>Params {
  id: string
}

// response
export interface I<Api>Res {
  id: string
  <field>: string
  createdAt: string
}
