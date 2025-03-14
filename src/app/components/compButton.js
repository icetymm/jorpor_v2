'use client';
import React, { useEffect, useState } from 'react';
import '@fontsource/mitr';
import { PiHandTapBold } from "react-icons/pi";
import axios from 'axios';
import '../globals.css'
// import { IP_ADDRESS } from './next.config';


export default function NotifyButton() {

  const [todolist, setTodoList] = useState('')
  const [selectedOption, setSelectedOption] = useState(null)
  const IPaddress = '192.168.7.237';


  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await axios.get('/api/button');

        if (response.status === 200) {
          const resdata = response.data;
          console.log('resdata:', resdata);
          setTodoList(resdata.dbexaminelist_name)
          setSelectedOption(resdata.dbexaminelist_name[0])

        } else {
          console.error('Failed to retrieve emergency notifications');
        }
      } catch (error) {
        console.error('Error fetching emergency notifications:', error);
      }
    };
    fetchData()
  }, [])

  const handleButtonClick = async () => {
    console.log('Button clicked!');

    // Get the current date and time
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString(undefined, { hour12: false, hour: '2-digit', minute: '2-digit' });
   
    try 
    {
      const requestData = {
        date: formattedDate,
        time: formattedTime,
        location: selectedOption.name // You can replace this with the actual location value
      };

      const data = { requestData, selectedOption, button: true };
      
      const response = await fetch(`http://localhost:3002/api/emergency_notify`, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log('requestData:', data);
      console.log('Response:', response);

      if (response.ok) {
        console.log('Emergency notification sent successfully!');
      } else {
        console.error('Failed to send emergency notification');
      }
    } catch (error) {
      console.error('Error sending emergency notification:', error);
    }
  };

  const handleDropdownChange = (event) => {
    // console.log("event.target.value: ",event.target.value)
    // const selectedValue = JSON.parse(event.target.value);
    const selectedValue = event.target.value;

    console.log("event.target.value: ", selectedValue)

    setSelectedOption(selectedValue); // เมื่อเลือกตัวเลือกใน Dropdown ให้อัปเดต state
  };

  return (
    <div className='bg-gray-200 overflow-auto bg-cover bg-no-repeat z-[-1] top-0 left-0 w-full h-full bg-center fixed'>
      <div className='absolute top-10 left-1/2 transform -translate-x-1/2 text-center mt-[50px] md:mt-[20px]'>
        <div className="text-[#000] md:text-5xl text-[30px]  w-[500px] md:w-[800px] ">Having an Emergency?</div>
        <div className="text-[#A6A6A6] md:text-3xl text-[20px] ">Choose a location.</div>
        <select
          className="left-0 w-[150px] mt-1 text-[13px] bg-white text-black border rounded-md px-4 py-1 outline-none overflow-hidden"
          // value={todolist ? todolist.user_id : ""}
          onChange={handleDropdownChange}
        >
          {/* {todolist.length > 0 && todolist.map((item, index) => (
            <option key={index} value={JSON.stringify(item)}>
              {item.name}
            </option>

          ))} */}
          {[...Array(5).keys()].map((index) => (
            <option key={index + 1} value={index + 1}>
              {index + 1}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-center md:mt-[50px] h-full ">
        <div className="w-[250px] h-[250px]  md:w-[450px] md:h-[450px]  rounded-full bg-[#FFD9D9] absolute z-[-2]"></div>
        <div className="w-[220px] h-[220px]  md:w-[370px] md:h-[370px]  rounded-full bg-[#FDB1B1] absolute z-[-1]"></div>
        <div onClick={handleButtonClick} className="w-[190px] h-[190px]  md:w-[290px] md:h-[290px]  rounded-full bg-[#F44040] relative cursor-pointer     hover:scale-105 active:scale-95">
          <button style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              <PiHandTapBold style={{ fontSize: '100px', color: '#fff' }} className=' cursor-pointer' />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
