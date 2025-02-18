import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './env/env.validtor';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `./envs/.env.${CL_ARGS.env}`,
      ignoreEnvVars: true,
      validate,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
  ],
})
export class CoreModule {}
