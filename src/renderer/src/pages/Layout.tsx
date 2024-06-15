import { Accordion, AccordionItem, Button, Modal, ModalBody, ModalContent, ModalHeader, ScrollShadow, Spinner, Tab, Tabs, cn } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link, Outlet, useLocation, useNavigation } from "react-router-dom";
import { RemoteIconSetPage } from "./RemoteIconSet";
import { IconifyJSON } from "@iconify/types";

export function Layout() {
  const [selectedPrefix, setSelectedPrefix] = useState<string | null>(null)
  const location = useLocation()

  const localIconSetsQuery = useQuery({
    queryKey: ['local-icon-sets'],
    queryFn: async () => {
      const iconSets = await window.api.getLocalIconSets() as IconifyJSON[]
      return iconSets
    }
  })

  return (
    <div className="h-dvh flex">
      <>
        <Modal scrollBehavior="inside" size="4xl">
          <ModalContent>
            {onClose => {
              return (
                <>
                  <ModalHeader>
                    Add icon set
                  </ModalHeader>
                  <ModalBody>
                    <div>
                      <RemoteIconSetPage />
                    </div>
                  </ModalBody>
                </>
              )
            }}
          </ModalContent>
        </Modal>
        <nav className="border-r h-full min-w-[300px] bg-default-50 relative overflow-scroll">
          <div className="movable sticky top-0 left-0 right-0 h-[40px] bg-default-50">
          </div>

          <div className="">

            <div className="flex justify-between items-center ml-5 mr-3 text-primary">
              <h3 className="uppercase text-xs font-bold text-primary flex items-center gap-1">
               
                <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24"><path fill="currentColor" d="M11 21.725v-9.15L3 7.95v8.025q0 .55.263 1T4 17.7zm2 0l7-4.025q.475-.275.738-.725t.262-1V7.95l-8 4.625zm3.975-13.75l2.95-1.725L13 2.275Q12.525 2 12 2t-1 .275L9.025 3.4zM12 10.85l2.975-1.7l-7.925-4.6l-3 1.725z" /></svg>
                Icon Sets
              </h3>

              <div>
                <Button as={Link} to="/remote-iconsets" size="sm" isIconOnly className="rounded-full cursor-default" variant="light" color="primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
                    <path fill="currentColor" fillRule="evenodd" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10m.75-13a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25z" clipRule="evenodd"></path>
                  </svg>
                </Button>
              </div>
            </div>

            <div className="px-2 flex flex-col text-sm">
              {localIconSetsQuery.data?.map(iconSet => {
                return (
                  <Link key={iconSet.prefix} to={`/iconset/${iconSet.prefix}`} className={cn("hover:bg-primary/20 px-3 py-1 rounded-lg cursor-default", {
                    "bg-primary/20": location.pathname === `/iconset/${iconSet.prefix}`
                  })}>
                    {iconSet.info?.name}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="mt-3">
            <Link to="/settings" className="mx-5 flex items-center gap-1 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37c1 .608 2.296.07 2.572-1.065" /><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0-6 0" /></g></svg>
              Settings
            </Link>
          </div>
        </nav>
      </>

      <div className="flex-1">
        <Outlet />
      </div>
    </div >
  )
}