import { Post } from "@prisma/client";
import { Link } from "@remix-run/react";

export interface NavbarProps {
  posts: Post[];
  showPagination: boolean;
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
  const { posts, currentPostSlug, showPagination } = props;
  const orderedPages = posts.sort((a, b) =>  a.slug.localeCompare(b.slug));
  const nextPostSlug = currentPostSlug
    ? getNextPost(orderedPages, currentPostSlug)?.slug
    : undefined;
  const previousPostSlug = currentPostSlug
    ? getPreviousPost(orderedPages, currentPostSlug)?.slug
    : undefined;

  const currentPostIndex = orderedPages.findIndex(
    (post) => post.slug === currentPostSlug
  );

  return (
    <div className="navbar">
      <div className="navbar-content">
        <div className="back-button">
          {showPagination && previousPostSlug && <Link to={previousPostSlug}>Previous</Link>}
        </div>
        <div className="index">{showPagination && padNumber(currentPostIndex, 3)}</div>
        <div className="forward-button">
          {showPagination && nextPostSlug && <Link to={nextPostSlug}>Next</Link>}
        </div>
      </div>
      <div className="bar" />
      <div className="bar solid" />
    </div>
  );
}
