import { Query } from "mongoose";
import { PaginationQuery } from "../types/pagination.types";
import { getPagination } from "../../shared/utils/pagination";

export class QueryBuilder<T> {

    constructor(
        private query: Query<T[], T>,
        private queryString: PaginationQuery,
        private mongoFilter = {},
    ) { }
    paginate() {
        const { skip, limit } = getPagination(this.queryString)

        this.query.skip(skip).limit(limit)
        return this;
    }
    build() {
        return this.query;
    }

    search(fields: (keyof T)[]) {
        if (!this.queryString.search) {
            return this;
        }
        this.mongoFilter = {
            $or: fields.map((field) => ({
                [field]: {
                    $regex: this.queryString.search,
                    $options: "i"
                }
            }))
        }
        this.query.find(this.filter);
        return this;
    };
    getFilter() {
        return this.mongoFilter;
    }

    sort(allowedFields: (keyof T)[]) {
        const sortField = this.queryString.sort;
        if (!sortField) {
            return this;
        }
        if (!allowedFields.includes(sortField as keyof T)) {
            return this;
        }
        this.query.sort({ [sortField]: -1 })
        return this;
    }

    filter(allowedFields: (keyof T)[]) {

        const filters: Record<string, any> = {};

        for (const field of allowedFields) {

            const value =
                this.queryString[field as keyof PaginationQuery];

            if (value !== undefined) {
                filters[field as string] = value;
            }

        }

        this.mongoFilter = {
            ...this.mongoFilter,
            ...filters
        };

        this.query.find(this.mongoFilter);

        return this;
    }
}