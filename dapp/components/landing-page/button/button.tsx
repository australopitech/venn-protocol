import styles from "./button.module.css"
import classNames from "classnames";

interface ButtonProps {
    text: string;
    type?: 'primary' | 'secondary';
    icon?: boolean;
    handler?: any;
}

export default function Button ({text, type, icon, handler} : ButtonProps) {
    return (
        <div className={classNames(styles.button, type === 'secondary' ? styles.buttonSecondary : styles.buttonPrimary)} onClick={handler}>
            {text}
            {icon && 
                <div className={styles.icon}><UpRightArrow/></div>
            }
        </div>
    )
}

function UpRightArrow () {
    return (
        <svg width="100%" height="auto" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_17_1111)">
            <path d="M4.16667 45.8334L45.8333 4.16675M45.8333 4.16675H8.33334M45.8333 4.16675V41.6667" stroke="currentColor" stroke-width="8.33333" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            <defs>
            <clipPath id="clip0_17_1111">
            <rect width="50" height="50" fill="white"/>
            </clipPath>
            </defs>
        </svg>
    )
}
