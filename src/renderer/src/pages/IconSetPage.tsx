import { Image, Input, Textarea, cn } from "@nextui-org/react"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { FixedSizeGrid as Grid } from 'react-window';
import { FixedSizeList as List } from 'react-window';


import AutoSizer from "react-virtualized-auto-sizer";
import React from "react";

export function IconSetPage() {
  const params = useParams()
  const iconSetPrefix = params.prefix as string

  const [selectedIcon, setSelectedIcon] = React.useState<Awaited<ReturnType<typeof window.api.getIconsByPrefix>>[0] | null>(null)

  const iconsQuery = useQuery({
    queryKey: ['icons', iconSetPrefix],
    queryFn: async () => {
      const icons = await window.api.getIconsByPrefix(iconSetPrefix)
      return icons
    }
  })

  const [searchKeyword, setSearchKeyword] = React.useState('')

  const filteredIcons = searchKeyword ? iconsQuery.data?.filter(icon => {
    return icon.name.toLowerCase().includes(searchKeyword.toLowerCase())
  }) : iconsQuery.data

  return (
    <div className="flex flex-col h-dvh" key={iconSetPrefix}>
      <div className="p-3 border-b relative">
        <div className=" absolute inset-0">

        </div>

        <div className="z-10">
          <form onSubmit={e => {
            e.preventDefault()
            // const formData = new FormData(e.target as HTMLFormElement)
            // const keyword = formData.get('keyword') as string
            // setSearchKeyword(keyword)
          }}>
            <Input defaultValue={searchKeyword} name="keyword" onChange={e => {
              setSearchKeyword(e.target.value)
            }} placeholder={`Search in ${iconSetPrefix} with ${filteredIcons?.length} icons`} className="w-full" variant="bordered" classNames={{
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
            <IconList onSelect={icon => {
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
  onSelect: (icon: Awaited<ReturnType<typeof window.api.getIconsByPrefix>>[0]) => void
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
                    }} key={icon.name} className="hover:border hover:border-default-300 border-default flex justify-center items-center w-full h-full rounded-lg">
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