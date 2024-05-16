import styles from './footer.module.css';
import { YoutubeDark, GithubDark, DiscordDark, TwitterDark } from '@/components/common/social/social-logos';
import { Name, NewLogoName } from '@/components/common/logo/logo';
import Link from 'next/link';


export default function Footer () {

  return (
    <div className={styles.body}>
        <div className={styles.content}>
            <div className={styles.trademark}>
                <div className={styles.logo}><NewLogoName/></div>
                <div className={styles.description}><span className={styles.developedBy}>Developed by</span><br/><span className={styles.company}>Australopitech, LLC.</span></div>
            </div>
            <div className={styles.resources}>
                <div className={styles.socialsContainer}>
                    <div className={styles.socials}>
                        <a href='https://www.youtube.com/@Venn-Protocol' target='_blank'>
                            <YoutubeDark/>
                        </a>
                    </div>
                    <div className={styles.socials}>
                        <a href='https://twitter.com/vennprotocol' target='_blank'>
                            <TwitterDark/>
                        </a>
                    </div>
                    <div className={styles.socials}>
                        <a href='https://github.com/australopitech/venn-protocol' target='_blank'>
                            <GithubDark/>
                        </a>
                    </div>
                    <div className={styles.socials}><DiscordDark/></div>
                </div>
                <div className={styles.linkContainer}>
                    <div className={styles.section}>
                        <div className={styles.sectionTitle}>About<div className={styles.underline}></div></div>
                        <div className={styles.link}><a href='https://australopitech.gitbook.io/venn' target='_blank'>About Venn</a></div>
                        <div className={styles.link}><a href='https://australopitech.gitbook.io/venn/overview/guides' target='_blank'></a>Guides</div>
                        <div className={styles.link}><a href='https://australopitech.gitbook.io/venn/technical-info/protocol-overview' target='_blank'>Docs</a></div>
                    </div>
                    <div className={styles.section}>
                        <div className={styles.sectionTitle}>Team<div className={styles.underline}></div></div>
                        <div className={styles.link}><a href='https://australopitech.xyz/' target='_blank'>Website</a></div>
                        <div className={styles.link}><a href='https://twitter.com/australabs' target='_blank'>X</a></div>
                        <div className={styles.link}>LinkedIn</div>
                    </div>
                    <div className={styles.section}>
                        <div className={styles.sectionTitle}>Contact Us<div className={styles.underline}></div></div>
                        <div className={styles.link}><Link href={'/contact'}>Email</Link></div>
                        <div className={styles.link}><a href='https://twitter.com/vennprotocol' target='_blank'>X</a></div>
                        <div className={styles.link}>Discord</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}