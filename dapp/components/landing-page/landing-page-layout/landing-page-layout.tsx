import NavBar from "@/components/landing-page/navbar/navbar";
import Banner from "@/components/landing-page/banner/banner";
import styles from "./landing-page-layout.module.css";
import UserCards from "../user-cards/user-cards";
import { source_code_pro } from "@/app/fonts";
import classNames from "classnames";
import FeatureCards from "../feature-cards/feature-cards";
import UseCases from "../use-cases/use-cases";
import AvailableChains from "../chains/chains";
import Footer from "../footer/footer";
import Team from "../team/team";
import DemoScreen from "../demo-screen/demo-screen";
// import Image from "next/image";
import { VennBackground, AnimatedBackground } from "./graphics";
import WhatIs from "../what-is/what-is";

export default function LandingPageLayout () {

  return (
    <div className={styles.background}>
      <div className={styles.backgroundImage}>
          <AnimatedBackground/>
      </div>
      <div className={styles.backgroundFilter}></div>
      <main className={classNames(styles.body, source_code_pro.className)}>      
        <div className={styles.navbar}><NavBar /></div>
        <div className={styles.banner}>
          <Banner />  
        </div>
        <div className={styles.main}>
          <WhatIs/>
          <div className={styles.userCards}>
            <UserCards />          
          </div>
          <FeatureCards/>
          <UseCases /> 
          <div className={styles.section}>
            <div className={styles.titleContainer}>
                <div className={styles.title} style={{ display: 'flex', alignItems:'flex-end'}}>
                  Try our Demo<span style={{ width: "var(--step-7)", height: "var(--step-7)"}}><UpRightArrow/></span>
                </div>
            </div>
            <DemoScreen/>
            <div style={{ display: 'flex', width: "100%", justifyContent: "center"}}><AvailableChains/></div>
          </div>
           <Team/>
        </div>
        <div className={styles.footer}>
          <Footer />
        </div>
      </main>
    </div>
  )
}

const UpRightArrow = () => {
  return (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 17L17 7M17 7H8M17 7V16" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}