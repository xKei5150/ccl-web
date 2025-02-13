"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { createPost } from "@/app/(app)/dashboard/posts/actions";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import RichTextEditor  from "@/components/posts/RichTextEditor";
import { PostStatusIndicator } from "@/components/posts/PostStatusIndicator";
import { initialContent } from "@/components/posts/post-utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function PostForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: initialContent,
    publishedDate: new Date().toISOString(),
    status: "draft"
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await createPost(formData);
      if (result.success) {
        toast({
          title: "Post created",
          description: `Your post has been ${formData.status === 'published' ? 'published' : 'saved as draft'}.`,
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
          <Link href="/dashboard/posts">
            <ArrowLeft className="h-4 w-4" />
            Back to Posts
          </Link>
        </Button>
        <PostStatusIndicator status={formData.status} isLoading={isLoading} />
      </div>

      <Card className="p-4 md:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Title
            </label>
            <Input
              id="title"
              placeholder="Enter post title"
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
                key="new-post-editor"
                content={formData.content}
                onChange={(newContent) =>
                  setFormData((prev) => ({ ...prev, content: newContent }))
                }
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full sm:w-[200px]">
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/posts")}
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
                {formData.status === 'published' ? 'Publish Post' : 'Save Draft'}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}