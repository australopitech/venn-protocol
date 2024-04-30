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

export default function LandingPageLayout () {

  return (
    <main className={classNames(styles.body, source_code_pro.className)}>
        <NavBar />
        <div style={{ paddingBottom: "40px"}}>
          <Banner />
        </div>
        <div style={ { display: "flex" , flexDirection: "column", alignItems: "center", paddingBottom: "60px"}}>
          <UserCards/>
        </div>
        <FeatureCards/>
        <div className={styles.section}>
          <div className={styles.title}>Use Cases</div>
          <UseCases/>
          <div className={styles.title} style={{ paddingTop: "10px"}}>...among many more!</div>
        </div>
        <div className={styles.section}>
          <div style={{ display: "flex" }}>
            <div className={styles.title}>Try our Demo</div>
            <div style={{ width: "40px", height:"auto"}}><UpRightArrow/></div>
          </div>
          <DemoScreen/>
          <div style={{ paddingLeft: "5vw"}}><AvailableChains/></div>
        </div>
        <div className={styles.section}>
          <Team/>
        </div>
        <div style={{ paddingTop: "300px"}}><Footer/></div>
    </main>
  )
}

const UpRightArrow = () => {
  return (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 17L17 7M17 7H8M17 7V16" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  )
}