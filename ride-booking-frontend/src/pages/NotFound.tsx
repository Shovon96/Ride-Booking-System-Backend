import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function NotFound() {
    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold my-4">This route is not found!!</h1>
            <Link to={"/"}><Button className="cursor-pointer" size="lg">Go Home</Button></Link>
        </div>
    )
}
