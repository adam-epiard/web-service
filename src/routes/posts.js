import Router from '@koa/router';
import { posts, takeNextId } from '../store.js';
import { findPostError } from '../validation.js';

const POSITIVE_INTEGER = /^[1-9]\d*$/;

function parsePositiveInteger(value) {
  return typeof value === 'string' && POSITIVE_INTEGER.test(value) ? Number(value) : null;
}

function findPostIndex(ctx) {
  const id = parsePositiveInteger(ctx.params.id);
  const index = posts.findIndex((candidate) => candidate.id === id);
  if (index === -1) {
    ctx.throw(404, 'Post introuvable');
  }
  return index;
}

function findPost(ctx) {
  return posts[findPostIndex(ctx)];
}

function readValidBody(ctx, options) {
  const input = ctx.request.body;
  const error = findPostError(input, options);
  if (error) {
    ctx.throw(400, error);
  }
  return input;
}

function buildPost(id, fields) {
  return { postId: fields.postId, id, name: fields.name, email: fields.email, body: fields.body };
}

const router = new Router({ prefix: '/posts' });

router.get('/', (ctx) => {
  const { postId } = ctx.query;
  if (postId === undefined) {
    ctx.body = posts;
    return;
  }
  const wantedPostId = parsePositiveInteger(postId);
  if (wantedPostId === null) {
    ctx.throw(400, 'postId doit être un entier supérieur ou égal à 1');
  }
  ctx.body = posts.filter((post) => post.postId === wantedPostId);
});

router.get('/:id', (ctx) => {
  ctx.body = findPost(ctx);
});

router.post('/', (ctx) => {
  const fields = readValidBody(ctx);
  const post = buildPost(takeNextId(), fields);
  posts.push(post);
  ctx.status = 201;
  ctx.set('Location', `/posts/${post.id}`);
  ctx.body = post;
});

router.put('/:id', (ctx) => {
  const index = findPostIndex(ctx);
  const fields = readValidBody(ctx);
  posts[index] = buildPost(posts[index].id, fields);
  ctx.body = posts[index];
});

router.patch('/:id', (ctx) => {
  const post = findPost(ctx);
  const fields = readValidBody(ctx, { partial: true });
  Object.assign(post, fields);
  ctx.body = post;
});

router.delete('/:id', (ctx) => {
  posts.splice(findPostIndex(ctx), 1);
  ctx.status = 204;
});

export default router;
