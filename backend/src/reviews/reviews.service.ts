import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { text: string | null; rating: number }) {
    const safeText = data.text === null ? '' : data.text;
    return this.prisma.review.create({
      data: {
        rating: data.rating,
        text: safeText,
      },
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ReviewWhereUniqueInput;
    where?: Prisma.ReviewWhereInput;
    orderBy?: Prisma.ReviewOrderByWithRelationInput;
  }) {
    const { skip, take = 1, cursor, where, orderBy } = params;

    const reviews = await this.prisma.review.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });

    const total = await this.prisma.review.count({ where });

    return {
      data: reviews,
      total,
      page: skip ? Math.floor(skip / take) + 1 : 1,
      limit: take,
    };
  }
}
