'use client'
import React, { useState , useEffect} from 'react';
import axios from 'axios';
import '../../globals.css'
// import '@fontsource/ntr';
import Link from 'next/link';
import { BsPlusCircleFill } from 'react-icons/bs';
import {MdEmail} from 'react-icons/md'
import {AiOutlineMessage} from 'react-icons/ai'
import {PiPencilSimpleFill} from 'react-icons/pi'
import {BsFillPersonFill} from 'react-icons/bs'
import {BsFillTelephoneFill} from 'react-icons/bs'
import {BsCheckCircle} from 'react-icons/bs'
import '@fontsource/mitr';
import CompNavbarTecline from '/src/app/components/compNavbar/linerole_2';
import { CompLanguageProvider, useLanguage } from '/src/app/components/compLanguageProvider_role_2';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n'; 
import { initReactI18next } from 'react-i18next';
import { FaPhoneVolume } from "react-icons/fa6";
import { FaLine } from "react-icons/fa";
import Image from 'next/image';
import liff from '@line/liff';


function CompProfile1()  {
  return (
    <CompLanguageProvider>
      <App />
    </CompLanguageProvider>
  );
}

function App() {
    const { language, toggleLanguage } = useLanguage();
    const { t } = useTranslation();
  
    const [message, setMessage] = useState('');
    const [id, setId] = useState('');
    const [profileData, setProfileData] = useState({
      id: '',
      employee: '',
      name: '',
      lastname: '',
      position: '',
      phone: '',
      line: '',
      email: ''
    });
    const [fileData, setFileData] = useState();
  
    useEffect(() => {
      const storedId = localStorage.getItem('id');
      if (storedId) {
        setId(storedId);
      }
  
      const fetchData = async () => {
        try {
          const requestData = {
            storedId,
            profile_role_2: true
          };
  
          const response = await axios.post('/api/profile', requestData, {
            headers: { 'Content-Type': 'application/json' },
          });
  
          const resdata = response.data;
  
          if (response.status === 200 && resdata.success === true) {
            let newProfile = {
              ...resdata.profile[0]
            };
            if (resdata.profile[0].email === null) {
              newProfile.email = '';
            } 
            if (resdata.profile[0].line === null) {
              newProfile.line = '';
            } 
            if (resdata.profile[0].phone === null) {
              newProfile.phone = '';
            } 
            if (resdata.profile[0].picture === null) {
              newProfile.picture = '';
            }
            setProfileData(newProfile);
  
            if (resdata.profile[0].picture.data.length > 0) {
              const byteArray = resdata.profile[0].picture.data;
              const uint8Array = new Uint8Array(byteArray);
              const blob = new Blob([uint8Array], { type: 'image/jpeg' });
              const url = URL.createObjectURL(blob);
              setFileData(url);
            }
            setMessage('');
          } else {
            setMessage(resdata.error);
          }
        } catch (error) {
          console.error('Error Profile:', error);
          setMessage('');
        }
      };
  
      fetchData(id);
    }, [id]);
  
    const logout = async () => {
      try {
        await liff.init({ liffId: '2005924494-qpprzL9W' });
        const userId = profileData.id;
        localStorage.clear();
    
        await deleteLineUserId_role_2(userId);
    
        const lineUserId = localStorage.getItem('lineUserId');
        window.alert('ออกจากระบบสำเร็จ');
        window.location.href = '/linelogin';
    
        if (!lineUserId || !liff.isLoggedIn()) {
          setTimeout(() => {
            liff.closeWindow(); 
          }, 500);
        } else {
          console.log('ยังมี lineUserId หรือยังไม่ได้ออกจากระบบ');
        }
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในระหว่างการออกจากระบบ:', error);
      }
    };
    
    const deleteLineUserId_role_2 = async (userId) => {
      try {
  
        const response = await axios.post('/api/profile', {
          deleteLineUserId_role_2: true,
          userId,
        });
    
        if (response.data.success) {
          console.log('lineUserId removed successfully');
        } else {
          console.error('Failed to remove lineUserId:', response.data.error);
        }
      } catch (error) {
        console.error('Error removing lineUserId:', error);
      }
    };
    
  
    return (
  <div>
    <CompNavbarTecline />
  
    <div className="bg-[url('/bg1.png')] overflow-auto bg-cover bg-no-repeat z-[-1] top-0 left-0 w-full h-full bg-center fixed">
      <div>
        {/* <div className="mx-auto w-[360px] py-[160px] md:w-[600px] md:py-[220px] text-black flex flex-col bg-[#5A985E]/25 text-center rounded-[50px] mt-[180px]"></div> */}
        <div className="absolute inset-[0]">
          <div className="container mx-auto px-4 z-10 items-center">
            <div className="mx-auto md:mt-[200px] md:w-[700px] md:h-[500px] py-[30px] text-black flex flex-col bg-[#fff] text-center rounded-[50px] mt-[90px] h-[550px] w-[320px]">
              
              {/* Profile Header */}
              <div className="md:flex mt-[-20px] md:mt-[0px] ml-[23px] w-[275px]">
                <div className="md:flex md:absolute mx-auto md:w-[200px] md:h-[150px]">
                  <p className="md:mt-[10px] mt-[8px] text-[#fff] md:text-[24px] md:w-[350px] text-[24px] text-green-800 font-semibold overflow-ellipsis" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    Profile
                  </p>
                  <Image
                    src={fileData || "/img/profile.jpg"}
                    alt="Profile Image"
                    width={500}
                    height={500}
                    className="ring-2 ring-white ring-offset-2 md:mt-[30px] mt-[30px] ring-offset-[#5A985E] w-32 h-32 mx-auto md:w-[150px] md:h-[150px] rounded-full object-cover"
                  />
                </div>
  
                {/* Profile Details */}
                <div className="md:absolute mx-auto md:h-[120px] mt-5 md:mt-0 md:ml-[275px] md:w-[300px] md:text-left">
                  <div className="flex flex-col">
                    <p className="md:mt-[10px] mt-[8px] text-[#fff] md:text-[24px] md:w-[350px] text-[16px] text-green-800 font-bold overflow-ellipsis" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {profileData.name} {profileData.lastname}
                    </p>
                    <p className="md:mt-[5px] mt-[2px] text-[14px] text-[#fff] md:text-[17px] text-green-800 ">
                      {profileData.position || "-"}
                    </p>
                  </div>
                </div>
              </div>
  
              {/* Contact Information */}
              <div className="text-[14px] w-[280px] md:w-[520px] md:mt-[110px] md:ml-[150px] mx-auto mt-5">
                <div className="flex text-[#fff] md:text-[20px] md:ml-[100px] text-green-800">
                  <BsFillPersonFill className="md:mr-[10px] mr-[5px] mt-[3px] text-green-800" /> 
                  <span className="text-left w-[80px] md:w-[120px] text-green-800">{t('Employee')}</span>:
                  <div className="md:ml-[20px] ml-[15px] text-green-800">
                    {profileData.employee || "-"}
                  </div>
                </div>
                <div className="flex text-[#fff] md:text-[20px] md:ml-[100px] md:mt-[10px] mt-[5px] text-green-800">
                  <FaPhoneVolume className="md:mr-[14px] mr-[5px] mt-[4px] text-[15px] text-green-800" />
                  <span className="w-[80px] md:w-[120px] text-green-800 text-left">{t('Phone')}</span>:
                  <div className="md:ml-[20px] ml-[15px] text-green-800">
                    {profileData.phone || "-"}
                  </div>
                </div>
                <div className="flex text-[#fff] md:text-[20px] md:ml-[100px] md:mt-[10px] mt-[5px] text-green-800">
                  <MdEmail className="md:mr-[10px] mr-[5px] mt-[4px] text-[15px] text-green-800" />
                  <span className="w-[80px] md:w-[120px] text-green-800 text-left">{t('Email')}</span>:
                  <div className="md:ml-[20px] ml-[15px] text-green-800">
                    {profileData.email || "-"}
                  </div>
                </div>
                <div className="flex text-[#fff] md:text-[20px] md:ml-[100px] md:mt-[10px] mt-[5px] text-green-800">
                  <FaLine className="md:mr-[10px] mr-[5px] mt-[4px] text-[15px] text-green-800" />
                  <span className="w-[80px] md:w-[120px] text-green-800 text-left">{t('LINE')}</span>:
                  <div className="md:ml-[20px] ml-[15px] text-green-800">
                    {profileData.line || "-"}
                  </div>
                </div>
              </div>
  
                {/* Log Out Button */}
              <footer className="flex justify-center mt-14 ">
                <div className="bg-[#5A985E]  border-[#3A653E] rounded-[15px] w-[130px] p-3 flex justify-center shadow-lg">
                  <button
                    onClick={logout}
                    className="w-full h-full text-[#fff] text-[18px] "
                  >
                    {t("log out")}
                  </button>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
    );
  }
export default  CompProfile1;