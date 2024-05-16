import classNames from 'classnames';
import styles from './chains.module.css';
import { Base, EthereumMain, EthereumSepolia, Polygon, Optimism, Arbitrum } from './graphics';
import { Tooltip } from '@/components/common/tooltip/tooltip';

export default function AvailableChains () {

  return (
    <div className={styles.body}>
        <div className={styles.text}>Available chains</div>
        <div className={styles.chains}>
          <div className={styles.logo}><Tooltip text='ETHEREUM SEPOLIA'><EthereumSepolia/></Tooltip></div>
          <div className={classNames(styles.logo, styles.disabled)}><EthereumMain /></div>
          <div className={classNames(styles.logo, styles.disabled)}><Arbitrum/></div>
          <div className={classNames(styles.logo, styles.disabled)}><Base/></div>
          <div className={classNames(styles.logo, styles.disabled)}><Optimism/></div>
          <div className={classNames(styles.logo, styles.disabled)}><Polygon/></div>
        </div>
    </div>
  )
}