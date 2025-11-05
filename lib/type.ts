import { z } from "zod";
import { courseSchema } from "./zodSchemas";

export type User = {
    name: string,
    email: string,
    image: string,
};

export type CourseSchemaType = z.infer<typeof courseSchema>

export type BaseFormatItem = {
    name: string;
    icon: React.ReactNode;
    onPressedChange: () => void;
}

export type ContentFormatItem = BaseFormatItem & {
    pressed: boolean;
    className: string;
}

export type StatusFormatItem = BaseFormatItem & {
    stausDisabled: boolean;
}

export type UploadState = {
    id: string | null;
    file: File | null;
    uploading: boolean;
    progress: number;
    key?: string;
    isDeleting: boolean;
    error: boolean;
    objectUrl?: string;
    fileType: "image" | "video";
}