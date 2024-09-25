"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { cn } from "@/lib/utils"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const error = () => toast('Failed to Add Event!!! Try Again!!!');
const added = () => toast('Event Added Successfully!!!');

const formSchema = z.object({
    eventTitle: z.string().min(1, "Event title is required"),
    eventType: z.enum(["court", "meeting", "deadline", "deposition", "internal", "other"]),
    startDate: z.date(),
    endDate: z.date(),
    isAllDay: z.boolean(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    location: z.string().min(1, "Location is required"),
    relatedCase: z.string(),
    participants: z.string(),
    description: z.string(),
    reminder: z.enum(["15min", "30min", "1hour", "1day"]),
})

const page = () => {
    const [isAllDay, setIsAllDay] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            eventTitle: "",
            eventType: "court",
            startDate: new Date(),
            endDate: new Date(),
            isAllDay: false,
            startTime: "",
            endTime: "",
            location: "",
            relatedCase: "",
            participants: "",
            description: "",
            reminder: "15min",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {


        console.log(values);

        added()

        router.push("/events")
    }

    return (
        <Card className="w-full max-w-2xl mx-auto my-10 bg-accent">
            <CardHeader>
                <CardTitle>Create New Event</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="eventTitle"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Event Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter event title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="eventType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Event Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select event type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="court">Court Hearing</SelectItem>
                                            <SelectItem value="meeting">Client Meeting</SelectItem>
                                            <SelectItem value="deadline">Filing Deadline</SelectItem>
                                            <SelectItem value="deposition">Deposition</SelectItem>
                                            <SelectItem value="internal">Internal Meeting</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex space-x-4">
                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Start Date</FormLabel>
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            className="rounded-md border"
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="endDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>End Date</FormLabel>
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            className="rounded-md border"
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="isAllDay"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">All Day Event</FormLabel>
                                        <FormDescription>
                                            Toggle if this is an all-day event
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {!isAllDay && (
                            <div className="flex space-x-4">
                                <FormField
                                    control={form.control}
                                    name="startTime"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Start Time</FormLabel>
                                            <FormControl>
                                                <Input type="time" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="endTime"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>End Time</FormLabel>
                                            <FormControl>
                                                <Input type="time" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}

                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter event location" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="relatedCase"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Related Case</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select related case" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="case1">Smith vs. Johnson</SelectItem>
                                            <SelectItem value="case2">Doe Corporation Lawsuit</SelectItem>
                                            <SelectItem value="case3">Estate of Brown</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="participants"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Participants</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter participant names or emails" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Enter event description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="reminder"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Reminder</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select reminder time" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="15min">15 minutes before</SelectItem>
                                            <SelectItem value="30min">30 minutes before</SelectItem>
                                            <SelectItem value="1hour">1 hour before</SelectItem>
                                            <SelectItem value="1day">1 day before</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => router.push("/events")}>Cancel</Button>
                            <Button type="submit">Create Event</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default page
