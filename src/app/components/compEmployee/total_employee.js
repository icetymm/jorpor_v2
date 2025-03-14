'use client'
import { useRouter } from 'next/router';
import React, { useState ,useEffect, useCallback , useRef } from 'react';
import '../../globals.css'
import Link from 'next/link'
// import '@fontsource/ntr'
// import '@fontsource/mitr';
import { BsPlusCircleFill } from 'react-icons/bs';
import CompNavbar from '../compNavbar/role_admin';
import {BsCalendar2Minus} from 'react-icons/bs';
import { BsTrash } from 'react-icons/bs'; // Add this import for the trash can icon
import { BsPencilSquare } from 'react-icons/bs'; // Add this import for the edit button
import { PiPencilSimpleFill } from 'react-icons/pi';
import {BsCheckCircle} from 'react-icons/bs';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { CompLanguageProvider, useLanguage } from '../compLanguageProvider_role_admin';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n'; 
import { initReactI18next } from 'react-i18next';
import {RxCross2} from 'react-icons/rx'
import { TiWarning } from "react-icons/ti";


function Employee() {
  return (
    <CompLanguageProvider>
      <App />
    </CompLanguageProvider>
  );
}

function App() {
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();
    
    const [showPopup, setShowPopup] = useState(false); // if using React state
    const [popupContent, setPopupContent] = useState(""); // สำหรับเนื้อหาใน Popup
    const [employee, setEmployee] = useState("");
    const [position, setPosition] = useState("");
    const [formData, setFormData] = useState({
      employee: '',
      position: '',
    });
    

  const openPopup = (content, positionValue) => {
    setPopupContent(content);
    setPosition(positionValue); // กำหนดค่าของตำแหน่งตามปุ่มที่คลิก
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setEmployee(""); // รีเซ็ตค่าเมื่อปิด Popup
    setPosition(""); // รีเซ็ตค่าเมื่อปิด Popup
    setFormData({
      employee: '',
      position: '',
    });
  };

  const handleClick = () => {
    alert(`Employee: ${employee}, Position: ${position}`);
    setShowPopup(false); // ปิด Popup หลังจากแสดงค่า
  };
  

  const handleOkClick = async () => {
    // ตรวจสอบว่าผู้ใช้ป้อนค่าครบหรือไม่
    if (!employee || !position) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const Data = { employee , position };
      
      const data = JSON.stringify(Data)
      
      const response = await axios.post('/api/employee_list', data, {
        headers: {
          // 'Content-Type': 'multipart/form-data', // ตั้งค่าเป็น multipart/form-data
          headers: { 'Content-Type': 'application/json' },

        },
      });

      localStorage.setItem('myData', JSON.stringify(response.data));

      if (response.data.success) {
        console.log(response.data)
        const redirectUrl = response.data.redirect;

        // ตรวจสอบว่ามี URL ให้ redirect หรือไม่
        if (redirectUrl) {
          window.location.href = redirectUrl; // เปลี่ยนเส้นทางไปที่ URL ที่ได้รับจาก API
        } else {
          alert('No redirect URL provided.');
        }
      } else {
        alert('Error: ' + response.data.message);
      }


    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send data to the API.");
    } finally {
      setShowPopup(false); // ปิด Popup
    }
  };

  


  const buttonWidth = '60px';
  const buttonStyle = {
    width: buttonWidth,
    transition: 'width 0.3s ease',
  };
  

  return (
    <div>
      
      <CompNavbar/>

        <div className=' bg-[url("/bg1.png")]  bg-cover bg-no-repeat absolute z-[-1] top-0 left-0 w-full h-full bg-center overflow-auto  '>
          <div className='md:w-[700px] lg:w-[1000px] mx-auto  '>
            <div className='flex flex-col w-[330px] mx-auto  md:w-[800px]'>
            <div className='mx-auto  w-[330px] md:w-[800px]  text-black   md:mt-[106px] mt-[80px]  '>
            </div>
            <h1 className={`text-[29px] text-black md:text-[40px] md:w-[400px] w-[200px]  text-ellipsis whitespace-nowrap overflow-hidden  `}>{t("Employee List")}</h1>
            <label className="block  text-gray-700 text-[17px] font-bold mb-2"> {t("Select an option")}:</label>
            </div>
           
           </div>
           <div className='flex flex-col items-center w-[330px] mx-auto md:w-[800px] bg-[#eeeeee] p-8 rounded-lg shadow-lg'>
           <div className='mt-[20px] '>

           <button
              onClick={() => openPopup("Safety Officer Supervisory level","Safety Officer Supervisory level")}
              className="text-[16px] md:text-[16px] border-[#5A985E] bg-[#5A985E] px-10 py-1 md:py-2 rounded-[20px] text-white hover:-translate-y-0.5 duration-200"
            >
              {t("Safety Officer Supervisory level")}
            </button>
          </div>

          <div className="mt-[25px]">
            <button
              onClick={() => openPopup("Safety Officer Technical level","Safety Officer Technical level")}
              className="text-[16px] md:text-[16px] border-[#5A985E] bg-[#5A985E] px-10 py-1 md:py-2 rounded-[20px] text-white hover:-translate-y-0.5 duration-200"
            >
              {t("Safety Officer Technical level")}
            </button>
          </div>

          <div className="mt-[25px]">
            <button
              onClick={() => openPopup("Safety Officer Management level","Safety Officer Management level")}
              className="text-[16px] md:text-[16px] border-[#5A985E] bg-[#5A985E] px-10 py-1 md:py-2 rounded-[20px] text-white hover:-translate-y-0.5 duration-200"
            >
              {t("Safety Officer Management level")}
            </button>
          </div>
        </div>

        {showPopup && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] flex flex-col items-center">
      <h2 className="text-lg font-bold mb-4 text-center text-[#5A985E]">
        {popupContent}
      </h2>
      <div className="mb-4 w-full">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Employee:
        </label>
        <input
          type="text"
          value={employee}
          onChange={(e) => setEmployee(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 placeholder-gray bg-white"
          placeholder="Enter employee"
        />
      </div>
      <div className="mb-4 w-full">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Position:
        </label>
        <input
          type="text"
          value={position}
          readOnly
          className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 bg-white"
        />
      </div>
      <div className="flex justify-center space-x-4">
        <button
          onClick={closePopup}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Close
        </button>
        <button
          onClick={handleOkClick}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          OK
        </button>
      </div>
    </div>
  </div>
)}

           
        </div>
        
      </div>
   
    
  )
  
}
export default Employee;