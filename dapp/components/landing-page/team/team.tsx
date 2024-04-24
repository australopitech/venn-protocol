'use client'
import styles from "./team.module.css";
import { motion } from "framer-motion";

export default function Team() {

  return (
    <div className={styles.body}>
        <motion.div className={styles.content}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        >
            <div className={styles.info}>
                <motion.div className={styles.description}
                initial={{ x: -200 }}
                whileInView={{ x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2 }}
                >
                    <b>Australopitech</b> is a web development agency born in Brazil. Our team is deeply passionate about designing solutions that enable the progressive decentralization of our institutions. The end goal is user sovereignty and a strictly voluntary and amply inclusive social-economic layer. To achieve this goal, the core principles should be decentralization, censorship-resistance, trustlessness, privacy and transparency.
                </motion.div>
                <motion.div className={styles.buttonContainer}
                initial={{ y: 100 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2 }}
                >
                    <motion.div className={styles.button}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    >
                        VISIT OUR WEBSITE
                    </motion.div>
                </motion.div>
            </div>
            <motion.div className={styles.title}
            initial={{ x: 200 }}
            whileInView={{ x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            >
                The Team
            </motion.div>
        </motion.div>
    </div>
  )
}