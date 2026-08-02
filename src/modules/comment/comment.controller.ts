import { Request, Response } from "express";
import { error } from "node:console";
import { ComemntService } from "./comment.service";

const createComment = async (req: Request, res: Response) => {
    try {

        // from auth/userRole moddileware
        const user = req.user;
        req.body.authorId = user?.id;
        const result = await ComemntService.createComment(req.body)
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({
            error: "Comment creation failed",
            details: err
        })
    }
}


const getCommentById = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;
        const result = await ComemntService.getCommentById(commentId as string)
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({
            error: "Comment fetch failed",
            details: err
        })
    }


}
const getCommentsOfAuthor = async (req: Request, res: Response) => {
    try {
        const { authorId } = req.params;
        const result = await ComemntService.getCommentsOfAuthor(authorId as string)
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({
            error: "Comments fetch failed",
            details: err
        })
    }
}
const deleteComment = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const { commentId } = req.params;
        const result = await ComemntService.deleteComment(commentId as string, user?.id as string);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({
            error: "Comments delete failed",
            details: err
        })
    }
}






export const CommentController = {
    createComment,
    getCommentById,
    getCommentsOfAuthor,
    deleteComment
}