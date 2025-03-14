//แบบแจ้งการประสบอันตราย เจ็บป่วย หรือสูญหาย

"use client";
import React, { useState, useEffect } from 'react';
import '../../globals.css';
import '@fontsource/mitr';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, AlignmentType, TextRun, BorderStyle, WidthType } from "docx";
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { th } from "date-fns/locale";
import axios from 'axios';

const SafetyReportFormDangerAndLoss = () => {
  const [currentDate, setCurrentDate] = useState({
    day: "",
    month: "",
    year: "",
  });

  const [writeAt, setWriteAt] = useState("");

  
  const [nameBoss, setNameBoss] = useState("");
  const [position, setPosition] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [location, setLocation] = useState("");
  const [businessType, setBusinessType] = useState("");

  const [employeeName, setEmployeeName] = useState("");
  const [employeeGender, setEmployeeGender] = useState("");
  const [employeePosition, setEmployeePosition] = useState("");
  const [employeeAge, setEmployeeAge] = useState("");

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [times, setTimes] = useState([]);
  const [selectedZone, setSelectedZone] = useState('');
  const [zones, setZones] = useState('');

  const [causeAccident, setCauseAccident] = useState('');
  const [amountDays, setAmountDays] = useState("");
  const [detectAccident, setDetectAccident] = useState('');
  const [assistance, setAssistance] = useState('');


  const [details, setDetails] = useState('');
  const [effactEmp, setEffactEmp] = useState('');
  const [injureOrgan, setInjureOrgan] = useState('');


//ดึงโซนในโรงงาน
const fetchZones = async () => {
  try {
    const response = await fetch("/api/form_accident", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: 'fetchZones' }),
    });

    const data = await response.json();
    console.log("Response from API:", data);

    if (data.success) {
      // แยกเฉพาะ array ด้านในที่ต้องการ
      const zonesData = Array.isArray(data.data) && Array.isArray(data.data[0]) ? data.data[0] : [];
      setZones(zonesData);
    } else {
      console.log("Error fetching zones:", data.message);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
};

//เปลี่ยนวันที่
const handleDateChange = async (date) => {
  setSelectedDate(date);
  setTimes([]); // ล้างเวลาที่มีเก่า
  setSelectedTime('');

  const offset = new Date(date).getTimezoneOffset() * 60000;
  const localDate = new Date(new Date(date).getTime() - offset); 
  const formattedDate = localDate.toISOString().split('T')[0]; // YYYY-MM-DD
  console.log("Formatted Date:", formattedDate);
  const response = await fetch('/api/form_accident', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'fetchTimes', payload: { date: formattedDate } }),
  });
  const data = await response.json();
  setTimes(data.data);
};

//เปลี่ยนเวลา
const handleTimeChange = async (time) => {
  setSelectedTime(time);

  // ดึงข้อมูลรายละเอียดเมื่อเลือกเวลา
  //if (selectedDate && time) {
  //  await fetchDetails(selectedDate, time);
  //}
};


//เวลา
const formatTime = (time) => {
  // แปลงเวลาในรูปแบบ "HH:MM:SS" ให้เป็น "HH:mm"
  const timeArray = time.split(':');  // แยกชั่วโมง, นาที
  const hours = timeArray[0];
  const minutes = timeArray[1];

  // รูปแบบการแสดงผลที่เข้าใจง่าย
  return `${hours}:${minutes}`;
};


  useEffect(() => {
    // ดึงวันที่ปัจจุบัน
    const today = new Date();
    const day = today.getDate().toString();
    const months = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ]; // ชื่อเดือนภาษาไทย

    const month = months[today.getMonth()]; // ดึงชื่อเดือนจากอาร์เรย์
    const year = (today.getFullYear() + 543).toString(); // แปลงเป็น พ.ศ.

    setCurrentDate({ day, month, year });
    fetchZones();

  }, []);



  const generateDOCX = async () => {
    try {


      const formattedTime = selectedTime 
      ? (formatTime(selectedTime))
      : "................................";
          
      const formattedDate = selectedDate
        ? (
            new Date(selectedDate).toLocaleDateString("th-TH", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          )
        : "...................................................................";
      

      const doc = new Document({
        sections: [],
      });
  
      const content = [];
  
    // หัวข้อเอกสาร
    content.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "การแจ้งการประสบอันตราย เจ็บป่วย หรือสูญหาย",
              font: "TH SarabunPSK",
              bold: true,
              size: 32,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 }, // ระยะห่างหลังข้อความ
        }),
        new Paragraph({
            children: [
              new TextRun({  text: "\t" ,font: "TH SarabunPSK", size: 32, }),
              new TextRun({  text: `เขียนที่ ${writeAt}`,font: "TH SarabunPSK", size: 32, }),
            ],
            tabStops: [
              {
                type: "left", 
                position: 6520, 
              },
            ],
            spacing: { after: 0, line: 240 },  // Set line spacing to 1.0 (240 TWIP)
          }),
          new Paragraph({
            children: [
              new TextRun({  text: "\t" ,font: "TH SarabunPSK", size: 32, }),
              new TextRun({     
                text: `วันที่   ${currentDate.day}  เดือน  ${currentDate.month}   พ.ศ.  ${currentDate.year}`,
                font: "TH SarabunPSK",
                size: 32,
              }),
            ],
            tabStops: [
              {
                type: "left", 
                position: 6520, 
              },
            ],
            spacing: { after: 0, line: 240 },  // Set line spacing to 1.0 (240 TWIP)
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "1.   ข้าพเจ้า (นายจ้าง/ผู้มีอำนาจลงนาม)  ", font: "TH SarabunPSK",  size: 32, }),
              new TextRun({ text: nameBoss || "..........................................................."  , font: "TH SarabunPSK", size: 32, }),
              new TextRun({ text: "\t", font: "TH SarabunPSK", size: 32, }),
              new TextRun({ text: "ตำแหน่ง  ", font: "TH SarabunPSK", size: 32, }),
              new TextRun({ text: position || "........................................."  , font: "TH SarabunPSK", size: 32, }),
            ],
            tabStops: [
              {
                type: "right", 
                position: 520, 
              },
            ],
            spacing: { after: 0 }, 
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "2.   ชื่อสถานประกอบการ  ", font: "TH SarabunPSK", size: 32, }),
              new TextRun({ text: businessName || "........................................................................................................................................................" ,font: "TH SarabunPSK", size: 32, }),
              ],
            spacing: { after: 0 }, 
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "     ที่ตั้ง  " ,font: "TH SarabunPSK", size: 32, }),
              new TextRun({ text: location || "...................................................................................................................................................................................." ,font: "TH SarabunPSK", size: 32, }),
             ],
            spacing: { after: 0 }, 
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "3.   ประเภทกิจการ  " ,font: "TH SarabunPSK", size: 32, }),
              new TextRun({ text: businessType || ".................................................................................................................................................................." ,font: "TH SarabunPSK", size: 32, }),
             ],
            spacing: { after: 0 }, 
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "4.   ชื่อตัว-ชื่อสกุล (ลูกจ้างที่ประสบอันตราย เจ็บป่วย หรือสูญเสีย)  " ,font: "TH SarabunPSK", size: 32, }),
              new TextRun({ text: employeeName || "......................................................................................." ,font: "TH SarabunPSK", size: 32, }),
            ],
            spacing: { after: 0 }, 
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "     เพศ  ", font: "TH SarabunPSK",  size: 32, }),
              new TextRun({ text: employeeGender || ".........................................." ,font: "TH SarabunPSK", size: 32, }),
              new TextRun({ text: "\t", font: "TH SarabunPSK", size: 32, }),
              new TextRun({ text: "ตำแหน่ง  " ,font: "TH SarabunPSK", size: 32, }),
              new TextRun({ text: employeePosition || ".............................................................................................................." ,font: "TH SarabunPSK", size: 32, }),
              ],
              tabStops: [
                {
                  type: "left", 
                  position: 2950, 
                },
              ],
            spacing: { after: 0 }, 
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "     อายุ  " ,font: "TH SarabunPSK", size: 32, }),
              new TextRun({ text: employeeAge || "...................................................................................................................................................................................." ,font: "TH SarabunPSK", size: 32, }),
            ],
            spacing: { after: 0 }, 
          }),
                    new Paragraph({
                      children: [
                        new TextRun({ text: "5.   วันที่เกิดเหตุ  ", font: "TH SarabunPSK",  size: 32, }),
                        new TextRun({ text: `   ${formattedDate}` ,font: "TH SarabunPSK", size: 32 }),
                        new TextRun({ text: "\t\t" ,font: "TH SarabunPSK", size: 32 }),
                        new TextRun({ text: "เวลา  ", font: "TH SarabunPSK",  size: 32, }),
                        new TextRun({ text:  `${formattedTime}  น.`  ,font: "TH SarabunPSK", size: 32 }),
                      ],
                      tabStops: [
                        {
                          type: "left", 
                          position: 2520, 
                        },
                      ],
                      spacing: { after: 0 }, 
                    }),
          new Paragraph({
            children: [
              new TextRun({ text: "     สถานที่เกิดเหตุ  " ,font: "TH SarabunPSK", size: 32 }),
              new TextRun({ text: selectedZone || ".................................................................................................................................................................." ,font: "TH SarabunPSK", size: 32, }),
            ],
            spacing: { after: 0 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "6.   ลักษณะการทำงานของลูกจ้างในขณะที่เกิดเหตุ รวมทั้งรายละเอียดของการประสบอันตราย เจ็บป่วย หรือสูญหาย  " ,font: "TH SarabunPSK", size: 32 }),
            ],
            spacing: { after: 0 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `     ${details || "............................................................................................................................................................................................" }`  ,font: "TH SarabunPSK", size: 32 }),
            ],
            spacing: { after: 0 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "7.   สาเหตุของการประสบภัย  " ,font: "TH SarabunPSK", size: 32 }),
              new TextRun({ text: causeAccident || "................................................................................................................................................." ,font: "TH SarabunPSK", size: 32 }),
            ],
            spacing: { after: 0 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "8.   อวัยวะของลูกจ้างที่ได้รับบาดเจ็บหรือสูญเสีย  ", font: "TH SarabunPSK",  size: 32, }),
              new TextRun({ text: injureOrgan || ".................................................................................................................." ,font: "TH SarabunPSK", size: 32, }),
            ],
            spacing: { after: 0 }, 
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "     ผลกระทบที่ลูกจ้างได้รับจากการประสบอันตราย เจ็บป่วย หรือสูญเสีย  ", font: "TH SarabunPSK",  size: 32, }),
              new TextRun({ text: effactEmp || "..........................................................................." ,font: "TH SarabunPSK", size: 32, }),
             ],
            spacing: { after: 0 }, 
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "9.   จำนวนวันที่ลูกจ้างไม่สามารถทำงานได้  ", font: "TH SarabunPSK",  size: 32, }),
              new TextRun({ text: amountDays || "                -               " ,font: "TH SarabunPSK",  size: 32, }),
              new TextRun({ text: "  วัน", font: "TH SarabunPSK",  size: 32, }),
            ],
            spacing: { after: 0 }, 
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "10. การดำเนินการแก้ไข หรือป้องกัน  " ,font: "TH SarabunPSK", size: 32, }),
              new TextRun({ text: detectAccident || "....................................................................................................................................." ,font: "TH SarabunPSK", size: 32, }),
            ],
            spacing: { after: 0 }, 
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "11. การช่วยเหลือลูกจ้าง  " ,font: "TH SarabunPSK", size: 32, }),
              new TextRun({ text: assistance || "........................................................................................................................................................." ,font: "TH SarabunPSK", size: 32, }),
            ],
            spacing: { after: 0 }, 
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "\t" }),
              new TextRun({ text: "ข้าพเจ้าขอรองรับว่า ข้อความข้างต้นเป็นจริงทุกประการ" ,font: "TH SarabunPSK", size: 32, }),
            ],
            tabStops: [
              {
                type: "left", 
                position: 1000, 
              },
            ],
            spacing: { before:400 , after: 600 }, 
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "\t" ,font: "TH SarabunPSK", size: 32, }),
              new TextRun({ text: "(ลงชื่อ)" ,font: "TH SarabunPSK", size: 32, }),
              new TextRun({ text: "........................................................." ,font: "TH SarabunPSK", size: 32, }),
            ],
            tabStops: [
              {
                type: "left", 
                position: 5620, 
              },
            ],
            spacing: { after: 0 }, 
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "\t" ,font: "TH SarabunPSK", size: 32, }),
              new TextRun({ text: "(  " ,font: "TH SarabunPSK", size: 32, }),
              new TextRun({ text: nameBoss || "..........................................................." ,font: "TH SarabunPSK", size: 32, }),
              new TextRun({ text: "  )" ,font: "TH SarabunPSK", size: 32, }),

            ],
            tabStops: [
              {
                type: "left", 
                position: 5920, 
              },
            ],
            spacing: { after: 0 }, 
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "\t" ,font: "TH SarabunPSK", size: 32, }),
              new TextRun({ text: "      นายจ้าง (ผู้มีอำนาจลงนาม)" ,font: "TH SarabunPSK", size: 32, }),
            ],
            tabStops: [
              {
                type: "left", 
                position: 5920, 
              },
            ],
            spacing: { after: 0 }, 
          }),
          
      );
  
      
      // เพิ่ม content ทั้งหมดลงใน section พร้อม header
      doc.addSection({
        children: content,
        properties: {
          page: {
            margin: {
              top: 1440, // ระยะขอบบน 1.5 นิ้ว
              bottom: 720, // ระยะขอบล่าง 0.5 นิ้ว
              left: 720, // ระยะขอบซ้าย 0.5 นิ้ว
              right: 720, // ระยะขอบขวา 0.5 นิ้ว
            },
          },
        },
      });
  
     // แปลงเอกสารเป็น Blob
     const buffer = await Packer.toBuffer(doc);
     const blob = new Blob([buffer], {
       type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
     });

     await sendBlobAsBase64ToBackend(blob);
 
     // สร้างลิงก์สำหรับดาวน์โหลด
     const link = document.createElement("a");
     link.href = URL.createObjectURL(blob);
     link.download = "การแจ้งการประสบภัย.docx";
     document.body.appendChild(link);
     link.click();
     document.body.removeChild(link); // ลบลิงก์ออกหลังจากคลิก
   } catch (error) {
     console.error("Error during DOCX generation:", error);
   }
  };

  const sendBlobAsBase64ToBackend = async (blob) => {
    try {
      const storedId = localStorage.getItem("id");
      console.log("lllllll",storedId);
  
      // ตรวจสอบว่า blob มีค่า
      if (!blob) {
        console.error("Blob is null or undefined.");
        return;
      }
  
      // แปลง Blob เป็น Base64
      const reader = new FileReader();
      reader.readAsDataURL(blob);
  
      // เมื่ออ่านเสร็จแล้ว
      reader.onloadend = async () => {
        if (!reader.result) {
          console.error("Error: No result from FileReader.");
          return;
        }
        
        // แยก Base64 string จาก result
        const base64String = reader.result.split(",")[1];
        console.log("Base64 String: ", base64String);
  
        // สร้าง payload สำหรับการส่งไปยัง backend
        const payloads = {
          fileName: "การแจ้งการประสบภัย",
          action: "aveFileToDatabaseData",
          storedId: storedId,
          file: base64String, // ส่ง Base64 string ไปใน JSON
        };
        //console.log("Payloads to send:", payloads);
  
        // ส่งข้อมูลไปยัง backend
        const response = await fetch("/api/form_accident", {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // กำหนดเป็น application/json
          },
          body: JSON.stringify(payloads),
        });
  
        const result = await response.json();
  
        if (result.success) {
          console.log("File and data successfully sent to backend.");
        } else {
          console.error("Error from backend:", result.message);
        }
      };
    } catch (error) {
      console.error("Error sending file as Base64 to backend:", error);
    }
  };
    
  
  


  return (

    <div className=' bg-[url("/bg1.png")]  overflow-auto bg-cover bg-no-repeat absolute z-[-1] top-0 left-0 w-full h-full bg-center '>
    <div className='md:w-[1000px] flex justify-center items-center mx-auto'>
    
     {/* Navbar */}
  <div className="fixed top-0 left-0 w-full bg-[#5A975E] text-white shadow-md z-10 h-[60px]">
    <div className="flex items-center justify-between px-6 py-4">
    <div className='text-[#fff]  relative  font-bold text-[24px] md:mr-[25px]' >
                JorPor
      </div>
    </div>
  </div>


      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0'>
        <div className='bg-[#5A985E] mx-auto max-w-[500px] sm:max-w-[350px] py-[100px] rounded-[50px]'></div>
      </div>
      {/* กระดาษ A4 */}
      <div
          className="relative item-center justify-center bg-white border border-gray-300 shadow-xl rounded-xl"
          style={{
            width: "210mm", // ความกว้างของ A4
            height: "390mm", // ความสูงของ A4
            marginTop: "100px", // ระยะห่างจากขอบบน
            marginBottom: "100px", // ระยะห่างจากขอบล่าง
            backgroundSize: 'contain', // ไม่ให้ขยายภาพพื้นหลังให้เต็มพื้นที่
            backgroundRepeat: 'no-repeat', // ป้องกันไม่ให้ภาพพื้นหลังซ้ำ
          }}
        >
         {/* Form */}
         <div className="p-8">
        {/* Header */}
        <div className="text-end mt-9 mb-5">
          <h1 className="text-lg text-center font-bold text-black">
          การแจ้งการประสบอันตราย เจ็บป่วย หรือสูญหาย         </h1>
           </div>

           <div className="text-end mt-2">
            <div className="mt-5 ">
            <h1 className="text-black">
        เขียนที่
        <input
      type="text"
      value={writeAt}
      onChange={(e) => setWriteAt(e.target.value)}
      className="border-b border-black w-[28%] flex-1 focus:outline-none ml-2 text-black"
      />
        </h1>
        {/** วันที่ */}
        <div className="mt-4">
      <h1 className="text-black">
        วันที่
        <input
          value={currentDate.day}
          type="text"
          className="border-b border-black w-[4%] flex-1 focus:outline-none text-center text-black"
          readOnly // ไม่ให้แก้ไข
        />
        เดือน
        <input
          value={currentDate.month}
          type="text"
          className="border-b border-black w-[13%] flex-1 focus:outline-none text-center text-black"
          readOnly // ไม่ให้แก้ไข
        />
        พ.ศ.
        <input
          value={currentDate.year}
          type="text"
          className="border-b border-black w-[6%] flex-1 focus:outline-none text-center text-black"
          readOnly // ไม่ให้แก้ไข
        />
      </h1>
    </div>


        </div>
        </div>
        

        {/* Form Content */}
        <div className="space-y-6 mt-5 text-black ">
          {/* 1 ชื่อนายจ้าง และตน. */}
          <div className="flex items-center w-[99%]">
        <label className="text-black whitespace-nowrap mr-1">1. ข้าพเจ้า (นายจ้าง/ผู้มีอำนาจลงนาม)</label>
        <input
            type="text" id="type" name="type" 
            style={{
              width: "38%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
            value={nameBoss}
            onChange={(e) => setNameBoss(e.target.value)}
          />
         <label className="text-black whitespace-nowrap ml-2 mr-1">ตำแหน่ง</label>
         <input
            type="text" id="type" name="type" 
            style={{
              width: "22%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
        </div>

        {/* 2 ชื่อโรงงาน ที่ตั้ง */}
        <div className="flex items-center justify-start w-full flex-wrap">
          <label className="text-black whitespace-nowrap mr-1">2. ชื่อสถานประกอบกิจการ</label>
          <input
            type="text" id="type" name="type" 
            style={{
              width: "75%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-start w-full flex-wrap">
          <label className="text-black whitespace-nowrap mr-1">⠀ที่ตั้ง</label>
          <input
            type="text" id="type" name="type" 
            style={{
              width: "93%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

           {/* 3 ประเภทกิจการ  */}
           <div className="flex items-center justify-start w-full flex-wrap">
           <label className="text-black mr-1">3. ประเภทกิจการ</label>
           <input
            type="text" id="type" name="type" 
            style={{
              width: "83%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
          />
          </div>

         
         {/** 4 รายละเอียดคนเจ็บ **/}
         <div className="flex items-center justify-start w-full flex-wrap">
         <label className="text-black whitespace-nowrap mr-1">⠀ชื่อตัว-ชื่อสกุล (ลูกจ้างที่ประสบอันตราย เจ็บป่วย สูญหาย)</label>
         <input
            type="text" id="type" name="type" 
            style={{
              width: "44%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-start w-full flex-wrap">
  <label className="text-black whitespace-nowrap mr-2 ml-2">เพศ</label>
  <select
    id="gender"
    name="gender"
    className="text-center w-[30%] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-black"
    value={employeeGender}
    onChange={(e) => setEmployeeGender(e.target.value)}
  >
    <option value="" disabled>
      เลือกเพศ
    </option>
    <option value="ชาย">ชาย</option>
    <option value="หญิง">หญิง</option>
    <option value="อื่นๆ">อื่น ๆ</option>
  </select>

        <label className="text-black whitespace-nowrap ml-5 mr-1">ตำแหน่ง</label>
        <input
            className="text-center"
            type="text" id="type" name="type" 
            style={{
              width: "53%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
            value={employeePosition}
            onChange={(e) => setEmployeePosition(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-start w-full flex-wrap">
          <label className="text-black whitespace-nowrap mr-2 ml-2">อายุ</label>
          <input
            className="text-center"
            type="text" id="type" name="type" 
            style={{
              width: "20%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
            value={employeeAge}
            onChange={(e) => setEmployeeAge(e.target.value)}
          />
        </div>

        {/** 5 วันที่เกิดเหตุ */}
         <div className="flex items-center justify-start w-full flex-wrap">
                <label className="text-black whitespace-nowrap mr-3">5. วันที่เกิดเหตุ</label>
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                locale={th}
                dateFormat="dd/MM/yyyy"
                placeholderText="-- ระบุวันที่ --"
                className="text-black "
                style={{
                  padding: "6px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              />
         <label className="text-black whitespace-nowrap mr-3">เวลา</label>
         <select id="timeSelect" 
                  value={selectedTime}  
                  style={{
                    width: "32%",
                    padding: "6px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }} 
                  onChange={(e) => handleTimeChange(e.target.value)}>
          <option value="" disabled>-- กรุณาเลือกเวลา --</option>
          {Array.isArray(times) && times.length > 0 ? (
            times.map((time, index) => (
              <option key={index} value={time}>
                {formatTime(time)} {/* แสดงเวลาในรูปแบบที่ต้องการ */}
              </option>
            ))
          ) : (
            <option value="">ไม่มีเวลาให้เลือก</option>
          )}
        </select>
                </div>

          { /** สถานที่เกิดเหตุ */}
          <div className="flex items-center w-[99%]">
         <label className="text-black whitespace-nowrap mr-1">สถานที่เกิดเหตุ</label>
         <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            style={{
              width: "80%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}          
            >
            <option value="">-- กรุณาเลือกสถานที่เกิดอุบัติเหตุ --</option>
            {zones.length > 0 ? (
              zones.map((zone, index) => (
                <option key={index} value={zone.name}>
                  {zone.name}
                </option>
              ))
            ) : (
              <option value="">ไม่มีโซนให้เลือก</option>
            )}
          </select>
        </div>

        {/** 6 Details*/}
        <div className="flex items-center justify-start w-full flex-wrap">
          <label className="text-black whitespace-nowrap mr-1">6. ลักษณะการทำงานของลูกจ้างในขณะที่เกิดเหตุ รวมทั้งรายละเอียดของการประสบอันตราย เจ็บป่วย หรือสูญหาย</label>
          <input
            type="text" id="type" name="type" 
            style={{
              width: "99%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </div>
        
        {/** 7 สาเหตุ*/}
        <div className="flex items-center justify-start w-full flex-wrap">
          <label className="text-black whitespace-nowrap mr-1">7. สาเหตุของการประสบภัย</label>
          <input
            type="text" id="type" name="type" 
            style={{
              width: "74%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
            value={causeAccident}
            onChange={(e) => setCauseAccident(e.target.value)}
          />
        </div>

        {/** 8 อวัยวะ */}
        <div className="flex items-center justify-start w-full flex-wrap">
          <label className="text-black whitespace-nowrap mr-1">8. อวัยวะของลูกจ้างที่ได้รับบาดเจ็บหรือสูญเสีย</label>
          <input
            type="text" id="type" name="type" 
            style={{
              width: "56%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
            value={injureOrgan}
            onChange={(e) => setInjureOrgan(e.target.value)}
          />
        </div>

        {/** ผลกระทบต่อลูกจ้าง */}
        <div className="flex items-center justify-start w-full flex-wrap">
          <label className="text-black whitespace-nowrap mr-1">⠀ผลกระทบที่ลูกจ้างได้รับจากการประสบอันตราย เจ็บป่วย หรือสูญหาย</label>
          <input
            type="text" id="type" name="type" 
            style={{
              width: "35%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
            value={effactEmp}
            onChange={(e) => setEffactEmp(e.target.value)}
          />
        </div>

         {/** 9 วันที่ลูกจ้างลา */}
         <div className="flex items-center justify-start  w-[60%] flex-wrap">
          <label className="text-black whitespace-nowrap mr-1">9. จำนวนวันที่ลูกจ้างไม่สามารถทำงานได้</label>
          <input
            type="text" id="type" name="type" 
            style={{
              width: "25%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
              textAlign: "center", // จัดข้อความให้อยู่ตรงกลาง
            }}
            value={amountDays}
            onChange={(e) => setAmountDays(e.target.value)}
          />
        <label className="text-black whitespace-nowrap ml-1 mr-1">วัน</label>
        </div>
          
        {/** 10 */}
        <div className="flex items-center justify-start w-full flex-wrap">
          <label className="text-black whitespace-nowrap mr-1">10. การดำเนินการแก้ไข หรือป้องกัน</label>
          <input
            type="text" id="type" name="type" 
            style={{
              width: "65%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
            value={detectAccident}
            onChange={(e) => setDetectAccident(e.target.value)}
          />
        </div>

        {/** 11 การช่วยเหลือลูกจ้าง */}
        <div className="flex items-center justify-start w-full flex-wrap">
          <label className="text-black whitespace-nowrap mr-1">11. การช่วยเหลือลูกจ้าง</label>
          <input
            type="text" id="type" name="type" 
            style={{
              width: "76%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
            value={assistance}
            onChange={(e) => setAssistance(e.target.value)}
          />
        </div>
        
        <div className="text-start ml-14 mb-0">
  <p>ข้าพเจ้าขอรับรองว่า ข้อความข้างต้นเป็นจริงทุกประการ</p>
  </div>

  <div className="flex justify-start w-full mt-1 ml-80">
  <div className="text-start">
    <p>
      (ลงชื่อ) 
      <input
        type="text"
        className="border-b border-black focus:outline-none text-black w-[78%]"
      />
    </p>
    <div className="flex items-center mt-2">
      <label className="text-black whitespace-nowrap">(</label>
      <input
        type="text"
        value={nameBoss}
        className="border-b border-black text-center focus:outline-none text-black w-[90%] mx-2"
      />
      <label className="text-black whitespace-nowrap">)</label>
    </div>
    <p className="mt-3 ml-5">
      นายจ้าง (ผู้มีอำนาจลงนาม)
    </p>
  </div> 
</div>

</div>
</div>

             {/* ปุ่มดาวโหลด */}
<div className="flex justify-center item-center absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <button  onClick={handleFormSubmit} 
        className="bg-[#5A975E] download-button text-center">
          download
        </button>
      </div>

      </div>
      </div>


    </div>
 );
}

export default SafetyReportFormDangerAndLoss;