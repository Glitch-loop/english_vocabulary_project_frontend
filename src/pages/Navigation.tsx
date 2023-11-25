import { Breadcrumbs } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";



const sideBar:any = [
  { label: 'Word manager', path: 'wordManager' },
  { label: 'Exercises', path: 'exercises' }
]

const Navigation = () => {
  const navigate = useNavigate()
  const currentPath = useLocation().pathname.split('/')[2];
  
  const handleRedirect = (path: string): void => { navigate(path) } 

  return (
    <div className="mt-6 flex flex-row justify-center">
      <Breadcrumbs>
        {
          sideBar.map((element:any) => {
            return (
              <button 
                key={element.label} 
                onClick={()=>{handleRedirect(element.path)}}>
                  <span className="hover:underline">
                    {element.label}
                  </span>
              </button>
            )
          })
        }
      </Breadcrumbs>
    </div>
  )
}

export default Navigation;