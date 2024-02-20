import styles from './wallet.module.css';

interface IconProps {
    enabled: boolean
}

export const LinkIcon = (props: IconProps) => {
    return (
        <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="icon icon-tabler icon-tabler-link-plus" 
        width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
        stroke="currentColor" fill="none" 
        stroke-linecap="round"
        stroke-linejoin="round"
        opacity={props.enabled ? 1 : 0.2}
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M9 15l6 -6" />
            <path d="M11 6l.463 -.536a5 5 0 0 1 7.072 0a4.993 4.993 0 0 1 -.001 7.072" />
            <path d="M12.603 18.534a5.07 5.07 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463" />
            <path d="M16 19h6" />
            <path d="M19 16v6" />
        </svg>
    )
}


export const SendIcon =  (props: IconProps) => { //3C4252
    return (
      <div className={styles.sendIcon}>
        <svg
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 28 28"
          xmlSpace="preserve"
          width="20"
          height="20"
          opacity={props.enabled ? 1 : 0.2}
          cursor={props.enabled ? "pointer" : "not-allowed"}
        >
          <g>
            <g>
              <path
                d="M27.352 12.957 1.697 0.129C0.639 -0.4 -0.443 0.801 0.192 1.798l7.765 12.202L0.192 26.202c-0.635 0.998 0.447 2.198 1.505 1.669l25.655 -12.828c0.86 -0.43 0.86 -1.656 0 -2.086zM4.42 23.902 10.323 14.626a1.166 1.166 0 0 0 0 -1.252L4.42 4.098l19.803 9.902L4.42 23.902z"
                stroke="#4f4f4fe6"
                fill="#4f4f4fe6"
              />
            </g>
          </g>
        </svg>
      </div>
    )
  }
  

export const SwapIcon =  (props: IconProps) => {
    return (
      <svg 
        version="1.1" 
        id="Layer_1" 
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink" 
        x="0px" 
        y="0px" 
        viewBox="0 0 32 32" 
        xmlSpace="preserve" 
        width="28px" 
        height="28px"
        opacity={props.enabled ? 1 : 0.2}
        cursor={props.enabled ? "pointer" : "not-allowed"}  
      >
        <g>
          <g>
            <g>
              <path
                d="M4.552 13.333H20c0.736 0 1.333 -0.597 1.333 -1.333 0 -0.736 -0.597 -1.333 -1.333 -1.333H4.552l3.057 -3.057c0.521 -0.521 0.521 -1.365 0 -1.886 -0.521 -0.521 -1.365 -0.521 -1.886 0L0.391 11.057c-0.031 0.031 -0.06 0.064 -0.088 0.098 -0.013 0.015 -0.024 0.032 -0.035 0.047 -0.014 0.019 -0.029 0.038 -0.042 0.057 -0.013 0.019 -0.024 0.039 -0.035 0.058 -0.011 0.018 -0.022 0.035 -0.032 0.054 -0.011 0.02 -0.02 0.04 -0.029 0.06 -0.009 0.019 -0.019 0.038 -0.027 0.058 -0.008 0.02 -0.015 0.04 -0.022 0.06 -0.008 0.021 -0.016 0.042 -0.022 0.063 -0.006 0.02 -0.011 0.04 -0.016 0.061 -0.006 0.022 -0.012 0.044 -0.016 0.066 -0.005 0.023 -0.007 0.047 -0.011 0.071 -0.003 0.019 -0.006 0.039 -0.008 0.058a1.342 1.342 0 0 0 0 0.263c0.002 0.02 0.006 0.039 0.008 0.058 0.003 0.024 0.006 0.047 0.011 0.071 0.004 0.022 0.011 0.044 0.016 0.066 0.005 0.02 0.009 0.041 0.016 0.061 0.006 0.021 0.015 0.042 0.022 0.063 0.007 0.02 0.014 0.04 0.022 0.06 0.008 0.02 0.018 0.038 0.027 0.058 0.01 0.02 0.019 0.041 0.029 0.061 0.01 0.018 0.021 0.036 0.032 0.054 0.012 0.019 0.023 0.039 0.035 0.058 0.013 0.02 0.028 0.038 0.042 0.057 0.012 0.016 0.023 0.032 0.036 0.048 0.028 0.034 0.057 0.066 0.088 0.097l0.001 0.001 5.333 5.333c0.521 0.521 1.365 0.521 1.886 0 0.521 -0.521 0.521 -1.365 0 -1.886l-3.057 -3.057z"
                stroke="#4f4f4fe6"
                fill="#4f4f4fe6"
              />
              <path
                d="M31.698 20.845c0.013 -0.015 0.024 -0.032 0.036 -0.048 0.014 -0.019 0.029 -0.037 0.042 -0.057 0.013 -0.019 0.024 -0.039 0.035 -0.058 0.011 -0.018 0.022 -0.035 0.032 -0.054 0.011 -0.02 0.02 -0.04 0.029 -0.061 0.009 -0.019 0.019 -0.038 0.027 -0.058 0.008 -0.02 0.015 -0.04 0.022 -0.06 0.008 -0.021 0.016 -0.042 0.022 -0.063 0.006 -0.02 0.011 -0.04 0.016 -0.061 0.006 -0.022 0.012 -0.044 0.016 -0.066 0.005 -0.023 0.007 -0.047 0.011 -0.071 0.003 -0.019 0.006 -0.039 0.008 -0.058 0.009 -0.087 0.009 -0.176 0 -0.263 -0.002 -0.02 -0.006 -0.039 -0.008 -0.058 -0.003 -0.024 -0.006 -0.047 -0.011 -0.071 -0.004 -0.022 -0.011 -0.044 -0.016 -0.066 -0.005 -0.02 -0.009 -0.041 -0.016 -0.061 -0.006 -0.021 -0.015 -0.042 -0.022 -0.063 -0.007 -0.02 -0.014 -0.04 -0.022 -0.06 -0.008 -0.02 -0.018 -0.038 -0.027 -0.058 -0.01 -0.02 -0.019 -0.041 -0.029 -0.061 -0.01 -0.018 -0.021 -0.036 -0.032 -0.054 -0.012 -0.019 -0.023 -0.039 -0.035 -0.058 -0.013 -0.02 -0.028 -0.038 -0.042 -0.057 -0.012 -0.016 -0.023 -0.032 -0.036 -0.048a1.335 1.335 0 0 0 -0.087 -0.096l-0.001 -0.001 -5.333 -5.333c-0.521 -0.521 -1.365 -0.521 -1.886 0s-0.521 1.365 0 1.886l3.057 3.057H12c-0.736 0 -1.333 0.597 -1.333 1.333s0.597 1.333 1.333 1.333h15.448l-3.057 3.057c-0.521 0.521 -0.521 1.365 0 1.886s1.365 0.521 1.886 0l5.333 -5.333 0.001 -0.001a1.379 1.379 0 0 0 0.087 -0.096z"
                stroke="#4f4f4fe6"
                fill="#4f4f4fe6"
              />
            </g>
          </g>
        </g>
      </svg>
    )
  }
  