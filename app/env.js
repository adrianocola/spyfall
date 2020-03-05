import prodEnv from '../env/prod'; // eslint-disable-line no-restricted-imports
import devEnv from '../env/dev'; // eslint-disable-line no-restricted-imports

export const isProd = process.env.NODE_ENV === 'production';
export const isDev = !isProd;

const env = isProd ? prodEnv : devEnv;

export default env;
