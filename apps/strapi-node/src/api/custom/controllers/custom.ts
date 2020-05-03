import { Context } from 'koa';
import { greeting } from '@ngx-builders/ts-example';

export async function ts(ctx: Context) {
  ctx.set({ 'Content-Type': 'text/html' });
  return greeting();
}
