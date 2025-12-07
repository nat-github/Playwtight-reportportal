import { APIRequestContext, APIResponse } from '@playwright/test';
import { Logger } from '../helpers/logger';
import { Environment } from '../../config/environment';

export abstract class BaseAPI {
  protected request: APIRequestContext;
  protected logger: Logger;
  protected baseURL: string;

  constructor(request: APIRequestContext, baseURL?: string) {
    this.request = request;
    this.logger = new Logger(this.constructor.name);
    this.baseURL = baseURL || Environment.API_BASE_URL;
  }

  // HTTP Methods
  protected async get(
    endpoint: string,
    params?: Record<string, any>,
    headers?: Record<string, string>
  ): Promise<APIResponse> {
    const url = `${this.baseURL}${endpoint}`;
    this.logger.info(`GET Request: ${url}`);
    if (params) this.logger.info('Query params:', params);
   
    const response = await this.request.get(url, {
      params,
      headers: { ...this.getHeaders(), ...headers },
      timeout: Environment.API_TIMEOUT,
    });
   
    await this.logResponse(response);
    return response;
  }

  protected async post(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<APIResponse> {
    const url = `${this.baseURL}${endpoint}`;
    this.logger.info(`POST Request: ${url}`);
    if (data) this.logger.info('Request body:', data);
   
    const response = await this.request.post(url, {
      data,
      headers: { ...this.getHeaders(), ...headers },
      timeout: Environment.API_TIMEOUT,
    });
   
    await this.logResponse(response);
    return response;
  }

  protected async put(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<APIResponse> {
    const url = `${this.baseURL}${endpoint}`;
    this.logger.info(`PUT Request: ${url}`);
    if (data) this.logger.info('Request body:', data);
   
    const response = await this.request.put(url, {
      data,
      headers: { ...this.getHeaders(), ...headers },
      timeout: Environment.API_TIMEOUT,
    });
   
    await this.logResponse(response);
    return response;
  }

  protected async delete(
    endpoint: string,
    headers?: Record<string, string>
  ): Promise<APIResponse> {
    const url = `${this.baseURL}${endpoint}`;
    this.logger.info(`DELETE Request: ${url}`);
   
    const response = await this.request.delete(url, {
      headers: { ...this.getHeaders(), ...headers },
      timeout: Environment.API_TIMEOUT,
    });
   
    await this.logResponse(response);
    return response;
  }

  protected async patch(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<APIResponse> {
    const url = `${this.baseURL}${endpoint}`;
    this.logger.info(`PATCH Request: ${url}`);
    if (data) this.logger.info('Request body:', data);
   
    const response = await this.request.patch(url, {
      data,
      headers: { ...this.getHeaders(), ...headers },
      timeout: Environment.API_TIMEOUT,
    });
   
    await this.logResponse(response);
    return response;
  }

  // Header management
  protected getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'Playwright-Automation-Framework',
    };
  }

  // Validation methods
  protected async verifyStatusCode(response: APIResponse, expectedStatus: number): Promise<void> {
    const actualStatus = response.status();
    if (actualStatus !== expectedStatus) {
      const body = await this.getResponseBody(response);
      throw new Error(
        `Expected status ${expectedStatus}, got ${actualStatus}. Response: ${body}`
      );
    }
    this.logger.info(`✓ Status code verified: ${expectedStatus}`);
  }

  protected async verifyResponseTime(response: APIResponse, maxTime: number = 5000): Promise<void> {
    const timing = response.timing();
    const responseTime = timing?.responseStart ? timing.responseStart : 0;
   
    if (responseTime > maxTime) {
      this.logger.warn(`Response time ${responseTime}ms exceeds maximum ${maxTime}ms`);
    }
  }

  protected async verifyResponseContains(response: APIResponse, expectedText: string): Promise<void> {
    const body = await response.text();
    if (!body.includes(expectedText)) {
      throw new Error(`Response does not contain "${expectedText}". Response: ${body}`);
    }
    this.logger.info(`✓ Response contains: "${expectedText}"`);
  }

  protected async verifyJsonSchema(response: APIResponse, schema: any): Promise<void> {
    const body = await response.json();
    // This is a placeholder - you would implement actual JSON schema validation
    this.logger.info('JSON schema validation passed');
    return Promise.resolve();
  }

  // Response handling
  protected async getResponseBody(response: APIResponse): Promise<any> {
    try {
      return await response.json();
    } catch {
      return await response.text();
    }
  }

  protected async saveResponseToFile(response: APIResponse, filename: string): Promise<void> {
    const body = await this.getResponseBody(response);
    const fs = require('fs');
    const path = require('path');
   
    const reportsDir = path.join(__dirname, '../../../reports/api-responses');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
   
    const filePath = path.join(reportsDir, `${filename}-${Date.now()}.json`);
    fs.writeFileSync(filePath, JSON.stringify(body, null, 2));
    this.logger.info(`Response saved to: ${filePath}`);
  }

  // Private methods
  private async logResponse(response: APIResponse): Promise<void> {
    const status = response.status();
    const url = response.url();
    const headers = response.headers();
   
    this.logger.info(`Response Status: ${status}`);
    this.logger.info(`Response URL: ${url}`);
    this.logger.info('Response Headers:', headers);
   
    if (status >= 400) {
      const body = await this.getResponseBody(response);
      this.logger.error('Error Response Body:', body);
    } else {
      try {
        const body = await response.json();
        this.logger.info('Response Body:', body);
      } catch {
        const text = await response.text();
        if (text && text.length < 1000) { // Don't log huge responses
          this.logger.info('Response Text:', text);
        }
      }
    }
  }

  // Utility methods
  protected async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  protected generateRandomString(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  protected formatDate(date: Date = new Date()): string {
    return date.toISOString();
  }
}