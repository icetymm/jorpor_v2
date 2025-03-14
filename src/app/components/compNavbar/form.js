'use client'
import React, { useState , useEffect,  useRef } from 'react';
import Link from 'next/link'
// import '@fontsource/ntr'
import '../../globals.css'
import '@fontsource/mitr';
import {FiMenu} from 'react-icons/fi';
import {AiOutlineClose} from 'react-icons/ai';
import {usePathname } from 'next/navigation';
import { CompLanguageProvider, useLanguage } from '../compLanguageProvider_role_admin';
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
  

  const Navbar = () => {
    return (
      <div className="bg-green-600 text-white py-4 px-6 flex justify-between items-center shadow-lg">
        <h1 className="text-xl font-bold">แบบฟอร์ม จป. (ท)</h1>
        <div>
          <button className="bg-white text-green-600 py-2 px-4 rounded-lg hover:bg-gray-200">เมนู 1</button>
          <button className="bg-white text-green-600 py-2 px-4 ml-2 rounded-lg hover:bg-gray-200">เมนู 2</button>
        </div>
      </div>
    );
  };  
 }
 export default CompNavbar;