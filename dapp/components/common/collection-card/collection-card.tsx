import styles from './collection-card.module.css';
import classNames from 'classnames';

export interface CollectionCardProps {
  uri: string;
  name: string;
  floor?: number;
  onClick: any;
}

export default function CollectionCard ({ uri, name, floor, onClick }: CollectionCardProps) {
  return (
    <div className={styles.card} onClick={onClick}>
      <img src={uri} alt={`Collection name is ${name}`} className={styles.cardImage} />
      <div className={styles.cardInfo}>
        <span className={styles.name}>{name}</span>
        <br />
        {`Floor: ${floor} ETH`}
      </div>
    </div>
  )
}