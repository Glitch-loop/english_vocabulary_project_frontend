import { IRequest } from "../Interfaces/interfaces"

export const failedResponse:IRequest<undefined> = {
  success: false,
  response: {
    statusCode: 500
  }
}