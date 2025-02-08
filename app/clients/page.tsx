'use client'

import React, { useEffect, useState } from 'react'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { FaUserFriends } from 'react-icons/fa'
import { FaUsers } from "react-icons/fa";
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { motion } from 'framer-motion'

const page = () => {
    const [clientCount, setClientCount] = useState(0);

    useEffect(() => {
        const fetchClientCount = async () => {
            const clientsCollection = collection(db, 'Clients');
            const clientSnapshot = await getDocs(clientsCollection);
            console.log(clientSnapshot)
            setClientCount(clientSnapshot.size);
        };

        fetchClientCount();
    }, []);

    console.log(clientCount)

    return (
        <div className='dash-back flex flex-col justify-center align-middle items-center'>
            <motion.div
                className="grid grid-rows-2 grid-flow-col place-items-center gap-6 py-10 px-20 my-[10%] bg-gradient-to-br from-cyan-400 via-white/30 to-blue-800 backdrop-blur-lg bg-opacity-20 shadow-xl border border-white/20 h-full rounded-tr-[48px] rounded-bl-[48px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                <CardHeader>
                    <CardTitle className='text-center text-2xl md:text-3xl lg:text-4xl pb-3 font-bold'>Add or View Clients</CardTitle>
                    <CardDescription className='text-center text-base md:text-lg lg:text-xl pb-3 text-black'>Total Clients: <strong>{clientCount}</strong></CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    {/* Add Client */}
                    <div className='w-full pb-3 md:pb-5'>
                        <Button asChild className='w-full' variant={"default"}>
                            <Link href="/clients/add">
                                <FaUserFriends className="mr-2 h-4 w-4" />
                                Add Client
                            </Link>
                        </Button>
                    </div>

                    {/* View Clients */}
                    <div className='w-full pb-3 md:pb-5'>
                        <Button asChild className='w-full' variant={"default"}>
                            <Link href="/clients/view">
                                <FaUsers className="mr-2 h-4 w-4" />
                                View Clients
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </motion.div>
        </div>
    )
}

export default page
