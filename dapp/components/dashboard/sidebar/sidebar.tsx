'use client'

import styles from './sidebar.module.css';
import { compactString } from '@/utils/utils';
import Wallet from '../wallet/wallet';
import { ApproveData, nftViewContext } from '@/types';
import { copyAddress } from '@/utils/utils';
import { useState } from 'react';
import Tooltip from '@/components/common/tooltip/tooltip';

interface QueryParams {
  address: string;
}

export interface SideBarProps {
  sidebarGridTemplate?: string;
  address?: string;
  nftsContext: nftViewContext;
  setApproveData: React.Dispatch<React.SetStateAction<ApproveData | undefined>>;
  openTransfer?: boolean,
  setOpenTransfer: any
  openConnect: boolean,
  setOpenConnect: any
}


const CopyIcon = () => {
  return (
    <svg fill="#6d6d6d" height="20px" viewBox="0 0 82 100" width="20px" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.9546 23.2012H29.2528V14.4918C29.2528 12.9307 29.655 11.7372 30.4592 10.9115C31.2635 10.0858 32.4899 9.67289 34.1383 9.67289H49.156V26.2691C49.156 28.8288 49.8581 30.8106 51.2621 32.2146C52.6661 33.6187 54.6369 34.3207 57.1744 34.3207H72.5207V64.6307C72.5207 66.1814 72.1211 67.3723 71.3221 68.2032C70.5229 69.0341 69.305 69.4495 67.6684 69.4495H61.114V78.7477H68.6159C72.9348 78.7477 76.2206 77.6159 78.4733 75.3521C80.7259 73.0884 81.8521 69.7748 81.8521 65.4115V36.3537C81.8521 33.4878 81.5119 31.0601 80.8313 29.0708C80.1507 27.0815 78.9773 25.2376 77.3113 23.5391L59.1095 4.93109C57.5189 3.30796 55.7371 2.14276 53.7641 1.43549C51.7911 0.728293 49.5455 0.374695 47.0272 0.374695H33.1576C28.8387 0.374695 25.5585 1.51213 23.3169 3.78699C21.0754 6.06179 19.9546 9.36976 19.9546 13.7109V23.2012ZM56.5573 25.1949V13.0354L70.175 26.9194H58.2818C57.1322 26.9194 56.5573 26.3446 56.5573 25.1949ZM0.685669 85.7457C0.685669 90.109 1.80643 93.4226 4.04795 95.6863C6.28948 97.95 9.56975 99.0819 13.8887 99.0819H49.3469C53.6659 99.0819 56.9517 97.9445 59.2043 95.6697C61.4569 93.3948 62.5832 90.0868 62.5832 85.7457V57.1698C62.5832 54.3438 62.3162 52.086 61.782 50.3963C61.2479 48.7066 60.0931 46.9629 58.3176 45.1652L38.4265 24.9745C36.7177 23.2212 35.0128 22.0719 33.312 21.5267C31.6113 20.9815 29.47 20.7089 26.8882 20.7089H13.8887C9.56975 20.7089 6.28948 21.8463 4.04795 24.1211C1.80643 26.396 0.685669 29.704 0.685669 34.0451V85.7457ZM9.98395 84.9648V34.826C9.98395 33.2649 10.3861 32.0714 11.1903 31.2457C11.9946 30.42 13.2209 30.0071 14.8693 30.0071H25.3281V49.4664C25.3281 52.6177 26.0953 54.955 27.6295 56.4781C29.1637 58.0012 31.4954 58.7628 34.6245 58.7628H53.2516V84.9648C53.2516 86.5156 52.8577 87.7065 52.0697 88.5373C51.2817 89.3682 50.0583 89.7837 48.3995 89.7837H14.836C13.2098 89.7837 11.9946 89.3682 11.1903 88.5373C10.3861 87.7065 9.98395 86.5156 9.98395 84.9648ZM35.439 50.8845C33.9506 50.8845 33.2064 50.1403 33.2064 48.6519V31.4985L52.2594 50.8845H35.439Z">
      </path>
    </svg>
  )
}

const tooltipDefaultText = 'Click to copy';
const toooltipAltText = 'Copied!'

const Profile = ({ address }: {address?: string}) => {
  const [tooltipText, setTooltipText] = useState(tooltipDefaultText);

  const onCopy = async () => {
    await copyAddress(address);
    setTooltipText(toooltipAltText);
    setTimeout(() => {
      setTooltipText(tooltipDefaultText)
    }, 5000);
  }

  return (
    <div className={styles.userInfoContainer}>
      <div className={styles.avatar}>
        AV
      </div>
      <div className={styles.addressContainer}>
        <span className={styles.address}>
          {/* 0x123...4567 */}
          {compactString(address)}
        </span>
        <div className={styles.copyIcon} onClick={() => onCopy()}>
          <Tooltip text={tooltipText}><CopyIcon /></Tooltip>
        </div>
      </div>
    </div>
  )
}

const SelectedIcon = () => {
  return (
    // <svg fill="none" height="24" viewBox="0 0 22 22" width="24" xmlns="http://www.w3.org/2000/svg" class="snipcss0-3-5-6">
    //   <path d="M10.6973 21.5059C16.498 21.5059 21.2441 16.7598 21.2441 10.959C21.2441 5.14844 16.498 0.402344 10.6875 0.402344C4.88672 0.402344 0.140625 5.14844 0.140625 10.959C0.140625 16.7598 4.88672 21.5059 10.6973 21.5059ZM10.6973 18.3223C6.61523 18.3223 3.32422 15.0312 3.32422 10.959C3.32422 6.87695 6.61523 3.58594 10.6875 3.58594C14.7695 3.58594 18.0605 6.87695 18.0605 10.959C18.0605 15.0312 14.7695 18.3223 10.6973 18.3223ZM8.61719 15.6953C8.99805 16.0762 9.79883 16.0664 10.209 15.6758L13.8711 12.248C14.5938 11.5742 14.5938 10.373 13.8711 9.69922L10.209 6.28125C9.75 5.85156 9.07617 5.86133 8.65625 6.25195C8.17773 6.68164 8.17773 7.43359 8.62695 7.86328L11.9668 10.9688L8.62695 14.084C8.1875 14.5039 8.14844 15.2266 8.61719 15.6953Z" fill="#25292E">
    //   </path>
    // </svg>
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="-1 -1 28 28"
      width="24"
      height="24"
    >
      <g>
        <g>
          <g>
            <path
              d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12 -5.373 12 -12S18.627 0 12 0zm0 22c-5.523 0 -10 -4.477 -10 -10S6.477 2 12 2 22 6.477 22 12 17.523 22 12 22z"
              stroke="#F0A6CA"
              fill="#F0A6CA"
              // strokeWidth="2"
            />
            <path
              d="M10.707 6.293c-0.391 -0.391 -1.024 -0.391 -1.414 0 -0.391 0.391 -0.391 1.024 0 1.414L13.586 12l-4.293 4.293c-0.391 0.391 -0.391 1.024 0 1.414 0.391 0.391 1.024 0.391 1.414 0l5 -5c0.391 -0.391 0.391 -1.024 0 -1.414L10.707 6.293z"
              stroke="#F0A6CA"
              fill="#F0A6CA"
              // strokeWidth="2"
            />
          </g>
        </g>
      </g>
    </svg>
  )
}

// const YourNfts = ({ nftsContext } : {nftsContext: nftViewContext}) => {
//   const router = useRouter();
//   const address = router.query.address as QueryParams['address'];
//   const {account} = useEthers();
//   const { mode, setNftsViewMode } = nftsContext;
//   return (
//     <div className={styles.yourNftsContainer}>
//       <span className={styles.profileSectionTitle}>{((address&&account&&address===account) || (account&&!address)) && 'YOUR'} NFTS</span>

//       <div>
//         <div 
//           className={mode === 'owned' ? styles.menuItemSelected : styles.menuItem}
//           onClick={() => setNftsViewMode('owned')} // Set mode to 'owned' on click
//         >
//           <span>
//             Owned
//           </span>
//           {nftsContext.mode === 'owned' 
//             ? <SelectedIcon />
//             : <></>
//           }
//         </div>
        
//         <div 
//           className={mode === 'rented' ? styles.menuItemSelected : styles.menuItem}
//           onClick={() => setNftsViewMode('rented')} // Set mode to 'rented' on click
//         >
//           <span>
//             Rentals
//           </span>
//           {nftsContext.mode === 'rented' 
//             ? <SelectedIcon />
//             : <></>
//           }
//         </div>
//       </div>
//     </div>
//   )
// }


export default function SideBar ({
   sidebarGridTemplate, address, nftsContext,  
   setApproveData, openTransfer, setOpenTransfer, openConnect, setOpenConnect 
}: SideBarProps) {
  // const nftsContext: string =  "owned"
  // console.log('sidebar addr', address)
  return (
    <div className={sidebarGridTemplate}>
      <div className={styles.sidebar}>
        <div className={styles.profileInfo}>
          <Profile address={address} />
        </div>
        {/* <div className={styles.profileInfo}>
          <YourNfts nftsContext={nftsContext} />
        </div> */}
        <div className={styles.profileInfo}>
          <Wallet 
          address={address}
          setApproveData={setApproveData}
          openTransfer={openTransfer}
          setOpenTransfer={setOpenTransfer}
          openConnect={openConnect}
          setOpenConnect={setOpenConnect}
          />
        </div>
      </div>
    </div>
  );
}
