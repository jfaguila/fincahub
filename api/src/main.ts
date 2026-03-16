import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/http-exception.filter';

// Main entry point - Fincahub API (Stable)
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://fincahub.vercel.app',
      'https://fincahub-jw9yc3lnb-jorge-fabregas-projects.vercel.app',
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
  });
  await app.listen(process.env.PORT || 3001, '0.0.0.0');
}
bootstrap();
