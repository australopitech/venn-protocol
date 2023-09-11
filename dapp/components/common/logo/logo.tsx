import styles from './logo.module.css';

export interface LogoProps {
    className?: string;
}

export const Logo = ({ className }: LogoProps) => {
    return (
        <div className={styles.logo}>
            Logo
        </div>
    );
};
