import { supabase } from "@/lib/supabase";
import { createContext, useCallback, useContext, useState } from "react";

const PostsContext = createContext();

export function PostsProvider({ children }) {
  const [allPosts, setAllPosts] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [postDetails, setPostDetails] = useState({});
  const [loading, setLoading] = useState(false);

//   Fetch all posts
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


//   Fetch user specific posts
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


    //   Fetch Individual Post
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

  // Clear cache when user creates/deletes/updates a post
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


export function usePosts() {
    const context = useContext(PostsContext);
    if (!context) {
        throw new Error('usePosts must be used within PostsProvider');
    }
    return context;
}
