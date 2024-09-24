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
    FormField,
    FormItem,
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

});

const page = () => {
    const [isAllDay, setIsAllDay] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {

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
                        <div>
                            <Label htmlFor="eventTitle">Event Title</Label>
                            <Input id="eventTitle" placeholder="Enter event title" />
                        </div>

                        <div>
                            <Label htmlFor="eventType">Event Type</Label>
                            <Select>
                                <SelectTrigger id="eventType">
                                    <SelectValue placeholder="Select event type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="court">Court Hearing</SelectItem>
                                    <SelectItem value="meeting">Client Meeting</SelectItem>
                                    <SelectItem value="deadline">Filing Deadline</SelectItem>
                                    <SelectItem value="deposition">Deposition</SelectItem>
                                    <SelectItem value="internal">Internal Meeting</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex space-x-4">
                            <div className="flex-1">
                                <Label htmlFor="startDate">Start Date</Label>
                                <Calendar id="startDate" mode="single" className="rounded-md border" />
                            </div>
                            <div className="flex-1">
                                <Label htmlFor="endDate">End Date</Label>
                                <Calendar id="endDate" mode="single" className="rounded-md border" />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch id="isAllDay" onCheckedChange={setIsAllDay} />
                            <Label htmlFor="isAllDay">All Day Event</Label>
                        </div>

                        {!isAllDay && (
                            <div className="flex space-x-4">
                                <div className="flex-1">
                                    <Label htmlFor="startTime">Start Time</Label>
                                    <Input id="startTime" type="time" />
                                </div>
                                <div className="flex-1">
                                    <Label htmlFor="endTime">End Time</Label>
                                    <Input id="endTime" type="time" />
                                </div>
                            </div>
                        )}

                        <div>
                            <Label htmlFor="location">Location</Label>
                            <Input id="location" placeholder="Enter event location" />
                        </div>

                        <div>
                            <Label htmlFor="relatedCase">Related Case</Label>
                            <Select>
                                <SelectTrigger id="relatedCase">
                                    <SelectValue placeholder="Select related case" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="case1">Smith vs. Johnson</SelectItem>
                                    <SelectItem value="case2">Doe Corporation Lawsuit</SelectItem>
                                    <SelectItem value="case3">Estate of Brown</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="participants">Participants</Label>
                            <Input id="participants" placeholder="Enter participant names or emails" />
                        </div>

                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" placeholder="Enter event description" />
                        </div>

                        <div>
                            <Label htmlFor="reminder">Reminder</Label>
                            <Select>
                                <SelectTrigger id="reminder">
                                    <SelectValue placeholder="Select reminder time" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="15min">15 minutes before</SelectItem>
                                    <SelectItem value="30min">30 minutes before</SelectItem>
                                    <SelectItem value="1hour">1 hour before</SelectItem>
                                    <SelectItem value="1day">1 day before</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex justify-end space-x-2">
                            <Button variant="outline">Cancel</Button>
                            <Button type="submit">Create Event</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default page
