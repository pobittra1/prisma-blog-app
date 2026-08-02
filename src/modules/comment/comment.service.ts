import { prisma } from "../../lib/prisma"

const createComment = async (payload: {
    content: string,
    authorId: string,
    postId: string,
    parentId?: string
}) => {
    const postData = await prisma.post.findUniqueOrThrow({
        where: {
            id: payload.postId
        }
    })

    if (payload.parentId) {
        const parentData = await prisma.comment.findUniqueOrThrow({
            where: {
                id: payload.parentId
            }
        })
    }

    return await prisma.comment.create({
        data: payload
    })
}


const getCommentById = async (commentId: string) => {
    return await prisma.comment.findUnique({
        where: {
            id: commentId
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true,
                    views: true
                }
            }
        }
    })
}


const getCommentsOfAuthor = async (authorId: string) => {
    return await prisma.comment.findMany({
        where: {
            // if comment field name and param value name same so add authorId only
            authorId
        },
        orderBy: {
            createdAt: "desc"
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true
                }
            }
        }
    })
}

// 2 condition
// user must logged in and own comment or not verify it.
const deleteComment = async (commentId: string, authorId: string) => {
    const commentData = await prisma.comment.findFirst({
        where: {
            id: commentId,
            authorId
        },
        select: {
            id: true
        }
    })
    if (!commentData) {
        throw new Error("Your provided input is invalid!");
    }

    return await prisma.comment.delete({
        where: {
            id: commentData.id
        }
    })

}

export const ComemntService = {
    createComment,
    getCommentById,
    getCommentsOfAuthor,
    deleteComment
}