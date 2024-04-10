import styles from "./user-cards.module.css";
import { ShareOwnership } from "./graphics";

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
        </div>
    </div>
  )
}


export default function UserCards () {

  return (
    <div>
        <ShareOwnershipCard/>
    </div>
  )
}