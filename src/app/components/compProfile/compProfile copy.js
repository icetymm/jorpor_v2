'use client'
import React, { useState } from 'react';
import axios from 'axios';
import '../globals.css'
import '@fontsource/ntr';
import Link from 'next/link';
import { BsPlusCircleFill } from 'react-icons/bs';
import {MdEmail} from 'react-icons/md'
import {AiOutlineMessage} from 'react-icons/ai'
import {PiPencilSimpleFill} from 'react-icons/pi'
import {BsFillPersonFill} from 'react-icons/bs'
import {BsFillTelephoneFill} from 'react-icons/bs'
import '@fontsource/mitr';
import CompNavbar from './compNavbar';

export default function CompProfile1() {
  
  const [toggle, setToggle] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [router, setRouter] = useState(null); // เพิ่มตัวแปร router

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {


      const response = await axios.get('/api/login', 
      {
        headers: { 'Content-Type': 'application/json' 
      }
        
      });
  
      const resData = response.data;
  
      if (response.status === 200) {
        if (resData.success === true) {
          setMessage('');
          setLoginMessage('');
          
  
  
  
          setTimeout(() => {
            setIsLoading(true); 
              router.push(resData.redirect); 
          }, 1000); 
        } else {
          setLoginMessage(resData.error);
          setMessage('');
        }
      } else {
        setLoginMessage(resData.error);
        setMessage('');
      }
    } catch (error) {
      console.error('Error Profile: ', error);
      setLoginMessage(error.message || 'An error occurred');
      setMessage('');
    } 
  };
  return (
    <div>
      
      <CompNavbar/>

      <div className=' bg-[url("/bg1.png")]  overflow-auto bg-cover bg-no-repeat absolute z-[-1] top-0 left-0 w-full h-full bg-center fixed  '>
        <div>
          <div className='  mx-auto  w-[360px] py-[160px] md:w-[600px]  md:py-[220px] text-black flex flex-col  bg-[#5A985E]/25 text-center rounded-[50px] mt-[180px] '></div>
         
          <div className='absolute inset-[0]'>
            <div>
              <div className='  mx-auto  w-[330px] py-[200px] md:w-[500px]  md:py-[243px] md:mt-[160px] text-black flex flex-col  bg-[#5A985E]/50 text-center rounded-[50px] mt-[140px] '>
              </div>
            <div>
              <div className='absolute inset-[0] container mx-auto px-4 z-10 items-center  font-ntr  '>
                <div className='font-ntr mx-auto md:mt-[200px] md:w-[700px] md:h-[400px] py-[30px] text-black flex flex-col  bg-[#5A985E] text-center rounded-[50px] mt-[106px] h-[460px] w-[300px]'>
                
                  <div>
                    <input type="text" className=' md:mt-[5px] mt-[105px] w-[190px] h-[23px] md:text-[20px] md:w-[200px] md:h-[30px] md:ml-[-140px] bg-[#D9D9D9] '></input> <PiPencilSimpleFill className = 'md:ml-[350px] md:mt-[-25px] text-[#fff] md:text-[20px] ml-[220px] mt-[-20px]'/>
                    <p className='md:mt-[10px] mt-[8px] md:ml-[-100px] text-[#fff] md:text-[20px]'>Safety Officer Supervisory level</p>
                  </div>

                  <div className='md:mt-[60px] font-bold md:ml-[30px] ml-[30px] mt-[30px]'>
                    <div className='flex  text-[#fff] md:text-[24px] md:ml-[100px]'>
                        <BsFillPersonFill className='md:mr-[10px] mr-[10px]'/> Employee
                        <div className='md:ml-[10px] ml-[4px]'>
                          <input type="text" className=' mt-[5px] pl-[15px] w-[150px] h-[20px] text-sm md:text-[20px] md:w-[200px] md:h-[30px] md:ml-[15px] bg-[#D9D9D9] '></input> <PiPencilSimpleFill className = 'text-[#fff] md:text-[20px] md:ml-[186px] md:mt-[-28px] ml-[125px] mt-[-20px]'/>
                        </div>
                    </div>
                    <div className='flex  text-[#fff] md:text-[24px] md:ml-[100px] md:mt-[10px] mt-[5px]'>
                        <BsFillTelephoneFill className='md:mr-[10px] mr-[10px]'/> Phone
                        <div className='md:ml-[42px] ml-[25px]'>
                          <input type="text" className=' mt-[5px] pl-[15px] w-[150px] h-[20px] text-sm md:text-[20px] md:w-[200px] md:h-[30px] md:ml-[15px] bg-[#D9D9D9] '></input> <PiPencilSimpleFill className = 'text-[#fff] md:text-[20px] md:ml-[186px] md:mt-[-28px] ml-[125px] mt-[-20px]'/>
                        </div>
                    </div>
                    <div className='flex  text-[#fff] md:text-[24px] md:ml-[100px] md:mt-[10px] mt-[5px]'>
                        <AiOutlineMessage className='md:mr-[10px] mr-[10px]'/> Line
                        <div className='md:ml-[62px] ml-[38px]'>
                          <input type="text" className=' mt-[5px] pl-[15px] w-[150px] h-[20px] text-sm md:text-[20px] md:w-[200px] md:h-[30px] md:ml-[15px] bg-[#D9D9D9] '></input> <PiPencilSimpleFill className = 'text-[#fff] md:text-[20px] md:ml-[186px] md:mt-[-28px] ml-[125px] mt-[-20px]'/>
                        </div>
                    </div>
                    <div className='flex  text-[#fff] md:text-[24px] md:ml-[100px] md:mt-[10px] mt-[5px]'>
                        <MdEmail className='md:mr-[10px] mr-[10px]'/> Email
                        <div className='md:ml-[50px] ml-[30px]'>
                          <input type="text" className=' mt-[5px] pl-[15px] w-[150px] h-[20px] text-sm md:text-[20px] md:w-[250px] md:h-[30px] md:ml-[15px] bg-[#D9D9D9] '></input> <PiPencilSimpleFill className = 'text-[#fff] md:text-[20px] md:ml-[186px] md:mt-[-28px] ml-[125px] mt-[-20px]'/>
                        </div>
                    </div>
                  </div>

                  <div className='flex items-center md:px-10 text-center mx-auto' >
                    <Link href="/" className=' mt-[60px] text-md md:text-[20px] md:ml-[350px] md:mt-[120px] border-[#93DD79] bg-[#93DD79] px-10  py-1 rounded-[20px] text-[#fff] hover:-translate-y-0.5 duration-200 '>Submit</Link> 
                  </div>

                </div>
              </div>

            </div>
            </div>
          </div>
          
        </div>

      </div>
    </div>
  
    )
}
