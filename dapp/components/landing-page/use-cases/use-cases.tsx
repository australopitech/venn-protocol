'use client'
import styles from "./use-cases.module.css";
import { RightArrow, LeftArrow, DotsFirst, DotsSecond, DotsThird, DotsFourth } from "./graphics";
import { orbitron } from "@/app/fonts";
import classNames from "classnames";
import { useState } from "react";


function Dots ({ placement } : { placement : 1 | 2 | 3 | 4}) {
    if(placement === 1)
      return <DotsFirst/>
    else if(placement === 2)
      return <DotsSecond/>
    else if(placement === 3)
      return <DotsThird/>
    else if(placement === 4)
      return <DotsFourth/>
}


function Card ({ cardNum } : { cardNum : 1 | 2 | 3 | 4}) {

  return (
    <div className={styles.gameCard}>
        <div className={styles.text}>
          <div className={classNames(styles.cardTitle, orbitron.className)}>
            <div className={styles.arrowNarrowContainer}>
                <div className={styles.arrowNarrow}><LeftArrow/></div>
            </div>
            Gaming
            <div className={styles.arrowNarrowContainer}>
              <div className={styles.arrowNarrow}><RightArrow/></div>
            </div>
          </div>
          <div className={styles.cardDescription}>
              Perfect to use with in-game items. Rent out <b>CHARACTERS, WEAPONS, LAND, VEHICLES,</b> or <b>ANY</b> item manifested as an NFT. <b>TRY IT OUT</b> before you buy it. Or make your asset <b>PROFIT</b> for you!
          </div>
        </div>
        <div className={styles.dotsContainer}>
            <Dots placement={cardNum}/>
        </div>
    </div>
  )
}


export default function UseCases () {
  const [position, setPosition] = useState<1 | 2 | 3 | 4>(1);

  return (
    <div className={styles.body}>
        <div className={styles.content}>
            <div className={styles.arrowContainer}>
                <div className={classNames(styles.arrow, styles.disabled)}><LeftArrow/></div>
            </div>
            <Card cardNum={position}/>
            <div className={styles.arrowContainer}>
                <div className={styles.arrow}><RightArrow/></div>
            </div>
        </div>
    </div>
  )
}
