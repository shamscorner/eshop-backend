import { Injectable, Logger } from '@nestjs/common';
import { Model, Document } from 'mongoose';
import { PaginationInfo } from '@eshop/grpc';
import { DEFAULT_PAGE_LIMIT } from '@eshop/common';

export interface PaginationOptions {
  page?: number;
  limit?: number;
  search?: string;
  searchFields?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationResult<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: PaginationInfo;
}

@Injectable()
export class GraphqlService {
  private readonly logger = new Logger(GraphqlService.name);

  async paginate<T extends Document, R>(
    model: Model<T>,
    options: PaginationOptions,
    mapper?: (doc: T) => R,
    entityName = 'items'
  ): Promise<PaginationResult<R>> {
    try {
      const page = options.page || 1;
      const limit = options.limit || DEFAULT_PAGE_LIMIT;
      const offset = (page - 1) * limit;

      // TODO: Implement search and sort functionality later
      // // Build query
      // const query: FilterQuery<T> = {};
      // if (options.search && options.searchFields?.length) {
      //   query.$or = options.searchFields.map(field => ({
      //     [field]: { $regex: options.search, $options: 'i' }
      //   }));
      // }

      // // Build sort
      // const sort: any = {};
      // if (options.sortBy) {
      //   sort[options.sortBy] = options.sortOrder === 'desc' ? -1 : 1;
      // }

      const [documents, total] = await Promise.all([
        model.find().skip(offset).limit(limit).exec(),
        model.countDocuments().exec(),
      ]);

      const totalPages = Math.ceil(total / limit);
      const mappedData: R[] = mapper ? documents.map(mapper) : (documents as unknown as R[]);

      return {
        success: true,
        message: `${entityName.charAt(0).toUpperCase() + entityName.slice(1)} retrieved successfully`,
        data: mappedData,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNext: page < totalPages,
          hasPrevious: page > 1,
        },
      };
    } catch (error) {
      this.logger.error(`Error getting ${entityName}:`, error);
      return {
        success: false,
        message: 'Internal server error',
        data: [],
        pagination: {
          currentPage: options.page || 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: options.limit || DEFAULT_PAGE_LIMIT,
          hasNext: false,
          hasPrevious: false,
        },
      };
    }
  }
}
