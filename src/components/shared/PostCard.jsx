import { Box, Flex, Heading, Icon, Image, LinkBox, Skeleton, Text } from "@chakra-ui/react";
import { HiArrowRight } from "react-icons/hi2";
import { useNavigate } from "react-router";

export default function PostCard({ 
    id,
    img, 
    date, 
    content,
    authorName
}) {

    const navigate = useNavigate();
    const { blocks } = content;
    const { title, subtitle } = extractMeta(blocks);

    return (
        <LinkBox
            as="article"
            _hover={{ 
                cursor: "pointer",
                "& .hover-icon": { 
                    opacity: 1, 
                    transform: "translateX(2px)" 
                },
            }}
            // replace with id later
            onClick={() => navigate(`/posts/${id}`)}
            
        >
            <Flex
                gap={5}
                flexDirection="column"
                maxWidth={{
                    base: "100%",
                    lg: 450
                }}
            >
                <Box
                    overflow="hidden"
                    maxheight={252}
                    width="100%"
                    borderRadius="sm"
                    aspectRatio="auto"
                >
                    {!img ? (
                        <Skeleton height={252} width="100%" />) :
                        <Image
                            borderRadius="sm"
                            src={img}
                            width="100%"
                            height={252}
                            objectFit="cover"
                        />
                    }
                    
                </Box>
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
                                {authorName || "Unknown Author"}
                                <Text 
                                    as="span" 
                                    display="inline-block" 
                                    marginInline={1}
                                >
                                    ·
                                </Text>
                                {date}
                            </Text>
                            <Icon
                                as={HiArrowRight}
                                className="hover-icon"
                                opacity={0}
                                transition="all 0.2s ease"
                                boxSize={4}
                            />
                    </Flex>
                    <Heading as="h3"
                        fontSize="1.5rem"
                        lineHeight={1.33}
                        letterSpacing="-0.012em"
                        fontWeight={500}
                    >
                        {title}
                    </Heading>
                    <Text
                        fontSize=".875rem"
                        color="#8a8f98"
                        overflowWrap="anywhere"
                    >
                        {subtitle}
                    </Text>
                </Flex>
            </Flex>
        </LinkBox>
    )
}


function extractMeta(blocks) {
  const titleBlock = blocks?.find(b => b.type === "heading");
  const subtitleBlock = blocks?.find(b => b.type === "paragraph");

  return {
    title: titleBlock?.content?.[0]?.text || "Untitled",
    subtitle: subtitleBlock?.content?.[0]?.text || "No subtitle."
  };
}
