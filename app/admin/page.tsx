import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { SectionCards } from "@/components/sidebar/section-cards";
import { adminGetEnrollmentsStats } from "../data/admin/admin-get-enrollments-stats";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { adminGetRecentCourses } from "../data/admin/admin-get-recent-courses";
import { EmptyState } from "@/components/general/EmptyState";
import { AdminCourseCard, AdminCourseCardSkeleton } from "./courses/_components/AdminCourseCard";
import { Suspense } from "react";

export default async function AdminIndexPage() {

  const enrollmentData = await adminGetEnrollmentsStats();

  
  return (
    <>
      <SectionCards />
        <ChartAreaInteractive data={enrollmentData} />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recents Courses</h2>
            <Link href={'/admin/courses'} className={buttonVariants({
              variant: "outline"
            })}>
            View All Course</Link>
          </div>

          <Suspense fallback={<RenderCecentCoursesSkeletonLayout/>}>
            <RenderRecentCourses />
          </Suspense>
        </div>
    </>
  );
}

async function RenderRecentCourses(){
  const data = await adminGetRecentCourses();

  if(data.length === 0){
    return <EmptyState 
    buttonText="Create New Course"
    description="You have not created any courses"
    href="/admin/courses/create"
    title="You do not have any course yet"
    />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {
        data.map((course) =>(
          <AdminCourseCard key={course.id} data={course} />
        ))
      }
    </div>
  )
}

function RenderCecentCoursesSkeletonLayout(){
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {
        Array.from({length: 2}).map((_, i) => (
          <AdminCourseCardSkeleton key={i} />
        ))
      }
    </div>
  )
}
