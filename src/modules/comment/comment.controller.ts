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



export const CommentController = {
    createComment
}