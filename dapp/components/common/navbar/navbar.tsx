'use client'
import classNames from 'classnames';
import { Logo, Name } from '../logo/logo';
import { SearchBox } from '../search-box/search-box';
import styles from './navbar.module.css';
import { useState, useRef, useEffect, useCallback } from 'react';
// import { useEthers, useEtherBalance, useConfig, useSigner } from '@usedapp/core';
import Link from 'next/link';
// import { SignInButton } from '@/components/dashboard/dashboard-layout/dashboard-layout';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useRouter, usePathname } from 'next/navigation';
import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi';
// import { signOut } from '@/app/venn-provider';
import { activeNetwork, useSmartAccount, useSmartAccountAddress, useVsaUpdate} from '@/app/account/venn-provider';
import { compactString } from '@/utils/utils';
import { Tooltip } from '../tooltip/tooltip';
import { LoadingDots } from '../loading/loading';

export interface NavBarProps {
  signInPage?: boolean;
  navbarGridTemplate?: string;
  currentPage?: string;
}

interface ConnectButtonProps {
  connectText?: string;
  // page?: string
}

//to-do: pegar a info de qual pagina está, para saber qual botão está ativo

const ConnectButton = ({connectText} : ConnectButtonProps) => {
  const { address: vsa } = useSmartAccount();
  const eoa = useAccount();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  const path = usePathname();
  const [showDisconnect, setShowDisconnect] = useState(false);
  const [disconnectStlye, setDisconnectStyle] = useState<any>(styles.disconnectButton);
  const [showSwitchNetwork, setShowSwitchNetwork] = useState(false);
  const vsaUpdate = useVsaUpdate();
  const [isClient, setIsClient] = useState(false);
  const compactAddress = compactString(vsa ?? eoa.address);
  const { chain } = useNetwork();
  const { switchNetwork, error } = useSwitchNetwork();

  useEffect(() => {
    setTimeout(() => {
      setIsClient(true)
    }, 2000);
  },[])

  const onDisconnect = useCallback(() => {  
    if(
      !path.includes("dashboard") &&
      !showDisconnect
      ){  
        setDisconnectStyle(styles.primaryButton)
        setShowDisconnect(true);
        setTimeout(() => {
          setShowDisconnect(false);
          setDisconnectStyle(styles.disconnectButton)
        }, 5000);
      } else {
        disconnect();
        if(vsaUpdate) vsaUpdate();
      }
  }, [showDisconnect, setShowDisconnect, vsaUpdate]);

  const onSwitchNetwork = () => {
    if(!showSwitchNetwork) {
      setShowSwitchNetwork(true);
      setTimeout(() => {
        setShowSwitchNetwork(false);
      }, 5000);
    } else {
      if(switchNetwork) switchNetwork(activeNetwork.id)
      else {
        if(error) alert(error.message)
        else alert('Something went wrong! Please use your wallet to switch to Sepolia testnet.')
      }
    }
  }

  if (isClient && eoa.isConnected) {
    return (
      chain?.id === activeNetwork.id 
        ? <div className={disconnectStlye} onClick={() => onDisconnect()}>{(path.includes("dashboard") || showDisconnect) ? "Disconnect" : compactAddress}</div>
        : <div className={styles.wrongNetwork} onClick={() => onSwitchNetwork()}> {showSwitchNetwork? "Switch Networks" : "Wrong Network"} </div>
    );
  }
  else if (isClient && openConnectModal) return (
    <div className={styles.primaryButton} onClick={() => openConnectModal()}>
    {connectText? connectText : 'Connect Wallet'}
    </div>
  )
  else return <div className={styles.primaryButton}> <LoadingDots /> </div>
}

const MenuIcon = () => {
  return (
    <svg width="36px" height="36px" viewBox="0 0 1.08 1.08" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.18 0.315a0.045 0.045 0 0 1 0.045 -0.045h0.63a0.045 0.045 0 1 1 0 0.09H0.225a0.045 0.045 0 0 1 -0.045 -0.045zm0 0.225a0.045 0.045 0 0 1 0.045 -0.045h0.63a0.045 0.045 0 1 1 0 0.09H0.225a0.045 0.045 0 0 1 -0.045 -0.045zm0 0.225a0.045 0.045 0 0 1 0.045 -0.045h0.63a0.045 0.045 0 1 1 0 0.09H0.225a0.045 0.045 0 0 1 -0.045 -0.045z" fill="#5E5E5E"/></svg>
  )
}

interface DropdownProps {
  items: string[];
  onItemSelect: (item: string) => void;
}


const DropdownMenu = ({ items, onItemSelect } : DropdownProps ) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Function to check if clicked outside of the dropdown menu
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    // Attach the listeners on component mount
    document.addEventListener('mousedown', handleClickOutside);

    // Detach the listeners on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}><MenuIcon /></div>

      {isOpen && (
        <ul className={styles.dropdownMenu}>
          {items.map((item, index) => (
            <li key={index} onClick={() => onItemSelect(item)}>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}



export default function NavBar ({ navbarGridTemplate, currentPage }: NavBarProps) {
  // const [scrolled, setScrolled] = useState(false);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     setScrolled(window.scrollY > 0);
  //   };

  //   // Attach the event listener
  //   window.addEventListener('scroll', handleScroll);

  //   // Cleanup - remove the event listener
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, []);

  // console.log('scrolled ', scrolled)
  const router = useRouter();
  const items = ['About the project', 'Contact Us'];
  
  const handleItemSelect = (item: string) => {
    console.log(`Selected: ${item}`);
    if(item === 'About the project')
      window.open('https://pbfranceschin.gitbook.io/venn', '_blank');
    if(item === 'Contact Us')
      router.push('/contact');
  };

  return (
    // <div className={classNames(styles.navbar, styles.navbarGridTemplate, scrolled ? styles.navbarScrolled : '')}>
    <div className={classNames(styles.navbar, styles.navbarGridTemplate)}>
      <div className={styles.logoContainer}>
        <Link href="/">
          <span style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}><Logo /> <Name /></span>
        </Link>
      </div>
      <div className={styles.functionalitiesContainer}>
        <div className={styles.searchBoxContainer}>
          <Tooltip style={styles.fontFamily} text='Search comming soon'><SearchBox /></Tooltip>
        </div>
        <div className={styles.menuButtonsContainer}>
          {/* <div className={currentPage === 'market'? styles.secondaryButtonSelected : styles.secondaryButton}>Market</div>
          <div className={currentPage === 'dashboard'? styles.secondaryButtonSelected : styles.secondaryButton}>Dashboard</div> */}
          <div 
            className={classNames(styles.secondaryButton, currentPage === 'market'? styles.active : '')}
          >
            <Link href="/">
              Market
            </Link>
          </div>
          <div 
            className={classNames(styles.secondaryButton, currentPage === 'dashboard'? styles.active : '')}
          >
            {/* The following is a temporary address for prototype */}
            <Link href="/dashboard"> 
              Dashboard
            </Link>
          </div>
          {/* <div className={styles.secondaryButton}>Market</div>
          <div className={styles.secondaryButton}>Dashboard</div> */}
          {/* TO-DO: colocar primary <div className={styles.primaryButton}>Connect Wallet</div> */}
          {/* {(eoaAccount.isConnected || vsaAddr)
            ? <SignInButton connectText='Sign Out' style={styles.disconnectButton} handler={signOutHandler} />
            : <SignInButton connectText={'Sign In'} style={styles.primaryButton} handler={() => router.push('/sign-in')} />}
          <div className={styles.iconButton}><MenuIcon /></div> */}
          <ConnectButton />
          <div className={styles.iconButton}><DropdownMenu items={items} onItemSelect={handleItemSelect} /></div>
        </div>
      </div>
    </div>
  );
}
