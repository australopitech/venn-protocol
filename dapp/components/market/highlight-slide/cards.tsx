import classNames from 'classnames';
import { RightArrow } from '../banner/graphics';
import styles from './cards.module.css';
import { BookInfo, IcyMountainsLocation, StarWarsLogo } from './graphics';
import { press_start_2p, source_sans_3, staatliches } from '@/app/fonts';



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

export function CardStarWars () {
    return (
        <div className={styles.card}>
            <div className={styles.starWarsCard}>
                <div className={styles.backgroundImg}></div>
                <div className={styles.collectionImg}>
                    <img 
                    src='https://ipfs.filebase.io/ipfs/QmUGudTwYXZzSFTHgycQbdGa6fRbAoxRTbR9ptExVKNweH' 
                    alt='collection image' 
                    width='100%'
                    height='100%'
                    />
                </div>
                <div className={styles.starWarsDescription}>
                    <div className={styles.starWarsName}>
                        <div className={styles.starWarsLogo}><StarWarsLogo/></div>
                        <div className={press_start_2p.className} style={{ color: '#ffffff', fontSize: 'var(--step-3)', WebkitTextStroke: '1px #000000'}}>
                            Mock NFTs    
                        </div>    
                    </div>
                    <div className={press_start_2p.className} style={{ 
                        fontSize: 'var(--step--2)', 
                        textWrap: 'balance', 
                        WebkitTextStroke: '1px #000000', 
                        color: '#FFC83C', 
                        textAlign: 'center',
                        maxWidth: 'calc(8.8*var(--step-3))'    
                    }}>
                        Demonstrative purpose only. We are not selling any!!
                    </div>
                    <div style={{ color: '#d9d9d9'}}><CheckoutListings/></div>
                </div>
            </div>
        </div>
    )
}