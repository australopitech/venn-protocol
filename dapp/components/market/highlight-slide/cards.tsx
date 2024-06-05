import classNames from 'classnames';
import { RightArrow } from '../banner/graphics';
import styles from './cards.module.css';
import { BookInfo, IcyMountainsLocation } from './graphics';
import { source_sans_3, staatliches } from '@/app/fonts';



const CheckoutListings = () => {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: 'var(--step-1)',
            fontWeight: 600
        }}>
            Checkout Listings
            <div style={{
                width: 'clamp(1.125rem, 1.0313rem + 0.4688vi, 1.5rem)',
                height: 'clamp(1.125rem, 1.0313rem + 0.4688vi, 1.5rem)'
            }}>
                <RightArrow/>
            </div>
        </div>
    )
}


export function CardRealEstate () {
    return (
        <div className={styles.card}>
            <div className={styles.realEstateCard}>
                <div className={styles.icyMountain}>
                    <IcyMountainsLocation/>
                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'clamp(1rem, 0.875rem + 0.625vi, 1.5rem)',
                    alignItems: 'start'
                    }}>
                    <div className={classNames(source_sans_3.className, styles.realEstateCardDescription)}>
                        Checkout our virtual land and real estate listings.
                    </div>
                    <CheckoutListings/>
                </div>
            </div>
        </div>
    )
}

export function CardLearnMore () {
    return (
        <div className={styles.card}>
            <div className={styles.learnMoreCard}>
                <div className={classNames(staatliches.className, styles.learnMoreCardDescription)}>
                        learn everything there is to know about listing and renting nft&apos;s
                </div>
                <div className={styles.book}>
                    <BookInfo/>
                </div>
            </div>
        </div>
    )
}