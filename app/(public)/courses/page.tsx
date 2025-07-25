import { getAllCourses } from "@/app/data/course/get-all-courses"
import { PublicCourseCard, PublicCourseCardSkeleton } from "../_components/PublicCourseCard"
import { Suspense } from "react"

export const dynamic = "force-dynamic" // for to render dynamically

export default function PublicCoursesRoute(){
    return (
        <div className="mt-5">
            <div className="flex flex-col space-y-2 mb-10">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Explore Courses</h1>
                <p className="text-muted-foreground">
                    Discover a wide range of courses from top instructors around the world.
                </p>
            </div>

            <Suspense fallback={<LoadingSkeletonLayout />}>

            <RenderCourses />
            </Suspense>

        </div>
    )
}

async function RenderCourses(){
    const courses = await getAllCourses()

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {
                courses.map((course) => (
                    <PublicCourseCard key={course.id} data={course}/>
                ))
            }
        </div>
    )
}

function LoadingSkeletonLayout(){
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {
                Array.from({length: 9}).map((_, i) => (
                    <PublicCourseCardSkeleton key={i} />
                ))
            }
        </div>
    )
}