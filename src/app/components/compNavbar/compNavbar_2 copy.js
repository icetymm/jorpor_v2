'use client'
import React, { useState } from 'react';
import Link from 'next/link'
import '@fontsource/ntr'
import '@fontsource/mitr';
import {FiMenu} from 'react-icons/fi';
import {AiOutlineClose} from 'react-icons/ai';

function CompNavbarTec() {
    const [toggle, setToggle] = useState(false);
  return (
  
        <div className='w-full bg-[#5A985E] fixed top-0 left-0 ' >
          <div className='container mx-auto flex justify-between  items-center py-2 px-4  w-screen font-ntr '>
            <div className='text-[#fff] font-bold text-[24px]' >
                <span>JorPor</span>
                </div>
              {/*Navbar  */}
            <div className='hidden md:flex tracking-wider text-white font-ntr'>
                <Link href="/ReportRow2" className=' text-[20px] px-5 py-1 rounded-md text-[#fff] hover:text-[#5A985E] hover:bg-[#fff]  '>Report results</Link>
                <Link href="/Approve" className=' text-[20px] px-5 py-1 rounded-md text-[#fff] hover:text-[#5A985E] hover:bg-[#fff]  '>Approve</Link>
                <Link href="/PlanRow2" className=' text-[20px] px-5 py-1 rounded-md text-[#fff] hover:text-[#5A985E] hover:bg-[#fff]  '>Plan</Link>
                <Link href="MeetingTec/" className=' text-[20px] px-5 py-1 rounded-md text-[#fff] hover:text-[#5A985E] hover:bg-[#fff]  '>Meeting</Link>
                <Link href="/" className=' text-[20px] px-5 py-1 rounded-md text-[#fff] hover:text-[#5A985E] hover:bg-[#fff]  '>Profile</Link>
                </div >
            <div className='hidden md:flex text-white font-ntr '>
                <Link href="/" className=' text-[20px] px-4 py-1 rounded-md text-[#fff] hover:text-[#5A985E] hover:bg-[#fff]  '>log out</Link>
                </div>

            {toggle ? (
              <AiOutlineClose onClick={()=>setToggle(!toggle)} size={30} className='md:hidden block text-white'/> 
            ) : (
              <FiMenu onClick={()=>setToggle(!toggle)} size={25} className='md:hidden block text-white'/>
            )}
            </div>

            <div className={`font-ntr duration-300 md:hidden flex flex-col w-[40%] h-screen fixed bg-[#80A582] ${toggle ? `left-[0]` : `left-[-100%]`}`}>
                <Link href="/ReportTec" className=' mt-[15px] text-[20px] px-4 py-2 rounded-md text-[#fff] hover:text-[#5A985E] hover:bg-[#fff]  '>Report results</Link>
                <Link href="/Approve" className=' text-[20px] px-4 py-2 rounded-md text-[#fff] hover:text-[#5A985E] hover:bg-[#fff]  '>Approve</Link>
                <Link href="/PlanTec" className=' text-[20px] px-4 py-2 rounded-md text-[#fff] hover:text-[#5A985E] hover:bg-[#fff]  '>Plan</Link>
                <Link href="/MeetingTec" className=' text-[20px] px-4 py-2 rounded-md text-[#fff] hover:text-[#5A985E] hover:bg-[#fff]  '>Meeting</Link>
                <Link href="/" className=' text-[20px] px-4 py-2 rounded-md text-[#fff] hover:text-[#5A985E] hover:bg-[#fff]  '>Profile</Link>
                
                <Link href="/" className=' text-[20px] px-4 py-2 rounded-md text-[#fff] hover:text-[#5A985E] hover:bg-[#fff]  '>log out</Link>
            </div>
        {/*Navbar  */}
        </div>

    ) 
 }
 export default CompNavbarTec;
  