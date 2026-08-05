import { queryOptions } from '@tanstack/react-query'

import { <api>QueryApi } from '@/app/entities/api/<api>/<api>.api'
import { I<Api>Params } from '@/app/entities/models/<api>.model'
import { E<Entity>Key } from '@/app/entities/models/<entity>.model'

// <api> query options
export const <api>QueryOptions = (queryParams: I<Api>Params) => {
  return queryOptions({
    queryKey: [E<Entity>Key.QUERY_<API>, queryParams.id],
    queryFn: (params) => <api>QueryApi(params, queryParams),
    enabled: Boolean(queryParams.id),
  })
}
