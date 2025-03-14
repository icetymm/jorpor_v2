
'use client'
import React from 'react'
import Link from 'next/link'
import '../globals.css'
// import '@fontsource/ntr'
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';



const CompSendEmail = () => {

  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
  });

  const [isLoading, setIsLoading] = useState(false); // เพิ่มตัวแปรสถานะ isLoading
  const [message, setMessage] = useState('');
  const [messagePass, setMessagePass] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      setMessage('Please fill in all fields');
      return;
    }

    try {


      const response = await axios.post('/api/sendemail', 
      formData, {
        headers: { 'Content-Type': 'application/json' 
      }
        
      });

      const resdata = response.data;
      if (response.status === 200) {
        if (resdata.success === true) {

          localStorage.setItem('email', resdata.email);
          localStorage.setItem('PIN', resdata.PIN);
          setMessagePass("Send pass",resdata.message);
          setMessage('');

          
        
          setTimeout(() => {
            setIsLoading(true); 
              router.push(resdata.redirect);
            }, 1000); 
        } else {
          setMessage(resdata.message);
        }
      } else {
        setMessage('Sending failed Please try again later');
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาด2:', error);
      setMessage('Sending failed Please try again later');
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
            <div className='  mx-auto  w-[330px] py-[180px] md:w-[530px]  md:py-[260px] text-black flex flex-col  bg-[#D1E6D3]/50 text-center rounded-[50px] mt-[140px] xs:w-[350px]'>
          </div>
          <div>
            <div className='absolute inset-[0] container mx-auto px-4 z-10 items-center   '>
              <div className='mx-auto w-[300px]  md:w-[490px]  py-[30px] text-black flex flex-col  bg-[#D1E6D3] text-center rounded-[50px] mt-[106px]  '>
                <div className='mt-[15px] md:mt-[30px] '>
                  <h1 className='  text-[20px] md:text-[25px] font-bold'>Change your password</h1>
                  <p className='text-[12px] md:text-[16px] mr-2 mt-[5px]'>Enter your email or phone number</p>

                  <form onSubmit={handleSubmit}>

                    <p className='text-left text-[12px] ml-[55px] md:ml-[100px] mt-[40px]  md:text-[16px]'>Email</p>
                    <div className='flex flex-col mx-auto'>
                    <input type="text" name="email" value={formData.email} onChange={handleChange} className='mx-auto rounded-[20px]  pl-[15px] w-[210px]  h-[25px] text-[12px] md:text-[16px] md:w-[316px] md:h-[41px] ' required/>
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
                    <button type="submit" className=" mx-auto mb-[10px] w-[100px] mt-[20px] md:mt-[20px]  text-[12px] md:text-[16px]  border-[#5A985E] bg-[#5A985E] px- py-1 md:py-2 rounded-[20px] text-[#fff] hover:-translate-y-0.5 duration-200">Send</button>
                    </div>
                   
                    
                    {isLoading && (
                        <div className='flex mx-auto  mt-[15px] ' >
                          <div className="mx-auto mt-[15px]  mr-[3px] inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                          </div>
                          <p className="mx-auto mt-[14px] md:mt-[10px] ml-[3px] md:ml-[5px] text-[12px] md:text-lg">Loading...</p>
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
    );
}
export default CompSendEmail;


