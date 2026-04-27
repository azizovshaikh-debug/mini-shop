import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  migrations: {
    path: './prisma/migrations',
  },
  datasource: {
    url: 'postgresql://postgres:1234@localhost:5432/shopdb?schema=public',
  },
});
