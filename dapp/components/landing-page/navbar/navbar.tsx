import { NewLogoPlain } from "../../common/logo/logo";
import styles from "./navbar.module.css";
import Link from "next/link";
import { tilt_neon } from "@/app/fonts";
import classNames from "classnames";

const MenuIcon = () => {
    return (
      <svg width="36px" height="36px" viewBox="0 0 1.08 1.08" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.18 0.315a0.045 0.045 0 0 1 0.045 -0.045h0.63a0.045 0.045 0 1 1 0 0.09H0.225a0.045 0.045 0 0 1 -0.045 -0.045zm0 0.225a0.045 0.045 0 0 1 0.045 -0.045h0.63a0.045 0.045 0 1 1 0 0.09H0.225a0.045 0.045 0 0 1 -0.045 -0.045zm0 0.225a0.045 0.045 0 0 1 0.045 -0.045h0.63a0.045 0.045 0 1 1 0 0.09H0.225a0.045 0.045 0 0 1 -0.045 -0.045z" fill="#5E5E5E"/></svg>
    )
}


export default function NavBar () {

  return (
    <div className={classNames(styles.navbar, tilt_neon.className)}>
        {/* <div style={{ display: "flex", gap: "8px", alignItems:"center"}}> */}
            <NewLogoPlain />
        {/* </div> */}
        <div className={styles.navItems}>
            <div className={styles.navItem}>
                <a href="https://australopitech.gitbook.io/venn/" target="_blank">About</a>
            </div>
            <div className={styles.navItem}>
                <a href="https://australopitech.gitbook.io/venn/overview/guides" target="_blank">Guides</a>
            </div>
            <div className={styles.navItem}>
                <Link href="/contact">Contact Us</Link>
            </div>
            <button className={styles.button}>Launch Market Place</button>
            <button className={styles.button}>Launch Dashboard</button>
        </div>
        <div className={styles.menuIcon}>
                <MenuIcon/>
        </div>
    </div>
  )
}