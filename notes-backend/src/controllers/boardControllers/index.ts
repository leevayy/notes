import { getBoardController } from './getBoardController.ts';
import { updateBoardController } from './updateBoardController.ts';
import { createBoardController } from './createBoardController.ts';
import { deleteBoardController } from './deleteBoardController.ts';

export const boardControllers = {
    createBoardController,
    getBoardController,
    updateBoardController,
    deleteBoardController,
};
