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
// import Image from "next/image";

export default function LandingPageLayout () {

  return (
    <main className={classNames(styles.body, source_code_pro.className)}>
        <NavBar />
        <div style={{ paddingBottom: "40px"}}>
          <Banner />
        </div>
        <UserCards/>
        <FeatureCards/>
        <div className={styles.section}>
          <div className={styles.title}>Main Use Cases</div>
          <UseCases/>
        </div>
        <div className={styles.section}>
          <div className={styles.title}>Try our Demo</div>
          <div className={styles.screenshotContainer}>
            <div className={styles.screenshot}><img alt="dashboard print" src='/dashboard-print.png'  /></div>
          </div>
          <div style={{ paddingLeft: "5vw"}}><AvailableChains/></div>
        </div>
        <div style={{ paddingTop: "100px"}}><Footer/></div>
    </main>
  )
}