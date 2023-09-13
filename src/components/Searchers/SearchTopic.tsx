import { useState } from 'react';
import { ITopic, IRequest } from '../../Interfaces/interfaces';
import requester from '../../helpers/Requester';
import { Autocomplete, TextField } from "@mui/material";
import { Dispatch, AnyAction } from 'redux';
import { useDispatch } from 'react-redux';
import { EAlert } from "../../Interfaces/enums";
import { enqueueAlert } from "../../redux/slices/appSlice";

const SearchTopic = (
  { onSelectItem}:
  { onSelectItem:any}) => {
  const [searchItem, setSearchItem] = useState<ITopic[]>([]);
  const [storeResponseSearchItem, setStoreResponseSearchItem] = useState<ITopic[]>([]);
  const [itemSelected, setItemSelected] = useState<boolean>(false);
  const [userInput, setUserInput] = useState<string>();

  const dispatch:Dispatch<AnyAction> = useDispatch();

  /*Request to API*/
  const searchItemByName = async(string_to_search: string):Promise<ITopic[]> => {
    try {
      const response:IRequest<ITopic[]> = await requester({
        url: `/topics/search/${string_to_search}`,
        method: 'GET'
      })
      if(response.response !== undefined) {
        if(response.response.response !== undefined) {      
          return response.response.response;
        } 
      }
        
      dispatch(enqueueAlert({alertData: {
        alertType: EAlert.warning, 
        message: "Ha habido un problema al intentar hacer la busqueda, intente nuevamente"}}));  
      return [];
    } catch (error) {
      dispatch(enqueueAlert({alertData: {
        alertType: EAlert.error, 
        message: "Hubo un error al intentar conectarse al servidor"}}));
      return [];
    }
  }

  const onSearchType = async(event: any, stringToSearch: string|null) => {
    if(stringToSearch === "" || stringToSearch === null) {
      setUserInput("");
      setStoreResponseSearchItem([]);
      setSearchItem([]);
      setItemSelected(false); //User erase the item selected
    } else {
      setUserInput(stringToSearch);
      if(storeResponseSearchItem[0] !== undefined) {
        const re = new RegExp(`^${stringToSearch.toLowerCase()}[a-zA-Z0-9\ \d\D]*`);
      
        const itemToShow:ITopic[] = storeResponseSearchItem.filter(item => {
            const name = `${item.topic_name}`;
            if(
                re.test(name.toLocaleLowerCase()) === true
              ) 
              return item;
          })
        
        if(itemToShow !== undefined) setSearchItem(itemToShow);
        else setSearchItem([]);  
      } else {
        if(itemSelected === false) {
          const responseData:ITopic[] = await searchItemByName(stringToSearch);
          setStoreResponseSearchItem(responseData);
          setSearchItem(responseData);
        }
      }
    }
  }

  const selectOption = async (event: any, optionSelected: string|null):Promise<void> => {
    const findDataItem:undefined|ITopic = storeResponseSearchItem
      .find(item => item.topic_name === optionSelected);
    
    if(optionSelected !== null) {
      setUserInput(optionSelected);
    }

    if(findDataItem !== undefined) {
      //User selected an item
      setItemSelected(true);

      // Reset states
      setSearchItem([]);
      setStoreResponseSearchItem([]);

      //Return search results      
      onSelectItem(findDataItem);

    }
  }

  return (
    <>
      <Autocomplete
          disablePortal
          id="input-strategy"
          onInputChange={(event: any, newInputValue: string | null) => 
            { onSearchType(event, newInputValue) }}
          onChange={(event: any, newValue: string | null) => 
            selectOption(event, newValue) }
          value={
            userInput
          }
          options={ searchItem.map((item => item.topic_name)) }
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Search topic" />}
          />
    </>

  );
}

export default SearchTopic;