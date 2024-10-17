"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import toast, { Toaster } from 'react-hot-toast';
import { addDoc, collection } from 'firebase/firestore'
import { db, storage } from '@/lib/firebase'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

const errorMsg = () => toast('Failed to Add Client!!! Try Again!!!');
const added = () => toast('Client Added Successfully!!!');

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];

const formSchema = z.object({
    fullname: z.string().min(3, { message: "Full name must be at least 3 characters long" }),
    email: z.string().email({ message: "Please enter a valid email" }),
    phonenumber: z.string().min(10, { message: "Phone number must be at least 10 digits" }).regex(/^\d+$/, { message: "Phone number should contain only digits" }),
    address: z.string().min(5, { message: "Address must be at least 5 characters long" }),
    picture: z
        .any()
        .refine((files) => files?.length == 1, "Image is required.")
        .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
        .refine(
            (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
            ".jpg, .jpeg, and .png files are accepted."
        )
});

const page = () => {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullname: "",
            email: "",
            phonenumber: "",
            address: "",
            picture: undefined,
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsSubmitting(true)

            const file = values.picture[0];
            const storageRef = ref(storage, `client_images/${file.name}`);
            await uploadBytes(storageRef, file);
            const imageUrl = await getDownloadURL(storageRef);

            const docRef = await addDoc(collection(db, "Clients"), {
                fullname: values.fullname,
                email: values.email,
                phonenumber: values.phonenumber,
                address: values.address,
                imageUrl: imageUrl,
                createdAt: new Date().toISOString()
            });
            added();
        } catch (error) {
            console.log("Error adding Client: ", error)
            errorMsg()
        } finally {
            setIsSubmitting(false);
        }

        router.push("/clients/view")
    }

    return (
        <div className='bg-muted flex flex-col justify-center items-center align-middle w-full h-screen'>
            <Card className='w-11/12 md:w-3/4 lg:w-1/2'>
                <CardHeader>
                    <CardTitle className='text-center text-2xl md:text-3xl lg:text-4xl pb-3 font-bold'>Add Clients</CardTitle>
                    <CardDescription className='text-center text-base md:text-lg lg:text-xl pb-3'>Fill in the Form to Add a Client</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            {/* FullName */}
                            <FormField
                                control={form.control}
                                name="fullname"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder="Full Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Email */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder="Email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Phone Number */}
                            <FormField
                                control={form.control}
                                name="phonenumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder="Phone Number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Address */}
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder="Address" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Date Added */}
                            {/* <FormField
                                control={form.control}
                                name="dateAdded"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input type="date" placeholder="Date Added" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            /> */}

                            {/* Picture */}
                            <FormField
                                control={form.control}
                                name="picture"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                type="file"
                                                accept="image/jpeg, image/png"
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    const files = e.target.files;
                                                    if (files) {
                                                        field.onChange(files);
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Submit</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Toaster />
        </div>
    )
}

export default page
