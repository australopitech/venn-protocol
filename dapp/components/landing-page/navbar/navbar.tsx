import classNames from "classnames";
import { NewLogoPlain } from "../../common/logo/logo";
import styles from "./navbar.module.css";
import Link from "next/link";
import { source_code_pro } from "@/app/fonts";

const MenuIcon = () => {
    return (
      <svg width="36px" height="36px" viewBox="0 0 1.08 1.08" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.18 0.315a0.045 0.045 0 0 1 0.045 -0.045h0.63a0.045 0.045 0 1 1 0 0.09H0.225a0.045 0.045 0 0 1 -0.045 -0.045zm0 0.225a0.045 0.045 0 0 1 0.045 -0.045h0.63a0.045 0.045 0 1 1 0 0.09H0.225a0.045 0.045 0 0 1 -0.045 -0.045zm0 0.225a0.045 0.045 0 0 1 0.045 -0.045h0.63a0.045 0.045 0 1 1 0 0.09H0.225a0.045 0.045 0 0 1 -0.045 -0.045z" fill="#5E5E5E"/></svg>
    )
}


export default function NavBar () {

  return (
    <div className={styles.navbar}>
        <div className={styles.logo}>
            <NewLogoPlain />
        </div>
        <div className={styles.navItems}>
            <div className={styles.navItem}>
                <a href="https://australopitech.gitbook.io/venn/" target="_blank">ABOUT</a>
            </div>
            <div className={styles.navItem}>
                <a href="https://australopitech.gitbook.io/venn/overview/guides" target="_blank">GUIDES</a>
            </div>
            <div className={styles.navItem}>
                <Link href="/contact" target="_blank">CONTACT US</Link>
            </div>
            <Link href="/" target="_blank">
                <div className={classNames(styles.button2, source_code_pro.className)}>LAUNCH MARKETPLACE</div>
            </Link>
            <Link href="/dashboard">
                <div className={classNames(styles.button1, source_code_pro.className)}>LAUNCH DASHBOARD</div>
            </Link>
        </div>
        <div className={styles.menuIcon}>
                <MenuIcon/>
        </div>
    </div>
  )
}