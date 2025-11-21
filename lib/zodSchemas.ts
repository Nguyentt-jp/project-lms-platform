import * as z from "zod";

export const courseLevel = [
    "Beginner",
    "Intermediate",
    "Advanced",
];

export const courseStatus = [
    "Draft",
    "Published",
    "Archived",
];

export const courseCategories = [
    "Deployment",
    "Business",
    "Finance",
    "IT & Software",
    "Office Productivity",
    "Design",
    "Marketing",
    "Health & Fitness",
    "Music",
    "Teaching & Academics"
];
export const courseSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(
        3,
        "title must be at least 3 characters!"
    ).max(
        100,
        "title must be at most 100 characters!"
    ),
    description: z.string().min(
        3,
        "Description must be at least 3 characters!"
    ),
    fileKey: z.string().min(
        1,
        "File key is Required!"
    ),
    price: z.coerce.number<number>().min(
        1,
        "Price must be a positive number!"
    ),
    duration: z.coerce.number<number>().min(
        1,
        "duration must be at least 1 hour!"
    ).max(
        500,
        "duration must be at most 500 hour!"
    ),
    level: z.enum(
        courseLevel,
        "Level is required!"
    ),
    category: z.enum(
        courseCategories,
        "Category is required!"
    ),
    smallDescription: z.string().min(
        1,
        "Small description must be at least 1 characters!"
    ).max(
        500,
        "Small description must be at most 500 characters!"
    ),
    slug: z.string().min(
        3,
        "Slug must be at least 3 characters!"
    ),
    status: z.enum(
        courseStatus,
        "Status is required!"
    ),
});