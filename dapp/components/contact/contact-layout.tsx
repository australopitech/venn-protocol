'use client'
import styles from './contact-layout.module.css';
import NavBar from '@/components/common/navbar/navbar'

const autoResponse = "Hi gm,\n\nThank you for reaching out.\n\nWe'll be getting back to ASAP.\n\nAll the best,\nAuralopitech Team."

const ContactForm = () => {
  return (
      <div className={styles.content} >
        <div className={styles.formContainer}>
          <h1 className={styles.title}>Contact Us</h1>
          <form target="_blank" action="https://formsubmit.co/australopitech@proton.me" method="POST">
            {/* <div className="form-group">
              <div className="form-row"> */}
                <div className={styles.infoContainer}>
                  <span>Name: </span><input type="text" name="name" className={styles.info} placeholder="Full Name" required />
                </div>
                <div className={styles.infoContainer}>
                  <span>Email: </span><input type="email" name="email" className={styles.info} placeholder="Email Address" required />
                  <input type='hidden' name='_cc' value="pbfranceschin@gmail.com,bfranceschin@gmail.com"/>
                  <input type="hidden" name="_autoresponse" value={autoResponse} />
                  <input type="hidden" name="_subject" value="Venn Protocol: Contact" />
                </div>
              {/* </div>
            </div> */}
            <div className={styles.messageContainer}>
              <span>Message: </span><textarea placeholder="Your Message" className={styles.message} name="message" rows={10} required></textarea>
            </div>
            <div className={styles.buttonContainer}>
              <button type="submit" className={styles.button}>Submit</button>
            </div>
          </form>
        </div>
      </div>
  )
}


export default function ContactLayout () {
  return (
    <div className={styles.contact} >
      <NavBar navbarGridTemplate={styles.navbarGridTemplate} currentPage='market' />
      <div className={styles.contentGridTemplate}> <ContactForm /> </div>
    </div>
  )
}
