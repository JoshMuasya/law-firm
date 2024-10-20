'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { doc, DocumentSnapshot, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Client } from '@/lib'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import toast, { Toaster } from 'react-hot-toast'

const page = ({ params }: { params: { editClient: string } }) => {
    const [client, setClient] = useState<Client | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const fetchClient = async () => {
            console.log("Params:",params)
            if (!params.editClient) {
                setLoading(false)
                return
            }

            try {
                const clientDoc = doc(db, 'Clients', params.editClient);
                const clientSnapshot: DocumentSnapshot = await getDoc(clientDoc);

                if (clientSnapshot.exists()) {
                    const clientData = clientSnapshot.data() as Client;
                    clientData.id = clientSnapshot.id;
                    setClient(clientData);
                } else {
                    // router.push('/clients'); // Redirect to clients list if client not found
                }
            } catch (error) {
                console.error("Error fetching client: ", error)
            } finally {
                setLoading(false)
            }
        }

        fetchClient()
    }, [params.editClient, router])

    if (loading) {
        return <div>Loading...</div>
    }

    if (!client) {
        return <div>Client not found</div>
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!client) return

        try {
            await updateDoc(doc(db, 'Clients', client.id), {
                fullname: client.fullname,
                email: client.email,
                phonenumber: client.phonenumber,
                address: client.address,
            })
            toast.success('Client updated successfully')
            router.push('/clients/view')
        } catch (error) {
            console.error("Error updating client: ", error)
            toast.error('Failed to update client')
        }
    }

    if (loading) {
        return <div>Loading...</div>
    }

    if (!client) {
        return <div>Client not found</div>
    }

    return (
        <div className='bg-muted flex flex-col justify-center items-center align-middle w-full h-screen'>
            <Card className='w-11/12 md:w-5/6'>
                <CardHeader>
                    <CardTitle className='text-center text-2xl md:text-3xl lg:text-4xl pb-3 font-bold'>Edit Client</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="fullname">Full Name</Label>
                            <Input
                                id="fullname"
                                value={client.fullname}
                                onChange={(e) => setClient({ ...client, fullname: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={client.email}
                                onChange={(e) => setClient({ ...client, email: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="phonenumber">Phone Number</Label>
                            <Input
                                id="phonenumber"
                                value={client.phonenumber}
                                onChange={(e) => setClient({ ...client, phonenumber: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                value={client.address}
                                onChange={(e) => setClient({ ...client, address: e.target.value })}
                                required
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button type="submit">Save Changes</Button>
                            <Button type="button" variant="outline" onClick={() => router.push('/clients')}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <Toaster />
        </div>
    )
}

export default page
