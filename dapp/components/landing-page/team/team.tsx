'use client'
import Button from "../button/button";
import { Monkey } from "./graphic";
import styles from "./team.module.css";
import { motion } from "framer-motion";

export default function Team() {

  return (
    <div className={styles.body}>
        <div className={styles.background}><Monkey/></div>
        <motion.div className={styles.content}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        >
            <motion.div className={styles.title}
            initial={{ x: 200 }}
            whileInView={{ x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            >
                The Team
            </motion.div>
            <div className={styles.info}>
                <motion.div className={styles.description}
                initial={{ x: -200 }}
                whileInView={{ x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2 }}
                >
                    <span className={styles.highlight}>Australopitech</span> is all about helping develop innovative and disruptive solutions that support the progressive decentralization of all things. Checkout our page to learn more about what we do.
                </motion.div>
                <motion.div className={styles.buttonContainer}
                initial={{ y: 100 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2 }}
                >
                    <Button text="VISIT OUR PAGE" icon={true} type="secondary" />
                </motion.div>
            </div>
        </motion.div>
    </div>
  )
}