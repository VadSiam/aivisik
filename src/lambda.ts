import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CronService } from './cron/cron.service';

export async function handlerFunc(): Promise<string> {
  console.log('🚀 ~ file: lambda.ts:6 ~ START');
  const app = await NestFactory.createApplicationContext(AppModule);
  const cronService = app.get(CronService);
  const result = await cronService.lambdaFunction();
  console.log('🚀 ~ file: lambda.ts:10 ~ result:', result);
  await app.close();
  return result;
}
