import { z } from "zod";
import { courseSchema } from "./zodSchemas";

export type User = {
    name: string,
    email: string,
    image: string,
};

export type CourseSchemaType = z.infer<typeof courseSchema>