'use client'
import styles from "./use-cases.module.css";
import { RightArrow, LeftArrow, Dot } from "./graphics";
import { audiowide } from "@/app/fonts";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useAnimate } from "framer-motion";


function Dots ({ placement } : { placement: number }) {
    // if(placement === 1)
    //   return <DotsFirst/>
    // else if(placement === 2)
    //   return <DotsSecond/>
    // else if(placement === 3)
    //   return <DotsThird/>
    // else if(placement === 4)
    //   return <DotsFourth/>
  const [scope0, animate0] = useAnimate()
  const [scope1, animate1] = useAnimate()
  const [scope2, animate2] = useAnimate()
  const [scope3, animate3] = useAnimate()

  useEffect(() => {
    if(placement === 0) {
      animate0(scope0.current, { opacity: 1, scale: 1.5 });
      animate1(scope1.current, { opacity: 0.2, scale: 1 });
      animate3(scope3.current, { opacity: 0.2, scale: 1 });
    }
    if(placement === 1){
      animate1(scope1.current, { opacity: 1, scale: 1.5 });
      animate0(scope0.current, { opacity: 0.2, scale: 1 });
      animate2(scope2.current, { opacity: 0.2, scale: 1 });
    }
    if(placement === 2){
      animate2(scope2.current, { opacity: 1, scale: 1.5 });
      animate3(scope3.current, { opacity: 0.2, scale: 1 });
      animate1(scope1.current, { opacity: 0.2, scale: 1 });
      
    }
    if(placement === 3){
      animate3(scope3.current, { opacity: 1, scale: 1.5 });
      animate0(scope0.current, { opacity: 0.2, scale: 1 });
      animate2(scope2.current, { opacity: 0.2, scale: 1 });
    }
  }, [placement])

  
  return (
    <div className={styles.dots}>
      <div ref={scope0} style={{ opacity: 0.2 }}><Dot/></div>
      <div ref={scope1} style={{ opacity: 0.2 }}><Dot/></div>
      <div ref={scope2} style={{ opacity: 0.2 }}><Dot/></div>
      <div ref={scope3} style={{ opacity: 0.2 }}><Dot/></div>
    </div>
    )
}


function AccessCard () {
  return (
    <div className={styles.accessCard}>
        <div className={styles.text}>
          <div className={classNames(styles.cardTitle, audiowide.className)}>
            Access
          </div>
          <div className={styles.cardDescription}>
          <b>TICKETS, CREDENTIALS, CLUB MEMBERSHIPS</b> can now also change hands without worry. Take a <b>SNEAK PEAK</b> at that exclusive club or <b> GET PAID</b> for not attending your favorite event!
          </div>
        </div>
    </div>
  )
}

function DomainCard () {
  return (
    <div className={styles.domainCard}>
        <div className={styles.text}>
          <div className={classNames(styles.cardTitle, audiowide.className)}>
            Domains
          </div>
          <div className={styles.cardDescription}>
          A <b>NEW LAYER</b> in the market for domain names. These assets will suddenly become <b>ATTRACTIVE</b> to <b>INVESTORS</b>. Pick a valuable name and <b>GET PAID</b>!
          </div>
        </div>
    </div>
  )
}

function MetaverseCard () {
  return (
    <div className={styles.metaverseCard}>
        <div className={styles.text}>
          <div className={classNames(styles.cardTitle, audiowide.className)}>
            Metaverse
          </div>
          <div className={styles.cardDescription}>
          <b>ANY</b> asset within the Metaverse will immediately become <b>CAPITAL</b>. From <b>REAL-ESTATE</b>, to <b>CREDENTIALS</b>, to <b>SKINS</b> and even expensive clothing. Prepare for a booming economy!
          </div>
        </div>
    </div>
  )
}


function GamerCard () {

  return (
    <div className={styles.gameCard}>
        <div className={styles.text}>
          <div className={classNames(styles.cardTitle, audiowide.className)}>
            Gaming
          </div>
          <div className={styles.cardDescription}>
              Perfect to use with in-game items. Rent out <b>CHARACTERS, WEAPONS, LAND, VEHICLES,</b> or <b>ANY</b> item manifested as an NFT. <b>TRY IT OUT</b> before you buy it. Or make your asset <b>PROFIT</b> for you!
          </div>
        </div>
    </div>
  )
}


const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0, 
      transition: { delay: 3  }
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    };
  }
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

function ContentSelector ({ cardNum } : { cardNum: number }) {
  return (
    <>
    {cardNum === 0
      ? <GamerCard />
      : cardNum === 1
        ? <MetaverseCard />
        : cardNum === 2
        ? <DomainCard />
        : cardNum === 3
          ? <AccessCard />
          : "Error"
      }
    </>
  )
}

function Card ({ cardNum, direction, paginate } : { cardNum: number, direction: number, paginate: any}) {
  
  return(
    
    <AnimatePresence initial={true} custom={direction} mode="wait">
        <motion.div className={styles.card}
        key={cardNum}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          x: { type: "spring", stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 }
        }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={1}
        onDragEnd={(e, { offset, velocity }) => {
          const swipe = swipePower(offset.x, velocity.x);

          if (swipe < -swipeConfidenceThreshold) {
            paginate(1);
          } else if (swipe > swipeConfidenceThreshold) {
            paginate(-1);
          }
        }}
        >
          <ContentSelector cardNum={cardNum} />
          {/* <div style={{ color: '#000000', fontSize: "54px"}}>{cardNum}</div> */}
        </motion.div>
    </AnimatePresence>
  )

}

const lastPage = 3;

export default function UseCases () {
  // direction must be -1 or 1
  const [[position, direction], setPaginate] = useState([0,0]);
  console.log('position', position);

  const paginate = (newDirection: number) => {
    if(newDirection > 0)
      if(position === lastPage){
        setPaginate([0, newDirection]);
        return
      }
    if(newDirection < 0)
      if(position === 0) {
        setPaginate([lastPage, newDirection]);
        return
      }
    setPaginate([position + newDirection, newDirection]);
  }

  return (
    <div className={styles.body}>
      <div className={styles.title}>Use Cases</div>
      <div className={styles.content}>
        <div className={styles.arrowsContainerCenter}>
          <div 
            className={styles.arrow}
            onClick={() => paginate(-1)}
            >
              <LeftArrow/>
            </div>
            <div
            className={styles.arrow}
            onClick={() => paginate(1)}
            >
              <RightArrow/>
            </div>
        </div>
        <div className={styles.arrowContainerLeft}>
          <div 
          className={styles.arrow}
          onClick={() => paginate(-1)}
          >
            <LeftArrow/>
          </div>
        </div>
        <Card cardNum={position} direction={direction} paginate={paginate}/>
        <div className={styles.arrowContainerRight}>
          <div
            className={styles.arrow}
            onClick={() => paginate(1)}
            >
              <RightArrow/>
            </div>
        </div>
      </div>
      <div className={styles.dotsContainer}>
        <Dots placement={position}/>
      </div>
      <div className={styles.subtitle}>
        ...among many others!
      </div>
    </div>
  )
}
