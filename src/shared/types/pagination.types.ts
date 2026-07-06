export interface PaginationQuery {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    language?: string;
    genre?: string;
    isFeatured?: boolean;
    isTrending?: boolean;
}

