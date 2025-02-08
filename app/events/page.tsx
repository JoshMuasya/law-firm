"use client"

import { AlertTriangle, Briefcase, Clock, Edit, Trash2, Users } from 'lucide-react';
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import * as z from "zod"
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';


const eventSchema = z.object({
    id: z.number(),
    title: z.string().min(1, "Title is required"),
    type: z.enum(["court", "meeting", "deadline"]),
    time: z.string(),
    date: z.date(),
});

type Event = z.infer<typeof eventSchema>;

const page = () => {
    const [view, setView] = useState('month');
    const [selectedDate, setSelectedDate] = useState(new Date());

    const [events, setEvents] = useState<Event[]>([
        { id: 1, title: 'Court Hearing: Smith vs. Johnson', type: 'court', time: '09:00 AM', date: new Date() },
        { id: 2, title: 'Client Meeting: Jane Doe', type: 'meeting', time: '02:00 PM', date: new Date() },
        { id: 3, title: 'Filing Deadline: Case #1234', type: 'deadline', time: '11:59 PM', date: new Date(new Date().setDate(new Date().getDate() + 1)) },
    ]);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [eventToEdit, setEventToEdit] = useState<Event | null>(null);

    const form = useForm<Event>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            id: 0,
            title: "",
            type: "court",
            time: "",
            date: new Date(),
        },
    });

    const renderEventIcon = (type: String) => {
        switch (type) {
            case 'court':
                return <Briefcase className="h-4 w-4 mr-2" />;
            case 'meeting':
                return <Users className="h-4 w-4 mr-2" />;
            case 'deadline':
                return <AlertTriangle className="h-4 w-4 mr-2" />;
            default:
                return <Clock className="h-4 w-4 mr-2" />;
        }
    };

    const handleDeleteEvent = (event: Event) => {
        setEventToDelete(event);
        setDeleteDialogOpen(true);
    };

    const confirmDeleteEvent = () => {
        if (eventToDelete) {
            setEvents(events.filter(e => e.id !== eventToDelete.id));
        }
        setDeleteDialogOpen(false);
        setEventToDelete(null);
    };

    const handleUpdateEvent = (event: Event) => {
        setEventToEdit(event);
        form.reset(event);
        setEditDialogOpen(true);
    };

    const onSubmit = (data: Event) => {
        setEvents(events.map(e => e.id === data.id ? data : e));
        setEditDialogOpen(false);
    };

    const renderCalendar = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const currentDate = new Date();
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        let calendarDays = [];
        for (let i = 0; i < firstDay.getDay(); i++) {
            calendarDays.push(<div key={`empty-${i}`} className="p-2 border"></div>);
        }

        for (let i = 1; i <= lastDay.getDate(); i++) {
            const dayEvents = events.filter(event => event.date.getDate() === i);
            calendarDays.push(
                <div key={i} className={`p-2 border ${i === currentDate.getDate() ? 'bg-blue-100' : ''}`}>
                    <div className="font-bold">{i}</div>
                    {dayEvents.map(event => (
                        <div key={event.id} className="text-xs truncate">
                            {event.title}
                        </div>
                    ))}
                </div>
            );
        }

        return (
            <div className="grid grid-cols-7 gap-1">
                {days.map(day => (
                    <div key={day} className="font-bold text-center p-2">{day}</div>
                ))}
                {calendarDays}
            </div>
        );
    };

    return (
        <div className='dash-back flex flex-col justify-center align-middle items-center'>
            <motion.div
                className="flex flex-col place-items-center gap-6 py-10 px-20 my-[4%] bg-gradient-to-br from-cyan-400 via-white/30 to-blue-800 backdrop-blur-lg bg-opacity-20 shadow-xl border border-white/20 h-full rounded-tr-[48px] rounded-bl-[48px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Calendar</h1>
                    <Button asChild>
                        <Link href="/events/create">Create Events</Link>
                    </Button>

                </div>
                <div className="flex space-x-4 mb-4">
                    <Select value={view} onValueChange={setView}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select view" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="day">Day</SelectItem>
                            <SelectItem value="week">Week</SelectItem>
                            <SelectItem value="month">Month</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline">Today</Button>
                    <div className="flex space-x-2">
                        <Button variant="outline">&lt;</Button>
                        <Button variant="outline">&gt;</Button>
                    </div>
                </div>
                <Card className="mb-4">
                    <CardContent className="p-4">
                        {renderCalendar()}
                    </CardContent>
                </Card>
                <div className="grid grid-cols-3 gap-4">
                    <Card className="col-span-2">
                        <CardHeader>
                            <CardTitle>Upcoming Events</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {events.map(event => (
                                <div key={event.id} className="flex items-center mb-2 p-2 bg-gray-50 rounded">
                                    {renderEventIcon(event.type)}
                                    <div>
                                        <div className="font-semibold">{event.title}</div>
                                        <div className="text-sm text-gray-500">
                                            {event.date.toDateString()} at {event.time}
                                        </div>
                                    </div>

                                    <div className="flex space-x-2">
                                        <Button variant="outline" size="sm" onClick={() => handleUpdateEvent(event)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => handleDeleteEvent(event)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Upcoming Deadlines</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {events.filter(e => e.type === 'deadline').map(event => (
                                <div key={event.id} className="flex items-center mb-2 p-2 bg-gray-50 rounded">
                                    <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                                    <div>
                                        <div className="font-semibold">{event.title}</div>
                                        <div className="text-sm text-gray-500">
                                            {event.date.toDateString()} at {event.time}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to delete this event?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the event.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDeleteEvent}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Edit Event</DialogTitle>
                            <DialogDescription>
                                Make changes to your event here. Click save when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Event title" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Type</FormLabel>
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
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="time"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Time</FormLabel>
                                            <FormControl>
                                                <Input type="time" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Date</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="date"
                                                    {...field}
                                                    value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''}
                                                    onChange={(e) => field.onChange(new Date(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <DialogFooter>
                                    <Button type="submit">Save changes</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </ motion.div>
        </div>
    );
};

export default page
