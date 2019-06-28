import prodEnv from '../env/prod';
import devEnv from '../env/dev';

export const isProd = process.env.NODE_ENV === 'production';
export const isDev = !isProd;

const env = isProd ? prodEnv : devEnv;

export default env;
