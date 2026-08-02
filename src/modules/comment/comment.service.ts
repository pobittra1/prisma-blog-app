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
        }
    })
}

export const ComemntService = {
    createComment,
    getCommentById,
    getCommentsOfAuthor
}