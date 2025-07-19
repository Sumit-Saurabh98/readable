'use client';

import { useConstructUrl } from "@/hooks/use-construct-url";
import Image from "next/image";

interface CourseImageProps {
  fileKey: string;
  alt?: string;
}

export function CourseImage({ fileKey, alt = "Course thumbnail" }: CourseImageProps) {
  const thumbnailUrl = useConstructUrl(fileKey);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
      <Image
        src={thumbnailUrl}
        alt={alt}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
    </div>
  );
}