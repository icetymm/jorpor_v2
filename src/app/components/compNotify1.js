'use client'
import React, { useState ,useEffect} from 'react';
import '@fontsource/ntr'
import '../globals.css'
import '@fontsource/mitr';
import CompNavbar from './compNavbar';
import axios from 'axios';

export default function CompNotify() {
    const [confirmedData, setConfirmedData] = useState(null);
    const [formData, setFormData] = useState({
      title: '',
      employee: '',
      location: '',
      work_owner: '',
      status: '',
      date: '',
      file: '',
      detail: '',
  });

  const [recheck, setrecheck] = useState(false);


  useEffect(() => {
    const storedConfirmedData = localStorage.getItem('confirmedData');
    if (storedConfirmedData) {
      setConfirmedData(JSON.parse(storedConfirmedData));
      setrecheck(true);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

  };
  const [notifyMessage, setnotifyMessage] = useState('');
  const [message, setMessage] = useState('');


  const handleSubmit = async () => {
  
    
    try {
      const requestData = {
        ...formData,
      };
  
      console.log('Submitted Data:', requestData);
      
      const data = JSON.stringify(requestData);
      
      const response = await axios.post('/api/notify', { //ส่ง api 
        data
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      const resdata = response.data; 

      console.log("RESDATA: ",resdata)
      console.log("response.status: ",response.status);
      console.log("response.error: ",resdata.error);

      if (response.status === 200) {
        const resdata = response.data;
    
        if (resdata.success === true) {
          setnotifyMessage('');
          localStorage.removeItem('confirmedData');
            window.location.href = resdata.redirect;
        } else {
          setnotifyMessage(resdata.error);
          setMessage('');

        }
      } else {
        setnotifyMessage(resdata.error);
        setMessage('');

      }
    } catch (error) {
      console.error('Error registering: ', error);
      setnotifyMessage(error);
      setMessage('');

    } 
  
  }

  const handleConfirm = () => {
    if (!formData.title || !formData.employee || !formData.location || !formData.work_owner || !formData.status || !formData.date || !formData.file || !formData.detail) {
      setMessage('Please fill in all fields');
      setnotifyMessage('');
      return;
    }
  
    setConfirmedData(formData);
    setrecheck(true);
    localStorage.setItem('confirmedData', JSON.stringify(formData)); // เก็บข้อมูลใน localStorage
  };
  
    
  return (
    <div>
      
      <CompNavbar/>
        
      <div className=' bg-[url("/bg1.png")]  overflow-auto bg-cover bg-no-repeat absolute z-[-1] top-0 left-0 w-full h-full bg-center '>
        <div className='md:w-[1000px] mx-auto '>
          <div className='absolute top-[100px] left-1/2 transform -translate-x-1/2 z-0'>
             <div className='bg-[#5A985E] mx-auto max-w-[500px] sm:max-w-[350px] py-[100px] rounded-[50px]'></div>
          </div>

          <div className='mx-auto w-[300px] md:w-[800px] font-ntr mb-[50px]  py-[30px] text-black flex flex-col  bg-[#FFF] text-center md:rounded-[50px] rounded-[30px] mt-[106px]  '>
          
            
          <form onSubmit={!recheck ? handleConfirm : handleSubmit}>
                <div className='md:mt-[30px]'>
              {!recheck ? (
                <div className=' items-center md:px-10  '>
                  <input type="text" name="title" value={formData.title} onChange={handleInputChange} className='rounded-[10px] p-4 mt-[5px] ml-[-70px]  w-[180px] h-[29px] md:ml-[-160px]   md:text-[18px] text-[15px] items-center md:w-[560px] md:h-[40px] bg-[#F5F5F5]  '/>
                </div>
                ) :(
                <div className=' md:text-[20px] ml-[30px] text-[15px] md:w-[500px] md:ml-[40px] text-left '>
                    <p>{confirmedData.title}</p>
                </div>
                  )}

                <div className="mt-[10px] border-t border-gray-300"></div> 
              </div>

              <div className='font-ntr px-2 flex items-center mx-auto w-[250px]  md:ml-[40px] md:w-[720px]  py-[20px] text-black bg-[#F5F5F5] text-center mt-[15px] rounded-[20px]'>
                <div className='  font-ntr text-sm md:text-[18px]  rounded-[10px] w-[235px] md:w-[600px] py-2 md:py-4 bg-[#F5F5F5] ml-[5px] md:ml-[40px]'>
                {!recheck ? (   
                    <div className='flex px-3 '>
                        <p className='text-[#000] text-left   w-[75px]  ml-[-1px] md:w-[100px] md:ml-[-11px]'>Employee</p>
                        <p>:</p>
                        <input type="text" name="employee" value={formData.employee} onChange={handleInputChange} className='rounded-[2px] text-[14px] items-center p-2 mt-[-2px] md:ml-[15px] ml-[10px] w-[100px] h-[20px] md:text-[17px]  md:w-[200px] md:h-[20px] bg-[#D9D9D9] '/>
                    </div>
                     ) :(
                    <div className='flex px-3 '>
                        <p className='text-[#000] text-left   w-[75px]  ml-[-1px] md:w-[100px] md:ml-[-11px]'>Employee</p>
                        <p>:</p>
                        <p className='md:ml-[15px] ml-[10px]'>{confirmedData.employee}</p>
                    </div>
                   
                      )}
                 {!recheck ? (   
                    <div className='flex px-3  mt-[5px]'>
                        <p className='text-[#000] text-left   w-[75px]  ml-[-1px] md:w-[100px] md:ml-[-11px]'>Location</p>
                        <p>:</p>
                        <input type="text" name="location" value={formData.location} onChange={handleInputChange} className='rounded-[2px] text-[14px] items-center p-2 mt-[-2px] md:ml-[15px] ml-[10px] w-[100px] h-[20px] md:text-[17px]  md:w-[200px] md:h-[20px] bg-[#D9D9D9]  '/>
                    </div>
                    ) :(
                    <div className='flex px-3  mt-[5px]'>
                      <p className='text-[#000] text-left   w-[75px]  ml-[-1px] md:w-[100px] md:ml-[-11px]'>Location</p>
                      <p>:</p>    
                      <p className='md:ml-[15px] ml-[10px]'>{confirmedData.location}</p>
                    </div>
                 
                      )}
                    {!recheck ? (
                    <div className='flex px-3  mt-[5px]'>
                        <p className='text-[#000] text-left  w-[75px]  ml-[-1px] md:w-[100px] md:ml-[-11px]'>Work Owner </p>
                        <p>:</p>
                        <input type="text" name="work_owner" value={formData.work_owner} onChange={handleInputChange} className='rounded-[2px] text-[14px] items-center p-2 mt-[-2px] ml-[10px] md:ml-[15px] w-[100px] h-[20px] md:text-[17px] md:w-[200px] md:h-[20px] bg-[#D9D9D9]  '/>
                    </div>
                    ) :(
                      <div className='flex px-3  mt-[5px]'>
                        <p className='text-[#000] text-left  w-[75px]  ml-[-1px] md:w-[100px] md:ml-[-11px]'>Work Owner </p>
                        <p>:</p>
                        <p className='md:ml-[15px] ml-[10px]'>{confirmedData.work_owner}</p>
                    </div>
                 
                      )}
                    {!recheck ? (
                    <div className='flex px-3 mt-[5px]'>
                        <p className='text-[#000] text-left   w-[75px]  ml-[-1px] md:w-[100px] md:ml-[-11px]'>Status</p>
                        <p>:</p>
                        <select id="dropdown" name="status"  value={formData.status} onChange={handleInputChange} className='rounded-[2px] text-[14px] items-center md:ml-[15px] pl-1 mt-[-2px] ml-[10px] w-[100px] h-[20px] md:text-[17px] md:w-[200px] md:h-[20px] bg-[#D9D9D9]  ' >
                              <option >Select an option</option>
                              <option value="Safety Officer Supervisory level">Supervisory level</option>
                              <option value="Safety Officer Technical level">Technical level</option>
                              <option value="Safety Officer Supervisory level">Supervisory level</option>
                        </select>
                    </div>
                    ) :(
                      <div className='flex px-3 mt-[5px]'>
                        <p className='text-[#000] text-left   w-[75px]  ml-[-1px] md:w-[100px] md:ml-[-11px]'>Status</p>
                        <p>:</p>
                        <p className='md:ml-[15px] text-left md:w-[350px] w-[120px] ml-[10px]'>{confirmedData.status}</p>
                    </div>
                 
                      )}
                    {!recheck ? (
                    <div className='flex px-3  mt-[5px]'>
                        <p className='text-[#000] text-left   w-[75px]  ml-[-1px] md:w-[100px] md:ml-[-11px]'>Date</p>
                        <p>:</p>
                        <input type="date"  name="date" value={formData.date} onChange={handleInputChange}  className='rounded-[2px] text-[14px] items-center mt-[-2px] md:ml-[15px] pl-2 ml-[10px] w-[100px] h-[20px] md:text-[17px] md:w-[200px] md:h-[20px] bg-[#D9D9D9]  '/>
                    </div>
                    ) :(
                      <div className='flex px-3  mt-[5px]'>
                        <p className='text-[#000] text-left   w-[75px]  ml-[-1px] md:w-[100px] md:ml-[-11px]'>Date</p>
                        <p>:</p>
                        <p className='md:ml-[15px] ml-[10px]'>{confirmedData.date}</p>
                    </div>
                      )}
                    </div>
                </div>

                {!recheck ? (
                <div>
                  <p className='text-[#808080] text-[13px] md:text-[16px] font-mitr md:mt-[20px] md:ml-[-660px] ml-[-185px] mt-[10px] '>ไฟล์แนบ</p>
                  <input type="file" name="file" value={formData.file} onChange={handleInputChange} className="w-[248px]  md:w-[710px] py-1 px-2 border ml-[0px] mt-[5px] md:mt-[5px] md:ml-[-25px] border-gray-300  p-4 rounded-lg "></input>
                </div>
                ) :(
                  <div>
                    <p className='text-[#808080] text-[13px] md:text-[16px] font-mitr md:mt-[20px] md:ml-[-660px] ml-[-185px] mt-[10px] '>ไฟล์แนบ</p>
                    <input type="file" placeholder={confirmedData.file} className="w-[248px] md:w-[710px] py-1 px-2 border ml-[0px] mt-[5px] md:mt-[10px] md:ml-[-25px] border-gray-300  p-4 rounded-lg "></input>
                  </div>
                  )}

                {!recheck ? (
                <div>
                    <p className='font-mitr text-[#808080] text-[13px] md:text-[16px] ml-[-170px] md:ml-[-640px] mt-[20px]  md:mt-[15px]'>รายละเอียด</p>
                    <input type="text" name="detail" value={formData.detail} onChange={handleInputChange} className='rounded-[10px] mt-[5px] pl-[15px] w-[250px]  text-[14px] md:ml-[-25px] h-[100px] md:text-[16px] md:w-[705px] md:h-[80px] bg-[#fff] border border-gray-300  p-4 '/>
                    {/* <textarea value={formData.detail} onChange={handleInputChange} className='border border-gray-300 rounded-md bg-[#F5F5F5] w-[250px] h-[100px] text-black text-sm pl-2 pt-2' /> */}
                </div>
                ) :(
                  <div>
                    <p className='font-mitr text-[#808080] text-[13px] md:text-[16px] ml-[-170px] md:ml-[-640px] mt-[20px]  md:mt-[16px]'>รายละเอียด</p>
                    <input type="text" name="detail" placeholder={confirmedData.detail} className='rounded-[10px] mt-[5px] pl-[15px] w-[250px] md:ml-[-25px] h-[100px] md:text-[20px] md:w-[705px] md:h-[80px] bg-[#fff] border border-gray-300  p-4 '/>
                    {/* <textarea value={formData.detail} onChange={handleInputChange} className='border border-gray-300 rounded-md bg-[#F5F5F5] w-[250px] h-[100px] text-black text-sm pl-2 pt-2' /> */}
                </div>
                )}

                {message && (
                  <p className='mt-3 text-red-500 text-xs py-2 bg-[#f9bdbb] rounded-[10px] inline-block px-4 w-[210px] md:w-[410px] mx-auto md:text-lg md:mt-[30px]'>
                    {message}
                  </p>
                )}
                {notifyMessage && (
                  <p className=' mt-3 text-red-500 text-xs py-2 bg-[#f9bdbb] rounded-[10px] inline-block px-4 w-[210px] md:w-[410px] mx-auto md:text-lg md:mt-[30px]'>
                    {notifyMessage}
                  </p>
                )}

                <div className='flex items-center md:px-10  md:mt-[20px]' >
                  {/* <button type= "submit" href="/NotifyTwo" className=' mt-[20px] text-md md:text-[20px] md:ml-[480px] border-[#64CE3F] bg-[#64CE3F] px-10  py-1 rounded-[20px] text-[#fff] hover:-translate-y-0.5 duration-200 '>Submit</button> */}
                  {!recheck ? (
                    <button  onClick={handleConfirm} className=' mt-[20px] text-md md:text-[20px] md:ml-[280px] ml-[85px] border-[#64CE3F] bg-[#64CE3F] px-10  py-1 rounded-[20px] text-[#fff] hover:-translate-y-0.5 duration-200 '>confirm</button>
                    ) :(
                    <button type= "submit" onClick={handleSubmit} className=' mt-[20px] text-md md:text-[20px] md:ml-[300px] ml-[85px] border-[#64CE3F] bg-[#64CE3F] px-10  py-1 rounded-[20px] text-[#fff] hover:-translate-y-0.5 duration-200 '>submit</button>
                     )}
                </div>
              </form>
              
           
             {/* <form>
             <div className='md:mt-[30px]'>
                 <div className=' md:text-[20px] ml-[30px] text-[15px] md:w-[500px] md:ml-[40px] text-left '>
                     <p>{confirmedData.title}</p>
                 </div>
                
                 <div className="mt-[10px] border-t border-gray-300"></div> 
               </div>

               <div className='font-ntr px-2 flex items-center mx-auto w-[250px]  md:ml-[40px] md:w-[720px]  py-[20px] text-black bg-[#F5F5F5] text-center mt-[15px] rounded-[20px]'>
                 <div className='  font-ntr text-sm md:text-[18px]  rounded-[10px] w-[235px] md:w-[600px] py-2 md:py-4 bg-[#F5F5F5] ml-[5px] md:ml-[40px]'>
                     <div className='flex px-3 '>
                         <p className='text-[#000] text-left   w-[75px]  ml-[-1px] md:w-[100px] md:ml-[-11px]'>Employee</p>
                         <p>:</p>
                         <p className='md:ml-[15px] ml-[10px]'>{confirmedData.employee}</p>
                     </div>
                     <div className='flex px-3  mt-[5px]'>
                         <p className='text-[#000] text-left   w-[75px]  ml-[-1px] md:w-[100px] md:ml-[-11px]'>Location</p>
                         <p>:</p>    
                         <p className='md:ml-[15px] ml-[10px]'>{confirmedData.location}</p>
                     </div>
                     <div className='flex px-3  mt-[5px]'>
                         <p className='text-[#000] text-left  w-[75px]  ml-[-1px] md:w-[100px] md:ml-[-11px]'>Work Owner </p>
                         <p>:</p>
                         <p className='md:ml-[15px] ml-[10px]'>{confirmedData.work_owner}</p>
                     </div>
                     <div className='flex px-3 mt-[5px]'>
                         <p className='text-[#000] text-left   w-[75px]  ml-[-1px] md:w-[100px] md:ml-[-11px]'>Status</p>
                         <p>:</p>
                         <p className='md:ml-[15px] text-left  w-[120px] ml-[10px]'>{confirmedData.status}</p>
                     </div>
                     <div className='flex px-3  mt-[5px]'>
                         <p className='text-[#000] text-left   w-[75px]  ml-[-1px] md:w-[100px] md:ml-[-11px]'>Date</p>
                         <p>:</p>
                         <p className='md:ml-[15px] ml-[10px]'>{confirmedData.date}</p>
                     </div>
                   </div>
               </div>
                 <div>
                   <p className='text-[#808080] text-[13px] md:text-[16px] font-mitr md:mt-[20px] md:ml-[-660px] ml-[-185px] mt-[10px] '>ไฟล์แนบ</p>
                   <input type="file" placeholder={confirmedData.file} className="w-[248px] md:w-[710px] py-1 px-2 border ml-[0px] mt-[5px] md:mt-[10px] md:ml-[-25px] border-gray-300  p-4 rounded-lg "></input>
                 </div>
                 <div>
                     <p className='font-mitr text-[#808080] text-[13px] md:text-[16px] ml-[-170px] md:ml-[-640px] mt-[20px]  md:mt-[16px]'>รายละเอียด</p>
                     <input type="text" name="detail" placeholder={confirmedData.detail} className='rounded-[10px] mt-[5px] pl-[15px] w-[250px] md:ml-[-25px] h-[100px] md:text-[20px] md:w-[705px] md:h-[80px] bg-[#fff] border border-gray-300  p-4 '/>
                      <textarea value={formData.detail} onChange={handleInputChange} className='border border-gray-300 rounded-md bg-[#F5F5F5] w-[250px] h-[100px] text-black text-sm pl-2 pt-2' /> 
                 </div>
                
                 {message && (
                   <p className='mt-3 text-red-500 text-xs py-2 bg-[#f9bdbb] rounded-[10px] inline-block px-4 w-[210px] md:w-[410px] mx-auto md:text-lg md:mt-[30px]'>
                     {message}
                   </p>
                 )}
                 {notifyMessage && (
                   <p className=' mt-3 text-red-500 text-xs py-2 bg-[#f9bdbb] rounded-[10px] inline-block px-4 w-[210px] md:w-[410px] mx-auto md:text-lg md:mt-[30px]'>
                     {notifyMessage}
                   </p>
                 )}
                 <div className='flex items-center md:px-10  md:mt-[20px]' >
                  
                     <button type= "submit" onClick={handleSubmit} className=' mt-[20px] text-md md:text-[20px] md:ml-[300px] ml-[85px] border-[#64CE3F] bg-[#64CE3F] px-10  py-1 rounded-[20px] text-[#fff] hover:-translate-y-0.5 duration-200 '>submit</button>
                  
                 </div>
               </form>  */}

          </div> 
          </div>
        </div>
        </div>
    ) 
 }
  