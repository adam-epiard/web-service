import { readFileSync } from 'node:fs';

const seedUrl = new URL('../posts.seed.json', import.meta.url);

export const posts = JSON.parse(readFileSync(seedUrl, 'utf8'));

let nextId = Math.max(0, ...posts.map((post) => post.id)) + 1;

export function takeNextId() {
  const id = nextId;
  nextId += 1;
  return id;
}
