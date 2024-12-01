// Auto-generated fetch functions
// Generated on 2024-12-01T12:41:58.888Z
import { interfaces } from "@dto/index";

import { notesFetch } from "./fetcher/notesFetch";


/**
 * Auto-generated function for ping
 */
// export async function ping(params: interfaces.PingRequestDto): Promise<interfaces.PingResponseDto> {
//     const response: interfaces.PingResponseDto = await notesFetch({
//         url: "/ping", 
//         method: "GET",
        
        
//     });
 
//     return response;
// }



/**
 * Auto-generated function for getBoard
 */
export async function getBoard(params: interfaces.GetBoardRequestDto): Promise<interfaces.GetBoardResponseDto> {
  const response: interfaces.GetBoardResponseDto = await notesFetch({
    url: "/board/{id}", 
    method: "GET",
    pathParams: params.pathParams,
        
  });
 
  return response;
}



/**
 * Auto-generated function for updateBoard
 */
export async function updateBoard(params: interfaces.UpdateBoardRequestDto): Promise<interfaces.UpdateBoardResponseDto> {
  const response: interfaces.UpdateBoardResponseDto = await notesFetch({
    url: "/board/update/{id}", 
    method: "POST",
    pathParams: params.pathParams,
    body: params.body,
  });
 
  return response;
}



/**
 * Auto-generated function for createList
 */
export async function createList(params: interfaces.CreateListRequestDto): Promise<interfaces.CreateListResponseDto> {
  const response: interfaces.CreateListResponseDto = await notesFetch({
    url: "/list/new", 
    method: "POST",
        
    body: params.body,
  });
 
  return response;
}



/**
 * Auto-generated function for getList
 */
export async function getList(params: interfaces.GetListRequestDto): Promise<interfaces.GetListResponseDto> {
  const response: interfaces.GetListResponseDto = await notesFetch({
    url: "/list/{id}", 
    method: "GET",
    pathParams: params.pathParams,
        
  });
 
  return response;
}



/**
 * Auto-generated function for updateList
 */
export async function updateList(params: interfaces.UpdateListRequestDto): Promise<interfaces.UpdateListResponseDto> {
  const response: interfaces.UpdateListResponseDto = await notesFetch({
    url: "/list/update/{id}", 
    method: "POST",
    pathParams: params.pathParams,
    body: params.body,
  });
 
  return response;
}



/**
 * Auto-generated function for deleteList
 */
export async function deleteList(params: interfaces.DeleteListRequestDto): Promise<interfaces.DeleteListResponseDto> {
  const response: interfaces.DeleteListResponseDto = await notesFetch({
    url: "/list/delete/{id}", 
    method: "DELETE",
    pathParams: params.pathParams,
        
  });
 
  return response;
}



/**
 * Auto-generated function for createCard
 */
export async function createCard(params: interfaces.CreateCardRequestDto): Promise<interfaces.CreateCardResponseDto> {
  const response: interfaces.CreateCardResponseDto = await notesFetch({
    url: "/card/new", 
    method: "POST",
        
    body: params.body,
  });
 
  return response;
}



/**
 * Auto-generated function for getCard
 */
export async function getCard(params: interfaces.GetCardRequestDto): Promise<interfaces.GetCardResponseDto> {
  const response: interfaces.GetCardResponseDto = await notesFetch({
    url: "/card/{id}", 
    method: "GET",
    pathParams: params.pathParams,
        
  });
 
  return response;
}



/**
 * Auto-generated function for updateCard
 */
export async function updateCard(params: interfaces.UpdateCardRequestDto): Promise<interfaces.UpdateCardResponseDto> {
  const response: interfaces.UpdateCardResponseDto = await notesFetch({
    url: "/card/update/{id}", 
    method: "POST",
    pathParams: params.pathParams,
    body: params.body,
  });
 
  return response;
}



/**
 * Auto-generated function for deleteCard
 */
export async function deleteCard(params: interfaces.DeleteCardRequestDto): Promise<interfaces.DeleteCardResponseDto> {
  const response: interfaces.DeleteCardResponseDto = await notesFetch({
    url: "/card/delete/{id}", 
    method: "DELETE",
    pathParams: params.pathParams,
        
  });
 
  return response;
}


