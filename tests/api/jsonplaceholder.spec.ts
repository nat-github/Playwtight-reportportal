import { apiTest, expect } from '../../src/core/fixtures/api.fixture';
import { validatePost, validateCreatePost } from '../../src/pages/api/schemas/post.schema';

apiTest.describe('JSONPlaceholder API Tests @api @smoke', () => {

  apiTest('GET all posts', async ({
    jsonPlaceholderAPI,
    logger
  }) => {
    logger.step(1, 'Get all posts from API');
    const posts = await jsonPlaceholderAPI.getAllPosts();

    logger.step(2, 'Verify response structure');
    logger.verification(
      'Posts is an array',
      'Array',
      Array.isArray(posts) ? 'Array' : typeof posts
    );
    expect(posts).toBeInstanceOf(Array);
    expect(posts.length).toBeGreaterThan(0);

    logger.step(3, 'Validate first post schema');
    const isValid = validatePost(posts[0]);
    logger.verification(
      'First post validates against schema',
      true,
      isValid
    );
    expect(isValid).toBeTruthy();
  });

  apiTest('GET specific post', async ({
    jsonPlaceholderAPI,
    logger
  }) => {
    logger.step(1, 'Get post with ID 1');
    const post = await jsonPlaceholderAPI.getPostById(1);

    logger.step(2, 'Verify post properties');
    logger.verification(
      'Post ID is 1',
      1,
      post.id
    );
    expect(post.id).toBe(1);
    expect(post.userId).toBeDefined();
    expect(post.title).toBeDefined();
    expect(post.body).toBeDefined();
  });

  apiTest('Create new post', async ({
    jsonPlaceholderAPI,
    logger,
    apiTestData
  }) => {
    logger.step(1, 'Create new post');
    const createdPost = await jsonPlaceholderAPI.createPost(
      apiTestData.posts.validPost
    );

    logger.step(2, 'Verify post was created');
    logger.verification(
      'Post has an ID',
      'defined',
      createdPost.id ? 'defined' : 'undefined'
    );
    expect(createdPost.id).toBeDefined();
    expect(createdPost.title).toBe(apiTestData.posts.validPost.title);

    logger.step(3, 'Validate create request schema');
    const isValid = validateCreatePost(apiTestData.posts.validPost);
    logger.verification(
      'Request data validates against schema',
      true,
      isValid
    );
    expect(isValid).toBeTruthy();
  });

  apiTest('Update existing post', async ({
    jsonPlaceholderAPI,
    logger,
    apiTestData
  }) => {
    logger.step(1, 'Update post with ID 1');
    const updatedPost = await jsonPlaceholderAPI.updatePost(
      1,
      apiTestData.posts.updatePost
    );

    logger.step(2, 'Verify post was updated');
    logger.verification(
      'Title was updated',
      apiTestData.posts.updatePost.title,
      updatedPost.title
    );
    expect(updatedPost.title).toBe(apiTestData.posts.updatePost.title);
    expect(updatedPost.body).toBe(apiTestData.posts.updatePost.body);
  });

  apiTest('Delete post', async ({
    jsonPlaceholderAPI,
    logger
  }) => {
    logger.step(1, 'Delete post with ID 1');
    await expect(
      jsonPlaceholderAPI.deletePost(1)
    ).resolves.not.toThrow();

    logger.info('✓ Post deletion successful');
  });
});