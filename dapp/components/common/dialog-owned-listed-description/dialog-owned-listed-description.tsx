import React, { useEffect, useState } from 'react';
import styles from './dialog-owned-listed-description.module.css';
import classNames from 'classnames';
// import { useProvider } from 'wagmi';
// import ReleaseAsset from '../../wallet';
// import { getNFTobj, useNFTname, useNFTtitle } from '../../../hooks/nfts';

export interface DialogOwnedListedDescriptionProps {
    someProp?: any;
}

// function EditableInput() {
//   const [value, setValue] = useState('1'); // Default or initial value for the input
//   const [isEditable, setIsEditable] = useState(false); // State to track whether input is editable

//   const handleEdit = () => {
//     setIsEditable(true);
//   }

//   const handleSubmit = () => {
//     setIsEditable(false);
//   }

//   return (
//     <div>
//       {isEditable ? (
//         <>
//           <div>
//             <input 
//               type="text" 
//               value={value}
//               onChange={(e) => setValue(e.target.value)}
//             />
//             <div>
//               ETH/day
//             </div>
//           </div>
//           <button onClick={handleSubmit}>Done</button>
//         </>
//       ) : (
//         <>
//           <span>{`${value} ETH/day`}</span>
//           <button onClick={handleEdit}>Edit</button>
//         </>
//       )}
//     </div>
//   );
// }

const WarningIcon = () => {
  return (
    // <svg width="20px" height="20px" viewBox="0 0 61.44 61.44" xmlns="http://www.w3.org/2000/svg">
    //   <path fill="#000000" d="M30.72 3.84a26.88 26.88 0 1 1 0 53.76 26.88 26.88 0 0 1 0 -53.76zm0 49.92a23.04 23.04 0 0 0 0 -46.08 23.04 23.04 0 0 0 0 46.08zm2.88 -10.56a2.88 2.88 0 1 1 -5.76 0 2.88 2.88 0 0 1 5.76 0zm-2.88 -27.84a1.92 1.92 0 0 1 1.92 1.92v17.28a1.92 1.92 0 0 1 -3.84 0V17.28a1.92 1.92 0 0 1 1.92 -1.92z"/>
    // </svg>
    <svg className={styles.warningIcon} width="18px" height="18px" viewBox="0 0 61.44 61.44" xmlns="http://www.w3.org/2000/svg">
    <path 
      fill="#D52941" 
      stroke="#D52941" 
      stroke-width="2" 
      stroke-linecap="round"
      d="M30.72 3.84a26.88 26.88 0 1 1 0 53.76 26.88 26.88 0 0 1 0 -53.76zm0 49.92a23.04 23.04 0 0 0 0 -46.08 23.04 23.04 0 0 0 0 46.08zm2.88 -10.56a2.88 2.88 0 1 1 -5.76 0 2.88 2.88 0 0 1 5.76 0zm-2.88 -27.84a1.92 1.92 0 0 1 1.92 1.92v17.28a1.92 1.92 0 0 1 -3.84 0V17.28a1.92 1.92 0 0 1 1.92 -1.92z"/>
    </svg>

  )
}

export const DialogOwnedListedDescription = ({ 
  someProp
}: DialogOwnedListedDescriptionProps) => {
  // const provider = useProvider();
  const [duration, setDuration] = useState<number | undefined>();
  const [isDurationInvalid, setIsDurationInvalid] = useState<boolean | undefined>(false);
  
  const handleChange = (e: any) => {
    let numValue = parseInt(e.target.value);

    if (e.target.value === '') {
      numValue = 0
    }
    console.log('numValue is ', numValue)
    // If value is negative or not a number, set it to 0
    if ((numValue < 0 || isNaN(numValue)) ) {
      setIsDurationInvalid(true);
      setDuration(0);
    } else {
      setIsDurationInvalid(false);
      setDuration(numValue);
    }
  }

  const name = "Awesome NFT #1"
  const description = "This is an awesome NFT uhul."
  const price = 0.0001
  const maxDuration = 10

  return (
    <div className={styles.bodyDescriptionContainer}>
      <div className={styles.divider}></div>
      <div className={styles.bodyDescription}>
        <span>This NFT <span className={styles.textHilight}>is listed!</span></span>
        <br />
        {/* <span>Price: </span><EditableInput /> */}
        <span className={styles.nftLoanInfo}>{`Price: ${price} ETH/Day`}</span>
        <span className={styles.nftLoanInfo}>{`Maximum loan duration: ${maxDuration} ${maxDuration === 1 ? 'Day' : 'Days'}`}</span>
        <br />
        {/* <span className={styles.unlistInfo}>Would you like to unlist this NFT?</span> */}
        <div className={styles.unlistContainer}>
          <button className={styles.unlistButton}> Unlist NFT</button>
          <div className={styles.warning}>
            <WarningIcon /><span className={styles.warningText}>{`If you choose to unlist your NFT, it'll be removed from the market and won't be available for rent again until you relist it.`}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
