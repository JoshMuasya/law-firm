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
  const cases = [
    {
      caseId: 101,
      caseName: 'State vs. John Doe',
      client: 'John Doe',
      caseType: 'Criminal',
      status: 'Open',
      dateFiled: '2023-02-01',
      assignedLawyer: 'David Miller',
      caseDescription: 'Theft charges related to shoplifting at a local store.',
    },
    {
      caseId: 102,
      caseName: 'Smith Divorce Settlement',
      client: 'Jane Smith',
      caseType: 'Family Law',
      status: 'Closed',
      dateFiled: '2023-01-20',
      assignedLawyer: 'Susan Davis',
      caseDescription: 'Divorce settlement case involving property division.',
    },
    {
      caseId: 103,
      caseName: 'Johnson Contract Dispute',
      client: 'Robert Johnson',
      caseType: 'Corporate Law',
      status: 'Open',
      dateFiled: '2023-03-12',
      assignedLawyer: 'Michael Green',
      caseDescription: 'Business contract dispute over terms and conditions.',
    },
    {
      caseId: 104,
      caseName: 'Davis vs. Johnson (Civil)',
      client: 'Emily Davis',
      caseType: 'Civil',
      status: 'Pending',
      dateFiled: '2023-04-05',
      assignedLawyer: 'Laura Knight',
      caseDescription: 'Personal injury lawsuit related to a car accident.',
    },
    {
      caseId: 105,
      caseName: 'State vs. Michael Brown',
      client: 'Michael Brown',
      caseType: 'Criminal',
      status: 'Closed',
      dateFiled: '2023-05-10',
      assignedLawyer: 'John Harris',
      caseDescription: 'Fraud charges related to an investment scam.',
    },
    {
      caseId: 106,
      caseName: 'Wilson Property Dispute',
      client: 'Laura Wilson',
      caseType: 'Civil',
      status: 'Open',
      dateFiled: '2023-06-15',
      assignedLawyer: 'William Turner',
      caseDescription: 'Dispute over property damage in a construction project.',
    }
  ];    

  return (
    <div className='bg-muted flex flex-col justify-center items-center align-middle w-full h-screen'>
      <Card className='w-11/12 md:w-5/6'>
        <CardHeader>
          <CardTitle className='text-center text-2xl md:text-3xl lg:text-4xl pb-3 font-bold'>View Cases</CardTitle>
          <CardDescription className='text-center text-base md:text-lg lg:text-xl pb-3'>Total Cases: <strong>30</strong></CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex space-x-2 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input placeholder="Search Cases..." className="pl-8" />
            </div>
            <Button variant="outline">Filter</Button>
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
              {cases.map((matter) => (
                <TableRow key={matter.caseId}>
                  <TableCell>{matter.caseName}</TableCell>
                  <TableCell>{matter.client}</TableCell>
                  <TableCell>{matter.caseType}</TableCell>
                  <TableCell>{matter.status}</TableCell>
                  <TableCell>
                    <Button asChild>
                      <Link href={`/cases/view/${matter.caseId}`}>View</Link>
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
