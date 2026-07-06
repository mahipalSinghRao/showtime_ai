import { PaginationQuery } from "@/shared/types/pagination.types";

export const getPagination = (query: PaginationQuery) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;
    return { page, limit, skip }
}

export const getPaginationMeta = (
    page: number,
    limit: number,
    total: number) => {
    const totalPage = Math.ceil(total / limit);
    return {
        page, limit, total, totalPage,
        hasNextPage: page < totalPage,
        hasPreviousPage: page > 1
    }
}