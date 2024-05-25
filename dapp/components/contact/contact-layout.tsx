'use client'
import classNames from 'classnames';
import styles from './contact-layout.module.css';
// import NavBar from '@/components/common/navbar/navbar'
import NavBar from '../landing-page/navbar/navbar';
import { source_code_pro } from '@/app/fonts';
import { SendIcon } from '../market/footer/footer';
import Footer from '../landing-page/footer/footer';

const autoResponse = "Hi gm,\n\nThank you for reaching out.\n\nWe'll be getting back to ASAP.\n\nAll the best,\nAuralopitech Team."

const ContactForm = () => {
  return (
      <div className={styles.body} >
          <h1>We&apos;ll get back to you asap!</h1>
          <form  className={styles.messenger} target="_blank" action="https://formsubmit.co/australopitech@proton.me" method="POST">
            
                <div className={styles.form}>
                  <div className={styles.inputContainer}>
                    <span>Name*: </span><input type="text" name="name" className={styles.input} placeholder="" required />
                  </div>
                    <div className={styles.inputContainer}>
                      <span>Email*: </span><input type="email" name="email" className={styles.input} placeholder="" required />
                      <input type='hidden' name='_cc' value="pbfranceschin@gmail.com,bfranceschin@gmail.com"/>
                      <input type="hidden" name="_autoresponse" value={autoResponse} />
                      <input type="hidden" name="_subject" value="Venn Protocol: Contact" />
                    </div>
                  <div className={styles.inputContainer}>
                    <span>Message*: </span><textarea placeholder="" className={styles.input} name="message" rows={10} required></textarea>
                  </div>
            
                </div>
                <button type="submit" className={classNames(styles.button, source_code_pro.className)}>
                  SEND
                  <span style={{ width: 'var(--step-0)', height: 'var(--step-0)' }}><SendIcon/></span>
                </button>
          </form>
      </div>
  )
}


export default function ContactLayout () {
  return (
    /**contact form needs a margin to evade the navbar which is fixed. begins at 40px scales up to 83px */
    <div style={{display: 'flex', flexDirection: 'column', width: '100vw', alignItems: 'center', color: '#000000'}}>
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', color: '#000000', width: '100%', maxWidth: '1600px', justifySelf: 'center'}}>
        <NavBar  />
        <ContactForm />
    </div>
    <Footer/>
    </div>
  )
}
