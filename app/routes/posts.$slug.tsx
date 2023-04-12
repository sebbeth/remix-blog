import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getPost } from "~/models/post.server";
import invariant from "tiny-invariant";
import { marked } from "marked";
import styles from "~/styles/post.css"

export function links() {
  return [
    {
      rel: "stylesheet",
      href: styles,
    },
  ];
}

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.slug, `params.slug is required`);
  const post = await getPost(params.slug);
  invariant(post, `Post not found: ${params.slug}`);

  const html = marked(post.markdown);
  return json({ post, html });

};

export default function PostSlug() {
  const { post, html } = useLoaderData<typeof loader>();
  return (
    <main className="mx-auto max-w-4xl">
      <h1 className="text-center">
      {post.title}
      </h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <Link to={`/posts/edit/${post.slug}`} className="edit-button">Edit</Link>
    </main>
  );
}
