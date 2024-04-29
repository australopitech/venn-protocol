'use client'
import styles from './demo-screen.module.css';
import { motion } from "framer-motion";

export default function DemoScreen () {
    return (
        <div className={styles.screenshotContainer}>
            <motion.div className={styles.screenshot}
            initial={{ scale: 1 , y: 0}}
            whileHover={{ scale: 1.1, y: -10 }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring"}}
            >
              <img alt="dashboard print" src='/dashboard-print.png'  />
            </motion.div>
        </div>
    )
}