import { Image, Input, Textarea, cn } from "@nextui-org/react"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { VariableSizeList as List } from 'react-window';
import { FixedSizeGrid as Grid } from 'react-window';

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
          const gap = 12
          const boxSize = iconSize + gap * 4
          const gridColumns = Math.floor(width / boxSize)

          // get grid columns count based on width and box size and gap and centered it 
          const renderCell = (info: { columnIndex: number, rowIndex: number, style: React.CSSProperties }) => {
            const currentIcon = props.icons[info.rowIndex * gridColumns + info.columnIndex]

            if (!currentIcon) {
              return null
            }
            const element = React.createElement('svg', {
              // Mandatory attributes
              xmlns: 'http://www.w3.org/2000/svg',
              xmlnsXlink: 'http://www.w3.org/1999/xlink',
              // width, height, viewBox
              ...currentIcon?.svg.attributes,
              // innerHTML
              width: `${iconSize}px`,
              height: `${iconSize}px`,
              dangerouslySetInnerHTML: {
                __html: currentIcon?.svg.body,
              },
            })

            return (
              <div style={{
                ...info.style,
                width: boxSize,
                height: boxSize,
              }}>
                <div className={cn("flex justify-center items-center border rounded-lg hover:border-black", {

                })} style={{
                  width: boxSize - gap,
                  height: boxSize - gap,
                  margin: `${gap * 1.25}px`,
                }} onClick={_ => {
                  props.onSelect(currentIcon)
                }}>
                  {element}
                </div>
              </div>
            )
          }

          return (
            <Grid
              columnCount={gridColumns}
              columnWidth={boxSize}
              height={height}
              rowCount={Math.ceil(props.icons.length / gridColumns)}
              rowHeight={boxSize}
              width={width}
            >
              {renderCell}
            </Grid>
          )
        }}
      </AutoSizer>
    </div>
  )
}