/** @type {import('next').NextConfig} */

// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {
  reactStrictMode: true,
  // swcMinify устарел в Next.js 15, удаляем его
  images: {
    domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com'],
  },
  experimental: {
    // serverActions теперь должен быть объектом, а не булевым значением
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  // Настройки Turbopack (стабильная версия)
  turbopack: {
    resolveAlias: {
      // Здесь можно добавить алиасы для путей, если необходимо
    },
  },
};

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore
  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
