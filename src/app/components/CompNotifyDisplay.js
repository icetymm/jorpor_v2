'use client'
import React, { useState ,useEffect } from 'react';
// import '@fontsource/ntr'
import '../globals.css'
// import '@fontsource/mitr';
import CompNavbar from './compNavbar/role_1';
import axios from 'axios';
import {BiSolidDownload} from 'react-icons/bi'
import {BsCheckCircle} from 'react-icons/bs'
import { CompLanguageProvider, useLanguage } from './compLanguageProvider_role_1';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n'; 
import { initReactI18next } from 'react-i18next';






export default function CompNotifyDisplay({ data , onSubmit}) {

  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();
  const [notifyMessage, setnotifyMessage] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [docx, setdocx] = useState(false);
  const [jpg, setjpg] = useState(false);
  const [pdf, setpdf] = useState(false);
  const [xlsx, setxlsx] = useState(false);
  const [fileelse, setelse] = useState(false);
  const [openpopup, setopenpopup] = useState(false);
  const [message, setMessage] = useState('');
  const [addmessage, setAddMessage] = useState('');
  const [formattedDate, setFormattedDate] = useState('');
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const [openedFile, setOpenedFile] = useState(null);
  const [id, setId] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const storedId = localStorage.getItem("id");
    setId(storedId)


    const date = new Date(data.dateTime);
    const formattedDate = new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    }).format(date);

    setFormattedDate(formattedDate);
  }, [data.dateTime ,data.file ]);
  
  const openFileInNewTab = () => {
    window.open(URL.createObjectURL(data.file), '_blank');
  };


  const handleSubmit = async () => {
    setIsLoading(true);

    if (isFormSubmitted) {
      return;
    }
    
    try {
     
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('employee', data.employee);
      formData.append('location', data.location);
      formData.append('work_owner', data.work_owner);
      formData.append('position', data.position);
      formData.append('dateTime', data.dateTime);
      formData.append('detail', data.detail);
      formData.append('file', data.file);
      formData.append('file_name', data.file_name);
      formData.append('id', id);



      
      const response = await axios.post('/api/notify', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      
      
      setIsFormSubmitted(true);

      const resdata = response.data; 

      if (response.status === 200) {
        const resdata = response.data;
    
        if (resdata.success === true) {
          setShowSuccessPopup(true)
          setAddMessage(resdata.message);
          setnotifyMessage('');

          setTimeout(() => {
            setShowSuccessPopup(false);
            window.location.href = resdata.redirect;
          }, 100); 
        } else {
          setnotifyMessage(resdata.error);
          setMessage('');

        }
      } else {
        setnotifyMessage(resdata.error);
        setMessage('');

      }
    } catch (error) {
      console.error('Error registering: ', error);
      setnotifyMessage(error);
      setMessage('');

    } 
  
  }

  
  return (
    <div>
      
      <CompNavbar/>
        
      <div className=' bg-[url("/bg1.png")]  overflow-auto bg-cover bg-no-repeat absolute z-[-1] top-0 left-0 w-full h-full bg-center '>
      <div className='md:w-[800px] lg:w-[1000px] mx-auto '>
          <div className='absolute top-[100px] left-1/2 transform -translate-x-1/2 z-0'>
             <div className='bg-[#5A985E] mx-auto max-w-[500px] sm:max-w-[350px] py-[100px] rounded-[50px]'></div>
          </div>

          <div className='mx-auto w-[300px] md:w-[700px] lg:w-[800px]  mb-[50px]  py-[30px] text-black flex flex-col  bg-[#FFF] text-center md:rounded-[50px] rounded-[30px] mt-[106px]  '>
          
            

                <div className='md:mt-[30px]'>
              
                <div className=' md:text-[20px] ml-[30px] text-[15px] md:w-[620px]   lg:w-[720px] md:ml-[40px] text-left '>
                    <p>{data.title}</p>
                </div>
                 

                <div className="mt-[10px] border-t border-gray-300"></div> 
              </div>

              <div className=' px-2 flex items-center mx-auto w-[250px]  md:ml-[40px] md:w-[620px]   lg:w-[720px]  py-[20px] text-black bg-[#F5F5F5] text-center mt-[15px] rounded-[20px]'>
                <div className='  text-sm md:text-[14px]  rounded-[10px] w-[235px] md:w-[500px] lg:w-[600px] py-2 md:py-4 bg-[#F5F5F5] ml-[5px] md:ml-[40px]'>
                
                    <div className='flex px-3 '>
                        <p className='text-[#000] text-left   w-[75px]  ml-[-1px] md:w-[100px] md:ml-[-11px]'>{t('Employee')}</p>
                        <p>:</p>
                        <p className='md:ml-[15px]  ml-[10px]  overflow-hidden md:w-[200px] w-[120px] whitespace-nowrap overflow-ellipsis text-left'>{data.employee}</p>
                    </div>
                   
                    <div className='flex px-3  mt-[5px]'>
                        <p className='text-[#000] text-left  w-[75px]  ml-[-1px] md:w-[100px] md:ml-[-11px]'>{t("Work Owner")}</p>
                        <p>:</p>
                        <p className='md:ml-[15px] ml-[10px]  overflow-hidden md:w-[200px] w-[120px] whitespace-nowrap overflow-ellipsis text-left'>{data.work_owner}</p>
                    </div>
                    
                    <div className='flex px-3  mt-[5px]'>
                      <p className='text-[#000] text-left    ml-[-1px]  w-[75px]  md:w-[100px] md:ml-[-11px]  '>{t('Location')}</p>
                      <p>:</p>    
                      <p className='md:ml-[15px] ml-[10px]  overflow-hidden md:w-[200px] w-[120px] whitespace-nowrap overflow-ellipsis text-left'>{data.location}</p>
                    </div>
                 
                      
                 
                      
                      <div className='flex px-3 mt-[5px]'>
                        <p className='text-[#000] text-left   w-[75px]  ml-[-1px] md:w-[100px] md:ml-[-11px]'>{t('Position')}</p>
                        <p>:</p>
                        <p className='md:ml-[15px] text-left  ml-[10px]  overflow-hidden md:w-[200px] w-[120px] whitespace-nowrap overflow-ellipsis '>{data.position}</p>
                    </div>
                 
                     
                      <div className='flex px-3  mt-[5px]'>
                        <p className='text-[#000] text-left   w-[75px]  ml-[-1px] md:w-[100px] md:ml-[-11px]'>{t('Date')}</p>
                        <p>:</p>
                        <p className='md:ml-[15px] ml-[10px]  overflow-hidden md:w-[200px] w-[120px] text-left whitespace-nowrap overflow-ellipsis '>{formattedDate} {t('N')}</p>
                    </div>
                      
                    </div>
                </div>
                
                <div className=' mx-auto w-[250px]  md:w-[620px]   lg:w-[720px] justify-center'>
                  <p className="text-[#808080] text-[13px] text-left ml-[5px] md:text-[14px]  md:mt-[20px]  mt-[10px]">{t('attachments')}</p>

                  <h1 className=" whitespace-nowrap overflow-hidden overflow-ellipsis md:text-[14px] text-[13px] text-left w-[245px] md:w-[620px]   lg:w-[720px] py-1 px-2 border mt-[5px] md:mt-[10px]  border-gray-300 p-4 rounded-lg cursor-pointer "
                    onClick={() => openFileInNewTab()}>{data.file.name}</h1>
                </div>

             
                
                <div className=' mx-auto w-[250px]  md:w-[620px]   lg:w-[720px] justify-center'>
                    <p className=' text-[#808080] text-[13px] md:text-[14px] ml-[5px] text-left  mt-[20px]  md:mt-[16px]'>{t('details')}</p>
                    <textarea  type="text" name="detail" placeholder={data.detail} className='rounded-[10px] mt-[5px] pl-[15px] w-[250px]  h-[100px] md:text-[14px] text-[13px] md:w-[620px]   lg:w-[720px] md:h-[80px] bg-[#fff] border border-gray-300  p-4 '/>
                </div>
                

                {message && (
                  <p className='mt-3 text-red-500 text-[13px] md:text-[14px] py-2 bg-[#f9bdbb] rounded-[10px] inline-block px-4 w-[210px] md:w-[410px] mx-auto md:text-lg md:mt-[30px]'>
                    {message}
                  </p>
                )}
               

                <div className='flex items-center md:px-10  md:mt-[20px]' >
                  <button type= "submit" onClick={handleSubmit} className=' mt-[20px] text-md md:text-[15px] mx-auto border-[#64CE3F] bg-[#64CE3F] px-10  py-1 rounded-[20px] text-[#fff] hover:-translate-y-0.5 duration-200 '>{t('submit')}</button>

                    
                </div>
                <div>
                {isLoading && (
                  <div className='flex mx-auto items-center mt-4' >
                    <div className="mx-auto   mr-[3px] inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                    </div>
                    <p className="mx-auto  ml-[3px] md:ml-[5px] text-[12px] md:text-[16px] ">{t('Loading')}...</p>
                  </div>
                 )} 
              </div>

                {showSuccessPopup && (
                  <div className="bg-white text-[#5A985E] p-8  rounded-lg border-black shadow-lg md:w-[400px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <BsCheckCircle className=' text-[50px] mx-auto mb-[10px]'/>
                  {addmessage}
                </div>
              )}
              {notifyMessage && (
                  <p className=' mt-3 text-red-500 text-xs py-2 bg-[#f9bdbb] rounded-[10px] inline-block px-4 w-[210px] md:w-[410px] mx-auto md:text-lg md:mt-[30px]'>
                    {notifyMessage}
                  </p>
                )}
          
          </div> 
          </div>
        </div>
        </div>
    ) 
 }
  