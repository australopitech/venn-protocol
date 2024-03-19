'use client'
import { NextPage } from 'next'
import Head from 'next/head'
import DashboardLayout from '@/components/dashboard/dashboard-layout/dashboard-layout';


interface QueryParams {
  address: string;
}

const AddressPage: NextPage = () => {
  // Use the useRouter hook to access route parameters
//   const router = useRouter()
//   const address = router.query.address as QueryParams['address'];

//   // Ensure address exists and is a string
//   if (typeof address !== 'string') {
//     return <div>Invalid address parameter.</div>;
//   }



  return (
    <>
      <DashboardLayout />
    </>
  )
}

export default AddressPage
