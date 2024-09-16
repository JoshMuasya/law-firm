import React from 'react'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus } from 'lucide-react';

import toast, { Toaster } from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const page = () => {
    const clients = [
        {
            id: 1,
            fullname: 'John Doe',
            email: 'john@example.com',
            phonenumber: '(555) 123-4567',
            address: '123 Main St, Springfield, IL',
            dateAdded: '2023-01-15',
            picture: 'john-doe.jpg',
        },
        {
            id: 2,
            fullname: 'Jane Smith',
            email: 'jane@example.com',
            phonenumber: '(555) 987-6543',
            address: '456 Oak St, Metropolis, NY',
            dateAdded: '2023-02-20',
            picture: 'jane-smith.png',
        },
        {
            id: 3,
            fullname: 'Robert Johnson',
            email: 'robert.johnson@example.com',
            phonenumber: '(555) 564-7890',
            address: '789 Pine St, Gotham City, NY',
            dateAdded: '2023-03-10',
            picture: 'robert-johnson.jpg',
        },
        {
            id: 4,
            fullname: 'Emily Davis',
            email: 'emily.davis@example.com',
            phonenumber: '(555) 876-5432',
            address: '321 Elm St, Star City, WA',
            dateAdded: '2023-04-12',
            picture: 'emily-davis.png',
        },
        {
            id: 5,
            fullname: 'Michael Brown',
            email: 'michael.brown@example.com',
            phonenumber: '(555) 432-1098',
            address: '654 Maple St, Central City, CA',
            dateAdded: '2023-05-07',
            picture: 'michael-brown.jpg',
        },
        {
            id: 6,
            fullname: 'Laura Wilson',
            email: 'laura.wilson@example.com',
            phonenumber: '(555) 765-4321',
            address: '987 Cedar St, Keystone City, TX',
            dateAdded: '2023-06-01',
            picture: 'laura-wilson.png',
        }
    ];

    return (
        <div className='bg-muted flex flex-col justify-center items-center align-middle w-full h-screen'>
            <Card className='w-11/12 md:w-5/6'>
                <CardHeader>
                    <CardTitle className='text-center text-2xl md:text-3xl lg:text-4xl pb-3 font-bold'>Add Clients</CardTitle>
                    <CardDescription className='text-center text-base md:text-lg lg:text-xl pb-3'>Fill in the Form to Add a Client</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="flex space-x-2 mb-4">
                        <div className="relative flex-grow">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                            <Input placeholder="Search clients..." className="pl-8" />
                        </div>
                        <Button variant="outline">Filter</Button>
                    </div>
                </CardContent>

                <CardContent className="grid gap-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone Number</TableHead>
                                <TableHead>Address</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {clients.map((client) => (
                                <TableRow key={client.id}>
                                    <TableCell>{client.fullname}</TableCell>
                                    <TableCell>{client.email}</TableCell>
                                    <TableCell>{client.phonenumber}</TableCell>
                                    <TableCell>{client.address}</TableCell>
                                    <TableCell>
                                        <Button asChild>
                                            <Link href={`/clients/view/${client.id}`}>View</Link>
                                        </Button>
                                        <Button variant="link">Edit</Button>
                                        <Button variant="link">Delete</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Toaster />
        </div>
    )
}

export default page
