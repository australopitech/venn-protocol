import styles from './collection-card.module.css';
import classNames from 'classnames';

export interface CollectionCardProps {
  uri: string;
  name: string;
  floor?: number;
}

// export default function CollectionCard ({ imageURI, name, price, isRented, expireDate }: CollectionCardProps) {
//   return (
//     <div className={styles.collectionCardContainer}>
//       <div className={styles.collectionCardImageContainer}>
//         <img width="100%" height="100%" src={imageURI} alt='NFT Image'/>
//       </div>
//       <div className={styles.collectionCardInfo}>
//         <span>{name}</span>
//         {price
//           ? (isRented
//               ? <span className={styles.rented}>
//                   {/* {`Rent expires in ${expireDate || 'NaN'}`} */}
//                   Rented
//                 </span>
//               : <span className={styles.listed}>
//                   Rent price:
//                   <span className={styles.price}>
//                     {`${price} ETH`}
//                   </span>
//                 </span>
//             )
//           : <span className={styles.notListed}>
//               Not listed
//             </span>
//         }
//       </div> 
//     </div>
//   )
// }

export default function CollectionCard ({ uri, name, floor }: CollectionCardProps) {
  return (
    // <div className={styles.collectionCardContainer}>
    //   <div className={styles.collectionCardImageContainer}>
    //     <img width="100%" height="100%" src="https://dl.openseauserdata.com/cache/originImage/files/a0e0ab6a2841ae56d4ba63f833ebbca2.png" alt='NFT Image'/>
    //   </div>
    //   <div className={styles.collectionCardInfoContainer}>
    //     <div className={styles.collectionCardInfo}>
    //       Super ultra crazy nft #1 <br />
    //       Price: 0.0001 ETH
    //     </div> 
    //   </div>
    // </div>
    <div className={styles.card}>
      <img src={uri} alt={`Collection name is ${name}`} className={styles.cardImage} />
      <div className={styles.cardInfo}>
        <span className={styles.name}>{name}</span>
        <br />
        {`Floor: ${floor} ETH`}
      </div>
    </div>
  )
}