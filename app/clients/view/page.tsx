'use client'

import React, { useEffect, useState } from 'react'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import toast, { Toaster } from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Client } from '@/lib';
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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { Search, Plus, Filter } from 'lucide-react';

import { Label } from "@/components/ui/label"

const page = () => {
    const [clients, setClients] = useState<Client[]>([])
    const [filteredClients, setFilteredClients] = useState<Client[]>([])
    const [loading, setLoading] = useState(true)
    const [clientToDelete, setClientToDelete] = useState<Client | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterName, setFilterName] = useState('')
    const [filterEmail, setFilterEmail] = useState('')
    const [filterPhone, setFilterPhone] = useState('')

    const fetchClients = async () => {
        try {
            const clientsCollection = collection(db, 'Clients')
            const clientSnapshot = await getDocs(clientsCollection)
            const clientList = clientSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data() as Omit<Client, 'id'>
            }))
            setClients(clientList)
            setLoading(false)
        } catch (error) {
            console.error("Error fetching clients: ", error)
            toast.error("Failed to load clients")
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchClients()
    }, [])

    const handleDelete = async (client: Client) => {
        if (!client || !client.id) {
            console.error("Invalid client data for deletion")
            toast.error("Cannot delete client: Invalid data")
            return
        }

        setLoading(true)
        try {
            const clientDocRef = doc(db, 'Clients', client.id)
            await deleteDoc(clientDocRef)
            console.log(`Client ${client.id} deleted successfully`)
            toast.success(`${client.fullname} has been deleted`)
            await fetchClients() // Refresh the client list
        } catch (error) {
            console.error("Error deleting client: ", error)
            toast.error("Failed to delete client")
        } finally {
            setLoading(false)
            setClientToDelete(null)
        }
    }

    useEffect(() => {
        const filtered = clients.filter(client =>
            client.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.phonenumber.includes(searchTerm)
        )
        setFilteredClients(filtered)
    }, [searchTerm, clients])

    const applyFilters = () => {
        const filtered = clients.filter(client =>
            (filterName ? client.fullname.toLowerCase().includes(filterName.toLowerCase()) : true) &&
            (filterEmail ? client.email.toLowerCase().includes(filterEmail.toLowerCase()) : true) &&
            (filterPhone ? client.phonenumber.includes(filterPhone) : true)
        )
        setFilteredClients(filtered)
    }

    const clearFilters = () => {
        setFilterName('')
        setFilterEmail('')
        setFilterPhone('')
        setFilteredClients(clients)
    }

    return (
        <div className='bg-muted flex flex-col justify-center items-center align-middle w-full h-screen'>
            <Card className='w-11/12 md:w-5/6'>
                <CardHeader>
                    <CardTitle className='text-center text-2xl md:text-3xl lg:text-4xl pb-3 font-bold'>View Clients</CardTitle>
                    <CardDescription className='text-center text-base md:text-lg lg:text-xl pb-3'>View, Update or Delete a Client</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="flex space-x-2 mb-4">
                        <div className="relative flex-grow">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search clients..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline">
                                    <Filter className="mr-2 h-4 w-4" /> Filter
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <h4 className="font-medium leading-none">Filter Clients</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Enter criteria to filter the client list.
                                        </p>
                                    </div>
                                    <div className="grid gap-2">
                                        <div className="grid grid-cols-3 items-center gap-4">
                                            <Label htmlFor="name">Name</Label>
                                            <Input
                                                id="name"
                                                value={filterName}
                                                onChange={(e) => setFilterName(e.target.value)}
                                                className="col-span-2 h-8"
                                            />
                                        </div>
                                        <div className="grid grid-cols-3 items-center gap-4">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                value={filterEmail}
                                                onChange={(e) => setFilterEmail(e.target.value)}
                                                className="col-span-2 h-8"
                                            />
                                        </div>
                                        <div className="grid grid-cols-3 items-center gap-4">
                                            <Label htmlFor="phone">Phone</Label>
                                            <Input
                                                id="phone"
                                                value={filterPhone}
                                                onChange={(e) => setFilterPhone(e.target.value)}
                                                className="col-span-2 h-8"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <Button variant="outline" onClick={clearFilters}>
                                            Clear Filters
                                        </Button>
                                        <Button onClick={applyFilters}>Apply Filters</Button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                        <Button asChild>
                            <Link href="/clients/add">Add Client</Link>
                        </Button>
                    </div>
                </CardContent>

                <CardContent className="grid gap-4">
                    {loading ? (
                        <p>Loading clients...</p>
                    ) : (
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
                                {filteredClients.map((client) => (
                                    <TableRow key={client.id}>
                                        <TableCell>{client.fullname}</TableCell>
                                        <TableCell>{client.email}</TableCell>
                                        <TableCell>{client.phonenumber}</TableCell>
                                        <TableCell>{client.address}</TableCell>
                                        <TableCell>
                                            <Button asChild className='mr-2 my-2'>
                                                <Link href={`/clients/view/${client.id}`}>View</Link>
                                            </Button>
                                            <Button asChild className="mr-2 my-2">
                                                <Link href={`/clients/edit/${client.id}`}>Edit</Link>
                                            </Button>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="destructive" className="mr-2 my-2" onClick={() => setClientToDelete(client)}>Delete</Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete {clientToDelete?.fullname}'s account and remove their data from our servers.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel onClick={() => setClientToDelete(null)}>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => clientToDelete && handleDelete(clientToDelete)}>Continue</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <Toaster />
        </div>
    )
}

export default page
