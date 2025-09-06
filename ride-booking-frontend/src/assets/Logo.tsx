
import { useTheme } from "@/providers/Theme.Providers";
import { Link } from "react-router";

export default function Logo() {
    return (
        <div>
            <Link to="/">
                <img
                    className="h-8"
                    src={
                        useTheme().theme === "dark"
                            ? "https://res.cloudinary.com/dpfdsilzj/image/upload/v1757193096/download_1_1_wj8mad.png"
                            : "https://res.cloudinary.com/dpfdsilzj/image/upload/v1757193096/download_1_1_wj8mad.png"
                    }
                    alt="Logo"
                />
            </Link>
        </div>
    )
}
