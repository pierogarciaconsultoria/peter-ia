
interface LogLevel {
  DEBUG: 'debug';
  INFO: 'info';
  WARN: 'warn';
  ERROR: 'error';
}

const LOG_LEVELS: LogLevel = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error'
};

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  debug(component: string, message: string, data?: any) {
    if (this.isDevelopment) {
      console.debug(`[${component}] ${message}`, data || '');
    }
  }

  info(component: string, message: string, data?: any) {
    if (this.isDevelopment) {
      console.info(`[${component}] ${message}`, data || '');
    }
  }

  warn(component: string, message: string, data?: any) {
    console.warn(`[${component}] ${message}`, data || '');
  }

  error(component: string, message: string, error?: any) {
    console.error(`[${component}] ${message}`, error || '');
  }
}

export const logger = new Logger();
