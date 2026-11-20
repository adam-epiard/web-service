const INTERNAL_ERROR_MESSAGE = 'Erreur interne du serveur';

function isClientError(status) {
  return Number.isInteger(status) && status >= 400 && status < 500;
}

export function rejectInvalidBody(error, ctx) {
  if (error.status === 413) {
    ctx.throw(413, 'Corps de la requête trop volumineux');
  }
  ctx.throw(400, 'Corps de la requête : JSON invalide');
}

export async function handleErrors(ctx, next) {
  try {
    await next();
    if (ctx.status === 404 && ctx.body === undefined) {
      ctx.throw(404, 'Route introuvable');
    }
  } catch (error) {
    if (isClientError(error.status)) {
      ctx.status = error.status;
      ctx.body = { error: error.message };
      return;
    }
    ctx.status = 500;
    ctx.body = { error: INTERNAL_ERROR_MESSAGE };
    ctx.app.emit('error', error, ctx);
  }
}
