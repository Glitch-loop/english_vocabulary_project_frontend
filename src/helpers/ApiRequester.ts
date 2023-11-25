import Axios, { AxiosError, AxiosResponse } from "axios";

const ApiRequester = async <T>(
  {url, method = 'GET', baseURL, data = {}, params = {}, extraHeaders = {}}: 
  {
    url:string, 
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'FETCH' | 'PATCH', 
    baseURL: string,
    data?: unknown, 
    params?: unknown, 
    extraHeaders?: any
  }) => {
    return Axios({
      headers: {...extraHeaders},
      baseURL: baseURL,
      url,
      method,
      data,
      params
    })
    .then((res: AxiosResponse) => {
      return res.data
    })
    .catch((err: AxiosError) => {
      return err.response?.data
    })
  }

  export default ApiRequester;
  