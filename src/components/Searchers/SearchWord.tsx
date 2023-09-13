import { useState } from 'react';
import { IWord, IRequest } from '../../Interfaces/interfaces';
import requester from '../../helpers/Requester';
import { Autocomplete, TextField } from "@mui/material";
import { Dispatch, AnyAction } from 'redux';
import { useDispatch } from 'react-redux';
import { EAlert } from "../../Interfaces/enums";
import { enqueueAlert } from "../../redux/slices/appSlice";

const SearchWord = ({onSelectItem}:{onSelectItem:any}) => {
  const [searchItem, setSearchItem] = useState<IWord[]>([]);
  const [storeResponseSearchItem, setStoreResponseSearchItem] = useState<IWord[]>([]);
  const [itemSelected, setItemSelected] = useState<boolean>(false);
  const [userInput, setUserInput] = useState<string>("");

  const dispatch:Dispatch<AnyAction> = useDispatch();

  /*Request to API*/
  const searchItemByName = async(string_to_search: string):Promise<IWord[]> => {
    try {
      const response:IRequest<IWord[]> = await requester({
        url: `/words/search/${string_to_search}`,
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
      console.log(storeResponseSearchItem);
      if(storeResponseSearchItem[0] !== undefined) {
        const re = new RegExp(`^${stringToSearch.toLowerCase()}[a-zA-Z0-9\ \d\D]*`);
      
        const itemToShow:IWord[] = storeResponseSearchItem.filter(item => {
            const name = `${item.word}`;
            if(
                re.test(name.toLocaleLowerCase()) === true
              ) 
              return item;
          })
        
        if(itemToShow !== undefined) setSearchItem(itemToShow);
        else setSearchItem([]);  
      } else {
        if(itemSelected === false) {
          const responseData:IWord[] = await searchItemByName(stringToSearch);
          setStoreResponseSearchItem(responseData);
          setSearchItem(responseData);
        }
      }
    }
  }

  const selectOption = async (event: any, word: string|null):Promise<void> => {
    const findDataItem:undefined|IWord = storeResponseSearchItem
      .find(item => item.word === word);
    
    if(findDataItem !== undefined) {
      //Return search results
      //User selected an item
      setItemSelected(true);

      // Reset states
      setSearchItem([]);
      setStoreResponseSearchItem([]);
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
          options={ searchItem.map((item => item.word)) }
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Search word" />}
          />
    </>

  );
}

export default SearchWord;