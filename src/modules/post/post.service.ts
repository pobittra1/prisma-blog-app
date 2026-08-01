import { Post, PostStatus } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const createPost = async (data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">, userId: string) => {
    const result = await prisma.post.create({
        data: {
            ...data,
            authorId: userId
        }
    })
    return result;
}

const getAllPost = async ({ search, tags, isFeatured, status, authorId, page, limit, skip, sortOrder, sortBy }: {
    search: string | undefined,
    tags: string[] | [],
    isFeatured: boolean | undefined,
    status: PostStatus | undefined,
    authorId: string | undefined,
    page: number,
    limit: number,
    skip: number,
    sortBy: string,
    sortOrder: string
}) => {

    const andConditions: PostWhereInput[] = [];
    if (search) {
        andConditions.push({
            OR: [
                {
                    title: {
                        contains: search,
                        mode: "insensitive"
                    }
                },
                {
                    content: {
                        contains: search,
                        mode: "insensitive"
                    }
                },
                {
                    tags: {
                        // searching base on [] array value like this
                        has: search
                    }
                }
            ]
        })
    }

    if (tags.length > 0) {
        andConditions.push({
            tags: {
                hasEvery: tags as string[]
            }
        })
    }
    if (typeof isFeatured === "boolean") {
        andConditions.push({ isFeatured })
    }

    if (status) {
        andConditions.push({
            status
        })
    }
    if (authorId) {
        andConditions.push({
            authorId
        })
    }
    const allPost = await prisma.post.findMany({
        take: limit,
        skip: skip,
        where: {

            // search base on title or content
            // title, content, tags => OR, has
            AND: andConditions
        },
        orderBy: {
            [sortBy]: sortOrder
        }
    });
    const total = await prisma.post.count({
        where: {

            // search base on title or content
            // title, content, tags => OR, has
            AND: andConditions
        },

    })
    return {
        data: allPost,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
    };
}


// get post using id

const getPostById = async (postId: string) => {
    const result = await prisma.post.findUnique({
        where: {
            id: postId
        }
    })
    console.log("get post by id");
    return result;
}

export const postService = {
    createPost, getAllPost, getPostById
}