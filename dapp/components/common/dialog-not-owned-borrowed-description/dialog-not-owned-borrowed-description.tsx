import React, { useEffect, useState } from 'react';
import styles from './dialog-not-owned-borrowed-description.module.css';

export interface DialogNotOwnedBorrowedDescriptionProps {
  someProp?: any;
}

export const DialogNotOwnedBorrowedDescription = ({ 
  someProp
}: DialogNotOwnedBorrowedDescriptionProps) => {
  // const provider = useProvider();
  const [timeLeft, setTimeLeft] = useState<number>(0);
  // const [title, setTitle] = useState<string>();
  // const [name, setName] =  useState<string>();
  // const [endTime, setEndTime] = useState<number>();  

  return (
    <div className={styles.bodyDescriptionContainer}>
      <div className={styles.divider}></div>
      <div className={styles.bodyDescription}>
        <span>
        This NFT was lent to you. The loan expires in
        </span>
        <span className={styles.timeLeftValue}> 
          {`${timeLeft} ${timeLeft === 1 ? 'day' : 'days'}`} 
        </span>
      </div>
    </div>
  );
};
