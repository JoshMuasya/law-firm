"use client"

import { AlertTriangle, Briefcase, Clock, Users } from 'lucide-react';
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';

const page = () => {
    const [view, setView] = useState('month');
    const [selectedDate, setSelectedDate] = useState(new Date());

    const events = [
        { id: 1, title: 'Court Hearing: Smith vs. Johnson', type: 'court', time: '09:00 AM', date: new Date() },
        { id: 2, title: 'Client Meeting: Jane Doe', type: 'meeting', time: '02:00 PM', date: new Date() },
        { id: 3, title: 'Filing Deadline: Case #1234', type: 'deadline', time: '11:59 PM', date: new Date(new Date().setDate(new Date().getDate() + 1)) },
    ];

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
        <div className="p-4">
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
        </div>
    );
};

export default page
