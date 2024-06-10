'use client'
import { useState } from 'react';
import { Tooltip } from '../tooltip/tooltip';
import { CloseIcon } from './graphics';
import styles from './wallet-action-dialog.module.css';

interface ErrorDialogProps {
    close: any;
    message?: string;
}

const defaultCopyText = "click to copy"
const altCopyText = "copied!"

export default function ErrorDialog ({message, close} : ErrorDialogProps) {
    const [copyText, setCopyText] = useState(defaultCopyText);

    const onCopy = async () => {
        await navigator.clipboard.writeText(message ?? '');
        setCopyText(altCopyText);
        setTimeout(() => {
            setCopyText(defaultCopyText);
        }, 5000);
    }

    return (
        <div className={styles.dialogBackdrop}>
            <div className={styles.dialog}>
                <div className={styles.dialogContent}>
                    <div className={styles.closeIcon} onClick={close}>
                        <CloseIcon />
                    </div>
                    <div className={styles.title}>An Error Ocurred!</div>
                    <Tooltip text={copyText}>
                        <div className={styles.errorMessage} onClick={onCopy}>
                            {message}
                        </div>
                    </Tooltip>
                    <div className={styles.description}>
                        <a className={styles.link}
                        href='https://github.com/australopitech/venn-protocol/issues' target='_blank'>
                            Report this issue
                        </a>
                    </div>
                    <div className={styles.cancelButton} onClick={close}>
                        close
                    </div>
                </div>
            </div>
        </div>
    )
}