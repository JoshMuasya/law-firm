"use client"

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
import { useRouter } from 'next/navigation'
import { Cases } from '@/lib'
import { doc, DocumentSnapshot, getDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

const error = () => toast('Failed to Add Client!!! Try Again!!!');
const added = () => toast('Client Added Successfully!!!');

const formSchema = z.object({
    milestone: z.string().min(3, { message: "Milestone must be at least 3 characters long" }),
    dateDue: z.string().refine((value) => !isNaN(Date.parse(value)), {
        message: "Please provide a valid date",
    }),
});

const eventFormSchema = z.object({
    event: z.string().min(3, { message: "Name must be at least 3 characters long" }),
    dateDue: z.string().refine((value) => !isNaN(Date.parse(value)), {
        message: "Please provide a valid date",
    }),
});

const docFormSchema = z.object({
    docname: z.string().min(3, { message: "Name must be at least 3 characters long" }),
    document: z
        .any()
});

const expenseFormSchema = z.object({
    expensename: z.string().min(3, { message: "Name must be at least 3 characters long" }),
    amount: z.string().min(3, { message: "Amount must be at least 3 characters long" }),
    datePaid: z.string().refine((value) => !isNaN(Date.parse(value)), {
        message: "Please provide a valid date",
    }),
});

const commFormSchema = z.object({
    commtitle: z.string().min(3, { message: "Title must be at least 3 characters long" }),
    commdate: z.string().refine((value) => !isNaN(Date.parse(value)), {
        message: "Please provide a valid date",
    }),
    commtype: z.string().min(3, { message: "Type must be at least 3 characters long" }),
    commsummary: z.string().min(3, { message: "Summary must be at least 3 characters long" }),
});

const page = ({ params }: { params: { viewcase: string } }) => {
    const [caseData, setCaseData] = useState<Cases | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

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
        const fetchCase = async () => {
            if (!params.viewcase) {
                setLoading(false)
                return
            }

            try {
                const caseDoc = doc(db, 'Cases', params.viewcase);
                const caseSnapshot: DocumentSnapshot = await getDoc(caseDoc);

                if (caseSnapshot.exists()) {
                    const caseData = caseSnapshot.data() as Cases;
                    caseData.id = caseSnapshot.id;
                    setCaseData(caseData);
                } else {
                    // router.push('/cases/view'); // Redirect to clients list if client not found
                }
            } catch (error) {
                console.error("Error fetching Case: ", error)
            } finally {
                setLoading(false)
            }
        }

        fetchCase()
    }, [params.viewcase, router])

    if (loading) {
        return <div>Loading...</div>
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            milestone: '',
            dateDue: '',
        },
    })

    const eventForm = useForm<z.infer<typeof eventFormSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            event: '',
            dateDue: '',
        },
    })

    const docForm = useForm<z.infer<typeof docFormSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            docname: '',
            document: '',
        },
    })

    const expenseForm = useForm<z.infer<typeof expenseFormSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            expensename: '',
            amount: '',
            datePaid: '',
        },
    })

    const commForm = useForm<z.infer<typeof commFormSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            commtitle: '',
            commdate: '',
            commsummary: '',
            commtype: '',
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)

        added()
    }

    function onEventSubmit(values: z.infer<typeof eventFormSchema>) {
        console.log(values)

        added()
    }

    function onDocSubmit(values: z.infer<typeof docFormSchema>) {
        console.log(values)

        added()
    }

    function onExpenseSubmit(values: z.infer<typeof expenseFormSchema>) {
        console.log(values)

        added()
    }

    function onCommSubmit(values: z.infer<typeof commFormSchema>) {
        console.log(values)

        added()
    }

    return (
        <div className='bg-muted flex flex-col justify-center items-center align-middle w-full h-full py-10'>
            <Card className='w-11/12 md:w-3/4'>
                <CardHeader>
                    <CardTitle
                        className='text-center text-2xl md:text-3xl lg:text-4xl pb-3 font-bold flex flex-row justify-between align-middle items-center'
                    >
                        <h1>
                            Case Management
                        </h1>

                        <Button asChild>
                            <Link href="/">Active</Link>
                        </Button>

                    </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <Card className='w-full flex flex-col justify-center items-start py-5'>
                        <CardContent>
                            {/* Top */}
                            <div className='flex flex-col justify-center items-start align-middle'>
                                {/* Title */}
                                <h1 className='font-bold text-base md:text-lg lg:text-xl py-2'>
                                    Smith vs. Johnson
                                </h1>

                                {/* Number and Type */}
                                <h3 className='font-medium text-base md:text-lg lg:text-xl pb-3'>
                                    Case #1234 - Civil Litigation
                                </h3>
                            </div>

                            {/* Middle */}
                            <div className='flex flex-col justify-center items-start align-middle'>
                                {/* Attorney */}
                                <h3 className='text-base md:text-lg lg:text-xl py-2'>
                                    <strong>Assigned Attorney:</strong> Jane Doe
                                </h3>

                                {/* Client */}
                                <h3 className='text-base md:text-lg lg:text-xl pb-2'>
                                    <strong>Client:</strong> John Smith
                                </h3>

                                {/* Date */}
                                <h3 className='text-base md:text-lg lg:text-xl pb-3'>
                                    <strong>Filed Date:</strong> 2024-03-15
                                </h3>
                            </div>

                            {/* Bottom */}
                            <div className='flex flex-col justify-center items-start align-middle pt-3'>
                                <p className='text-justify'>
                                    Lorem Ipsum
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </CardContent>

                <CardContent className="grid gap-4">
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="documents">Documents</TabsTrigger>
                            <TabsTrigger value="expenses">Expenses</TabsTrigger>
                            <TabsTrigger value="communication">Communication</TabsTrigger>
                        </TabsList>
                        <TabsContent value="overview">
                            <Card className='py-10'>
                                <CardHeader>
                                    <CardTitle className='text-2xl md:text-3xl lg:text-4xl pb-3 font-bold'>Case Timeline</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className='flex flex-col justify-center align-middle items-start w-full'>
                                        {/* Upcoming Events */}
                                        <div className='w-full'>
                                            <h1 className='text-lg md:text-xl lg:text-2xl pb-3 font-bold'>
                                                Upcoming Events
                                            </h1>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Event Title</TableHead>
                                                        <TableHead>Event Date</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell>Second Hearing</TableCell>
                                                        <TableCell>23/10/2024</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>

                                            {/* Add Milestones */}
                                            <h1 className='text-lg md:text-xl lg:text-2xl py-3 font-bold'>
                                                Add Event
                                            </h1>

                                            {/* Events Form */}
                                            <div>
                                                <Card className='w-full'>
                                                    <CardContent className="grid gap-4">
                                                        <Form {...form}>
                                                            <form onSubmit={eventForm.handleSubmit(onEventSubmit)} className="space-y-8 pt-5">
                                                                {/* Event Name */}
                                                                <FormField
                                                                    control={eventForm.control}
                                                                    name="event"
                                                                    render={({ field }) => (
                                                                        <FormItem>
                                                                            <FormControl>
                                                                                <Input placeholder="Event Name" {...field} />
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />

                                                                {/* Date Due */}
                                                                <FormField
                                                                    control={eventForm.control}
                                                                    name="dateDue"
                                                                    render={({ field }) => (
                                                                        <FormItem>
                                                                            <FormControl>
                                                                                <Input type="date" placeholder="Date Due" {...field} />
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
                                            </div>
                                        </div>

                                        {/* Milestones */}
                                        <div className='w-full'>
                                            <h1 className='text-lg md:text-xl lg:text-2xl py-3 font-bold'>
                                                Upcoming Milestones
                                            </h1>

                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Milestone Title</TableHead>
                                                        <TableHead>Milestone Date</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell>Motion Filling</TableCell>
                                                        <TableCell>11/10/2024</TableCell>
                                                    </TableRow>

                                                    <TableRow>
                                                        <TableCell>Client Meeting</TableCell>
                                                        <TableCell>15/10/2024</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>

                                            {/* Add Milestones */}
                                            <h1 className='text-lg md:text-xl lg:text-2xl py-3 font-bold'>
                                                Add Milestones
                                            </h1>

                                            {/* Milestone Form */}
                                            <div>
                                                <Card className='w-full'>
                                                    <CardContent className="grid gap-4">
                                                        <Form {...form}>
                                                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pt-5">
                                                                {/* Milestone Name */}
                                                                <FormField
                                                                    control={form.control}
                                                                    name="milestone"
                                                                    render={({ field }) => (
                                                                        <FormItem>
                                                                            <FormControl>
                                                                                <Input placeholder="Milestone Name" {...field} />
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />

                                                                {/* Date Due */}
                                                                <FormField
                                                                    control={form.control}
                                                                    name="dateDue"
                                                                    render={({ field }) => (
                                                                        <FormItem>
                                                                            <FormControl>
                                                                                <Input type="date" placeholder="Date Due" {...field} />
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
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="documents">
                            <Card className='py-10'>
                                <CardHeader>
                                    <CardTitle className='text-2xl md:text-3xl lg:text-4xl pb-3 font-bold'>Case Documents</CardTitle>
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

                                    {/* Add Document */}
                                    <h1 className='text-lg md:text-xl lg:text-2xl py-3 font-bold'>
                                        Add Document
                                    </h1>

                                    {/* Events Form */}
                                    <div>
                                        <Card className='w-full'>
                                            <CardContent className="grid gap-4">
                                                <Form {...form}>
                                                    <form onSubmit={docForm.handleSubmit(onDocSubmit)} className="space-y-8 pt-5">
                                                        {/* Event Name */}
                                                        <FormField
                                                            control={docForm.control}
                                                            name="docname"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Input placeholder="Document Name" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />

                                                        {/* Document */}
                                                        <FormField
                                                            control={docForm.control}
                                                            name="document"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Input type="file" accept="image/*" {...field} />
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
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="communication">
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
                                                            <Button variant="outline">See More</Button>
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

                                    {/* Add Communication */}
                                    <h1 className='text-lg md:text-xl lg:text-2xl py-3 font-bold'>
                                        Add Communication Logs
                                    </h1>

                                    {/* Communication Form */}
                                    <div>
                                        <Card className='w-full'>
                                            <CardContent className="grid gap-4">
                                                <Form {...form}>
                                                    <form onSubmit={commForm.handleSubmit(onCommSubmit)} className="space-y-8 pt-5">
                                                        {/* Comm Title */}
                                                        <FormField
                                                            control={commForm.control}
                                                            name="commtitle"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Input placeholder="Communication Title" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />

                                                        {/* Comm Type */}
                                                        <FormField
                                                            control={commForm.control}
                                                            name="commtype"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Input placeholder="Communication Type" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />

                                                        {/* Date Paid */}
                                                        <FormField
                                                            control={commForm.control}
                                                            name="commdate"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Input type="date" placeholder="Communication Date" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />

                                                        {/* Comm Summary */}
                                                        <FormField
                                                            control={commForm.control}
                                                            name="commsummary"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Input placeholder="Communication Summary" {...field} />
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
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="expenses">
                            <Card className='py-10'>
                                <CardHeader>
                                    <CardTitle className='text-2xl md:text-3xl lg:text-4xl pb-3 font-bold'>Case Expenses</CardTitle>

                                    <CardDescription className='text-base md:text-lg lg:text-xl pb-3'>
                                        Case Expense History
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Expense Name</TableHead>
                                                <TableHead>Payment Date</TableHead>
                                                <TableHead>Amount</TableHead>
                                                <TableHead>Balance</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>File Filling</TableCell>
                                                <TableCell>20/09/2024</TableCell>
                                                <TableCell>20000</TableCell>
                                                <TableCell>
                                                    480000
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>

                                    {/* Add Expense */}
                                    <h1 className='text-lg md:text-xl lg:text-2xl py-3 font-bold'>
                                        Add Expense
                                    </h1>

                                    {/* Expenses Form */}
                                    <div>
                                        <Card className='w-full'>
                                            <CardContent className="grid gap-4">
                                                <Form {...form}>
                                                    <form onSubmit={expenseForm.handleSubmit(onExpenseSubmit)} className="space-y-8 pt-5">
                                                        {/* Expense Name */}
                                                        <FormField
                                                            control={expenseForm.control}
                                                            name="expensename"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Input placeholder="Expense Name" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />

                                                        {/* Amount */}
                                                        <FormField
                                                            control={expenseForm.control}
                                                            name="amount"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Input placeholder="Amount" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />

                                                        {/* Date Paid */}
                                                        <FormField
                                                            control={expenseForm.control}
                                                            name="datePaid"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Input type="date" placeholder="Date Paid" {...field} />
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
                                    </div>
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
