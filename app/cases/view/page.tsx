'use client'

import React, { useEffect, useState } from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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

import { Label } from "@/components/ui/label"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Filter } from 'lucide-react';

import toast, { Toaster } from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Cases } from '@/lib';
import { motion } from "framer-motion";

const page = () => {
  const [cases, setCases] = useState<Cases[]>([])
  const [loading, setLoading] = useState(true)
  const [caseToDelete, setCaseToDelete] = useState<Cases | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterName, setFilterName] = useState('')
  const [filterPracticeArea, setFilterPracticeArea] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filteredCases, setFilteredCases] = useState<Cases[]>([])

  const fetchCases = async () => {
    try {
      const casesCollection = collection(db, 'Cases')
      const caseSnapshot = await getDocs(casesCollection)
      const caseList = caseSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as Omit<Cases, 'id'>
      }))
      setCases(caseList)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching cases: ", error)
      toast.error("Failed to load cases")
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCases()
  }, [])

  const handleDelete = async (cases: Cases) => {
    if (!cases || !cases.id) {
      console.error("Invalid cases data for deletion")
      toast.error("Cannot delete Case")
      return
    }

    setLoading(true)
    try {
      const casesDocRef = doc(db, 'Cases', cases.id)
      await deleteDoc(casesDocRef)
      console.log(`Case ${cases.id} deleted successfully`)
      toast.success(`${cases.caseName} has been deleted`)
      await fetchCases()
    } catch (error) {
      console.error("Error deleting cases: ", error)
      toast.error("Failed to delete cases")
    } finally {
      setLoading(false)
      setCaseToDelete(null)
    }
  }

  useEffect(() => {
    const filtered = cases.filter(matter =>
      matter.caseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      matter.practiceArea.toLowerCase().includes(searchTerm.toLowerCase()) ||
      matter.caseStatus.includes(searchTerm)
    )
    setFilteredCases(filtered)
  }, [searchTerm, cases])

  const applyFilters = () => {
    const filtered = cases.filter(matter =>
      (filterName ? matter.caseName.toLowerCase().includes(filterName.toLowerCase()) : true) &&
      (filterPracticeArea ? matter.practiceArea.toLowerCase().includes(filterPracticeArea.toLowerCase()) : true) &&
      (filterStatus ? matter.caseStatus.includes(filterStatus) : true)
    )
    setFilteredCases(filtered)
  }

  const clearFilters = () => {
    setFilterName('')
    setFilterPracticeArea('')
    setFilterStatus('')
    setFilteredCases(cases)
  }

  return (
    <div className='dash-back flex flex-col justify-center align-middle items-center'>
      <motion.div
        className="flex flex-col place-items-center gap-6 py-10 px-20 my-[4%] bg-gradient-to-br from-cyan-400 via-white/30 to-blue-800 backdrop-blur-lg bg-opacity-20 shadow-xl border border-white/20 h-full rounded-tr-[48px] rounded-bl-[48px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <CardHeader>
          <CardTitle className='text-center text-2xl md:text-3xl lg:text-4xl pb-3 font-bold'>View Cases</CardTitle>
          <CardDescription className='text-center text-base md:text-lg lg:text-xl pb-3'>View, Update or Delete a Case</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex space-x-2 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search Cases..."
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
                    <h4 className="font-medium leading-none">Filter Cases</h4>
                    <p className="text-sm text-muted-foreground">
                      Enter criteria to filter the case list.
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="name">Case Name</Label>
                      <Input
                        id="name"
                        value={filterName}
                        onChange={(e) => setFilterName(e.target.value)}
                        className="col-span-2 h-8"
                      />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="practiceArea">Case Type</Label>
                      <Input
                        id="practiceArea"
                        value={filterPracticeArea}
                        onChange={(e) => setFilterPracticeArea(e.target.value)}
                        className="col-span-2 h-8"
                      />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="status">Case Status</Label>
                      <Input
                        id="status"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
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
              <Link href="/cases/add">Add Case</Link>
            </Button>
          </div>
        </CardContent>

        <CardContent className="grid gap-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case Name</TableHead>
                <TableHead>Client Name</TableHead>
                <TableHead>Case Type</TableHead>
                <TableHead>Case Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCases.map((matter) => (
                <TableRow key={matter.id}>
                  <TableCell>{matter.caseName}</TableCell>
                  <TableCell>{matter.clientName}</TableCell>
                  <TableCell>{matter.practiceArea}</TableCell>
                  <TableCell>{matter.caseStatus}</TableCell>
                  <TableCell>
                    <Button asChild className='mr-2 my-2'>
                      <Link href={`/cases/view/${matter.id}`}>View</Link>
                    </Button>
                    <Button asChild className='mr-2 my-2'>
                      <Link href={`/cases/edit/${matter.id}`}>Edit</Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="mr-2 my-2" onClick={() => setCaseToDelete(matter)}>Delete</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete {caseToDelete?.caseName}'s data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setCaseToDelete(null)}>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => caseToDelete && handleDelete(caseToDelete)}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </motion.div>

      <Toaster />
    </div>
  )
}

export default page
