import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // <-- Import this

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000', // Adjust the origin as needed
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips away properties that are not in the DTO
      forbidNonWhitelisted: true, // Throws an error if non-whitelisted properties are present
      transform: true, // Automatically transforms payloads to DTO instances
    }),
  );

  await app.listen(3000);
}
bootstrap();
