export const itemsQueryKeys = {
  all: ['items'] as const,
  detail: (id: string) => ['items', id] as const,
}
