import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

// Main entry point - Fincahub API (Stable)
async function bootstrap() {
  // Validate required environment variables before starting
  const required = ['DATABASE_URL', 'JWT_SECRET'];
  const missing = required.filter((v) => !process.env[v]);
  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  const app = await NestFactory.create(AppModule, { rawBody: true });

  // Security headers
  app.use(helmet());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  // CORS - environment-based origins
  const allowedOrigins = [
    'http://localhost:3000',
    'https://fincahub.vercel.app',
    'https://fincahub.com',
    'https://www.fincahub.com',
    process.env.FRONTEND_URL,
  ].filter(Boolean) as string[];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  await app.listen(process.env.PORT || 3001, '0.0.0.0');
}
bootstrap();
