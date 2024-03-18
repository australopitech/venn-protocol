import React from 'react';
import styles from './tooltip.module.css';
import classNames from 'classnames';

interface TooltipProps {
  style?: any;
  position?: 'bottom' | 'top'; // defaults to bottom
  text: string;
  children : React.ReactNode;
}

export default function Tooltip ({ text, children, style, position } : TooltipProps ) {
   return (
    <div className={classNames(position === 'top' ? styles.topTooltip : styles.tooltip, style)}>
        <span className={position === 'top' ? styles.topTooltiptext : styles.tooltiptext}>{text}</span>
        {children}
    </div>
   ) 
}