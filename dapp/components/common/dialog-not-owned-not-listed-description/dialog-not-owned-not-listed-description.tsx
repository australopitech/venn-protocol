import React, { useEffect, useState } from 'react';
import styles from './dialog-not-owned-not-listed-description.module.css';
import classNames from 'classnames';

export interface DialogNotOwnedNotListedDescriptionProps {
    className?: string;
    index?: number;
    activeAccount?: string;
    context?: string;
}


/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const DialogNotOwnedNotListedDescription = ({ 
  className, 
  index, 
  activeAccount, 
  context 
}: DialogNotOwnedNotListedDescriptionProps) => {
  // const provider = useProvider();
  const [timeLeft, setTimeLeft] = useState<number>();
  // const [title, setTitle] = useState<string>();
  // const [name, setName] =  useState<string>();
  const [endTime, setEndTime] = useState<number>();

  const name = "Awesome NFT #1"
  const description = "This is an awesome NFT uhul."
  useEffect(() => {
    setTimeLeft(3)
  }, []);
  

  return (
    <div className={styles['bodyDescriptionContainer']}>
      <div className={styles.divider}></div>
      <div className={styles['bodyDescription']}>
        {`This NFT is not listed and not available for rent at the moment.`}
        {/* ${timeLeft && parseFloat((timeLeft > 86400? timeLeft/86400 : timeLeft>3600? timeLeft/3600 : timeLeft/60).toFixed(2))}
        ${timeLeft && (timeLeft > 86400? "days" : timeLeft>3600? "hours" : "minutes")}.`}           */}
      </div>
    </div>
  );
};
