import React from 'react';
import style from './tooltip.module.css';

export default function Tooltip ({ text, children } : { text: string, children : React.ReactNode }) {
   return (
    <div className={style.tooltip}>
        <span className={style.tooltiptext}>{text}</span>
        {children}
    </div>
   ) 
}