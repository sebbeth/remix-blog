import { prisma } from "~/db.server";

export async function getPosts() {
  return prisma.post.findMany();
}

export async function getPost(slug: string) {
  return prisma.post.findUnique({ where: { slug } });
}

export async function createPost(post: {
  title: string;
  slug: string;
  markdown: string;
}) {
  return prisma.post.create({ data: post });
}

export async function deletePost(slug: string) {
  return prisma.post.delete({ where: { slug } });
}

export async function getLatestPost() {
  return prisma.post.findFirst({ orderBy: { createdAt: "desc" } });
}

export async function updatePost(
  slug: string,
  post: { title: string; slug: string; markdown: string }
) {
  return prisma.post.update({ where: { slug }, data: post });
}
