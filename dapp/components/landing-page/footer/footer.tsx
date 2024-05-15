import styles from './footer.module.css';
import { YoutubeDark, GithubDark, DiscordDark, TwitterDark } from '@/components/common/social/social-logos';
import { Name, NewLogoName } from '@/components/common/logo/logo';


export default function Footer () {

  return (
    <div className={styles.body}>
        <div className={styles.content}>
            <div className={styles.trademark}>
                <div className={styles.logo}><NewLogoName/></div>
                <div className={styles.description}><span className={styles.developedBy}>Developed by</span> <span className={styles.company}>Australopitech, LLC.</span></div>
            </div>
            <div className={styles.resources}>
                <div className={styles.socialsContainer}>
                    <div className={styles.socials}><YoutubeDark/></div>
                    <div className={styles.socials}><TwitterDark/></div>
                    <div className={styles.socials}><GithubDark/></div>
                    <div className={styles.socials}><DiscordDark/></div>
                </div>
                <div className={styles.linkContainer}>
                    <div className={styles.section}>
                        <div className={styles.sectionTitle}>About<div className={styles.underline}></div></div>
                        <div className={styles.link}>About Venn</div>
                        <div className={styles.link}>Guides</div>
                        <div className={styles.link}>Docs</div>
                    </div>
                    <div className={styles.section}>
                        <div className={styles.sectionTitle}>Team<div className={styles.underline}></div></div>
                        <div className={styles.link}>Website</div>
                        <div className={styles.link}>X</div>
                        <div className={styles.link}>LinkedIn</div>
                    </div>
                    <div className={styles.section}>
                        <div className={styles.sectionTitle}>Contact Us<div className={styles.underline}></div></div>
                        <div className={styles.link}>Email</div>
                        <div className={styles.link}>X</div>
                        <div className={styles.link}>Discord</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}