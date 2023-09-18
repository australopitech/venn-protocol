import React, { useEffect, useLayoutEffect, useState } from 'react';
import styles from './work-in-progress-dialog.module.css';

const CloseButton = () => {
  return (
    <svg
      fill="none"
      height="27"
      overflow="visible"
      viewBox="0 0 27 27"
      width="27"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path
            d="M13.5064 27C20.9094 27 27 20.9094 27 13.5064C27 6.09061 20.9094 0 13.4936 0C6.07787 0 0 6.09061 0 13.5064C0 20.9094 6.09061 27 13.5064 27ZM9.41623 19.0618C8.57527 19.0618 7.92544 18.412 7.92544 17.5583C7.92544 17.176 8.09108 16.8065 8.3714 16.5262L11.3785 13.5191L8.3714 10.512C8.09108 10.2317 7.92544 9.84946 7.92544 9.47994C7.92544 8.62624 8.57527 7.9764 9.41623 7.9764C9.87494 7.9764 10.219 8.11656 10.512 8.42237L13.4936 11.3912L16.5007 8.40963C16.8065 8.10382 17.1505 7.96366 17.5965 7.96366C18.4375 7.96366 19.0873 8.6135 19.0873 9.4672C19.0873 9.84946 18.9344 10.2062 18.6413 10.4993L15.647 13.5191L18.6286 16.5135C18.9217 16.8065 19.0873 17.176 19.0873 17.5583C19.0873 18.412 18.4247 19.0618 17.5838 19.0618C17.1378 19.0618 16.7683 18.9217 16.4752 18.6286L13.4936 15.6597L10.5375 18.6286C10.2317 18.9217 9.87494 19.0618 9.41623 19.0618Z"
            fill="white"
        >
        </path>
      </g>
    </svg>
  )
}

export interface WorkInProgressDialogProps {
    setIsWorkInProgressOpen?: any;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const WorkInProgressDialog = ({
    setIsWorkInProgressOpen
}: WorkInProgressDialogProps) => {
  
    const onCloseDialog = () => {
        setIsWorkInProgressOpen(false);
    };

    const handleButtonClick = async() => {
      setIsWorkInProgressOpen(false);
    }

    const stopPropagation = (e: any) => {
        e.stopPropagation();
    };

    return (
        <div className={styles.workInProgressDialogBackdrop} onClick={stopPropagation}>
          <dialog className={styles.workInProgressDialog} onClick={onCloseDialog} open>
            <div className={styles.workInProgressDialogContent}>
              <div className={styles.workInProgressDescriptionContainer}>
              <p>This is a prototype of our product and is still a <span className={styles.workInProgress}>work in progress</span>. 
              <br />
              <br />
              We invite you to explore its current functionalities and get a taste 
              <br />
              of our upcoming project!</p>
              <br />
              <br />
              <button className={styles.exploreButton} onClick={handleButtonClick}>Click here to explore!</button>
              </div>
            </div>
          </dialog>
          <div onClick={() => onCloseDialog()} className={styles.closeButton}>
            <div>
              <CloseButton />
            </div>
          </div>
        </div>
    );
};
