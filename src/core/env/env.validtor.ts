// Update the validator according to your need
import { plainToInstance } from 'class-transformer';
import {
  IsString,
  IsInt,
  validateSync,
  IsOptional,
  IsNumber,
} from 'class-validator';
export class EnvironmentVariables {
  @IsOptional()
  @IsInt()
  PORT: number;

  @IsOptional()
  @IsString()
  ORIGINS: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  validatedConfig.ORIGINS = validatedConfig.ORIGINS
    ? JSON.parse(validatedConfig.ORIGINS.replace(/'/g, '"'))
    : [];
  return validatedConfig;
}
