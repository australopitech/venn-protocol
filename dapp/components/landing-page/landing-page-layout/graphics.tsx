'use client'
import { motion, Variants } from 'framer-motion';

const pathVariants1: Variants = {
    initial: { pathLength: 0 },
    animate: { 
        pathLength: 1,
        transition: {
            delay: 2,
            duration: 2,
            ease: "easeInOut" ,
            repeat: Infinity,
            repeatType: "reverse",
            repeatDelay: 5
        }
    },
}

const pathVariants2: Variants = {
    initial: { pathLength: 0 },
    animate: { 
        pathLength: 1,
        transition: {
            duration: 2,
            ease: "easeInOut" ,
            repeat: Infinity,
            repeatType: "mirror",
            repeatDelay: 5
        }
    },
}

export function VennBackground () {
    return (
        <svg width="100%" height="100%" viewBox="0 0 740 771" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_73_991)">
            <path d="M256.851 384.639L471 508.278L685.149 384.639V137.361L471 13.7222L256.851 137.361V384.639Z" stroke="black" strokeWidth="2"/>
            <path d="M238.635 345.574L428.061 504.522L660.426 419.947L703.365 176.426L513.939 17.479L281.574 102.053L238.635 345.574Z" stroke="black" strokeWidth="2"/>
            <path d="M227.479 303.939L386.426 493.365L629.947 450.426L714.521 218.061L555.574 28.6347L312.053 71.5741L227.479 303.939Z" stroke="black" strokeWidth="2"/>
            <path d="M223.722 261L347.361 475.149L594.639 475.149L718.278 261L594.639 46.8512L347.361 46.8512L223.722 261Z" stroke="black" strokeWidth="2"/>
            <path d="M227.479 218.061L312.053 450.426L555.574 493.365L714.521 303.939L629.947 71.5741L386.426 28.6348L227.479 218.061Z" stroke="black" strokeWidth="2"/>
            <path d="M238.635 176.426L281.574 419.947L513.939 504.521L703.365 345.574L660.426 102.053L428.061 17.4787L238.635 176.426Z" stroke="black" strokeWidth="2"/>
            <path d="M256.851 137.361L256.851 384.639L471 508.278L685.149 384.639L685.149 137.361L471 13.7221L256.851 137.361Z" stroke="black" strokeWidth="2"/>
            <path d="M281.574 102.053L238.635 345.574L428.061 504.521L660.426 419.947L703.365 176.426L513.939 17.4787L281.574 102.053Z" stroke="black" strokeWidth="2"/>
            <path d="M312.053 71.5741L227.479 303.939L386.426 493.365L629.947 450.426L714.521 218.061L555.574 28.6347L312.053 71.5741Z" stroke="black" strokeWidth="2"/>
            <path d="M347.361 46.8511L223.722 261L347.361 475.149H594.639L718.278 261L594.639 46.8511L347.361 46.8511Z" stroke="black" strokeWidth="2"/>
            <path d="M386.425 28.6344L227.478 218.06L312.052 450.426L555.574 493.365L714.521 303.939L629.947 71.5738L386.425 28.6344Z" stroke="black" strokeWidth="2"/>
            <path d="M428.631 17.4786L239.205 176.426L282.144 419.947L514.51 504.521L703.936 345.574L660.996 102.053L428.631 17.4786Z" stroke="black" strokeWidth="2"/>
            <path d="M84.3699 686.63L285.592 769.979L486.814 686.63L570.163 485.408L486.814 284.186L285.592 200.837L84.3699 284.186L1.02104 485.408L84.3699 686.63Z" stroke="black" strokeWidth="2.20241"/>
            <path d="M52.4852 648.631L236.177 765.656L448.815 718.515L565.84 534.823L518.699 322.185L335.007 205.161L122.369 252.301L5.34437 435.993L52.4852 648.631Z" stroke="black" strokeWidth="2.20241"/>
            <path d="M27.6828 605.673L188.263 752.817L405.856 743.317L553.001 582.737L543.5 365.143L382.921 217.999L165.327 227.499L18.1824 388.079L27.6828 605.673Z" stroke="black" strokeWidth="2.20241"/>
            <path d="M10.7174 559.061L143.306 731.854L359.244 760.283L532.037 627.694L560.466 411.756L427.877 238.963L211.939 210.534L39.1461 343.123L10.7174 559.061Z" stroke="black" strokeWidth="2.20241"/>
            <path d="M2.10384 510.21L102.673 703.402L310.394 768.896L503.586 668.327L569.08 460.606L468.511 267.414L260.79 201.92L67.5979 302.489L2.10384 510.21Z" stroke="black" strokeWidth="2.20241"/>
            <path d="M2.10384 460.606L67.5979 668.327L260.79 768.896L468.511 703.402L569.08 510.21L503.586 302.489L310.394 201.92L102.673 267.414L2.10384 460.606Z" stroke="black" strokeWidth="2.20241"/>
            <path d="M10.7174 411.756L39.1461 627.693L211.939 760.282L427.877 731.854L560.466 559.06L532.037 343.123L359.244 210.534L143.306 238.962L10.7174 411.756Z" stroke="black" strokeWidth="2.20241"/>
            <path d="M27.6828 365.143L18.1824 582.737L165.327 743.317L382.921 752.817L543.5 605.673L553.001 388.079L405.856 227.499L188.263 217.999L27.6828 365.143Z" stroke="black" strokeWidth="2.20241"/>
            <path d="M52.4852 322.185L5.34437 534.823L122.369 718.515L335.007 765.656L518.699 648.631L565.84 435.993L448.815 252.301L236.177 205.16L52.4852 322.185Z" stroke="black" strokeWidth="2.20241"/>
            <path d="M84.3699 284.186L1.02104 485.408L84.3699 686.63L285.592 769.979L486.814 686.63L570.163 485.408L486.814 284.186L285.592 200.837L84.3699 284.186Z" stroke="black" strokeWidth="2.20241"/>
            <path d="M122.369 252.301L5.34411 435.993L52.4849 648.631L236.177 765.656L448.815 718.515L565.839 534.823L518.699 322.185L335.007 205.16L122.369 252.301Z" stroke="black" strokeWidth="2.20241"/>
            <path d="M165.983 227.499L18.839 388.079L28.3393 605.673L188.919 752.817L406.513 743.317L553.657 582.737L544.157 365.143L383.577 217.999L165.983 227.499Z" stroke="black" strokeWidth="2.20241"/>
            </g>
            <defs>
            <clipPath id="clip0_73_991">
            <rect width="740" height="771" fill="white" transform="matrix(1 0 0 -1 0 771)"/>
            </clipPath>
            </defs>
        </svg>
    )
}

function SmallPolyCircle () {
    return (
        <motion.svg 
        initial={{ rotate:0 }}
        animate={{ rotate: 1080 }}
        transition={{
            delay: 4,
            duration: 60,
            repeat: Infinity,
            repeatType: "loop",
        }}
        width="100%" height="100%" viewBox="0 0 496 496" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_150_1098)">
            <motion.path 
            variants={pathVariants1}
            initial="initial"
            animate="animate"
            d="M33.8511 371.639L248 495.278L462.149 371.639V124.361L248 0.721924L33.8511 124.361V371.639Z" stroke="black" strokeWidth="1.5"/>
            <motion.path 
            variants={pathVariants1}
            initial="initial"
            animate="animate"
            d="M15.6347 332.575L205.061 491.522L437.426 406.948L480.365 163.426L290.939 4.4792L58.5741 89.0533L15.6347 332.575Z" stroke="black" strokeWidth="1.5"/>
            <motion.path 
            variants={pathVariants1}
            initial="initial"
            animate="animate"
            d="M4.47865 290.939L163.426 480.365L406.947 437.426L491.521 205.061L332.574 15.6347L89.0527 58.5741L4.47865 290.939Z" stroke="black" strokeWidth="1.5"/>
            <motion.path 
            variants={pathVariants1}
            initial="initial"
            animate="animate"
            d="M0.72216 248L124.361 462.149L371.639 462.149L495.278 248L371.639 33.8509L124.361 33.8509L0.72216 248Z" stroke="black" strokeWidth="1.5"/>
            <motion.path 
            variants={pathVariants1}
            initial="initial"
            animate="animate"
            d="M4.47867 205.061L89.0527 437.426L332.574 480.365L491.521 290.939L406.947 58.5741L163.426 15.6348L4.47867 205.061Z" stroke="black" strokeWidth="1.5"/>
            <motion.path 
            variants={pathVariants1}
            initial="initial"
            animate="animate"
            d="M15.6347 163.426L58.574 406.947L290.939 491.521L480.365 332.574L437.426 89.0527L205.061 4.47867L15.6347 163.426Z" stroke="black" strokeWidth="1.5"/>
            <motion.path 
            variants={pathVariants1}
            initial="initial"
            animate="animate"
            d="M33.8511 124.361L33.8511 371.639L248 495.278L462.149 371.639L462.149 124.361L248 0.722092L33.8511 124.361Z" stroke="black" strokeWidth="1.5"/>
            <motion.path 
            variants={pathVariants1}
            initial="initial"
            animate="animate"
            d="M58.574 89.0527L15.6346 332.574L205.061 491.521L437.426 406.947L480.365 163.426L290.939 4.47868L58.574 89.0527Z" stroke="black" strokeWidth="1.5"/>
            <motion.path 
            variants={pathVariants1}
            initial="initial"
            animate="animate"
            d="M89.0528 58.5741L4.47871 290.939L163.426 480.365L406.947 437.426L491.521 205.061L332.574 15.6347L89.0528 58.5741Z" stroke="black" strokeWidth="1.5"/>
            <motion.path 
            variants={pathVariants1}
            initial="initial"
            animate="animate"
            d="M124.361 33.8511L0.722083 248L124.361 462.149H371.639L495.278 248L371.639 33.8511L124.361 33.8511Z" stroke="black" strokeWidth="1.5"/>
            <motion.path 
            variants={pathVariants1}
            initial="initial"
            animate="animate"
            d="M163.425 15.6347L4.47822 205.061L89.0523 437.426L332.574 480.365L491.521 290.939L406.947 58.5741L163.425 15.6347Z" stroke="black" strokeWidth="1.5"/>
            <motion.path 
            variants={pathVariants1}
            initial="initial"
            animate="animate"
            d="M205.631 4.47864L16.2049 163.426L59.1443 406.947L291.51 491.521L480.936 332.574L437.996 89.0527L205.631 4.47864Z" stroke="black" strokeWidth="1.5"/>
            </g>
            <defs>
            <clipPath id="clip0_150_1098">
            <rect width="496" height="496" fill="white"/>
            </clipPath>
            </defs>
        </motion.svg>
    )
}

function BigPolyCircle () {
    return (
        <motion.svg 
        initial={{ rotate:0 }}
        animate={{ rotate: -540 }}
        transition={{
            delay: 4,
            duration: 60,
            repeat: Infinity,
            repeatType: "loop",
        }}
        width="100%" height="100%" viewBox="0 0 571 571" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_150_1099)">
            <motion.path 
            variants={pathVariants2}
            initial="initial"
            animate="animate"
            d="M84.3699 486.814L285.592 570.163L486.814 486.814L570.163 285.592L486.814 84.3701L285.592 1.02118L84.3699 84.3701L1.02104 285.592L84.3699 486.814Z" stroke="black" strokeWidth="1.5"/>
            <motion.path 
            variants={pathVariants2}
            initial="initial"
            animate="animate"
            d="M52.4852 448.815L236.177 565.84L448.815 518.699L565.84 335.008L518.699 122.369L335.007 5.34467L122.369 52.4854L5.34437 236.177L52.4852 448.815Z" stroke="black" strokeWidth="1.5"/>
            <motion.path 
            variants={pathVariants2}
            initial="initial"
            animate="animate"
            d="M27.6828 405.857L188.263 553.001L405.856 543.501L553.001 382.921L543.5 165.327L382.921 18.183L165.327 27.6833L18.1824 188.263L27.6828 405.857Z" stroke="black" strokeWidth="1.5"/>
            <motion.path 
            variants={pathVariants2}
            initial="initial"
            animate="animate"
            d="M10.7174 359.245L143.306 532.038L359.244 560.467L532.037 427.878L560.466 211.94L427.877 39.1469L211.939 10.7181L39.1461 143.307L10.7174 359.245Z" stroke="black" strokeWidth="1.5"/>
            <motion.path 
            variants={pathVariants2}
            initial="initial"
            animate="animate"
            d="M2.10384 310.394L102.673 503.586L310.394 569.08L503.586 468.511L569.08 260.79L468.511 67.5982L260.79 2.10416L67.5979 102.674L2.10384 310.394Z" stroke="black" strokeWidth="1.5"/>
            <motion.path 
            variants={pathVariants2}
            initial="initial"
            animate="animate"
            d="M2.10384 260.79L67.5979 468.511L260.79 569.08L468.511 503.586L569.08 310.394L503.586 102.673L310.394 2.1038L102.673 67.5979L2.10384 260.79Z" stroke="black" strokeWidth="1.5"/>
            <motion.path 
            variants={pathVariants2}
            initial="initial"
            animate="animate"
            d="M10.7174 211.94L39.1461 427.878L211.939 560.466L427.877 532.038L560.466 359.244L532.037 143.307L359.244 10.7177L143.306 39.1464L10.7174 211.94Z" stroke="black" strokeWidth="1.5"/>
            <motion.path 
            variants={pathVariants2}
            initial="initial"
            animate="animate"
            d="M27.6828 165.327L18.1824 382.921L165.327 543.501L382.921 553.001L543.5 405.857L553.001 188.263L405.856 27.6831L188.263 18.1827L27.6828 165.327Z" stroke="black" strokeWidth="1.5"/>
            <motion.path 
            variants={pathVariants2}
            initial="initial"
            animate="animate"
            d="M52.4852 122.369L5.34437 335.007L122.369 518.699L335.007 565.84L518.699 448.815L565.84 236.177L448.815 52.4854L236.177 5.3446L52.4852 122.369Z" stroke="black" strokeWidth="1.5"/>
            <motion.path 
            variants={pathVariants2}
            initial="initial"
            animate="animate"
            d="M84.3699 84.3699L1.02104 285.592L84.3699 486.814L285.592 570.163L486.814 486.814L570.163 285.592L486.814 84.3699L285.592 1.02104L84.3699 84.3699Z" stroke="black" strokeWidth="1.5"/>
            <motion.path 
            variants={pathVariants2}
            initial="initial"
            animate="animate"
            d="M122.369 52.4852L5.34411 236.177L52.4849 448.815L236.177 565.84L448.815 518.699L565.839 335.007L518.699 122.369L335.007 5.34437L122.369 52.4852Z" stroke="black" strokeWidth="1.5"/>
            <motion.path 
            variants={pathVariants2}
            initial="initial"
            animate="animate"
            d="M165.983 27.6832L18.839 188.263L28.3393 405.857L188.919 553.001L406.513 543.501L553.657 382.921L544.157 165.327L383.577 18.1829L165.983 27.6832Z" stroke="black" strokeWidth="1.5"/>
            </g>
            <defs>
            <clipPath id="clip0_150_1099">
            <rect width="571" height="571" fill="white"/>
            </clipPath>
            </defs>
    </motion.svg>
    )
}

export function AnimatedBackground () {
    return (
        <div style={{
            aspectRatio: 719 / 749,
            width: '100%',
            position: 'relative'
        }}>
            <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                zIndex: -9,
                width: '65%'
            }}>
                <SmallPolyCircle/>
            </div>
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                zIndex:-10,
                width: '80%'
            }}>
                <BigPolyCircle/>
            </div>
        </div>
    )
}