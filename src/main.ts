import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { initIO } from './common/utils/socket';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // initIO(app);
  await app.listen(3000);
}
bootstrap();
