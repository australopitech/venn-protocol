'use client'
import styles from './slide.module.css';
import { CardLearnMore, CardRealEstate, CardStarWars } from "./cards"
import { useState } from "react";
import { motion, AnimatePresence, useAnimate } from "framer-motion";
import { CirleArrowBiColorLeft, CirleArrowBiColorRight } from './graphics';
import { Dots } from '../slider-dots/slider-dots';

const lastPage = 2;

export default function HighlightSlide () {
    const [[position, direction], setPaginate] = useState([0,0]);
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
        <div style={{ width: '100%', height: '100%' }}>
            <div className={styles.content}>
                <div className={styles.arrowContainerLeft}
                onClick={() => paginate(-1)}
                >
                  <CirleArrowBiColorLeft/>
                </div>
                <Card cardNum={position} direction={direction} paginate={paginate}/>
                <div className={styles.arrowContainerRight}
                onClick={() => paginate(1)}
                >
                  <CirleArrowBiColorRight/>  
                </div>            
              </div> 
              <div style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'center',
                marginTop: '16px'
                }}
              >
                <Dots placement={position}/>
              </div>
        </div>
    )
}

function Card ({ cardNum, direction, paginate } : { cardNum: number, direction: number, paginate: any}) {
  
    return(
      
      <AnimatePresence initial={true} custom={direction} mode="wait">
          <motion.div
          style={{ width: '100%', height: '100%'}}
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
        ? <CardRealEstate />
        : cardNum === 1
          ? <CardLearnMore />
          : cardNum === 2
            ? <CardStarWars/>
            : "Error"
      }
      </>
    )
}
  