"use client";
//แบบบันทึกรายละเอียดการวิเคราะห์อุบัติเหตุ
import React, { useState, useEffect ,useRef} from 'react';
import Link from 'next/link'
import '../../globals.css';
import '@fontsource/mitr';
import { IoMdDownload } from "react-icons/io";
import { Document, Packer, Paragraph, Table, TableRow, TableCell, AlignmentType,VerticalAlign,TableLayoutType , TextDirection, TextRun, BorderStyle, WidthType, PageOrientation } from "docx";
import { ChevronLeftIcon } from '@heroicons/react/solid'; // or '@heroicons/react/outline' if you're using the outlined version

const SafetyReportFormAnalysisAccidentDetails = () => {
  const [injuredEmployees, setInjuredEmployees] = useState(0);
  const [totalWorkHours, setTotalWorkHours] = useState(0);
  const [lostDays, setLostDays] = useState(0); // จำนวนวันที่เสียเนื่องจากอุบัติเหตุ
  const [frequencyRate, setFrequencyRate] = useState(0);
  const [severityRate, setSeverityRate] = useState(0); // อัตราความรุนแรง
  const [manyday, setManyday] = useState('');
  const [building, setBuilding] = useState('');
  const [dataArray, setDataArray] = useState([]);
  const [businessName, setBusinessName] = useState("");
  const [position, setPosition] = useState("");
  const [startdate, setStartdate] = useState("");
  const [enddate, setEnddate] = useState("");
  const [nameanalysis, setNameanalysis] = useState('');
  const [totalperson, setTotalperson] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    selectedDate: '',
    time: '',
    injury: '',
    body: '',
    type: '',
    unsafe: '',
    dangerous: '',
    manyday: '',
    building: '',
  });

  const isRowComplete = (row) => {
    const injuryParts = row.injury?.split(',').map(part => part.trim()) || [];
    const bodyParts = row.body?.split(',').map(part => part.trim()) || [];
  
    const complete = row.name && row.department && row.selectedDate && row.time &&
                     injuryParts.length > 0 && bodyParts.length > 0 &&
                     row.type && row.unsafe && row.dangerous;
                  

  
    console.log("ตรวจสอบแถว:", row, "ผลลัพธ์:", complete, "ข้อมูล injury:", injuryParts, "ข้อมูล body:", bodyParts);
    return complete;
  };

const monthNamesThai = [
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
  ];

  // ฟังก์ชันในการอัปเดตข้อมูลฟอร์ม
const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prevState => ({
    ...prevState,
    [name]: value
  }));
};

const handleSubmit = (e) => {
  e.preventDefault();
  console.log("Form Data:", formData); // ตรวจสอบค่าที่กรอก
  // ทำการส่งข้อมูลไปยัง generateDOCX หรือที่อื่นๆ
};
  
  const rowsPerPage = 2; // จำนวนแถวต่อหน้า
  const [rows, setRows] = useState([
    { name: "", department: "", date: "", time: "", injuryType: "", accidentType: "", unsafeAction: "", dangerCondition: "", lostDays: "", Operation: "" },
  ]);
  const [currentPage, setCurrentPage] = useState(1); // หน้าแรก

  // ฟังก์ชันเพิ่มแถว
  // const handleAddRow = () => {
  //   setRows([
  //     ...rows,
  //     { name: "", department: "", date: "", time: "", injuryType: "", accidentType: "", unsafeAction: "", dangerCondition: "", lostDays: "", Operation: ""  },
  //   ]);
  // };

  const handleAddRow = () => {
    setRows((prevRows) => [
      ...prevRows,
      {
        name: "",
        department: "",
        selectedDate: "",
        time: "",
        injury: "",
        body: "",
        type: "",
        unsafe: "",
        dangerous: "",
        manyday: "",
        isAnalyzed: false,
      },
    ]);
  };
  
  // ฟังก์ชันสำหรับเปลี่ยนหน้า
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleInputChange = (index, field, value) => {
  
    // อัพเดทข้อมูลใน state ตามปกติ
    const updatedRows = [...rows];
    updatedRows[index] = {
      ...updatedRows[index],
      [field]: value,
    };
    setRows(updatedRows);
  };
  

  
 // ฟังก์ชันช่วยในการตัดข้อความสำหรับตาราง
 const wrapText = (text, maxLength) => {
  if (!text) return "";
  return text.length > maxLength
    ? text.match(new RegExp(`.{1,${maxLength}}`, "g")).join("\n")
    : text;
};
 // ฟังก์ชันสำหรับปรับความสูงของ textarea ให้พอดีกับเนื้อหา
 const adjustHeight = (e) => {
  e.target.style.height = 'auto'; // รีเซ็ตความสูง
  e.target.style.height = `${e.target.scrollHeight}px`; // ปรับความสูงตามเนื้อหาที่มี
};


  // คำนวณตำแหน่งเริ่มต้นและตำแหน่งสุดท้ายของแถวในหน้าปัจจุบัน
  const indexOfFirstRow = (currentPage - 1) * rowsPerPage;
  const indexOfLastRow = currentPage * rowsPerPage;
  const currentRows = rows.slice(indexOfFirstRow, indexOfLastRow);

  const [currentDate, setCurrentDate] = useState({
    
    day: '',
    month: '',
    year: '',
  });


  // ดึงข้อมูลวันที่และวิเคราะห์ข้อมูลเมื่อโหลดคอมโพเนนต์
  useEffect(() => {
  const today = new Date();
  const day = today.getDate().toString().padStart(2, '0'); // แสดงวันที่ 2 หลัก
  //const month = (today.getMonth() + 1).toString().padStart(2, '0'); // แสดงเดือน 2 หลัก
  const monthIndex = today.getMonth(); // ใช้ index ของเดือน
  const year = (today.getFullYear() + 543); // แปลงปีเป็น พ.ศ.

   // ใช้ monthNamesThai เพื่อดึงชื่อเดือน
   const month = monthNamesThai[monthIndex]; 

  setCurrentDate({
    day,
    month,
    year,
  });

    const savedData = localStorage.getItem('analysisAccident');
    console.log("ข้อมูลที่ถูกบันทึกใน localStorage:", JSON.parse(localStorage.getItem('analysisAccident')));
  if (savedData) {
     const parsedData = JSON.parse(savedData); 
     const formData = Array.isArray(parsedData) ? parsedData : [parsedData];
     const dataArray = Array.isArray(parsedData) ? parsedData : [parsedData];
     setDataArray(dataArray);  // อัปเดต dataArray
      console.log("lllllllllll",dataArray);  

console.log("formData after transformation:", formData);
    setFormData(JSON.parse(savedData));
    setRows(prevRows => prevRows.map(row => ({
      ...row,
      name: parsedData.name || row.name || "",
      department: parsedData.department || row.department || "",
      selectedDate: parsedData.selectedDate || row.selectedDate || "",
      time: parsedData.time || row.time || "",
      injury: parsedData.injury || row.injury|| "",
      body: parsedData.body || row.body|| "",
      type: parsedData.type || row.type|| "",
      unsafe: parsedData.unsafe || row.unsafe|| "",
      dangerous: parsedData.dangerous || row.dangerous|| "",
     
      
    })));
  }
  }, []);

  useEffect(() => {
    rows.forEach(async (row, index) => {
      console.log(`กำลังตรวจสอบแถวที่ ${index + 1}:`, row);
  
      if (isRowComplete(row) && !row.isAnalyzed) {
        try {
          console.log(`กำลังส่งข้อมูลแถวที่ ${index + 1}:`, row);
  
          const response = await fetch('/api/form_analysisaccidentdetail', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'analyzedetailData',
              data: [row],
            }),
          });
  
          const result = await response.json();
          if (result.success) {
            console.log(`ผลลัพธ์ AI สำหรับแถวที่ ${index + 1}:`, result.analysis);
  
            setRows((prevRows) => {
              const updatedRows = [...prevRows];
              updatedRows[index] = { 
                ...updatedRows[index], 
                isAnalyzed: true, 
                analysis: result.analysis 
              };
              return updatedRows;
            });
          } else {
            console.error(`ข้อผิดพลาดจาก AI สำหรับแถวที่ ${index + 1}:`, result.message);
          }
        } catch (error) {
          console.error(`ข้อผิดพลาดในการส่งข้อมูลไปยัง AI สำหรับแถวที่ ${index + 1}:`, error);
        }
      }
    });
  }, [rows]);
  
  // คำนวณอัตราความถี่
  useEffect(() => {
    if (totalWorkHours > 0) {
      // คำนวณอัตราความถี่
      const frequency = (injuredEmployees * 1000000) / totalWorkHours;
      setFrequencyRate(frequency.toFixed(2)); // ทศนิยม 2 ตำแหน่ง

      // คำนวณอัตราความรุนแรง
      const severity = (lostDays * 1000000) / totalWorkHours;
      setSeverityRate(severity.toFixed(2)); // ทศนิยม 2 ตำแหน่ง
      console.log("injuredEmployees:", injuredEmployees);

    } else {
      setFrequencyRate(0);
      setSeverityRate(0);
    }
  }, [injuredEmployees, totalWorkHours, lostDays]); // อัพเดตเมื่อค่าเหล่านี้เปลี่ยน


  const handlePreview = () => {
    // ตัวอย่างเปิดไฟล์ PDF หรือ HTML ของเอกสาร
    window.open("https://drive.google.com/file/d/1Dpd96W120nB_p6FwSFVDl7uKH-ASKGJg/view?usp=sharing", "_blank");
  };

  const handleFormSubmit = () => {
    if ( 
      !businessName,
      !position,
      !nameanalysis,
      !lostDays,
      !totalperson,
      !startdate,
      !enddate
      
    ) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน!');
      return;
    }
    generateDOCX(); // ถ้ากรอกครบแล้ว, เรียกฟังก์ชันดาวน์โหลด
  };

  let contentRows = [];
  const generateDOCX = async () => {
    try {
      // กำหนดค่า CurrentDate
        const today = new Date();
        const CurrentDate = {
            day: today.getDate().toString(),
            month: today.toLocaleString("th-TH", { month: "long" }),
            year: (today.getFullYear() + 543).toString(), // แปลงเป็น พ.ศ.
        };

      console.log("Rows data:", rows);
      const savedData = localStorage.getItem('analysisAccident');
      const parsedData = JSON.parse(savedData); 
      console.log(savedData);
      const dataArray = Array.isArray(parsedData) ? parsedData : [parsedData];
      console.log(dataArray);
      const doc = new Document({
        sections: [],
      });
  
      const content = [];
  
      // หัวข้อเอกสาร
      content.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "แบบบันทึกรายละเอียดการวิเคราะห์อุบัติเหตุ",
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
            new TextRun({ text: "ชื่อโรงงาน                                  ", font: "TH SarabunPSK", size: 32 }),
            new TextRun({ text: businessName||".....................................................................................................", font: "TH SarabunPSK", size: 32 }),
            new TextRun({ text: "\t", font: "TH SarabunPSK", size: 32 }),
            new TextRun({ text: "1. จำนวน (ราย) บาดเจ็บทั้งสิ้น\t\t\t", font: "TH SarabunPSK", size: 32 }),
            new TextRun({ text: injuredEmployees.toString() ,font: "TH SarabunPSK", size: 32 }),
            new TextRun({ text: "\t\t\t   ราย", font: "TH SarabunPSK", size: 32 , alignment: AlignmentType.RIGHT, }),
        ],
        tabStops: [
          { type: "left", position: 8040,},
        ],
          spacing: { after: 0 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "ชื่อแผนก                                   ", font: "TH SarabunPSK", size: 32 }),
            new TextRun({ text: position|| "......................................................................................................" ,font: "TH SarabunPSK", size: 32 }),
            new TextRun({ text: "\t", font: "TH SarabunPSK", size: 32 }),
            new TextRun({ text: "2. จำนวนวันที่เสียไปทั้งสิ้น\t\t\t" , font: "TH SarabunPSK", size: 32 }),
            new TextRun({ text: lostDays.toString()||"......................................................................" ,font: "TH SarabunPSK", size: 32 }),
            new TextRun({ text: "\t\t\t   วัน", font: "TH SarabunPSK", size: 32 , alignment: AlignmentType.RIGHT, }),
        ],
        tabStops: [
          { type: "left", position: 8040, },
        ],
          spacing: { after: 0 },
        }),
        new Paragraph({
            children: [
              new TextRun({ text: "ช่วงระยะเวลา (วัน/เดือน/ปี) ตั้งแต่    ", font: "TH SarabunPSK", size: 32 }),
              new TextRun({ text: startdate||"........................." ,font: "TH SarabunPSK", size: 32 }),
              new TextRun({ text: "     ถึง    ", font: "TH SarabunPSK", size: 32 }),
              new TextRun({ text: enddate|| ".........................." ,font: "TH SarabunPSK", size: 32 }),
              new TextRun({ text: "\t", font: "TH SarabunPSK", size: 32 }),
              new TextRun({ text: "3. จำนวนคนงานทั้งหมด\t\t\t", font: "TH SarabunPSK", size: 32 }),
              new TextRun({ text: totalperson|| "0" ,font: "TH SarabunPSK", size: 32 }),
              new TextRun({ text: "\t\t\t   ราย", font: "TH SarabunPSK", size: 32 , alignment: AlignmentType.RIGHT, }),
            ],
            tabStops: [
              {
                type: "left",
                position: 8040,
              }
            ],
            spacing: { after: 0 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "ผู้ทำการวิเคราะห์                         ", font: "TH SarabunPSK", size: 32 }),
              new TextRun({ text: nameanalysis|| "........................................................................................" ,font: "TH SarabunPSK", size: 32 }),
              new TextRun({ text: "\t", font: "TH SarabunPSK", size: 32 }),
              new TextRun({ text: "4. จำนวนชั่วโมงการทำงานทั้งหมด  \t\t", font: "TH SarabunPSK", size: 32 }),
              new TextRun({ text: totalWorkHours.toString()||"...............................", font: "TH SarabunPSK", size: 32 }),
              new TextRun({ text: "\t\t\t   ชม.", font: "TH SarabunPSK", size: 32 , alignment: AlignmentType.RIGHT, }),
            ],
            tabStops: [
              {
                type: "left",
                position: 8040,
              }
            ],
            spacing: { after: 0 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "วันที่ทำการวิเคราะห์วันที่                ", font: "TH SarabunPSK", size: 32 }),
              new TextRun({ text: CurrentDate.day||"..................." , font: "TH SarabunPSK", size: 32 }),
              new TextRun({ text: "    เดือน ", font: "TH SarabunPSK", size: 32 }),
              new TextRun({ text: CurrentDate.month||"...............................", font: "TH SarabunPSK", size: 32 }),
              new TextRun({ text: "    พ.ศ. ", font: "TH SarabunPSK", size: 32 }),
              new TextRun({ text: CurrentDate.year||"...........", font: "TH SarabunPSK", size: 32 }),
              new TextRun({ text: "\t", font: "TH SarabunPSK", size: 32 }),
              new TextRun({ text: "5. อัตราความถี่ของการประสบอันตราย\t\t", font: "TH SarabunPSK", size: 32 }),
              new TextRun({ text: frequencyRate|| "..................................................." , font: "TH SarabunPSK", size: 32 }),
            ],
            tabStops: [
              {
                type: "left",
                position: 8040,
              }
            ],
            spacing: { after: 0 },
          }),
          new Paragraph({          
            children: [
              new TextRun({ text: "\t", font: "TH SarabunPSK", size: 32 }),
              new TextRun({ text: "6. อัตราความรุนแรงของการประสบอันตราย\t", font: "TH SarabunPSK", size: 32 }),
              new TextRun({ text: severityRate|| "...................................................." , font: "TH SarabunPSK", size: 32 }),
            ],
            tabStops: [
              {
                type: "left",
                position: 8040,
              }
            ],
            spacing: { after: 600 },
          }),
          
        );
       
        
    // หัวตาราง
    const headerRow = new TableRow({
      children: [
        new TableCell({
          width: { size: 5, type: WidthType.PERCENTAGE }, // ลำดับที่ (5%)
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "ลำดับที่",
                  bold: true,
                  font: "TH SarabunPSK",
                  size: 32,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
          verticalAlign: VerticalAlign.CENTER,
        }),
        new TableCell({
          width: { size: 8, type: WidthType.PERCENTAGE }, // ชื่อ-สกุลผู้บาดเจ็บ (15%)
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "ชื่อ-สกุล\nผู้บาดเจ็บ",
                  bold: true,
                  font: "TH SarabunPSK",
                  size: 32,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
        }),
        new TableCell({
          width: { size: 5, type: WidthType.PERCENTAGE }, // แผนก (10%)
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "แผนก",
                  bold: true,
                  font: "TH SarabunPSK",
                  size: 32,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
          verticalAlign: VerticalAlign.CENTER,
        }),
        new TableCell({
          width: { size: 10, type: WidthType.PERCENTAGE }, // วันที่เกิดอุบัติเหตุ (10%)
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "วันที่เกิด\nอุบัติเหตุ",
                  bold: true,
                  font: "TH SarabunPSK",
                  size: 32,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
          verticalAlign: VerticalAlign.CENTER,
        }),
        new TableCell({
          width: { size: 10, type: WidthType.PERCENTAGE }, // เวลาที่เกิดอุบัติเหตุ (10%)
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "เวลาที่เกิด\nอุบัติเหตุ",
                  bold: true,
                  font: "TH SarabunPSK",
                  size: 32,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
          verticalAlign: VerticalAlign.CENTER,
        }),
        new TableCell({
          width: { size: 10, type: WidthType.PERCENTAGE }, // ลักษณะบาดเจ็บและส่วนร่างกาย (15%)
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "ลักษณะบาดเจ็บ\nและส่วนร่างกาย",
                  bold: true,
                  font: "TH SarabunPSK",
                  size: 32,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
          verticalAlign: VerticalAlign.CENTER,
        }),
        new TableCell({
          width: { size: 10, type: WidthType.PERCENTAGE }, // ชนิดของอุบัติเหตุ (10%)
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "ชนิดของ\nอุบัติเหตุ",
                  bold: true,
                  font: "TH SarabunPSK",
                  size: 32,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
          verticalAlign: VerticalAlign.CENTER,
        }),
        new TableCell({
          width: { size: 10, type: WidthType.PERCENTAGE }, // การกระทำที่ไม่ปลอดภัย (15%)
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "การกระทำ\nที่ไม่ปลอดภัย",
                  bold: true,
                  font: "TH SarabunPSK",
                  size: 32,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
          verticalAlign: VerticalAlign.CENTER,
        }),
        new TableCell({
          width: { size: 10, type: WidthType.PERCENTAGE }, // สภาพที่เป็นอันตราย (10%)
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "สภาพที่เป็น\nอันตราย",
                  bold: true,
                  font: "TH SarabunPSK",
                  size: 32,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
          verticalAlign: VerticalAlign.CENTER,
        }),
        new TableCell({
          width: { size: 10, type: WidthType.PERCENTAGE }, // จำนวนวันทำงานที่เสียไป (10%)
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "จำนวนวัน\nทำงานที่เสียไป",
                  bold: true,
                  font: "TH SarabunPSK",
                  size: 32,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
          verticalAlign: VerticalAlign.CENTER,
        }),
        new TableCell({
          width: { size: 12, type: WidthType.PERCENTAGE }, // การดำเนินงาน (15%)
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "การดำเนินงาน",
                  bold: true,
                  font: "TH SarabunPSK",
                  size: 32,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
          verticalAlign: VerticalAlign.CENTER,
        }),
      ],
    });
    
    const contentRows = [];
    let formData = [];

    rows.forEach((row, index) => {
      // สร้างข้อมูลที่ต้องการจากข้อมูลในแต่ละแถว
      let rowData = {
        name: row.name,
        department: row.department,
        selectedDate: row.selectedDate,
        time: row.time,
        injury: row.injury,
        body: row.body,
        type: row.type,
        unsafe: row.unsafe,
        dangerous: row.dangerous,
        manyday: row.manyday,
        building:row.isAnalyzed,
      };
    
      // เพิ่มข้อมูลจากแต่ละแถวเข้า formData
      formData.push(rowData);
    });
    
    // ตรวจสอบข้อมูลที่เก็บใน formData
    console.log("Form Data:", formData);

rows.forEach((row, index) => {
  contentRows.push(
    new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: (index + 1).toString() ,font: "TH SarabunPSK",   size: 32, }), // เพิ่ม TextRun ใน Paragraph
              ],
              alignment: AlignmentType.CENTER,
            })
          ],
          alignment: AlignmentType.CENTER,
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: row.name || "................."  ,font: "TH SarabunPSK",  size: 32,}), 
              ],
              alignment: AlignmentType.CENTER,
            })
          ]
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: row.department || "............" ,font: "TH SarabunPSK",   size: 32 }), // เพิ่ม TextRun ใน Paragraph
              ],
              alignment: AlignmentType.CENTER,
            })
          ]
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: row.selectedDate || "................." ,font: "TH SarabunPSK",   size: 32 }), // เพิ่ม TextRun ใน Paragraph
              ],
              alignment: AlignmentType.CENTER,
            })
          ]
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: row.time || "................." ,font: "TH SarabunPSK",   size: 32 }), // เพิ่ม TextRun ใน Paragraph
              ],
              alignment: AlignmentType.CENTER,
            })
          ]
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: `${row.injury || "................."} ${row.body || ""}` ,font: "TH SarabunPSK",   size: 32 }), // เพิ่ม TextRun ใน Paragraph
              ],
              alignment: AlignmentType.CENTER,
            })
          ]
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: row.type || "................." ,font: "TH SarabunPSK",   size: 32 }), // เพิ่ม TextRun ใน Paragraph
              ],
              alignment: AlignmentType.CENTER,
            })
          ]
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: row.unsafe || "................." ,font: "TH SarabunPSK",   size: 32 }), // เพิ่ม TextRun ใน Paragraph
              ],
              alignment: AlignmentType.CENTER,
            })
          ]
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: row.dangerous || "............................." ,font: "TH SarabunPSK",   size: 32 }), // เพิ่ม TextRun ใน Paragraph
              ],
            })
          ]
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: row.manyday || "................." ,font: "TH SarabunPSK",   size: 32}), // เพิ่ม TextRun ใน Paragraph
              ],
              alignment: AlignmentType.CENTER,
            })
          ]
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: row.isAnalyzed ? row.analysis : "กำลังวิเคราะห์..." ,font: "TH SarabunPSK",   size: 32}), // เพิ่ม TextRun ใน Paragraph
              ],
            })
          ]
        }),
      ],
    })
  );
});

// เพิ่มข้อมูลจาก rows ไปยัง dataArray
formData.forEach(data => {
  dataArray.push(data);
});

// ตรวจสอบข้อมูลหลังการเพิ่มข้อมูล
console.log("Updated dataArray:", dataArray);

// อัปเดต localStorage
localStorage.setItem('analysisAccident', JSON.stringify(dataArray));


    // รวมหัวตารางและเนื้อหาเข้าด้วยกัน
    const table = new Table({
      rows: [headerRow, ...contentRows],
      layout: TableLayoutType.FIXED, // กำหนดตารางเป็นแบบ FIXED
      width: {
              size: 100,
              type: WidthType.PERCENTAGE,
      },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 2 },
        bottom: { style: BorderStyle.SINGLE, size: 2 },
        left: { style: BorderStyle.SINGLE, size: 2 },
        right: { style: BorderStyle.SINGLE, size: 2 },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
        insideVertical: { style: BorderStyle.SINGLE, size: 1 },
      },
    });
  
      // เพิ่มตารางลงใน content
      content.push(table);
  
      // เพิ่ม content ทั้งหมดลงใน section
      doc.addSection({
        properties: {
          page: {
            size: {
              orientation: PageOrientation.LANDSCAPE, // ตั้งเป็นแนวนอน
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
      link.download = "แบบบันทึกรายละเอียดการวิเคราะห์อุบัติเหตุ.docx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // ลบลิงก์ออกหลังจากคลิก
      // ลบข้อมูลใน localStorage หลังจากดาวน์โหลดเอกสารเสร็จ
    localStorage.removeItem('analysisAccident');
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
          action: "aveFileToDatabaseData",
          storedId: storedId,
          file: base64String, // ส่ง Base64 string ไปใน JSON
        };
        //console.log("Payloads to send:", payloads);
  
        // ส่งข้อมูลไปยัง backend
        const response = await fetch("/api/form_analysisaccidentdetail", {
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
        height: "270mm",  // ความสูงยังคงเป็น 210 มม.
        width: "350mm",   // เพิ่มความกว้าง (เช่น 350 มม. หรือค่าที่ต้องการ)
        marginTop: "100px",
        marginBottom: "100px",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
      }}
    >

        {/* Form */}
        <div className="p-8">

           {/* Header */}
        <div className="text-end mb-5">
          <h1 className="text-lg text-center text-black font-bold">
          แบบบันทึกรายละเอียดการวิเคราะห์อุบัติเหตุ
          </h1>
        </div>
        
        {/* Form Content */}
        <div className="space-y-6 text-black">
          {/* ส่วนหัวเรื่อง */}
          <div className="flex items-center justify-start w-full flex-wrap">
          <label className="text-black mr-1">ชื่อโรงงาน</label>
          <input
            type="text" id="type" name="type" 
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            style={{
              width: "39%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
              <label className="text-black text-center mr-1 ml-5">1. จำนวน (ราย) บาดเจ็บทั้งสิ้น</label>
              <input
          type="number"
          value={injuredEmployees}
          onChange={(e) => setInjuredEmployees(Number(e.target.value))}
          className="input border-b text-center"
        />
              <label className="text-black ml-1">ราย</label>
          </div>
          <div className="flex items-center justify-start w-full flex-wrap">
              <label className="text-black mr-1">ชื่อแผนก</label>
              <input
            type="text" id="type" name="type" 
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            style={{
              width: "40%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
              <label className="text-black ml-5 mr-1">2. จำนวนวันที่เสียไปทั้งสิ้น</label>
              <input
          type="number"
          value={lostDays}
          onChange={(e) => setLostDays(Number(e.target.value))}
          className="input border-b text-center"

        />
              <label className="text-black ml-1">วัน</label>
          </div>
          <div>
              <label className="text-black mr-1">ช่วงระยะเวลา (วัน/เดือน/ปี) ตั้งแต่</label>
              <input
            type="text" id="type" name="type" className="text-center" 
            value={startdate}
            onChange={(e) => setStartdate(e.target.value)}
            style={{
              width: "10%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
              <label className="text-black mr-1 ml-2 ">ถึง</label>
              <input
            type="text" id="type" name="type" className="text-center" 
            value={enddate}
            onChange={(e) => setEnddate(e.target.value)}
            style={{
              width: "10%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
              <label className="text-black mr-1  ml-2">3. จำนวนคนงานทั้งหมด</label>
              <input
            type="number" id="type" name="type"  className="text-center"
            value={totalperson}
            onChange={(e) => setTotalperson(e.target.value)}
            style={{
              width: "28%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
              <label className="text-black ml-2">ราย</label>
            </div>

            <div className="flex items-center justify-start w-full flex-wrap">
              <label className="text-black mr-1">ผู้ทำการวิเคราะห์</label>
              <input
            type="text" id="type" name="type" 
            value={nameanalysis}
            onChange={(e) => setNameanalysis(e.target.value)}
            style={{
              width: "36%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
              <label className="text-black  mr-1 ml-3">4. จำนวนชั่วโมงการทำงานทั้งหมด</label>
              <input
          type="number"
          value={totalWorkHours}
          onChange={(e) => setTotalWorkHours(Number(e.target.value))}
          className="input border-b text-center"
        />
              <label className="text-black ml-1">ชม.</label>
          </div>

          <div className="flex items-center justify-start w-full flex-wrap">
              <label className="text-black">วันที่ทำการวิเคราะห์</label>
              <label className="text-black mr-1">วันที่</label>
              <input
            type="text" id="type" name="type" className="text-center" 
            value={currentDate.day} readOnly
            style={{
              width: "5%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
              <label className="text-black mr-1 ml-1">เดือน</label>
              <input
            type="text" id="type" name="type" className="text-center" 
            value={currentDate.month}  readOnly
            style={{
              width: "10%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
              <label className="text-black mr-1 ml-1">พ.ศ.</label>
              <input
            type="text" id="type" name="type" className="text-center" 
            value={currentDate.year}  readOnly
            style={{
              width: "8%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
               <label className="text-black ml-2 mr-1">5. อัตราความถี่ของการประสบอันตราย</label>
               <input type="text text-cenetr" value={frequencyRate} readOnly 
               className="input border-b text-center"
          />
          </div>
          

          <div className="flex items-center justify-end flex-wrap">
          <label className="text-black mr-1 ">6. อัตราความรุนแรงของการประสบอันตราย</label>
          <input type="text" value={severityRate} readOnly 
           className="input border-b text-center w-[20%]"
          />
          </div>

          </div>
          
          {/**ตาราง */}
          <div className="relative mx-auto min-h-[500px] max-h-[500px] max-w-[1000px] w-full overflow-y-auto mt-5">
  <div className="mx-auto max-w-[905px]">
    <table
      className="border-collapse border rounded-lg overflow-hidden border border-gray-300 shadow-md w-full"
      style={{ tableLayout: "auto" }}
    >
          <thead className='bg-[#5A985E] text-white max-w-[905px] font-light'>
      <tr>
            <th className="border border-gray-700 text-sm px-1 py-2">ลำดับ</th>
            <th className="border border-gray-700 text-sm px-8 py-2">ชื่อ-สกุล<br/>ผู้บาดเจ็บ</th>
            <th className="border border-gray-700 text-sm px-1 py-1">แผนก</th>
            <th className="border border-gray-700 text-sm px-1 py-2">วันที่เกิดอุบัติเหตุ</th>
            <th className="border border-gray-700 text-sm px-1 py-2">เวลาเกิดอุบัติเหตุ</th>
            <th className="border border-gray-700 text-sm px-4 py-2">ลักษณะบาดเจ็บและส่วนร่างกาย</th>
            <th className="border border-gray-700 text-sm px-1 py-2">ชนิดของอุบัติเหตุ</th>
            <th className="border border-gray-700 text-sm px-4 py-2">การกระทำที่ไม่ปลอดภัย</th>
            <th className="border border-gray-700 text-sm px-4 py-2">สภาพที่เป็นอันตราย</th>
            <th className="border border-gray-700 text-sm px-4 py-2">จำนวนวันทำงานที่เสียไป</th>
            <th className="border border-gray-700 text-sm px-6 py-2">การดำเนินงาน</th>
          </tr>
        </thead>
        
            <tbody>
              {currentRows.map((row, index) => (
                <tr key={index}>
              <td className="border border-gray-300 text-gray-700 text-center px-1 py-3 align-top">
              {indexOfFirstRow + index + 1}</td>
                    <td className="border border-gray-300 text-gray-700 text-center px-1 py-3 align-top">
                    <textarea
          value={wrapText(row.name || "")}
          onChange={(e) => {
            handleInputChange(index, "name", e.target.value.replace(/\n/g, " "));
            adjustHeight(e); // ปรับความสูงให้พอดีกับข้อความที่ป้อน
          }}
          className="w-full focus:outline-none text-gray-700 text-center text-sm resize-none align-top"
          style={{
            overflow: "hidden",   // ซ่อน scrollbar
            verticalAlign: "top", // จัดให้อยู่ด้านบน
          }}
        />
              </td>
              <td className="border border-gray-300 text-gray-700 text-center px-1 py-3 align-top">
              <textarea
                      value={wrapText(row.department || "")}
                      onChange={(e) =>{
                      handleInputChange(index, "department", e.target.value.replace(/\n/g, " "))
                      adjustHeight(e); // ปรับความสูงให้พอดีกับข้อความที่ป้อน
                    }}
                    className="w-full focus:outline-none text-gray-700 text-center text-sm resize-none align-top"
                    style={{
                      overflow: "hidden",   // ซ่อน scrollbar
                      verticalAlign: "top", // จัดให้อยู่ด้านบน
                    }}
                  />
              </td>

              <td className="border border-gray-300 text-gray-700 text-center px-1 py-3 align-top">
              <textarea
                  value={wrapText(row.selectedDate || "")}
                  onChange={(e) => handleInputChange(index, "selectedDate", e.target.value)}
                  style={{ overflow: 'hidden' }} // ซ่อน scrollbar
                  className="w-full focus:outline-none text-gray-700 text-sm text-center resize-none"
              />
              </td>
              <td className="border border-gray-300 text-gray-700 text-center px-1 py-3 align-top">
            <textarea
              value={(row.time || "")}
              onChange={(e) => handleInputChange(index, "time", e.target.value.trim())} // อัปเดตค่าเวลา
              className="w-full focus:outline-none text-gray-700 text-center text-sm resize-none align-top"
              style={{
                overflow: "hidden",   // ซ่อน scrollbar
                verticalAlign: "top", // จัดให้อยู่ด้านบน
              }}            
              />
              </td>

              <td className="border border-gray-300 text-gray-700 text-center px-1 py-3 align-top">
                <textarea
                  value={wrapText(`${row.injury ||""}  ${row.body || ""}`)}
                  onChange={(e) => {
                    const updatedRows = [...rows]; // สร้างสำเนาของ rows
                    updatedRows[indexOfFirstRow + index] = {
                      ...updatedRows[indexOfFirstRow + index], // คัดลอกแถวที่ต้องการแก้ไข
                      injury: e.target.value.split("  ")[0], // แยกค่า injury
                      body: e.target.value.split("  ")[1] || "", // แยกค่า body
                    };
                    setRows(updatedRows); // อัพเดทค่า rows ใหม่
                    adjustHeight(e); // ปรับความสูงให้พอดีกับข้อความที่ป้อน

                  }}
                  className="w-full focus:outline-none text-gray-700 text-center text-sm resize-none align-top"
                  style={{
                    overflow: "hidden",   // ซ่อน scrollbar
                    verticalAlign: "top", // จัดให้อยู่ด้านบน
                  }}
                />
              </td>
              <td className="border border-gray-300 text-gray-700 text-center px-1 py-3 align-top">
              <textarea
                      value={wrapText(row.type || "")}
                      onChange={(e) =>{
                      handleInputChange(index, "type", e.target.value.replace(/\n/g, " "))
                      adjustHeight(e); // ปรับความสูงให้พอดีกับข้อความที่ป้อน
                    }}
                    className="w-full focus:outline-none text-gray-700 text-center text-sm resize-none align-top"
                    style={{
                      overflow: "hidden",   // ซ่อน scrollbar
                      verticalAlign: "top", // จัดให้อยู่ด้านบน
                    }}
                />
              </td>
              <td className="border border-gray-300 text-gray-700 text-center px-1 py-3 align-top">
              <textarea
                      value={wrapText(row.unsafe || "")}
                      onChange={(e) =>{
                      handleInputChange(index, "unsafe", e.target.value.replace(/\n/g, " "))
                      adjustHeight(e); // ปรับความสูงให้พอดีกับข้อความที่ป้อน

                    }}
                    className="w-full focus:outline-none text-gray-700 text-center text-sm resize-none align-top"
                    style={{
                      overflow: "hidden",   // ซ่อน scrollbar
                      verticalAlign: "top", // จัดให้อยู่ด้านบน
                    }}
                />
              </td>
              <td className="border border-gray-300 text-gray-700  px-1 py-3 align-top">
              <textarea
                      value={wrapText(row.dangerous || "")}
                      onChange={(e) =>{
                      handleInputChange(index, "dangerous", e.target.value.replace(/\n/g, " "))
                      adjustHeight(e); // ปรับความสูงให้พอดีกับข้อความที่ป้อน
                    }}
                    className="w-full focus:outline-none text-gray-700 text-sm resize-none align-top"
                    style={{
                      overflow: "hidden",   // ซ่อน scrollbar
                      verticalAlign: "top", // จัดให้อยู่ด้านบน
                    }}
                />
              </td>
              <td className="border border-gray-300 text-gray-700 text-center px-1 py-3 align-top">
              <textarea
                      value={wrapText(row.manyday || "")}
                      onChange={(e) =>
                      handleInputChange(index, "manyday", e.target.value.replace(/\n/g, " "))
                    }
                  className=" w-full focus:outline-none text-gray-700 text-center text-sm resize-none"
                />
              </td>
              <td className="border border-gray-300 text-gray-700 px-1 py-3 align-top">
                <textarea
                  value={wrapText(row.isAnalyzed ? row.analysis : "กำลังวิเคราะห์...")}
                  onChange={(e) => {
                    adjustHeight(e); // ปรับความสูงให้พอดีกับข้อความที่ป้อน
                    handleInputChange(index, "building", e.target.value)}}
                    className="w-full focus:outline-none text-gray-700 text-sm resize-none align-top"
                    style={{
                      overflow: "hidden",   // ซ่อน scrollbar
                      verticalAlign: "top", // จัดให้อยู่ด้านบน
                    }}
                />
              </td>     
                </tr>
              ))}
            </tbody>
          </table>

      {/* ปุ่มแบ่งหน้าตาราง */}
<div className="flex justify-center mt-4">
  {(() => {
    const totalPages = Math.ceil(rows.length / rowsPerPage);
    const maxPagesToShow = 10;
    const startPage = Math.max(2, currentPage - 2); // เริ่มจาก 2 เพื่อกันการซ้ำกับหน้าแรก
    const endPage = Math.min(totalPages - 1, currentPage + 2); // จบก่อนหน้าสุดท้าย

    const pageNumbers = [];

    if (totalPages > maxPagesToShow) {
      pageNumbers.push(1); // หน้าแรกเสมอ

      if (startPage > 2) {
        pageNumbers.push("..."); // แสดง ... หากมีช่วงที่ห่าง
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i); // เพิ่มเลขหน้าระหว่าง startPage และ endPage
      }

      if (endPage < totalPages - 1) {
        pageNumbers.push("..."); // แสดง ... หากยังมีช่วงที่ห่าง
      }

      pageNumbers.push(totalPages); // เพิ่มหน้าสุดท้าย
    } else {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i); // แสดงทุกหน้า
      }
    }

    return pageNumbers.map((pageNumber, idx) =>
      typeof pageNumber === "number" ? (
        <button
          key={idx}
          onClick={() => handlePageChange(pageNumber)}
          className={`px-3 py-1 mx-1 text-sm border border-gray-400 text-black rounded ${
            currentPage === pageNumber ? "bg-green-700 text-white" : "bg-green"
          }`}
        >
          {pageNumber}
        </button>
      ) : (
        <span key={idx} className="px-3 py-1 mx-1 text-sm text-gray-500">
          {pageNumber}
        </span>
      )
    );
  })()}
</div>
        </div> 



{/* ปุ่มเพิ่มแถว */}
<button
          className="absolute bg-[#5A975E] mt-3 hover:bg-green-700 text-white py-2 px-4 rounded-xl flex items-start justify-start"
          onClick={handleAddRow}
        >
          เพิ่ม
        </button>


    </div>
    </div>
 
    
            {/* ปุ่มดาวโหลด */}
<div className="flex justify-center item-center absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <button  onClick={handleFormSubmit} 
        className="bg-[#5A975E] download-button text-center">
          download
        </button>
      </div>

            {/* ปุ่มดูตัวอย่างไฟล์ */}
<button
  onClick={handlePreview}
  className="absolute bottom-10 right-10 bg-[#5A975E] hover:bg-gray-400 text-white py-2 px-4 rounded-xl flex items-center"
>
  ตัวอย่างเอกสาร
</button>

{/* ปุ่มย้อนกลับ */}
<button className="absolute bottom-10 left-10 bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-xl flex items-center">
  <Link href="/form_analysisaccident" className="flex items-center">
    <ChevronLeftIcon className="h-5 w-5" />
    <span className="mr-2">ก่อนหน้า</span>
  </Link>
</button>

    </div>
  </div>
</div>

  );
}


export default SafetyReportFormAnalysisAccidentDetails;