import { Router } from "express";
import { createList, deleteList, getLists, updateList } from "../controllers/lists.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { reorderList } from "../controllers/listOrdering.controller.js";

const router= Router()

router.route("/board/:boardId/createlists").post(verifyJWT, createList); //✅
router.route("/board/:boardId/getlist").get(verifyJWT, getLists); //✅
router.route("/list/:listId/updatelist").patch(verifyJWT, updateList);  //✅
router.route("/list/:listId/deletelist").delete(verifyJWT, deleteList); //✅


//reordering of the lists
router.route("/board/:boardId/lists/reorder").post(verifyJWT,reorderList); 



export default router;
