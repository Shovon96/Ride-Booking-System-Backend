import type { ReactNode } from "react"
import Navbar from "./Navbar"
import Footer from "./Footer"


interface IProps {
    children: ReactNode
}

export default function MainLayout({ children }: IProps) {
    return (
        <div className=" min-h-screen flex flex-col container m-auto" >
            <Navbar />
            <div className="grow-1 min-h-screen">{children}</div>
            <Footer />
        </div >
    )
}
