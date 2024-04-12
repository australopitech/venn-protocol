import styles from "./feature-cards.module.css";
import { SecuredByCode, CompletelyTrustless, CompatibleByDefault } from "./graphics";

function SecuredByCodeCard () {
    return (
        <div className={styles.card}>
            <div className={styles.graphic}><SecuredByCode/></div>
            <div className={styles.textContainer}>
                <div className={styles.title}>Secured by code.</div>
                <div className={styles.description}>Receive your payment and your NFT back without worrying. Everything is completely secured by our Smart Contracts.</div>
            </div>
        </div>
    )
}

function CompletelyTrustlessCard () {
    return (
        <div className={styles.card}>
            <div className={styles.graphicWide}><CompletelyTrustless/></div>
            <div className={styles.textContainer}>
                <div className={styles.title}>Completely trustless.</div>
                <div className={styles.description}>Transact with complete strangers with certainty that the agreement will be fulfilled. Take part on this truly global market.</div>
            </div>
        </div>
    )
}

function CompatibleByDefaultCard () {
    return (
        <div className={styles.card}>
            <div className={styles.graphicWide}><CompatibleByDefault/></div>
            <div className={styles.textContainer}>
                <div className={styles.title}>Compatible by default.</div>
                <div className={styles.description}>Works with most major NFT platforms through Account Abstraction standards ERC-1271 and ERC-4337.</div>
            </div>
        </div>
    )
}



export default function FeatureCards () {
    return (
        <div className={styles.cardContainer}>
            <SecuredByCodeCard/>
            <CompletelyTrustlessCard/>
            <CompatibleByDefaultCard/>
        </div>
    )
}