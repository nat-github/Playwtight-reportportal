export class Logger {
  private context: string;
  private logLevel: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  private colors = {
    DEBUG: '\x1b[36m', // Cyan
    INFO: '\x1b[32m',  // Green
    WARN: '\x1b[33m',  // Yellow
    ERROR: '\x1b[31m', // Red
    RESET: '\x1b[0m',  // Reset
  };

  constructor(context: string) {
    this.context = context;
    this.logLevel = (process.env.LOG_LEVEL as any) || 'INFO';
  }

  private shouldLog(level: string): boolean {
    const levels = ['DEBUG', 'INFO', 'WARN', 'ERROR'];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex >= currentLevelIndex;
  }

  private formatMessage(level: string, message: string, ...args: any[]): string {
    const timestamp = new Date().toISOString();
    const formattedArgs = args.map(arg =>
      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
    ).join(' ');
   
    return `[${timestamp}] [${level}] [${this.context}] ${message} ${formattedArgs}`;
  }

  private logToConsole(level: string, message: string, ...args: any[]): void {
    const color = this.colors[level as keyof typeof this.colors] || this.colors.RESET;
    const reset = this.colors.RESET;
   
    const timestamp = new Date().toISOString();
    const formattedArgs = args.map(arg =>
      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
    ).join(' ');
   
    console.log(`${color}[${timestamp}] [${level}] [${this.context}]${reset} ${message} ${formattedArgs}`);
  }

  private logToFile(message: string): void {
    const fs = require('fs');
    const path = require('path');
   
    const logsDir = path.join(__dirname, '../../../reports/logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
   
    const logFile = path.join(logsDir, `test-execution-${new Date().toISOString().split('T')[0]}.log`);
    fs.appendFileSync(logFile, message + '\n');
  }

  debug(message: string, ...args: any[]): void {
    if (!this.shouldLog('DEBUG')) return;
   
    const formattedMessage = this.formatMessage('DEBUG', message, ...args);
    this.logToConsole('DEBUG', message, ...args);
    this.logToFile(formattedMessage);
  }

  info(message: string, ...args: any[]): void {
    if (!this.shouldLog('INFO')) return;
   
    const formattedMessage = this.formatMessage('INFO', message, ...args);
    this.logToConsole('INFO', message, ...args);
    this.logToFile(formattedMessage);
  }

  warn(message: string, ...args: any[]): void {
    if (!this.shouldLog('WARN')) return;
   
    const formattedMessage = this.formatMessage('WARN', message, ...args);
    this.logToConsole('WARN', message, ...args);
    this.logToFile(formattedMessage);
  }

  error(message: string, ...args: any[]): void {
    const formattedMessage = this.formatMessage('ERROR', message, ...args);
    this.logToConsole('ERROR', message, ...args);
    this.logToFile(formattedMessage);
   
    // For errors, also log stack trace if available
    if (args[0] instanceof Error) {
      const error = args[0] as Error;
      console.error(error.stack);
      this.logToFile(error.stack || '');
    }
  }

  // Special logging for test steps
  step(stepNumber: number, stepDescription: string): void {
    const message = `═══════════════════════════════════════════════════\n` +
                   `Step ${stepNumber}: ${stepDescription}\n` +
                   `═══════════════════════════════════════════════════`;
    this.info(message);
  }

  // API request/response logging
  apiRequest(method: string, url: string, data?: any): void {
    this.info(`🌐 ${method} ${url}`);
    if (data) {
      this.info('📦 Request Data:', data);
    }
  }

  apiResponse(status: number, response?: any): void {
    const statusColor = status >= 400 ? this.colors.ERROR :
                       status >= 300 ? this.colors.WARN : this.colors.INFO;
    const reset = this.colors.RESET;
   
    console.log(`${statusColor}📨 Response Status: ${status}${reset}`);
    if (response) {
      this.info('📄 Response:', response);
    }
  }

  // UI action logging
  uiAction(action: string, element?: string, value?: any): void {
    let message = `🖱️  ${action}`;
    if (element) message += ` on "${element}"`;
    if (value !== undefined) message += ` with value: ${value}`;
    this.info(message);
  }

  // Verification logging
  verification(description: string, expected: any, actual: any): void {
    this.info(`✅ ${description}`);
    this.debug(`   Expected: ${expected}`);
    this.debug(`   Actual: ${actual}`);
  }
}

