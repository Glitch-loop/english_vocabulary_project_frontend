import { useState } from 'react';
import { ITopic, IRequest } from '../../Interfaces/interfaces';
import requester from '../../helpers/Requester';
import { Autocomplete, TextField } from "@mui/material";
import { Dispatch, AnyAction } from 'redux';
import { useDispatch } from 'react-redux';
import { EAlert } from "../../Interfaces/enums";
import { enqueueAlert } from "../../redux/slices/appSlice";


const initialValueFunction = (initialValue:ITopic|undefined):ITopic[] => {
  if(initialValue !== undefined) {
    if(initialValue.id_topic !== 0) {
      return [ initialValue ]
    }
  }
  
  return [];
}

const initialValueSelectedFunction = (initialValue:ITopic|undefined):boolean => {
  if(initialValue !== undefined) {
    if(initialValue.id_topic !== 0) {
      return true
    }
  }
  return false;
}


const SearchTopic = (
  { 
    onSelectItem,
    initialValue
  }:
  { 
    onSelectItem:any,
    initialValue:ITopic
   }) => {
  const [searchItem, setSearchItem] 
    = useState<ITopic[]>(initialValueFunction(initialValue));
  const [storeResponseSearchItem, setStoreResponseSearchItem] 
    = useState<ITopic[]>(initialValueFunction(initialValue));
  const [itemSelected, setItemSelected]
    = useState<boolean>(initialValueSelectedFunction(initialValue));

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
      setStoreResponseSearchItem([]);
      setSearchItem([]);
      setItemSelected(false); //User erase the item selected
    } else {
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
      .find(item => item.topic_name.toLowerCase() === optionSelected?.toLowerCase());
    
    if(findDataItem !== undefined) {
      //User selected an item
      setItemSelected(initialValueSelectedFunction(initialValue));

      // Reset states
      setSearchItem(initialValueFunction(initialValue));
      setStoreResponseSearchItem(initialValueFunction(initialValue));

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
            initialValue.topic_name.length > 0 ?
              initialValue.topic_name[0].toUpperCase() + initialValue.topic_name.slice(1):
              initialValue.topic_name
          }
          options={ searchItem.map((item => 
            item.topic_name[0].toUpperCase() + item.topic_name.slice(1))) }
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Search topic" />}
          />
    </>

  );
}

export default SearchTopic;