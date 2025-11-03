import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsConfig } from './config/cors.config';
import { GlobalPipe } from './common/pipes/global.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  CorsConfig.EnableCors(app);
  GlobalPipe.ValidationPipe(app);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Connected at: ${process.env.PORT}`);
}

bootstrap();
