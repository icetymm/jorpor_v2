'use client';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import '../globals.css';
//import 'bootstrap/dist/css/bootstrap.min.css';
import liff from '@line/liff';
import axios from 'axios';
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation';
import '@fontsource/mitr'
import Link from 'next/link';
import { MdToken } from 'react-icons/md';

export default function LoginLine() {
  const router = useRouter();

  // สถานะสำหรับเก็บข้อมูลจากฟอร์ม
  const [formData, setFormData] = useState({
    employee: '', 
    password: '',
    lineUserId: ''
  });

  // สถานะสำหรับข้อมูลโปรไฟล์จาก LINE
  const [profile, setProfile] = useState({
    profileImage: '/img/profile.jpg',
    displayName: '',
    userId: ''
  });

  const [loginMessage, setLoginMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberPassword, setRememberPassword] = useState(false); // เพิ่มสถานะ rememberPassword
  const [userRemember, setUserRemember] = useState([]); // เพิ่มสถานะ userRemember
  const [message, setMessage] = useState('');
 

  useEffect(() => {
    const initializeLiff = async () => {
      try {
        await liff.init({ liffId: '2005924494-qpprzL9W' });
        console.log('LIFF initialized successfully');
        await liff.ready;
        if (liff.isLoggedIn()) {
          const profileData = await liff.getProfile();
          setProfile({
            profileImage: profileData.pictureUrl,
            displayName: profileData.displayName,
            userId: profileData.userId
          });

          setFormData(prev => ({
            ...prev,
            lineUserId: profileData.userId
          }));
          
        } else {
          liff.login();
        }
      } catch (err) {
        console.error('LIFF init error', err);
      }
    };
  
    initializeLiff();

    const TOKEN = localStorage.user_login;
    if (TOKEN) {
      try {
        const base64Url = TOKEN.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        const Token = JSON.parse(atob(base64));

        const expUnixTimestamp = Token.exp; 

        const expDate = new Date(expUnixTimestamp * 1000); 

        const iatUnixTimestamp = Token.iat; 

        const iatDate = new Date(iatUnixTimestamp * 1000); 

        if (expDate.getTime() >= new Date().getTime()) {
          const employee = Token.employee;
          const password = Token.password;
          const oldTokemExp = Token.exp;
          const editedData = { employee, password, oldTokemExp, remember: true };
          const data = JSON.stringify(editedData);

          axios.post('/api/loginline', data, {
            headers: { 'Content-Type': 'application/json' }
          })
          .then(response => {
            const resdata = response.data;
            console.log("fff",resdata)
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
      } catch (error) {
        console.error('Error decoding token:', error);
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

      const response = await axios.post('/api/loginline', 
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
              //router.push(resdata.redirect); 
              //alert("success");
              Swal.fire({
                title: 'Login Successful!',
                text: data.message,
                icon: 'success',
                confirmButtonText: 'OK'
              }).then(()=>{
                liff.closeWindow();
              });
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
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#F0F4F3',
      fontFamily: 'mitr',
    }}>
      <div style={{
        height: '100%',
        width: '87%',
        maxWidth: '400px',
        textAlign: 'center',
        backgroundColor: 'white',
        borderRadius: '20px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '20px',
        marginTop: '20px',
        marginBottom: '20px'
      }}>
        {/** profile */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '20px',
          marginTop: '40px',

        }}>
          <img src={profile.profileImage} alt='Profile Image'  
          style={{
              width: '130px',
              height: '130px',
              borderRadius: '50%',
              objectFit: 'cover',
              marginBottom: '10px',
            }} />
          <p style={{ margin: 0, fontSize: '16px', fontWeight: 'light', color: '#5A975E' }}>{profile.displayName}</p>
        </div>

       <div style={{
          marginBottom: '30px',
          marginTop: '20px',
        }}>
        < h2 style={{ color: '#5A975E', marginBottom: '1px', fontWeight: 'bold', fontSize: '24px', }}>Welcome to Jorpor</h2>
        <p style={{ color: '#757575', marginBottom: '20px' }}>Login to continue</p>
        </div>

         <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px', }}>
            <input
              type="text"
              placeholder="Employee ID"
              value={formData.employee}
              onChange={handleInputChange}
              name='employee'
              style={{
                width: '90%',
                padding: '10px',
                fontSize: '16px',
                borderRadius: '5px',
                border: '1px solid #CCC',
                boxSizing: 'border-box',
                color: '#5A975E'
              }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              name='password'
              style={{
                width: '90%',
                padding: '10px',
                fontSize: '16px',
                borderRadius: '5px',
                border: '1px solid #CCC',
                boxSizing: 'border-box',
                color: '#5A975E'
              }}
            />
          </div>
          <button
            type="submit"
            className='btn btn-success'
            style={{
              width: '40%',
              padding: '10px',
              fontSize: '16px',
              color: 'white',
              backgroundColor: '#00AB6B',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          > LOG IN
          </button>
        </form>
        
       
      </div>
    </div>
  );
}


