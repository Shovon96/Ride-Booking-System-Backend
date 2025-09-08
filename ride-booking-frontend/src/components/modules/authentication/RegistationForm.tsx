import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
// import { registrationSchema, type RegistrationSchemaType } from "@/validations/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { Role } from "@/components/constant.ts/role";
import { registrationSchema, type RegistrationSchemaType } from "./auth.validation";
import { useRegisterMutation } from "@/redux/features/auth.api";
import { toast } from "sonner";
import Password from "@/components/ui/Password";


export default function RegistrationForm() {
    const location = useLocation();
    const [role, setRole] = useState(location?.state ?? Role.RIDER);

    const form = useForm<RegistrationSchemaType>({
        resolver: zodResolver(registrationSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: role,
            vehicleInfo: {
                model: "",
                license: "",
                plateNumber: "",
            },
        },
        mode: "onSubmit"
    });


    const [register] = useRegisterMutation();
    // const { showToast, updateToast } = useMyToast();
    const navigate = useNavigate();

    useEffect(() => {
        if (form.watch("role") !== Role.DRIVER) {
            form.setValue("vehicleInfo", {
                model: "",
                license: "",
                plateNumber: "",
            });
        }
    }, [form.watch("role")]);

    const onSubmit = async (data: RegistrationSchemaType) => {
        try {
            const res = await register(data);
            console.log();
            if (res?.data?.statusCode === 201) {
                toast.success(`${res?.data?.message}`, { duration: 5000 });
                navigate("/login")
            }

            if (res?.data?.statusCode !== 201) {
                const errorMessage =
                    (res?.error && typeof res.error === "object" && "data" in res.error && (res.error as any).data?.message)
                        ? (res.error as any).data.message
                        : "Registration failed";
                toast.info(errorMessage, { duration: 5000 });
            }
        }
        catch (error: unknown) {
            console.log(error);
            toast.error("Something went wrong")
        }
    };
    // console.log( "Errors:", form.formState.errors );

    return (
        <div className={cn("flex flex-col gap-6")}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Register your account</h1>
                <p className="text-sm text-muted-foreground">
                    Enter your details to create an account
                </p>
            </div>

            <div className="grid gap-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormDescription className="sr-only">
                                        This is your public display name.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="john.doe@company.com"
                                            type="email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription className="sr-only">
                                        This is your valid email.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Password {...field} />
                                    </FormControl>
                                    <FormDescription className="sr-only">
                                        Type your password.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Password {...field} />
                                    </FormControl>
                                    <FormDescription className="sr-only">
                                        Type your confirm password.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Select option for Role */}
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Select Your Role For Register</FormLabel>
                                    <Select
                                        onValueChange={(val: keyof typeof Role) => {
                                            field.onChange(Role[val]);
                                            setRole(Role[val]);
                                        }}
                                        value={field.value}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Your Role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={Role.RIDER}>Rider</SelectItem>
                                            <SelectItem value={Role.DRIVER}>Driver</SelectItem>
                                            <SelectItem value={Role.ADMIN}>Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        {/* If user role is driver for vehicle info */}
                        {role === Role.DRIVER && (
                            <div>
                                <FormField
                                    control={form.control}
                                    name="vehicleInfo.model"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Vehicle Model</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., Toyota Prius" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="vehicleInfo.license"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>License</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., DHA-1234" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="vehicleInfo.plateNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Vehicle Plate Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., DHA-1234" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}

                        <Button type="submit" className="w-full cursor-pointer">
                            Submit
                        </Button>
                    </form>
                </Form>

                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    className="w-full cursor-pointer"
                >
                    Login with Google
                </Button>
            </div>

            <div className="text-center text-sm">
                Already have an account?{" "}
                <Link to="/login" className="underline underline-offset-4">
                    Login
                </Link>
            </div>
        </div>
    );
}