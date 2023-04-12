import { json } from "@remix-run/node";
import { Link, Outlet, useHref, useLoaderData, useLocation, useNavigation, useParams } from "@remix-run/react";
import Navbar from "~/components/Navbar";
import { getPosts } from "~/models/post.server";
import styles from "~/styles/posts.css";
import {Location} from "@remix-run/router";

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

  const location = useLocation();

  return (
    <main>
        <Navbar posts={posts} showPagination={shouldShowPagination(location)} currentPostSlug={currentPostSlug}/>
      <Outlet/>
    </main>
  );
}

export function shouldShowPagination(location: Location) {
  if (location.pathname.includes("posts/edit")) {
    return false;
  }
  if (location.pathname.includes("posts/new")) {
    return false;
  }
  return true;
}
