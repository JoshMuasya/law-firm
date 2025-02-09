'use client'

import React, { useEffect, useState } from 'react'

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
import { Client } from '@/lib'
import { useParams, useRouter } from 'next/navigation'
import { collection, doc, DocumentSnapshot, getDoc, getDocs, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { motion } from 'framer-motion'

const page = ({ params }: { params: { viewclient: string } }) => {
    const [client, setClient] = useState<Client | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    // Utility function to format date
    const formatDate = (timestamp: Timestamp | string) => {
        if (timestamp instanceof Timestamp) {
            const date = timestamp.toDate(); // Convert Firestore Timestamp to JavaScript Date
            const year = date.getFullYear();
            const month = (`0${date.getMonth() + 1}`).slice(-2); // Months are 0-based
            const day = (`0${date.getDate()}`).slice(-2);

            return `${year}-${month}-${day}`;
        }

        // Handle string dates
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = (`0${date.getMonth() + 1}`).slice(-2);
        const day = (`0${date.getDate()}`).slice(-2);

        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        const fetchClient = async () => {
            if (!params.viewclient) {
                setLoading(false)
                return
            }

            try {
                const clientDoc = doc(db, 'Clients', params.viewclient);
                const clientSnapshot: DocumentSnapshot = await getDoc(clientDoc);

                if (clientSnapshot.exists()) {
                    const clientData = clientSnapshot.data() as Client;
                    clientData.id = clientSnapshot.id;
                    setClient(clientData);
                } else {
                    router.push('/clients/view'); // Redirect to clients list if client not found
                }
            } catch (error) {
                console.error("Error fetching client: ", error)
            } finally {
                setLoading(false)
            }
        }

        fetchClient()
    }, [params.viewclient, router])

    if (loading) {
        return <div>Loading...</div>
    }

    if (!client) {
        return <div>Client not found</div>
    }

    return (
        <div className='dash-back flex flex-col justify-center align-middle items-center'>
            <motion.div
                className="flex flex-col place-items-center gap-6 py-10 px-10 my-[4%] bg-gradient-to-br from-cyan-400 via-white/30 to-blue-800 backdrop-blur-lg bg-opacity-20 shadow-xl border border-white/20 h-full rounded-tr-[48px] rounded-bl-[48px] w-[80%]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                <CardHeader>
                    <CardTitle
                        className='text-center text-2xl md:text-3xl lg:text-4xl pb-3 font-bold flex flex-row justify-between align-middle items-center'
                    >
                        <h1>
                            Client Profile
                        </h1>

                        <Button asChild>
                            <Link href={`/clients/edit/${client.id}`}>Edit Profile</Link>
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
                                        src={client.imageUrl || '/lady.jpg'}
                                        alt={`${client.fullname}'s profile`}
                                        className='w-24 h-24 rounded-full'
                                    />
                                </div>

                                {/* Name */}
                                <div>
                                    {/* Fullname */}
                                    <div className='pb-3 md:pb-5'>
                                        <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold'>{client.fullname}</h1>
                                    </div>

                                    {/* Date Joined */}
                                    <div>
                                        <h3 className='text-base md:text-lg'>
                                            Client Since: {client.createdAt
                                                ? (typeof client.createdAt === 'string'
                                                    ? client.createdAt
                                                    : client.createdAt.toLocaleDateString())
                                                : 'Not available'}
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

                                        <h1 className='text-base md:text-lg font-semibold pl-2 md:pl-4'>{client.email}</h1>
                                    </div>

                                    {/* Phone Number */}
                                    <div className='pr-3 md:pr-6 flex flex-row justify-center align-middle'>
                                        <FaPhoneAlt className='text-xl md:text-2xl text-primary' />

                                        <h1 className='text-base md:text-lg font-semibold pl-2 md:pl-4'>{client.phonenumber}</h1>
                                    </div>
                                </div>

                                {/* Address */}
                                <div className='pr-3 md:pr-6 flex flex-row justify-center align-middle leading-4'>
                                    <FaLocationDot className='text-xl md:text-2xl text-primary' />

                                    <h1 className='text-base md:text-lg font-semibold pl-2 md:pl-4'>{client.address}</h1>
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
            </motion.div>
        </div>
    )
}

export default page
