"use client";

import PostsError from "@/components/posts/PostsError";

export default function Error({ error, reset }) {
  return <PostsError error={error} reset={reset} />;
}