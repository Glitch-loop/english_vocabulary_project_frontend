import { IGif, IRequest } from "../Interfaces/interfaces";
import ApiRequester from "../helpers/ApiRequester";
import { failedResponse } from "../utils/genericResponses";

const baseURL = "https://api.giphy.com/v1"

const getGifs = (term:string):Promise<IRequest<IGif[]>> => {
 return ApiRequester({
  url: `/gifs/search?api_key=${import.meta.env.VITE_GIPHY_KEY}&q=${term}&limit=10`, 
  baseURL:baseURL, 
  method: "GET"})
  .then(data => 
    { 
      const response:IRequest<IGif[]> = {
        success: true,
        response: {
          statusCode: 200,
          response: data.data
        }
      }
      return response;
    })
  .catch(error => {return failedResponse}) 
}

export {
  getGifs
}