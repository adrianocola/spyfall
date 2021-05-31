export const isProd = process.env.NODE_ENV === 'production';
export const isDev = !isProd;

export default process.env.APP_ENV;
