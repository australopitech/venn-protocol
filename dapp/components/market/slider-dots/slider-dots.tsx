'use client'
import styles from "./slider-dots.module.css";
import { useEffect } from "react";
import {  useAnimate } from "framer-motion";


export const Dot = () => {
    return (
        <svg width="14px" height="14px" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="9.90553" cy="9.90553" r="8.90553" fill="black" stroke="black" strokeWidth="2"/>
        </svg>
    )
}

export function Dots ({ placement } : { placement: number }) {
  const [scope0, animate0] = useAnimate()
  const [scope1, animate1] = useAnimate()
  const [scope2, animate2] = useAnimate()
  // const [scope3, animate3] = useAnimate()

  useEffect(() => {
    if(placement === 0) {
      animate0(scope0.current, { opacity: 1, scale: 1.5 });
      animate1(scope1.current, { opacity: 0.2, scale: 1 });
      animate2(scope2.current, { opacity: 0.2, scale: 1 });
    }
    if(placement === 1){
      animate1(scope1.current, { opacity: 1, scale: 1.5 });
      animate0(scope0.current, { opacity: 0.2, scale: 1 });
      animate2(scope2.current, { opacity: 0.2, scale: 1 });
    }
    if(placement === 2){
      animate2(scope2.current, { opacity: 1, scale: 1.5 });
      animate0(scope0.current, { opacity: 0.2, scale: 1 });
      animate1(scope1.current, { opacity: 0.2, scale: 1 });
      
    }
    // if(placement === 3){
    //   animate3(scope3.current, { opacity: 1, scale: 1.5 });
    //   animate0(scope0.current, { opacity: 0.2, scale: 1 });
    //   animate2(scope2.current, { opacity: 0.2, scale: 1 });
    // }
  }, [placement])

  
  return (
    <div className={styles.dots}>
      <div ref={scope0} style={{ opacity: 0.2 }}><Dot/></div>
      <div ref={scope1} style={{ opacity: 0.2 }}><Dot/></div>
      <div ref={scope2} style={{ opacity: 0.2 }}><Dot/></div>
      {/* <div ref={scope3} style={{ opacity: 0.2 }}><Dot/></div> */}
    </div>
    )
}
