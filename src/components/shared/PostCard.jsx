import { Box, Flex, Heading, Icon, Image, LinkBox, Skeleton, Text } from "@chakra-ui/react";
import { HiArrowRight } from "react-icons/hi2";
import { useNavigate } from "react-router";
import DeletePost from "./DeletePostModal";
import { useAuth } from "@/providers/AuthProvider";
import { useUser } from "@supabase/auth-helpers-react";

/**
 * PostCard component — displays a summary of a blog post with title, cover image,
 * and description. Clicking the card navigates to the full post.
 *
 * @component
 * @example
 * return (
 *   <PostCard
 *     post={{
 *       id: '1',
 *       slug: 'my-first-post',
 *       title: 'My First Post',
 *       description: 'An introduction to my journey.',
 *       author_id: '123',
 *       cover_image: '/cover.jpg',
 *       created_at: '2025-10-31T12:00:00Z',
 *       author: { name: 'Susu' },
 *       content: { blocks: [...] }
 *     }}
 *   />
 * )
 *
 * @param {Object} props
 * @param {{
 *   id: string,
 *   slug: string,
 *   title: string,
 *   description?: string,
 *   author_id: string,
 *   cover_image?: string,
 *   created_at: string,
 *   author?: { name: string },
 *   content?: { blocks: Array<Object> }
 * }} props.post - The post data object to display.
 *
 * @returns {JSX.Element} A clickable card displaying post information.
 */

export default function PostCard({ 
    post
}) {
    const { 
        id,
        slug, 
        title,
        description,
        author_id, 
        author_name,
        cover_image, 
        created_at, 
        author, 
        content 
    } = post;

    const navigate = useNavigate();
    const { blocks } = content;
    const { user } = useAuth();


    return (
        <LinkBox
            as="article"
            shadow="2xl"
            borderColor="formBorder"
            rounded="lg"
            p={6}
            borderWidth="1px"
            _hover={{ 
                cursor: "pointer",
                "& .hover-icon": { 
                    opacity: 1, 
                    transform: "translateX(2px)" 
                },
            }}  
            data-cy="post-card"
            onClick={() => (user && user?.id === author.id) ? navigate(`/my-posts/${slug}`) : navigate(`/posts/${slug}`)}
        >
            <Flex
                gap={5}
                flexDirection="column"
                maxWidth={{
                    base: "100%",
                    lg: 450
                }}
            >
                <LinkBox
                    overflow="hidden"
                    maxheight={252}
                    width="100%"
                    borderRadius="sm"
                    aspectRatio="auto"
                >
                    {!cover_image ? (
                        <Skeleton height={252} width="100%" />) :
                        <Image
                            borderRadius="sm"
                            src={cover_image}
                            width="100%"
                            height={252}
                            objectFit="fill"
                        />
                    }
                    
                </LinkBox>
                <Flex
                    flexDirection="column"
                    gap={{
                        base: 1,
                        lg: 2
                    }}
                    align="start"
                >
                    <Flex
                        justify="space-between"
                        width="100%">
                            <Text 
                                as="span"
                                color="#8a8f98"
                                fontSize=".8125rem"
                                lineHeight={1.5}
                                letterSpacing="-.01em"
                                width="100%"
                            >
                                {author_name || "Unknown Author"}
                                <Text 
                                    as="span" 
                                    display="inline-block" 
                                    marginInline={1}
                                >
                                    ·
                                </Text>
                                {new Date(created_at).toLocaleDateString()}
                            </Text>
                            <LinkBox>
                                <Icon
                                    as={HiArrowRight}
                                    className="hover-icon"
                                    opacity={0}
                                    transition="all 0.2s ease"
                                    boxSize={4}
                                />
                            </LinkBox> 
                    </Flex>
                    <Heading as="h3"
                        fontSize="1.5rem"
                        lineHeight={1.33}
                        letterSpacing="-0.012em"
                        fontWeight={600}
                    >
                        {title}
                    </Heading>
                    <Flex justifyContent="space-between" alignItems="center" width="100%">
                        <Text
                            fontSize=".875rem"
                            color="#8a8f98"
                            overflowWrap="anywhere"
                        >
                            {description}
                        </Text>
                        {user?.id === author_id && 
                            <DeletePost postId={id} />
                        } 
                    </Flex>
                </Flex>
            </Flex>
        </LinkBox>
    )
}



