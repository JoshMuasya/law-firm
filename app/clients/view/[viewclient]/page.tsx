import React from 'react'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import Link from 'next/link'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from 'react-icons/fa';
import { FaLocationDot } from "react-icons/fa6";

const page = () => {
    return (
        <div className='bg-muted flex flex-col justify-center items-center align-middle w-full h-screen'>
            <Card className='w-11/12 md:w-3/4'>
                <CardHeader>
                    <CardTitle
                        className='text-center text-2xl md:text-3xl lg:text-4xl pb-3 font-bold flex flex-row justify-between align-middle items-center'
                    >
                        <h1>
                            Client Profile
                        </h1>

                        <Button asChild>
                            <Link href="/">Edit Profile</Link>
                        </Button>

                    </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <Card className='w-full flex flex-col justify-center items-start'>
                        <CardContent>
                            {/* Top */}
                            <div className='flex flex-row justify-center align-middle items-start pt-5 md:pt-10'>
                                {/* Picture */}
                                <div className='pr-12'>
                                    <img
                                        src='/lady.jpg'
                                        alt='laura-wilson'
                                        className='w-24 h-24 rounded-full'
                                    />
                                </div>

                                {/* Name */}
                                <div>
                                    {/* Fullname */}
                                    <div className='pb-3 md:pb-5'>
                                        <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold'>John Doe</h1>
                                    </div>

                                    {/* Date Joined */}
                                    <div>
                                        <h3 className='text-base md:text-lg'>
                                            Client Since: January 2022
                                        </h3>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom */}
                            <div className='pt-5 md:pt-10 flex flex-col justify-around align-middle items-start w-full'>
                                <div className='flex flex-row justify-between align-middle items-start w-full pb-3 md:pb-5'>
                                    {/* email */}
                                    <div className='pr-3 md:pr-6 flex flex-row justify-center align-middle'>
                                        <MdEmail className='text-xl md:text-2xl text-primary' />

                                        <h1 className='text-base md:text-lg font-semibold pl-2 md:pl-4'>john@gmail.com</h1>
                                    </div>

                                    {/* Phone Number */}
                                    <div className='pr-3 md:pr-6 flex flex-row justify-center align-middle'>
                                        <FaPhoneAlt className='text-xl md:text-2xl text-primary' />

                                        <h1 className='text-base md:text-lg font-semibold pl-2 md:pl-4'>+254 798 024 535</h1>
                                    </div>
                                </div>

                                {/* Address */}
                                <div className='pr-3 md:pr-6 flex flex-row justify-center align-middle leading-4'>
                                    <FaLocationDot className='text-xl md:text-2xl text-primary' />

                                    <h1 className='text-base md:text-lg font-semibold pl-2 md:pl-4'>Westlands Commercial Center</h1>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </CardContent>

                <CardContent className="grid gap-4">
                    <Tabs defaultValue="cases" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="cases">Cases</TabsTrigger>
                            <TabsTrigger value="documents">Documents</TabsTrigger>
                            <TabsTrigger value="communications">Communication</TabsTrigger>
                            <TabsTrigger value="billing">Billing</TabsTrigger>
                        </TabsList>
                        <TabsContent value="cases">
                            <Card className='py-10'>
                                <CardHeader>
                                    <CardTitle className='text-2xl md:text-3xl lg:text-4xl pb-3 font-bold'>Related Cases</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Case Title</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>Case 1</TableCell>
                                                <TableCell>Active</TableCell>
                                                <TableCell>
                                                    <Button asChild>
                                                        <Link href=''>View</Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="documents">
                            <Card className='py-10'>
                                <CardHeader>
                                    <CardTitle className='text-2xl md:text-3xl lg:text-4xl pb-3 font-bold'>Client Documents</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Document Title</TableHead>
                                                <TableHead>Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>Document 1</TableCell>
                                                <TableCell>
                                                    <Button asChild>
                                                        <Link href=''>View</Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="communications">
                            <Card className='py-10'>
                                <CardHeader>
                                    <CardTitle className='text-2xl md:text-3xl lg:text-4xl pb-3 font-bold'>Communication Logs</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Communication Title</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Summary</TableHead>
                                                <TableHead>Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>Communication 1</TableCell>
                                                <TableCell>20/09/2024</TableCell>
                                                <TableCell>Email</TableCell>
                                                <TableCell>Lorem Ipsum</TableCell>
                                                <TableCell>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button variant="outline">Open popover</Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-full">
                                                            <div>
                                                                Lorem Ipsum
                                                            </div>
                                                        </PopoverContent>
                                                    </Popover>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="billing">
                            <Card className='py-10'>
                                <CardHeader>
                                    <CardTitle className='text-2xl md:text-3xl lg:text-4xl pb-3 font-bold'>Billing Overview</CardTitle>

                                    <CardDescription className='text-base md:text-lg lg:text-xl pb-3'>
                                        Client's Payment History
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Payment Date</TableHead>
                                                <TableHead>Amount</TableHead>
                                                <TableHead>Balance</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>20/09/2024</TableCell>
                                                <TableCell>100000</TableCell>
                                                <TableCell>
                                                    500000
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
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
