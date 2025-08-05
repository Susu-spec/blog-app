import { LinkBox } from "@chakra-ui/react";
import { useNavigate } from "react-router";

export default function PostCard() {
    const navigate = useNavigate();
    return (
        <LinkBox
            as="article"
            p={5}
            borderWidth={1}
            borderRadius="sm"
            shadow="md"
            _hover={{ shadow: 'lg', cursor: "pointer"}}
            onClick={() => navigate(`/posts/${post.id}`)}>
        </LinkBox>
    )
}