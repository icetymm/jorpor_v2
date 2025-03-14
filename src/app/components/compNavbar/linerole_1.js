'use client'
import React, { useState , useEffect ,  useRef } from 'react';
import Link from 'next/link'
import '../../globals.css'
import '@fontsource/mitr';
import {FiMenu} from 'react-icons/fi';
import {AiOutlineClose} from 'react-icons/ai';
import {usePathname } from 'next/navigation';
import { CompLanguageProvider, useLanguage } from '../compLanguageProvider_role_1';
import { useTranslation } from 'react-i18next';
import { TbLogout } from "react-icons/tb";


function CompNavbar() {
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguage();
  const [toggle, setToggle] = useState(false);
  useEffect(() => {
    localStorage.setItem('language', language);
  })
  const currentPath = usePathname();

  const outsideClickRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (outsideClickRef.current && !outsideClickRef.current.contains(e.target)) {
        setToggle(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const logout = () => {
    const profileImageUrl = localStorage.getItem('profileImageUrl');
    const rememberedData = localStorage.getItem('rememberedData');

    localStorage.clear();

    if (profileImageUrl) {
      localStorage.setItem('profileImageUrl', profileImageUrl);
    }

    if (rememberedData) {
      localStorage.setItem('rememberedData', rememberedData);
    }

    window.location.href = '/login';
  };

  return (
    <CompLanguageProvider>
      <div className='w-full h-[60px] items-center bg-[#5A985E] fixed top-0 left-0'>
        <div className='mx-auto flex justify-between items-center py-2 px-8 md:h-[60px] w-full'>
          <div className='text-[#fff] relative md:top-[5px] pb-3 pt-2 font-bold text-[24px] md:mr-[25px]'>
            <Link href='/report_role_3'>JorPor</Link>
          </div>

             {/* ปุ่มเลือกภาษา */}
             <div className='lg:h-[60px] flex tracking-wider items-center text-white text-[16px] mx-auto justify-center'>
              <button 
                className="text-white px-5 ml-[20px] relative top-[5px] left-[95px] pb-3 pt-[10px] text-[15px] hover:font-bold rounded-md p-2 " 
                onClick={toggleLanguage}
              >
                {language}
              </button>
            </div>

          <div className={`lg:h-[60px] hidden lg:flex tracking-wider items-center text-white text-[16px] mx-auto justify-center`}>

            <div className='hidden lg:flex text-white'>
              <button className="text-white px-5 ml-[20px] relative top-[5px] pb-3 pt-[10px] text-[15px] hover:font-bold rounded-md p-2 " onClick={toggleLanguage}>
                {language}
              </button>
              <button style={{ whiteSpace: 'nowrap' }} onClick={logout} className={` text-[16px] relative top-[5px] pb-3 pt-2 py-1 text-[#fff] hover:font-bold `}>{t("log out")}</button>
            </div>

            {toggle ? (
              <AiOutlineClose onClick={() => setToggle(!toggle)} size={30} className='lg:hidden block text-white' />
            ) : (
              <FiMenu onClick={() => setToggle(!toggle)} size={25} className='lg:hidden block md:mt-[20px] text-white' />
            )}
          </div>

          <div ref={outsideClickRef} className={`text-[18px] lg:hidden flex flex-col w-[50%] md:w-[30%] h-screen mt-[-12px] md:mt-[-1px] fixed bg-[#80A582] ${toggle ? `left-[0]` : `left-[-100%]`}`}>

            <button onClick={logout} className='flex items-center text-left px-4 py-2 text-[#fff] hover:text-[#5A985E] hover:bg-[#fff]'>
              {t("log out")} <TbLogout className='ml-2' />
            </button>
            <button className={` text-[16px] text-white hover:text-[#5A985E] hover:bg-[#F5F5F5] px-4 py-2`} onClick={() => { toggleLanguage(); setToggle(!toggle); }}>
              {language}
            </button>
          </div>
        </div>
      </div>
    </CompLanguageProvider>
  )
}
export default CompNavbar;
 
  