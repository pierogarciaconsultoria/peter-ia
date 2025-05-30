
/**
 * Secure logging utility with data sanitization
 * Prevents exposure of sensitive information in production logs
 */

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

/**
 * Sanitizes sensitive data from log arguments
 * Removes tokens, passwords, and other sensitive information
 */
function sanitize(args: any[]): any[] {
  return args.map(arg => {
    if (typeof arg === 'string') {
      return arg
        // Remove Bearer tokens
        .replace(/Bearer\s[\w.-]+/gi, '[TOKEN_REDACTED]')
        // Remove JWT tokens
        .replace(/eyJ[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*/g, '[JWT_REDACTED]')
        // Remove API keys
        .replace(/api[_-]?key["\s:=]+["']?[a-zA-Z0-9-_]+["']?/gi, 'api_key=[KEY_REDACTED]')
        // Remove passwords
        .replace(/password["\s:=]+["']?[^"'\s]+["']?/gi, 'password=[PASSWORD_REDACTED]')
        // Remove email addresses in sensitive contexts
        .replace(/email["\s:=]+["']?[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}["']?/gi, 'email=[EMAIL_REDACTED]');
    }
    
    if (typeof arg === 'object' && arg !== null) {
      return sanitizeObject(arg);
    }
    
    return arg;
  });
}

/**
 * Recursively sanitizes objects to remove sensitive fields
 */
function sanitizeObject(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  
  const sensitiveFields = [
    'password', 'token', 'access_token', 'refresh_token', 'api_key',
    'secret', 'authorization', 'auth', 'jwt', 'session_token'
  ];
  
  const sanitized = { ...obj };
  
  for (const field of sensitiveFields) {
    if (field in sanitized) {
      sanitized[field] = '[REDACTED]';
    }
  }
  
  // Recursively sanitize nested objects
  for (const key in sanitized) {
    if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeObject(sanitized[key]);
    }
  }
  
  return sanitized;
}

/**
 * Formats log messages with context information
 */
function formatMessage(level: string, component: string, message: string): string {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}] [${component}] ${message}`;
}

/**
 * Secure logger with conditional output and data sanitization
 */
export const logger = {
  /**
   * Debug logging - only in development
   */
  debug: (component: string, message: string, ...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(formatMessage('debug', component, message), ...sanitize(args));
    }
  },

  /**
   * Info logging - development and staging
   */
  info: (component: string, message: string, ...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(formatMessage('info', component, message), ...sanitize(args));
    }
  },

  /**
   * Warning logging - all environments
   */
  warn: (component: string, message: string, ...args: any[]) => {
    console.warn(formatMessage('warn', component, message), ...sanitize(args));
  },

  /**
   * Error logging - all environments with full sanitization
   */
  error: (component: string, message: string, ...args: any[]) => {
    console.error(formatMessage('error', component, message), ...sanitize(args));
  },

  /**
   * Legacy support for simple logging
   */
  log: (...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(...sanitize(args));
    }
  }
};

/**
 * Performance logging utility
 */
export const performanceLogger = {
  time: (label: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.time(`[PERF] ${label}`);
    }
  },
  
  timeEnd: (label: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.timeEnd(`[PERF] ${label}`);
    }
  }
};

/**
 * Security audit logger - always logs to console in production for monitoring
 */
export const securityLogger = {
  logSecurityEvent: (event: string, details: any = {}) => {
    const securityLog = {
      timestamp: new Date().toISOString(),
      event,
      details: sanitizeObject(details),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    // Always log security events but sanitize the data
    console.warn('[SECURITY]', securityLog);
  }
};

export default logger;
