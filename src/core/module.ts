import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './env/env.validtor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `./envs/.env.${CL_ARGS.env}`,
      ignoreEnvVars: true,
      validate,
    }),
  ],
})
export class CoreModule {}
