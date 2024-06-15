import { Outlet } from "react-router-dom"

function App(): JSX.Element {

  
  return (
    <>
      <div className='h-dvh flex'>
        <nav className="h-full border-r w-[250px] overflow-scroll bg-base-300 shadow-inner-sm relative">
          <div className="h-[30px] absolute mb-12 bg-base-300 left-0 right-0">

          </div>
          <div className="flex flex-col gap-2 px-3 py-3">
        
          </div>
        </nav>
        <div className="w-full">
          <div>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  )
}

export default App
