import { Box, Grid, GridItem } from "@chakra-ui/react";
import PostCard from "./PostCard";
import React from "react";

export default function PostList({ posts }) {
    return (
        <Grid
            gapX={0}
            gapY={16}
            templateColumns={{ base: "1fr", lg: "1fr 80px 1fr"}}
        >
            {posts.map((post, index) => {
                const { id, title, subtitle, img, date, author } = post;

                if (index % 2 === 0 && posts[index + 1]) {
                return (
                    <React.Fragment key={id}>
                        <GridItem>
                            <PostCard
                                title={title}
                                subtitle={subtitle}
                                img={img}
                                date={date}
                                author={author}
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
                                key={posts[index + 1].id}
                                title={posts[index + 1].title}
                                subtitle={posts[index + 1].subtitle}
                                img={posts[index + 1].img}
                                date={posts[index + 1].date}
                                author={posts[index + 1].author}
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