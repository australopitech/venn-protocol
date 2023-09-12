import React, { useEffect, useState } from 'react';
import styles from './dialog-owned-listed-description.module.css';
import classNames from 'classnames';
// import { useProvider } from 'wagmi';
// import ReleaseAsset from '../../wallet';
// import { getNFTobj, useNFTname, useNFTtitle } from '../../../hooks/nfts';

export interface DialogOwnedListedDescriptionProps {
    className?: string;
    index?: number;
    activeAccount?: string;
    context?: string;
}

let nft: any;
let _title: string | undefined;
let _name: string | undefined;

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

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const DialogOwnedListedDescription = ({ 
  className, 
  index, 
  activeAccount, 
  context 
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
    <div className={styles['bodyDescriptionContainer']}>
      <div className={styles.divider}></div>
      <div className={styles['bodyDescription']}>
        {`This NFT is listed!`}
        <br />
        {/* <span>Price: </span><EditableInput /> */}
        {`Price: ${price} ETH/Day`}
        <br />
        {`Max duration: ${maxDuration} ${maxDuration === 1 ? 'Day' : 'Days'}`}
        <br />
        Would you like to unlist this NFT?
        <button>Unlist</button>
        <br />
      </div>
    </div>
  );
};
