import { Post } from "@prisma/client";
import { prisma } from "~/db.server";

  export async function getPosts() {
    return prisma.post.findMany();
  }

  export async function getPost(slug: string) {
    return prisma.post.findUnique({ where: { slug } });
  }

  export async function createPost(post: Post) {
    return prisma.post.create({ data: post });
  }

  export async function deletePost(slug: string) {
    return prisma.post.delete({where: {slug}});
  }

  export async function updatePost(slug: string, post: Post) {
    return prisma.post.update({ where: { slug }, data: post });
  }