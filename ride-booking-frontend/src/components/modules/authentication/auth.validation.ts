import { Role } from "@/components/constant.ts/role";
import z from "zod";

const vehicleInfoSchema = z.object({
    model: z.string().min(1, "Vehicle model is required"),
    license: z.string().min(1, "License is required"),
    plateNumber: z.string().min(1, "Plate number is required"),
});

export const registrationSchema = z.discriminatedUnion("role", [
    z.object({
        role: z.literal(Role.RIDER),
        name: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(6),
        confirmPassword: z.string().min(6),
    }),
    z.object({
        role: z.literal(Role.DRIVER),
        name: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(6),
        confirmPassword: z.string().min(6),
        vehicleInfo: vehicleInfoSchema,
    }),
    z.object({
        role: z.literal(Role.ADMIN),
        name: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(6),
        confirmPassword: z.string().min(6),
    }),
]).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export const loginSchema = z.object({
    email: z.email().min(2).max(50),
    password: z.string().min(6).max(50),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
export type RegistrationSchemaType = z.infer<typeof registrationSchema>;