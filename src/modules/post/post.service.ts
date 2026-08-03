import { CommentStatus } from './../../../generated/prisma/enums';
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
        },
        include: {
            _count: {
                select: { comments: true }
            }
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
    try {
        return await prisma.$transaction(async (tx) => {
            await tx.post.update({
                where: {
                    id: postId
                },
                data: {
                    views: {
                        increment: 1
                    }
                }
            })
            const postData = await tx.post.findUnique({
                where: {
                    id: postId
                },
                include: {
                    comments: {
                        where: {
                            parentId: null,
                            status: "APPROVED",
                        },
                        orderBy: { createdAt: "desc" },
                        include: {
                            replies: {
                                where: {
                                    status: "APPROVED",
                                },
                                orderBy: { createdAt: "asc" },
                                include: {
                                    replies: {
                                        where: {
                                            status: "APPROVED"
                                        },
                                        orderBy: { createdAt: "asc" },
                                    },
                                },
                            },
                        },
                    },
                    _count: {
                        select: { comments: true }
                    }
                }
            })
            return postData;
        })
    } catch (err) {
        console.log(err);
    }
    // return result;
}

const getMyPosts = async (authorId: string) => {
    // if user authorized and status active then exucute next line either throw an error.
    await prisma.user.findUniqueOrThrow({
        where: {
            id: authorId,
            status: "ACTIVE"
        },
        select: {
            id: true
        }
    })
    const result = await prisma.post.findMany({
        where: {
            authorId
        },
        orderBy: {
            createdAt: "desc"
        },
        include: {
            _count: {
                select: {
                    comments: true
                }
            }
        }
    })
    // using count
    // const total = await prisma.post.count({
    //     where: {
    //         authorId
    //     }
    // })

    // using aggregate
    const total = await prisma.post.aggregate({
        _count: {
            id: true
        },
        where: {
            authorId
        }
    })

    return {
        data: result,
        total
    };
}

export const postService = {
    createPost, getAllPost, getPostById, getMyPosts
}