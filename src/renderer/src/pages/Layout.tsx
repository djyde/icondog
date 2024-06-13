import { Accordion, AccordionItem, ScrollShadow, Spinner, Tab, Tabs, cn } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link, Outlet, useNavigation } from "react-router-dom";

export function Layout() {
  const [selectedPrefix, setSelectedPrefix] = useState<string | null>(null)

  const remoteIconSetQuery = useQuery({
    queryKey: ['remote-icon-set'],
    queryFn: async () => {
      const iconSets = await window.api.getIconSets()
      return iconSets
    }
  })

  return (
    <div className="h-dvh flex">

      <>
        <nav className="border-r h-full min-w-[300px] bg-default-50 relative overflow-scroll">
          <div className="movable sticky top-0 left-0 right-0 h-[40px] bg-default-50">
          </div>

          <div className="">
            <Accordion defaultExpandedKeys={['iconsets']} showDivider={false} isCompact selectionMode="multiple" disableAnimation>
              <AccordionItem key="iconsets" indicator={remoteIconSetQuery.isPending ? <>
                <Spinner size="sm" />
              </> : undefined} title={<>
                <h3 className="text-xs font-bold text-default-500 mx-3">
                  Icon Sets
                </h3>
              </>} className="text-sm">
                {remoteIconSetQuery.data?.map(iconSet => {
                  return (
                    <Link onClick={_ => {
                      setSelectedPrefix(iconSet.prefix)
                    }} to={`/iconset/${iconSet.prefix}`} key={iconSet.prefix} className={cn("block py-2 cursor-default hover:bg-primary-50 rounded-lg px-3", {
                      'bg-primary-50': selectedPrefix === iconSet.prefix
                    })} >
                      {iconSet.name}
                    </Link>
                  )
                })}
              </AccordionItem>
            </Accordion>

          </div>

        </nav>
      </>


      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  )
}