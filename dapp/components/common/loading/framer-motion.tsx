'use client'
import { motion } from "framer-motion";

export function TranslatingCircles () {
    return (
        <div style={{
            aspectRatio: 50 / 50,
            position: 'relative',
            width: "40px",
            height: "auto",
            paddingTop: "5px",
            paddingLeft: "5px"
        }}>
            <motion.div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: "80%"
            }}
            initial={{ y: 0, x: 0 }}
            animate={{ y: [10, 0], x: [10, 0] }}
            transition={{
                // delay: 2,
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
            }}
            >
                <svg width="100%" height="100%" viewBox="5 5 137 137" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="70" cy="70" r="60" stroke="#000000" strokeWidth="10"/>
                </svg>
            </motion.div>
            <motion.div style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: "60%"
            }}
            initial={{ y: 0, x: 0 }}
            animate={{ y: [-13, 0], x: [-13, 0] }}
            transition={{
                // delay: 2,
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
            }}
            >
                <svg width="100%" height="100%" viewBox="5 5 137 137" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="70" cy="70" r="60" stroke="#000000" strokeWidth="10"/>
                </svg>

            </motion.div>
            
        </div>
    )
}