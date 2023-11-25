import { IRequest } from "../Interfaces/interfaces";
import ApiRequester from "../helpers/ApiRequester";
import { failedResponse } from "../utils/genericResponses";
import { createClient } from "pexels";
import { Photo } from "pexels/dist/types";

const getImages = async (word:string):Promise<IRequest<Photo[]>> => {
    const pexelsClient = createClient(import.meta.env.VITE_PEXEL_KEY);
    return pexelsClient.photos.search({query: word, per_page: 10})
    .then(data => 
    { 
      const response:IRequest<Photo[]> = {
        success: true,
        response: {
          statusCode: 200,
          response: data.photos
        }
      }
      return response;
    })
    .catch(error => {return failedResponse}) 
}

export { 
  getImages
};