// 'use client'
// import styles from './sign-in.module.css';
// import { createWeb3AuthSigner } from '@/utils/web3auth';
// import { useConnectModal } from '@rainbow-me/rainbowkit';
// import { useSetSigner, useSigner, useSmartAccountAddress, useSignIn } from '@/app/account/venn-provider';
// import NavBar from '../common/navbar/navbar';
// import { useCallback, useContext, useEffect, useRef } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAccount } from 'wagmi';
// // import { signIn } from '@/app/venn-provider';

// export interface ConnectButtonProps {
//   handler: any;
//   style?: any,
//   connectText?: string
// }

// export function SignInButton ({handler, style,  connectText}: ConnectButtonProps) {
//   return (
//     <div className={style} onClick={handler}>
//         {connectText ?? 'Connect Wallet'}
//     </div>
//   )
// }



// export default function SignIn () {
// //   const [hideBackground]
//   const { openConnectModal } = useConnectModal();
//   const router = useRouter();
//   const { address: eoa } = useAccount();
//   const setSigner = useSetSigner();
//   const signer = useSigner();
//   const vsa = useSmartAccountAddress();
//   const isInitialRender = useRef(true);
//   // const signIn = useSignIn();

//   console.log('signer', signer);
//   // console.log('vsa', vsa)
  

//   useEffect(() => {
//     if (isInitialRender.current) {
//     // Skip the effect on initial render
//       isInitialRender.current = false;
//     } else if (vsa || eoa) {
//       setTimeout(() => {
//         router.push('/dashboard');
//       }, 100);
//     }
//     return () => {
//       console.log('SignIn component is unmounting');
//     };
//   }, [vsa, eoa, router]);

//   const signIn = useCallback(async() => {
//     if(setSigner)
//       setSigner(await createWeb3AuthSigner());
//   } ,[setSigner]);
  
//     return (
//         <div className={styles.dashboard}>
//             <NavBar signInPage={true} navbarGridTemplate={styles.navbarGridTemplate} currentPage='dashboard' />
//             <div className={styles.notConnectedTemplate}>
//               <div className={styles.notConnectedContainer}>
//                 <div className={styles.ellipses}>
//                   <span></span>
//                   <span></span>
//                   <span></span>
//                 </div>
//                 <span className={styles.notConnectedMessage}>Choose your preffered <br /> Sign In method</span>
//                 {/* <ConnectButton connectText='Connect'/> */}
//                 <div className={styles.connectButtonsWrapper}>
//                   <div className={styles.connectButtonContainer}>
//                     <SignInButton style={styles.connectButton} connectText='VSA Sign In' handler={() => signIn()} />
//                     <div className={styles.descriptionTitle}>Sign In with a <b><i>Venn Smart Account</i></b>.<br/></div>
//                     <div className={styles.descriptionText}>                    
//                     You can <b>LIST</b> and <b>PURCHASE</b> NFT's as <b>rentals</b>.<br/>
//                       Even if you <i>do not</i> have a VSA yet, you can proceed with the sign in to create one. <span className={styles.warningText}>[Recommended]</span>
//                     </div>
//                   </div>
//                   <div className={styles.connectButtonContainer}>
//                     <SignInButton style={styles.connectButton} connectText='EOA Sign In' handler={openConnectModal} />
//                     {/* <ConnectButton /> */}
//                     <div className={styles.descriptionTitle}>Sign In with a regular account.</div>
//                     <div className={styles.descriptionText}>
//                       Use a web3 wallet like Metamask, Coinbase Wallet, etc.<br/> 
//                       You can still list your own NFT's to be rented, but can not purchase a rental yourself.
//                     </div>
//                     </div>
//                   </div>
//               </div>
//             </div>
//         </div>
//     )
// }