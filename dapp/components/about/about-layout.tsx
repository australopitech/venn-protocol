'use client'
import styles from './about-layout.module.css';
import NavBar from '@/components/common/navbar/navbar'

export default function AboutLayout () {
  return (
    <div className={styles.about} >
      <NavBar navbarGridTemplate={styles.navbarGridTemplate} currentPage='market' />
      <div className={styles.contentGridTemplate}> Write the about content here </div>
    </div>
  )
}
