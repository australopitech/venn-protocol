import classNames from 'classnames';
import { Logo } from '../logo/logo';
import { SearchBox } from '../search-box/search-box';
import styles from './navbar.module.css';
import { useState, useRef, useEffect } from 'react';
import { useEthers, useEtherBalance, useConfig, useSigner } from '@usedapp/core';

export interface NavBarProps {
  navbarGridTemplate?: string;
  currentPage?: string;
}

interface ConnectButtonProps {
  connectText?: string;
}

//to-do: pegar a info de qual pagina está, para saber qual botão está ativo

export const ConnectButton = ({connectText} : ConnectButtonProps) => {
  const { account, deactivate, activateBrowserWallet } = useEthers()
  // 'account' being undefined means that we are not connected.
  if (account) return <div className={styles.primaryButton} onClick={() => deactivate()}>Disconnect</div>
  else return (
    <div className={styles.primaryButton} onClick={() => activateBrowserWallet()}>
    {connectText? connectText : 'Connect Wallet'}
    </div>
  )
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

  const items = ['About the project', 'Contact Us'];

  const handleItemSelect = (item: string) => {
    console.log(`Selected: ${item}`);
  };

  return (
    // <div className={classNames(styles.navbar, styles.navbarGridTemplate, scrolled ? styles.navbarScrolled : '')}>
    <div className={classNames(styles.navbar, styles.navbarGridTemplate)}>
      <div className={styles.logoContainer}>
        <Logo />
      </div>
      <div className={styles.functionalitiesContainer}>
        <div className={styles.searchBoxContainer}>
          <SearchBox />
        </div>
        <div className={styles.menuButtonsContainer}>
          {/* <div className={currentPage === 'market'? styles.secondaryButtonSelected : styles.secondaryButton}>Market</div>
          <div className={currentPage === 'dashboard'? styles.secondaryButtonSelected : styles.secondaryButton}>Dashboard</div> */}
          <div className={classNames(styles.secondaryButton, currentPage === 'market'? styles.active : '')}>Market</div>
          <div className={classNames(styles.secondaryButton, currentPage === 'dashboard'? styles.active : '')}>Dashboard</div>
          {/* <div className={styles.secondaryButton}>Market</div>
          <div className={styles.secondaryButton}>Dashboard</div> */}
          {/* TO-DO: colocar primary <div className={styles.primaryButton}>Connect Wallet</div> */}
          <ConnectButton />         
          {/* <div className={styles.iconButton}><MenuIcon /></div> */}
          <div className={styles.iconButton}><DropdownMenu items={items} onItemSelect={handleItemSelect} /></div>
        </div>
      </div>
    </div>
  );
}
