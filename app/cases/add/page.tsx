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

import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import toast, { Toaster } from 'react-hot-toast';
import { Textarea } from '@/components/ui/textarea'

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

const error = () => toast('Failed to Add Case!!! Try Again!!!');
const added = () => toast('Case Added Successfully!!!');

const clients = [
    {
        id: 1,
        name: "Next Tech Solutions",
        email: "contact@nexttech.com",
        phone: "(555) 321-6547",
        status: "Active",
        framework: "Next.js",
    },
    {
        id: 2,
        name: "Svelte Innovations",
        email: "info@svelteinnovations.com",
        phone: "(555) 654-3210",
        status: "Inactive",
        framework: "SvelteKit",
    },
    {
        id: 3,
        name: "Nuxtify Labs",
        email: "hello@nuxtifylabs.com",
        phone: "(555) 987-6543",
        status: "Active",
        framework: "Nuxt.js",
    },
    {
        id: 4,
        name: "Remix Digital",
        email: "support@remixdigital.com",
        phone: "(555) 123-4567",
        status: "Inactive",
        framework: "Remix",
    },
    {
        id: 5,
        name: "Astro Developers",
        email: "team@astrodevelopers.com",
        phone: "(555) 789-1234",
        status: "Active",
        framework: "Astro",
    },
];

const practiceAreas = [
    { value: "criminal", label: "Criminal" },
    { value: "civil", label: "Civil" },
    { value: "family", label: "Family Law" },
    { value: "corporate", label: "Corporate Law" },
];

const caseStatuses = [
    { value: "open", label: "Open" },
    { value: "closed", label: "Closed" },
    { value: "pending", label: "Pending" },
];

const formSchema = z.object({
    casename: z.string().min(3, { message: "case name must be at least 3 characters long" }),
    clientname: z.string().min(3, { message: "client name must be at least 3 characters long" }),
    attorney: z.string().min(3, { message: "Attorney must be at least 3 characters long" }),
    court: z.string().min(3, { message: "Court must be at least 3 characters long" }),
    casetype: z.string().min(3, { message: "Case type must be at least 3 characters long" }),
    casestatus: z.string().min(3, { message: "Case status must be at least 3 characters long" }),
    description: z.string().min(3, { message: "Description must be at least 3 characters long" }),
    expenses: z.string().min(3, { message: "Expenses must be at least 3 characters long" }),
    fileddate: z.string().refine((value) => !isNaN(Date.parse(value)), {
        message: "Please provide a valid date",
    }),
    documents: z.any()
});

const page = () => {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [openPracticeArea, setOpenPracticeArea] = useState(false)
    const [openCaseStatus, setOpenCaseStatus] = useState(false)
    const [value, setValue] = useState("")
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
    const [selectedPracticeArea, setSelectedPracticeArea] = useState<string | null>(null);
    const [selectedCaseStatus, setSelectedCaseStatus] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            casename: "",
            clientname: "",
            attorney: "",
            court: "",
            casetype: "",
            casestatus: "",
            description: "",
            expenses: "",
            fileddate: "",
            documents: null,
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        const dataToSubmit = {
            ...values,
            clientname: clients.find((client) => client.id.toString() === selectedClientId)?.name || values.clientname,
            casetype: selectedPracticeArea || values.casetype,
            casestatus: selectedCaseStatus || values.casestatus,
        };

        console.log(dataToSubmit);

        added()

        router.push("/cases/view")
    }

    return (
        <div className='bg-muted flex flex-col justify-center items-center align-middle w-full h-screen'>
            <Card className='w-11/12 md:w-3/4 lg:w-1/2'>
                <CardHeader>
                    <CardTitle className='text-center text-2xl md:text-3xl lg:text-4xl pb-3 font-bold'>Add Clients</CardTitle>
                    <CardDescription className='text-center text-base md:text-lg lg:text-xl pb-3'>Fill in the Form to Add a Case</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            {/* Case Name */}
                            <FormField
                                control={form.control}
                                name="casename"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder="Case Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Client Name */}
                            <FormField
                                control={form.control}
                                name="clientname"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Popover open={open} onOpenChange={setOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        aria-expanded={open}
                                                        className="w-full justify-between"
                                                    >
                                                        {selectedClientId
                                                            ? clients.find((client) => client.id.toString() === selectedClientId)?.name
                                                            : "Select Client"}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[200px] p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Search client..." />
                                                        <CommandList>
                                                            <CommandEmpty>No client found.</CommandEmpty>
                                                            <CommandGroup>
                                                                {clients.map((client) => (
                                                                    <CommandItem
                                                                        key={client.id}
                                                                        value={client.id.toString()}
                                                                        onSelect={(currentValue) => {
                                                                            const selectedClient = clients.find(client => client.id.toString() === currentValue);
                                                                            if (selectedClient) {
                                                                                // Update form field with the client name
                                                                                form.setValue('clientname', selectedClient.name);
                                                                            }
                                                                            setSelectedClientId(currentValue === selectedClientId ? null : currentValue);
                                                                            setOpen(false);
                                                                        }}
                                                                    >
                                                                        <Check
                                                                            className={cn(
                                                                                "mr-2 h-4 w-4",
                                                                                value === client.id.toString() ? "opacity-100" : "opacity-0"
                                                                            )}
                                                                        />
                                                                        {client.name}
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Attorney */}
                            <FormField
                                control={form.control}
                                name="attorney"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder="Attorney Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Court */}
                            <FormField
                                control={form.control}
                                name="court"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder="Court" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Case Type */}
                            <FormField
                                control={form.control}
                                name="casetype"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Popover open={openPracticeArea} onOpenChange={setOpenPracticeArea}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        aria-expanded={openPracticeArea}
                                                        className="w-full justify-between"
                                                    >
                                                        {selectedPracticeArea
                                                            ? practiceAreas.find((area) => area.value === selectedPracticeArea)?.label
                                                            : "Select Practice Area"}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[200px] p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Search practice area..." />
                                                        <CommandList>
                                                            <CommandEmpty>No practice area found.</CommandEmpty>
                                                            <CommandGroup>
                                                                {practiceAreas.map((area) => (
                                                                    <CommandItem
                                                                        key={area.value}
                                                                        value={area.value}
                                                                        onSelect={(currentValue) => {
                                                                            const selectedArea = practiceAreas.find(area => area.value === currentValue);
                                                                            if (selectedArea) {
                                                                                form.setValue('casetype', selectedArea.label);
                                                                            }
                                                                            setSelectedPracticeArea(currentValue === selectedPracticeArea ? null : currentValue);
                                                                            setOpenPracticeArea(false);
                                                                        }}
                                                                    >
                                                                        <Check
                                                                            className={cn(
                                                                                "mr-2 h-4 w-4",
                                                                                selectedPracticeArea === area.value ? "opacity-100" : "opacity-0"
                                                                            )}
                                                                        />
                                                                        {area.label}
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Case Status */}
                            <FormField
                                control={form.control}
                                name="casestatus"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Popover open={openCaseStatus} onOpenChange={setOpenCaseStatus}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        aria-expanded={openCaseStatus}
                                                        className="w-full justify-between"
                                                    >
                                                        {selectedCaseStatus
                                                            ? caseStatuses.find((status) => status.value === selectedCaseStatus)?.label
                                                            : "Select Case Status"}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[200px] p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Search case status..." />
                                                        <CommandList>
                                                            <CommandEmpty>No case status found.</CommandEmpty>
                                                            <CommandGroup>
                                                                {caseStatuses.map((status) => (
                                                                    <CommandItem
                                                                        key={status.value}
                                                                        value={status.value}
                                                                        onSelect={(currentValue) => {
                                                                            const selectedStatus = caseStatuses.find(status => status.value === currentValue);
                                                                            if (selectedStatus) {
                                                                                form.setValue('casestatus', selectedStatus.label);
                                                                            }
                                                                            setSelectedCaseStatus(currentValue === selectedCaseStatus ? null : currentValue);
                                                                            setOpenCaseStatus(false);
                                                                        }}
                                                                    >
                                                                        <Check
                                                                            className={cn(
                                                                                "mr-2 h-4 w-4",
                                                                                selectedCaseStatus === status.value ? "opacity-100" : "opacity-0"
                                                                            )}
                                                                        />
                                                                        {status.label}
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Description */}
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Textarea placeholder="Case Description" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Expenses */}
                            <FormField
                                control={form.control}
                                name="expenses"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder="Expected Expenses" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Filled Date */}
                            <FormField
                                control={form.control}
                                name="fileddate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input type="date" placeholder="Filed Date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Documents */}
                            <FormField
                                control={form.control}
                                name="documents"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input type="file" accept=".jpg, .jpeg, .png, .pdf" {...field} />
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
