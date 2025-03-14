'use client'
import React, { useState , useEffect} from 'react';
import Link from 'next/link'
import Image from 'next/image';
// import '@fontsource/ntr'
import '../../globals.css'
// import '@fontsource/mitr';
import {BsFillPeopleFill} from 'react-icons/bs'
import CompNavbar from '../compNavbar/role_1';
import { CompLanguageProvider, useLanguage } from '../compLanguageProvider_role_1';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n'; 
import { initReactI18next } from 'react-i18next';
import axios from 'axios';

function CompMeeting() {
  return (
    <CompLanguageProvider>
      <App />
    </CompLanguageProvider>
  );
}

function App() {

  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();
  const [NamePlanToAdd, setSchedule] = useState([]); // Define the state variable
  const [formattedStartTime, setFormattedStartTime] = useState(''); // Declare formattedStartTime state
  const [formattedEndTime, setFormattedEndTime] = useState(''); // Declare formattedEndTime state
  const [message, setMessage] = useState(false);



    const openMeeting = (url) => {
        const newWindow = window.open('https://teams.microsoft.com/', '_blank');
        newWindow.focus();
    }

    useEffect(() => {
      const fetchData = async () => {
        try {
          const storedId = localStorage.getItem('id');
          if (storedId) {
            // console.log('Stored: ', storedId);
          }
    
          const AddData = { storedId ,meet_role_1:true };
          const data = JSON.stringify(AddData);
          // console.log('DD: ', data);
    
          const response = await axios.post('/api/plan', data, {
            headers: { 'Content-Type': 'application/json' },
          });
    
          const resdata = response.data;
          // console.log('DATA: ', resdata);
    
          if (response.status === 200) {
            if (resdata.success === true) {
              
              let PlanToAdd = [];

              const dbData = resdata.dbPlan || [];
              let count = 0; // Start count at 0
              let closestPlan = null; // Initialize the variable to track the closest plan
              
              dbData.sort((a, b) => {
                const dateA = new Date(a.date.split('/').reverse().join('-') + ' ' + a.endTime);
                const dateB = new Date(b.date.split('/').reverse().join('-') + ' ' + b.endTime);
                return dateA - dateB;
              });
              
              // console.log("Sorted dbData:", dbData);
              

              dbData.forEach((item) => {
                count = count + 1;
              
                const Plan = {
                  id: count,
                  date: item.date,
                  startTime: `${item.startTime.substring(0, 5).replace(':', '.')} น.`,
                  endTime: `${item.endTime.substring(0, 5).replace(':', '.')} น.`,
                  activity: item.activity
                };
              
                const currentDate = new Date();

                const day = currentDate.getDate().toString().padStart(2, '0');
                const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
                const year = currentDate.getFullYear();
                
                const formattedDate = `${day}/${month}/${year}`;
              
                const itemDate = new Date(item.date.split('/').reverse().join('-'));
                
              
                const isTomorrow = itemDate.getDate() === currentDate.getDate() + 1 &&
                                   itemDate.getMonth() === currentDate.getMonth() &&
                                   itemDate.getFullYear() === currentDate.getFullYear();
              
                const isCurrentDate = itemDate.getDate() === currentDate.getDate() &&
                                      itemDate.getMonth() === currentDate.getMonth() &&
                                      itemDate.getFullYear() === currentDate.getFullYear();
              
              
              
              const convertedDate1 = new Date(formattedDate.split('/').reverse().join('-'));
              const convertedDate2 = new Date(item.date.split('/').reverse().join('-'));

              let isCurrentTime = parseFloat(`${new Date().getHours().toString().padStart(2, '0')}.${new Date().getMinutes().toString().padStart(2, '0')} `)
              let isTime = parseFloat(`${item.endTime.substring(0, 5).replace(':', '.')}`)
              // console.log("Time: ", isCurrentTime,isTime);
              

              if (isCurrentDate) {
                if (isCurrentTime < isTime) {
                  // console.log("End",item.activity,isCurrentTime,isTime)
                
                  // console.log("ITEm",item)
                closestPlan = Plan;


                PlanToAdd.push(closestPlan);
                }
              } else if ( convertedDate1.getTime() < convertedDate2.getTime())  {
                

                // console.log("DATee: ", formattedDate , item.date);

                closestPlan = Plan;


                PlanToAdd.push(closestPlan);
              }

            
            // console.log("Use: ",PlanToAdd)

            });
    
              setSchedule(PlanToAdd[0]);
            } else {
              setMessage(resdata.error);
            }
          }
        }  catch (error) {
          console.error('Error fetching data:', error);
          setMessage('');
        }
      }
    
        fetchData();
      }, []);
    
    
    
  return (
    <div>
      
      <CompNavbar/>
        
        <div className=' bg-[url("/bg1.png")] overflow-auto bg-cover bg-no-repeat absolute z-[-1] top-0 left-0 w-full h-full bg-center   '>
            <div className='relative'>
                <div className='absolute top-[100px] left-1/2 transform -translate-x-1/2 z-0'>
                    <div className='bg-[#5A985E] mx-auto max-w-[500px] sm:max-w-[350px] py-[100px] rounded-[50px]'></div>
                </div>
            </div>

            <div className='  px-10 mx-auto md:w-[800px] lg:w-[1300px] '>
            <div className='left-0 md:ml-[50px] lg:ml-[90px] flex items-center md:mt-[150px] mt-[120px]'>
              <div
              style={{ whiteSpace: 'nowrap' }}
              className='text-[#fff]  items-center  text-center text-[25px] md:text-[45px]  font-bold border-[#5A985E] bg-[#5A985E] px-10 rounded-[50px] md:py-2'
            >
              {NamePlanToAdd && NamePlanToAdd.activity ? (
                NamePlanToAdd.activity
              ) : (
                '-'
              )}            
              </div>

              </div>
              <div 
              className='text-[#fff] flex items-center  text-center text-[25px] md:text-[45px]  md:ml-[70px] lg:ml-[105px] ml-[10px] mt-[5px]  py-2'>
              <h5 style={{ whiteSpace: 'nowrap' }} className='text-[#5A985E] text-[12px] md:text-[20px]  mr-[10px] '>
              {NamePlanToAdd && NamePlanToAdd.activity ? (
                `${NamePlanToAdd.date}`
              ) : (
                '-'
              )}
              </h5>   
              <h5 style={{ whiteSpace: 'nowrap' }} className='text-[#5A985E] text-[12px] md:text-[20px]  '>
              {NamePlanToAdd && NamePlanToAdd.activity ? (
                `${NamePlanToAdd.startTime} - ${NamePlanToAdd.endTime}`
              ) : (
                '-'
              )}
              </h5>              
              </div>
              

              <div className=  {` text-[20px] md:text-[50px]  left-0 md:ml-[30px] lg:ml-[60px] ml-[-30px] flex items-center md:mt-[5px]`}>
                  <h1 className='text-[#5A985E]    mr-[10px] px-10  py-1 ' >  {`${language === 'EN' ? ' Meeting' : ' ห้อง'  }`} </h1>
              </div>
              <div className={` text-[20px] md:text-[50px] left-0 md:ml-[30px] lg:ml-[60px] ml-[-30px] flex items-center  mt-[-15px]`}>
                  <h1 className='text-[#5A985E]   mr-[10px] px-10  py-1 ' >{`${language === 'EN' ? ' Room' : ' ประชุม'  }`} </h1>
              </div>
            
              <div className='left-0 md:ml-[60px] lg:ml-[90px] flex items-center '>
                  <button onClick={openMeeting} className=  {` text-[15px] md:text-[23px] mt-[15px] text-[#fff] flex   border-[#5A985E] bg-[#5A985E] md:px-5 md:py-1 px-3 py-1 rounded-[50px] `} ><BsFillPeopleFill className= ' mr-3 mt-[6px]'  /> {t('Join')}</button>
              </div>

              <div>
                <Image src="/img/meeting.png" width={420} height={280} className="md:w-[420px] md:ml-[280px]  lg:ml-[350px] md:mt-[-180px] w-[220px] ml-[90px] mt-[-80px]" alt="Meeting Image" />
              </div>

            </div>
            
        </div>
    </div> 

    ) 
 }
 export default CompMeeting;
  