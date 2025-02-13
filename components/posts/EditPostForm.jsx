"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { updatePost, deletePost } from "@/app/(app)/dashboard/posts/actions";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import RichTextEditor from "@/components/posts/RichTextEditor";
import { PostStatusIndicator } from "@/components/posts/PostStatusIndicator";
import { initialContent } from "@/components/posts/post-utils";
import debounce from "lodash/debounce";
import { usePostShortcuts } from "@/hooks/usePostShortcuts";

export function EditPostForm({ post, slug }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: post.title,
    content: post.content || initialContent,
    publishedDate: post.publishedDate,
    status: post.status,
  });

  const debouncedSave = useCallback(
    debounce(async (data) => {
      setIsSaving(true);
      try {
        const result = await updatePost(slug, data);
        if (!result.success) {
          throw new Error(result.error);
        }
      } catch (error) {
        toast({
          title: "Auto-save failed",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
      }
    }, 1000),
    [slug, toast]
  );

  useEffect(() => {
    debouncedSave(formData);
    return () => debouncedSave.cancel();
  }, [formData, debouncedSave]);

  const handleSave = useCallback(async () => {
    if (isLoading || isSaving) return;
    setIsLoading(true);
    
    try {
      const result = await updatePost(slug, formData);
      if (result.success) {
        toast({
          title: "Post updated",
          description: "Your changes have been saved.",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [slug, formData, isLoading, isSaving, toast]);

  const handlePublish = useCallback(async () => {
    if (isLoading || isSaving) return;
    setIsLoading(true);
    
    try {
      const result = await updatePost(slug, {
        ...formData,
        status: 'published'
      });
      if (result.success) {
        toast({
          title: "Post published",
          description: "Your post has been published successfully.",
        });
        router.push(`/dashboard/posts/${result.data.slug}`);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [slug, formData, isLoading, isSaving, router, toast]);

  usePostShortcuts({
    onSave: handleSave,
    onPublish: handlePublish,
    isEditing: true,
  });

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this post?")) return;
    
    setIsLoading(true);
    try {
      const result = await deletePost(slug);
      if (result.success) {
        toast({
          title: "Post deleted",
          description: "Your post has been deleted successfully.",
        });
        router.push("/dashboard/posts");
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto max-w-3xl py-6 px-4 md:px-0">
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="gap-2 hover:bg-transparent hover:text-primary"
        >
          <Link href={`/dashboard/posts/${slug}`}>
            <ArrowLeft className="h-4 w-4" />
            Back to Post
          </Link>
        </Button>
        <PostStatusIndicator status={formData.status} isLoading={isSaving} />
      </div>

      <Card className="p-4 md:p-6">
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Title
            </label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              disabled={isLoading}
              required
              className="max-w-[95vw] md:max-w-none"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Content
            </label>
            <div className="relative">
              <RichTextEditor
                key={`edit-post-${slug}`}
                content={formData.content}
                onChange={(newContent) =>
                  setFormData((prev) => ({ ...prev, content: newContent }))
                }
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex flex-col-reverse gap-4 pt-4 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Delete Post
            </Button>
            <div className="flex flex-col gap-2 sm:flex-row sm:space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                Save Changes
              </Button>
              {formData.status !== 'published' && (
                <Button
                  type="button"
                  onClick={handlePublish}
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                  variant="default"
                >
                  Publish
                </Button>
              )}
            </div>
          </div>
        </form>
      </Card>

      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>
          Press <kbd className="rounded border bg-muted px-1">⌃S</kbd> to save or{' '}
          <kbd className="rounded border bg-muted px-1">⌃⇧P</kbd> to publish
        </p>
      </div>
    </div>
  );
}