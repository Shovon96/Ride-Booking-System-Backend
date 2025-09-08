import config from "@/components/config/env.config";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Password from "@/components/ui/Password";
import { cn } from "@/lib/utils";
import { useLoginMutation } from "@/redux/features/auth.api";
import { useForm, type FieldValues, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

export function LoginForm({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    const navigate = useNavigate();
    const form = useForm();
    const [login] = useLoginMutation();
    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        try {
            const res = await login(data).unwrap();
            if (res.success) {
                toast.success("Login Successful", {duration: 5000});
                navigate("/");
            }
        } catch (err: any) {
            console.error(err);
            toast.error(`${err.data.message}`, { duration: 5000 });
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Login to your account</h1>
                <p className="text-balance text-sm text-muted-foreground">
                    Enter your email below to login to your account
                </p>
            </div>
            <div className="grid gap-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            required
                                            placeholder="john@example.com"
                                            {...field}
                                            value={field.value || ""}
                                        />
                                    </FormControl>
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
                                        <Password required {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full cursor-pointer">
                            Login
                        </Button>
                    </form>
                </Form>

                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>

                <Button
                    onClick={() => window.open(`${config.baseUrl}/auth/google`)}
                    type="button"
                    variant="outline"
                    className="w-full cursor-pointer"
                >
                    Login with Google
                </Button>
            </div>
            <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link to="/register" replace className="underline underline-offset-4 cursor-pointer">
                    Register
                </Link>
            </div>
        </div>
    );
}