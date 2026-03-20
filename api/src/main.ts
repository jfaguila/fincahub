import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

// Main entry point - Fincahub API (Stable)
async function bootstrap() {
  // Validate required environment variables before starting
  const required = ['DATABASE_URL', 'JWT_SECRET', 'FRONTEND_URL'];
  const missing = required.filter((v) => !process.env[v]);
  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  // Warn about optional but important variables
  const recommended = ['MAIL_USER', 'MAIL_PASS', 'PAYPAL_CLIENT_ID', 'PAYPAL_CLIENT_SECRET'];
  const missingRecommended = recommended.filter((v) => !process.env[v]);
  if (missingRecommended.length > 0) {
    console.warn(`⚠️  Optional env vars not set (some features disabled): ${missingRecommended.join(', ')}`);
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

  // CORS - strict in production, permissive in development
  const isProd = process.env.NODE_ENV === 'production';
  const prodOrigins = [
    'https://fincahub.com',
    'https://www.fincahub.com',
    process.env.FRONTEND_URL,
  ].filter(Boolean) as string[];

  const devOrigins = [
    'http://localhost:3000',
    'https://fincahub.vercel.app',
    'https://fincahub-git-main-jorge-fabregas-projects.vercel.app',
    process.env.FRONTEND_URL,
  ].filter(Boolean) as string[];

  app.enableCors({
    origin: isProd ? prodOrigins : devOrigins,
    credentials: true,
  });

  await app.listen(process.env.PORT || 3001, '0.0.0.0');
}
bootstrap();
