import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/http-exception.filter';

// Main entry point - Fincahub API (Stable)
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors({
    origin: [
      'http://localhost:3000',
      process.env.FRONTEND_URL || 'https://fincahub-web.vercel.app',
    ],
    credentials: true,
  });
  await app.listen(process.env.PORT || 3001);
}
bootstrap();
