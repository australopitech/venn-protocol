import styles from './chains.module.css';
import { Base, EthereumMain, EthereumSepolia, Polygon } from './graphics';
import { Tooltip } from '@/components/common/tooltip/tooltip';

export default function AvailableChains () {

  return (
    <div className={styles.body}>
        <div className={styles.text}>Available with</div>
        <Tooltip text='ETHEREUM SEPOLIA'><EthereumSepolia/></Tooltip>
        <div className={styles.disabled}><EthereumMain /></div>
        <div className={styles.disabled}><Base/></div>
        <div className={styles.disabled}><Polygon/></div>
    </div>
  )
}