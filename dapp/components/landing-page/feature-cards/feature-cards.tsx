'use client'
import { useState } from "react";
import styles from "./feature-cards.module.css";
import { SecuredByCode, CompletelyTrustless, CompatibleByDefault } from "./graphics";
import classNames from "classnames";
import { motion } from "framer-motion";

function SecuredByCodeCard () {
    // const [open, setOpen] = useState(false);

    return (
        <motion.div 
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5 }}
        className={styles.card}>
            <div className={styles.content}>
                <div className={styles.front}>
                    <div className={styles.graphic}><SecuredByCode/></div>
                    <div className={styles.title}>Secured by code</div>
                </div>
                <div className={styles.back}>
                    <div className={classNames(styles.graphic, styles.background)}><SecuredByCode/></div>
                    <div className={styles.textContainer}>
                    <div className={styles.description}>
                        Receive your payment and your NFT back without worrying. Everything is completely secured by our Smart Contracts.
                    </div>
                    </div>
                    <div className={styles.title}>Secured by code</div>
                </div>
            </div>
        </motion.div>
    )
}

function CompletelyTrustlessCard () {
    // const [open, setOpen] = useState(false);

    return (
        <motion.div 
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.8 }}
        className={styles.card}>
            <div className={styles.content}>
                <div className={styles.front}>
                    <div className={styles.graphicWide}><CompletelyTrustless/></div>
                    <div className={styles.textContainer}>
                    <div className={classNames(styles.description, styles.hidden)}>
                            Transact with complete strangers with certainty that the agreement will be fulfilled. Take part on this truly global market.
                    </div>
                    </div>
                    <div className={styles.title}>Completely trustless</div>
                </div>
                <div className={styles.back}>
                    <div className={classNames(styles.graphicWide, styles.background)}><CompletelyTrustless/></div>
                    <div className={styles.textContainer}>
                    <div className={styles.description}>
                            Transact with complete strangers with certainty that the agreement will be fulfilled. Take part on this truly global market.
                    </div>
                    </div>
                    <div className={styles.title}>Completely trustless</div>
                </div>
            </div>
        </motion.div>
    )
}


function CompatibleByDefaultCard () {
    // const [open, setOpen] = useState(false);

    return (
        <motion.div 
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 1.1 }}
        className={styles.card}>
            <div className={styles.content}>
            <div className={styles.front}>
                    <div className={styles.graphicWide}><CompatibleByDefault/></div>
                    <div className={styles.textContainer}>
                    <div className={classNames(styles.description, styles.hidden)}>
                        Works with most major NFT platforms through Account Abstraction standards ERC-1271 and ERC-4337.
                    </div>
                    </div>
                    <div className={styles.title}>Compatible by default</div>
                </div>
                <div className={styles.back}>
                    <div className={classNames(styles.graphicWide, styles.background)}><CompatibleByDefault/></div>
                    <div className={styles.textContainer}>
                    <div className={styles.description}>
                        Works with most major NFT platforms through Account Abstraction standards ERC-1271 and ERC-4337.
                    </div>
                    </div>
                    <div className={styles.title}>Compatible by default</div>
                </div>
            </div>
        </motion.div>
    )
}



export default function FeatureCards () {
    return (
        <div className={styles.cardContainer}>
            <SecuredByCodeCard/>
            <CompletelyTrustlessCard/>
            <CompatibleByDefaultCard />
        </div>
    )
}