import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ShieldX } from "lucide-react";
import Link from "next/link";


export default function NotAdminRoute(){
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="max-w-md w-full">
                <CardHeader className="text-center">
                    <div className="bg-destructive/10 rounded-full p-4 w-fit mx-auto">
                        <ShieldX className="size-16 text-destructive" />
                    </div>

                    <CardTitle className="text-2xl">Access Restricted</CardTitle>
                    <CardDescription className="max-w-xs mx-auto">
                        Hey, you don&apos;t have access to this page
                    </CardDescription>
                    <CardContent>
                        <Link href={"/"} className={buttonVariants({className: "w-full md:w-auto"})}>
                        <ArrowLeft className="mr-1 size-4" />
                        Back to ome
                        </Link>
                    </CardContent>
                </CardHeader>
            </Card>
        </div>
    )
}