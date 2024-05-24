import styles from './chains.module.css';
import { Tooltip } from '@/components/common/tooltip/tooltip';
import { EthereumMain, EthereumSepolia, Arbitrum, Base, Polygon, Optimism } from '@/components/landing-page/chains/graphics';
import classNames from 'classnames';

export function Chains () {
    return (
        <div className={styles.chains}>
          <div className={styles.logo}><Tooltip text='ETHEREUM SEPOLIA'><EthereumSepolia/></Tooltip></div>
          <div className={classNames(styles.logo, styles.disabled)}><EthereumMain /></div>
          <div className={classNames(styles.logo, styles.disabled)}><Arbitrum/></div>
          <div className={classNames(styles.logo, styles.disabled)}><Base/></div>
          <div className={classNames(styles.logo, styles.disabled)}><Optimism/></div>
          <div className={classNames(styles.logo, styles.disabled)}><Polygon/></div>
        </div>
    )
}