import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { handleErrors, rejectInvalidBody } from './src/errors.js';
import postsRouter from './src/routes/posts.js';

const PORT = 3000;

const app = new Koa();

app.use(handleErrors);
app.use(bodyParser({ enableTypes: ['json'], onerror: rejectInvalidBody }));
app.use(postsRouter.routes());

app.listen(PORT);
