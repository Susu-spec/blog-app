/**
 * @fileoverview Context and provider for managing blog post data.
 * Provides utilities to fetch, cache, and invalidate post lists and details.
 */

import { toaster } from "@/components/ui/toaster";
import { supabase } from "@/lib/supabase";
import { fetchAllPostsFromApi, fetchMyPostsFromApi, fetchPostFromApi } from "@/services/postServices";
import { parseFetchPostsError } from "@/utils/errors";
import { shouldUseCache, shouldUseDetailsCache } from "@/utils/postCache";
import { createContext, useCallback, useContext, useState } from "react";

/**
 * @typedef {Object} Post
 * @property {string} slug - URL safe version of the title of the post.
 * @property {string} title - Title of the post.
 * @property {string} content - Main content body of the post.
 * @property {string} author_id - Foreign key for the author.
 * @property {Author} author - Object containing author details.
 * @property {string} created_at - Timestamp of when the post was created.
 * @property {string} updated_at - Timestamp of when the post was updated.
*/


/**
 * @typedef {Object} PostsContextType
 * @property {Post[]} allPosts - Cached list of all posts.
 * @property {Post[]} myPosts - Cached list of posts created by the current user.
 * @property {Record<string, Post>} postDetails - Cached post details by post slug.
 * @property {boolean} loading - Indicates whether a request is in progress.
 * @property {() => Promise<Post[]>} fetchAllPosts - Fetch all posts from Supabase.
 * @property {(userId: string) => Promise<Post[]>} fetchMyPosts - Fetch user-specific posts.
 * @property {(postSlug: string) => Promise<Post>} fetchPost - Fetch individual post by its slug.
 * @property {() => void} invalidateCache - Clears all cached post data.
*/


/**
  * React Context for managing posts data.
  * @type {React.Context<PostsContextType | undefined>}
*/

export const PostsContext = createContext();

export function PostsProvider({ children }) {
  const [allPosts, setAllPosts] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [postDetails, setPostDetails] = useState({});
  const [loading, setLoading] = useState(false);

  /**
   * Fetch all posts from Supabase with author info.
   * Caches results to avoid redundant network calls.
   *
   * @returns {Promise<Post[]>}
  */

  const fetchAllPosts = useCallback(async () => {
    if (allPosts.length > 0) {
      return allPosts;
    }

    setLoading(true);
    const start = Date.now();

    const { data, error } = await fetchAllPostsFromApi();

    const elapsed = Date.now() - start;
    const delay = Math.max(0, 800 - elapsed);

    if (error) {
      const { title, description } = parseFetchPostsError(error);
      toaster.create({
        title,
        description,
        type: "error",
        duration: 4000,
        isClosable: true,
      })
    } else {
      setAllPosts(data || []);
    }

    setTimeout(() => {
      setLoading(false);
    }, delay);

    return data;
  }, [allPosts.length]);


  /**
   * Fetch posts belonging to a specific user.
   *
   * @param {string} userId - ID of the current user.
   * @returns {Promise<Post[]>}
  */

  const fetchMyPosts = useCallback(async (userId) => {
    if (!userId) return;

    if (shouldUseCache(myPosts)) return myPosts;

    setLoading(true);
    const start = Date.now();

    const { data, error } = await fetchMyPostsFromApi(userId);

    const elapsed = Date.now() - start;
    const delay = Math.max(0, 800 - elapsed);

     if (error) {
      const { title, description } = parseFetchPostsError(error);
      toaster.create({
        title,
        description,
        type: "error",
        duration: 4000,
        isClosable: true,
      })
    } else {
        setMyPosts(data || []);
    }

    setTimeout(() => {
        setLoading(false);
    }, delay);

    return data;
  }, [myPosts.length]);


    
  /**
   * Fetch an individual post by its slug.
   * Uses cache if post details already exist.
   *
   * @param {string} postSlug - URL safe version of the title of the post to fetch.
   * @returns {Promise<Post>}
  */
  const fetchPost = useCallback(async (postSlug) => {
      if (!postSlug) return;

      if (shouldUseDetailsCache(postDetails, postSlug)) {
        return postDetails[postSlug];
      }

      setLoading(true);
      const start = Date.now();

      const { data, error } = await fetchPostFromApi(postSlug);

      const elapsed = Date.now() - start;
      const delay = Math.max(0, 800 - elapsed);

      if (error) {
        const { title, description } = parseFetchPostsError(error);
        toaster.create({
          title,
          description,
          type: "error",
          duration: 4000,
          isClosable: true,
        })
      } else {
        setPostDetails(prev => ({ ...prev, [postSlug]: data }));
      }

      setTimeout(() => {
          setLoading(false);
      }, delay);

      return data;
  }, [postDetails]);

  /**
   * Clears all cached post data.
   * Useful after creating, editing, or deleting a post.
   */
  const invalidateCache = useCallback(() => {
      setAllPosts([]);
      setMyPosts([]);
      setPostDetails({});
  }, []);

  /**
   * Refetch post data after CRUD actions.
   *
   * @param {Object} options
   * @param {string} [options.userId] - Current user ID, required for my posts.
   * @param {string} [options.slug] - Slug of a specific post to refetch.
   * @param {boolean} [options.invalidate=true] - Whether to clear caches before refetching.
   */
  const refetchPosts = async ({ userId, slug, invalidate = true } = {}) => {
    if (invalidate) invalidateCache();

    const promises = [];

    if (userId) {
      promises.push(fetchMyPosts(userId));
    }
    
    promises.push(fetchAllPosts());

    if (slug) {
      promises.push(fetchPost(slug, true));
    }

    await Promise.all(promises);
  };


  return (
    <PostsContext.Provider value={{
      allPosts,
      myPosts,
      postDetails,
      loading,
      fetchAllPosts,
      fetchMyPosts,
      fetchPost,
      invalidateCache,
      refetchPosts
    }}>
      {children}
    </PostsContext.Provider>
  );
}
