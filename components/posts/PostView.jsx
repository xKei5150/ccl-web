"use client";

import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { serialize } from "@/lib/utils";
import { PostStatusIndicator } from "./PostStatusIndicator";
import { RichText} from "@payloadcms/richtext-lexical/react" 

export function PostView({ post }) {
  // const serializedContent = serialize(post.content);
  // console.log('serializedContent', serializedContent);

  return (
    <article className="prose prose-zinc dark:prose-invert max-w-none">
      <header className="not-prose mb-8 space-y-4 border-b pb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>{post.author?.name}</span>
              <span>•</span>
              <time dateTime={post.publishedDate}>
                {format(new Date(post.publishedDate), "MMMM d, yyyy")}
              </time>
              <span>•</span>
              <PostStatusIndicator status={post.status} />
            </div>
          </div>
          <div className="flex justify-end">
            <Button asChild variant="outline" size="sm">
              <Link href={`/dashboard/posts/${post.slug}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
          </div>
        </div>
      </header>
      <div 
        className="[&>*:first-child]:mt-0 min-h-[200px]" 
        dangerouslySetInnerHTML={{ __html: post.content }} 
      />
    </article>
  );
}