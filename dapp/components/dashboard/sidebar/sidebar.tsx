import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useEtherBalance, useEthers, useSigner } from '@usedapp/core';
import styles from './sidebar.module.css';
import classNames from 'classnames';
import compactString from '@/utils/compactString'
import { nftViewMode, nftViewContext } from '@/types/nftContext';

interface QueryParams {
  address: string;
}

export interface SideBarProps {
  sidebarGridTemplate?: string;
  address?: string;
  nftsContext: nftViewContext;
}


const copyAddress = async (address?: string) => {
  if(!address) return;
  await navigator.clipboard.writeText(address);
  // setTooltipMessage('Address copied');
}

const CopyIcon = () => {
  return (
    <svg fill="#6d6d6d" height="20px" viewBox="0 0 82 100" width="20px" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.9546 23.2012H29.2528V14.4918C29.2528 12.9307 29.655 11.7372 30.4592 10.9115C31.2635 10.0858 32.4899 9.67289 34.1383 9.67289H49.156V26.2691C49.156 28.8288 49.8581 30.8106 51.2621 32.2146C52.6661 33.6187 54.6369 34.3207 57.1744 34.3207H72.5207V64.6307C72.5207 66.1814 72.1211 67.3723 71.3221 68.2032C70.5229 69.0341 69.305 69.4495 67.6684 69.4495H61.114V78.7477H68.6159C72.9348 78.7477 76.2206 77.6159 78.4733 75.3521C80.7259 73.0884 81.8521 69.7748 81.8521 65.4115V36.3537C81.8521 33.4878 81.5119 31.0601 80.8313 29.0708C80.1507 27.0815 78.9773 25.2376 77.3113 23.5391L59.1095 4.93109C57.5189 3.30796 55.7371 2.14276 53.7641 1.43549C51.7911 0.728293 49.5455 0.374695 47.0272 0.374695H33.1576C28.8387 0.374695 25.5585 1.51213 23.3169 3.78699C21.0754 6.06179 19.9546 9.36976 19.9546 13.7109V23.2012ZM56.5573 25.1949V13.0354L70.175 26.9194H58.2818C57.1322 26.9194 56.5573 26.3446 56.5573 25.1949ZM0.685669 85.7457C0.685669 90.109 1.80643 93.4226 4.04795 95.6863C6.28948 97.95 9.56975 99.0819 13.8887 99.0819H49.3469C53.6659 99.0819 56.9517 97.9445 59.2043 95.6697C61.4569 93.3948 62.5832 90.0868 62.5832 85.7457V57.1698C62.5832 54.3438 62.3162 52.086 61.782 50.3963C61.2479 48.7066 60.0931 46.9629 58.3176 45.1652L38.4265 24.9745C36.7177 23.2212 35.0128 22.0719 33.312 21.5267C31.6113 20.9815 29.47 20.7089 26.8882 20.7089H13.8887C9.56975 20.7089 6.28948 21.8463 4.04795 24.1211C1.80643 26.396 0.685669 29.704 0.685669 34.0451V85.7457ZM9.98395 84.9648V34.826C9.98395 33.2649 10.3861 32.0714 11.1903 31.2457C11.9946 30.42 13.2209 30.0071 14.8693 30.0071H25.3281V49.4664C25.3281 52.6177 26.0953 54.955 27.6295 56.4781C29.1637 58.0012 31.4954 58.7628 34.6245 58.7628H53.2516V84.9648C53.2516 86.5156 52.8577 87.7065 52.0697 88.5373C51.2817 89.3682 50.0583 89.7837 48.3995 89.7837H14.836C13.2098 89.7837 11.9946 89.3682 11.1903 88.5373C10.3861 87.7065 9.98395 86.5156 9.98395 84.9648ZM35.439 50.8845C33.9506 50.8845 33.2064 50.1403 33.2064 48.6519V31.4985L52.2594 50.8845H35.439Z">
      </path>
    </svg>
  )
}

const Profile = ({ address }: {address?: string}) => {
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
        <div className={styles.copyIcon} onClick={() => copyAddress(address)}>
          <CopyIcon />
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

const YourNfts = ({ nftsContext } : {nftsContext: nftViewContext}) => {
  const router = useRouter();
  const address = router.query.address as QueryParams['address'];
  const {account} = useEthers();
  const { mode, setNftsViewMode } = nftsContext;
  return (
    <div className={styles.yourNftsContainer}>
      <span className={styles.profileSectionTitle}>{((address&&account&&address===account) || (account&&!address)) && 'YOUR'} NFTS</span>

      <div>
        <div 
          className={mode === 'owned' ? styles.menuItemSelected : styles.menuItem}
          onClick={() => setNftsViewMode('owned')} // Set mode to 'owned' on click
        >
          <span>
            Owned
          </span>
          {nftsContext.mode === 'owned' 
            ? <SelectedIcon />
            : <></>
          }
        </div>
        
        <div 
          className={mode === 'rented' ? styles.menuItemSelected : styles.menuItem}
          onClick={() => setNftsViewMode('rented')} // Set mode to 'rented' on click
        >
          <span>
            Rentals
          </span>
          {nftsContext.mode === 'rented' 
            ? <SelectedIcon />
            : <></>
          }
        </div>
      </div>
    </div>
  )
}

const SendIcon =  () => { //3C4252
  return (
    <div className={styles.sendIcon}>
      <svg
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 28 28"
        xmlSpace="preserve"
        width="20"
        height="20"
      >
        <g>
          <g>
            <path
              d="M27.352 12.957 1.697 0.129C0.639 -0.4 -0.443 0.801 0.192 1.798l7.765 12.202L0.192 26.202c-0.635 0.998 0.447 2.198 1.505 1.669l25.655 -12.828c0.86 -0.43 0.86 -1.656 0 -2.086zM4.42 23.902 10.323 14.626a1.166 1.166 0 0 0 0 -1.252L4.42 4.098l19.803 9.902L4.42 23.902z"
              stroke="#4f4f4fe6"
              fill="#4f4f4fe6"
            />
          </g>
        </g>
      </svg>
    </div>
  )
}

const SwapIcon =  () => {
  return (
    <svg 
      version="1.1" 
      id="Layer_1" 
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink" 
      x="0px" 
      y="0px" 
      viewBox="0 0 32 32" 
      xmlSpace="preserve" 
      width="28px" 
      height="28px"
    >
      <g>
        <g>
          <g>
            <path
              d="M4.552 13.333H20c0.736 0 1.333 -0.597 1.333 -1.333 0 -0.736 -0.597 -1.333 -1.333 -1.333H4.552l3.057 -3.057c0.521 -0.521 0.521 -1.365 0 -1.886 -0.521 -0.521 -1.365 -0.521 -1.886 0L0.391 11.057c-0.031 0.031 -0.06 0.064 -0.088 0.098 -0.013 0.015 -0.024 0.032 -0.035 0.047 -0.014 0.019 -0.029 0.038 -0.042 0.057 -0.013 0.019 -0.024 0.039 -0.035 0.058 -0.011 0.018 -0.022 0.035 -0.032 0.054 -0.011 0.02 -0.02 0.04 -0.029 0.06 -0.009 0.019 -0.019 0.038 -0.027 0.058 -0.008 0.02 -0.015 0.04 -0.022 0.06 -0.008 0.021 -0.016 0.042 -0.022 0.063 -0.006 0.02 -0.011 0.04 -0.016 0.061 -0.006 0.022 -0.012 0.044 -0.016 0.066 -0.005 0.023 -0.007 0.047 -0.011 0.071 -0.003 0.019 -0.006 0.039 -0.008 0.058a1.342 1.342 0 0 0 0 0.263c0.002 0.02 0.006 0.039 0.008 0.058 0.003 0.024 0.006 0.047 0.011 0.071 0.004 0.022 0.011 0.044 0.016 0.066 0.005 0.02 0.009 0.041 0.016 0.061 0.006 0.021 0.015 0.042 0.022 0.063 0.007 0.02 0.014 0.04 0.022 0.06 0.008 0.02 0.018 0.038 0.027 0.058 0.01 0.02 0.019 0.041 0.029 0.061 0.01 0.018 0.021 0.036 0.032 0.054 0.012 0.019 0.023 0.039 0.035 0.058 0.013 0.02 0.028 0.038 0.042 0.057 0.012 0.016 0.023 0.032 0.036 0.048 0.028 0.034 0.057 0.066 0.088 0.097l0.001 0.001 5.333 5.333c0.521 0.521 1.365 0.521 1.886 0 0.521 -0.521 0.521 -1.365 0 -1.886l-3.057 -3.057z"
              stroke="#4f4f4fe6"
              fill="#4f4f4fe6"
            />
            <path
              d="M31.698 20.845c0.013 -0.015 0.024 -0.032 0.036 -0.048 0.014 -0.019 0.029 -0.037 0.042 -0.057 0.013 -0.019 0.024 -0.039 0.035 -0.058 0.011 -0.018 0.022 -0.035 0.032 -0.054 0.011 -0.02 0.02 -0.04 0.029 -0.061 0.009 -0.019 0.019 -0.038 0.027 -0.058 0.008 -0.02 0.015 -0.04 0.022 -0.06 0.008 -0.021 0.016 -0.042 0.022 -0.063 0.006 -0.02 0.011 -0.04 0.016 -0.061 0.006 -0.022 0.012 -0.044 0.016 -0.066 0.005 -0.023 0.007 -0.047 0.011 -0.071 0.003 -0.019 0.006 -0.039 0.008 -0.058 0.009 -0.087 0.009 -0.176 0 -0.263 -0.002 -0.02 -0.006 -0.039 -0.008 -0.058 -0.003 -0.024 -0.006 -0.047 -0.011 -0.071 -0.004 -0.022 -0.011 -0.044 -0.016 -0.066 -0.005 -0.02 -0.009 -0.041 -0.016 -0.061 -0.006 -0.021 -0.015 -0.042 -0.022 -0.063 -0.007 -0.02 -0.014 -0.04 -0.022 -0.06 -0.008 -0.02 -0.018 -0.038 -0.027 -0.058 -0.01 -0.02 -0.019 -0.041 -0.029 -0.061 -0.01 -0.018 -0.021 -0.036 -0.032 -0.054 -0.012 -0.019 -0.023 -0.039 -0.035 -0.058 -0.013 -0.02 -0.028 -0.038 -0.042 -0.057 -0.012 -0.016 -0.023 -0.032 -0.036 -0.048a1.335 1.335 0 0 0 -0.087 -0.096l-0.001 -0.001 -5.333 -5.333c-0.521 -0.521 -1.365 -0.521 -1.886 0s-0.521 1.365 0 1.886l3.057 3.057H12c-0.736 0 -1.333 0.597 -1.333 1.333s0.597 1.333 1.333 1.333h15.448l-3.057 3.057c-0.521 0.521 -0.521 1.365 0 1.886s1.365 0.521 1.886 0l5.333 -5.333 0.001 -0.001a1.379 1.379 0 0 0 0.087 -0.096z"
              stroke="#4f4f4fe6"
              fill="#4f4f4fe6"
            />
          </g>
        </g>
      </g>
    </svg>
  )
}

const YourBalance = () => {
  const router = useRouter();
  const address = router.query.address as QueryParams['address'];
  const bal = useEtherBalance(address);
  // const signer = useSigner();
  const { account, library } = useEthers();
  const [signerBalance, setSignerBalance] = useState<any>();

  useEffect(() => {
    if(account && library) {
      library.getBalance(account).then((r) => setSignerBalance(ethers.utils.formatEther(r)))
    }
  })

  return (
    <div className={styles.yourBalanceContainer}>
      <span className={styles.profileSectionTitle}>{((address&&account&&address===account) || (account&&!address))  && 'YOUR'} BALANCE</span>
      <div>
        <div className={styles.balanceValueContainer}>
          <span className={styles.balanceValue}>
            {(bal || account) && bal? parseFloat(ethers.utils.formatEther(bal)).toFixed(4)
            : parseFloat(signerBalance).toFixed(4) } 
          </span>
          <span className={styles.balanceCurrency}>
            ETH
          </span>
        </div>
        <div className={styles.balanceActionsContainer}>
          <div className={styles.actionContainer}><SendIcon /></div>
          <div className={styles.actionContainer}><SwapIcon /></div>
        </div>
      </div>
    </div>
  )
}

export default function SideBar ({ sidebarGridTemplate, address, nftsContext }: SideBarProps) {
  // const nftsContext: string =  "owned"

  return (
    <div className={sidebarGridTemplate}>
      <div className={styles.sidebar}>
        <div className={styles.profileInfo}>
          <Profile address={address} />
        </div>
        <div className={styles.profileInfo}>
          <YourNfts nftsContext={nftsContext} />
        </div>
        <div className={styles.profileInfo}>
          <YourBalance />
        </div>
      </div>
    </div>
  );
}
