/**
 * Frontend Logger Utility
 * Only logs in development, silent in production
 * Can be extended to use Sentry or other services
 */

const isDevelopment = process.env.NODE_ENV !== 'production';

export const logger = {
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },

  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  error: (...args: any[]) => {
    // Always log errors, even in production (can be sent to Sentry)
    console.error(...args);
    
    // TODO: Send to Sentry in production
    // if (!isDevelopment) {
    //   Sentry.captureException(args[0]);
    // }
  },
};
