import { Spinner } from "@chakra-ui/react";


export default function Loader() {
    return (
        <div 
            data-cy="loading-spinner"
            data-testid="loading-spinner"
            className="fixed inset-0 z-[999999] flex items-center justify-center backdrop-blur-sm bg-black/20"
        >
            <Spinner size="lg" borderWidth="4px" color="buttonActiveText"/>
        </div>
    )
}