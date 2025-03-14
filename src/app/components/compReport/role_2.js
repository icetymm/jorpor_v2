'use client'
import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import Link from 'next/link';
import '../../globals.css';
import '@fontsource/mitr';
import { BsFillBarChartFill } from 'react-icons/bs';
import { FaHardHat, FaTshirt } from 'react-icons/fa';
import { BsShieldFillCheck } from 'react-icons/bs';
import { BsTextarea } from 'react-icons/bs';
import CompNavbarTec from '../compNavbar/role_2';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend , ResponsiveContainer} from 'recharts';
import { CompLanguageProvider, useLanguage } from '../compLanguageProvider_role_2';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n'; 
import { initReactI18next } from 'react-i18next';
import axios from 'axios';
import { TiWarning } from "react-icons/ti";

function CompReportresults2() {
  return (
    <CompLanguageProvider>
      <App />
    </CompLanguageProvider>
  );
}

function App() {
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();
  const localizer = momentLocalizer(moment);
  const [eventName, setEventName] = useState(''); // เพิ่ม eventName และ setEventName

  const [events, setEvents] = useState([]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [message, setMessage] = useState('');
  const [todoList, setTodoList] = useState([]);
  const [todoZone, setTodoZone] = useState([]);
  const [todoAll, setTodoAll] = useState([]);
  const [chartWidth, setChartWidth] = useState(600);
  const [chartHeight, setChartHeight] = useState(300);
  const [dataToday, setdataToday] = useState(true);
  const [id, setId] = useState('');

  useEffect(() => {
    const handleResize = () => {
      setChartWidth(window.innerWidth < 768 ? 300 : 600);
      setChartHeight(window.innerWidth < 768 ? 200 : 300);
      // console.log("WINDOWW: ", window.innerWidth);
    };

    // Attach the event listener when the component mounts
    window.addEventListener('resize', handleResize);

    // Initialize chartWidth and chartHeight based on window size
    setChartWidth(window.innerWidth < 768 ? 300 : 600);
    setChartHeight(window.innerWidth < 768 ? 200 : 300);

    // Detach the event listener when the component is unmounted
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);  // The empty dependency array ensures that the effect runs only once when the component mounts


  useEffect(() => {

    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; 
    const year = currentDate.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    const storedId = localStorage.getItem('id');

    const fetchData = async () => {
      try {
        const AddData = { storedId, fetch_role_2 : true};
        const dataDetail = JSON.stringify(AddData);

        const response = await axios.post('/api/reportall', dataDetail, {
          headers: { 'Content-Type': 'application/json' },
        });

        const data = response.data;

        if (response.status === 200) {
          if (data.success === true) {
            for (const percentage of data.percent){
              if (percentage.currentDateA === formattedDate) {
                let allValuesAreEmptyArrays = true;

                Object.entries(percentage.data).forEach(([key, value]) => {

                  if (Array.isArray(value) && value.length === 0) {
                    setTodoZone(percentage.data)
                    setTodoAll(data.percent)

                  } else {
                    setTodoZone(percentage.data)
                    setTodoAll(data.percent)
                    allValuesAreEmptyArrays = false;
                  }
                });

                if (allValuesAreEmptyArrays) {
                  setdataToday(false)
                  setTodoAll(data.percent.reverse());
                }
              }

            }
            setTodoList(data.dbnotify_name);
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
    
  }, []); // โหลดข้อมูลเมื่อค่า state reloadData เปลี่ยนแปลง

    
  const colors = ["#38B6FF","#6699FF", "#5271FF",  "#6633FF","#6633CC", "#9966FF","#9999FF","#99CCFF"];
  const data = [];
  const Zone = []
  const currentDateT = new Date();
  const day = currentDateT.getDate();
  const month = currentDateT.getMonth() + 1; 
  const year = currentDateT.getFullYear();
  const formattedDateT = `${day}/${month}/${year}`;

  for (const day of todoAll) {
    const newDataItem = {
      name: day.currentDateA,
    };
    // อ่านค่า currentDateA
    const currentDateA = day.currentDateA;
  
    // อ่านค่า data
    const dataday = day.data;
 
    for (const key of Object.keys(dataday)) {
      const arrayData = dataday[key];
     
      for (const item of arrayData) {
        if (!Zone.includes(item.name)) {
          Zone.push(item.name);
        }     
          // ดึงค่า name และ percentageZone
          const name = item.name;
          const percentageZone = item.percentageZone;
        
       
        newDataItem[name] = percentageZone;
       
      }
    }
        data.push(newDataItem);
}

  
  return (
    <div>
      <CompNavbarTec />
      <div className='bg-[url("/bg1.png")] overflow-auto bg-cover bg-no-repeat absolute z-[-1] top-0 left-0 w-full h-full bg-center '>
        <div className='md:mt-[100px] mt-[80px] lg:flex mb-[50px] justify-center items-center  mx-auto w-full'>
          <div className=' lg:ml-[80px] lg:mt-[-45px] mx-auto'>
            <div className=''>
              
              {/** percen */}
            <div className={`mx-auto mb-[20px] ${!dataToday && ('justify-center')} flex items-center w-[350px] h-[120px] md:w-[600px] md:h-[160px] overflow-auto`}>
            <div className='justify-center  flex flex-row'>
              {/* {console.log("todoZone: ",todoZone)} */}
            {dataToday ? (
              todoZone && Object.values(todoZone).flat().map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center ml-[10px] text-center bg-[#9FD4A3] md:w-[138px] w-[108px] md:rounded-[30px] rounded-[20px] md:h-[122px] h-[80px] shadow-lg"
                >
                  <div className=''>
                    <p className='text-[#000] mt-[10px] text-[16px] md:text-[25px] font-bold'>{item.percentageZone} %</p>
                    <h2 className='text-[#000] py-1 text-[10px] md:text-[15px] md:w-[120px] w-[90px] whitespace-nowrap overflow-hidden overflow-ellipsis'>{item.name}</h2>
                  </div>
                </div>
              ))
            ) : (
              <div className='  mx-auto justify-center text-center  text-black'>
                <div className='p-2 px-6'>
                <TiWarning className='text-[30px] mx-auto text-[#5A985E]' />

                <h2 className=' py-1  text-[11px] md:text-[15px]'>{t("No information today")}</h2>
              </div>
              </div>

            )}

            </div>
          </div>


           
                </div>
              
              {/** chart */}
          <div className='text-black text-[12px]  mx-auto'>
            <div className="flex  overflow-auto mx-auto bg-[#fff] w-[330px] md:w-[630px] rounded-[20px] p-4">
              {data.map((entry, index) => (
                <div key={index} className='flex flex-col mr-4'>
                  <div className=' p-2 rounded-[10px]'>
                    {Object.entries(entry).map(([key, value]) => (
                      <p key={key}>
                        {key === 'name' && (
                          <span className='md:text-[14px]  text-[#5A985E] font-bold'>{value}</span>
                        )}
                      </p>
                    ))}
                  </div>
                  <div className='border rounded-[10px]'>
                    <ResponsiveContainer width={chartWidth} height={chartHeight}>
                      <BarChart
                        data={[entry]}
                        margin={{ top: 30, right: 30, left: -10, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {Object.keys(entry).slice(1).map((key, keyIndex) => (
                          <Bar key={key} dataKey={key} fill={colors[keyIndex % colors.length]} />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ))}
            </div>
            </div>
            </div>

              {/** overview */}
          <div className='mx-auto  lg:mt-[10px] md:mt-[50px] mt-[30px] justify-center '>
            <div className=' text-[12px] md:text-[20px] w-[300px]  lg:ml-[50px] h-[500px] md:h-[600px]  md:w-[587px] py-2 rounded-[20px]  md:py-4 bg-[#D9D9D9]  mx-auto shadow-lg'>
              <div className=' flex items-center bg-[#5A985E] w-[300px] md:w-[587px] md:h-[64px] mt-[-10px] h-[44px] rounded-t-[20px] md:mt-[-15px]'>
               <div className=' w-full '>
                <p className='flex  text-left md:text-[20px] text-[15px] py-2  ml-[10px] text-[#fff] items-center'><BsFillBarChartFill className = 'py-2 text-3xl md:text-4xl'/><span className='mt-[2px] text-[16px] md:text-[20px]'>{t('Overview')}</span></p>

               </div>
                </div>
                <div className='mx-auto w-[280px] md:w-[550px]   md:h-[500px]  h-[440px] text-black flex flex-col    bg-[#D9D9D9] md:rounded-[30px] rounded-[30px] mt-[10px] overflow-auto '>

                {todoList.key && Array.isArray(todoList.key) && todoList.key.map((item, index) => (
                  
                  <Link href={`/reportingResults_role_2?id=${item.id}`} key={index}>
                  <div className={'mx-auto mt-[8px] w-[250px] p-2 h-[100px] md:h-[120px] md:w-[500px] px-2 text-black flex-col bg-[#FFF] text-center rounded-[15px] '}>
                    {/* {console.log("TODOLIST: ",key)} */}
                    <div className='flex justify-center  h-[40px]  md:ml-[8px]  mt-[5px]'>
                      <p className='text-[#000] ml-[5px]  text-[12px] text-left md:text-[15px] w-[250px] md:w-[700px] break-words whitespace-pre-wrap'>
                      <span className='text-[#5A985E] font-bold'>{t('inspector')} : </span> {item.name}  <span className='text-gray-500'>{item.date} {t('N')}</span>
                      </p>
                    </div>
                    <div className="mt-[5px] border-t border-gray-300"></div>
                    <div className='flex  items-center justify-between'>
                    <div className='flex items-center pl-2 bg-[#F5F5F5]  whitespace-nowrap overflow-hidden overflow-ellipsis mt-[5px] md:mt-[10px] md:w-[470px] w-full md:ml-[5px]  h-[25px] md:h-[40px] rounded-[10px]'>
                    {/* {console.log("item.zone: ",item.zone.length)} */}
                    {item.zone.map((zoneItem, itemindex) => (
                      <div key={itemindex}>
                        {/* {console.log("ZONE: ", { zoneItem })} */}
                        <div className='flex '>
                          <p className='text-gray-300  text-[12px] ml-[5px]'>{zoneItem}</p>
                          {itemindex < item.zone.length - 1 && <p className='text-gray-300  text-[12px] ml-[5px]'>, </p>}
                        </div>
                      </div>
                    ))}

                    </div>


                  </div>
                  </div>
                  </Link>
                ))}
                </div>
              </div>
              
          </div>
        </div>
          
      </div>
      </div>
   
    
  );
}

export default CompReportresults2;
