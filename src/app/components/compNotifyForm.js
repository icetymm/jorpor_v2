'use client'
// import '@fontsource/ntr'
import '../globals.css'
// import '@fontsource/mitr';
// import '@fontsource/athiti';
// import '@fontsource/prompt';
// import '@fontsource/noto-sans-thai';

import CompNavbar from './compNavbar/role_1';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import { CompLanguageProvider, useLanguage } from './compLanguageProvider_role_1';
import { toUnicode } from 'punycode';



function CompNotifyForm({ onSubmit }) {
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguage();
  const [formData, setFormData] = useState({
    title: '',
    employee: '',
    location: '',
    work_owner: '',
    position: '',
    dateTime: '',
    file: null,
    detail: '',
  });

  const [uploadedImage, setUploadedImage] = useState(null);
  const [message, setMessage] = useState('');
  const [id, setId] = useState('');
  const [todoList, setTodoList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser_id = localStorage.getItem('id');
        if (storedUser_id) {
          setId(storedUser_id);
        }

        const editedData = {
          storedUser_id,
          notifyfetch: true
        };
        const requestData = JSON.stringify(editedData)

        const response = await axios.post('/api/examinelist', requestData, {
          headers: { 'Content-Type': 'application/json' },
        });

        const data = response.data;

        if (response.status === 200) {
          if (data.success === true) {
  
            setTodoList(data.dbexaminelist_name);
            

            setFormData((prevData) => ({
              ...prevData,
              work_owner: data.dbexaminelist_name[0].name,
              employee: data.dbexaminelist_name[0].employee,
              position: data.dbexaminelist_name[0].position
            }));
            
          } else {
            setMessage(data.error);
          }
        } else {
          setMessage(data.error);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage('');
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name , value, files } = e.target;
    setMessage('')
    
    if (name === 'file' && files && files.length > 0) {
      const allowedExtensions = ['jpg'];
      const fileExtension = files[0].name.split('.').pop().toLowerCase();
      setMessage('');

      if (allowedExtensions.includes(fileExtension)) {
        setFormData({
          ...formData,
          [name]: files[0],
          fileName: files[0].name,
        });
      } else {
        setMessage('Only .jpg files are accepted')
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
     
    
    }
  };



  const handleSubmit = async () => {
    if (
      formData.title === '' ||
      formData.employee === '' ||
      formData.location === '' ||
      formData.work_owner === '' ||
      formData.position === '' ||
      formData.dateTime === '' ||
      formData.file === null ||
      formData.detail === ''
    ) {
      setMessage('Please fill out all required fields.');
    } else {
    const isSuccess = await onSubmit(formData);
    if (isSuccess) {
      setMessage('');
    } else {
      setMessage('An error occurred while submitting the data.');
    }
  }
  };

    
  return (
    <div>
      
      <CompNavbar/>
        
      <div className=' bg-[url("/bg1.png")]  overflow-auto bg-cover bg-no-repeat absolute z-[-1] top-0 left-0 w-full h-full bg-center '>
        <div className='md:w-[800px] lg:w-[1000px] mx-auto '>
          <div className='absolute top-[100px] left-1/2 transform -translate-x-1/2 z-0'>
             <div className='bg-[#5A985E] mx-auto max-w-[500px] sm:max-w-[350px] py-[100px] rounded-[50px]'></div>
          </div>

          <div className='mx-auto w-[300px] md:w-[700px] lg:w-[800px]  mb-[50px]  py-[30px] text-black flex flex-col  bg-[#FFF] text-center md:rounded-[50px] rounded-[30px] mt-[106px]  '>
          
          

                <div className='md:mt-[10px]'>
                  <div className= {`items-center md:px-10 `  }    >
                  <input type="text" placeholder={t('Topic')} name="title" value={formData.title} onChange={handleInputChange} className= {`  md:text-[17px] text-[14px]  rounded-[10px] p-4 mt-[5px]   w-[250px] h-[29px]     items-center md:w-[620px]   lg:w-[720px] md:h-[40px] bg-[#F5F5F5]   `  }/>
                </div>
                

                <div className="mt-[10px] border-t border-gray-300"></div> 
              </div>

              <div className=' px-2 flex items-center mx-auto w-[250px]  md:ml-[40px] md:w-[620px]   lg:w-[720px]  py-[20px] text-black bg-[#F5F5F5] text-center mt-[15px] rounded-[20px]'>
                <div   className={`  text-[12px] md:text-[14px] rounded-[10px] w-[235px] md:w-[500px] lg:w-[600px]  py-2 md:py-4 bg-[#F5F5F5] ml-[5px] md:ml-[40px] `} >
                     
                     <div  className='flex px-3 items-center '>
                     <p className='text-[#000] text-left   w-[75px]  ml-[-1px] md:w-[100px] md:ml-[-11px]' >{t('Employee')}</p>
                     <p className='pl-2'>:</p>
                     
                        <input type="text" name="employee" value={formData.employee} onChange={handleInputChange} className={`text-[11px] md:text-[13px]   rounded-[2px]  items-center p-2 mt-[-2px] ml-[10px] md:ml-[15px] w-[100px] h-[20px] md:w-[200px] md:h-[20px] bg-[#D9D9D9]  `} readOnly/>

                     </div>
                   
                   

                      <div  className='flex px-3  mt-[5px]  items-center'>
                          <p className='text-[#000] text-left  w-[75px]  ml-[-1px] md:w-[100px] md:ml-[-11px]'>{t("Work Owner")} </p>
                          <p className='pl-2'>:</p>
                          <input type="text" name="work_owner" value={formData.work_owner} onChange={handleInputChange} className={`text-[11px] md:text-[13px]  rounded-[2px]  items-center p-2 mt-[-2px] ml-[10px] md:ml-[15px] w-[100px] h-[20px]  md:w-[200px] md:h-[20px] bg-[#D9D9D9]  `} readOnly/>
                         
                     </div>

                      <div className='flex px-3 mt-[5px]  items-center'>
                        <p className='text-[#000] text-left   w-[75px]  ml-[-1px] md:w-[100px] md:ml-[-11px]'>{t('Position')}</p>
                        <p className='pl-2'>:</p>
                        <input type="text" name="position" value={formData.position} onChange={handleInputChange} className={`text-[11px] md:text-[13px]  rounded-[2px]  items-center p-2 pl-1 mt-[-2px] ml-[10px] md:ml-[15px] w-[100px] h-[20px] md:w-[200px] md:h-[20px] bg-[#D9D9D9]  `} readOnly/>

                      
                    </div>
                   

                    <div className='flex px-3 mt-[5px] items-center '>
                      <p className='text-[#000] text-left w-[75px] ml-[-1px] md:w-[100px] md:ml-[-11px]'>{t('Location')}</p>
                      <p className='pl-2'>:</p>
                      {todoList.length > 0 ? (
                        <div>
                          {todoList[0].examinelist !== null ? (
                            <select
                              id="dropdown"
                              name="location"
                              value={formData.location}
                              onChange={(e) => handleInputChange(e)}
                              className={`text-[11px] md:text-[13px] items-center rounded-[2px] md:ml-[15px] pl-1 mt-[-2px] ml-[10px] w-[100px] h-[20px] md:w-[200px] md:h-[20px] bg-[#D9D9D9]`}
                            >
                              <option value="">{t("Select an option")}</option>
                              {todoList.map((todo, index) => (
                                todo.examinelist.map((examinelistItem, subIndex) => (
                                  <option key={`${index}-${subIndex}`} value={examinelistItem} className='text-[12px]'>
                                    {examinelistItem}
                                  </option>
                                ))
                              ))}
                            </select>
                          ) : (
                            <input
                              type="text"
                              name="location"
                              value={formData.location}
                              onChange={handleInputChange}
                              className={`text-[11px] pl-2 md:text-[13px] rounded-[2px] items-center p-2 mt-[-2px] ml-[10px] md:ml-[15px] w-[100px] h-[20px] md:w-[200px] md:h-[20px] bg-[#D9D9D9]`}
                              placeholder={t('Location')}
                            />
                          )}
                        </div>
                      ) : (
                        <input type="text" name="location" value={formData.location} onChange={handleInputChange} className={`text-[11px] md:text-[13px]  rounded-[2px]  items-center p-2 pl-1 mt-[-2px] ml-[10px] md:ml-[15px] w-[100px] h-[20px] md:w-[200px] md:h-[20px] bg-[#D9D9D9]  `} readOnly/>

                      )}



                    </div>
                    
                    
                    <div className='flex px-3  mt-[5px] items-center'>
                        <p className='text-[#000] text-left   w-[75px]  ml-[-1px] md:w-[100px] md:ml-[-11px]'>{t('Date')}</p>
                        <p className='pl-2'>:</p>
                        <input
                            type="datetime-local"
                            name="dateTime"
                            value={formData.dateTime}
                            onChange={handleInputChange}
                            className={`text-[11px] md:text-[13px]  rounded-[2px]   items-center md:ml-[15px] pl-1 mt-[-2px] ml-[10px] w-[100px] h-[20px]  md:w-[200px] md:h-[20px] bg-[#D9D9D9] `}
                          />                    
                        </div>
                   
                    </div>
                    </div>

                    <div className=' mx-auto w-[250px]  md:w-[620px]   lg:w-[720px] justify-center'>
                      <p className=  {`text-[13px] md:text-[14px]  text-[#808080]  md:mt-[20px] mt-[10px]   text-left  `}>{t("add a photo")}</p>
                      <input type="file" name="file" onChange={handleInputChange} className="w-[248px]  md:w-[620px]   lg:w-[720px] py-1 px-2 border  mt-[5px] md:mt-[5px]  border-gray-300  text-[12px] p-4 rounded-lg "></input>
                    </div>

      

                <div className=' mx-auto w-[250px]  md:w-[620px]   lg:w-[720px] justify-center'>
                    <p className=  {` text-[13px] md:text-[14px]  text-left text-[#808080]   md:mt-[20px] mt-[10px]    `}>{t('details')}</p>
                    <textarea type="text" name="detail" value={formData.detail} onChange={handleInputChange} className='rounded-[10px] mt-[5px] pl-[15px] w-[250px]  text-[14px]  h-[100px] md:text-[16px] md:w-[620px]   lg:w-[720px] md:h-[80px] bg-[#fff] border border-gray-300  p-4 '/>
                </div>
              

                {message && (
                  <p className='mt-3 text-red-500 text-[12px] md:text-[13px] py-2 bg-[#f9bdbb] rounded-[10px] inline-block px-4 w-[210px] md:w-[410px] mx-auto  md:mt-[30px]'>
                    {message}
                  </p>
                )}
               

                <div className='flex items-center md:px-10  md:mt-[20px] ' >
                    <button type='submit' onClick={handleSubmit} className=  {` ${message && 'cursor-not-allowed'} text-[15px]  mt-[20px]  md:text-[15px] mx-auto border-[#64CE3F] bg-[#64CE3F] px-10  py-1 rounded-[20px] text-[#fff] hover:-translate-y-0.5 duration-200 `}>{t('confirm')}</button>
                   
                   
                </div>
                
        

          </div> 
          </div>
        </div>
        </div>
    ) 
 }

 export default  CompNotifyForm;