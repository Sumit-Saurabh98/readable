"use client"
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { tryCatch } from "@/hooks/try-catch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { createLesson } from "../actions";
import { toast } from "sonner";
import { lessonSchema, LessonSchemaType } from "@/lib/zodSchemas";

export function NewLessonModal({courseId, chapterId}:{courseId:string, chapterId:string}) {
    const [isOpen, setIsOpen] = useState(false)
    const [pending, startTramsition] = useTransition()

    const form = useForm<LessonSchemaType>({
        resolver: zodResolver(lessonSchema),
        defaultValues: {
            name: "",
            courseId: courseId,
            chapterId: chapterId
        },
    })

    async function onSubmit(values: LessonSchemaType){
        startTramsition(async () => {
            const {data: result, error} = await tryCatch(createLesson(values))

            if(error){
                toast.error("Unexpected error occured, Please try again")
                return;
            }

            if(result.status === 'success'){
                toast.success(result.message)
                form.reset()
                setIsOpen(false)
            }else if(result.status === 'error'){
                toast.error(result.message)
            }
        })
    }

    function handleOpenChange(open:boolean){

        if(!open){
            form.reset()
        }

        setIsOpen(open)
    }


    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant={"outline"} size="sm" className="w-full justify-center gap-1"><Plus className="mr-2 h-4 w-4" />New Lesson</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Lesson</DialogTitle>
                    <DialogDescription>What would you like to name you name your lesson?</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                        control={form.control}
                        name="name"
                        render={({field})=>(
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Lesson Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />

                        <DialogFooter>
                            <Button disabled={pending} type="submit">
                                {pending ? (<>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                                </>) : "Save Change"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}