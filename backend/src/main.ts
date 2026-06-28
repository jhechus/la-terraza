import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:4200',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  // Sirve uploads locales solo en desarrollo (en producción las imágenes van a Cloudinary)
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads' });
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`La Terraza API corriendo en: http://localhost:${port}`);
}
bootstrap();
