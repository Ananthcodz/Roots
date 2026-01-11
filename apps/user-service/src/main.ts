import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
   try {
    const app = await NestFactory.create(AppModule);
    const port = process.env.PORT || 3001;

    await app.listen(port);
    console.log(`✅ User Service is running on: http://localhost:${port}`);
  } catch (error) {
    console.error('❌ Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap();
