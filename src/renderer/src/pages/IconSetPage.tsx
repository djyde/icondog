import { Input, Spinner, Textarea, cn } from "@nextui-org/react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { FixedSizeList as List } from 'react-window';


import AutoSizer from "react-virtualized-auto-sizer";
import React, { useEffect } from "react";

export function IconSetPage() {
  const params = useParams()
  const iconSetPrefix = params.prefix as string

  // can seperated by comma
  const [searchKeyword, setSearchKeyword] = React.useState('')

  const [selectedIcon, setSelectedIcon] = React.useState<Awaited<ReturnType<typeof window.api.getIconsByPrefix>>[0] | undefined>(undefined)

  useEffect(() => {
    setSelectedIcon(undefined)
    setSearchKeyword('')
  }, [iconSetPrefix])

  const searchMutation = useMutation({
    mutationFn: async (body: {
      description: string
    }) => {
      const labels = await window.api.getLabelsByDescription(body.description)
      setSearchKeyword(labels || "")
    }
  })

  const iconsQuery = useQuery({
    queryKey: ['icons', iconSetPrefix],
    queryFn: async () => {
      const icons = await window.api.getIconsByPrefix(iconSetPrefix)
      return icons
    }
  })

  const filteredIcons = searchKeyword ? iconsQuery.data?.filter(icon => {
    const keywords = searchKeyword.split(',').map(keyword => keyword.trim())
    return keywords.some(keyword => {
      return icon.name.includes(keyword)
    })
  }) : iconsQuery.data

  return (
    <div className="flex flex-col h-dvh" key={iconSetPrefix}>
      <div className="p-3 border-b relative">
        <div className=" absolute inset-0">

        </div>

        <div className="z-10">
          <form onSubmit={async e => {
            e.preventDefault()
            const formData = new FormData(e.target as HTMLFormElement)
            const keyword = formData.get('keyword') as string
            searchMutation.mutate({
              description: keyword
            })
          }}>
            <Input startContent={<>
              {searchMutation.isPending && <Spinner size="sm" />}
            </>}  name="keyword" onChange={e => {
              const keywords = e.target.value
              if (keywords.startsWith("#")) {
                setSearchKeyword("")
              } else {
                setSearchKeyword(e.target.value)
              }
            }} placeholder={`Search in ${iconSetPrefix} with ${filteredIcons?.length} icons. (Start with # to ask AI)`} className="w-full" variant="bordered" classNames={{
              inputWrapper: [
                "border-1",
                "shadow-none"
              ]
            }} />
          </form>
        </div>

      </div>

      <div className="flex flex-1 overflow-scroll">
        <div className="flex-1 overflow-scroll">
          {filteredIcons && <>
            <IconList selected={selectedIcon} onSelect={icon => {
              setSelectedIcon(icon)
            }} icons={filteredIcons} />
          </>}
        </div>

        <div className="w-[300px] border-l bg-default-50 p-3">
          {selectedIcon && <div className="space-y-4">
            <div>
              <Input label="icon name" value={selectedIcon.name} placeholder="icon name" />
            </div>
            <div>
              <Textarea label="SVG" spellCheck={false} className="font-mono text-base-300" value={selectedIcon.html} />
            </div>
          </div>}
        </div>
      </div>
    </div>
  )
}

function IconList(props: {
  icons: Awaited<ReturnType<typeof window.api.getIconsByPrefix>>,
  onSelect: (icon: Awaited<ReturnType<typeof window.api.getIconsByPrefix>>[0]) => void,
  selected?: Awaited<ReturnType<typeof window.api.getIconsByPrefix>>[0]
}) {

  return (
    <div className="overflow-scroll" style={{
      width: '100%',
      height: '100%',
    }}>
      <AutoSizer>
        {({ width, height }) => {
          const iconSize = 48
          const padding = 12
          const gap = 12
          const gridColumns = (() => {
            if (width < 200) {
              return 2
            } else if (width < 400) {
              return 3
            } else if (width < 600) {
              return 4
            } else if (width < 800) {
              return 5
            } else {
              return 8
            }
          })();

          const boxSize = width / gridColumns

          const renderListCell = (info: { index: number, style: React.CSSProperties }) => {
            const currentLineIcons = props.icons.slice(info.index * gridColumns, (info.index + 1) * gridColumns)
            return (
              <div className="flex justify-around" style={{
                padding: padding,
                ...info.style,
                gap: gap,
                // gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`
              }}>
                {currentLineIcons.map(icon => {
                  const element = React.createElement('svg', {
                    // Mandatory attributes
                    xmlns: 'http://www.w3.org/2000/svg',
                    xmlnsXlink: 'http://www.w3.org/1999/xlink',
                    // width, height, viewBox
                    ...icon?.svg.attributes,
                    // innerHTML
                    width: `${iconSize}px`,
                    height: `${iconSize}px`,
                    dangerouslySetInnerHTML: {
                      __html: icon?.svg.body,
                    },
                  })
                  return (
                    <div onClick={_ => {
                      props.onSelect(icon)
                    }} key={icon.name} className={cn("hover:outline hover:outline flex justify-center items-center w-full h-full rounded-lg", {
                      "outline": props.selected?.name === icon.name
                    })}>
                      <div className="">
                        {element}
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          }
          return (
            <List
              height={height}
              width={width}
              itemCount={props.icons.length / gridColumns}
              itemSize={boxSize}
            >
              {renderListCell}
            </List>
          )
        }}
      </AutoSizer>
    </div>
  )
}