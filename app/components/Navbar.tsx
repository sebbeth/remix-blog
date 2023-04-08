import { Post } from "@prisma/client";
import { Link } from "@remix-run/react";

export interface NavbarProps {
  posts: Post[];
  currentPostSlug: string | undefined;
}

function getNextPost(posts: Post[], slug: string) {
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) {
    return null;
  }
  return posts[index + 1];
}

function getPreviousPost(posts: Post[], slug: string) {
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) {
    return null;
  }
  return posts[index - 1];
}

// a function that left pads a number with zeros
function padNumber(number: number, length: number) {
    return number.toString().padStart(length, "0");
}

export default function Navbar(props: NavbarProps) {
  // note, this is a really inefficient way to do this as it requires retrieving the entire list of posts
  const { posts, currentPostSlug } = props;
  const nextPostSlug = currentPostSlug
    ? getNextPost(posts, currentPostSlug)?.slug
    : undefined;
  const previousPostSlug = currentPostSlug
    ? getPreviousPost(posts, currentPostSlug)?.slug
    : undefined;

    const currentPostIndex = posts.findIndex((post) => post.slug === currentPostSlug);

  return (
    <div className="navbar">
      <div className="navbar-content">
        <div className="back-button">
          {previousPostSlug && <Link to={previousPostSlug}>Previous</Link>}
        </div>
        <div className="index">{padNumber(currentPostIndex,3)}</div>
        <div className="forward-button">
          {nextPostSlug && <Link to={nextPostSlug}>Next</Link>}
        </div>
      </div>
      <div className="bar" />
      <div className="bar solid" />
    </div>
  );
}
