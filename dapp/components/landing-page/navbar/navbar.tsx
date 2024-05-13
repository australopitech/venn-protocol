'use client'
import classNames from "classnames";
import { Name, NewLogoPlain } from "../../common/logo/logo";
import styles from "./navbar.module.css";
import Link from "next/link";
import { source_code_pro } from "@/app/fonts";
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";

const MenuIcon = () => {
    return (
      <svg width="100%" height="100%" viewBox="0 0 1.08 1.08" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.18 0.315a0.045 0.045 0 0 1 0.045 -0.045h0.63a0.045 0.045 0 1 1 0 0.09H0.225a0.045 0.045 0 0 1 -0.045 -0.045zm0 0.225a0.045 0.045 0 0 1 0.045 -0.045h0.63a0.045 0.045 0 1 1 0 0.09H0.225a0.045 0.045 0 0 1 -0.045 -0.045zm0 0.225a0.045 0.045 0 0 1 0.045 -0.045h0.63a0.045 0.045 0 1 1 0 0.09H0.225a0.045 0.045 0 0 1 -0.045 -0.045z" fill="#000000"/></svg>
    )
}

const CloseIcon = () => {
    return (
        <svg  xmlns="http://www.w3.org/2000/svg"  width="100%"  height="100%"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
    )
}

const dropdownItems = ['ABOUT', 'GUIDES', 'CONTACT US'];

export default function NavBar () {
  const router = useRouter();

  const handleItemSelect = useCallback((item: string) => {
    if(item === 'ABOUT')
        window.open('https://australopitech.gitbook.io/venn', '_blank');
    if(item === 'GUIDES')
        window.open('https://australopitech.gitbook.io/venn/overview/guides', '_blank');
    if(item === 'CONTACT US')
        router.push('/contact');
    // if(item === 'LAUNCH MARKETPLACE')
    //     router.push('/');
    // if(item === 'LAUNCH DASHBOARD')
    //     router.push('/dashboard');        
  }, []) 

  return (
    <div className={styles.navbar}>
        <div className={styles.logo}>
            <NewLogoPlain />
        </div>
        <div className={styles.navItems}>
            <div className={styles.navItem}>
                <a href="https://australopitech.gitbook.io/venn/" target="_blank">ABOUT</a>
            </div>
            <div className={styles.navItem}>
                <a href="https://australopitech.gitbook.io/venn/overview/guides" target="_blank">GUIDES</a>
            </div>
            <div className={styles.navItem}>
                <Link href="/contact" target="_blank">CONTACT US</Link>
            </div>
            <Link href="/" target="_blank">
                <div className={classNames(styles.button, styles.button2, source_code_pro.className)}
                >
                  <span className={styles.buttonText}>LAUNCH MARKETPLACE</span>
                </div>
            </Link>
            <Link href="/dashboard">
                <div className={classNames(styles.button, styles.button1, source_code_pro.className)}
                >
                  <span className={styles.buttonText}>LAUNCH DASHBOARD</span>
                </div>
            </Link>
        </div>
        <div className={styles.menuIcon}>
                <DropdownMenu  items={dropdownItems} onItemSelect={handleItemSelect}/>
        </div>
    </div>
  )
}

interface DropdownProps {
    items: string[];
    onItemSelect: (item: string) => void;
}

const itemVariants: Variants = {
  open: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  },
  closed: { opacity: 0, y: -10, transition: { duration: 0.1 } }
};


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
        <div className={styles.dropdownMenu} ref={dropdownRef}>
          <div onClick={() => setIsOpen(!isOpen)}>
            <AnimatePresence mode="wait" initial={false}>
              {isOpen ? ('') : (
                <motion.div className={styles.icon}
                  key="menu"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <MenuIcon />
                </motion.div>
              )}
            </AnimatePresence>
        </div>
        <AnimatePresence>
        {isOpen && (
          <>
          <motion.ul
            className={styles.dropdown}
            initial="closed"
            animate="open"
            exit="closed"
            variants={{
              open: {
                scale: 1,
                transition: { staggerChildren: 0.05, delayChildren: 0.2 }
              },
              closed: { scale: 0 }
            }}
            style={{ originX: 1, originY: 0 }} // Top right corner
          >
            <div style={{ display: 'flex', justifyContent: 'space-between',  alignItems: 'center', padding: '8px' }}>
              <motion.div style={{ width: '82px'}}
              key='name'
              variants={itemVariants}
              >
                <Name/>
              </motion.div>
              <motion.div className={styles.icon}
                    key="close"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setIsOpen(false)}
                  >
                    <CloseIcon />
              </motion.div>
            </div>
            {items.map((item, index) => (
              <motion.li
                key={index}
                variants={itemVariants}
                onClick={() => onItemSelect(item)}
              >
                {item}
              </motion.li>
            ))}
            <motion.div className={styles.dropdownButton}
            key='mktplace'
            variants={itemVariants}
            >
              <Link href={'/'} target="_blank">LAUNCH MARKETPLACE</Link>
            </motion.div>
            <motion.div className={styles.dropdownButton}
            key='mktplace'
            variants={itemVariants}
            >
              <Link href={'/dashboard'} target="_blank">LAUNCH DASHBOARD</Link>
            </motion.div>
          </motion.ul>
          </>
        )}
        </AnimatePresence>
    </div>
    );
  }