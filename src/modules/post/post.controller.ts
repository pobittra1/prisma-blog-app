import { Request, Response } from "express";
import { postService } from "./post.service";
import { error } from "node:console";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";
import { UserRole } from "../../middlewares/auth";

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

        // const page = Number(req.query.page ?? 1);
        // const limit = Number(req.query.limit ?? 10);

        // const skip = (page - 1) * limit;

        // const sortOrder = req.query.sortOrder as string | undefined;
        // const sortBy = req.query.sortOrder as string | undefined;

        const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query);


        const result = await postService.getAllPost({ search: searchString, tags, isFeatured, status, authorId, page, limit, skip, sortBy, sortOrder });
        res.status(200).json(result);

    } catch (err) {
        res.status(400).json({
            error: "Post creation failed",
            details: err
        })
    }
}


// get post using id
const getPostById = async (req: Request, res: Response) => {
    try {
        // here "postId" is like variable from router file ":postId".
        const { postId } = req.params;
        if (!postId) {
            throw new Error("Post id is required!")
        }
        const result = await postService.getPostById(postId as string);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({
            error: "Post creation failed",
            details: err
        })
    }
}
const getMyposts = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error("You are unauthorized!")
        }

        const result = await postService.getMyPosts(user.id);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({
            error: "Post fetched failed",
            details: err
        })
    }
}
const updatePost = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error("You are unauthorized!")
        }
        const { postId } = req.params;
        const updatedPostData = req.body;

        const isAdmin = user.role === UserRole.ADMIN;
        console.log(user);
        const result = await postService.updatePost(postId as string, updatedPostData, user.id, isAdmin);
        res.status(200).json(result);
    } catch (err) {
        const errorMessage = (err instanceof Error) ? err.message : "Post update failed!"
        res.status(400).json({
            error: errorMessage,
            details: err
        })
    }
}
const deletePost = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error("You are unauthorized!")
        }
        const { postId } = req.params;

        const isAdmin = user.role === UserRole.ADMIN;
        const result = await postService.deletePost(postId as string, user.id, isAdmin);
        res.status(200).json(result);
    } catch (err) {
        const errorMessage = (err instanceof Error) ? err.message : "Post delete failed!"
        res.status(400).json({
            error: errorMessage,
            details: err
        })
    }
}

export const PostController = {
    createPost,
    getAllPost,
    getPostById,
    getMyposts,
    updatePost,
    deletePost
}