"use server";

import { payload } from "@/lib/payload";
import { revalidatePath } from "next/cache";
import { validatePostData } from "@/components/posts/post-utils";

export async function getPostsAction() {
  try {
    const posts = await payload.find({
      collection: 'posts',
      sort: '-publishedDate',
      depth: 1,
    });
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw new Error('Failed to fetch posts');
  }
}

export async function getPost(slug) {
  try {
    const post = await payload.find({
      collection: 'posts',
      where: {
        slug: {
          equals: slug
        }
      },
      depth: 2,
      limit: 1
    });
    
    return post.docs[0] || null;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export async function createPost(data) {
  try {
    validatePostData(data);
    
    const post = await payload.create({
      collection: 'posts',
      data: data
    });
    revalidatePath('/dashboard/posts');
    return { success: true, data: post };
  } catch (error) {
    console.error('Error creating post:', error);
    return { success: false, error: error.message };
  }
}

export async function updatePost(slug, data) {
  try {
    validatePostData(data);
    
    const post = await payload.find({
      collection: 'posts',
      where: {
        slug: {
          equals: slug
        }
      }
    });
    
    if (!post.docs[0]) {
      throw new Error('Post not found');
    }

    const updated = await payload.update({
      collection: 'posts',
      id: post.docs[0].id,
      data: data
    });

    revalidatePath('/dashboard/posts');
    revalidatePath(`/dashboard/posts/${slug}`);
    return { success: true, data: updated };
  } catch (error) {
    console.error('Error updating post:', error);
    return { success: false, error: error.message };
  }
}

export async function deletePost(slug) {
  try {
    const post = await payload.find({
      collection: 'posts',
      where: {
        slug: {
          equals: slug
        }
      }
    });
    
    if (!post.docs[0]) {
      throw new Error('Post not found');
    }

    await payload.delete({
      collection: 'posts',
      id: post.docs[0].id
    });

    revalidatePath('/dashboard/posts');
    return { success: true };
  } catch (error) {
    console.error('Error deleting post:', error);
    return { success: false, error: error.message };
  }
}