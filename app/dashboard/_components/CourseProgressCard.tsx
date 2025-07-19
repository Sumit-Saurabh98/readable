"use client"
import { EnrolledCourseType } from "@/app/data/user/get-enrolled-courses";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { useCourseProgress } from "@/hooks/use-course-progress";
import Image from "next/image";
import Link from "next/link";

interface iAppProps{
    data: EnrolledCourseType
}

export function CourseProgressCard({data}: iAppProps) {

    const thumbnailUrl = useConstructUrl(data.Course.fileKey);

    const {completedLessons, progressPercentage, totalLessons} = useCourseProgress({courseData: data.Course});

    return (
        <Card className="group relative py-0 gap-0">
            <Badge className="absolute top-2 right-2 z-10">{data.Course.level}</Badge>
            <Image src={thumbnailUrl} alt="Thumbnail image of course" width={600} height={400} className="w-full rounded-t-xl aspect-video h-full object-cover"/>

            <CardContent className="p-4">   
                <Link className="font-medium text-lg text-white line-clamp-2 hover:underline group-hover:text-primary transition-colors" href={`/dashboard/${data.Course.slug}`}>{data.Course.title}</Link>

                <p className="line-clamp-2 text-sm text-muted-foreground leading-tight my-2">{data.Course.smallDescription}</p>

                <div className="flex justify-between mb-1 text-sm">
                    <p className="">Progress:</p>
                    <p className="font-medium">{progressPercentage}%</p>
                </div>

                <Progress value={progressPercentage} className="h-1.5"/>

                <p className="text-xs text-muted-foreground mt-1">{completedLessons} of {totalLessons} lessons completed</p>

                <Link href={`/dashboard/${data.Course.slug}`} className={buttonVariants({
                    className: "mt-4 w-full",
                })}>Learn More</Link>
            </CardContent>
        </Card>
    )
}

export function PublicCourseCardSkeleton() {
    return (
        <Card className="group relative py-0 gap-0">
            <div className="absolute top-2 right-2 z-10 flex items-center">
                <Skeleton className="h-6 w-20 rounded-full"/>
            </div>
            <div className="w-full relative h-fit">
                <Skeleton className="w-full rounded-t-xl aspect-video"/>
            </div>

            <CardContent className="p-4">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-full"/>
                    <Skeleton className="h-6 3/4"/>
                </div>

                <div className="space-y-2">
                    <Skeleton className="h-4 w-full"/>
                    <Skeleton className="h-4 w-2/3"/>
                </div>

                <div className="mt-4 flex items-center gap-x-5">
                    <div className="flex items-center gap-x-2">
                    <Skeleton className="sixe-6 rounded-md"/>
                    <Skeleton className="h-4 w-8"/>
                    </div>

                    <div className="flex items-center gap-x-2">
                    <Skeleton className="sixe-6 rounded-md"/>
                    <Skeleton className="h-4 w-8"/>
                    </div>
                </div>

                <Skeleton className="w-full h-10 rounded-md mt-4"/>
            </CardContent>
        </Card>
    )
}