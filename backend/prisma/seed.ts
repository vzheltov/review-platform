import { PrismaClient } from '@prisma/client';
import { fakerRU as faker } from '@faker-js/faker';
const prisma = new PrismaClient();
async function main() {
  console.log('Начинаем очистку базы...');
  await prisma.review.deleteMany();
  console.log('Генерируем 1000 фейковых отзывов...');
  const reviewsData: { text: string; rating: number }[] = [];
  for (let i = 0; i < 1000; i++) {
    reviewsData.push({
      text: faker.lorem.sentences({ min: 1, max: 3 }),
      rating: faker.number.int({ min: 1, max: 5 }),
    });
  }
  await prisma.review.createMany({
    data: reviewsData,
  });
  console.log('Успешно создано 1000 отзывов');
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
