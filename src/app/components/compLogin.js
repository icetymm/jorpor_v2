'use client'

import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import Link from 'next/link'
import '../globals.css'
// import '@fontsource/ntr'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import '@fontsource/mitr'


export default  function CompLogin() {

  const router = useRouter();
  const [userRemember, setUserRemember] = useState([]);
  const [formData, setFormData] = useState({
    employee: '', 
    password: '', 
  });

  useEffect(() => {
            const TOKEN = localStorage.user_login;
            if (TOKEN){
                const base64Url = TOKEN.split('.')[1];
                const base64 = base64Url.replace('-', '+').replace('_', '/');
                const Token = JSON.parse(atob(base64));

                const expUnixTimestamp = Token.exp; 

                const expDate = new Date(expUnixTimestamp * 1000); 

                const iatUnixTimestamp = Token.iat; 

                const iatDate = new Date(iatUnixTimestamp * 1000); 



            if ( expDate.getTime() >= new Date().getTime()) {

              const employee =  Token.employee;
              const password =  Token.password;
              const oldTokemExp = Token.exp;
              const editedData = { employee, password, oldTokemExp,remember: true}
              const data = JSON.stringify(editedData)

              axios.post('/api/login',
              data, {
                headers: { 'Content-Type': 'application/json' }
              })
              .then(response => {
                const resdata = response.data;
                if (response.status === 200) {
                  if (resdata.success === true) {
                    const token = response.data.token;
                    localStorage.setItem('user_login', token);
        
                    try {
      
                      const token = localStorage.getItem('user_login')
                      const base64Url = token.split('.')[1];
                      const base64 = base64Url.replace('-', '+').replace('_', '/');
                      const Token = JSON.parse(atob(base64));
      
                      const expUnixTimestamp = Token.exp; 
      
                      const expDate = new Date(expUnixTimestamp * 1000);
      
                      const iatUnixTimestamp = Token.iat; 
      
                      const iatDate = new Date(iatUnixTimestamp * 1000); 
      

                      
                    } catch (error) {
                      console.error('Error decoding token:', error);
                    }
                    
                    setTimeout(() => {
                      setIsLoading(true); 
                        router.push(resdata.redirect); 
                    }, 1000);                   } 
                }
              })
              .catch(error => {
                console.error('Error when using the token:', error);
              });
          } else {
            const rememberedData = localStorage.getItem('rememberedData');
            const rememberedTokenData = localStorage.getItem('user_login');

            localStorage.clear();
            
            if (rememberedTokenData) {
              localStorage.setItem('user_login', rememberedTokenData);
            }
            
            if (rememberedData) {
              localStorage.setItem('rememberedData', rememberedData);
            }
          }
        }
  
    const rememberedData = localStorage.getItem('rememberedData');
    if (rememberedData) {
      const rememberedDataArray = JSON.parse(rememberedData);
      
      if (rememberedDataArray.length > 0) {
        const lastItem = rememberedDataArray[rememberedDataArray.length - 1];

        setFormData((prevFormData) => ({ ...prevFormData, employee: lastItem.employee, password: lastItem.password }));

       
      }
      }
  
  }, [setFormData,router]);



  const [loginMessage, setLoginMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // เพิ่มตัวแปรสถานะ isLoading
  const [message, setMessage] = useState('');
  const [rememberPassword, setRememberPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginMessage('')
  
    if (name === 'employee') {
      
        const rememberedData = localStorage.getItem('rememberedData');
        if (rememberedData) {
          const rememberedDataArray = JSON.parse(rememberedData);
          for (const item of rememberedDataArray) {
            if (item.hasOwnProperty('employee')) {
              if (value === item.employee) {
                setFormData({ employee: value, password: item.password });
                return; 
              }
            }
          }
        setFormData({ employee: value, password: '' });
      } else {
        setFormData({ ...formData, employee: value, password: formData.password  });

      }

    } else if (name === 'password') {
      setFormData({ ...formData, [name]: value, employee: formData.employee });
    }
  };
  
  const handleRememberPasswordChange = (e) => {
    setRememberPassword(e.target.checked);
  };

  const handleSubmit = async (e) => {
    setLoginMessage('')

    e.preventDefault();

    if (!formData.employee || !formData.password) {
      setMessage('Please fill in all fields');
      setLoginMessage('');
      return;
    }

    try {
      const rememberedData = localStorage.getItem('rememberedData');
      const rememberedDataArray = JSON.parse(rememberedData);

      const editedData = { formData ,rememberedDataArray, rememberPassword  }
      const data = JSON.stringify(editedData)

      const response = await axios.post('/api/login', 
      data, {
        headers: { 'Content-Type': 'application/json' 
      }
        
      });

      const resdata = response.data;

      if (response.status === 200) {
        if (resdata.success === true) {
                    
          if (rememberPassword) {

            const storedData = localStorage.getItem('rememberedData');
            let rememberedData = [];
            if (storedData) {
              rememberedData = JSON.parse(storedData);
              
            }
        
            setUserRemember(rememberedData)

            const isEmployeeDuplicated = rememberedData.some(item => item.employee === formData.employee);

            if (isEmployeeDuplicated) {
              rememberedData = rememberedData.filter(item => item.employee !== formData.employee);
            }

            const newrememberedData = [
              { employee: formData.employee, password: formData.password }
            ];
        
            rememberedData = [...rememberedData, ...newrememberedData];
        
          
            localStorage.setItem('rememberedData', JSON.stringify(rememberedData));
            
            }
            
            const token = response.data.token;
            localStorage.setItem('user_login', token);
            const storedToken = localStorage.getItem('user_login');
            try {

                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace('-', '+').replace('_', '/');
                const Token = JSON.parse(atob(base64));

                const expUnixTimestamp = Token.exp; 

                const expDate = new Date(expUnixTimestamp * 1000); 

                const iatUnixTimestamp = Token.iat; 

                const iatDate = new Date(iatUnixTimestamp * 1000); 

                
              } catch (error) {
                console.error('Error decoding token:', error);
              }
             

            localStorage.setItem('id', resdata.profile[0].id);
            setMessage('');
            setLoginMessage('');

          setTimeout(() => {
            setIsLoading(true); 
              router.push(resdata.redirect); 
          }, 100); 
        } else {
          setLoginMessage(resdata.error);
          setMessage('');
        }
      } else {
        setLoginMessage(resdata.error);
        setMessage('');
      }
    } catch (error) {
      console.error('Error login: ', error);
      setLoginMessage('Login error please try again later');
      setMessage('');
    } finally {
      setIsLoading(false); 
    }
  };

  
  

  return (
    
    <div className='fixed bg-[#F5F5F5] top-0 h-screen w-screen z-20 border '>
      <Head>
        <title>Jorpor</title>
      </Head>
        <div className='w-full bg-[#5A985E] fixed top-0 left-0 ' >
          <div className='container mx-auto flex justify-between  items-center py-2 px-4   w-screen  '>
            <div className='text-[#fff] font-bold text-[24px]' >
              <span>JorPor</span>

            </div>
           
          </div>
          
        </div>
        <div className=' bg-[url("/bg1.png")] bg-cover bg-no-repeat  z-[-1] top-0 left-0 w-full h-full bg-center fixed  overflow-auto'>
          <div>
            <div className='mx-auto w-[360px] py-[140px] md:w-[570px]  md:py-[220px] text-black flex flex-col  bg-[#D1E6D3]/50 text-center rounded-[50px] mt-[180px] '>
          </div>

          <div className='absolute inset-[0]'>
            <div>
              <div className='  mx-auto  w-[330px] py-[180px] md:w-[530px]  md:py-[260px] text-black flex flex-col  bg-[#D1E6D3]/50 text-center rounded-[50px] mt-[140px]  '>
            </div>
            <div>
              <div className='absolute inset-[0] container mx-auto px-4 z-10 items-center  '>
                <div className='mx-auto w-[300px]  md:w-[490px]  py-[50px] text-black flex flex-col  bg-[#D1E6D3] text-center rounded-[50px] mt-[106px]  '>
                  <div className='mt-[15px] md:mt-[30px]'>
                    <h1 className='  text-[20px] md:text-[25px] font-bold'>Login</h1>
                    <p className='  text-[12px] md:text-[16px] '>Sign in to continue</p>
                    <form onSubmit={handleSubmit}>
                      <p className='mt-[30px] text-left text-[12px] ml-[55px] md:ml-[87px]  md:mt-[40px] md:text-[16px]  '>Employee</p>
                      <input type="text" name="employee" value={formData.employee} onChange={handleInputChange} className='rounded-[20px]  pl-[15px]   w-[190px]  h-[25px] text-[12px] md:text-[16px] md:w-[323px] md:h-[41px]  '/>
                      <p className='text-left text-[12px] ml-[55px] md:ml-[87px] mt-[15px]  md:text-[16px]'>Password</p>
                      <input type="password"  name="password" value={formData.password} onChange={handleInputChange} className='rounded-[20px]  pl-[15px] w-[190px]  h-[25px] text-[12px] md:text-[16px] md:w-[323px] md:h-[41px] '/>

                      <div className='flex justify-center items-center text-[12px] text-center md:text-[16px]  mt-[15px]'>
                        <input type="checkbox" className='mr-[5px]' name="rememberPassword"  checked={rememberPassword} onChange={handleRememberPasswordChange} />
                        <p className='mr-[10px]'>Remember Password</p>
                        <Link href="/sendemail" className=' text-[#5A985E] '>Forgot Password?</Link>
                      </div >

                      {message && (
                        <p className='mt-3 text-red-500 text-[11px] py-2 bg-[#f9bdbb] rounded-[10px] inline-block px-4 w-[210px] md:w-[410px] mx-auto md:text-[16px] md:mt-[30px]'>
                          {message}
                        </p>
                      )}
                      {loginMessage && (
                        <p className=' mt-3 text-red-500 text-[11px] py-2 bg-[#f9bdbb] rounded-[10px] inline-block px-4 w-[210px] md:w-[410px] mx-auto md:text-[16px] md:mt-[30px]'>
                          {loginMessage}
                        </p>
                      )}

                      <button  className='  mt-[60px] text-[12px] md:text-[16px] md:mt-[100px]  border-[#5A985E] bg-[#5A985E] px-10  py-1 md:py-2 rounded-[20px] text-[#fff] hover:-translate-y-0.5 duration-200 '>Login</button>
                      

                      <div className='flex justify-center items-center text-center text-[12px] md:text-[16px]   mt-[15px]' >
                        
                     {/**    <p className='mr-[10px] '>Don&apos;t Have an Account? </p>
                        <Link href="/register" className=' text-[#5A985E] '>sign in</Link>*/}
                      </div>

                      {isLoading && (
                        <div className='flex mx-auto ml-[110px]  md:ml-[190px]  absolute' >
                          <div className="mx-auto mt-[15px]  mr-[3px] inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                          </div>
                          <p className="mx-auto mt-[14px] md:mt-[10px] ml-[3px] md:ml-[5px] text-[12px] md:text-[16px] ">Loading...</p>
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
    
  )
}


