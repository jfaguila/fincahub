import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Main entry point - Fincahub API (Fix: railway.toml startCommand)
async function bootstrap() {
  console.log('🚀 Starting Fincahub API...');
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Port:', process.env.PORT);
  const app = await NestFactory.create(AppModule);
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
