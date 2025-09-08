import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function Unauthorized() {
    return (
        <div className="h-screen flex flex-col justify-center items-center">
            <h1>Unauthorized</h1>
            <p>You do not have permission to access this page.</p>
            <Link to="/">
                <Button>Go to Home</Button>
            </Link>
        </div>
    )
}