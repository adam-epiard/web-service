import Koa from 'koa';
import postsRouter from './src/routes/posts.js';

const PORT = 3000;

const app = new Koa();

app.use(postsRouter.routes());

app.listen(PORT);
