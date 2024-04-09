import { NewLogoName } from "@/components/common/logo/logo";
import styles from "./banner.module.css";

export default function Banner () {

  return (
    <div className={styles.banner}>
        <div className={styles.logo}>
            <NewLogoName/>
        </div>
        <div className={styles.slogan}>
            Unlock the real value of NFTs.
        </div>
    </div>
  )
}