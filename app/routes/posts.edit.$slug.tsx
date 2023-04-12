import { ActionArgs, LoaderArgs, redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { deletePost, getPost, updatePost } from "~/models/post.server";
import invariant from "tiny-invariant";
import { getSaveButtonText } from "~/helpers/edit.helpers";
import postStyles from "~/styles/post.css";

export function links() {
  return [
    {
      rel: "stylesheet",
      href: postStyles,
    },
  ];
}

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.slug, `params.slug is required`);

  const post = await getPost(params.slug);
  invariant(post, `Post not found: ${params.slug}`);
  return json({ post });
};

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  const title = formData.get("title");
  const slug = formData.get("slug");
  const previousSlug = formData.get("previousSlug");
  const markdown = formData.get("markdown");
  invariant(typeof previousSlug === "string", "previousSlug must be a string");
  invariant(typeof slug === "string", "slug must be a string");
  invariant(typeof title === "string", "title must be a string");
  invariant(typeof markdown === "string", "markdown must be a string");

  const intent = formData.get("intent");
  if (intent === "delete") {
    if (slug) {
      await deletePost(slug);
    }
    return redirect("/posts");
  }

  const errors = {
    title: title ? null : "Title is required",
    slug: slug ? null : "Slug is required",
    markdown: markdown ? null : "Markdown is required",
  };
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json(errors);
  }

  console.log("updating post", { title, slug, markdown })
  await updatePost(previousSlug, { title, slug, markdown });

  return redirect(`/posts/${slug}`);
}

const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;

export default function PostEdit() {
  const errors = useActionData<typeof action>();

  const navigation = useNavigation();

  const { post } = useLoaderData<typeof loader>();

  const isSubmitting = Boolean(navigation.state === "submitting");

  return (
    <Form method="post" className="edit-form">
      <input type="hidden" name="previousSlug" value={post.slug} />
      <div>
        <label>
          Post Title:{" "}
          {errors?.title ? (
            <em className="text-red-600">{errors.title}</em>
          ) : null}
          <input
            type="text"
            name="title"
            defaultValue={post.title}
            className={inputClassName}
          />
        </label>
      </div>
      <div>
        <label>
          Post Slug:{" "}
          {errors?.slug ? (
            <em className="text-red-600">{errors.slug}</em>
          ) : null}
          <input type="text" name="slug" className={inputClassName}  defaultValue={post.slug}/>
        </label>
      </div>
      <div>
        <label htmlFor="markdown">
          Markdown:
          {errors?.markdown ? (
            <em className="text-red-600">{errors.markdown}</em>
          ) : null}
        </label>
        <br />
        <textarea
          id="markdown"
          rows={15}
          name="markdown"
          defaultValue={post.markdown}
          className={`${inputClassName} font-mono`}
        />
      </div>
      <div className="edit-buttons">
        <button
          type="submit"
          name="intent"
          value="delete"
          className="delete"
          disabled={isSubmitting}
        >
          Delete
        </button>
        <div className="edit-buttons">
          <Link to={`/posts/${post.slug}`}>Cancel</Link>
          <button
            type="submit"
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
            disabled={isSubmitting}
          >
            {getSaveButtonText(navigation)}
          </button>
        </div>
      </div>
    </Form>
  );
}
