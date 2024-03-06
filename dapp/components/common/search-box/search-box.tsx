'use client'
import { useState, FocusEvent, ChangeEvent } from 'react';
import styles from './search-box.module.css';

export interface SearchBoxProps {
  className?: string;
}

export const SearchBox = ({ className }: SearchBoxProps) => {
  const placeholderText = 'Search for NFTs, Collections and Users'
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [placeholder, setPlaceholder] = useState<string>(placeholderText);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setPlaceholder('');
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setPlaceholder(placeholderText);
  };
  return (
    <div className={styles.searchBoxContainer}>
      <div className={styles.searchWrapper}>
        <input 
          type="text"
          className={styles.searchInput}
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={true}
        />
        <div className={styles.searchIcon}>
          <svg fill="none" height="20px" viewBox="0 0 18 18" width="20px" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.19824 14.3965C8.48145 14.3965 9.68555 14.0537 10.7402 13.4561L14.0537 16.7783C14.3965 17.1211 14.8711 17.2881 15.3457 17.2881C16.374 17.2881 17.1387 16.4971 17.1387 15.4863C17.1387 15.0205 16.9805 14.5635 16.6289 14.2119L13.3418 10.9248C14.0098 9.83496 14.3965 8.56055 14.3965 7.19824C14.3965 3.25195 11.1533 0 7.19824 0C3.25195 0 0 3.24316 0 7.19824C0 11.1533 3.24316 14.3965 7.19824 14.3965ZM7.19824 11.8652C4.62305 11.8652 2.53125 9.77344 2.53125 7.19824C2.53125 4.63184 4.62305 2.53125 7.19824 2.53125C9.77344 2.53125 11.8652 4.63184 11.8652 7.19824C11.8652 9.77344 9.77344 11.8652 7.19824 11.8652Z" fill="#3C4252" fillOpacity="0.5">
            </path>
          </svg>
        </div>
      </div>
    </div>
    // <div className={styles["search-container"]}>
    //   <div className={styles["search-wrapper"]}>
    //     <input
    //       type="text"
    //       className={styles["search-input"]}
    //       placeholder="Search..."
    //     />
    //     <svg className="search-icon" width="16" height="16" viewBox="0 0 16 16">
    //       <path d="M11.742,10.344l3.799,3.801c0.195,0.194,0.195,0.512,0,0.707c-0.195,0.195-0.512,0.195-0.707,0 l-3.799-3.801C10.325,11.67,9.372,12,8,12C5.243,12,3,9.757,3,7s2.243-5,5-5s5,2.243,5,5 C13,9.372,12.67,10.325,11.742,10.344z M8,2C5.791,2,4,3.791,4,6s1.791,4,4,4s4-1.791,4-4S10.209,2,8,2z"/>
    //     </svg>
    //   </div>
    // </div>
  );
};
