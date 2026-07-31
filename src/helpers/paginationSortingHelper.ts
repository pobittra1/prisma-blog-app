type IOptions = {
    page?: number | string;
    limit?: number | string;
    sortOrder?: string;
    sortBy?: string;
}

const paginationSortingHelper = (options: IOptions) => {
    const page: number = Number(options.page) || 1;
    const limit: number = Number(options.limit) || 10;
    const skip = (page - 1) * limit;
    return {
        page, limit, skip
    };
}

export default paginationSortingHelper;