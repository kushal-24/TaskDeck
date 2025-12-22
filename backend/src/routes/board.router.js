import { Router } from "express";
import { createBoard, deleteBoard, getAllBoards, getBoard, updateBoard } from "../controllers/board.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import listRouter from './list.router.js'
import { addMember, removeMember } from "../controllers/boardMembers.controller.js";

const router=Router()

router.route("/createboard").post(verifyJWT,createBoard);
router.route("/:boardId/viewboard").get(verifyJWT, getBoard);
router.route("/:boardId/updateboard").patch(verifyJWT, updateBoard);
router.route("/:boardId/deleteboard").delete(verifyJWT,deleteBoard);
router.route("/getallboards").get(verifyJWT, getAllBoards);


//add members to the board
router.route("/:boardId/addmember").post(verifyJWT,addMember);
router.route("/board/:boardId/removemember").post(verifyJWT,removeMember);


export default router;
