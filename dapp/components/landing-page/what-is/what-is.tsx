'use client'
import Button from "../button/button";
import styles from "./what-is.module.css";
import { motion , AnimatePresence } from 'framer-motion';

// function UpRightArrow () {
//     return (
//         <svg width="100%" height="auto" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
//             <g clip-path="url(#clip0_17_1111)">
//             <path d="M4.16667 45.8334L45.8333 4.16675M45.8333 4.16675H8.33334M45.8333 4.16675V41.6667" stroke="black" stroke-width="8.33333" stroke-linecap="round" stroke-linejoin="round"/>
//             </g>
//             <defs>
//             <clipPath id="clip0_17_1111">
//             <rect width="50" height="50" fill="white"/>
//             </clipPath>
//             </defs>
//         </svg>
//     )
// }

export default function WhatIs () {
    return (
        <div className={styles.body}>
            <AnimatePresence>
            <motion.div className={styles.title}
            key={1}
            initial={{ opacity:0, x:-100 }}
            whileInView={{ opacity:1, x:0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            >
                What is Venn?
            </motion.div>
            <motion.div className={styles.descriptionContainer}
            key={2}
            initial={{ x:100 }}
            whileInView={{ x:0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            >
                <div className={styles.description}>
                    Venn leverages Account Abstraction to to bring users a vibrant and safe NFT Rentals Market.
                </div>
                {/* <div className={styles.button}>LEARN MORE <div className={styles.arrow}><UpRightArrow/></div></div> */}
                <a href="https://australopitech.gitbook.io/venn" target="_blank"><Button text="LEARN MORE" icon={true} type="secondary"/></a>
            </motion.div>
            </AnimatePresence>
        </div>
    )
}