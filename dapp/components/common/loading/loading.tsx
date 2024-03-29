import styles from './loading.module.css';

export function LoadingDots () {
    return (
      <div className={styles.ellipses}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    )
}

export function LoadingPage () {
    return (
      <div style={{ 
        position: 'fixed', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)' 
      }}>
        <LoadingDots />
      </div>
    )
}

export function LoadingComponent () {
    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            justifySelf: 'center',
            alignItems: 'center', 
            height: '100%' 
        }}>
            <LoadingDots />
        </div>
    )
}

export function LoadingDotsBouncy () {
  return (
  <div className={styles.bouncy}></div>
  )
}
  
  