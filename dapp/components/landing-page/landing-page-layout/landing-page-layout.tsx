import NavBar from "@/components/landing-page/navbar/navbar";
import Banner from "@/components/landing-page/banner/banner";
import styles from "./landing-page-layout.module.css";

export default function LandingPageLayout () {

  return (
    <main className={styles.main}>
            <div style={{ padding:"12px"}}>
                <NavBar />
            </div>
                <Banner />
    </main>
  )
}