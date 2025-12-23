import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Prisma } from '@prisma/client';
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}
  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '5',
    @Query('search') search: string = '',
    @Query('searchType') searchType: 'partial' | 'exact' = 'partial',
    @Query('caseSensitive') caseSensitive: string = 'false',
    @Query('sortBy') sortBy: string = 'id',
    @Query('order') order: 'asc' | 'desc' = 'desc',
  ) {
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const mode =
      caseSensitive === 'true' ? undefined : Prisma.QueryMode.insensitive;
    let where: Prisma.ReviewWhereInput = {};
    if (search) {
      const tmp_word = search.trim();
      if (searchType === 'exact') {
        where = {
          OR: [
            { text: { equals: tmp_word, mode: mode } },
            { text: { startsWith: `${tmp_word} `, mode: mode } },
            { text: { endsWith: ` ${tmp_word}`, mode: mode } },
            { text: { contains: ` ${tmp_word} `, mode: mode } },
          ],
        };
      } else {
        where = { text: { contains: tmp_word, mode: mode } };
      }
    }
    const orderBy = { [sortBy]: order };

    return this.reviewsService.findAll({
      where,
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
      orderBy,
    });
  }
  @Post()
  create(@Body() body: { text: string; rating: number }) {
    return this.reviewsService.create(body);
  }
}
