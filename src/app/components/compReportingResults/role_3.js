'use client'
import '@fontsource/ntr'
import '../../globals.css'
import '@fontsource/mitr';
import CompNavbar from '../compNavbar/role_3';
import axios from 'axios';
import React, { useState ,useEffect ,useCallback} from 'react';
import { CompLanguageProvider, useLanguage } from '../compLanguageProvider_role_3';
import { useTranslation } from 'react-i18next';
// import html2pdf from 'html2pdf.js'
import {BsFillExclamationTriangleFill} from 'react-icons/bs'
import {BsCheckCircle} from 'react-icons/bs'
import { IoMdDownload } from "react-icons/io";
import { useRouter } from 'next/navigation';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../../Sarabun-Regular-normal.js';  


function CompReportingResults_role_3()  {
  return (
    <CompLanguageProvider>
      <App />
    </CompLanguageProvider>
  );
}

function App() {

  const router = useRouter();

  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();
  const [id, setId] = useState('');
  const [date, setDate] = useState('');
  const [nameExamineList , setNameExamineList] = useState(''); 
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedExamineOption, setSelectedExamineOption] = useState('');
  const [nameExamine , setNameExamine] = useState([]); 
  const [showPopup, setShowPopup] = useState(false); // เพิ่ม state เพื่อควบคุมการแสดง/ซ่อน popup
  const [sent, setSent] = useState(''); // เพิ่ม state เพื่อควบคุมการแสดง/ซ่อน popup
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [addmessage, setaddMessage] = useState(false);




  useEffect(() => {
   
    if (typeof window !== 'undefined') {
      
      const searchParams = new URLSearchParams(window.location.search);
      const user_IdValue = searchParams.get('id') ; // กำหนดค่าเริ่มต้นว่างไว้ถ้าไม่มีค่า
      const dateValue = searchParams.get('date') ; // กำหนดค่าเริ่มต้นว่างไว้ถ้าไม่มีค่า

     
      const storedDate = localStorage.getItem("date");

      if (storedDate  <= dateValue) {
        setSent(false);
      } else {
        setSent(true);
      }

    const fetchData = async () => {
      try {
        const storedId = localStorage.getItem('id');
        if (storedId) {
        }
        const AddData = {user_IdValue,storedId , fetch_role_3: true};
        const fetchdata = JSON.stringify(AddData);

        const response = await axios.post('/api/reportingResults', fetchdata, {
          headers: { 'Content-Type': 'application/json' },
        });    
        const data = response.data;

        if (response.status === 200) {
          if (data.success === true) {
            const ResultList = data.dbData

              
          setNameExamine(ResultList)


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
    setMessage('');
    setId(user_IdValue);
    fetchData();
  }

  }, []); // โหลดข้อมูลเมื่อค่า state reloadData เปลี่ยนแปลง


 
  


  const [formData, setFormData] = useState({
    title: '',
    employee: '',
    location: '',
    work_owner: '',
    status: '',
    dateTime: '',
    file: null,
    file_name: '',
    detail: '',
  });

  const [uploadedImage, setUploadedImage] = useState(null);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
  
    if (name === 'file') {
      setFormData({
        ...formData,
        [name]: files[0],
        fileName: files[0] ? files[0].name : '', // กำหนดชื่อไฟล์
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };



  const handleSubmit = async () => {
  
    
    try {
 

      const sendData = {
        nameExamine,
        send: true
      };

      const dataform = JSON.stringify(sendData);

      const response = await axios.post('/api/reportResultsPdf', dataform, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

    
      
      
      const resdata = response.data; 

      if (response.status === 200) {
        const resdata = response.data;
    
        if (resdata.success === true) {
          setShowSuccessPopup(true)
          setaddMessage(resdata.message);
          setSent(true)

          setTimeout(() => {
            setShowSuccessPopup(false);
            router.push(resdata.redirect);
          }, 1000); 
        } else {
          setMessage('');

        }
      } else {
        setMessage('');

      }
    } catch (error) {
      console.error('Error registering: ', error);
      setMessage('');

    } 
  
  }



const generatePDF = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const doc = new jsPDF({
    unit: 'mm',
    format: 'a4',
    orientation: 'portrait'
  });

  // Add Sarabun font
  let verticalSpacing = 5; // Set the desired vertical spacing
  let tableHeight = 0;
  let currentY = 10;
  let currentHeight = 0;
  let checkcurrentHeight = 0;
  const maxPageHeight = 650;
  let newPage = false;
  let startY = true;

  const createNewPage = () => {
    doc.addPage();
    newPage = true;
  };

  doc.addFont('Sarabun-Regular', 'normal');
  doc.setFont('Sarabun-Regular', 'normal');

 

  doc.setFontSize(10);
  const pageWidth = doc.internal.pageSize.getWidth();
  const textWidth = doc.getStringUnitWidth('แบบรายงานผลการตรวจสอบความปลอดภัย') * doc.internal.getFontSize() / doc.internal.scaleFactor;

  const xCoordinate = (pageWidth - textWidth) / 2;

  doc.text('แบบรายงานผลการตรวจสอบความปลอดภัย', xCoordinate, 20);

  doc.text(`ผู้ตรวจสอบ : ${nameExamine.inspector}`, 20, 30);
  doc.text(`วัน เดือน ปี เวลา ที่ตรวจ : ${nameExamine.date} น.`, 20, 38);

  if (nameExamine && nameExamine.items) {
    try {
      for (const item of nameExamine.items) {
        if (checkcurrentHeight > maxPageHeight) {
          createNewPage();
          currentY = 20; 
          checkcurrentHeight = 0;
        }
        if (startY) {
          startY = false;
          currentY = 46;
        }else if (newPage) {
          currentY = 20;
          tableHeight = 0;
          currentHeight  = 0;
          newPage = false;

        } else if (!newPage) {

          currentY = currentHeight + 8;
        }

       
        doc.text(20, currentY, `การตรวจสอบ :  ${item.name}`);

        currentY += 8;

        if (item.examine) {
          for (const [examKey, examValue] of Object.entries(item.examine)) {
            doc.setFont('Sarabun-Regular', 'normal');
            doc.text(25, currentY, examKey);
            currentY += 8;

            if (examValue[0].useEmployee === 'false') {
              if (examValue[0].itemA) {
                const columns = ["ลำดับ", "รายการตรวจสอบ", "สถานะ", "รายละเอียด"];
                const data = examValue[0].itemA.map((entry, entryIndex) => {
                  return [entryIndex + 1, entry.examine_name, entry.status, entry.details];
                });

                doc.setFont('Sarabun-Regular', 'normal');
                const tableWidth = columns.reduce((acc, column) => acc + (column.cellWidth || 40), 0);

                const options = {
                  startY: currentY,
                  margin: { left: ((doc.internal.pageSize.getWidth() - tableWidth) / 2) + 5 }, // Center the table
                  columnStyles: {
                    0: { cellWidth: 20 },
                    1: { cellWidth: 50 },
                    2: { cellWidth: 30 },
                    3: { cellWidth: 50 },
                  },
                  headerStyles: {
                    fillColor: [211, 211, 211],
                    textColor: [0, 0, 0],
                    fontSize: 9,
                    fontStyle: 'bold',
                    font: 'Sarabun-Regular',
                    halign: 'center',
                  },
                  bodyStyles: {
                    textColor: [0, 0, 0],
                    fontSize: 10,
                    font: 'Sarabun-Regular',
                    halign: 'center',
                  },

                  

                  didDrawCell: function (data) {
                    const cellHeight = data.row.height;
                    const cellWidth = data.cell.width;
                    const cellX = data.cell.x;
                    const cellY = data.cell.y;

                    doc.setLineWidth(0.1);
                    doc.setDrawColor(0, 0, 0);

                    doc.line(cellX, cellY, cellX + cellWidth, cellY);
                    doc.line(cellX + cellWidth, cellY, cellX + cellWidth, cellY + cellHeight);
                    doc.line(cellX, cellY + cellHeight, cellX + cellWidth, cellY + cellHeight);
                    doc.line(cellX, cellY, cellX, cellY + cellHeight);
                  },
                };

                doc.autoTable({ columns, body: data, ...options });

                tableHeight = doc.previousAutoTable.finalY;
                currentHeight = tableHeight;
                currentY = doc.autoTable.previous.finalY + 10; // Set currentY to the bottom of the previous table plus some spacing
                checkcurrentHeight += tableHeight;
                if ( checkcurrentHeight > maxPageHeight){
                  checkcurrentHeight = checkcurrentHeight - maxPageHeight
                  currentHeight = 12;
                  currentY = 20
                  doc.addPage();

                }
                
                
                
              }
            } else {
              if (examValue[0].itemA) {
                let entryIndex = 0;
                for (const entry of examValue[0].itemA) {
                 

                  entryIndex++;
                  

                  doc.text(25, currentY, `${entryIndex}. ${entry.key}`);

                  const columns = ["ลำดับ", "รายการตรวจสอบ", "สถานะ", "รายละเอียด"];
                  const data = entry.itemB.map((entryBB, entryIndex) => {
                    return [entryIndex + 1, entryBB.examinename_name, entryBB.status, entryBB.details];
                  });

                  doc.setFont('Sarabun-Regular', 'normal');
                  const tableWidth = columns.reduce((acc, column) => acc + (column.cellWidth || 40), 0);

                  const options = {
                    startY: currentY + verticalSpacing,
                    margin: { left: ((doc.internal.pageSize.getWidth() - tableWidth) / 2) + 5 },
                    columnStyles: {
                      0: { cellWidth: 20 },
                      1: { cellWidth: 50 },
                      2: { cellWidth: 30 },
                      3: { cellWidth: 50 },
                    },
                    headerStyles: {
                      fillColor: [211, 211, 211],
                      textColor: [0, 0, 0],
                      fontSize: 9,
                      fontStyle: 'bold',
                      font: 'Sarabun-Regular',
                      halign: 'center',
                    },
                    bodyStyles: {
                      textColor: [0, 0, 0],
                      fontSize: 10,
                      font: 'Sarabun-Regular',
                      halign: 'center',
                    },

                    didDrawCell: function (data) {
                      const cellHeight = data.row.height;
                      const cellWidth = data.cell.width;
                      const cellX = data.cell.x;
                      const cellY = data.cell.y;

                      doc.setLineWidth(0.1);
                      doc.setDrawColor(0, 0, 0);

                      doc.line(cellX, cellY, cellX + cellWidth, cellY);
                      doc.line(cellX + cellWidth, cellY, cellX + cellWidth, cellY + cellHeight);
                      doc.line(cellX, cellY + cellHeight, cellX + cellWidth, cellY + cellHeight);
                      doc.line(cellX, cellY, cellX, cellY + cellHeight);
                    },
                  };

                  doc.autoTable({ columns, body: data, ...options });
                  tableHeight = doc.previousAutoTable.finalY;
                  currentHeight = tableHeight;
                  currentY = doc.autoTable.previous.finalY + 10; 
                  checkcurrentHeight += tableHeight;
                  if ( checkcurrentHeight > maxPageHeight){
                    checkcurrentHeight = checkcurrentHeight - maxPageHeight
                    currentY = 20
                    currentHeight = 12;
                    doc.addPage();

                  }
                  
                 
                }
              }
            }
          }
        }
      }

      doc.save('แบบรายงานผลการตรวจสอบความปลอดภัย.pdf');
    } catch (error) {
      console.error('Error during PDF generation:', error);
    }
  }
};

  return (
    <div>
      
      <CompNavbar/>
        
      <div className=' bg-[url("/bg1.png")]  overflow-auto bg-cover bg-no-repeat absolute z-[-1] top-0 left-0 w-full h-full bg-center '>
      <div className='md:w-[800px] lg:w-[1000px] mx-auto '>
          <div className='absolute top-[100px] left-1/2 transform -translate-x-1/2 z-0'>
             <div className='bg-[#5A985E] mx-auto max-w-[500px] sm:max-w-[350px] py-[100px] rounded-[50px]'></div>
          </div>

          <div className='mx-auto w-[350px] md:w-[700px] lg:w-[800px] font-ntr mb-[50px]  py-[30px] text-black flex flex-col  bg-[#FFF] text-center md:rounded-[50px] rounded-[30px] mt-[106px]  '>
          
                    <div  >
                    <div  className=  {`font-mitr font-bold text-[20px] md:text-[25px] ml-[20px] md:ml-[50px] w-[310px]  md:w-[600px] `}>

                    <h1 className=' text-[#5A985E]  ml-[10px] md:ml-[0] md:w-[300px]  text-left  '> {t("Verified information")}</h1>
                    <div className="mt-[5px] md:mt-[10px] md:ml-[-30px] border-t md:border w-full md:w-[650px] lg:w-[750px] border-gray-300"></div>


                    <div className='text-black text-left ml-[10px] md:ml-[0]  mt-[15px]  md:mt-[0] flex '>
                  
                    </div>
                    </div>
                    </div>

                    <div className='mx-auto md:w-[620px] lg:w-[705px] text-black   w-[310px] '>

                    <div className='flex items-center  mt-[5px]  text-[13px] md:text-[16px] font-mitr md:mt-[20px] text-left ml-[10px] md:ml-[10px] '>
                    <p>{t('Date')}</p>
                    <p className='ml-[10px] '>:</p>
                    <p className=' ml-[10px]'>{nameExamine.date} {t('N')}</p>

                    </div>

                    <div className='flex items-center mt-[8px]  text-[13px] md:text-[16px] font-mitr md:mt-[15px] text-left ml-[10px] md:ml-[10px] '>
                    
                    <p>{t('Inspector')}</p>
                    <p className='ml-[10px]'>:</p>
                    <p className='ml-[10px] w-[200px]  md:w-[300px] whitespace-nowrap overflow-hidden overflow-ellipsis'>{nameExamine.inspector}</p>

                    </div>

                    <div  className='mx-auto '>

                      <div  className='h-[300px]  md:w-[610px] lg:w-[690px] px-2 font-mitr  text-black text-center mt-[15px] mx-auto justify-center text-sm md:text-[18px] rounded-[10px] w-[310px] py-2 md:py-4 bg-[#F5F5F5] ml-[5px]  overflow-auto'>
                      <div id="pdf-content"   className="w-full  ">
                      {nameExamine &&
                            nameExamine.items &&
                            nameExamine.items.map((item, index) => (
                              <div key={index}>

                                <div className="mt-[10px] md:mt-[10px] md:ml-[-30px] border-t md:border w-full md:w-[750px] border-gray-300"></div>
                                <h1 className="text-left text-green-600 mt-[10px]">Examine: {item.name}</h1>
                                <div className="mt-[5px] md:mt-[10px] md:ml-[-30px] border-t md:border w-full md:w-[750px] border-gray-300"></div>

                                {Object.keys(item.examine).map((examKey, examIndex) => (
                                  <div key={examIndex}>
                                   

                                    {item.examine[examKey][0].useEmployee === 'false' ? (
                                      <div key={examIndex}>
                                       

                                        <h2 className="text-left mt-[10px]">{examKey}</h2>

                                        <table className="min-w-full divide-gray-200 mt-[10px]">
                                          <thead className="bg-gray-50 top-0 z-10">
                                            <tr className="text-center">
                                              <th scope="col" style={{ whiteSpace: 'nowrap' }} className="border w-[30px] py-1 text-[12px] text-gray-500 uppercase tracking-wider">
                                                {t('No')}
                                              </th>
                                              <th scope="col" style={{ whiteSpace: 'nowrap' }} className="border w-[100px] py-1 text-[12px] text-gray-500 uppercase tracking-wider">
                                                {t('Name')}
                                              </th>
                                              <th scope="col" style={{ whiteSpace: 'nowrap' }} className="border w-[50px] py-1 text-[12px] text-gray-500 uppercase tracking-wider">
                                                {t('Status')}
                                              </th>
                                              <th scope="col" style={{ whiteSpace: 'nowrap' }} className="border w-[200px] py-1 text-[12px] text-gray-500 uppercase tracking-wider">
                                                {t('Details')}
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody className="bg-white text-[13px] divide-y divide-gray-200">
                                            {item.examine[examKey][0].itemA.map((entry, entryIndex) => (
                                              <tr key={entryIndex} className="text-center">
                                                <td className="py-4 border whitespace-nowrap">
                                                  <div>{entryIndex + 1}</div>
                                                </td>
                                                <td className="py-4 border whitespace-nowrap">
                                                  <div className="text-left ml-[10px]">{entry.examine_name}</div>
                                                </td>
                                                <td className={`py-4 border whitespace-nowrap ${entry.status === 'pass' ? 'text-green-600' : 'text-red-600'}`}>
                                                  <div>{entry.status}</div>
                                                </td>
                                                <td className="py-4 border">
                                                  <div className={`break-words ${entry.details === '-' ? 'text-center' : 'text-left ml-[10px]'}`}>
                                                    <span className={`break-words ${entry.details === '-' ? '' : 'ml-[10px]'}`}>{entry.details}</span>
                                                  </div>
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    ) : (
                                        <div key={examIndex}>
                                        
  
                                          <h2 className="text-left mt-[10px]">{examKey}</h2>
                                          {item.examine[examKey][0].itemA.map((exameKey, exameIndex) => (
                                        <div key={exameIndex}>
                                          <div className="mt-[10px] md:mt-[10px] md:ml-[-30px] border-t md:border w-full md:w-[750px] border-gray-300"></div>

                                            <h1 className='text-left mt-[10px]'>{exameIndex + 1}. {exameKey.key} </h1>

                                          <table className="min-w-full divide-gray-200 mt-[10px]">
                                            <thead className="bg-gray-50 top-0 z-10">
                                              <tr className="text-center">
                                                <th scope="col" style={{ whiteSpace: 'nowrap' }} className="border w-[30px] py-1 text-[12px] text-gray-500 uppercase tracking-wider">
                                                  {t('No')}
                                                </th>
                                                <th scope="col" style={{ whiteSpace: 'nowrap' }} className="border w-[100px] py-1 text-[12px] text-gray-500 uppercase tracking-wider">
                                                  {t('Name')}
                                                </th>
                                                <th scope="col" style={{ whiteSpace: 'nowrap' }} className="border w-[50px] py-1 text-[12px] text-gray-500 uppercase tracking-wider">
                                                  {t('Status')}
                                                </th>
                                                <th scope="col" style={{ whiteSpace: 'nowrap' }} className="border w-[200px] py-1 text-[12px] text-gray-500 uppercase tracking-wider">
                                                  {t('Details')}
                                                </th>
                                              </tr>
                                            </thead>
                                            <tbody className="bg-white text-[13px] divide-y divide-gray-200">
                                              {exameKey.itemB.map((entry, entryIndex) => (
                                                

                                                <tr key={entryIndex} className="text-center">
                                                  <td className="py-4 border whitespace-nowrap">
                                                    <div>{entryIndex + 1}</div>
                                                  </td>
                                                  <td className="py-4 border whitespace-nowrap">
                                                    <div className="text-left ml-[10px]">{entry.examinename_name}</div>
                                                  </td>
                                                  <td className={`py-4 border whitespace-nowrap ${entry.status === 'pass' ? 'text-green-600' : 'text-red-600'}`}>
                                                    <div>{entry.status}</div>
                                                  </td>
                                                  <td className="py-4 border">
                                                    <div className={`break-words ${entry.details === '-' ? 'text-center' : 'text-left ml-[10px]'}`}>
                                                      <span className={`break-words ${entry.details === '-' ? '' : 'ml-[10px]'}`}>{entry.details}</span>
                                                    </div>
                                                  </td>
                                                </tr>
                                              // ))
                                              ))}

                                            </tbody>
                                          </table>
                                        </div>

                                        ))}
                                       </div>

                                    )
                                    
                                    }

                                  </div>

                              ))}
                              </div>
                            ))}
                            
                            </div> 
                          </div>
                        </div>
                          
              {showSuccessPopup && (
                <div className="bg-white text-[#5A985E] text-[16px]  w-[300px] p-8  rounded-lg border-black shadow-lg md:w-[400px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <BsCheckCircle className=' text-[50px] mx-auto mb-[10px]'/>
                {addmessage}
                </div>
              )}

                {message && (
                  <p className='mt-3 text-red-500 text-xs py-2 bg-[#f9bdbb] rounded-[10px] inline-block px-4 w-[210px] md:w-[410px] mx-auto md:text-lg md:mt-[30px]'>
                    {message}
                  </p>
                )}
               

                {showPopup && (
              <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-[9999]">
                <div className="bg-white p-4 rounded-lg border-black shadow-lg md:w-[400px] w-[300px] ">
                <BsFillExclamationTriangleFill className=' text-[50px] text-[#5A985E] mx-auto mb-[10px]'/>
                <p className='md:text-[18px] text-[#5A985E] text-[16px]  '>{t("Can be sent only one time. Are you sure you have checked?")}</p>
                  <div className=  {`font-mitr text-[16px]  flex justify-center mt-[20px]`}>
                    <button className="flex justify-center items-center bg-[#93DD79] text-white px-4 py-2 ml-[5px] rounded hover:bg-green-600" onClick={() => {handleSubmit() ,setShowPopup(false)}}>{t('Yes')}</button> 

                    <button className="flex justify-center items-center bg-[#FF6B6B] text-white px-4 py-2 ml-[10px] rounded hover:bg-red-600" onClick={() => setShowPopup(false)}>{t('Cancel')}</button>
                  </div>
                </div> 
                </div>
              )}

                <div className=  {` font-mitr text-[15px] md:text-[17px] left-0 flex items-center   md:px-10  md:mt-[20px]`} >
                    <button onClick={generatePDF} className=' mt-[20px]   border-[#64CE3F] bg-[#64CE3F] px-5  py-1  text-[#fff] hover:-translate-y-0.5 duration-200  mx-auto flex items-center '><IoMdDownload /><span className='ml-[5px]'>Dowload</span></button>

                </div>
             
        
              </div>

          </div> 
          </div>
        </div>
        </div>
        
    ) 
 }
 export default  CompReportingResults_role_3;

  