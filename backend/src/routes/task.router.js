import { Router } from "express";
import { createTask, getTasks, updateTask, deleteTask, updateTaskStatus, addComment, getComments, editComment, deleteComment, fileUpload, fileDelete, getAllFiles } from "../controllers/tasks.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { assignUser, fetchAllAssignees, unassignUser } from "../controllers/asignee.controller.js";
import { reorderTasks } from "../controllers/listOrdering.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.post("/list/:listId/createtask", verifyJWT, createTask); //✅
router.get("/list/:listId/gettasks", verifyJWT, getTasks);//✅
router.patch("/task/:taskId/updatetask", verifyJWT, updateTask);//✅
router.delete("/task/:taskId/deletetask", verifyJWT, deleteTask);//✅
router.route('/task/:taskId/assign').post(verifyJWT, assignUser); //✅
router.route('/task/:taskId/unassign').post(verifyJWT, unassignUser); //✅
router.route('/task/:taskId/getallassignee').get(verifyJWT, fetchAllAssignees); //✅

//reoordering and status updates
router.route("/lists/:listId/tasks/reorder").post(verifyJWT,reorderTasks);//✅
router.route("/tasks/:taskId/status").patch(verifyJWT, updateTaskStatus);//✅

//comments CRUD
router.route("/task/:taskId/addcomment").post(verifyJWT, addComment)
router.route("/comment/:commentId/deletecomment").delete(verifyJWT, deleteComment)
router.route("/comment/:commentId/editcomment").patch(verifyJWT, editComment)
router.route("/task/:taskId/getcomments").get(verifyJWT, getComments )

//attachments
router.route("/task/:taskId/attachfile").post(verifyJWT,upload.single("file"),fileUpload);
router.route("/task/file/:fileId/deletefile").delete(verifyJWT, fileDelete);
router.route("/task/:taskId/getallfiles").get(verifyJWT, getAllFiles);

export default router;
