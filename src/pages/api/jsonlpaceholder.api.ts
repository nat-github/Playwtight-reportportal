import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseAPI } from '../../core/base/base.api';
import { Environment } from '../../config/environment';

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface CreatePostRequest {
  title: string;
  body: string;
  userId: number;
}

export interface CreatePostResponse extends Post {}

export class JsonPlaceholderAPI extends BaseAPI {
  constructor(request: APIRequestContext) {
    super(request, Environment.API_BASE_URL);
  }

  // GET /posts
  async getAllPosts(): Promise<Post[]> {
    const response = await this.get('/posts');
    await this.verifyStatusCode(response, 200);
   
    const posts = await response.json() as Post[];
    this.logger.info(`Retrieved ${posts.length} posts`);
    return posts;
  }

  // GET /posts/{id}
  async getPostById(id: number): Promise<Post> {
    const response = await this.get(`/posts/${id}`);
    await this.verifyStatusCode(response, 200);
   
    return await response.json() as Post;
  }

  // POST /posts
  async createPost(postData: CreatePostRequest): Promise<CreatePostResponse> {
    const response = await this.post('/posts', postData);
    await this.verifyStatusCode(response, 201);
   
    return await response.json() as CreatePostResponse;
  }

  // PUT /posts/{id}
  async updatePost(id: number, postData: Partial<Post>): Promise<Post> {
    const response = await this.put(`/posts/${id}`, postData);
    await this.verifyStatusCode(response, 200);
   
    return await response.json() as Post;
  }

  // PATCH /posts/{id}
  async patchPost(id: number, postData: Partial<Post>): Promise<Post> {
    const response = await this.patch(`/posts/${id}`, postData);
    await this.verifyStatusCode(response, 200);
   
    return await response.json() as Post;
  }

  // DELETE /posts/{id}
  async deletePost(id: number): Promise<void> {
    const response = await this.delete(`/posts/${id}`);
    await this.verifyStatusCode(response, 200);
  }

  // GET /posts?userId={userId}
  async getPostsByUser(userId: number): Promise<Post[]> {
    const response = await this.get('/posts', { userId });
    await this.verifyStatusCode(response, 200);
   
    return await response.json() as Post[];
  }
}