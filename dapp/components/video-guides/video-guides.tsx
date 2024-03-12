import styles from "./video-guides.module.css";

const VideoIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-video" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M15 10l4.553 -2.276a1 1 0 0 1 1.447 .894v6.764a1 1 0 0 1 -1.447 .894l-4.553 -2.276v-4z" />
        <path d="M3 6m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z" />
    </svg>
  )
}


const Video1element = () => {
    return (
        <iframe width="inherit" height="inherit" src="https://www.youtube.com/embed/pPStdjuYzSI?si=hkSYhrOLPR5JUriX" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
    )
}

export const VideoGuides = () => {

  return (
    <div className={styles.marketLayoutBox}>
        <h1 className={styles.title}>Guides</h1>
        <div className={styles.boxContent}>
            <div className={styles.boxContentContainer} >
                <Video1element />
                <div style={{ display: "flex", alignItems: "center", gap: "4px"}}>
                    <VideoIcon/> Create a Smart Account
                </div>
            </div>
            <div className={styles.boxContentContainer}>
                <Video1element />
                <div style={{ display: "flex", alignItems: "center", gap: "4px"}}>
                    <VideoIcon/> List an NFT
                </div>
            </div>
            <div className={styles.boxContentContainer}>
                <Video1element />
                <div style={{ display: "flex", alignItems: "center", gap: "4px"}}>
                    <VideoIcon/> Rent an NFT
                </div>
            </div>
            <div className={styles.boxContentContainer}>
                <Video1element />
                <div style={{ display: "flex", alignItems: "center", gap: "4px"}}>
                    <VideoIcon/> Interact with Dapps
                </div>
            </div>
        </div>
    </div>
  )
}