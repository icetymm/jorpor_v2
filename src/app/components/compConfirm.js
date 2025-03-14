'use client'

import React from 'react'
import Link from 'next/link'
import '../globals.css'
import '@fontsource/ntr'
import { useState ,useEffect} from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import bcrypt from 'bcryptjs'; 


export const metadata = {
  title: 'confirm change password'
}



export default function CompConfirm() {
 

  
  
  const [formData, setFormData] = useState({
    PIN1: '',
    PIN2: '',
    PIN3: '',
    PIN4: '',
    PIN5: '',
    PIN6: '',
  });

  const [isLoading, setIsLoading] = useState(false); // เพิ่มตัวแปรสถานะ isLoading
  const [message, setMessage] = useState('');
  const [messagePass, setMessagePass] = useState('');
  const [PIN, setPIN] = useState(''); // Initialize the email state

  useEffect(() => {
    const storedPIN = localStorage.getItem('PIN');
    if (storedPIN) {
      setPIN(storedPIN); 
    }    
  
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const storedPIN = localStorage.getItem('PIN');


   
    try {
      if (!formData.PIN1 || !formData.PIN2 || !formData.PIN3 || !formData.PIN4 || !formData.PIN5 || !formData.PIN6) {
        setMessage('Please fill in all fields');
      } else {
      const combinedCode = `${formData.PIN1}${formData.PIN2}${formData.PIN3}${formData.PIN4}${formData.PIN5}${formData.PIN6}`;
      const requestData = {
        PIN_confirm: combinedCode,
        PIN: storedPIN,
      };

      const data = JSON.stringify(requestData);

      const response = await axios.post('/api/confirm', 
      data, {
        headers: { 'Content-Type': 'application/json' 
      }
        
      });
     
      const resdata = response.data;
      if (response.status === 200) {
        if (resdata.success === true) {
          setMessagePass(resdata.message);
          setMessage('');

          setTimeout(() => {
            setIsLoading(true); 
            window.location.href = resdata.redirect;
          }, 1000); 
        } else {
          setTimeout(() => {

          setFormData({
            PIN1: '',
            PIN2: '',
            PIN3: '',
            PIN4: '',
            PIN5: '',
            PIN6: '',
          });
        }, 100); 

          setMessage(resdata.error);
        }
      } else {
        setMessage(resdata.error);
      }
    }
    } catch (error) {
      console.error('เกิดข้อผิดพลาด2:', error);
      setMessage('เกิดข้อผิดพลาด2');
    } finally {
      setIsLoading(false); 
    }
  };


  return (
    <div className='fixed bg-[#F5F5F5] top-0 h-screen w-screen z-20 border '>

      <div className='w-full bg-[#5A985E] fixed top-0 left-0 ' >
        <div className='container mx-auto flex justify-between  items-center py-2 px-4   w-screen  '>
          <div className='text-[#fff] font-bold text-[24px]' >
          <Link href="login">JorPor</Link>

          </div>
          
        </div>
      </div>
      <div className=' bg-[url("/bg1.png")] bg-cover bg-no-repeat  z-[-1] top-0 left-0 w-full h-full bg-center fixed  overflow-auto'>
        <div>
          <div className='mx-auto w-[360px] py-[140px] md:w-[570px]  md:py-[220px] text-black flex flex-col  bg-[#D1E6D3]/50 text-center rounded-[50px] mt-[180px] xs:w-[350px]'>
        </div>

        <div className='absolute inset-[0]'>
          <div>
            <div className='  mx-auto  w-[330px] py-[180px] md:w-[530px]  md:py-[260px] text-black flex flex-col  bg-[#D1E6D3]/50 text-center rounded-[50px] mt-[140px]'>
          </div>
          <div>
            <div className='absolute inset-[0] container mx-auto px-4 z-10 items-center    '>
              <div className='mx-auto w-[300px]  md:w-[490px]  py-[30px] text-black flex flex-col  bg-[#D1E6D3] text-center rounded-[50px] mt-[106px]  '>
              <div>
                <div className='mt-[15px] text-[14px] md:text-[18px] md:mt-[30px] '>
               
                  <form onSubmit={handleSubmit}>
                          <div className='mt-10 md:mt-20 '>
                            <p className='text-[13px]'>Please enter the verification code sent to your email.</p>
                     
                            <div className="flex  justify-center">
                            {[1, 2, 3, 4, 5, 6].map((index) => (
                              <input
                                key={index}
                                type="number"                                
                                name={`PIN${index}`}
                                value={formData[`PIN${index}`]}
                                onChange={handleChange}
                                className="mt-[20px] text-center w-[30px] h-[30px] text-[13px] md:text-lg md:w-[50px] md:h-[50px] md:ml-[18px] mx-1"
                                maxLength={1}
                              />
                            ))}
              
                            </div>   
                            <div className=' mt-[150px] md:mt-[250px] flex flex-col'>

                            {message && (
                              <p className='mt-3 text-red-500 text-[11px] py-2 bg-[#f9bdbb] rounded-[10px] inline-block px-4 w-[210px] md:w-[340px] mx-auto md:text-lg md:mt-[30px]'>
                                {message}
                              </p>
                            )}
                            {messagePass && (
                              <p className=' mt-3 text-green-600 text-[11px] py-2 bg-[#ACE9A7] rounded-[10px] inline-block px-4 w-[210px] md:w-[340px] mx-auto md:text-lg md:mt-[30px]'>
                                {messagePass}
                              </p>
                            )} 
                            <button type="submit" className=" mx-auto mb-[10px] w-[100px] mt-[20px] md:mt-[20px] text-[12px] md:text-[16px]  border-[#5A985E] bg-[#5A985E] px-4 py-1 md:py-2 rounded-[20px] text-[#fff] hover:-translate-y-0.5 duration-200">Comfirm</button>
                          </div>
                          </div>
                   
                          {isLoading && (
                        <div className='flex mx-auto  mt-[15px] ' >
                          <div className="mx-auto mt-[15px]  mr-[3px] inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                          </div>
                          <p className="mx-auto mt-[14px] md:mt-[10px] ml-[3px] md:ml-[5px]  text-[12px] md:text-lg">Loading...</p>
                        </div>
                      )}
                        </form>
                        </div>
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

