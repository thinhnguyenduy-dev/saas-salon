import { Schema, Model, Document } from 'mongoose';

export interface PaginationResult<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface PaginateModel<T extends Document> extends Model<T> {
  paginate(filter?: any, options?: any): Promise<PaginationResult<T>>;
}

export function PaginatePlugin(schema: Schema) {
  schema.statics.paginate = async function (
    filter: any = {},
    options: any = {},
  ) {
    const limit =
      options.limit && parseInt(options.limit, 10) > 0
        ? parseInt(options.limit, 10)
        : 10;
    const page =
      options.page && parseInt(options.page, 10) > 0
        ? parseInt(options.page, 10)
        : 1;
    const skip = (page - 1) * limit;

    const countPromise = this.countDocuments(filter).exec();
    const docsPromise = this.find(filter)
      .sort(options.sort)
      .skip(skip)
      .limit(limit)
      .populate(options.populate || [])
      .select(options.select || '')
      .exec();

    const [totalDocs, docs] = await Promise.all([countPromise, docsPromise]);

    const totalPages = Math.ceil(totalDocs / limit);

    return {
      docs,
      totalDocs,
      limit,
      totalPages,
      page,
      pagingCounter: (page - 1) * limit + 1,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
    };
  };
}
