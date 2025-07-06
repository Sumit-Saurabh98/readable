"use client";
import {EditorContent, useEditor} from "@tiptap/react"
import StartterKit from "@tiptap/starter-kit"
import TextAlign from "@tiptap/extension-text-align"
import { MenuBar } from "./MenuBar";
export function RichTextEditor({fields}: {fields: any}) {
    const editor = useEditor({
        extensions: [StartterKit, TextAlign.configure({
            types: ['heading', 'paragraph'],
        })],
        editorProps: {
            attributes: {
                class: 'min-h-[300px] p-4 focus:outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert !w-full !max-w-none',
            }
        },

        onUpdate: ({editor}) =>{
            fields.onChange(JSON.stringify(editor.getJSON()))
        },
        content: fields.value ? JSON.parse(fields.value) : '<p>Hello world!🚀</p>',
    })

    return (
        <div className="w-full border border-input rounded-lg overflow-hidden dark:bg-input/30">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    )
}