"use client";
import {EditorContent, useEditor} from "@tiptap/react"
import StartterKit from "@tiptap/starter-kit"
import TextAlign from "@tiptap/extension-text-align"
import { MenuBar } from "./MenuBar";



export function RichTextEditor({fields}: {
    fields: { value: string; onChange: (val: string) => void };
  }) {
    const getInitialContent = () => {
        if (!fields.value) {
            return '<p>Provide description about the course</p>';
        }
        
        try {
            // Try to parse as JSON first (for TipTap JSON format)
            return JSON.parse(fields.value);
        } catch {
            // If JSON parsing fails, treat it as HTML string
            return fields.value;
        }
    };

    const editor = useEditor({
        extensions: [StartterKit, TextAlign.configure({
            types: ['heading', 'paragraph'],
        })],
        editorProps: {
            attributes: {
                class: 'min-h-[300px] p-4 focus:outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert !w-full !max-w-none',
            }
        },

        immediatelyRender: false,

        onUpdate: ({editor}) => {
            fields.onChange(JSON.stringify(editor.getJSON()))
        },
        content: getInitialContent(),
    })

    return (
        <div className="w-full border border-input rounded-lg overflow-hidden dark:bg-input/30">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    )
}