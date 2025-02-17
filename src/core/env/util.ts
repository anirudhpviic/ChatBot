import { parseArgs } from 'util';

export function parseCommandLineArgs() {
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      env: {
        type: 'string',
      },
      debug: {
        type: 'boolean',
      },
      port: {
        type: 'string',
        default: '3000',
      },
    },
  });

  if (!values.env) values.env = 'test';
  else if (!['test', 'staging', 'live'].includes(values.env)) {
    console.error('Invalid Environment:', values.env);
    process.exit(1);
  }

  return values;
}

export async function extractOptimizedObject(files: any) {
  if (files) {
    const uploadKeys: any = Object.keys(files);
    const optimizedObject: any = {};
    for (const key of uploadKeys) {
      optimizedObject[key] = [];
      for (const internalObject of files[key]) {
        optimizedObject[key].push({ original: internalObject.key });
      }
    }
    return optimizedObject;
  }

  return {};
}
