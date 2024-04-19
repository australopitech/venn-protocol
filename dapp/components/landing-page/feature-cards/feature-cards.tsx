'use client'
import { useState } from "react";
import styles from "./feature-cards.module.css";
import { SecuredByCode, CompletelyTrustless, CompatibleByDefault } from "./graphics";
import classNames from "classnames";

function SecuredByCodeCard () {
    const [open, setOpen] = useState(false);

    return (
        <div className={styles.card} onClick={() => setOpen(!open)} onBlur={() => setOpen(false)}>
            <div className={styles.content}>
                <div className={classNames(styles.graphic, open === true ? styles.background : '')}><SecuredByCode/></div>
                <div className={styles.textContainer}>
                <div className={classNames(styles.description, open === false ? styles.hidden : '')}>
                    Receive your payment and your NFT back without worrying. Everything is completely secured by our Smart Contracts.
                </div>
                </div>
                <div className={styles.title}>Secured by code</div>
            </div>
        </div>
    )
}

function CompletelyTrustlessCard () {
    const [open, setOpen] = useState(false);

    return (
        <div className={styles.card} onClick={() => setOpen(!open)} onBlur={() => setOpen(false)}>
            <div className={styles.content}>
                <div className={classNames(styles.graphicWide, open === true ? styles.background : '')}><CompletelyTrustless/></div>
                <div className={styles.textContainer}>
                <div className={classNames(styles.description, open === false ? styles.hidden : '')}>
                        Transact with complete strangers with certainty that the agreement will be fulfilled. Take part on this truly global market.
                </div>
                </div>
                <div className={styles.title}>Completely trustless.</div>
            </div>
        </div>
    )
}

function CompatibleByDefaultCard () {
    const [open, setOpen] = useState(false);

    return (
        <div className={styles.card} onClick={() => setOpen(!open)} onBlur={() => setOpen(false)}>
            <div className={styles.content}>
                <div className={classNames(styles.graphicWide, open === true ? styles.background : '')}><CompatibleByDefault/></div>
                <div className={styles.textContainer}>
                    <div className={classNames(styles.description, open === false ? styles.hidden : '')}>
                        Works with most major NFT platforms through Account Abstraction standards ERC-1271 and ERC-4337.
                    </div>
                </div>
                <div className={styles.title}>Compatible by default</div>
            </div>
        </div>
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