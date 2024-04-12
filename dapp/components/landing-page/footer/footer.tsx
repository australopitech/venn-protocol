import styles from './footer.module.css';
import { YoutubeDark, GithubDark, DiscordDark, TwitterDark } from '@/components/common/social/social-logos';
import { NewLogoName } from '@/components/common/logo/logo';


export default function Footer () {

  return (
    <div className={styles.body}>
        <div className={styles.trademark}>
            <div className={styles.logo}><NewLogoName/></div>
            <div className={styles.description}><span style={{ letterSpacing: "3px"}}>Developed by</span> <span style={{ fontSize: "14px"}}>Australopitech, LLC.</span></div>
        </div>
        <div className={styles.resources}>
            <div className={styles.linkContainer}>
                <div className={styles.link}>About</div>
                <div className={styles.link}>Guides</div>
                <div className={styles.link}>Contact Us</div>
            </div>
            <div className={styles.grid}>
                <YoutubeDark/>
                <TwitterDark/>
                <GithubDark/>
                <DiscordDark/>
            </div>
        </div>
    </div>
  )
}