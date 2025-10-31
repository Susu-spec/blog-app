import { Box, Grid, GridItem } from "@chakra-ui/react";
import PostCard from "./PostCard";
import React from "react";
import { supabase } from "@/lib/supabase";

export default function PostList({ posts }) {
    if (posts?.length === 0) {
        return <p className="italic">No posts available.</p>
    }

    return (
        <Grid
            gapX={0}
            gapY={{
                base: 6,
                lg: 16
            }}
            templateColumns={{ base: "1fr", lg: "1fr 80px 1fr"}}
            gridAutoFlow={{ lg: "repeat(auto-fit, minmax(min-width, 1fr))" }}
        >
            {posts?.map((post, index) => {

                // Skip if this post was already rendered as the second item in a pair
                if (index % 2 === 1) {
                    return null;
                }

                // Check if there's a next post for pairing
                const nextPost = posts[index + 1];
                const isLastOddPost = !nextPost;

                return (
                    <React.Fragment key={post.id}>
                        {/* First post */}
                        <GridItem>
                            <PostCard
                                post={post}
                            />
                        </GridItem>

                        {/* Divider - only show if there's a next post */}
                        {!isLastOddPost && (
                            <GridItem
                                alignItems="center"
                                justifySelf="center"
                                display={{
                                    base: "none",
                                    lg: "flex"
                                }}
                            >
                                <Box
                                    w="1px"
                                    h="100%"
                                    backgroundColor="#18191a"
                                    borderRadius="full"
                                />
                            </GridItem>
                        )}

                        {/* Second post or empty space */}
                        <GridItem>
                            {nextPost ? (
                                <PostCard
                                    post={nextPost}
                                />
                            ) : (
                                // Empty space for odd number of posts
                                <Box 
                                    display={{
                                        base: "hidden",
                                        lg: "block"
                                    }}/>
                            )}
                        </GridItem>
                    </React.Fragment>
                );
            })}
        </Grid>
)}