import styles from "./user-cards.module.css";
import { ShareOwnership, TryIt } from "./graphics";

function ShareOwnershipCard () {

  return (
    <div className={styles.card}>
        <div className={styles.graphic}>
            <ShareOwnership/>
        </div>
        <div className={styles.textContainer}>
            <h1 className={styles.title}>Share ownership.<br/>Get paid.</h1>
            <p className={styles.description}>
                List your own NFTs and get paid for not holding them.<br/>
                Name your price, your time frame, and earn.
            </p>
            <div className={styles.linkContainer}>
              <div className={styles.link}>{`TRY IT OUT ->`}</div>
            </div>
        </div>
    </div>
  )
}

function TryItCard () {

  return (
    <div className={styles.card}>
        <div className={styles.textContainer}>
            <h1 className={styles.title}>Try it,<br/>before you buy it.</h1>
            <p className={styles.description}>
              Rent that NFT you&apos;ve been flirting with for a fraction of its value.<br/>Own it just for a while.<br/>No collateral. No commitment.
            </p>
            <div className={styles.linkContainer}>
              <div className={styles.link}>{`TRY IT OUT ->`}</div>
            </div>
        </div>
        <div className={styles.graphic}>
            <TryIt/>
        </div>
    </div>
  )
}


export default function UserCards () {

  return (
    <div>
        <ShareOwnershipCard/>
        <TryItCard/>
    </div>
  )
}