'use client'
import styles from './demo-screen.module.css';
import Link from 'next/link';

export default function DemoScreen () {
    return (
        <div className={styles.screenshotContainer}>
            <Link href={'/'} className={styles.link}>
                <div className={styles.screenshot}>
                    <img alt="dashboard print" src='/dashboard-print.png'  />
                </div>
            </Link>
        </div>
    )
}