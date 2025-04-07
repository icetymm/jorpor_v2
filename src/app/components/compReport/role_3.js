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
import CompNavbarTec from '../compNavbar/role_3';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend , ResponsiveContainer} from 'recharts';
import { CompLanguageProvider, useLanguage } from '../compLanguageProvider_role_3';
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
//   const chartRef = useRef(null);
//   const [percentage, setPercentage] = useState(0);

  

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

  useEffect(() => {
    const handleResize = () => {
      setChartWidth(window.innerWidth < 768 ? 350 : 600);
      setChartHeight(window.innerWidth < 768 ? 200 : 300);
      // console.log("WINDOWW: ", window.innerWidth);
    };

    // Attach the event listener when the component mounts
    window.addEventListener('resize', handleResize);

    // Initialize chartWidth and chartHeight based on window size
    setChartWidth(window.innerWidth < 768 ? 350 : 600);
    setChartHeight(window.innerWidth < 768 ? 200 : 300);

    // Detach the event listener when the component is unmounted
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  useEffect(() => {

    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; 
    const year = currentDate.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    // ใน useEffect นี้คุณสามารถใช้ Axios เพื่อดึงข้อมูลจากฐานข้อมูล
    const storedId = localStorage.getItem('id');

    const fetchData = async () => {
      try {
        const AddData = { storedId, fetch_role_3 : true};
        const dataDetail = JSON.stringify(AddData);
        // console.log("send: ",dataDetail)

        const response = await axios.post('/api/reportall', dataDetail, {
          headers: { 'Content-Type': 'application/json' },
        });

        // const response = await axios.get('/api/notify'); // แทน '/api/examine' ด้วยเส้นทางที่ถูกต้องไปยัง API ของคุณ
        const data = response.data;

        if (response.status === 200) {
          if (data.success === true) {
            // console.log("DATA: ",data)
            for (const percentage of data.percent){
              // console.log("percentage: ",percentage)
              if (percentage.currentDateA === formattedDate) {
                // console.log("datatoday: ",percentage.data)
                let allValuesAreEmptyArrays = true;

                Object.entries(percentage.data).forEach(([key, value]) => {
                  if (Array.isArray(value) && value.length === 0) {
                    // console.log(`Length of key ${key}: ${value.length}`);
                    setTodoZone(percentage.data)
                    setTodoAll(data.percent)

                  } else {
                    setTodoZone(percentage.data)
                    setTodoAll(data.percent)
                    allValuesAreEmptyArrays = false;
                    // console.log("datatoday222: ",percentage.data)

                  }
                });

                if (allValuesAreEmptyArrays) {
                  setdataToday(false)
                  setTodoAll(data.percent.reverse());

                  // console.log("ไม่มีข้อมูล");

                }

                
                // console.log("************",hasArrayWithZeroLength);

              }

            }
           

            // const groupedData = [];

            // // วนลูป Array เพื่อจัดกลุ่ม
            // data.dbnotify_name.forEach(item => {
            //   const inspector  = item.inspector;

            //   // ถ้ายังไม่มี key นี้ใน Object groupedData ให้สร้าง key ใหม่
            //   if (!groupedData[inspector]) {
            //     groupedData[inspector] = [];
            //   }

            //   // เพิ่มข้อมูลลงในกลุ่มที่เป็น key เดียวกัน
            //   groupedData[inspector].push(item);
            // });

            // // แสดงผลลัพธ์
            // console.log("resultGroup",groupedData);
            setTodoList(data.dbnotify_name);
            // const notifyData = data.responseResult.map(item => ({
            //   id: item.id,
            //   title: item.title,
            //   date: item.date,
            //   Verification_status: item.Verification_status
            // }));
            // setTodoList(notifyData.reverse());
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
  
    const currentDateA = day.currentDateA;
    const dataday = day.data;
    // console.log("DatacurrentDateA:", day.data);
  
    let length = 0;
  
    for (const key in day.data) {
      const arrayData = day.data[key];
      // console.log("Item******************:", key);

      // ทำตามที่ต้องการกับข้อมูลใน arrayData
      for (const item of arrayData) {
        const currentKey = Object.keys(item)[0];
    
        let name = item.name;
        let newName = name;
        
        // ตรวจสอบว่า name ซ้ำหรือไม่
        if (name in newDataItem) {
          let count = 1;
          newName = `${name}${count}`;
          
          // หาชื่อที่ไม่ซ้ำใน newDataItem
          while (newName in newDataItem) {
            count++;
            newName = `${name}${count}`;
          }
    
          // เพิ่มเฉพาะกรณีที่ไม่ซ้ำกับ Zone
          
        }
    
        name = newName;
        // ดึงค่า name และ percentageZone
        const percentageZone = item.percentageZone;
    
        // console.log(name,':', percentageZone);
        // console.log("Percentage Zone:", percentageZone);
        
        newDataItem[name] = percentageZone;
        if (!Zone.includes(name)) {
          Zone.push(name);
        }
      }
    }
    
  
    data.push(newDataItem);
    // console.log("percentage Data:", data);
    // console.log("Zone Data:", Zone);

  }
  
  return (
    <div>
      <CompNavbarTec />
      <div className='bg-[url("/bg1.png")] overflow-auto bg-cover bg-no-repeat absolute z-[-1] top-0 left-0 w-full h-full bg-center '>
      <div className='md:mt-[100px] mt-[80px] lg:flex mb-[50px] justify-center items-center    mx-auto md:w-[800px]  lg:w-[1000px]'>
          <div className=' lg:ml-[80px]  lg:mt-[-45px] mx-auto'>
            <div className=''>
              
            <div className={`mx-auto mb-[20px] ${!dataToday && ('justify-center')} flex items-center w-[350px] h-[120px] md:w-[600px] md:h-[160px] overflow-auto`}>
            <div className='justify-center  flex flex-row '>
            {dataToday ? (
              todoZone && Object.values(todoZone).flat().map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center ml-[10px] text-center bg-[#9FD4A3] md:w-[138px] w-[108px] md:rounded-[30px] rounded-[20px] md:h-[122px] h-[80px] shadow-lg"
                >
                  <div className=''>
                    <p className='text-[#000] mt-[10px] text-[16px] md:text-[25px] font-bold'>{item.percentageZone} %</p>
                    <h2 className='text-[#000] py-1 text-[10px] md:text-[15px]'>{item.name}</h2>
                  </div>
                </div>
              ))
            ) : (
              <div className=' rounded-[20px] justify-center text-center  text-black'>
                <div className='p-2 px-6'>
                <TiWarning className='text-[30px] mx-auto text-[#5A985E]' />

                <h2 className=' py-1  text-[11px] md:text-[15px]'>{t("No information today")}</h2>
              </div>
              </div>

            )}

            </div>
          </div>


              
              {/* <div className=' mx-auto   md:mt-[20px] flex-col items-center justify-center'>
              <div className=' flex mb-[20px] mx-auto justify-center mt-[20px] md:w-[591px] w-[370px] rounded-[30px] md:rounded-[50px] md:mt-[10px] '>
              <ResponsiveContainer width={chartWidth} height={chartHeight}>
                <LineChart
                  // width={300}
                  // height={200}
                  // data={data}
                  // margin={{ top: 30, right: 30, left: 20, bottom: 5 }}
                  // radius={[20]}
                  // style={{ backgroundColor: '#fff', borderRadius: '20px' }}
                   data={data}  margin={{ top: 30, right: 30, left: 20, bottom: 5 }} radius={[20]} className=' bg-[#ffffff] rounded-[20px] text-[12px] '
                >
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
                  {todoZone &&
                    Object.values(todoZone).flat().map((item, index) => (                    
                    <Line
                      key={index}
                      type="monotone"
                      dataKey={item.name}
                      stroke={colors[index % colors.length]}
                      activeDot={{ r: 8 }}
                    />
                  ))}
                  <Tooltip contentStyle={{ fontSize: 12 }} />
                  <Legend />
                </LineChart>
                </ResponsiveContainer> */}

                 {/* <ResponsiveContainer width="100%" height={300}>
                          <LineChart
                            data={data}
                            margin={{ top: 30, right: 30, left: 20, bottom: 5 }}
                            radius={[20]}
                            className=' bg-[#fff] rounded-[20px]'
                          >
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                            <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
                            <Line type="monotone" dataKey= "aa" stroke="#38B6FF" activeDot={{ r: 8 }} /> */}

                {/* {data.map((item, index) => (
                  <div key={index} className='text-black'>
                      {console.log("data.data....: ",item)} */}
                    {/* <h3>Date: {item.date}</h3> */}
                    {/* <div> */}
                      {/* {item.data.map((dataItem, dataIndex) => (
                        <div key={dataIndex}>
                            {console.log("dataItem: ",dataItem.name)}

                            <Line type="monotone" dataKey= {dataItem.name} stroke="#38B6FF" activeDot={{ r: 8 }} />

                          <p>Name: {dataItem.name}</p>
                          <p>Percentage Zone: {dataItem.percentageZone}</p>
                        </div>
                      ))} */}
                    {/* </div>
                  </div>
                ))} */}
                {/* <Tooltip contentStyle={{ fontSize: 12 }} />
                            <Legend />
                          </LineChart>
                        </ResponsiveContainer> */}
                
              {/* </div> */}
              {/* <div className=' flex mb-[50px]  mx-auto justify-center  mt-[10px] md:w-[591px] w-[370px] rounded-[30px] md:rounded-[50px] md:mt-[10px] '>
              <ResponsiveContainer width={chartWidth} height={chartHeight}>

                  <BarChart  data={data}  margin={{ top: 30, right: 30, left: 20, bottom: 5 }} radius={[20]} className=' bg-[#fff] rounded-[20px] text-[12px] '>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }}/>
                    <Tooltip />
                    <Legend />
                    {todoZone &&
                    Object.values(todoZone).flat().map((item, index) => (   
                    <Bar 
                    dataKey={item.name}
                    fill={colors[index % colors.length]} 
                    />
                  
                    ))}
                  </BarChart>
                </ResponsiveContainer>

                </div>
               */}
                {/* </div> */}

                </div>
                {/* const data = [
                { name: 'วันที่', A: 10, B: 24, C: 24, D: 24, amt: 24 },
                { name: 'วันที่', A: 30, B: 13, C: 24,D: 24, amt: 22 },
                { name: 'การแต่งกาย', A: 20, B: 98, C: 24,D: 24, amt: 22 },
                { name: 'ถังดับเพลิง', A: 20, B: 98, C: 24, amt: 22 },

                // เพิ่มข้อมูลเพิ่มเติมตรงนี้
              ]; */}
                {/* {console.log("data.data: ",data)}
                <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={data.data}
                  margin={{ top: 30, right: 30, left: 20, bottom: 5 }}
                  radius={[20]}
                  className=' bg-[#fff] rounded-[20px]'
                >
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                  <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="A" stroke="#38B6FF" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="B" stroke="#5271FF" activeDot={{ r: 2 }} />
                  <Line type="monotone" dataKey="C" stroke="#8C52FF" activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="D" stroke="#8C52FF" activeDot={{ r: 5 }} />
                  <Tooltip contentStyle={{ fontSize: 12 }} />
                  <Legend />
                </LineChart>
              </ResponsiveContainer>
              </div>

             
                </div> */}
              
            {/* <div className='justify-center items-center mx-auto text-center md:w-[650px] h-[170px] md:h-[250px] md:mt-[20px] mt-[10px] rounded-[30px] bg-[#fff] shadow-lg'>
              <canvas ref={chartRef} className='mx-auto md:h-[250px] h-[170px] ' id="myChart"></canvas>
            </div>
            <div className='justify-center items-center mx-auto text-center  md:w-[650px] md:mt-[10px] md:h-[250px] mt-[10px] rounded-[30px] bg-[#fff] shadow-lg'>
              <canvas ref={chartRef} className='mx-auto md:h-[250px] h-[170px]' id="lineChart"></canvas>
            </div> */}

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



            <div className='mx-auto  lg:mt-[10px] md:mt-[50px] mt-[30px] justify-center '>
            <div className=' text-[12px] md:text-[20px] w-[300px]  lg:ml-[50px] h-[500px] md:h-[600px]  md:w-[587px] py-2 rounded-[20px]  md:py-4 bg-[#D9D9D9]  mx-auto shadow-lg'>
              <div className=' flex items-center bg-[#5A985E] w-[300px] md:w-[587px] md:h-[64px] mt-[-10px] h-[44px] rounded-t-[20px] md:mt-[-15px]'>
               <div className=' w-full '>
                <p className='flex  text-left md:text-[20px] text-[15px] py-2  ml-[10px] text-[#fff] items-center'><BsFillBarChartFill className = 'py-2 text-3xl md:text-4xl'/><span className='mt-[2px] text-[16px] md:text-[20px]'>{t('Overview')}</span></p>

               </div>
                </div>
                <div className='mx-auto w-[280px] md:w-[550px]   md:h-[500px]  h-[440px] text-black flex flex-col    bg-[#D9D9D9] md:rounded-[30px] rounded-[30px] mt-[10px] overflow-auto '>

                {todoList.key && Array.isArray(todoList.key) && todoList.key.map((item, index) => (
                  
                  <Link href={`/reportingResults_role_3?id=${item.id}`} key={index}>
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
