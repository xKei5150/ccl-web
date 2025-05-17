"use client";

import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { serialize } from "@/lib/utils";
import { PostStatusIndicator } from "./PostStatusIndicator";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deletePost } from "@/app/(app)/dashboard/posts/actions";
import { useToast } from "@/components/ui/use-toast";

export function PostView({ post }) {
  const router = useRouter();
  const { toast } = useToast();
  const { isAdmin, isStaff } = useAuth();
  const hasAdminAccess = isAdmin || isStaff;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!isAdmin) return;
    
    setIsDeleting(true);
    try {
      const result = await deletePost(post.slug);
      if (result.success) {
        toast({
          title: "Post deleted",
          description: "The post has been successfully deleted.",
          variant: "success",
        });
        router.push("/dashboard/posts");
      } else {
        throw new Error(result.error || "Failed to delete post");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
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
            {hasAdminAccess && (
              <div className="flex justify-end gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/dashboard/posts/${post.slug}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
                {isAdmin && (
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                )}
              </div>
            )}
          </div>
        </header>
        <div 
          className="[&>*:first-child]:mt-0 min-h-[200px]" 
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
      </article>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the post
              "{post.title}" and remove it from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}