import styles from './footer.module.css';
import Link from 'next/link';
import { YoutubeDark, TwitterDark, GithubDark, DiscordDark } from '@/components/common/social/social-logos';

export default function Footer () {
    return (
        <div className={styles.body}>
            <div className={styles.contact}>
                <span className={styles.title}>talk to us!</span>
                <div className={styles.contactInner}>
                    <span style={{ color: '#585858'}}>If this project interests you, you are more than welcome to reach out!</span>
                    <div className={styles.button}>
                        Send a Message
                        <div className={styles.icon}><SendIcon/></div>
                    </div>
                </div>
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
                            <div className={styles.sectionTitle}>Learn<div className={styles.underline}></div></div>
                            <div className={styles.link}><a href='https://australopitech.gitbook.io/venn' target='_blank'>About Venn</a></div>
                            <div className={styles.link}><a href='https://australopitech.gitbook.io/venn/overview/guides' target='_blank'></a>Guides</div>
                            <div className={styles.link}>Blog</div>
                        </div>
                        <div className={styles.section}>
                            <div className={styles.sectionTitle}>Marketplace<div className={styles.underline}></div></div>
                            <div className={styles.link}>Latest</div>
                            <div className={styles.link}>by Collection</div>
                            <div className={styles.link}>by Chain</div>
                            <div className={styles.link}>by Type</div>
                        </div>
                        <div className={styles.section}>
                            <div className={styles.sectionTitle}>Join Us<div className={styles.underline}></div></div>
                            <div className={styles.link}><Link href={'/contact'}>Youtube</Link></div>
                            <div className={styles.link}><a href='https://twitter.com/vennprotocol' target='_blank'>X</a></div>
                            <div className={styles.link}>Discord</div>
                        </div>
                    </div>
                </div>
        </div>
    )
}

export const SendIcon = () => {
    return (
        <svg width="100%" height="100%" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_28_950)">
            <path d="M10.5 14L21.5 3" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21.5 3L15 21C14.9561 21.0957 14.8857 21.1769 14.7971 21.2338C14.7084 21.2906 14.6053 21.3209 14.5 21.3209C14.3947 21.3209 14.2916 21.2906 14.203 21.2338C14.1143 21.1769 14.0439 21.0957 14 21L10.5 14L3.50001 10.5C3.40427 10.4561 3.32314 10.3857 3.26626 10.2971C3.20938 10.2084 3.17914 10.1053 3.17914 10C3.17914 9.89468 3.20938 9.79158 3.26626 9.70295C3.32314 9.61431 3.40427 9.54387 3.50001 9.5L21.5 3Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            <defs>
            <clipPath id="clip0_28_950">
            <rect width="24" height="24" fill="white" transform="translate(0.5)"/>
            </clipPath>
            </defs>
        </svg>
    )
}