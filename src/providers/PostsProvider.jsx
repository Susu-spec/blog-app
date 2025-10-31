/**
 * @fileoverview Context and provider for managing blog post data.
 * Provides utilities to fetch, cache, and invalidate post lists and details.
 */

import { supabase } from "@/lib/supabase";
import { createContext, useCallback, useContext, useState } from "react";

/**
 * @typedef {Object} Post
 * @property {string} id - Unique identifier for the post.
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
 * @property {Record<string, Post>} postDetails - Cached post details by post ID.
 * @property {boolean} loading - Indicates whether a request is in progress.
 * @property {() => Promise<Post[]>} fetchAllPosts - Fetch all posts from Supabase.
 * @property {(userId: string) => Promise<Post[]>} fetchMyPosts - Fetch user-specific posts.
 * @property {(postId: string) => Promise<Post>} fetchPost - Fetch individual post by ID.
 * @property {() => void} invalidateCache - Clears all cached post data.
*/


/**
  * React Context for managing posts data.
  * @type {React.Context<PostsContextType | undefined>}
*/

const PostsContext = createContext();

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

    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:author_id(name)
      `)
      .order('created_at', { ascending: false });

    const elapsed = Date.now() - start;
    const delay = Math.max(0, 800 - elapsed);

    if (error) {
      console.error(error);
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

    if (myPosts.length > 0) {
      return myPosts;
    }

    setLoading(true);
    const start = Date.now();

    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:author_id(name)
      `)
      .eq('author_id', userId)
      .order('created_at', { ascending: false });

    const elapsed = Date.now() - start;
    const delay = Math.max(0, 800 - elapsed);

    if (error) {
        console.error(error);
    } else {
        setMyPosts(data || []);
    }

    setTimeout(() => {
        setLoading(false);
    }, delay);

    return data;
  }, [myPosts.length]);


    
  /**
   * Fetch an individual post by ID.
   * Uses cache if post details already exist.
   *
   * @param {string} postId - ID of the post to fetch.
   * @returns {Promise<Post>}
  */
  const fetchPost = useCallback(async (postId) => {
      if (!postId) return;

      if (postDetails[postId]) {
        return postDetails[postId];
      }

      setLoading(true);
      const start = Date.now();

      const { data, error } = await supabase
        .from('posts')
        .select(`
            *,
            author:author_id(name)
        `)
        .eq('id', postId)
        .single();

      const elapsed = Date.now() - start;
      const delay = Math.max(0, 800 - elapsed);

      if (error) {
          console.error(error);
      } else {
          setPostDetails(prev => ({ ...prev, [postId]: data }));
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
    }}>
      {children}
    </PostsContext.Provider>
  );
}


/**
 * Custom React hook to access blog post data.
 * Must be used within a `<PostsProvider>`.
 *
 * @throws {Error} If called outside of a PostsProvider.
 * @returns {PostsContextType} The posts context object.
 */
export function usePosts() {
    const context = useContext(PostsContext);
    if (!context) {
        throw new Error('usePosts must be used within PostsProvider');
    }
    return context;
}
