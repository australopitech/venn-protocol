'use client'
import { useConnectModal } from '@rainbow-me/rainbowkit';
import styles from './log-in.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function LogIn () {
    const { openConnectModal } =useConnectModal();

    return (
        <div className={styles.logInContainer}>
            <div className={styles.logInContent}>
              Welcome to Venn.
              <h1>The <span className={styles.highlight}>Easiest</span> <span className={styles.highlight}>Way</span> to <span className={styles.highlight}>Rent</span> NFTs!</h1>
              <div 
              className={styles.button}
              onClick={openConnectModal}
              >
                log in
              </div>
            </div>
            <ImageSlide/>
        </div>
    ) 
}

const imageVariant = {
  enter: {
    x: 1000,
    // opacity: 0,
    // transition: { delay: 3 }
  },
  visible: {
    x: 0,
    opacity: 1
  },
  exit: {
    x: 1000,
    // opacity: 0
  }
}

function ImageSlide () {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    console.log('image');
    setTimeout(
      () =>
        setIndex((prevIndex) =>
          prevIndex === 3 ? 0 : prevIndex + 1
        ),
      5000
    );

    return () => {};
  }, [index]);

  return (
    <AnimatePresence mode='wait' initial={true}>
      <motion.div className={styles.backgroundImg}
      key={index}
      variants={imageVariant}
      initial="enter"
      animate="visible"
      exit="exit"
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 }
      }}
      >
        <ImageSelector i={index}/>
      </motion.div>
    </AnimatePresence>
  )
}

function ImageSelector ({ i } : { i : number }) {

  // if( i === 0 )
  //   return
  //     <img 
  //     src='/cards/new-ui-gaming-graphics-mobile.svg' alt='gaming-svg'
  //     width='100%'
  //     height='100%'
  //     />
  if(i === 1)
    return (
      <img 
      src='/cards/new-ui-metaverse-graphics-mobile.svg' alt='gaming-svg'
      width='100%'
      height='100%'
      />)
  if( i === 2 )
    return (
      <img 
      src='/cards/new-ui-domain-names-graphic-mobile.svg' alt='gaming-svg'
      width='100%'
      height='100%'
      />)
  if(i === 3)
    return (
      <img 
      src='/cards/new-ui-access-graphic-mobile.svg' alt='gaming-svg'
      width='100%'
      height='100%'
      />)
  return(
    <img 
    src='/cards/new-ui-gaming-graphics-mobile.svg' alt='gaming-svg'
    width='100%'
    height='100%'
    />)
}