'use client'
import styles from './contact-layout.module.css';
import NavBar from '@/components/common/navbar/navbar'

export default function ContactLayout () {
  return (
    <div className={styles.contact} >
      <NavBar navbarGridTemplate={styles.navbarGridTemplate} currentPage='market' />
      <div className={styles.contentGridTemplate}> Write the contact content here </div>
    </div>
  )
}
