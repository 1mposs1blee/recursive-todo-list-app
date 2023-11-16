/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  swcMinify: true,

  publicRuntimeConfig: {
    DB_VERSION: 1,
  },
};
