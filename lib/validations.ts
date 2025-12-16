import { z } from "zod";

const noHtmlRegex = /^[^<>]*$/;

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters")
    .regex(noHtmlRegex, "Title contains invalid characters (HTML tags are not allowed)"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .regex(noHtmlRegex, "Description contains invalid characters")
    .optional()
    .or(z.literal("")),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title cannot be empty")
    .max(100, "Title must be less than 100 characters")
    .regex(noHtmlRegex, "Title contains invalid characters")
    .optional(),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .regex(noHtmlRegex, "Description contains invalid characters")
    .optional()
    .or(z.literal(""))
    .nullable(),
  isCompleted: z.boolean().optional(),
});
