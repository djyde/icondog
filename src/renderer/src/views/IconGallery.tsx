import { ENDPOINT } from "@renderer/constants"
import { iconify } from "@renderer/utils"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useState } from "react"
import cn from 'classnames'

import OpenAI from 'openai'
import { useParams } from "react-router-dom"

const openai = new OpenAI({
  apiKey: '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',
  dangerouslyAllowBrowser: true
});


export function IconGallery() {
  const params = useParams()
  const iconSetPrefix = params.prefix as string

  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)

  const [filterWords, setFilterWords] = useState<string[]>([])

  const iconsQuery = useQuery({
    queryKey: ['icons', iconSetPrefix],
    queryFn: async () => {
      const response = await iconify.get<{
        uncategorized: string[],
        total: number
      }>('/collection', {
        params: {
          prefix: iconSetPrefix
        }
      })
      return response.data
    }
  })

  const icons = filterWords.length === 0 ? iconsQuery.data?.uncategorized : iconsQuery.data?.uncategorized.filter(icon => {
    return filterWords.includes(icon)
  }) 

  const searchMutation = useMutation({
    mutationFn: async (body: {
      description: string
    }) => {
      const names = iconsQuery.data?.uncategorized.join(',')
      const prompt = `I have some icons and below is their icon names separated by comma. Please help me find the most suitable one according to my description. Answer with the icon names separated by comma. Only answer with the icon names i provided.

      Names:
      ---
      ${names}
      ---

      Description:
      ---
      ${body.description}
      ---
      `

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            "role": "user",
            "content": [
              {
                "type": "text",
                "text": prompt
              }
            ]
          },
        ],
        temperature: 1,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      const labels = response.choices[0].message.content?.split(',')
      setFilterWords(labels!)
    }
  })

  return (
    <div className="flex">
      <div className="flex-1 flex flex-col overflow-scroll  h-dvh ">
        <div className="flex justify-center p-6 bg-base-200">
          <SearchBar searching={searchMutation.isPending} onSearch={content => {
            searchMutation.mutate({
              description: content
            })
          }} />
        </div>
        <div className="grid grid-cols-8 gap-3 p-3 overflow-scrollp-3 bg-base-200 flex-1">
          {icons?.map(icon => {
            return (
              <div onClick={_ => {
                setSelectedIcon(icon)
              }} key={icon} className={
                cn("flex justify-center flex-col items-center border rounded-lg aspect-square bg-base-100 hover:border-black", {
                  'border-black': selectedIcon === icon,
                })
              }>
                <img className="w-8" src={`${ENDPOINT}/${iconSetPrefix}/${icon}.svg`} alt="" />
              </div>
            )
          })}
        </div>

      </div>

      <div className="w-[300px] relative border-l">
        <div className="absolute right-0 left-0">
          {selectedIcon && <IconPanel iconSetPrefix={iconSetPrefix} name={selectedIcon} />}
        </div>
      </div>

    </div>
  )
}

function IconPanel(props: {
  iconSetPrefix: string,
  name: string
}) {

  const iconQuery = useQuery({
    queryKey: ['icon', props.iconSetPrefix, props.name],
    queryFn: async () => {
      const result = await iconify.get(`/${props.iconSetPrefix}/${props.name}.svg`)
      console.log(result.data)
      return result.data
    }
  })

  return (
    <div className="w-full">
      <div className="p-3 flex flex-col gap-3">
        <div className="flex gap-2">
          <input value={props.name} className="input input-bordered input-sm w-full cursor-default"></input>
          <button className="btn btn-sm">
            Copy
          </button>
        </div>
        <div>
          <textarea className="textarea textarea-sm textarea-bordered w-full leading-tight h-24" value={iconQuery.data}></textarea>
          <button className="btn btn-sm w-full">
            Copy SVG
          </button>
        </div>
      </div>
    </div>
  )
}

function SearchBar(props: {
  onSearch(content: string): void,
  searching: boolean
}) {
  return (
    <div>
      <form onSubmit={e => {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        const content = formData.get("content") as string
        props.onSearch(content)
      }}>
        <input name="content" className="input input-bordered rounded-full w-[512px]" placeholder="What do you want to find?">
        </input>
      </form>
      <div>
        {props.searching && <div>
          AI is helping you...
          </div>}
      </div>
    </div>
  )
}