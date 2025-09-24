import { Box, Grid, GridItem } from "@chakra-ui/react";
import PostCard from "./PostCard";
import React from "react";
import { supabase } from "@/lib/supabase";

export default function PostList({ posts }) {
    if (posts.length === 0) {
        return <p className="italic">No posts available.</p>
    }

    return (
        <Grid
            gapX={0}
            gapY={{
                base: 4,
                md: 16
            }}
            templateColumns={{ base: "1fr", lg: "1fr 80px 1fr"}}
        >

            {posts.map((post, index) => {
                const { 
                    id, 
                    title,
                    description,
                    author_id, 
                    cover_image, 
                    created_at, 
                    author_name, 
                    content 
                } = post;

                if (posts.length === 1) {

                    return (
                        <PostCard
                            id={id}
                            key={id}
                            title={title}
                            description={description}
                            img={cover_image}
                            date={new Date(created_at).toLocaleDateString()}
                            authorName={author_name}
                            content={content}
                        />
                    )
                }

                if (index % 2 === 0 && posts[index + 1]) {

                    return (
                        <React.Fragment key={id}>
                            <GridItem>
                                <PostCard
                                    id={id}
                                    key={id}
                                    title={title}
                                    description={description}
                                    img={cover_image}
                                    date={new Date(created_at).toLocaleDateString()}
                                    authorName={author_name}
                                    content={content}
                                />
                            </GridItem>

                            <GridItem
                                display="flex"
                                alignItems="center"
                                justifySelf="center"
                                >
                                <Box
                                    w="1px"
                                    h="100%"
                                    backgroundColor="#18191a"
                                    borderRadius="full"
                                />
                            </GridItem>

                            <GridItem>
                                <PostCard
                                    id={posts[index + 1].id}
                                    key={posts[index + 1].id}
                                    title={posts[index + 1].title}
                                    description={posts[index + 1].description}
                                    img={posts[index + 1].cover_image}
                                    date={new Date(posts[index + 1].created_at).toLocaleDateString()}
                                    authorName={posts[index + 1].author_name}
                                    content={posts[index + 1].content}
                                />
                            </GridItem>
                        </React.Fragment>
                    );
                }
                return null;
            })}
        </Grid>

    )
}