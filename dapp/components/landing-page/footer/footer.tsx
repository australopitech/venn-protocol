import styles from './footer.module.css';
import { YoutubeDark, GithubDark, DiscordDark, TwitterDark } from '@/components/common/social/social-logos';
import { Name, NewLogoName } from '@/components/common/logo/logo';


export default function Footer () {

  return (
    <div className={styles.body}>
        <div className={styles.trademark}>
            <div className={styles.logo}><NewLogoName/></div>
            <div className={styles.name}><Name/></div>
            <div className={styles.description}><span className={styles.developedBy}>Developed by</span> <span className={styles.company}>Australopitech, LLC.</span></div>
        </div>
        <div className={styles.resources}>
            <div className={styles.linkContainer}>
                <div className={styles.link}>About</div>
                <div className={styles.link}>Guides</div>
                <div className={styles.link}>Contact Us</div>
            </div>
            <div className={styles.socialsContainer}>
                <div className={styles.socials}><YoutubeDark/></div>
                <div className={styles.socials}><TwitterDark/></div>
                <div className={styles.socials}><GithubDark/></div>
                <div className={styles.socials}><DiscordDark/></div>
            </div>
        </div>
    </div>
  )
}