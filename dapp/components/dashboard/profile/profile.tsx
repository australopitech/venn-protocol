import styles from './profile.module.css';
import { FaucetIcon, SendIcon, ConnectIcon } from './graphics';

export default function Profile () {

    return (
        <div className={styles.profile}>
            <div className={styles.avatar}></div>
            <span className={styles.info}>0x123...4567</span>
            <span className={styles.yourBalance}>your balance</span>
            <span className={styles.info}>1.000 ETH</span>
            <div className={styles.buttons}>
                <div className={styles.buttonContainer}>
                    <div className={styles.button}>
                        <span className={styles.buttonText}>send</span>
                        <div className={styles.icon}><SendIcon/></div>
                    </div>
                    <span className={styles.buttonDescription}>send</span>                    
                </div>
                <div className={styles.buttonContainer}>
                    <div className={styles.button}>
                        <span className={styles.buttonText}>connect</span>
                        <div className={styles.icon}><ConnectIcon/></div>
                    </div>
                    <span className={styles.buttonDescription}>connect</span>
                </div>
                <div className={styles.buttonContainer}>
                    <div className={styles.button}>
                        <span className={styles.buttonText}>faucet</span>
                        <div className={styles.icon}><FaucetIcon/></div>
                    </div>
                    <span className={styles.buttonDescription}>faucet</span>                    
                </div>
            </div>
        </div>
    )
}