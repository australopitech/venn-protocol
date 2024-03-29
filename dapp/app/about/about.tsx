'use client'
import Head from 'next/head'
import AboutLayout from '@/components/about/about-layout'

export default function About() {
  return (
    <>
      <Head>
        <title>WalletApp</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      {/* <div className={styles.dashboard} >
        <NavBar navbarGridTemplate={styles.navbarGridTemplate} />
        <SideBar sidebarGridTemplate={styles.sidebar} />
        <NftArea nftAreaGridTemplate={styles.content} /> 
      </div> */}
      <AboutLayout />
    </>
  )
}
