"use client"

import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUserAlt } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useRouter } from 'next/navigation'

const loginSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const registerSchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters" }),
    email: z.string().email({ message: "Please enter a valid email" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const page = () => {
    const router = useRouter();

    const loginForm = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const registerForm = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    // State to handle password visibility
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);

    // Toggle functions
    const toggleLoginPasswordVisibility = () => setShowLoginPassword(!showLoginPassword);
    const toggleRegisterPasswordVisibility = () => setShowRegisterPassword(!showRegisterPassword);

    // Login
    const handleLogin = (data: z.infer<typeof loginSchema>) => {
        console.log("Login data:", {
            email: data.email,
            password: data.password,
        });

        router.push("/dashboard");
    }

    // Register
    const handleRegister = (data: z.infer<typeof registerSchema>) => {
        console.log("Register data:", data);
    }

    return (
        <div className='bg-muted flex flex-col justify-center items-center align-middle w-full h-screen'>
            <Card className={cn("w-4/5 lg:w-3/5")}>
                <CardHeader>
                    <CardTitle className='text-center text-2xl md:text-3xl lg:text-4xl pb-3 font-bold'>LawFirm Management</CardTitle>
                    <CardDescription className='text-center text-base md:text-lg lg:text-xl pb-3'>Login or Register to Continue</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="register">Register</TabsTrigger>
                        </TabsList>
                        <TabsContent value="login">
                            <Card className='py-10'>
                                <CardContent className="space-y-2">
                                    <Form {...loginForm}>
                                        <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-8">
                                            {/* Email */}
                                            <FormField
                                                control={loginForm.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <div className='relative'>
                                                                <MdEmail className='absolute left-2 top-1.5 h-6 w-6 text-primary' />
                                                                <Input placeholder="Email" {...field} className="pl-10" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* Password */}
                                            <FormField
                                                control={loginForm.control}
                                                name="password"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <div className='relative'>
                                                                <RiLockPasswordFill className='absolute left-2 top-1.5 h-6 w-6 text-primary' />
                                                                <Input
                                                                    placeholder="Password"
                                                                    type={showLoginPassword ? "text" : "password"}
                                                                    {...field} className="pl-10" />
                                                                <div
                                                                    className="absolute right-2 top-2.5 cursor-pointer"
                                                                    onClick={toggleLoginPasswordVisibility}
                                                                >
                                                                    {showLoginPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                                                                </div>
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <Button
                                                type="submit"
                                                className='w-full'
                                            >
                                                Login
                                            </Button>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="register">
                            <Card className='py-10'>
                                <CardContent className="space-y-2">
                                    <Form {...registerForm}>
                                        <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-8">
                                            {/* Name */}
                                            <FormField
                                                control={registerForm.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <div className='relative'>
                                                                <FaUserAlt className='absolute left-2 top-1.5 h-6 w-6 text-primary' />
                                                                <Input placeholder="Fullname" {...field} className="pl-10" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* Email */}
                                            <FormField
                                                control={registerForm.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <div className='relative'>
                                                                <MdEmail className='absolute left-2 top-1.5 h-6 w-6 text-primary' />
                                                                <Input placeholder="Email" {...field} className="pl-10" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* Password */}
                                            <FormField
                                                control={registerForm.control}
                                                name="password"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <div className='relative'>
                                                                <RiLockPasswordFill className='absolute left-2 top-1.5 h-6 w-6 text-primary' />
                                                                <Input placeholder="Password"
                                                                    type={showRegisterPassword ? "text" : "password"}
                                                                    {...field} className="pl-10"
                                                                />

                                                                <div
                                                                    className="absolute right-2 top-2.5 cursor-pointer"
                                                                    onClick={toggleRegisterPasswordVisibility}
                                                                >
                                                                    {showRegisterPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                                                                </div>
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <Button
                                                type="submit"
                                                className='w-full'
                                            >
                                                Register
                                            </Button>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}

export default page
