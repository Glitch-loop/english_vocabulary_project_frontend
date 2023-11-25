import { IRequest } from "../Interfaces/interfaces"

export const failedResponse:IRequest<any> = {
  success: false,
  response: {
    statusCode: 500
  }
}