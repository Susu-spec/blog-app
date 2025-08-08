import { useParams } from "react-router"

export default function PostDetail() {
    const { slug } = useParams();

    return (
        <>
            <h1>Post details</h1>
        </>
    )
}