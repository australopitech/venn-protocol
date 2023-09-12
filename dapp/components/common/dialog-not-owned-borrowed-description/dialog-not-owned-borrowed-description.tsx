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

  const name = "Awesome NFT #1"
  const description = "This is an awesome NFT uhul. This is an awesome NFT uhul. This is an awesome NFT uhul. This is an awesome NFT uhul. This is an awesome NFT uhul. This is an awesome NFT uhul. This is an awesome NFT uhul. This is an awesome NFT uhul. This is an awesome NFT uhul. This is an awesome NFT uhul. This is an awesome NFT uhul. This is an awesome NFT uhul. "
  // const description = "This is an awesome NFT uhul."
  // const timeLeft = 3
  

  return (
    <div className={styles.descriptionContainer}>
      <h1 className={styles.title} title={name}>{name}</h1>
      <p className={styles.nftDescription}>
        {description}
      </p>
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
    </div>
  );
};
