import styles from './latest.module.css';
import { FakeSlider } from '../coming-soon/coming-soon';

export default function Latest () {

  return (
    <div className={styles.body}>
        <FakeSlider/>
        <div className={styles.linkContainer}>
            <span className={styles.link}>View all</span>
            <div className={styles.arrow}><RigthArrow/></div>
        </div>
    </div>
  )
}

const RigthArrow = () => {
    return (
        <svg width="100%" height="100%" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_52_4573)">
            <path d="M6.33325 14H22.6666" stroke="currentColor" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15.6666 21L22.6666 14" stroke="currentColor" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15.6666 7L22.6666 14" stroke="currentColor" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
            <defs>
            <clipPath id="clip0_52_4573">
            <rect width="28" height="28" fill="white" transform="translate(0.5)"/>
            </clipPath>
            </defs>
        </svg>
    )
}