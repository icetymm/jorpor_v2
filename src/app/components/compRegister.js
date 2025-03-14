'use client'

import React, { useState , useEffect} from 'react';
import Link from 'next/link';
import bcrypt from 'bcryptjs'; 
import axios from 'axios';
import CompNavbar from '../components/compNavbar/role_admin';
import { CompLanguageProvider, useLanguage } from './compLanguageProvider_role_admin';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2'

function CompRegister() {
  return (
    <CompLanguageProvider>
      <App />
    </CompLanguageProvider>
  );
}

const hashPassword = async (password) => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

 function App() {
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();

  const [PINconfirm, setPINconfirm] = useState(''); 

  const [formData, setFormData] = useState({
    name: '',
    last_name: '',
    email: '',
    position: '',
    employee: '',
    password: '',
  });

  const [formDataConfirm, setFormDataConfirm] = useState({
    PIN1: '',
    PIN2: '',
    PIN3: '',
    PIN4: '',
    PIN5: '',
    PIN6: '',
  });

  const [registrationMessage, setRegistrationMessage] = useState('');
  const [registrationMessagePass, setRegistrationMessagePass] = useState('');
  const [message, setMessage] = useState('');  
  const [messagepop, setMessagepop] = useState('');
  const [isLoading, setIsLoading] = useState(false); // เพิ่มตัวแปรสถานะ isLoading
  const [isLoadingSingin, setIsLoadingSingin] = useState(false); // เพิ่มตัวแปรสถานะ isLoading
  const [showPopup, setShowPopup] = useState(false);
  const [messagePass, setMessagePass] = useState('');
  const [PIN, setPIN] = useState(''); // Initialize the email state

  const handleInputChange = (e) => {
    setMessage('');
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

  };

  const handleSubmit = async (e) => {
    setMessage('');

    e.preventDefault();
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!emailRegex.test(formData.email)) {
      setMessage('Please enter a valid email address');
      setRegistrationMessage('');
      setRegistrationMessagePass('');

      return;
    }
  
    if (!formData.name || !formData.last_name || !formData.email || !formData.position || !formData.employee || !formData.password) {
      setMessage('Please fill in all fields');
      setRegistrationMessage('');
      setRegistrationMessagePass('');

      return;
    }
  
    if (formData.password.length < 6) {
      setMessage('Password must be at least 6 characters');
      setRegistrationMessage('');
      setRegistrationMessagePass('');

      return;
    }
  
    try {
      const hashedPassword = await hashPassword(formData.password);
      const requestData = {
        ...formData,
        password: hashedPassword,
      };
  
      
      const data = JSON.stringify(requestData);
      
      const response = await axios.post('/api/register', data, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      const resdata = response.data; 

      if (response.status === 200) {
        const resdata = response.data;
    
        if (resdata.success === true) {
          localStorage.setItem('PINconfirm', resdata.PINconfirm);
            setTimeout(() => {
              setIsLoadingSingin(true);
              setShowPopup(true);
            }, 500); 
              
            
        } else {
          setRegistrationMessage(resdata.error);
          setMessage('');
          setRegistrationMessagePass('');

        }
      } else {
        setRegistrationMessage(resdata.error);
        setMessage('');
        setRegistrationMessagePass('');

      }
    } catch (error) {
      console.error('Error registering: ', error);
      setRegistrationMessage('Registration failed Please try again later');
      setMessage('');
      setRegistrationMessagePass('');

    } finally {
      setIsLoading(false); 
    }
  
  }

  const handleConfirmChange = (e) => {
    setMessagepop('');

      const storedPIN = localStorage.getItem('PINconfirm');
      if (storedPIN) {
        setPINconfirm(storedPIN); 
      }    
    
    const { name, value } = e.target;
    setFormDataConfirm({ ...formDataConfirm, [name]: value });
  
    if (value.length === e.target.maxLength) {
      const currentInputNumber = parseInt(name.substring(3));
      const nextInputNumber = currentInputNumber + 1;
  
      const nextInputName = `PIN${nextInputNumber}`;
  
      const nextInput = document.querySelector(`[name="${nextInputName}"]`);
  
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleConfirmSubmit = async (e) => {
    e.preventDefault();
   
   
    try {
      
      if (!formDataConfirm.PIN1 || !formDataConfirm.PIN2 || !formDataConfirm.PIN3 || !formDataConfirm.PIN4 || !formDataConfirm.PIN5 || !formDataConfirm.PIN6) {
        setMessagepop('Please fill in all fields');
      } else {

      const storedPIN = localStorage.getItem('PINconfirm');

      const hashedPassword = await hashPassword(formData.password);
      const combinedCode = `${formDataConfirm.PIN1}${formDataConfirm.PIN2}${formDataConfirm.PIN3}${formDataConfirm.PIN4}${formDataConfirm.PIN5}${formDataConfirm.PIN6}`;
      const requestData = {
        PIN_confirm: combinedCode,
        PIN: storedPIN,
      };
      const requestDataUser = {
        ...formData,
        password: hashedPassword,
      };

      const listData = {requestData ,requestDataUser, confirm: true}
      const data = JSON.stringify(listData);


      const response = await axios.post('/api/register', 
        { requestData, requestDataUser, confirm: true }, 
        {
        headers: { 'Content-Type': 'application/json' 
      }
      });
     
      const resdata = response.data;
      if (response.status === 200) {
        if (resdata.success === true) {
          Swal.fire({
            title: "สร้างบัญชีผู้ใช้ใหม่สำเร็จ",
            //text: "You clicked the button!",
            icon: "success",
            showConfirmButton: false,
          });

          setMessagePass(resdata.message);
          setMessagepop('');

          setTimeout(() => {
            setIsLoading(true); 
            window.location.href = resdata.redirect;
          }, 1000); 
        } else {
          setMessagepop(resdata.error);
          setFormDataConfirm({
            PIN1: '',
            PIN2: '',
            PIN3: '',
            PIN4: '',
            PIN5: '',
            PIN6: '',
          });
        }
      } else {
        setMessagepop('Registration failed Please try again later');
      }
    }
    } catch (error) {
      console.errorpop('Registration failed Please try again later');
      setMessage('Registration failed Please try again later');
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    
    <div >
       <CompNavbar/>  
      <div>

        <div className='bg-[url("/bg1.png")] bg-cover bg-no-repeat z-[-1] top-0 left-0 w-full h-full bg-center fixed overflow-auto'>
      
            <div className='mx-auto w-[360px] py-[145px] md:w-[570px] md:py-[220px] text-black flex flex-col bg-[#D1E6D3]/50 text-center rounded-[50px] mt-[180px]'>

            </div>
            <div className='absolute inset-[0]'>
              <div>
                <div className='mx-auto w-[330px] py-[185px] md:w-[530px] md:py-[260px] text-black flex flex-col bg-[#D1E6D3]/50 text-center rounded-[50px] mt-[140px] '>

                </div>
                <div>
                  <div className='absolute inset-[0]  container mx-auto px-4 z-10 items-center'>
                    <div className='mx-auto w-[300px] md:w-[490px] py-[30px] text-black flex flex-col bg-[#D1E6D3] text-center rounded-[50px] mt-[106px] '>
                      <div className='mt-[15px] md:mt-[30px] '>
                        <h1 className={'text-[20px]  md:text-[25px] font-bold'}>{t("Create New Account")}</h1>
                        {/* <div className='flex justify-center items-center text-[12px] md:text-[16px] mt-2'>
                          <div className='mr-2'>Already Registered?</div>
                          <Link href="/login" className='text-[#5A985E]'>Log in</Link>
                        </div> */}
                        <form onSubmit={handleSubmit}>
                        <div className='flex justify-center items-center text-[12px] md:text-[16px] mt-2'>
                          <div className='mr-2 '>
                            <p className={'mt-4 text-left text-[11px] md:text-[16px] ml-[10px]'}>{t("Name")}</p>
                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className='rounded-[50px] pl-2  text-sm md:text-lg w-[100px]  h-[25px]  md:w-[211px] md:h-[41px]' />
                          </div>
                          <div>
                            <p className={'mt-4 text-left text-[11px] md:text-[16px] ml-[10px]'}>{t("Last Name")}</p>
                            <input type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} className='rounded-[50px]  pl-2  text-sm md:text-lg w-[100px]  h-[25px]  md:w-[211px] md:h-[41px]' />
                          </div>
                        </div>
                        <p className={'text-left text-[11px] ml-[55px] md:ml-[40px] mt-[15px] md:text-[16px]'}>{t("Email")}</p>
                        <input type="text" name="email" value={formData.email} onChange={handleInputChange} className='rounded-[20px]  pl-[15px] w-[210px]  h-[25px] text-sm md:text-lg md:w-[430px] md:h-[41px]' />
                        <div className='flex justify-center items-center  text-[11px] md:text-[20px]   mt-[5px]' >
                          <div className='mr-[10px]'>
                            <p className={'text-left text-[11px] ml-[10px] md:ml-[10px] mt-[15px]  md:text-[16px]'}>{t("Position")}</p>
                            <select id="dropdown" name="position" value={formData.position} onChange={handleInputChange} className='rounded-[20px]  pl-[15px] w-[100px]  h-[25px] text-[11px] md:text-[16px] md:w-[211px] md:h-[41px] ' >
                              <option value="">{t("Select an option")}</option>
                              <option value="Safety Officer Supervisory level">{t("Supervisory level")}</option>
                              <option value="Safety Officer Technical level">{t("Technical level")}</option>
                              <option value="Safety Officer Management level">{t("Management level")}</option>
                              <option value="Administrator">{t("Administrator")}</option>
                            </select>
                          </div>
                          <div>
                            <p className={'text-left text-[11px] ml-[10px] md:ml-[10px] mt-[15px]  md:text-[16px]'}>{t("Employee")}</p>
                            <input type="text" name="employee" value={formData.employee} onChange={handleInputChange} className='rounded-[20px]  pl-[15px] w-[100px]  h-[25px] text-sm md:text-lg md:w-[211px] md:h-[41px]' />
                          </div>
                        </div>
                        <p className={"text-left text-[11px] ml-[55px] md:ml-[40px] mt-[15px] md:text-[16px]"}>{t("Password")}</p>
                        <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="rounded-[20px]  pl-[15px] w-[210px] h-[25px] text-[12px] md:text-[16px] md:w-[430px] md:h-[41px]" />
                        <div className='flex flex-col'>
                        
                          {message && (
                            <p className='mt-3 text-red-500 text-[11px] py-2 bg-[#f9bdbb] rounded-[10px] inline-block px-4 w-[210px] md:w-[410px] mx-auto md:text-[16px] md:mt-[30px]'>
                              {message}
                            </p>
                          )}
                          {registrationMessage && (
                            <p className=' mt-3 text-red-500 text-[11px] py-2 bg-[#f9bdbb] rounded-[10px] inline-block px-4 w-[210px] md:w-[410px] mx-auto md:text-[16px] md:mt-[30px]'>
                              {registrationMessage}
                            </p>
                          )}
                          {registrationMessagePass && (
                            <div className=' mt-3 text-green-600 text-[11px] py-2 bg-[#ACE9A7] rounded-[10px] inline-block px-4 w-[210px] md:w-[410px] mx-auto md:text-[16px] md:mt-[30px]'>
                              {registrationMessagePass}
                            </div>
                            
                          )}
                          
                          <button type="submit" className="mx-auto w-[100px] mt-5 text-[12px] md:text-lg md:mt-8 border-[#5A985E] bg-[#5A985E] px-4 py-1 md:py-2 rounded-[20px] text-[#fff] hover:-translate-y-0.5 duration-200">
                            Sign in
                          </button>
                        </div>
                        {isLoadingSingin && (
                          <div className='flex mx-auto  mt-[15px] ' >
                            <div className="mx-auto mt-[15px]  mr-[3px] inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                            </div>
                            <p className="mx-auto mt-[14px] md:mt-[10px] ml-[3px] md:ml-[5px] font-ntr text-sm md:text-lg">Loading...</p>
                          </div>
                        )}
                        </form>
                        {showPopup && (
                          <div className="fixed inset-0 flex items-center justify-center z-50">
                            <div className="bg-[#91C194] rounded-[30px] p-4 px-4 md:px-8 w-[350px] md:w-[500px] border-[#5A985E] shadow-lg mx-auto">
                              <form onSubmit={handleConfirmSubmit}>
                                <div className='mt-2 md:mt-6  '>
                                  <p className='text-[12px] md:text-[15px]'>Please enter the verification code sent to your email.</p>
                          
                                  <div className="flex  mx-auto  justify-center  ">
                                  {[1, 2, 3, 4, 5, 6].map((index) => (
                                    <input
                                      key={index}
                                      type="number"                                
                                      name={`PIN${index}`}
                                      value={formDataConfirm[`PIN${index}`]}
                                      onChange={handleConfirmChange}
                                      className="mt-[20px] text-center w-[30px] h-[30px] text-lg md:text-lg md:w-[50px] md:h-[50px]  mx-2"
                                      maxLength={1}
                                    />
                                  ))}
                    
                                  </div>   
                                  <div className='flex flex-col  mt-[40px]'>
                                  <div>
                                  {messagepop && (
                                    <p className='mt-3 text-red-500 text-xs py-2 bg-[#f9bdbb] rounded-[10px] inline-block px-4 w-[210px] md:w-[340px] mx-auto md:text-lg md:mt-[30px]'>
                                      {messagepop}
                                    </p>
                                  )}
                                  {messagePass && (
                                    <p className=' mt-3 text-green-600 text-xs py-2 bg-[#ACE9A7] rounded-[10px] inline-block px-4 w-[210px] md:w-[340px] mx-auto md:text-lg md:mt-[30px]'>
                                      {messagePass}
                                    </p>
                                  )}     
                                  </div>
                                 <div>
                                    <button onClick={handleConfirmSubmit} className=" mx-auto mb-[10px] w-[100px] mt-[10px] md:mt-[20px] text-[12px] md:text-[16px]  border-[#5A985E] bg-[#5A985E] px-4 py-1 md:py-2 rounded-[20px] text-[#fff] hover:-translate-y-0.5 duration-200">Comfirm</button>
                                  </div>
                                  </div>
                                  </div>
                                {isLoading && (
                              <div className='flex mx-auto  mt-[15px] ' >
                                <div className="mx-auto mt-[15px]  mr-[3px] inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                                </div>
                                <p className="mx-auto mt-[14px] md:mt-[10px] ml-[3px] md:ml-[5px] font-ntr text-sm md:text-lg">Loading...</p>
                              </div>
                            )}
                            </form>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

      </div>

    </div>
  );
}
export default CompRegister;