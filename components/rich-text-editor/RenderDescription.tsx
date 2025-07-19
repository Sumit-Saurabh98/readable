"use client"

import { useEffect, useState } from "react";
import { type JSONContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import parse from "html-react-parser"

export function RenderDescription({ json }: { json: JSONContent }) {
    const [output, setOutput] = useState<string>("");

    useEffect(() => {
        // Only run on client side
        if (typeof window !== 'undefined') {
            import('@tiptap/html').then(({ generateHTML }) => {
                const html = generateHTML(json, [
                    StarterKit,
                    TextAlign.configure({
                        types: ['heading', 'paragraph'],
                    })
                ]);
                setOutput(html);
            });
        }
    }, [json]);

    if (!output) return <div>Loading...</div>;

    return (
        <div className="prose dark:prose-invert prose-li:marker:text-primary">
            {parse(output)}
        </div>
    )
}
