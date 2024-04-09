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
        <div className={classNames(styles.slogan, passion_one.className)}>
            Unlock the real value of NFTs.
        </div>
    </div>
  )
}