import { Request, Response } from "express";
import { postService } from "./post.service";
import { error } from "node:console";
import { PostStatus } from "../../../generated/prisma/enums";

const createPost = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(400).json({
                error: "Unauthorized",
            })
        }
        const result = await postService.createPost(req.body, user.id as string)
        res.status(201).json(result)
    } catch (e) {
        res.status(400).json({
            error: "Post creation failed",
            details: e
        })
    }
}

const getAllPost = async (req: Request, res: Response) => {
    try {

        // get query data of search name query
        const { search } = req.query;

        const searchString = typeof search === 'string' ? search : undefined;

        const tags = req.query.tags ? (req.query.tags as string).split(",") : [];

        const isFeatured = req.query.isFeatured
            ? req.query.isFeatured === "true"
                ? true
                : req.query.isFeatured === "false"
                    ? false
                    : undefined
            : undefined;

        const status = req.query.status as PostStatus | undefined;

        const authorId = req.query.authorId as string | undefined;

        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10);

        const skip = (page - 1) * limit;

        const shortBy = req.query.shortBy as string | undefined;
        const shortOrder = req.query.orderBy as string | undefined;

        const result = await postService.getAllPost({ search: searchString, tags, isFeatured, status, authorId, page, limit, skip, shortBy, shortOrder });
        res.status(200).json(result);

    } catch (err) {
        res.status(400).json({
            error: "Post creation failed",
            details: err
        })
    }
}

export const PostController = {
    createPost,
    getAllPost
}