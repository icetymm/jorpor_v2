//แบบบันทึกการสอบสวนอุบัติเหตุ
//form_accidentinvestigate
"use client";
import React, { useState, useEffect ,useRef} from 'react';
import '../../globals.css';
import '@fontsource/mitr';
import { IoMdDownload } from "react-icons/io";
import { Document, Packer, Paragraph, Table, TableRow, TableCell, AlignmentType,VerticalAlign,TableLayoutType,ImageRun , TextDirection, TextRun, BorderStyle, WidthType, PageOrientation } from "docx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { th } from "date-fns/locale";
import axios from "axios";

const SafetyReportFormAccidentInvetigate = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [image, setImage] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [zones, setZones] = useState([]);
  const [times, setTimes] = useState([]);
  const [dates, setDates] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [details, setDetails] = useState(null);
  const [detail, setDetail] = useState('');
  const [fileName, setFileName] = useState(null);
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [lastname, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [study, setStudy] = useState('');
  const [work, setWork] = useState('');
  const [experiencework, setExperience] = useState('');
  const [amoutexperiencework, setAmoutexperiencework] = useState('');
  const [die, setDie] = useState(false);
  const [disappear, setDisappear] = useState(false);
  const [detaildisappear, setDetaildisappear] = useState('');
  const [injured, setInjured] = useState(false);
  const [detailinjured, setDetailinjured] = useState('');
  const [stop, setStop] = useState(false);
  const [manystop, setManystop] = useState('');
  const [nostop, setNostop] = useState(false);
  const [medical, setMedical] = useState(false);
  const [manymedical, setManymedical] = useState('');
  const [compensation, setCompensation] = useState(false);
  const [manycompensation, setManyCompensation] = useState('');
  const [repair, setRepair] = useState(false);
  const [manyrepair, setManyRepair] = useState('');
  const [expenses, setExpenses] = useState(false);
  const [manyexpenses, setManyexpenses] = useState('');
  const [otherdata, setOtherdata] = useState('');
  const [imageFile, setImageFile] = useState(null);
  


  // สร้าง useEffect สำหรับแต่ละตัวแปร
useEffect(() => {
  if (detaildisappear !== "") {
    setDisappear(true); 
  } else {
    setDisappear(false); 
  }
}, [detaildisappear]);

useEffect(() => {
  if (detailinjured !== "") {
    setInjured(true); 
  } else {
    setInjured(false); 
  }
}, [detailinjured]);

useEffect(() => {
  if (manystop !== "") {
    setStop(true); 
  } else {
    setStop(false); 
  }
}, [manystop]);

useEffect(() => {
  if (manymedical !== "") {
    setMedical(true); 
  } else {
    setMedical(false); 
  }
}, [manymedical]);

useEffect(() => {
  if (manycompensation !== "") {
    setCompensation(true); 
  } else {
    setCompensation(false); 
  }
}, [manycompensation]);

useEffect(() => {
  if (manyrepair !== "") {
    setRepair(true); 
  } else {
    setRepair(false); 
  }
}, [manyrepair]);

useEffect(() => {
  if (manyexpenses !== "") {
    setExpenses(true); 
  } else {
    setExpenses(false); 
  }
}, [manyexpenses]);

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

  //ดึงข้อมูลวันที่เกิดเหตุ
  const fetchDate = async (zone) => {
    try {
      const response = await fetch("/api/form_accident", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: 'fetchDates',
          payload: { zone } 
        }), 
      });

      const result = await response.json();

    if (result.success) {
      // Flatten data
      const flattenedData = result.data.flat(); // ลดระดับของ array
      
      setDates(flattenedData); // ตั้งค่า dates ใน state
    } else {
      setDates([]); // รีเซ็ตวันที่
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

 // ฟังก์ชันเพื่อดึงเวลาเมื่อเลือกวันที่
 const fetchTimes = async (date) => {

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

const formatTime = (time) => {
  // แปลงเวลาในรูปแบบ "HH:MM:SS" ให้เป็น "HH:mm"
  const timeArray = time.split(':');  // แยกชั่วโมง, นาที
  const hours = timeArray[0];
  const minutes = timeArray[1];

  // รูปแบบการแสดงผลที่เข้าใจง่าย
  return `${hours}:${minutes}`;
};

const fetchImageFromBuffer = (fileBuffer) => {
  try {
    if (fileBuffer && Array.isArray(fileBuffer)) {
      const uint8Array = new Uint8Array(fileBuffer); // แปลงข้อมูล Array เป็น Uint8Array
      const blob = new Blob([uint8Array], { type: 'image/jpeg' }); // กำหนดประเภทเป็น 'image/jpeg'
      const imageUrl = URL.createObjectURL(blob); // สร้าง URL จาก Blob
      setImage(imageUrl); // ตั้งค่า URL ของรูปภาพใน state
    } else {
      console.error("Invalid file buffer:", fileBuffer);
    }
  } catch (error) {
    console.error("Error creating image from Buffer:", error);
  }
};
// ฟังก์ชันเพื่อดึงรายละเอียดเมื่อเลือกเวลาและโซน
const fetchDetails = async (date, time) => {
  const offset = new Date(date).getTimezoneOffset() * 60000;
  const localDate = new Date(new Date(date).getTime() - offset); 
  const formattedDate = localDate.toISOString().split('T')[0]; // YYYY-MM-DD

  const response = await fetch('/api/form_accident', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'fetchDetails',
      payload: { date: formattedDate, time }
    }), 
  });

  const data = await response.json();
  console.log('Fetched Details:', data.data);

  if (data.success && data.data && typeof data.data === 'object') {
    setDetail(data.data.detail || '');  // ตั้งค่า detail
    setFileName(data.data.file_name || ''); // ตั้งค่า file_name
    setTitle(data.data.title || ''); // ตั้งค่า title

    if (data.data.file_name && data.data.file_name.type === 'Buffer') {
      fetchImageFromBuffer(data.data.file_name.data);
    }
  } else {
    console.log('No data or error:', data.message);
  }
};


const handleFetchedData = (data) => {
  if (data) {
    setDetail(data.detail || ''); // ตั้งค่า detail
    setFileName(data.file_name || ''); // ตั้งค่า file_name
    setTitle(data.title || ''); // ตั้งค่า title
  }
};


const handleTimeChange = async (time) => {
  setSelectedTime(time);

  // ดึงข้อมูลรายละเอียดเมื่อเลือกเวลา
  if (selectedDate && time) {
    await fetchDetails(selectedDate, time);
  }
};
 
  
  useEffect(() => {
    
    fetchZones(); 
    const today = new Date();
    const formattedDate = today.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
    setCurrentDate(formattedDate);
    handleFetchedData();
    
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  /*const imageToBase64 = (buffer) => {
    const binary = String.fromCharCode.apply(null, buffer);
    return `data:image/png;base64,${btoa(binary)}`;
  };*/
  
  
  /*const handleFormSubmit = () => {
    if (
      !businessName ||
      !businessType ||
      !selectedZone ||
      !selectedDate ||
      !selectedTime ||
      !name ||
      !lastname ||
      !age ||
      !study ||
      !work ||
      !experiencework ||
      !amoutexperiencework ||
      !title 
      //|| !detail
    ) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน!');
      return;
    }
    generateDOCX(); // ถ้ากรอกครบแล้ว, เรียกฟังก์ชันดาวน์โหลด
  };*/
  const handleFormSubmit = () => {
    if (
      !businessName ||
      !businessType ||
      !selectedZone ||
      !selectedDate ||
      !selectedTime ||
      !name ||
      !lastname ||
      !age ||
      !study ||
      !work ||
      !experiencework ||
      !amoutexperiencework ||
      !title 
    ) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน!');
      return;
    }

    try {
      generateDOCX(); // สร้างเอกสาร

      setTimeout(() => {
        alert('สร้างเอกสารสำเร็จ!'); 
        window.location.reload(); // รีเฟรชหน้าเว็บ
      }, 3000); 
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการสร้างเอกสาร:', error);
      alert('เกิดข้อผิดพลาดในการสร้างเอกสาร กรุณาลองใหม่!');
    }
};


  //ไฟล์เอกสาร
const generateDOCX = async () => {
  try {

    
     // ตรวจสอบว่า fileName มีค่าหรือไม่
  if (!fileName || !fileName.data) {
    console.error("Missing image data in file_name.");
    return;
  }

  // กำหนด imageBuffer ให้ถูกต้อง
  const imageBuffer = new Uint8Array(fileName.data);

  const imageToBase64 = (buffer) => {
    const binary = Array.from(buffer, (byte) => String.fromCharCode(byte)).join('');
    return `data:image/png;base64,${btoa(binary)}`;
  };

  const image = new ImageRun({
    data: imageBuffer, // หรือ imageBase64 ที่คุณได้แปลงมาแล้ว
    transformation: { width: 300, height: 300 },
  });
  

  const imageBase64 = imageToBase64(imageBuffer);

  // ตรวจสอบว่า imageBase64 มีค่า
  if (!imageBase64) {
    console.error("Image data is empty or not properly loaded.");
    return;
  }

    const formattedTime = selectedTime ? formatTime(selectedTime) : "................................";
    const formattedDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString("th-TH", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "...................................................................";
    const doc = new Document({
      sections: [],
    });

    const getCheckSymbol = (value) => (value === true ? "✓" : "   ");
    const content = [];
     
   
    // หัวข้อเอกสาร
    content.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "แบบบันทึกการสอบสวนอุบัติเหตุ",
            font: "TH SarabunPSK",
            bold: true,
            size: 32,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "ชื่อสถานประกอบการ  ", font: "TH SarabunPSK", size: 32 }),
          new TextRun({ text:  businessName || "............................................................"  , font: "TH SarabunPSK", size: 32 }),
          new TextRun({ text: "\t\t", font: "TH SarabunPSK", size: 32 }), // เพิ่มแท็บเพื่อเพิ่มระยะห่าง
          new TextRun({ text: "ประเภทกิจการ  ", font: "TH SarabunPSK", size: 32 }),
          new TextRun({ text:  businessType || "................................................." ,font: "TH SarabunPSK", size: 32 }),
        ],
         tabStops: [
          {
            type: "left", 
            position: 6440, 
          },
        ],
        spacing: { after: 0 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "สถานที่เกิดอุบัติเหตุ⠀ ", font: "TH SarabunPSK", size: 32 }),
          new TextRun({ text: selectedZone || "..........................................................................." ,font: "TH SarabunPSK", size: 32 }),
        ],
        spacing: { after: 0 },
      }),
      new Paragraph({
          children: [
            new TextRun({ text: "วันที่เกิดอุบัติเหตุ  ", font: "TH SarabunPSK", size: 32 }),
            new TextRun({ text: `⠀⠀${formattedDate}⠀⠀⠀⠀` ,font: "TH SarabunPSK", size: 32 }),
            new TextRun({ text: "\t\t", font: "TH SarabunPSK", size: 32 }), // เพิ่มแท็บเพื่อเพิ่มระยะห่าง
            new TextRun({ text: "เวลา  ", font: "TH SarabunPSK", size: 32 }),
            new TextRun({ text:  `${formattedTime} น.`  ,font: "TH SarabunPSK", size: 32 }),
       ],
       tabStops: [
        {
          type: "left", 
          position: 6440, 
        },
      ],
          spacing: { after: 400 },
        }),
      new Paragraph({
          children: [
            new TextRun({ text: "1. รายละเอียดผู้บาดเจ็บ", font: "TH SarabunPSK", size: 32 }),
       ],
          spacing: { after: 0 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "ชื่อ ", font: "TH SarabunPSK", size: 32 }),
            new TextRun({
              text: name ,
              font: "TH SarabunPSK",
              size: 32,
            }),
            new TextRun({ text: "\tสกุล ", font: "TH SarabunPSK", size: 32 }),
            new TextRun({
              text: lastname ,
              font: "TH SarabunPSK",
              size: 32,
            }),
            new TextRun({ text: "\tอายุ⠀⠀", font: "TH SarabunPSK", size: 32 }),
            new TextRun({
              text: age ,
              font: "TH SarabunPSK",
              size: 32,
            }),
          ],
          tabStops: [
            {
              type: "left",
              position: 4000, 
            },
            {
              type: "left",
              position: 7200, 
            }
          ],
          spacing: { after: 0 },
        }),
        
        /*new Paragraph({
          children: [
            new TextRun({ text: "ชื่อ ", font: "TH SarabunPSK", size: 32 }),
            new TextRun({
              text: name || "................................................." ,
              font: "TH SarabunPSK",
              size: 32,
            }),
            new TextRun({ text: "\t", font: "TH SarabunPSK", size: 32 }), // เพิ่มแท็บ
            new TextRun({ text: "⠀⠀⠀⠀สกุล ", font: "TH SarabunPSK", size: 32 }),
            new TextRun({
              text: lastname || ".................................." ,
              font: "TH SarabunPSK",
              size: 32,
            }),
            new TextRun({ text: "\t\t\t", font: "TH SarabunPSK", size: 32 }), // เพิ่มแท็บ
            new TextRun({ text: "อายุ⠀⠀", font: "TH SarabunPSK", size: 32 }),
            new TextRun({
              text: age || ".........",
              font: "TH SarabunPSK",
              size: 32,
            }),
          ],
          tabStops: [
            {
              type: "left" ,
              position: 900 , 
            },
          ],
        }),*/
        
        new Paragraph({
          children: [
            new TextRun({ text: "การศึกษา  ", font: "TH SarabunPSK", size: 32 }),
            new TextRun({ text: study|| "               -              " ,font: "TH SarabunPSK", size: 32 }),
            new TextRun({ text: "\tหน้าที่งาน  ", font: "TH SarabunPSK", size: 32 }),
            new TextRun({ text: work , font: "TH SarabunPSK", size: 32 }),
          ],
          tabStops: [
            {
              type: "left",
              position: 5840, 
            },
          ],
          spacing: { after: 0 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "อายุงานในแผนก", font: "TH SarabunPSK", size: 32 }),
            new TextRun({ text: "\t", font: "TH SarabunPSK", size: 32 }), // แท็บสำหรับระยะห่างหลังคำว่า "อายุงานในแผนก"
            new TextRun({
              text: experiencework || " 0 ",
              font: "TH SarabunPSK",
              size: 32,
            }),
            new TextRun({ text: "\t", font: "TH SarabunPSK", size: 32 }), // แท็บสำหรับคำว่า "ปี"
            new TextRun({ text: "ปี", font: "TH SarabunPSK", size: 32 }),
            new TextRun({ text: "\t", font: "TH SarabunPSK", size: 32 }), // แท็บสำหรับตัวเลข "เดือน"
            new TextRun({
              text: amoutexperiencework || " 0 ",
              font: "TH SarabunPSK",
              size: 32,
            }),
            new TextRun({ text: "\t", font: "TH SarabunPSK", size: 32 }), // แท็บสำหรับเลื่อนไปยังขอบขวา
            new TextRun({ text: "เดือน", font: "TH SarabunPSK", size: 32 }),
          ],
          tabStops: [
            {
              type: "left",
              position: 4000, // แท็บตำแหน่งแรก
            },
            {
              type: "left",
              position: 6000, // แท็บตำแหน่งที่สอง (สำหรับ "ปี")
            },
            {
              type: "left",
              position: 8000, // แท็บตำแหน่งที่สอง (สำหรับ "เดือน")
            },
            {
              type: "right",
              position: 10000, // แท็บตำแหน่งที่สาม (ขอบขวาสุด)
            },
          ],
          spacing: { after: 0 },
        }),
        
        /*new Paragraph({
          children: [
            new TextRun({ text: "อายุงานในแผนก", font: "TH SarabunPSK", size: 32 }),
            new TextRun({ text: "\t\t", font: "TH SarabunPSK", size: 32 }), // แท็บสำหรับระยะห่างหลังคำว่า "อายุงานในแผนก"
            new TextRun({
              text: experiencework || ".......................................",
              font: "TH SarabunPSK",
              size: 32,
            }),
            new TextRun({ text: "\t\t", font: "TH SarabunPSK", size: 32 }), // แท็บสำหรับคำว่า "ปี"
            new TextRun({ text: "ปี", font: "TH SarabunPSK", size: 32 }),
            new TextRun({ text: "\t\t", font: "TH SarabunPSK", size: 32 }), // แท็บสำหรับตัวเลข "เดือน"
            new TextRun({
              text: amoutexperiencework || "................................." ,
              font: "TH SarabunPSK",
              size: 32,
            }),
            new TextRun({ text: "\t\t", font: "TH SarabunPSK", size: 32 }), // แท็บสำหรับเลื่อนไปยังขอบขวา
            new TextRun({ text: "เดือน", font: "TH SarabunPSK", size: 32 }),
          ],
          tabStops: [
            {
              type: "left",
              position: 3000, // แท็บตำแหน่งแรก
            },
            {
              type: "left",
              position: 5000, // แท็บตำแหน่งที่สอง (สำหรับ "ปี")
            },
            {
              type: "left",
              position: 7000, // แท็บตำแหน่งที่สอง (สำหรับ "ปี")
            },
            {
              type: "right",
              position: 9000, // แท็บตำแหน่งที่สาม (ขอบขวาสุด)
            },
          ],
          spacing: { after: 0 },
        }), */         
        new Paragraph({
          children: [
            new TextRun({ text: "2. ผลของอุบิติเหตุ ทำเครื่องหมาย ✓ ในช่อง ( ) หน้าข้อความ ", font: "TH SarabunPSK", size: 32 }),
           ],
          spacing: { after: 0 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `⠀⠀( ${getCheckSymbol(die)} )  ตาย`,
              font: "TH SarabunPSK",
              size: 32,
            }),
          ],
          spacing: { after: 0 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `⠀⠀( ${getCheckSymbol(disappear)} )  สูญเสียอวัยวะ (โปรดระบุสภาพ)  ${detaildisappear || "..........................................................................................................................."}`,
              font: "TH SarabunPSK",
              size: 32,
            }),
          ],
          spacing: { after: 0 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `⠀⠀( ${getCheckSymbol(injured)} )  ส่วนของร่างกายได้รับบาดเจ็บ (โปรดระบุสภาพ)  ${detailinjured || ".................................................................................................."}`,
              font: "TH SarabunPSK",
              size: 32,
            }),
          ],
          spacing: { after: 0 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `⠀⠀( ${getCheckSymbol(stop)} )  หยุดงาน  ${manystop || "......................................"}  ชม./วัน.`,
              font: "TH SarabunPSK",
              size: 32,
            }),
            new TextRun({ text: "\t", font: "TH SarabunPSK", size: 32 }),
            new TextRun({
              text: `⠀⠀( ${getCheckSymbol(nostop)} ) ไม่มีการหยุดงาน`,
              font: "TH SarabunPSK",
              size: 32,
            }),
          ],
          tabStops: [
            {
              type: "left",
              position: 5800,
            }
          ],
          spacing: { after: 0 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "3. การสูญเสีย ทำเครื่องหมาย ✓ ในช่อง ( ) หน้าข้อความ",
              font: "TH SarabunPSK",
              size: 32,
            }),
          ],
          spacing: { after: 0 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `⠀⠀( ${getCheckSymbol(medical)} ) ค่ารักษาพยาบาล  ${manymedical || "             -            "} บาท`,
              font: "TH SarabunPSK",
              size: 32,
            }),
            new TextRun({ text: "\t", font: "TH SarabunPSK", size: 32 }),
            new TextRun({
              text: `⠀⠀⠀⠀⠀⠀( ${getCheckSymbol(compensation)} )`,
              font: "TH SarabunPSK",
              size: 32,
            }),
            new TextRun({
              text: ` ค่าทดแทน          ${manycompensation || "    -"}                    บาท`,
              font: "TH SarabunPSK",
              size: 32,
            }),

          ],
          tabStops: [
            {
              type: "left",
              position: 5000,
            }
          ],
          spacing: { after: 0 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `⠀⠀( ${getCheckSymbol(repair)} ) ค่าซ่อมแซม (เครื่องจักร, อุปกรณ์อื่นๆ)  ${manyrepair || "                               -                                                   " } บาท`,
              font: "TH SarabunPSK",
              size: 32,
            }),
          ],
          spacing: { after: 0 },
        }),
        
        new Paragraph({
          children: [
            new TextRun({ text:`⠀⠀( ${getCheckSymbol(expenses)} ) ค่าใช้จ่ายอื่นๆ ${manyexpenses || "                                                              -                                                  " } บาท`, font: "TH SarabunPSK", size: 32 }),
          ],
          spacing: { after: 200 },
        }),
        
        );

        const table = new Table({
          rows: [
            // แถวสำหรับข้อ 4
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 50, type: WidthType.PERCENTAGE }, 
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: "4. รายละเอียดการอุบัติเหตุ (อุบัติเหตุเกิดขึ้นได้อย่างไร)", font: "TH SarabunPSK", size: 32 })],
                    }),
                    new Paragraph({
                      children: [new TextRun({ text: detail || "                               -                               " ,font: "TH SarabunPSK", size: 32 })],
                    }),
                  ],
                  width: { size: 5035, type: WidthType.DXA },
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                  verticalAlign: "top",
                }),
                new TableCell({
                  rowSpan: 2, // ผสานเซลในแถวที่ 4 และ 5
                  width: { size: 50, type: WidthType.PERCENTAGE }, 
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: "รูปแสดงการเกิดอุบัติเหตุ",
                          font: "TH SarabunPSK",
                          size: 32,
                        }),
                      ],
                    }),
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new ImageRun({
                          data: imageBuffer, // บัฟเฟอร์ภาพ
                          transformation: { width: 200, height: 210 },
                        }),
                      ],
                    }),
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: " ",
                          font: "TH SarabunPSK",
                          size: 32,
                        }),
                      ],
                    }),
                  ],
                  borders: {
                    top: { style: BorderStyle.SINGLE, size: 2 },
                    bottom: { style: BorderStyle.SINGLE, size: 3 },
                    left: { style: BorderStyle.SINGLE, size: 2 },
                    right: { style: BorderStyle.SINGLE, size: 2 },
                  },
                }),
              ],           
               spacing: { before: 400 },

            }),
            // แถวสำหรับข้อ 5 (ไม่สร้างคอลัมน์รูปภาพใหม่)
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: "5. ข้อมูลอื่นๆ", font: "TH SarabunPSK", size: 32 })],
                    }),
                    new Paragraph({
                      children: [new TextRun({ text: otherdata || "                               -                           " ,font: "TH SarabunPSK", size: 32 })],
                    }),
                  ],
                  width: { size: 4535, type: WidthType.DXA },
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                  verticalAlign: "top",
                }),
              ],
            }),
          ],
          layout: TableLayoutType.FIXED, // กำหนดตารางเป็นแบบ FIXED
          width: { size: 100, type: WidthType.PERCENTAGE }, // ตารางแบบเต็มความกว้าง
          borders: {
            top: { style: "none", size: 0, color: "FFFFFF" },
            bottom: { style: "none", size: 0, color: "FFFFFF" },
            left: { style: "none", size: 0, color: "FFFFFF" },
            right: { style: "none", size: 0, color: "FFFFFF" },
            insideHorizontal: { style: "none", size: 0, color: "FFFFFF" },
            insideVertical: { style: "none", size: 0, color: "FFFFFF" },
          },
        });
        
  // เพิ่มตารางลงในเอกสาร
  content.push(table);

// เพิ่มตารางลงในเอกสาร
doc.addSection({
  properties: {
    page: {
      size: {
        width: 11906, // ขนาดหน้ากระดาษ A4
        height: 16838,
      },
      margin: {
        top: 720,
        right: 720,
        bottom: 720,
        left: 720,
      },
    },
  },
  children: content,
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
    link.download = "แบบบันทึกการสอบสวนอุบัติเหตุ.docx";
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
        fileName: "แบบบันทึกการสอบสวนอุบัติเหตุ",
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
        height: "366mm", // ความสูงของ A4
        marginTop: "100px", // ระยะห่างจากขอบบน
        marginBottom: "100px", // ระยะห่างจากขอบล่าง
        backgroundSize: 'contain', // ไม่ให้ขยายภาพพื้นหลังให้เต็มพื้นที่
        backgroundRepeat: 'no-repeat', // ป้องกันไม่ให้ภาพพื้นหลังซ้ำ
      }}
    >

        {/* Form */}
      <div className="p-8">
        {/* Header */}
        <div className="text-end mb-5">
          <h1 className="text-lg text-center text-black font-bold">
            แบบบันทึกการสอบสวนอุบัติเหตุ
          </h1>
        </div>
 
        {/* Form Content */}
        <div className="space-y-6 text-black">
          {/* หัวเรื่อง */}
          <div className="flex items-center justify-start w-full flex-wrap">
          <label className="text-black whitespace-nowrap mr-1">ชื่อสถานประกอบการ</label>
          <input
            type="text" id="name" name="name" 
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            style={{
              width: "30%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
          <label className="text-black whitespace-nowrap ml-4 mr-1">ประเภทกิจการ</label>
          <input
            type="text" id="type" name="type" 
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)} 
            style={{
              width: "30%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
        </div>

        {/** สถานที่เกิดเหตุ */}
        <div className="flex items-center w-[99%]">
        <label className="text-black whitespace-nowrap mr-1">สถานที่เกิดอุบัติเหตุ</label>
        <select
            value={selectedZone}
            onChange={(e) => {
              const location = e.target.value
             setSelectedZone(location); // เก็บข้อมูลที่เลือก
              if (location) {
                fetchDate(location); // เรียก fetchDate เมื่อเลือกผู้ใช้
              }
            }}
            style={{
              width: "78%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}          
            >
            <option value="">-- กรุณาระบุสถานที่เกิดอุบัติเหตุ --</option>
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

        {/** วันที่เกิดเหตุ และเวลา */}
        <div className="flex items-center justify-start w-full flex-wrap">
      <label className="text-black whitespace-nowrap mr-5">วันที่เกิดอุบัติเหตุ</label>
      <select
            value={selectedDate}
            onChange={(e) => {
              const date = e.target.value
             setSelectedDate(date); // เก็บข้อมูลที่เลือก
              if (date) {
                fetchTimes(date); // เรียก fetchDate เมื่อเลือกผู้ใช้
              }
            }}            
            style={{
              width: "31%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}          
            >
            <option value="">-- กรุณาระบุวันที่ --</option>
            {Array.isArray(dates) && dates.length > 0 ? (
  dates.map((item, index) => (
    <option key={index} value={item.date}>
      {item.formatted_date}
    </option>
  ))
) : (
  <option value="">ไม่มีวันที่ตรวจสอบความปลอดภัย</option>
)}
          </select>

 <label className="text-black whitespace-nowrap mr-1 ml-5">เวลาที่เกิดอุบัติเหตุ</label>
 <select id="timeSelect" 
          value={selectedTime}  
          style={{
            width: "27%",
            padding: "6px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "14px",
          }} 
          onChange={(e) => handleTimeChange(e.target.value)}>
  <option value="" disabled>-- กรุณาระบุเวลา --</option>
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

            { /* 1 */}
            <div className="flex items-center justify-start w-full flex-wrap">
              <label className="text-black">1. รายละเอียดผู้บาดเจ็บ</label>
            </div>
            <div className="flex items-center justify-start w-full flex-wrap">
              <label className="text-black mr-1">ชื่อ</label>
              <input
            type="text" id="time" name="time" 
            value={name}
            onChange={(e) => setName(e.target.value)} 
            style={{
              width: "30%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
               <label className="text-black mr-1 ml-2">สกุล</label>
               <input
            type="text" id="time" name="time" 
            value={lastname}
            onChange={(e) => setLastName(e.target.value)} 
            style={{
              width: "30%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
              <label className="text-black mr-1 ml-2">อายุ</label>
              <input
            type="text" id="time" name="time" 
            value={age}
            onChange={(e) => setAge(e.target.value)} 
            style={{
              width: "21%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
            className="border-b border-black focus:outline-none text-black text-center"
          />
            </div>

              <div className="flex items-center justify-start w-full flex-wrap">
              <label className="text-black mr-1">การศึกษา</label>
              <input
            type="text" id="educate" name="educate" 
            value={study}
            onChange={(e) => setStudy(e.target.value)} 
            style={{
              width: "37%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
               <label className="text-black mr-1 ml-2">หน้าที่งาน</label>
               <input
            type="text" id="role" name="role" 
            value={work}
            onChange={(e) => setWork(e.target.value)} 
            style={{
              width: "39%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
            </div>
            
            <div className="flex items-center justify-start w-full flex-wrap">
            <label className="text-black text-center mr-1">อายุงานในแผนก</label>
            <input
            type="text" id="age" name="age" 
            value={experiencework}
            onChange={(e) => setExperience(e.target.value)} 
            style={{
              width: "51%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
            className="border-b border-black focus:outline-none text-black text-center"
          />
               <label className="text-black mr-1 ml-2">ปี</label>
               <input
            type="text" id="year" name="year" 
            value={amoutexperiencework}
            onChange={(e) => setAmoutexperiencework(e.target.value)} 
            style={{
              width: "20%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
            className="border-b border-black w-[20%] focus:outline-none text-black text-center"
          />
              <label className="text-black">เดือน</label>

            </div>

            
            { /* 2 */}
          <div className="flex justify-start">
            <div>
              <label className="text-black">2. ผลของอุบิติเหตุ ทำเครื่องหมาย / ในช่อง ( ) หน้าข้อความ </label>
            </div>
            </div>

              {/** ตาย */}
            <div className="flex justify-start">
            <div>
          <input
            type="checkbox"
            id="custom-checkbox"
            className="custom-checkbox" 
            checked={die}
            onChange={(e) => setDie(e.target.checked)}
          />
           <label className="text-black whitespace-nowrap mr-2 ml-6">
           ตาย</label>
        </div>
            </div>

            {/** สูญเสียอวัยวะ */}
            <div className="flex items-center">
            <input
   type="checkbox"
   id="custom-checkbox"
   className="custom-checkbox" 
    checked={disappear}
    value={'true'}
    onChange={(e) => setDisappear(e.target.checked)}
  />
  <label className="text-black whitespace-nowrap mr-2 ml-6">
    สูญเสียอวัยวะ (โปรดระบุสภาพ)
  </label>
  <input
    type="text"
    value={detaildisappear}
    onChange={(e) => setDetaildisappear(e.target.value)}
    className="border-b border-black focus:outline-none text-black text-center flex-1"
    style={{
      minWidth: "150px",       // ความกว้างขั้นต่ำ
      width: "auto",           // ปรับความกว้างอัตโนมัติ
    }}
  />
</div>

              {/** ส่วนของร่างกายได้รับบาดเจ็บ */}
            <div className="flex items-center">
                <input
                type="checkbox"
                id="custom-checkbox"
                className="custom-checkbox" 
                checked={injured}
                onChange={(e) => setInjured(e.target.checked)}
                />
                  <label className="text-black whitespace-nowrap mr-2 ml-6">
                  ส่วนของร่างกายได้รับบาดเจ็บ ⠀⠀(โปรดระบุสภาพ)</label>
                <input
                type="text"
                value={detailinjured}
                onChange={(e) => setDetailinjured(e.target.value)}
                className="border-b border-black focus:outline-none text-black text-center flex-1"
                style={{
                  minWidth: "150px",       // ความกว้างขั้นต่ำ
                  width: "auto",           // ปรับความกว้างอัตโนมัติ
                }}              
                />
            </div>

              {/** หยุดงาน */}
            <div className="flex items-center">
            <div>
                <input
                type="checkbox"
                id="custom-checkbox"
                className="custom-checkbox" 
                checked={stop}
                onChange={(e) => setStop(e.target.checked)}
                />
                 <label className="text-black whitespace-nowrap mr-2 ml-6">
                 หยุดงาน</label>
                <input
                type="text"
                value={manystop}
                onChange={(e) => setManystop(e.target.value)}
                className="border-b border-black focus:outline-none text-black text-center flex-1"
                style={{
                  minWidth: "150px",       // ความกว้างขั้นต่ำ
                  width: "auto",           // ปรับความกว้างอัตโนมัติ
                }} 
                />
                <label className="text-black">ชม./วัน</label>
                <label className="text-black">⠀⠀⠀⠀⠀⠀ </label>
                <input
                  type="checkbox"
                  id="custom-checkbox"
                  className="custom-checkbox"                 
                  checked={nostop}
                  onChange={(e) => setNostop(e.target.checked)}
                />
                <label className="text-black"> ⠀ไม่มีการหยุดงาน</label>
               </div>
            </div>

            {/** 3 * */}
            <div className="flex justify-start">
            <div>
              <label className="text-black">3. การสูญเสีย ทำเครื่องหมาย / ในช่อง ( ) หน้าข้อความ</label>
               </div>
            </div>

            <div className="flex justify-start">
                <input
                  type="checkbox"
                  id="custom-checkbox"
                  className="custom-checkbox"                 
                  checked={medical}
                onChange={(e) => setMedical(e.target.checked)}
                />
                <label className="text-black"> ⠀⠀ค่ารักษาพยาบาล</label>
                <input
                type="text"
                value={manymedical}
                onChange={(e) => setManymedical(e.target.value)}
                className="border-b border-black w-[27%] focus:outline-none text-black text-center"
              />
                <label className="text-black">บาท</label>
                <label className="text-black">⠀⠀⠀</label>
                <input
                type="checkbox"
                id="custom-checkbox"
                className="custom-checkbox" 
                checked={compensation}
                onChange={(e) => setCompensation(e.target.checked)}
                />
                <label className="text-black"> ⠀ค่าทดแทน</label>
                <input
                type="text"
                value={manycompensation}
                onChange={(e) => setManyCompensation(e.target.value)}
                className="border-b border-black focus:outline-none text-black text-center flex-1"
                style={{
                  minWidth: "150px",       // ความกว้างขั้นต่ำ
                  width: "auto",           // ปรับความกว้างอัตโนมัติ
                }}              />
                <label className="text-black">บาท</label>
            </div>

            <div className="flex justify-start">
                <input
                type="checkbox"
                id="custom-checkbox"
                className="custom-checkbox" 
                checked={repair}
                onChange={(e) => setRepair(e.target.checked)}
                />
                <label className="text-black"> ⠀⠀ค่าซ่อมแซม (เครื่องจักร, อุปกรณ์อื่นๆ)</label>
                <input
                type="text"
                value={manyrepair}
                onChange={(e) => setManyRepair(e.target.value)}
                className="border-b border-black focus:outline-none text-black text-center flex-1"
                style={{
                  minWidth: "150px",       // ความกว้างขั้นต่ำ
                  width: "auto",           // ปรับความกว้างอัตโนมัติ
                }}              />
                <label className="text-black">บาท</label>
            </div>

            <div className="flex justify-start">
                <input
                type="checkbox"
                id="custom-checkbox"
                className="custom-checkbox" 
                checked={expenses}
                onChange={(e) => setExpenses(e.target.checked)}
                />
                <label className="text-black">⠀⠀ค่าใช้จ่ายอื่นๆ</label>
                <input
                type="text"
                value={manyexpenses}
                onChange={(e) => setManyexpenses(e.target.value)}
                className="border-b border-black focus:outline-none text-black text-center flex-1"
                style={{
                  minWidth: "150px",       // ความกว้างขั้นต่ำ
                  width: "auto",           // ปรับความกว้างอัตโนมัติ
                }}              />
                <label className="text-black">บาท</label>
            </div>

            {/** 4 * */}
            <div className="flex items-center">
        <label className="text-black whitespace-nowrap mr-1">4. รายละเอียดการอุบัติเหตุ</label>
        <input
        type="text"
        id="detail"
        name="detail"
        value={`${title} - ${detail}`} // รวม title และ detail
        onChange={(e) => {
          const [newTitle, newDetail] = e.target.value.split(' - '); // แยก title และ detail
          setTitle(newTitle || ''); // อัปเดต title
          setDetail(newDetail || ''); // อัปเดต detail
        }}
            style={{
              width: "70%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
        </div>

            {/** 5 * */}
            <div className="flex items-center">
        <label className="text-black whitespace-nowrap mr-1">5. ข้อมูลอื่นๆ</label>
        <input
            type="text" id="year" name="year" 
            value={otherdata}
            onChange={(e) => setOtherdata(e.target.value)}
            style={{
              width: "82%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
    </div>

    <div className="flex items-start justify-start w-full flex-wrap mt-5">
      <label className="text-black mr-2">รูปการเกิดอุบัติเหตุ:</label>
      
      <div className={`border-2 border-dotted ${image ? 'border-green-800' : 'border-gray-400'} w-[70%] h-[220px] flex justify-center items-center`}>
        {image ? (
          <img src={image} alt="Uploaded" className="w-full h-full object-contain mt-2 mb-2 " />
        ) : (
          <span className="text-gray-500">ไม่มีไฟล์รูป</span>
        )}
      </div>

      {/* ช่องเลือกไฟล์ 
      <input
        type="file"
        onChange={handleImageChange}
        accept="image/*"
        className="w-[80%] mt-2"
      />*/}
    </div>

        </div>
          
{/* แสดงรูปภาพที่ผู้ใช้เลือก 
{image && (
  <div className="flex w-full justify-start mt-5">
    <img
      src={image}
      alt="Uploaded"
      className="w-[90px] h-auto rounded-lg shadow-lg"
    />
  </div>
)} */}

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

export default SafetyReportFormAccidentInvetigate;