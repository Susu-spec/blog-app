
import { toaster } from "@/components/ui/toaster";
import { postDetail } from "@/data/post-detail";
import { Box, Container, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { HiPencil } from "react-icons/hi2";
import { LuPencil } from "react-icons/lu";
import { useNavigate, useParams } from "react-router";

export default function PostDetail() {
    const { slug } = useParams();
    
    const navigate = useNavigate();
    
   const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(
                `https://www.susu-blog.vercel.app/posts/${slug}`
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

    return (
        <Box>
            {postDetail.map((post) => {
                const { 
                    id, 
                    title, 
                    subtitle, 
                    img, 
                    date, 
                    author, 
                    summary, 
                    tags, 
                    content 
                } = post;

                return(
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
                            // maxWidth="56.25rem"
                            marginX="auto"
                            textAlign="center"
                        >
                            {title}
                        </Heading>
                        <Container
                            as="article"
                        >
                            <Box
                                marginY={{ base: 6, lg: 12 }}
                                marginX="auto"
                            >
                                <Image 
                                    src={img}
                                    borderRadius="sm"
                                    width="100%"
                                    height={440}
                                    objectFit={{ base: "fill", lg: "cover" }}
                                />
                            </Box>
                            <Flex as="p" color="linkText" alignItems="center" justifyContent="center">
                                <Text as="span">{author}</Text>
                                <Text as="span" marginInline=".625rem">·</Text>
                                <Text as="time">{date}</Text>
                                <Text as="span" marginInline=".625rem">·</Text>
                                {/* Add copy text, trigger toast */}
                                <div className="flex gap-2.5 items-center">
                                    <button 
                                        onClick={() => handleCopy()} 
                                        className="cursor-pointer">
                                            Copy Text
                                    </button>
                                    <button 
                                        onClick={() => navigate(`/post/${id}/edit`)} 
                                        className="cursor-pointer"
                                    >
                                        <LuPencil size={16} color="buttonText" />
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
                                {content}
                            </Box>
                        </Container>
                    </Flex>
                )
            })}
        </Box>
    )
}