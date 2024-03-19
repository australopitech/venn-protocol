'use client'
import Head from 'next/head'
import ContactLayout from '@/components/contact/contact-layout'

export default function Contact() {
  return (
    <>
      
      {/* <div className={styles.dashboard} >
        <NavBar navbarGridTemplate={styles.navbarGridTemplate} />
        <SideBar sidebarGridTemplate={styles.sidebar} />
        <NftArea nftAreaGridTemplate={styles.content} /> 
      </div> */}
      <ContactLayout />
    </>
  )
}
