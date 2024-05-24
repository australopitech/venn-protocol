'use client'
import styles from './comming-soon.module.css';

export default function ComingSoon () {
    return (
        <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', zIndex:100 , margin: 'auto', top: 0, bottom: 0, left:0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', maxWidth: '70vw'}}>
                <ComingSoonMsg/>
            </div>
            <FakeSlider/>
        </div>
    )
}






const ComingSoonMsg = () => {
    return (
        <div className={styles.msg}>
            COMING SOON
        </div>
    )
}

export const FakeSlider = () => {
    return (
        <div style={{
            display: 'flex',
            width: '100%',
            height: 'auto',
            gap: 'clamp(1.125rem, 0.9375rem + 0.9375vi, 1.875rem)',
            overflow: 'hidden'
        }}>
            <div style={{
                aspectRatio: 50 / 50,
                width: 'clamp(8.375rem, 6.8125rem + 7.8125vi, 14.625rem)',
                height: 'auto',
                background: '#d9d9d9',
                borderRadius: '25px',
                opacity: .8
            }}></div>
            <div style={{
                aspectRatio: 50 / 50,
                width: 'clamp(8.375rem, 6.8125rem + 7.8125vi, 14.625rem)',
                height: 'auto',
                background: '#d9d9d9',
                borderRadius: '25px',
                opacity: .8
            }}></div>
            <div style={{
                aspectRatio: 50 / 50,
                width: 'clamp(8.375rem, 6.8125rem + 7.8125vi, 14.625rem)',
                height: 'auto',
                background: '#d9d9d9',
                borderRadius: '25px',
                opacity: .8
            }}></div>
            <div style={{
                aspectRatio: 50 / 50,
                width: 'clamp(8.375rem, 6.8125rem + 7.8125vi, 14.625rem)',
                height: 'auto',
                background: '#d9d9d9',
                borderRadius: '25px',
                opacity: .8
            }}></div>
            <div style={{
                aspectRatio: 50 / 50,
                width: 'clamp(8.375rem, 6.8125rem + 7.8125vi, 14.625rem)',
                height: 'auto',
                background: '#d9d9d9',
                borderRadius: '25px',
                opacity: .8
            }}></div>
            <div style={{
                aspectRatio: 50 / 50,
                width: 'clamp(8.375rem, 6.8125rem + 7.8125vi, 14.625rem)',
                height: 'auto',
                background: '#d9d9d9',
                borderRadius: '25px',
                opacity: .8
            }}></div>
        </div>
    )
}
