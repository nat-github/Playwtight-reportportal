import { test as baseTest, APIRequestContext } from '@playwright/test';
import { JsonPlaceholderAPI } from '../../pages/api/jsonplaceholder.api';
import { Logger } from '../helpers/logger';

// Define API fixture types
export type APIFixtures = {
  request: APIRequestContext;
  jsonPlaceholderAPI: JsonPlaceholderAPI;
  logger: Logger;
  apiTestData: APITestData;
};

// API test data interface
export interface APITestData {
  posts: {
    validPost: {
      title: string;
      body: string;
      userId: number;
    };
    invalidPost: {
      title: string;
      // Missing required fields
    };
    updatePost: {
      title: string;
      body: string;
    };
  };
  users: {
    validUserId: number;
    invalidUserId: number;
  };
}

// Extended test with API fixtures
export const apiTest = baseTest.extend<APIFixtures>({
  // Logger fixture
  logger: async ({ }, use, testInfo) => {
    const logger = new Logger(`API-${testInfo.title}`);
    await use(logger);
  },

  // API test data fixture
  apiTestData: async ({ }, use) => {
    const apiTestData: APITestData = {
      posts: {
        validPost: {
          title: 'Test Post Title',
          body: 'This is a test post body content for automation testing.',
          userId: 1,
        },
        invalidPost: {
          title: 'Invalid Post',
        },
        updatePost: {
          title: 'Updated Post Title',
          body: 'This post has been updated by automation tests.',
        },
      },
      users: {
        validUserId: 1,
        invalidUserId: 99999,
      },
    };
    await use(apiTestData);
  },

  // JsonPlaceholder API fixture
  jsonPlaceholderAPI: async ({ request, logger }, use) => {
    const apiClient = new JsonPlaceholderAPI(request);
    logger.info('JsonPlaceholder API client initialized');
    await use(apiClient);
  },

  // Enhanced request fixture with logging
  request: async ({ request, logger }, use) => {
    // Store original request methods
    const originalGet = request.get.bind(request);
    const originalPost = request.post.bind(request);
    const originalPut = request.put.bind(request);
    const originalDelete = request.delete.bind(request);
    const originalPatch = request.patch.bind(request);

    // Override with logging
    request.get = async function (url: string, options?: any) {
      logger.apiRequest('GET', url, options?.params);
      const response = await originalGet(url, options);
      logger.apiResponse(response.status());
      return response;
    };

    request.post = async function (url: string, options?: any) {
      logger.apiRequest('POST', url, options?.data);
      const response = await originalPost(url, options);
      logger.apiResponse(response.status());
      return response;
    };

    request.put = async function (url: string, options?: any) {
      logger.apiRequest('PUT', url, options?.data);
      const response = await originalPut(url, options);
      logger.apiResponse(response.status());
      return response;
    };

    request.delete = async function (url: string, options?: any) {
      logger.apiRequest('DELETE', url);
      const response = await originalDelete(url, options);
      logger.apiResponse(response.status());
      return response;
    };

    request.patch = async function (url: string, options?: any) {
      logger.apiRequest('PATCH', url, options?.data);
      const response = await originalPatch(url, options);
      logger.apiResponse(response.status());
      return response;
    };

    await use(request);
  },
});

// Export expect from Playwright
export { expect } from '@playwright/test';

