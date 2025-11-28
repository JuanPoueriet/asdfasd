import { NestFactory } from '@nestjs/core';
import { SeederModule, BiService } from '@univeex/bi/feature-api';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeederModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  const seeder = app.get(BiService);
  try {
    await seeder.seed();
    console.log('Seeding complete!');
  } catch (error) {
    console.error('Seeding failed!', error);
  } finally {
    await app.close();
  }
}

bootstrap();
