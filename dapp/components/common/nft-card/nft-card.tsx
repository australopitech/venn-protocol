import Image from 'next/image';
import styles from './nft-card.module.css';
import classNames from 'classnames';

export interface NftCardProps {
  imageURI: string;
  name: string;
  price?: number; 
  isRented?: boolean;
  expireDate?: string;
}

export default function NftCard ({ imageURI, name, price, isRented, expireDate }: NftCardProps) {
  return (
    <div className={styles.nftCardContainer}>
      <div className={styles.nftCardImageContainer}>
        <img width="100%" height="100%" src={imageURI} alt='NFT Image'/>
      </div>
      <div className={styles.nftCardInfo}>
        <span>{name}</span>
        {price
          ? (isRented
              ? <span className={styles.rented}>
                  {/* {`Rent expires in ${expireDate || 'NaN'}`} */}
                  Rented
                </span>
              : <span className={styles.listed}>
                  Rent price:
                  <span className={styles.price}>
                    {`${price} ETH`}
                  </span>
                </span>
            )
          : <span className={styles.notListed}>
              Not listed
            </span>
        }
      </div> 
    </div>
  );
}