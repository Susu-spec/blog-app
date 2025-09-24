
import BlockRenderer from "@/components/shared/BlockRenderer";
import { toaster } from "@/components/ui/toaster";
import { usePost } from "@/hooks/usePost";
import { extractMeta } from "@/lib/helper";
import { Box, Container, Flex, Heading, Image, Skeleton, Text } from "@chakra-ui/react";
import { HiPencil } from "react-icons/hi2";
import { LuPencil } from "react-icons/lu";
import { useNavigate, useParams } from "react-router";

export default function PostDetail() {
    const { id } = useParams();
    const { post, loading, error } = usePost(id);
    
    const navigate = useNavigate();
     const {
        title,
        description,
        cover_image,
        created_at,
        updated_at,
        content,
        author_name
    } = post || {};


   const blocks = content;
    
   const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(
                `https://www.susu-blog.vercel.app/posts/${id}`
            )
            toaster.create({
                description: "Share link copied to your clipboard",
                type: "info",
            })
            } catch (err) {
            console.error("Failed to copy text:", err)
            toaster.create({
                title: "Try again",
                description: "Failed to copy link",
                type: "error",
            })
        }
    }

    if (error) return <p>No post retrieved. Please retry.</p>

    // if (loading) return <p>Retrieving post...</p>

    return (
        <Box>
            <Flex
                flexDirection="column"
            >
                <Box width="100%" textAlign="center" pb={3}>
                    <Text 
                        color="linkText" 
                        fontSize=".8125rem"
                    >
                        Now
                    </Text>
                </Box>
                <Heading 
                    as="h1"
                    fontSize={{ base: "4xl", lg: "3rem"}}
                    width="100%"
                    marginX="auto"
                    textAlign="center"
                >
                    {title || "No title."}
                </Heading>
                <Container
                    as="article"
                >
                    <Box
                        marginY={{ base: 6, lg: 12 }}
                        marginX="auto"
                    >
                        {!cover_image ?
                            <Skeleton width="100%" height={440} /> :
                            <Image 
                                src={cover_image}
                                borderRadius="sm"
                                width="100%"
                                height={440}
                                objectFit={{ base: "fill", lg: "cover" }}
                            />
                        }
                    </Box>
                    <Flex color="linkText" alignItems="center" justifyContent="center">
                        <Text as="span">{author_name || "Unknown Author"}</Text>
                        <Text as="span" marginInline=".625rem">·</Text>
                        <Text as="time">{new Date(created_at).toLocaleDateString()}</Text>
                        <Text as="span" marginInline=".625rem">·</Text>
                        {/* Add copy text, trigger toast */}
                        <div className="flex gap-2.5 items-center">
                            <button 
                                onClick={() => handleCopy()} 
                                className="cursor-pointer">
                                    Copy Text
                            </button>
                            <button 
                                onClick={() => navigate(`/posts/${id}/edit`)} 
                                className="cursor-pointer"
                            >
                                <LuPencil size={10} color="buttonText" />
                            </button>
                        </div>
                        
                    </Flex>
                    <Box 
                        marginTop={{ base: "2.75rem", lg: "4.75rem" }}
                        marginBottom={{ base: "4rem", lg: "8rem" }}
                        marginInline="auto"
                        maxWidth="prose"
                        color="bodyText"
                    >
                        {content !== "" ? 
                        // ""
                            <BlockRenderer blocks={blocks} />
                            :
                            "No content attached."
                        }
                    </Box>
                </Container>
            </Flex>
        </Box>
    )
}