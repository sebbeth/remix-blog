import { ActionArgs, json, redirect } from "@remix-run/node";
import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { deletePost, getPosts } from "~/models/post.server";

export const loader = async () => {
  return json({ posts: await getPosts() });
};

export async function action({ request }: ActionArgs) {
  console.log({ request });

  const formData = await request.formData();

  const intent = formData.get("intent");
  if (intent === "delete") {
    const slug = formData.get("slug");
    invariant(typeof slug === "string", "slug must be a string");
    if (slug) {
      await deletePost(slug);
    }
  }

  return redirect("/posts/admin");
}

export default function PostAdmin() {
  const { posts } = useLoaderData<typeof loader>();
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="my-6 mb-2 border-b-2 text-center text-3xl">Blog Admin</h1>
      <div className="grid grid-cols-4 gap-6">
        <nav className="col-span-4 md:col-span-1">
          <ul>
            {posts.map((post) => (
              <li key={post.slug}>
                <Link to={post.slug} className="text-blue-600 underline">
                  {post.title}
                </Link>
                <Form method="delete">
                  <input type="hidden" name="slug" value={post.slug} />
                  <button type="submit" name="intent" value="delete">
                    Delete
                  </button>
                </Form>
              </li>
            ))}
          </ul>
        </nav>
        <main className="col-span-4 md:col-span-3">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
