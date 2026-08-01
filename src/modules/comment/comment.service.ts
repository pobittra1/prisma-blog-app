const createComment = async (payload: {
    content: string,
    authorId: string,
    postId: string,
    parentId?: string
}) => {
    console.log("create comment service", payload);
}

export const ComemntService = {
    createComment
}