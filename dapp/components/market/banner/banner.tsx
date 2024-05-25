import classNames from 'classnames';
import styles from './banner.module.css';
import { audiowide, zilla } from '@/app/fonts';
import { InfoLogo, DocsGraphic, GuidesGraphic, CreateVSAGraphic, UpRightArrow, RightArrow } from './graphics';

export function Banner () {
    return (
        <div className={styles.banner}>
            <BannerLearn/>
        </div>
    )
}

export function Banner2 () {
    return (
        <div className={styles.banner}>
            <BannerCreateVsa/>
        </div>
    )
}

function BannerLearn () {
    return (
        <div className={styles.content}>
            <div className={styles.infoLogo}>
                <InfoLogo/>
            </div>
            <div className={styles.learn}>
                <div className={styles.text}>
                    <div className={classNames(styles.title, zilla.className)}>Learn About Venn</div>
                    <div className={styles.description}>{"It's simple and easy to use!"}</div>
                </div>
                <div className={styles.linksContainer}>
                        <div style={{ width: 'clamp(6.25rem, 5.7031rem + 2.7344vi, 8.4375rem)', cursor: 'pointer' }}>
                            <GuidesGraphic/>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px'}}>
                                Guides
                                <div className={styles.arrow}><UpRightArrow/></div>
                            </div>
                        </div>
                        <div style={{ width: ' clamp(5.625rem, 5.1563rem + 2.3438vi, 7.5rem)', cursor: 'pointer' }}>
                            <DocsGraphic/>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px'}}>
                                Docs
                                <div className={styles.arrow}><UpRightArrow/></div>
                            </div>
                        </div>

                </div>
            </div>
        </div>
    )
}

function BannerCreateVsa () {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(1.6875rem, 1.1719rem + 2.5781vi, 3.75rem)', width: '100%'}}>
            <div className={audiowide.className} style={{ fontSize: 'var(--step-5)', textAlign: 'center'}}>
                Create your VSA now!
            </div>
            <div className={styles.content2}>
                <div style={{ width: 'clamp(16.5625rem, 15.3906rem + 5.8594vi, 21.25rem)' }}>
                    <CreateVSAGraphic/>
                </div>
                <div className={styles.text2}>
                    <div className={styles.description2} style={{ width: '70%', maxWidth: '500px'}}>
                        Create a Venn Smart Account and start renting immediately. It&apos;s as easy as logging in your favorite social media!!
                    </div>
                    <div className={styles.button}>
                        GET STARTED
                        <div className={styles.arrow}>
                            <RightArrow/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
