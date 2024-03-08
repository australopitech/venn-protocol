import React from 'react';
import styles from './tooltip.module.css';
import classNames from 'classnames';

interface TooltipProps {
  style?: any;
  text: string;
  children : React.ReactNode;
}

export default function Tooltip ({ text, children, style } : TooltipProps ) {
   return (
    <div className={classNames(styles.tooltip, style)}>
        <span className={styles.tooltiptext}>{text}</span>
        {children}
    </div>
   ) 
}