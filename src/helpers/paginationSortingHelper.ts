type IOptions = {
    page?: number | string;
    limit?: number | string;
    sortOrder?: string;
    sortBy?: string;
}

const paginationSortingHelper = (options: IOptions) => {
    console.log(options);
}

export default paginationSortingHelper;