import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Trust proxy for correct client IP detection behind Cloudflare/Nginx
  const expressApp = app.getHttpAdapter().getInstance();
  if (expressApp && typeof expressApp.set === 'function') {
    expressApp.set('trust proxy', 1);
  }

  // Enable HTTP response compression (gzip/deflate)
  app.use(compression());

  // Enable CORS
  app.enableCors();

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Swagger OpenAPI Setup
  const config = new DocumentBuilder()
    .setTitle('Wilayah Indonesia REST API')
    .setDescription('Layanan REST API untuk Data Kode dan Wilayah Administrasi Pemerintahan, Kode Pos, serta Pulau Indonesia berdasarkan Kepmendagri terbaru.')
    .setVersion('1.1.0')
    .addTag('Provinces', 'API untuk data Provinsi')
    .addTag('Regencies', 'API untuk data Kabupaten / Kota')
    .addTag('Districts', 'API untuk data Kecamatan')
    .addTag('Villages', 'API untuk data Kelurahan / Desa')
    .addTag('Wilayah General & Search', 'API pencarian dan informasi detail wilayah')
    .addTag('Islands', 'API untuk data Pulau Indonesia')
    .addTag('Boundaries (Polygons & Coordinates)', 'API untuk data batas wilayah dan polygon GeoJSON')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.API_INTERNAL_PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Wilayah Indonesia API is running on port ${port}`);
  console.log(`📚 Swagger Documentation is available at http://localhost:${port}/api/docs`);
}
bootstrap();
