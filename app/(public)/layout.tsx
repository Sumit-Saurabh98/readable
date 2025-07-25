import Navbar from "@/app/(public)/_components/Navbar"

export default function LayoutPublic({children}: {children: React.ReactNode}) {
    return(
        <div className="">
            <Navbar />
            
            <main className="container mx-auto px-4 md:px-6 lg:px-8 mb-32">{children}</main>
        </div>
    )
}