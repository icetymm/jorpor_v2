//แบบ สปร 5

"use client";

import React, { useState, useEffect } from 'react';
import '../../globals.css';
import '@fontsource/mitr';
import { Document, Packer, Header, Paragraph, Table, TableRow, TableCell, AlignmentType, TextRun, BorderStyle, WidthType } from "docx";
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { th } from "date-fns/locale";
import axios from 'axios';


const SafetyReportFormSeriousAccident = () => {
  const [currentDate, setCurrentDate] = useState({
    day: "",
    month: "",
    year: "",
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [dates, setDates] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [registerNum, setRegisterNum] = useState([]);
  const [times, setTimes] = useState([]);
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [amountPeople, setAmountPeople] = useState('');
  const [provinces, setProvinces] = useState([]);
  const [amphoes, setAmphoes] = useState([]);
  const [tambons, setTambons] = useState([]);
  const [zipcode, setZipcode] = useState("");
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedAmphoe, setSelectedAmphoe] = useState(null);
  const [selectedTambon, setSelectedTambon] = useState(null);
  const [addressNumber, setAddressNumber] = useState("");
  const [villageNumber, setVillageNumber] = useState("");
  const [alley, setAlley] = useState(""); //ตรอก/ซอย
  const [street, setStreet] = useState("");
  const [phone, setPhone] = useState("");
  const [fax, setFax] = useState("");
  const [zones, setZones] = useState([]);
  const [die, setDie] = useState(false);
  const [amountDie, setAmountDie] = useState("");
  const [injured, setInjured] = useState(false);
  const [amountInjured, setAmountInjured] = useState("");
  const [propDamage, setPropDamage] = useState(false);
  const [amountDamage, setAmountDamage] = useState("");
  const [stopProduction, setStopProduction] = useState(false);
  const [causeAccident, setCauseAccident] = useState('');
  const [detectAccident, setDetectAccident] = useState('');
  const [postion, setPosition] = useState('');
  const [name, setName] = useState('');

 // สร้าง useEffect สำหรับแต่ละตัวแปร
useEffect(() => {
  if (amountDie !== "") {
    setDie(true); 
  } else {
    setDie(false); 
  }
}, [amountDie]);

useEffect(() => {
  if (amountInjured !== "") {
    setInjured(true); 
  } else {
    setInjured(false); 
  }
}, [amountInjured]);

useEffect(() => {
  if (amountDamage !== "") {
    setPropDamage(true); 
  } else {
    setPropDamage(false); 
  }
}, [amountDamage]);

//ดึงที่อยู่ จังหวัด-อำเภอ-ตำบล
 const fetchLocations = async (type, code) => {
    try {
      const response = await axios.post("/api/safetyform", {
        action: "fetchLocations",
        type,
        code,
      });

      if (response.data.success) {
        if (type === "province") setProvinces(response.data.data);
        if (type === "amphoe") setAmphoes(response.data.data);
        if (type === "tambon") setTambons(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

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
const fetchTime = async (date) => {

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
    fetchLocations('province');
    fetchZones();
    
    
  }, []);

  const handleProvinceChange = (selectedOption) => {
    setSelectedProvince(selectedOption);
    setSelectedAmphoe(null);
    setSelectedTambon(null);
    fetchLocations("amphoe", selectedOption.value);
  };

  const handleAmphoeChange = (selectedOption) => {
    setSelectedAmphoe(selectedOption);
    setSelectedTambon(null);
    fetchLocations("tambon", selectedOption.value);
  };

  // ฟังก์ชันจัดการการเปลี่ยนตำบล
const handleTambonChange = (selectedOption) => {
  setSelectedTambon(selectedOption);

  // หารหัสไปรษณีย์จากตำบลที่เลือก
  const tambon = tambons.find(
    (tambon) => tambon.tambon_code === selectedOption.value
  );
  if (tambon) {
    setZipcode(tambon.zipcode); // ตั้งค่า Zipcode
  }
};


// ฟังก์ชันตรวจสอบข้อมูลให้ครบก่อนดาวน์โหลดไฟล์
const handleFormSubmit = () => {
  // ตรวจสอบว่าข้อมูลทุกฟิลด์ถูกกรอกครบหรือไม่
  if (
    !businessName || 
    !businessType || 
    !registerNum || 
    !amountPeople || 
    !selectedProvince || 
    !selectedTambon || 
    !selectedAmphoe || 
    !addressNumber || 
    !villageNumber || 
    !alley || 
    !street || 
    !selectedZone || 
    !selectedDate || 
    !selectedTime || 
    !postion || 
    !causeAccident || 
    !detectAccident
  ) {
    alert('กรุณากรอกข้อมูลให้ครบถ้วน!');
    return; // หยุดการทำงาน ไม่ให้ไปสร้างเอกสาร
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


//สร้างไฟล์
const generateDOCX = async () => {
    try {
      // ฟังก์ชันเปลี่ยนเลขเป็นเลขไทย
    const toThaiNumbers = (text) => {
      if (typeof text !== "string") {
        text = text.toString(); // แปลงเป็นข้อความถ้าไม่ใช่
      }
      return text.replace(/\d/g, (digit) => "๐๑๒๓๔๕๖๗๘๙"[digit]);
    };
      //const toThaiNumbers = (text) =>
      //  text.replace(/\d/g, (digit) => "๐๑๒๓๔๕๖๗๘๙"[digit]);
      

      const formattedTime = selectedTime 
      ? toThaiNumbers(formatTime(selectedTime))
      : "................................";
          
      const formattedDate = selectedDate
        ? toThaiNumbers(
            new Date(selectedDate).toLocaleDateString("th-TH", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })//.replace(/\b\d{4}\b/, (year) => (parseInt(year, 10) + 543))
          )
        : "...................................................................";
      const doc = new Document({
        sections: [],
      });


    

// ดึงวัน เดือน ปีปัจจุบัน
    const currentDate = new Date();
    const day = currentDate.getDate(); // วันที่
    const monthNames = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
    ];
    const month = monthNames[currentDate.getMonth()]; // ชื่อเดือน
    const year = currentDate.getFullYear() + 543; // ปี พ.ศ.

// แปลงตัวเลขเป็นเลขไทย
    const thaiDay = toThaiNumbers(day); // ไม่ต้องใช้ .toString() ที่นี่
    const thaiYear = toThaiNumbers(year); // ไม่ต้องใช้ .toString() ที่นี่


      const getCheckSymbol = (value) => (value === true ? "✓" : "   ");
      const content = [];
  
    // หัวข้อเอกสาร
    content.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "แบบแจ้งการเกิดอุบัติภัยร้ายแรง หรือการประสบอันตรายจากการทำงาน",
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
              new TextRun({
                text: "ตามมาตรา ๓๔ (๑)  และ (๒) แห่งพระราชบัญญัติความปลอดภัย อาชีวอนามัย และสภาพแวดล้อม ",
                font: "TH SarabunPSK",
                size: 32,
              }),
            ],
            spacing: { after: 0 }, 
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "\t"  }),
              new TextRun({
                text: "ในการทำงาน พ.ศ.๒๕๕๔ ",
                font: "TH SarabunPSK",
                size: 32,
              }),
            ],
            tabStops: [
              {
                type: "left", 
                position: 1000, 
              },
            ],
            spacing: { after: 600 }, 
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "(๑) ชื่อสถานประกอบกิจการ  ", font: "TH SarabunPSK",  size: 32, }),
              new TextRun({ text: businessName || "..............................................................................................................." ,font: "TH SarabunPSK", size: 32, }),
            ],
            spacing: { after: 0 }, 
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "     เลขทะเบียนการค้า  ", font: "TH SarabunPSK",  size: 32, }),
              new TextRun({ text: toThaiNumbers(registerNum) || "............................................", font: "TH SarabunPSK", size: 32, }),
              new TextRun({ text: "\t" }),
              new TextRun({ text: "   ประเภทกิจการ  ", font: "TH SarabunPSK", size: 32, }),
              new TextRun({ text: businessType || "...............................................", font: "TH SarabunPSK", size: 32, }),
            ],
            tabStops: [
              {
                type: "left", 
                position: 5140, 
              },
            ],
            spacing: { after: 0 }, 
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "     ตั้งอยู่เลขที่    ", font: "TH SarabunPSK", size: 32, }),
              new TextRun({ text: toThaiNumbers(addressNumber) || "   -   " ,font: "TH SarabunPSK", size: 32, }),
              new TextRun({ text: "\t\t", font: "TH SarabunPSK", size: 32, }),
              new TextRun({ text: "หมู่    ", font: "TH SarabunPSK", size: 32, }),
              new TextRun({ text: toThaiNumbers(villageNumber) || "   -   " , font: "TH SarabunPSK",  size: 32, }),
              new TextRun({ text: "\t\t", font: "TH SarabunPSK", size: 32, }),
              new TextRun({ text: "    ตรอก/ซอย  ", font: "TH SarabunPSK",  size: 32, }),
              new TextRun({ text: toThaiNumbers(alley) || "  -  "  ,font: "TH SarabunPSK",  size: 32, }),
              new TextRun({ text: "\t\t", font: "TH SarabunPSK", size: 32, }),
              new TextRun({ text: "ถนน    ", font: "TH SarabunPSK", size: 32, }),
              new TextRun({ text: toThaiNumbers(street) || "    -" ,font: "TH SarabunPSK",  size: 32, }),
           ],
           tabStops: [
            {
              type: "left", 
              position: 720, 
            },
          ],
            spacing: { after: 0 }, 
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "     แขวง/ตำบล  " ,font: "TH SarabunPSK", size: 32, }),
              new TextRun({ text: `  ${selectedTambon?.label }`, font: "TH SarabunPSK", size: 32, }),
              new TextRun({ text: "\t\t", font: "TH SarabunPSK", size: 32, }),
              new TextRun({ text: "  เขต/อำเภอ  ", font: "TH SarabunPSK", size: 32, }),
              new TextRun({ text: `  ${selectedAmphoe?.label }`, font: "TH SarabunPSK", size: 32, }),
              new TextRun({ text: "\t\t", font: "TH SarabunPSK", size: 32, }),
              new TextRun({ text: "  จังหวัด  ", font: "TH SarabunPSK",  size: 32, }),
              new TextRun({ text: `  ${selectedProvince?.label }`, font: "TH SarabunPSK", size: 32, }),
            ],
            tabStops: [
              {
                type: "left", 
                position: 820, 
              },
            ],
            spacing: { after: 0 }, 
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "     รหัสไปรษณีย์  " ,font: "TH SarabunPSK", size: 32, }),
              new TextRun({ text: `${toThaiNumbers(zipcode)}`, font: "TH SarabunPSK", size: 32, }),
              new TextRun({ text: "\t\t", font: "TH SarabunPSK", size: 32, }),
              new TextRun({ text: "  โทรศัพท์  ", font: "TH SarabunPSK", size: 32, }),
              new TextRun({ text: toThaiNumbers(phone) || "              -              " ,font: "TH SarabunPSK",  size: 32, }),
              new TextRun({ text: "\t\t", font: "TH SarabunPSK", size: 32, }),
              new TextRun({ text: "  โทรสาร  ", font: "TH SarabunPSK",  size: 32, }),
              new TextRun({ text: toThaiNumbers(fax) || "              -              " ,font: "TH SarabunPSK",  size: 32, }),
            ],
            tabStops: [
              {
                type: "left", 
                position: 820, 
              },
             
            ],
            spacing: { after: 0 }, 
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "     จำนวนลูกจ้าง  " ,font: "TH SarabunPSK", size: 32, }),
              new TextRun({ text: "\t", font: "TH SarabunPSK", size: 32, }),
              new TextRun({ text: toThaiNumbers(amountPeople) || "            -            " ,font: "TH SarabunPSK", size: 32, }),
              new TextRun({ text: "\t", font: "TH SarabunPSK", size: 32, }),
              new TextRun({ text: "  คน" ,font: "TH SarabunPSK", size: 32, }),
            ],
            tabStops: [
              {
                type: "left", 
                position: 520, 
              },
            ],
            spacing: { after: 0 }, 
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "(๒) ความเสียหายจากการเกิดอุบัติเหตุร้ายแรง หรือการประสบอันตรายจากการทำงาน", font: "TH SarabunPSK",  size: 32, }),
            ],
            spacing: { after: 0 }, 
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `⠀⠀( ${getCheckSymbol(die)} )  เสียชีวิต  จำนวน  ` ,font: "TH SarabunPSK", size: 32 }),
              new TextRun({ text: toThaiNumbers(amountDie) || "      -       " ,font: "TH SarabunPSK", size: 32 }),
              new TextRun({ text: "  ราย ตามบัญชีแนบท้าย (ระบุชื่อ-สกุล อายุ เพศ ตำแหน่ง)" ,font: "TH SarabunPSK", size: 32 }),
            ],
            spacing: { after: 0 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `⠀⠀( ${getCheckSymbol(injured)} )  บาดเจ็บ/เจ็บป่วย  จำนวน  ` ,font: "TH SarabunPSK", size: 32 }),
              new TextRun({ text: toThaiNumbers(amountInjured) || "      -       " ,font: "TH SarabunPSK", size: 32 }),
              new TextRun({ text: "  ราย ตามบัญชีแนบท้าย (ระบุชื่อ-สกุล อายุ เพศ ตำแหน่ง)" ,font: "TH SarabunPSK", size: 32 }),
            ],
            spacing: { after: 0 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `⠀⠀( ${getCheckSymbol(propDamage)} )  ทรัพย์สินเสียหาย  จำนวน  ` ,font: "TH SarabunPSK", size: 32 }),
              new TextRun({ text: toThaiNumbers(amountDamage) || "             -            " ,font: "TH SarabunPSK", size: 32 }),
              new TextRun({ text: "  บาท" ,font: "TH SarabunPSK", size: 32 }),
            ],
            spacing: { after: 0 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `⠀⠀( ${getCheckSymbol(stopProduction)} )  มีการหยุดผลิต` ,font: "TH SarabunPSK", size: 32 }),
              ],
            spacing: { after: 0 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "(๓) สถานที่เกิดเหตุ   ", font: "TH SarabunPSK",  size: 32, }),
              new TextRun({ text: selectedZone || "..............................................................................................................................." ,font: "TH SarabunPSK", size: 32, }),
            ],
            spacing: { after: 0 }, 
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "     วัน/เดือน/ปี ที่เกิดเหตุ  ", font: "TH SarabunPSK",  size: 32, }),
              new TextRun({ text: `   ${formattedDate}` ,font: "TH SarabunPSK", size: 32 }),
              new TextRun({ text: "\t\t" ,font: "TH SarabunPSK", size: 32 }),
              new TextRun({ text: "เวลา  ", font: "TH SarabunPSK",  size: 32, }),
              new TextRun({ text:  `${formattedTime} น.`  ,font: "TH SarabunPSK", size: 32 }),
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
              new TextRun({ text: "(๔) สาเหตุของการเกิดอุบัติภัยร้ายแรง หรือการประสบอันตรายจากการทำงาน", font: "TH SarabunPSK",  size: 32, }),
            ],
            spacing: { after: 0 }, 
          }),
          new Paragraph({
            children: [
              new TextRun({ text: causeAccident || "             -              " ,font: "TH SarabunPSK", size: 32, }),
            ],
            spacing: { after: 0 }, 
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "(๕) การดำเนินการแก้ไขและป้องกันการเกิดซ้ำ กรณีเกิดเหตุตามมาตรา ๓๔ (๑)  ", font: "TH SarabunPSK",  size: 32, }),
            ],
            spacing: { after: 0 }, 
          }),
          new Paragraph({
            children: [
              new TextRun({ text: detectAccident || "             -              " ,font: "TH SarabunPSK", size: 32, }),
            ],
            spacing: { after: 400 }, 
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "\t" }),
              new TextRun({ text: "ข้าพเจ้าขอรองรับว่าข้อความข้างต้นเป็นความจริงทุกประการ" ,font: "TH SarabunPSK", size: 32, }),
            ],
            tabStops: [
              {
                type: "left", 
                position: 1000, 
              },
            ],
            spacing: { after: 800 }, 
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "\t" }),
              new TextRun({ text: "ลงชื่อ" ,font: "TH SarabunPSK", size: 32, }),
              new TextRun({ text: "...................................." ,font: "TH SarabunPSK", size: 32, }),
              new TextRun({ text: "นายจ้าง/ผู้รับมอบอำนาจ" ,font: "TH SarabunPSK", size: 32, }),

            ],
            tabStops: [
              {
                type: "left", 
                position: 3820, 
              },
            ],
            spacing: { after: 0 }, 
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "\t" }),
              new TextRun({ text: "    ( " ,font: "TH SarabunPSK", size: 32, }),
              new TextRun({ text: name || "............................................" ,font: "TH SarabunPSK", size: 32, }),
              new TextRun({ text: " ) ประทับตรา/ถ้ามี" ,font: "TH SarabunPSK", size: 32, }),

            ],
            tabStops: [
              {
                type: "left", 
                position: 3820, 
              },
            ],
            spacing: { after: 0 }, 
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "\t" }),
              new TextRun({ text: "ตำแหน่ง  " ,font: "TH SarabunPSK", size: 32, }),
              new TextRun({ text: postion || "........................................................................" ,font: "TH SarabunPSK", size: 32, }),
            ],
            tabStops: [
              {
                type: "left", 
                position: 3820, 
              },
            ],
            spacing: { after: 0 }, 
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "\t" }),
              new TextRun({ text: "⠀⠀ วันที่ ", font: "TH SarabunPSK", size: 32 }),
              new TextRun({ text: thaiDay, font: "TH SarabunPSK", size: 32 }),
              new TextRun({ text: "  เดือน ", font: "TH SarabunPSK", size: 32 }),
              new TextRun({ text: month, font: "TH SarabunPSK", size: 32 }),
              new TextRun({ text: "  พ.ศ. ", font: "TH SarabunPSK", size: 32 }),
              new TextRun({ text: thaiYear, font: "TH SarabunPSK", size: 32 }),
            ],
            tabStops: [
              {
                type: "left", 
                position: 3820, 
                bottom: 10, 

              },
            ],
            spacing: { after: 0 },
          }),
      );
  
      // สร้าง Header พร้อมข้อความด้านขวา
      const header = new Header({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "แบบ สปร. ๕",
                font: "TH SarabunPSK",
                size: 28,
              }),
            ],
            alignment: AlignmentType.RIGHT, // จัดข้อความไปทางขวา
          }),
        ],
      });
  
      // เพิ่ม Section พร้อมตั้งค่าระยะขอบ
      doc.addSection({
         headers: { default: header },
         children: content,
         properties: {
            page: {
              margin: {
                top: 720, // ระยะขอบบน 0.5 นิ้ว (720 ทศนิยม)
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
     link.download = "สปร5.docx";
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
          fileName:"สปร.5",
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
            height: "400mm", // ความสูงของ A4
            marginTop: "100px", // ระยะห่างจากขอบบน
            marginBottom: "100px", // ระยะห่างจากขอบล่าง
            backgroundSize: 'contain', // ไม่ให้ขยายภาพพื้นหลังให้เต็มพื้นที่
            backgroundRepeat: 'no-repeat', // ป้องกันไม่ให้ภาพพื้นหลังซ้ำ
          }}
        >
         {/* Form */}
         <div className="p-8">
        {/* Header */}
        <div className="text-end mb-4">
          <h1 className="text-md text-end text-black">
           แบบสปร. ๕
          </h1>
          <h1 className="text-lg text-center font-bold text-black">
           แบบแจ้งการเกิดอุบัติภัยร้ายแรง หรือการประสบอันตรายจากการทำงาน          
           </h1>
           </div>
      
      {/* หัวข้อรอง */}
        <div className="flex justify-start mb-4">
            <div>
              <label className="text-black">ตามมาตรา ๓๔ (๑)  และ (๒) แห่งพระราชบัญญัติความปลอดภัย อาชีวอนามัย และสภาพแวดล้อมในการทำงาน พ.ศ.๒๕๕๔</label>
            </div>
          </div>

        {/* Form Content */}
        <div className="space-y-6 text-black ">
          {/* 1 */}
          <div className="flex items-center w-[99%]">
        <label className="text-black whitespace-nowrap mr-1">(๑) ชื่อสถานประกอบกิจการ</label>
        <input
            type="text" id="name" name="name" 
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            style={{
              width: "80%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
        </div>
          
        <div className="flex items-center justify-start w-full flex-wrap">
          <label className="text-black whitespace-nowrap mr-1">เลขทะเบียนการค้า</label>
          <input
            type="text" id="name" name="name" 
            value={registerNum}
            onChange={(e) => setRegisterNum(e.target.value)}
            style={{
              width: "34%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
          <label className="text-black whitespace-nowrap mr-1 ml-2">ประเภทกิจการ</label>
          <input
            type="text" id="name" name="name" 
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            style={{
              width: "34%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
        </div>

          {/* ตั้งอยู่เลขที่ ถึง ถนน */}
        <div className="flex items-center justify-start w-full flex-wrap">
            <div>
              <label className="text-black mr-1">ตั้งอยู่เลขที่</label>
              <input
            type="text" id="type" name="type" 
            value={addressNumber}
            onChange={(e) => setAddressNumber(e.target.value)} 
            style={{
              width: "18%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
            className="text-black text-center"
          />
              <label className="text-black mr-1 ml-2">หมู่</label>
              <input
            type="text" id="type" name="type"
            value={villageNumber}
            onChange={(e) => setVillageNumber(e.target.value)}  
            style={{
              width: "8%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
            className="text-black text-center"
          />
               <label className="text-black mr-1 ml-2">ตรอก/ซอย</label>
               <input
            type="text" id="type" name="type" 
            value={alley}
            onChange={(e) => setAlley(e.target.value)}
            style={{
              width: "15%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
            className="text-black text-center"

          />
               <label className="text-black ml-2 mr-1">ถนน</label>
               <input
            type="text" id="type" name="type" 
            value={street}
            onChange={(e) => setStreet(e.target.value)} 
            style={{
              width: "26%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
            className="text-black text-center"
          />
            </div>
          </div>

        {/* จังหวัด -> อำเภอ -> ตำบล -> รหัสไปรษณีย์ */}
<div className="flex flex-wrap items-center space-x-0 mb-4">
  <div className="flex items-center">
    <label className="text-black">จังหวัด</label>
    <Select
      options={provinces.map((province) => ({
        value: province.province_code,
        label: province.province,
      }))}
      onChange={handleProvinceChange}
      value={selectedProvince}
      placeholder="เลือกจังหวัด"
      className="text-black w-[150px] ml-1 mr-2"
    />
  </div>
  <div className="flex items-center">
    <label className="text-black mr-1">อำเภอ/เขต</label>
    <Select
      options={amphoes.map((amphoe) => ({
        value: amphoe.amphoe_code,
        label: amphoe.amphoe,
      }))}
      onChange={handleAmphoeChange}
      value={selectedAmphoe}
      placeholder="เลือกอำเภอ"
      className="text-black w-[150px] ml-1 mr-2"
    />
  </div>
  <div className="flex items-center">
    <label className="text-black">ตำบล/แขวง</label>
    <Select
      options={tambons.map((tambon) => ({
        value: tambon.tambon_code,
        label: tambon.tambon,
      }))}
      onChange={handleTambonChange}
      value={selectedTambon}
      placeholder="เลือกตำบล"
      className="text-black w-[150px] ml-1"
    />
  </div>
{/* รหัสไปรษณีย์ */}
<div className="flex-wrap w-full items-center mt-3">
    <label className="text-black">รหัสไปรษณีย์</label>
    <input
      type="text"
      value={zipcode}
      readOnly
      className="border-b  border-black text-black text-center ml-2"
      style={{
        width: "18%",
        padding: "6px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        fontSize: "14px",
      }}
    />
 
 
  <label className="text-black mr-1 ml-5">โทรศัพท์</label>
              <input
                type="text"
                className="border-b border-black ml-2 text-black text-center"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{
                  width: "20%",
                  padding: "6px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              />
  <label className="text-black mr-1 ml-5">โทรสาร</label>
              <input
                type="text"
                className="border-b border-black w-[20%] ml-2 text-black text-center"
                value={fax}
                onChange={(e) => setFax(e.target.value)}
                style={{
                  width: "20%",
                  padding: "6px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              />
            </div>  
        

</div>

          {/* จำนวนลูกจ้าง */}
          <div className="flex justify-start">
            <div>
              <label className="text-black mr-1">จำนวนลูกจ้าง</label>
              <input
            type="text" id="name" name="name" 
            value={amountPeople}
            onChange={(e) => setAmountPeople(e.target.value)}
            style={{
              width: "55%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
            className="text-black text-center"
          />
                <label className="text-black ml-1">คน</label>
            </div>
          </div>

           {/* 2 ความเสียหาย */}
           <div className="flex justify-start">
              <label className="text-black">(๒) ความเสียหายจากการเกิดอุบัติเหตุร้ายแรง หรือการประสบอันตรายจากการทำงาน</label>

          </div>

{/** ตาย */}
<div className="flex items-center justify-start mb-4">
  <input
    type="checkbox"
    id="dieCheckbox"
    className="hidden peer"
    checked={die}
    onChange={(e) => setDie(e.target.checked)}
  />
  <label
    htmlFor="dieCheckbox"
    className="w-6 h-6 flex items-center justify-center border-2 border-gray-400 rounded-md cursor-pointer peer-checked:bg-green-600 peer-checked:border-green-600"
  >
    <svg
      className={`w-8 h-8 text-white ${die ? '' : 'hidden'}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
    </svg>
  </label>
  <label htmlFor="dieCheckbox" className="text-black ml-2">
    เสียชีวิต จำนวน
  </label>
  <input
    type="text"
    value={amountDie}
    onChange={(e) => setAmountDie(e.target.value)}
    className="border-b border-black w-[15%] focus:outline-none text-black text-center ml-2"
  />
  <label className="text-black ml-2">
    ราย ตามบัญชีแนบท้าย (ระบุชื่อ-สกุล อายุ เพศ ตำแหน่ง)
  </label>
</div>

{/** บาดเจ็บ */}
<div className="flex items-center justify-start mb-4">
  <input
    type="checkbox"
    id="injuredCheckbox"
    className="hidden peer"
    checked={injured}
    onChange={(e) => setInjured(e.target.checked)}
  />
  <label
    htmlFor="injuredCheckbox"
    className="w-6 h-6 flex items-center justify-center border-2 border-gray-400 rounded-md cursor-pointer peer-checked:bg-green-600 peer-checked:border-green-600"
  >
    <svg
      className={`w-8 h-8 text-white ${injured ? '' : 'hidden'}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
    </svg>
  </label>
  <label htmlFor="injuredCheckbox" className="text-black ml-2">
    บาดเจ็บ/เจ็บป่วย จำนวน
  </label>
  <input
    type="text"
    value={amountInjured}
    onChange={(e) => setAmountInjured(e.target.value)}
    className="border-b border-black w-[15%] focus:outline-none text-black text-center ml-2"
  />
  <label className="text-black ml-2">
    ราย ตามบัญชีแนบท้าย (ระบุชื่อ-สกุล อายุ เพศ ตำแหน่ง)
  </label>
</div>
       {/**ทรัพย์สินเสียหาย */}
<div className="flex items-center justify-start">
  <input
    type="checkbox"
    id="propDamageCheckbox"
    className="hidden peer"
    checked={propDamage}
    onChange={(e) => setPropDamage(e.target.checked)}
  />
  <label
    htmlFor="propDamageCheckbox"
    className="w-6 h-6 flex items-center justify-center border-2 border-gray-400 rounded-md cursor-pointer peer-checked:bg-green-600 peer-checked:border-green-600"
  >
    <svg
      className={`w-8 h-8 text-white ${propDamage ? '' : 'hidden'}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
    </svg>
  </label>
  <label htmlFor="propDamageCheckbox" className="text-black ml-2">
    ทรัพย์สินเสียหาย จำนวน
  </label>
  <input
    type="text"
    value={amountDamage}
    onChange={(e) => setAmountDamage(e.target.value)}
    className="border-b border-black w-[25%] focus:outline-none text-black text-center ml-2"
  />
  <label className="text-black ml-2">บาท</label>
</div>


          {/** หยุดผลิต */}
<div className="flex items-center justify-start mb-4">
  <input
    type="checkbox"
    id="stopProductionCheckbox"
    className="hidden peer"
    checked={stopProduction}
    onChange={(e) => setStopProduction(e.target.checked)}
  />
  <label
    htmlFor="stopProductionCheckbox"
    className="w-6 h-6 flex items-center justify-center border-2 border-gray-400 rounded-md cursor-pointer peer-checked:bg-green-600 peer-checked:border-green-600"
  >
    <svg
      className={`w-8 h-8 text-white ${stopProduction ? '' : 'hidden'}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
    </svg>
  </label>
  <label htmlFor="stopProductionCheckbox" className="text-black ml-2">
    มีการหยุดผลิต
  </label>
</div>

         {/** 3 สถานที่เกิดเหตุ **/}
         <div className="flex items-center w-[99%]">
         <label className="text-black whitespace-nowrap mr-1">(๓) สถานที่เกิดเหตุ</label>
         <select
            value={selectedZone}
            onChange={(e) => {
              const location = e.target.value
             setSelectedZone(location); // เก็บข้อมูลที่เลือก
              if (location) {
                fetchDate(location); // เรียก fetchDate เมื่อเลือกผู้ใช้
              }
            }}            style={{
              width: "80%",
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
       {/** วันที่เกิดเหตุ และเวลา */}
       <div className="flex items-center justify-start w-full flex-wrap">
      <label className="text-black whitespace-nowrap mr-3">วันที่เกิดอุบัติเหตุ</label>
      <select
            value={selectedDate}
            onChange={(e) => {
              const date = e.target.value
             setSelectedDate(date); // เก็บข้อมูลที่เลือก
              if (date) {
                fetchTime(date); // เรียก fetchDate เมื่อเลือกผู้ใช้
              }
            }}            
            style={{
              width: "28%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}  
            className='text-center '        
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

 <label className="text-black whitespace-nowrap mr-1 ml-4">เวลาที่เกิดอุบัติเหตุ</label>
 <select id="timeSelect" 
          value={selectedTime}  
          style={{
            width: "32%",
            padding: "6px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "14px",
          }} 
          className='text-center '
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


        {/** 4 */}
        <div className="flex items-center">
        <label className="text-black whitespace-nowrap">(๔) สาเหตุของการเกิดอุบัติภัยร้ายแรง หรือการประสบอันตรายจากการทำงาน</label>
        </div>
         <div className="flex items-center w-full">
         <textarea
    id="details"
    name="details"
    rows="4"
    style={{
      width: "99%",
      padding: "4px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      fontSize: "14px",
      resize: "none", // ป้องกันการขยายขนาดของ textarea หากไม่ต้องการ
    }}
    value={causeAccident}
    onChange={(e) => setCauseAccident(e.target.value)}
  ></textarea>
        </div>

        {/** 5 การป้องกันเหตุ*/}
        <div className="flex items-center">
            <label className="text-black whitespace-nowrap">(๕) การดำเนินการแก้ไขและป้องกันการเกิดซ้ำ  ๓๔ (๑)</label>
        </div>

         <div className="flex items-center w-full">
         <textarea
    id="details"
    name="details"
    rows="4"
    style={{
      width: "99%",
      padding: "4px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      fontSize: "14px",
      resize: "none", // ป้องกันการขยายขนาดของ textarea หากไม่ต้องการ
    }} 
    value={detectAccident}
    onChange={(e) => setDetectAccident(e.target.value)}
  ></textarea>
        </div>


        <div className="text-start ml-14">
  <p>ข้าพเจ้าขอรับรองว่าข้อความข้างต้นเป็นความจริงทุกประการ</p>
  </div>
    {/**ส่วนลงชื่อ */}
  <div className="text-end mt-2">

  <div className="mt-8">
    <p>
      ลงชื่อ 
      <input
        type="text"
        className="border-b border-black flex-1 focus:outline-none text-center text-black text-sm"
        />นายจ้าง/ผู้รับมอบอำนาจ
    </p>
    <p className="mt-2">
    <label className="text-black whitespace-nowrap">(</label>
    <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border-b border-black flex-1 w-[30%] focus:outline-none text-center text-sm text-black"
        />    
        <label className="text-black whitespace-nowrap">) </label>
      ประทับตรา/ถ้ามี
    </p>
    <p className="mr-2 mt-4">
      ตำแหน่ง 
      <input
      value={postion}
      onChange={(e) => setPosition(e.target.value)}
      type="text"
        className="border-b border-black text-center flex-1 w-[46%] focus:outline-none text-black"
        />      </p>
    <p className="mt-4">
      วันที่ 
      <input
        type="text"
        value={currentDate.day}
        className="border-b text-center border-black flex-1 w-[10%] focus:outline-none text-black"
        />        
        เดือน 
        <input
        type="text"
        value={currentDate.month}
        className="border-b border-black text-center flex-1 w-[10%] focus:outline-none text-black"
        />  
        พ.ศ. 
        <input
        type="text"
        value={currentDate.year}
        className="border-b border-black text-center flex-1 w-[15%] focus:outline-none text-black"
        />      
      </p>
  </div>
</div>
      </div>

      </div>
     
            {/* ปุ่มดาวโหลด */}
<div className="flex justify-center item-center absolute bottom-5 left-1/2 transform -translate-x-1/2">
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

export default SafetyReportFormSeriousAccident;