import { NewLogoName } from "@/components/common/logo/logo";
import styles from "./banner.module.css";
import classNames from "classnames";
import { passion_one } from "@/app/fonts";



export default function Banner () {

  return (
    <div className={styles.banner}>
        <div className={styles.logo}>
            <NewLogoName/>
        </div>
        <div className={styles.sloganContainer}>
          <div className={styles.slogan}>
              Unlock the real value of NFTs.
          </div>
          <div className={styles.button}>
            LAUNCH DEMO
          </div>
        </div>
    </div>
  )
}