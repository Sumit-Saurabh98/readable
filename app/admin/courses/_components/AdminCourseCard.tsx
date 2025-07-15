import { AdminCourseType } from "@/app/data/admin/admin-get-courses";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { ArrowRight, Eye, MoreVertical, Pencil, SchoolIcon, TimerIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
interface iAppProps {
    data: AdminCourseType
}

export function AdminCourseCard({data}: iAppProps) {

    const thumbnailUrl = useConstructUrl(data.fileKey);

    return (
        <Card className="group relative py-0 gap-0">
            {/* Absolute drop down */}
            <div className="absolute top-2 right-2 z-10">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={"secondary"} size="icon">
                            <MoreVertical className="w-4 h-4"/>
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/courses/${data.id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4"/>
                            <span>Edit Course</span>
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                            <Link href={`/courses/${data.slug}`}>
                            <Eye className="mr-2 h-4 w-4"/>
                            <span>Preview Course</span>
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator/>

                        <DropdownMenuItem asChild>
                            <Link href={`/admin/courses/${data.id}/delete`}>
                            <Trash2 className="mr-2 h-4 w-4 text-destructive"/>
                            <span>Delete Course</span>
                            </Link>
                        </DropdownMenuItem>

                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <Image src={thumbnailUrl} alt={data.title} width={600} height={400} className="w-full rounded-t-lg aspect-video h-full object-cover"/>
            <CardContent className="p-4">
                <Link className="font-medium text-lg line-clamp-2 hover:underline group-hover: text-primary transition-colors" href={`/admin/courses/${data.id}/edit`}>{data.title}</Link>

                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground leading-tight">{data.smallDescription}</p>

                <div className="mt-4 flex items-center gap-x-5">
                    <div className="flex items-center gap-x-2">
                        <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary/10"/>
                        <p className="text-sm text-muted-foreground">{data.duration}h</p>
                    </div>

                    <div className="flex items-center gap-x-2">
                        <SchoolIcon className="size-6 p-1 rounded-md text-primary bg-primary/10"/>
                        <p className="text-sm text-muted-foreground">{data.level}</p>
                    </div>
                </div>

                <Link href={`/admin/courses/${data.id}/edit`} className={buttonVariants({
                    className: "w-full mt-4",
                })}>Edit Course <ArrowRight className="size-4"/> </Link>
            </CardContent>

        </Card>
    )
}
