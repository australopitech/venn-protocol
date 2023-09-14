import styles from './logo.module.css';

export interface LogoProps {
    className?: string;
}

export const Logo = ({ className }: LogoProps) => {
    return (
        <div className={styles.logo}>
        	<svg 
						fill="none" 
						width="36" 
						xmlns="http://www.w3.org/2000/svg" 
						viewBox="445.407 -141.642 36 35.007" 
						height="35.007"
					>
							<g>
									<g>
											<path 
													fill="#F0A6CA" 
													d="M448.51 -141.642h20.732a3.104 3.104 0 0 1 3.102 3.104v19.614a3.104 3.104 0 0 1 -3.102 3.104h-20.732a3.104 3.104 0 0 1 -3.102 -3.104v-19.614a3.104 3.104 0 0 1 3.102 -3.104z"
											/>
									</g>
									<g>
											<path 
													fill="#EFC3E6" 
													fillOpacity="0.7"
													d="M457.573 -132.456h20.731a3.104 3.104 0 0 1 3.104 3.104v19.614a3.104 3.104 0 0 1 -3.104 3.104H457.573a3.104 3.104 0 0 1 -3.104 -3.104v-19.614a3.104 3.104 0 0 1 3.104 -3.104z"
											/>
									</g>
							</g>
					</svg>
        </div>
    );
};
