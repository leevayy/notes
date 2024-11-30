import { GetBoardRequestDto, GetBoardResponseDto } from "@dto/interfaces";

import { notesFetch } from "./notesFetch";

export default async function fetchBoard(params: GetBoardRequestDto) {
    const board: GetBoardResponseDto = await notesFetch({url: "/board/{id}", method: 'GET', pathParams: params.pathParams});
 
    return board;
}
