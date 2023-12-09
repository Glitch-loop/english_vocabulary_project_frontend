import { useState, useEffect } from 'react';
import { IWord_class, IRequest } from '../../Interfaces/interfaces';
import requester from '../../helpers/Requester';
import { Autocomplete, TextField } from "@mui/material";
import { Dispatch, AnyAction } from 'redux';
import { useDispatch } from 'react-redux';
import { EAlert } from "../../Interfaces/enums";
import { enqueueAlert } from "../../redux/slices/appSlice";

const initialValueFunction = (initialValue:IWord_class|undefined):IWord_class[] => {
  if(initialValue !== undefined) {
    if(initialValue.id_word_class !== 0) {
      return [ initialValue ]
    }
  }
  
  return [];
}

const initialValueSelectedFunction = (initialValue:IWord_class|undefined):boolean => {
  if(initialValue !== undefined) {
    if(initialValue.id_word_class !== 0) {
      return true
    }
  }
  return false;
}
const SearchWordClasses = (
  { 
    onSelectItem,
    initialValue
  }:
  { 
    onSelectItem:any,
    initialValue:IWord_class
   }
) => {
  const [searchItem, setSearchItem] 
    = useState<IWord_class[]>(initialValueFunction(initialValue));
  const [storeResponseSearchItem, setStoreResponseSearchItem] 
    = useState<IWord_class[]>(initialValueFunction(initialValue));
  const [itemSelected, setItemSelected] 
    = useState<boolean>(initialValueSelectedFunction(initialValue));
  // const [userInput, setUserInput] = useState<string>("");

  const dispatch:Dispatch<AnyAction> = useDispatch();

  useEffect(() => {
    getAllWordClasses()
    .then((response) => {
      setSearchItem(response);
      setStoreResponseSearchItem(response);
    })

  }, []);

  /*Request to API*/
  const getAllWordClasses = async():Promise<IWord_class[]> => {
    try {
      const response:IRequest<IWord_class[]> = await requester({
        url: `/wordClasses`,
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
      
        const itemToShow:IWord_class[] = storeResponseSearchItem.filter(item => {
            const name = `${item.word_class}`;
            if(
                re.test(name.toLocaleLowerCase()) === true
              ) 
              return item;
          })
        
        if(itemToShow !== undefined) setSearchItem(itemToShow);
        else setSearchItem([]);  
      } 
      else {
        if(itemSelected === false) {
          const responseData:IWord_class[] = await getAllWordClasses();
          setStoreResponseSearchItem(responseData);
          setSearchItem(responseData);
        }
      }
    }
  }

  const selectOption = async (event: any, optionSelected: string|null):Promise<void> => {

    const findDataItem:undefined|IWord_class = storeResponseSearchItem
      .find(item => `${item.id_word_class} - ${item.word_class.toLowerCase()}` === optionSelected?.toLocaleLowerCase());
    
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
            { selectOption(event, newValue) }}
          value={
            initialValue.word_class.length > 0 ?
              initialValue.word_class[0].toUpperCase() + initialValue.word_class.slice(1):
              initialValue.word_class            
          }
          options={ searchItem.map((item => 
            `${item.id_word_class} - ${item.word_class[0].toUpperCase() + item.word_class.slice(1)}`
            )) }
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Search word class" />}
          />
    </>
  );
}

export default SearchWordClasses;