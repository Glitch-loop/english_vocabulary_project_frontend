import { Input } from "@mui/material";

const SelectionGraphsElements = ({
    arrayItems,
    onSelectItem
  } : {
    arrayItems: any[]
    onSelectItem: any
  }
  ) => {

  return (
    <div className="flex flex-row flex-wrap max-w-7xl justify-around">
        {
          arrayItems.map(item => {
            return (
              <div 
                key={item.id} 
                className='my-2 hover:opacity-70 hover:cursor-pointer'
                onClick={() => {
                  onSelectItem(item.src !== undefined ? item.src.tiny : item.images.fixed_height.url)}}
              >
                  <img src={
                    item.src !== undefined ? item.src.tiny : item.images.fixed_height.url
                    } alt="Image of the meaning" />
              </div>
            )
          })
        }
    </div>
  )
}

export default SelectionGraphsElements;