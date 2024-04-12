'use client'
import styles from "./use-cases.module.css";
import { RightArrow, LeftArrow, DotsFirst } from "./graphics";
import { orbitron } from "@/app/fonts";
import classNames from "classnames";


function Dots ({ placement } : { placement : 1 | 2 | 3 }) {
    if(placement === 1)
        return <DotsFirst/>
}


function Card ({ cardNum } : { cardNum : 1 | 2 | 3 }) {

  return (
    <div className={styles.gameCard}>
        <div className={classNames(styles.cardTitle, orbitron.className)}>Gaming</div>
        <div className={styles.cardDescription}>
            Perfect to use with in-game items. Rent out CHARACTERS, WEAPONS, LAND, VEHICLES, or ANY item manifested as an NFT. TRY IT OUT before you buy it. Or make your asset PROFIT for you!
        </div>
        <div className={styles.dotsContainer}>
            <Dots placement={cardNum}/>
        </div>
    </div>
  )
}


export default function UseCases () {

  return (
    <div className={styles.body}>
        <div className={styles.content}>
            <div className={styles.arrowContainer}>
                <div className={classNames(styles.arrow, styles.disabled)}><LeftArrow/></div>
            </div>
            <Card cardNum={1}/>
            <div className={styles.arrowContainer}>
                <div className={styles.arrow}><RightArrow/></div>
            </div>
        </div>
    </div>
  )
}
