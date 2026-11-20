import Router from '@koa/router';
import { posts } from '../store.js';

const POSITIVE_INTEGER = /^[1-9]\d*$/;

function parsePositiveInteger(value) {
  return typeof value === 'string' && POSITIVE_INTEGER.test(value) ? Number(value) : null;
}

function findPost(ctx) {
  const id = parsePositiveInteger(ctx.params.id);
  const post = posts.find((candidate) => candidate.id === id);
  if (!post) {
    ctx.throw(404, 'Post introuvable');
  }
  return post;
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

export default router;
