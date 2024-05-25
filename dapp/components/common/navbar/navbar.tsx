'use client'
import classNames from 'classnames';
import { Name, NewLogoPlain } from '../logo/logo';
import { SearchBox } from '../search-box/search-box';
import styles from './navbar.module.css';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

import { useRouter } from 'next/navigation';
import { Tooltip } from '../tooltip/tooltip';
import ConnectButton from './connect-button';
import { MenuIcon, MarketIcon, SearchIcon, DashboardIcon } from './icons';


export interface NavBarProps {
  signInPage?: boolean;
  navbarGridTemplate?: string;
  currentPage?: string;
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
    <div className={styles.navbarOutter}>
      <div className={styles.navbar}>
        <div className={styles.itemsGroupLeft}>
          <Link href="/" className={styles.logoLarge}>
              <div style={{ width: "42px"}}>
                <NewLogoPlain/>
              </div>
              <div style={{ width: "104px"}}>
                <Name/>
              </div>
          </Link>
          <Link href="/" className={styles.logoSmall}>
                <NewLogoPlain/>            
          </Link>
          <div className={styles.searchBoxContainer}>
            <Tooltip style={styles.fontFamily} text='Search comming soon'><SearchBox /></Tooltip>
          </div>
          <div className={styles.searchIcon} style={{ opacity: "0.3"}}>
            <Tooltip style={styles.fontFamily} text='Search comming soon'><SearchIcon /></Tooltip>
          </div>
        </div>
        <div className={styles.itemsGroupRight}>
          <div className={styles.pageIcon}>
            {currentPage === 'dashboard'
              ? <MarketIcon/>      
              : <DashboardIcon/>
            }
          </div>
          <div className={styles.navItems}>
            <div 
                className={classNames(styles.secondaryButton, currentPage === 'market'? styles.active : '')}
              >
                <Link href="/">
                  MARKET
                </Link>
            </div>
            <div 
              className={classNames(styles.secondaryButton, currentPage === 'dashboard'? styles.active : '')}
            >
              <Link href="/dashboard"> 
                DASHBOARD
              </Link>
            </div>
          </div>
          <ConnectButton />
          <div className={styles.iconButton}>
            <DropdownMenu items={items} onItemSelect={handleItemSelect} />
          </div>
        </div>
      </div>
    </div>
  );
}
