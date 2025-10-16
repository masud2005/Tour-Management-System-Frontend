import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Dot } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";

import { cn } from "@/lib/utils";
import {
    useSendOtpMutation,
    useVerifyOtpMutation,
} from "@/redux/features/auth/auth.api";

const FormSchema = z.object({
    pin: z.string().min(6, {
        message: "Your one-time password must be 6 digits.",
    }),
});

export default function Verify() {
    const location = useLocation();
    const navigate = useNavigate();
    const [email] = useState(location.state);
    const [otpSent, setOtpSent] = useState(false);
    const [timer, setTimer] = useState(0);
    const [sendOtp] = useSendOtpMutation();
    const [verifyOtp] = useVerifyOtpMutation();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            pin: "",
        },
    });

    // Handle send OTP
    const handleSendOtp = async () => {
        const toastId = toast.loading("Sending OTP...");
        try {
            const res = await sendOtp({ email }).unwrap();
            if (res.success) {
                toast.success("OTP Sent Successfully", { id: toastId });
                setOtpSent(true);
                setTimer(120); // 120 seconds countdown
            }
        } catch (err) {
            toast.error("Failed to send OTP", { id: toastId });
            console.error(err);
        }
    };

    // Handle verify OTP
    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        const toastId = toast.loading("Verifying OTP...");
        const userInfo = { email, otp: data.pin };

        try {
            const res = await verifyOtp(userInfo).unwrap();
            if (res.success) {
                toast.success("OTP Verified Successfully", { id: toastId });
                navigate("/dashboard"); // change route as you need
            }
        } catch (err) {
            toast.error("Invalid or expired OTP", { id: toastId });
            console.error(err);
        }
    };

    // Redirect if email missing
    useEffect(() => {
        if (!email) {
            navigate("/");
        }
    }, [email, navigate]);

    // Countdown timer
    useEffect(() => {
        if (timer <= 0) return;
        const timerId = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timerId);
    }, [timer]);

    return (
        <div className="grid place-content-center h-screen">
            {otpSent ? (
                <Card className="w-[400px]">
                    <CardHeader>
                        <CardTitle className="text-xl">Verify your email address</CardTitle>
                        <CardDescription>
                            Please enter the 6-digit code sent to <br />
                            <span className="font-medium">{email}</span>
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <Form {...form}>
                            <form
                                id="otp-form"
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                <FormField
                                    control={form.control}
                                    name="pin"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>One-Time Password</FormLabel>
                                            <FormControl>
                                                <InputOTP maxLength={6} {...field}>
                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={0} />
                                                    </InputOTPGroup>
                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={1} />
                                                    </InputOTPGroup>
                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={2} />
                                                    </InputOTPGroup>
                                                    <Dot />
                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={3} />
                                                    </InputOTPGroup>
                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={4} />
                                                    </InputOTPGroup>
                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={5} />
                                                    </InputOTPGroup>
                                                </InputOTP>
                                            </FormControl>

                                            <FormDescription>
                                                <Button
                                                    onClick={handleSendOtp}
                                                    type="button"
                                                    variant="link"
                                                    disabled={timer !== 0}
                                                    className={cn("p-0 m-0", {
                                                        "cursor-pointer text-blue-600": timer === 0,
                                                        "text-gray-500": timer !== 0,
                                                    })}
                                                >
                                                    Resend OTP
                                                </Button>{" "}
                                                {timer > 0 && `(${timer}s)`}
                                            </FormDescription>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </form>
                        </Form>
                    </CardContent>

                    <CardFooter className="flex justify-end">
                        <Button form="otp-form" type="submit">
                            Verify
                        </Button>
                    </CardFooter>
                </Card>
            ) : (
                <Card className="w-[400px]">
                    <CardHeader>
                        <CardTitle className="text-xl">Verify your email address</CardTitle>
                        <CardDescription>
                            We will send you an OTP at <br />
                            <span className="font-medium">{email}</span>
                        </CardDescription>
                    </CardHeader>

                    <CardFooter className="flex justify-end">
                        <Button onClick={handleSendOtp} className="w-full">
                            Send OTP
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
}
