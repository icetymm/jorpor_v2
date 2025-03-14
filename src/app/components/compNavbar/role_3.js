'use client'
import React, { useState , useEffect,  useRef } from 'react';
import Link from 'next/link'
// import '@fontsource/ntr'
import '../../globals.css'
import '@fontsource/mitr';
import {FiMenu} from 'react-icons/fi';
import {AiOutlineClose} from 'react-icons/ai';
import {usePathname } from 'next/navigation';
import { CompLanguageProvider, useLanguage } from '../compLanguageProvider_role_3';
import { useTranslation } from 'react-i18next';
import { TbLogout } from "react-icons/tb";


function CompNavbar() {
  const { t } = useTranslation();

  const { language, toggleLanguage } = useLanguage();
  const [toggle, setToggle] = useState(false);
  useEffect (() => {
    // console.log("ภาษา ",language)
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
      // localStorage.removeItem('rememberedData', rememberedData);
    }
    
  
    window.location.href = '/login';
  };
  


    

  return (
    < CompLanguageProvider>
        <div className='w-full h-[60px] items-center  bg-[#5A985E] fixed top-0 left-0 ' >
        <div className=' mx-auto flex justify-between  items-center py-2 px-8 md:h-[60px] w-full   '>
            <div className='text-[#fff]  relative md:top-[5px] pb-3 pt-2  font-bold text-[24px] md:mr-[25px]' >
                <Link href='/report_role_3'>JorPor</Link>
                </div>
             
            <div className={`lg:h-[60px] hidden lg:flex tracking-wider items-center text-white   text-[16px]  mx-auto justify-center `}>
           
            
                
                <Link href="/report_role_3" 
                  style={{ whiteSpace: 'nowrap' }}
                  className={` px-5 relative top-[5px] pb-[14px] pt-3  rounded-t-[20px]  hover:text-[#5A985E] hover:bg-[#F5F5F5] ${
                    currentPath === '/report_role_3' || currentPath === '/reportingResults_role_3' ? 'text-[#5A985E] bg-[#F5F5F5]  border border-b-0' : 'text-[#fff]'}`}
                  >{t("Report results")}</Link>
                
                <Link href="/response_role_3"
                  style={{ whiteSpace: 'nowrap' }}
                  className={` px-5 relative top-[5px] pb-[14px] pt-3  rounded-t-[20px]  hover:text-[#5A985E] hover:bg-[#F5F5F5] ${
                    currentPath === '/response_role_3' || currentPath === '/responsedetail_role_3' ? 'text-[#5A985E] bg-[#F5F5F5]  border border-b-0'  : 'text-[#fff]'}`} 
                  >{t('Evalution')}</Link>                
                
                <Link href="/plan_role_3" 
                  style={{ whiteSpace: 'nowrap' }}
                  className={` px-5 relative top-[5px] pb-[14px] pt-3  rounded-t-[20px]  hover:text-[#5A985E] hover:bg-[#F5F5F5] ${
                    currentPath === '/plan_role_3' ? 'text-[#5A985E] bg-[#F5F5F5]  border border-b-0' : 'text-[#fff]'}`}
                  >{t('Plan')}</Link>
                  
                <Link href="/meeting_role_3" 
                  style={{ whiteSpace: 'nowrap' }}
                  className={` px-5 relative top-[5px] pb-[14px] pt-3  rounded-t-[20px]  hover:text-[#5A985E] hover:bg-[#F5F5F5] ${
                    currentPath === '/meeting_role_3' ? 'text-[#5A985E] bg-[#F5F5F5]  border border-b-0' : 'text-[#fff]'}`}
                  >{t('Meeting')}</Link>

                <Link href="/employee_role_3" 
                  style={{ whiteSpace: 'nowrap' }}
                  className={` px-5 relative top-[5px] pb-[14px] pt-3  rounded-t-[20px]  hover:text-[#5A985E] hover:bg-[#F5F5F5] ${
                    currentPath === '/employee_role_3' ? 'text-[#5A985E] bg-[#F5F5F5]  border border-b-0' : 'text-[#fff]'}`}
                  >{t("Employee list")}</Link>
                
               
                <Link href="/profile_role_3" 
                  style={{ whiteSpace: 'nowrap' }}
                  className={` px-5 relative top-[5px] pb-[14px] pt-3  rounded-t-[20px]  hover:text-[#5A985E] hover:bg-[#F5F5F5] ${
                    currentPath === '/profile_role_3' ? 'text-[#5A985E] bg-[#F5F5F5]  border border-b-0' : 'text-[#fff]'}`}
                  >{t('Profile')}</Link> 
                 
                </div >
                
              <div className='hidden lg:flex text-white  '>
              <button   className="text-white px-5 ml-[20px] relative top-[5px] pb-3 pt-[10px]  text-[15px]   hover:font-bold  rounded-md p-2 " onClick={toggleLanguage}>
                  {language}
                </button> 
                <button style={{ whiteSpace: 'nowrap' }} onClick={logout}  className={` text-[16px]  relative top-[5px] pb-3 pt-2  py-1  text-[#fff] hover:font-bold `}>{t("log out")}</button>
                </div>

            {toggle ? (
              <AiOutlineClose onClick={()=>setToggle(!toggle)} size={30} className='lg:hidden  block text-white'/> 
            ) : (
              <FiMenu onClick={()=>setToggle(!toggle)} size={25} className='lg:hidden block md:mt-[20px] text-white'/>
            )}
            </div>

            <div ref={outsideClickRef} className={`  text-[18px]  lg:hidden flex flex-col w-[50%] md:w-[30%] h-screen mt-[-12px] md:mt-[-1px] fixed bg-[#80A582] ${toggle ? `left-[0]` : `left-[-100%]`}`}>
                
                <Link onClick={()=>setToggle(!toggle)} href="/report_role_3" className=' mt-[15px]  px-4 py-2  text-[#fff] hover:text-[#5A985E] hover:bg-[#fff]  '>{t('Report results')}</Link>
                <Link onClick={()=>setToggle(!toggle)} href="/response_role_3" className='  px-4 py-2  text-[#fff] hover:text-[#5A985E] hover:bg-[#fff]  '>{t('Evalution')}</Link>
                <Link onClick={()=>setToggle(!toggle)} href="/plan_role_3" className='  px-4 py-2  text-[#fff] hover:text-[#5A985E] hover:bg-[#fff]  '>{t('Plan')}</Link>
                <Link onClick={()=>setToggle(!toggle)} href="/meeting_role_3" className='  px-4 py-2  text-[#fff] hover:text-[#5A985E] hover:bg-[#fff]  '>{t('Meeting')}</Link>
                <Link onClick={()=>setToggle(!toggle)} href="/employee_role_3" className='  px-4 py-2  text-[#fff] hover:text-[#5A985E] hover:bg-[#fff]  '>{t("Employee list")}</Link>
                <Link onClick={()=>setToggle(!toggle)} href="/profile_role_3" className='  px-4 py-2  text-[#fff] hover:text-[#5A985E] hover:bg-[#fff]  '>{t('Profile')}</Link>
                
                <button onClick={logout}  className=' flex items-center   text-left px-4 py-2  text-[#fff] hover:text-[#5A985E] hover:bg-[#fff]  '>{t("log out")} <TbLogout className='ml-2' /></button>
                <button  className={` text-[16px]  text-white hover:text-[#5A985E] hover:bg-[#F5F5F5] px-4 py-2`} onClick={() => { toggleLanguage(); setToggle(!toggle); }}>
                  {language}
                </button> 
            </div>
        </div>
        </CompLanguageProvider>
    ) 
 }
 export default CompNavbar;

 
  