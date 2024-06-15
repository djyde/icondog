import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { IconifyInfo, IconifyJSON } from '@iconify/types'
import { Button, Spinner } from "@nextui-org/react"
const ICONIFY_VERSION = '2.2.219'

export function RemoteIconSetPage() {
  const iconSetsQuery = useQuery({
    queryKey: ['remote-icon-sets'],
    queryFn: async () => {
      const collections = await axios.get<Record<string, IconifyInfo>>(`https://unpkg.com/@iconify/json@${ICONIFY_VERSION}/collections.json`)

      return Object.entries(collections.data).map(([prefix, info]) => {
        return {
          prefix,
          ...info
        }
      }).sort((a, b) => a.name.localeCompare(b.name))
    },
    staleTime: Infinity
  })

  useQuery({
    queryKey: ['local-icon-sets'],
    queryFn: async () => {
      const collections = await window.api.getLocalIconSets() as IconifyJSON[]
      return collections
    }
  })

  const collections = iconSetsQuery.data

  return (
    <div className="h-dvh overflow-scroll p-5">
      {iconSetsQuery.isPending && <>
        <div>
          <Spinner />
        </div>
      </>}

      <div className="">
        <div className="">
          <div className="grid grid-cols-3 gap-5">
            {collections?.map(collection => {
              return (
                <IconSetCard key={collection.prefix} iconifyInfo={collection} />
              )
            })}
          </div>

        </div>
      </div>
    </div>
  )
}

function IconSetCard(props: {
  iconifyInfo: IconifyInfo & {
    prefix: string
  }
}) {

  const queryClient = useQueryClient()

  const localIconSetQuery = useQuery({
    queryKey: ['local-icon-set', props.iconifyInfo.prefix],
    queryFn: async () => {
      return await window.api.getLocalIconSets(props.iconifyInfo.prefix) as IconifyJSON | null
    }
  })

  const downloadIconSetMutation = useMutation({
    mutationFn: async (prefix: string) => {
      await window.api.downloadIconSet(prefix)
      localIconSetQuery.refetch()
      queryClient.refetchQueries({
        queryKey: ['local-icon-sets']
      })
    }
  })

  const hasInstalled = !!localIconSetQuery.data

  const collection = props.iconifyInfo

  return (
    <div className="border rounded-lg">
      <div className="w-full">
        <div className="flex justify-start gap-3 px-3 pt-3 rounded-t-lg">
          {collection.samples?.map(label => {
            return (
              <img className="w-8" src={`https://api.iconify.design/${collection.prefix}/${label}.svg`} key={label} alt="" />
            )
          })}
        </div>
      </div>
      <div className="p-3 space-y-1">
        <div className="font-medium">
          {collection.name}
        </div>
        <div className="text-xs text-default-400 space-y-1">
          <div>
            {collection.author.name}
          </div>
          <div>
            {collection.license.title}
          </div>
        </div>
        <div className="flex justify-end gap-3">
          {hasInstalled && <Button size="sm" color="default" variant="flat">Delete</Button>}
          {!hasInstalled && <Button startContent={<>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 2v8m4-4l-4 4l-4-4" /><rect width="20" height="8" x="2" y="14" rx="2" /><path d="M6 18h.01M10 18h.01" /></g></svg>          </>} size="sm" isLoading={downloadIconSetMutation.isPending} color="primary" variant="flat" onClick={() => {
            downloadIconSetMutation.mutate(collection.prefix)
          }}>Install</Button>
          }
        </div>
      </div>
    </div>
  )
}