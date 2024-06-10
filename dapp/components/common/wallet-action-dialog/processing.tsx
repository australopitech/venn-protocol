'use client'
import { CloseIcon } from './graphics';
import styles from './wallet-action-dialog.module.css';
import { LoadingDotsBouncy } from '../loading/loading';


export default function ProcessingDialog () {

    return (
        <div className={styles.dialogBackdrop}>
            <div className={styles.dialog}>
                <div className={styles.dialogContent} style={{ cursor: 'progress' }}> 
                    <div className={styles.title}>
                        Processing
                    </div>
                    <div className={styles.description}>
                        Please wait while your request is processed.
                    </div>
                    <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
                        <LoadingDotsBouncy/>
                    </div>
                </div>
            </div>
        </div>

    )
}
