import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { parseCommandLineArgs } from './core/env/util';
globalThis.CL_ARGS = parseCommandLineArgs();
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './core/filters/exception.filter';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<EnvironmentVariables, true>);
  const httpAdaptor = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdaptor));

  // Enable CORS with wildcard
  app.enableCors({
    origin: '*',
  });

  const server = await app.listen(configService.get('PORT'));
  server.timeout = 0;
}
bootstrap();
