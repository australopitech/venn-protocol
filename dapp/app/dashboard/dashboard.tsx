'use client'
import { NextPage } from 'next'
import Head from 'next/head'
import DashboardLayout from '@/components/dashboard/dashboard-layout/dashboard-layout';
import { useSessionDemand } from '../venn-provider';
import ApproveDialog from '@/components/common/approve-dialog/approve-dialog';

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
  // const { demandType } = useSessionDemand();
  const demandType = true;

  return (
    <>
      <Head>
        <title>WalletApp</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      {demandType && 
      <ApproveDialog />}
      <DashboardLayout />
    </>
  )
}

export default AddressPage
