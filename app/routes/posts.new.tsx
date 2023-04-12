import { ActionArgs, redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import { createPost } from "~/models/post.server";
import invariant from "tiny-invariant";
import postStyles from "~/styles/post.css"
import { getSaveButtonText } from "~/helpers/edit.helpers";

const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;

export function links() {
  return [
    {
      rel: "stylesheet",
      href: postStyles,
    },
  ];
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const title = formData.get("title");
  const slug = formData.get("slug");
  const markdown = formData.get("markdown");
  invariant(typeof slug === "string", "slug must be a string");
  invariant(typeof title === "string", "title must be a string");
  invariant(typeof markdown === "string", "markdown must be a string");

  const errors = {
    title: title ? null : "Title is required",
    slug: slug ? null : "Slug is required",
    markdown: markdown ? null : "Markdown is required",
  };
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json(errors);
  }


  await createPost({ title, slug, markdown });

  return redirect(`/posts/${slug}`);
}

export default function PostEdit() {
  const errors = useActionData<typeof action>();

  const navigation = useNavigation();
  const isLoading = Boolean(navigation.state === "submitting");

  return (
    <Form method="post" className="edit-form">
      <div>
        <label>
          Post Title:{" "}
          {errors?.title ? (
            <em className="text-red-600">{errors.title}</em>
          ) : null}
          <input type="text" name="title" className={inputClassName} />
        </label>
      </div>
      <div>
        <label>
          Post Slug:{" "}
          {errors?.slug ? (
            <em className="text-red-600">{errors.slug}</em>
          ) : null}
          <input type="text" name="slug" className={inputClassName} />
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
          rows={12}
          name="markdown"
          className={`${inputClassName} font-mono`}
        />
      </div>
      <div className="new-buttons">
        <Link to={`/posts`}>Cancel</Link>
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
          disabled={isLoading}
        >
          {getSaveButtonText(navigation)}
        </button>
      </div>
    </Form>
  );
}

