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


function AccessCard ({ setPosition } : { setPosition: any }) {
  return (
    <div className={classNames(styles.card, styles.accessCard)}>
        <div className={styles.text}>
          <div className={classNames(styles.cardTitle, orbitron.className)}>
            <div className={styles.arrowNarrowContainer}>
                <div className={classNames(styles.arrowNarrow)} onClick={() => setPosition(3)}><LeftArrow/></div>
            </div>
            Access Tokens
            <div className={styles.arrowNarrowContainer}>
              <div className={classNames(styles.arrowNarrow, styles.disabled)}><RightArrow/></div>
            </div>
          </div>
          <div className={styles.cardDescription}>
          <b>TICKETS, CREDENTIALS, CLUB MEMBERSHIPS</b> can now also change hands without worry. Take a <b>SNEAK PEAK</b> at that exclusive club or <b> GET PAID</b> for not attending your favorite event!
          </div>
        </div>
        <div className={styles.dotsContainer}>
            <Dots placement={4}/>
        </div>
    </div>
  )
}

function DomainCard ({ setPosition } : { setPosition: any }) {
  return (
    <div className={classNames(styles.card, styles.domainCard)}>
        <div className={styles.text}>
          <div className={classNames(styles.cardTitle, orbitron.className)}>
            <div className={styles.arrowNarrowContainer}>
                <div className={classNames(styles.arrowNarrow)} onClick={() => setPosition(2)}><LeftArrow/></div>
            </div>
            Domains
            <div className={styles.arrowNarrowContainer}>
              <div className={styles.arrowNarrow} onClick={() => setPosition(4)}><RightArrow/></div>
            </div>
          </div>
          <div className={styles.cardDescription}>
          A <b>NEW LAYER</b> in the market for domain names. These assets will suddenly become <b>ATTRACTIVE</b> to <b>INVESTORS</b>. Pick a valuable name and <b>GET PAID</b>!
          </div>
        </div>
        <div className={styles.dotsContainer}>
            <Dots placement={3}/>
        </div>
    </div>
  )
}

function MetaverseCard ({ setPosition } : { setPosition: any }) {
  return (
    <div className={classNames(styles.card, styles.metaverseCard)}>
        <div className={styles.text}>
          <div className={classNames(styles.cardTitle, orbitron.className)}>
            <div className={styles.arrowNarrowContainer}>
                <div className={classNames(styles.arrowNarrow)} onClick={() => setPosition(1)}><LeftArrow/></div>
            </div>
            Metaverse
            <div className={styles.arrowNarrowContainer}>
              <div className={styles.arrowNarrow} onClick={() => setPosition(3)}><RightArrow/></div>
            </div>
          </div>
          <div className={styles.cardDescription}>
          <b>ANY</b> asset within the Metaverse will immediately become <b>CAPITAL</b>. From <b>REAL-ESTATE</b>, to <b>CREDENTIALS</b>, to <b>SKINS</b> and even expensive clothing. Prepare for a booming economy!
          </div>
        </div>
        <div className={styles.dotsContainer}>
            <Dots placement={2}/>
        </div>
    </div>
  )
}


function GamerCard ({ setPosition } : { setPosition: any }) {

  return (
    <div className={classNames(styles.card, styles.gameCard)}>
        <div className={styles.text}>
          <div className={classNames(styles.cardTitle, orbitron.className)}>
            <div className={styles.arrowNarrowContainer}>
                <div className={classNames(styles.arrowNarrow, styles.disabled)}><LeftArrow/></div>
            </div>
            Gaming
            <div className={styles.arrowNarrowContainer}>
              <div className={styles.arrowNarrow} onClick={() => setPosition(2)}><RightArrow/></div>
            </div>
          </div>
          <div className={styles.cardDescription}>
              Perfect to use with in-game items. Rent out <b>CHARACTERS, WEAPONS, LAND, VEHICLES,</b> or <b>ANY</b> item manifested as an NFT. <b>TRY IT OUT</b> before you buy it. Or make your asset <b>PROFIT</b> for you!
          </div>
        </div>
        <div className={styles.dotsContainer}>
            <Dots placement={1}/>
        </div>
    </div>
  )
}

function Card ({ cardNum, setPosition } : { cardNum: number, setPosition: any}) {
  return(
    <>
    {cardNum === 1
     ? <GamerCard setPosition={setPosition}/>
     : cardNum === 2
      ? <MetaverseCard setPosition={setPosition}/>
      : cardNum === 3
       ? <DomainCard setPosition={setPosition}/>
       : cardNum === 4
        ? <AccessCard setPosition={setPosition}/>
        : "Error"
    }
    </>
  )
}


export default function UseCases () {
  const [position, setPosition] = useState<number>(1);
  console.log('position', position);

  return (
    <div className={styles.body}>
        <div className={styles.content}>
            <div className={styles.arrowContainer}>
                <div 
                className={classNames(styles.arrow, position === 1 ? styles.disabled : '')}
                onClick={position === 1 ? () => {} : () => setPosition(position - 1)}
                ><LeftArrow/></div>
            </div>
            <Card cardNum={position} setPosition={setPosition}/>
            <div className={styles.arrowContainer}>
                <div
                className={classNames(styles.arrow, position === 4 ? styles.disabled : '')}
                onClick={position === 4 ? () => {} : () => setPosition(position + 1)}
                ><RightArrow/></div>
            </div>
        </div>
    </div>
  )
}
