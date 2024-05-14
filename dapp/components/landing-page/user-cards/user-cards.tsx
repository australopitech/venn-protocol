'use client'
import styles from "./user-cards.module.css";
import { ShareOwnership, TryIt } from "./graphics";
import classNames from "classnames";
import { motion } from "framer-motion"
import Button from "../button/button";

function ShareOwnershipCard () {
  
  return (
    <motion.div
    whileHover={{
      translateX:5,
      translateY:5,
    }}
    className={classNames(styles.card, styles.card1)}
    >
        <motion.div 
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ margin: "-100px 0px 0px 0px", once: true }}
        transition={{ duration: 1, delay: 1 }}
        className={styles.graphic}
        >
            <ShareOwnership/>
        </motion.div>
        <motion.div 
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ margin: "-100px 0px 0px 0px" , once: true }}
        transition={{ duration: 1, delay: 1 }}
        className={classNames(styles.content, styles.content1)}>
            <div className={classNames(styles.textContainer, styles.text1st)}>
              <h1 className={styles.title}>Share ownership.<br/>Get paid.</h1>
              <p className={styles.description}>
                  List your own NFTs and get paid for not holding them.
                  Name your price, your time frame, and earn.
              </p>
            </div>
            <Button text="TRY IT" icon={true}/ >
        </motion.div>
    </motion.div>
  )
}

function TryItCard () {

  return (
    <motion.div 
    whileHover={{
      translateX:-5,
      translateY:-5,
    }}
    className={classNames(styles.card, styles.card2)}
    >
        <motion.div 
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x:0 }}
        viewport={{ margin: "-100px 0px 0px 0px" , once: true }}
        transition={{ duration: 1, delay: 1 }}
        className={styles.graphic}
        >
            <TryIt/>
        </motion.div>
        <motion.div 
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ margin: "-100px 0px 0px 0px", once: true  }}
        transition={{ duration: 1, delay: 1 }}
        className={classNames(styles.content, styles.content2)}>
            <div className={classNames(styles.textContainer, styles.text2nd)}>
              <h1 className={styles.title}>Try it,<br/>before you buy it.</h1>
              <p className={styles.description}>
                Rent that NFT you&apos;ve been flirting with for a fraction of its value. Own it just for a while. No collateral. No commitment.
              </p>
            </div>
            <Button text="TRY IT" icon={true} />
        </motion.div>
    </motion.div>
  )
}


export default function UserCards () {

  return (
    <div className={styles.userCards}>
        <ShareOwnershipCard/>
        <TryItCard/>
    </div>
  )
}