'use client'
import Link from 'next/link'
import '@fontsource/ntr'
import '../globals.css'
import '@fontsource/mitr';
import { FiMenu } from 'react-icons/fi';
import { AiOutlineClose } from 'react-icons/ai';
import { BiPlus } from 'react-icons/bi';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import React, { useState, useEffect } from 'react'; 
import CompNavbar from './compNavbar';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function CompPlan() {
  const data = [
    { name: 'A', uv: 4000, pv: 2400, fv: 2400, amt: 2400 },
    { name: 'B', uv: 3000, pv: 1398, fv: 2400, amt: 2210 },
    { name: 'C', uv: 2000, pv: 9800, fv: 2400, amt: 2290 },
    // เพิ่มข้อมูลเพิ่มเติมตรงนี้
  ];

  const localizer = momentLocalizer(moment);
  const [eventName, setEventName] = useState(''); // เพิ่ม eventName และ setEventName

  const [events, setEvents] = useState([]);

  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePreviousDate = () => {
    const previousDate = new Date(currentDate);
    previousDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(previousDate);
  };
  
  const handleNextDate = () => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(nextDate);
  };
  
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const handleAddEvent = () => {
    if (eventName.trim() === '') {
      // ถ้า eventName ว่างเปล่า ให้ไม่ทำอะไร
      return;
    }
  
    if (eventName) {
      // รับวันและเวลาที่ผู้ใช้ตั้งค่าใน popup
      const startDateTime = new Date(); // ให้เริ่มต้นด้วยวันและเวลาปัจจุบัน
      const endDateTime = new Date(); // ให้สิ้นสุดด้วยวันและเวลาปัจจุบัน
  
      const day = startDateTime.getDate();
      const month = startDateTime.getMonth() + 1; // เดือนเริ่มที่ 0
      const year = startDateTime.getFullYear();
      const hours = startDateTime.getHours();
      const minutes = startDateTime.getMinutes();
      const seconds = startDateTime.getSeconds();
      
      console.log(`วันที่: ${day}/${month}/${year}`);
      console.log(`เวลา: ${hours}:${minutes}:${seconds}`);
      
            // คำนวณวันที่เริ่มต้นและสิ้นสุดจากข้อมูลวันที่ใน popup
      const dateInput = document.getElementById('dateInput').value;
      const timeInput = document.getElementById('timeInput').value;
  
      if (dateInput && timeInput) {
        const [year, month, day] = dateInput.split('-').map(Number);
        const [hour, minute] = timeInput.split(':').map(Number);
  
        startDateTime.setFullYear(year, month - 1, day);
        startDateTime.setHours(hour, minute, 0, 0);
  
        // สร้างเหตุการณ์ใหม่ด้วยชื่อที่ผู้ใช้ป้อนและวันเวลาที่กำหนด
        const newEvent = {
          title: eventName,
          start: startDateTime,
          end: endDateTime,
        };
        console.log("Test: ",newEvent)
  
        // อัปเดตรายการเหตุการณ์โดยเพิ่มเหตุการณ์ใหม่
        setEvents([...events, newEvent]);
  
        // ปิด Popup
        togglePopup();
      } else {
        alert('Please enter a valid date and time.'); // แจ้งเตือนให้ผู้ใช้ป้อนวันที่และเวลาที่ถูกต้อง
      }
    }
  };
 
  return (
    <div>
      
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 50 }}>
        <CompNavbar/>
      </div>
          <div className=' bg-[url("/bg1.png")] bg-cover bg-no-repeat  z-[-1] top-0 left-0 w-full h-full bg-center fixed  '>
            <div className='relative'>
              <div className='absolute top-[100px] left-1/2 transform -translate-x-1/2 z-0'>
                <div className='bg-[#5A985E] mx-auto max-w-[500px] sm:max-w-[350px] py-[100px] rounded-[50px]'></div>
              </div>
            </div>
          </div>
        <div className='md:w-[1500px] md:h-[700px] justify-center items-center mx-auto'>
          <div className='flex justify-center items-center mx-auto md:w-[1158px] md:h-[50px] md:mt-[70px] md:ml-[150px] mt-[70px] ml-[5px]'>
            {isOpen && (
              <div className='fixed inset-0 flex items-center justify-center z-50 font-ntr  '>
              <div className="bg-[#fff] font-ntr w-[300px] items-center md:w-[350px] mx-auto p-4 shadow-lg rounded-lg border border-solid border-black ">
                <h2 className="text-[30px] text-[#5A985E] font-bold">Add Plan</h2>
                <input
                  type="text"
                  className=' text-black rounded-[10px] mt-[5px] pl-[15px] w-[250px] h-[29px] md:text-[20px] md:w-[300px] md:h-[40px] bg-[#F5F5F5]'
                  placeholder="Enter event name" // เพิ่ม placeholder เพื่อให้ผู้ใช้รู้ว่าควรป้อนชื่อเหตุการณ์ที่นี่
                  value={eventName} // ใช้ค่า eventName ที่คุณเก็บไว้ในสถานะ
                  onChange={(e) => setEventName(e.target.value)} // เมื่อมีการเปลี่ยนแปลงใน input ให้อัปเดตค่า eventName
                />

                <h2 className="text-[20px] text-gray-400 font-ntr">start</h2>
                <input type="date"id="dateInput"className='text-black rounded-[10px] text-grey pl-[15px] w-[140px]  ml-[2px] h-[29px] md:text-[20px] md:w-[150px] md:h-[40px] bg-[#F5F5F5] mt-1'/>
                <input type="time" id="timeInput"className='text-black rounded-[10px] pl-[15px] w-[115px] h-[29px] md:text-[20px] md:w-[150px] md:h-[40px] bg-[#F5F5F5] mt-1 ml-[5px]'/>

                <h2 className="text-[20px] text-gray-400 ">end</h2>
                <input type="date"id="dateInput"className='text-black rounded-[10px] pl-[15px] w-[140px] ml-[2px] h-[29px] md:text-[20px] md:w-[150px] md:h-[40px] bg-[#F5F5F5] mt-1'/>
                <input type="time" id="timeInput"className='text-black  rounded-[10px] pl-[15px] w-[115px] h-[29px] md:text-[20px] md:w-[150px] md:h-[40px] bg-[#F5F5F5] mt-1 ml-[5px]'/>

                <div className="flex justify-center mt-[10px]">
                  <button className="flex justify-center items-center bg-[#93DD79]  px-4 py-2 ml-[5px] rounded hover:bg-blue-600" onClick={handleAddEvent}>Add</button>
                  <button className="flex justify-center  items-center bg-[#FF6B6B]  px-4 py-2 ml-[10px] rounded hover:bg-red-600" onClick={() => setIsOpen(false)}>Cancel</button>
                </div>
              </div>
            </div>
            )}
            <div className=' w-[350px]  md:w-[1150px]'>
              <button className="flex items-center  bg-[#93DD79]  rounded-[10px]  ml-[270px] md:ml-[1070px] text-white px-4 py-2  hover:bg-blue-600" onClick={togglePopup}>New<BiPlus/></button>
            </div>
          </div>
          <div className=' w-[350px] mx-auto flex flex-col mt-[20px]  rounded-[30px] md:rounded-[50px] md:ml-[150px] md:w-[1150px] md:mt-[10px] '>
            <div className="bg-white p-4 shadow-lg rounded-lg text-[15px] md:text-[20px] font-ntr text-sm ">
              <h1 className="  text-[#5A985E] text-[20px]  font-bold text-center md:text-[30px] font-ntr mb-4 ">Appointment Calendar</h1>
              <BigCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }} 
                className ='text-black '
              />  
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Bar Chart</h3>
                  <BarChart width={400} height={300} data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="uv" fill="#38B6FF" />
                    <Bar dataKey="pv" fill="#5271FF" />
                    <Bar dataKey="fv" fill="#8C52FF" />

                  </BarChart>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Line Chart</h3>
                  <LineChart width={400} height={300} data={data}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
                    <Line type="monotone" dataKey="uv" stroke="#38B6FF" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="pv" stroke="#5271FF" activeDot={{ r: 2 }} />
                    <Line type="monotone" dataKey="fv" stroke="#8C52FF" activeDot={{ r: 5 }} />

                    <Tooltip />
                    <Legend />
                  </LineChart>
                </div>
              
            </div>
          </div>
        </div>
      </div>
    

        
  
    
  )
}