import express, { Router } from 'express';
import { CommentController } from './comment.controller';
import auth, { UserRole } from '../../middlewares/auth';


const router = express.Router();
router.get("/:commentId", CommentController.getCommentById);
router.get("/author/:authorId", CommentController.getCommentsOfAuthor);

router.post("/", auth(UserRole.USER, UserRole.ADMIN), CommentController.createComment);

router.delete("/:commentId", auth(UserRole.USER, UserRole.ADMIN), CommentController.deleteComment);

export const commentRouter: Router = router;