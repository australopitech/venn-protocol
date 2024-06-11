'use client'
import React, { SetStateAction, useState } from "react";
import styles from "./time-unit.module.css";
import { TimeUnitType } from "@/types";
import classNames from "classnames";
import { source_code_pro } from "@/app/fonts";

interface TimeUnitSelectProps {
  // isOpen: boolean;
  // setIsOpen: React.Dispatch<SetStateAction<boolean>>;
  selected: TimeUnitType;
  setSelected: React.Dispatch<SetStateAction<TimeUnitType>>;
  plural?: boolean;
}

const UpIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-chevron-up" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 15l6 -6l6 6" />
    </svg>
  )
}

const DownIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-chevron-down" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 9l6 6l6 -6" />
    </svg>
  )
}

export const TimeUnitSelect = ({ selected, setSelected, plural} : TimeUnitSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const onBlur = () => {
    // console.log('blur');
    setTimeout(() => {
        setIsOpen(false);
    }, 250);
  }

  return (
    <div className={classNames(styles.timeUnitSelector, source_code_pro.className)} onBlur={onBlur}>
        <button className={styles.timeUnitCurrentContainer} onClick={() => setIsOpen(!isOpen)} tabIndex={2}>
            <span className={styles.timeUnitCurrent}>
                {selected === 'minute'
                 ? plural ? "Minutes" : "Minute" 
                 : selected === "hour"
                  ? plural ? "Hours" : "Hour"
                  : plural ? "Days" : "Day"}
            </span>
            {isOpen ? <UpIcon /> : <DownIcon />}
        </button>
        {/* <div className={styles.dropdownWrapper}> */}
        {isOpen &&
            <div className={styles.dropdown} onClick={(e) => e.stopPropagation()}>
                {selected !== "minute" &&
                    <div className={styles.optionsContainer} onClick={() => setSelected('minute')}>
                        <span className={styles.timeUnitOption}>{plural ? "Minutes" : "Minute"}</span>
                    </div>
                }
                {selected !== "hour" &&
                    <div className={styles.optionsContainer} onClick={() => setSelected('hour')}>
                        <span className={styles.timeUnitOption}>{plural ? "Hours" : "Hour"}</span>
                    </div>
                }
                {selected !== "day" &&
                    <div className={styles.optionsContainer} onClick={() => setSelected('day')}>
                        <span className={styles.timeUnitOption}>{plural? "Days" : "Day"}</span>
                    </div>
                }                                
            </div>
        }
        {/* </div> */}
    </div>
  )
}