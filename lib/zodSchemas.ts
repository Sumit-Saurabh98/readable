import z from "zod";

export const courseCategories = [
    "Development",
    "Business",
    "Finance",
    "IT & Software",
    "Office Productivity",
    "Personal Development",
    "Design",
    "Marketing",
    "health & Fitness",
    "Photography",
    "Health & Fitness",
    "Music",
    "Teaching & Academics"
] as const

export const courseLevels = ["Beginner", "Intermediate", "Advanced"] as const

export const courseStatus = ["Published", "Draft", "Archived"] as const

export const courseSchema = z.object({
    title: z.string().min(3, {message: "Title must be at least 3 characters long"}).max(100, {
        message: "Title must be less than 100 characters long"
    }),
    description: z.string().min(3, {message: "Description must be at least 3 characters long"}).max(5000, {
        message: "Description must be less than 5000 characters long"
    }),
    fileKey: z.string().min(1, {message: "File key is required"}),
    price: z.coerce.number().min(1, {message: "Price must be at least 1"}),
    duration: z.coerce.number().min(1, {message: "Duration must be at least 1 hours"}).max(500, {
        message: "Duration must be less than 500 hours"
    }),
    level: z.enum([...courseLevels], {message: "Level is required"}),
    category: z.enum([...courseCategories], {message: "Category is required"}),
    smallDescription: z.string().min(3, {message: "Small description must be at least 3 characters long"}).max(200, {
        message: "Small description must be less than 200 characters long"
    }),
    slug: z.string().min(3, {message: "Slug must be at least 3 characters long"}).max(100, {
        message: "Slug must be less than 100 characters long"
    }),
    status: z.enum([...courseStatus], {message: "Status is required"})
})

export const chapterSchema = z.object({
    name: z.string().min(3, {message: "Name must be at least 3 characters long"}).max(50, {
        message: "Name must be less than 50 characters long"
    }),
    courseId: z.string().uuid({message: "Course id is required"})
})

export const lessonSchema = z.object({
    name: z.string().min(3, {message: "Name must be at least 3 characters long"}).max(100, {
        message: "Name must be less than 100 characters long"
    }),
    courseId: z.string().uuid({message: "Course id is required"}),
    chapterId: z.string().uuid({message: "Chapter id is required"}),
    description: z.string().min(3, {message: "Description must be at least 3 characters long"}).optional(),
    thumbnailKey: z.string().min(1, {message: "Thumbnail key is required"}).optional(),
    videoKey: z.string().min(1, {message: "Video key is required"}).optional(),
})

export type CourseSchemaType = z.infer<typeof courseSchema>
export type ChapterSchemaType = z.infer<typeof chapterSchema>
export type LessonSchemaType = z.infer<typeof lessonSchema>