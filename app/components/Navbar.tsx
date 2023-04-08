import { Post } from "@prisma/client";
import { Link } from "@remix-run/react";

export interface NavbarProps {
posts: Post[];
currentPostSlug: string;
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

export default function Navbar(props: NavbarProps) {
    // note, this is a really inefficient way to do this as it requires retrieving the entire list of posts
    const { posts, currentPostSlug } = props;
    const nextPostSlug = getNextPost(posts, currentPostSlug)?.slug;
    const previousPostSlug = getPreviousPost(posts, currentPostSlug)?.slug;
    return (
        <div>
             <h1>Posts</h1>
      <Link to="new">New Post</Link>
      <Link to="list">All Posts</Link>
      {
            nextPostSlug && <Link to={nextPostSlug}>Next</Link>
      }
      {
            previousPostSlug && <Link to={previousPostSlug}>Previous</Link>
      }
        </div>
    );
}