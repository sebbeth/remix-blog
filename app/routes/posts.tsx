import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useParams } from "@remix-run/react";
import Navbar from "~/components/Navbar";
import { getPosts } from "~/models/post.server";
import styles from "~/styles/posts.css";

export function links() {
  return [
    {
      rel: "stylesheet",
      href: styles,
    },
  ];
}

export const loader = async () => {
    return json({ posts: await getPosts() });
  };

export default function Posts() {
  const { posts } = useLoaderData<typeof loader>();
  const currentPostSlug = useParams().slug;
  return (
    <main>
        <Navbar posts={posts} currentPostSlug={currentPostSlug}/>
      <Outlet/>
    </main>
  );
}
