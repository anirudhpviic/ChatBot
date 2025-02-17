/* eslint-disable no-var */

import { parseCommandLineArgs } from './util';
import { EnvironmentVariables as EV } from './env.validator';

declare global {
  var CL_ARGS: ReturnType<typeof parseCommandLineArgs>;
  type EnvironmentVariables = EV;
}

export {};
