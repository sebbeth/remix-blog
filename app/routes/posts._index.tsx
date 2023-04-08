import { redirect } from "@remix-run/server-runtime";
import { getLatestPost } from "~/models/post.server";

// If no post is selected, redirect to the latest post
export async function loader() {
  const latestPost = await getLatestPost();
  if (latestPost) {
    return redirect(`/posts/${latestPost.slug}`);
  }
}

export default function PostIndexPage() {
  return <></>;
}
