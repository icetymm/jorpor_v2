//แบบฟอร์มการวิเคราะห์งานเพื่อความปลอดภัย
"use client";
import React, { useState, useEffect } from 'react';
import '../../globals.css';
import '@fontsource/mitr';
import { IoMdDownload } from "react-icons/io";
import axios from 'axios';

import { Document, Packer, Paragraph, Table, TableRow, TableCell, AlignmentType,VerticalAlign,TableLayoutType,ImageRun , TextDirection, TextRun, BorderStyle, WidthType, PageOrientation } from "docx";

const SafetyReportFormAnalysisForSafety = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [rows, setRows] = useState([
    { step: "", hazard: "", prevention: "" },
  ]);
  
  const addNewRow = () => {
    setRows([...rows, { step: "", hazard: "", prevention: "" }]);
  };
  const [namework, setNamework] = useState("");
  const [position, setPosition] = useState("");
  const [analysisname, setAnalysisname] = useState("");
  const [step, setStep] = useState("");
  const [hazard, setHazard] = useState("");
  const [prevention, setPrevention] = useState("");
  const rowsPerPage = 3; // จำนวนแถวต่อหน้า
  const [currentPage, setCurrentPage] = useState(1); // หน้าแรก
  const [isProcessing, setIsProcessing] = useState(false);  // สถานะสำหรับการประมวลผล
      
  // คำนวณตำแหน่งเริ่มต้นและตำแหน่งสุดท้ายของแถวในหน้าปัจจุบัน
  const indexOfFirstRow = (currentPage - 1) * rowsPerPage;
  const indexOfLastRow = currentPage * rowsPerPage;
  const currentRows = rows.slice(indexOfFirstRow, indexOfLastRow);
      
// ฟังก์ชันสำหรับเปลี่ยนหน้า
const handlePageChange = (pageNumber) => {
  setCurrentPage(pageNumber);
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

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const handleKeyDown = async (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
  
      const realIndex = indexOfFirstRow + index; // คำนวณตำแหน่งจริงของแถวในข้อมูลทั้งหมด
  
      setIsProcessing((prev) => ({
        ...prev,
        [realIndex]: true, // ตั้งสถานะการประมวลผลของแถว
      }));
  
      try {
        await analyzeStep(realIndex); // ส่งตำแหน่งจริงไปยังฟังก์ชันวิเคราะห์
      } finally {
        setIsProcessing((prev) => ({
          ...prev,
          [realIndex]: false, // ยกเลิกสถานะแถวที่กำลังประมวลผล
        }));
      }
    }
  };

  // ดึงข้อมูลวันที่และวิเคราะห์ข้อมูลเมื่อโหลดคอมโพเนนต์
  useEffect(() => {

    const today = new Date();
    const formattedDate = today.toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    setCurrentDate(formattedDate);
  }, []);


  const analyzeStep = async (realIndex) => {
    try {
      if (!rows[realIndex] || !rows[realIndex].step) {
        console.error("ข้อมูล step ที่ index นี้ไม่ถูกต้อง:", realIndex);
        return;
      }
  
      const step = rows[realIndex].step;
  
      const response = await fetch("/api/form_analysisforsafety", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ steps: [step], action: "analysis" }),
      });
  
      const data = await response.json();
  
      if (response.ok && data.success) {
        const hazards = data.hazards || [];
        const preventions = data.preventions || [];
  
        setRows((prevRows) => {
          const updatedRows = [...prevRows];
          updatedRows[realIndex] = {
            ...updatedRows[realIndex],
            hazard: hazards.join("\n") || "ไม่มีข้อมูล",
            prevention: preventions.join("\n") || "ไม่มีคำแนะนำ",
          };
          return updatedRows;
        });
      } else {
        console.error("ข้อผิดพลาดจาก API:", data.message || "ไม่ทราบสาเหตุ");
      }
    } catch (error) {
      console.error("ข้อผิดพลาดในการวิเคราะห์ step:", error);
    }
  };
  
  const handleFormSubmit = () => {
    // ตรวจสอบว่าข้อมูลทุกฟิลด์กรอกครบหรือไม่
    if (
      !namework &&
      !position &&
      !analysisname 
    )   
    {
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

  const generateDOCX = async () => {
    try {
      const doc = new Document({
        sections: [],
      });
  
      const content = [];
  
      // หัวข้อเอกสาร
      content.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "แบบฟอร์มการวิเคราะห์งานเพื่อความปลอดภัย",
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
            new TextRun({ text: "ชื่องาน  ", font: "TH SarabunPSK", size: 32 }),
            new TextRun({ text: namework|| "...................................................." , font: "TH SarabunPSK", size: 32 }),
            new TextRun({ text: "\tวันที่วิเคราะห์	", font: "TH SarabunPSK", size: 32 }),
            new TextRun({ text: new Date().toLocaleDateString(), font: "TH SarabunPSK", size: 32 }),
          ],
          tabStops: [
            {
              type: "left", 
              position: 4040, 
            },
          ],
          spacing: { after: 0 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "แผนก   ", font: "TH SarabunPSK", size: 32 }),
            new TextRun({ text: position||"...................................................." ,font: "TH SarabunPSK", size: 32 }),
            new TextRun({ text: "\tผู้ทำการวิเคราะห์    ", font: "TH SarabunPSK", size: 32 }),
            new TextRun({ text: analysisname|| "............................................................." , font: "TH SarabunPSK", size: 32 }),
          ],
          tabStops: [
            {
              type: "left", 
              position: 4040, 
            },
          ],
          spacing: { after: 400 },
        }),
       
        );
  
      // ตาราง
      const table = new Table({
        rows: [
          // แถวหัวข้อหลัก
          new TableRow({
            children: [
              new TableCell({
                shading: { fill: "D9D9D9" },
                alignment: AlignmentType.CENTER,
                width: { size: 5, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({ text: "ขั้นตอน" ,  bold: true ,font: "TH SarabunPSK", size: 32, }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    shading: { fill: "D9D9D9" },
                    alignment: AlignmentType.CENTER,
                    width: { size: 5, type: WidthType.PERCENTAGE }, // ลำดับที่ (5%)
                    children: [
                      new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [
                            new TextRun({ text: "ลักษณะอันตรายที่อาจเกิดขึ้น" ,  bold: true ,font: "TH SarabunPSK", size: 32, }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        shading: { fill: "D9D9D9" },
                        alignment: AlignmentType.CENTER,
                        width: { size: 5, type: WidthType.PERCENTAGE }, // ลำดับที่ (5%)
                        children: [
                          new Paragraph({
                              alignment: AlignmentType.CENTER,
                              children: [
                                new TextRun({ text: "การป้องกันและการปรับปรุง" ,  bold: true ,font: "TH SarabunPSK", size: 32, }),
                                ],
                              }),
                            ],
                          }),
            ],
          }),
  
          // แถวเนื้อหา 
          ...rows.map((data) =>
            new TableRow({
              children: [
                new TableCell({
                      children: [
                        new Paragraph({
                            children: [
                              new TextRun({ text: data.step , font: "TH SarabunPSK", size: 32, }),
                              ],
                            }),
                          ]
                        }),
                        new TableCell({
                          children: [
                            new Paragraph({
                                children: [
                                  new TextRun({ text: data.hazard , font: "TH SarabunPSK", size: 32, }),
                                  ],
                                }),
                              ]
                            }),
                            new TableCell({
                              children: [
                                new Paragraph({
                                    children: [
                                      new TextRun({ text: data.prevention , font: "TH SarabunPSK", size: 32, }),
                                      ],
                                    }),
                                  ]
                                }),
                //new TableCell({ children: [new Paragraph (data.step) ] ,font: "TH SarabunPSK", size: 32, }),
                //new TableCell({ children: [new Paragraph(data.hazard)] ,font: "TH SarabunPSK", size: 32,}),
                //new TableCell({ children: [new Paragraph(data.prevention)] ,font: "TH SarabunPSK", size: 32,}),
              ],
            })
          ),
        ],
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
      link.download = "แบบฟอร์มการวิเคราะห์งานเพื่อความปลอดภัย.docx";
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
          action: "aveFileToDatabaseData",
          storedId: storedId,
          file: base64String, // ส่ง Base64 string ไปใน JSON
        };
        //console.log("Payloads to send:", payloads);
  
        // ส่งข้อมูลไปยัง backend
        const response = await fetch("/api/form_analysisforsafety", {
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
      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0'>
        <div className='bg-[#5A985E] mx-auto max-w-[500px] sm:max-w-[350px] py-[100px] rounded-[50px]'></div>
      </div>

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
        className="relative item-center  justify-center bg-white border border-gray-300 shadow-xl rounded-xl"
        style={{
          width: "350mm", // ความกว้างของ A4
          height: "240mm", // ความสูงของ A4
          marginTop: "100px", // ระยะห่างจากขอบบน
          marginBottom: "100px", // ระยะห่างจากขอบล่าง
          backgroundSize: 'contain', // ไม่ให้ขยายภาพพื้นหลังให้เต็มพื้นที่
          backgroundRepeat: 'no-repeat', // ป้องกันไม่ให้ภาพพื้นหลังซ้ำ
        }}
      >
          <div className="p-8">

        {/* Header */}
        <div className="text-end mb-5">
          <h1 className="text-lg text-center text-black font-bold">
          แบบฟอร์มการวิเคราะห์งานเพื่อความปลอดภัย
          </h1>
        </div>

        {/* Form Content */}
        <div className="space-y-6 text-black mb-12 ">
         {/* เขียนที่ / วันที่ */}
          <div className="flex items-center justify-start ml-9 w-full flex-wrap">
              <label className="text-black mr-1 ">ชื่องาน</label>
              <input
            type="text" id="type" name="type" 
            value={namework}
            onChange={(e) => setNamework(e.target.value)}
            style={{
              width: "38%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
              <label className="text-black mr-1 ml-20">วันที่วิเคราะห์</label>
              <input
                type="text"
                value={currentDate}
                readOnly
                className="w-[19%] focus:outline-none text-center text-black"
              />
          </div>
          <div className="flex items-center justify-start ml-9 w-full flex-wrap">
              <label className="text-black mr-3">แผนก</label>
              <input
            type="text" id="type" name="type" 
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            style={{
              width: "38%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
              <label className="text-black mr-2 ml-20 ">ผู้ทำการวิเคราะห์</label>
              <input
            type="text" id="type" name="type" 
            value={analysisname}
            onChange={(e) => setAnalysisname(e.target.value)}
            style={{
              width: "32%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
          </div>
          </div>

          {/** ตาราง */}
          <div className="space-y-6 text-black mb-12 ">
              <table className="w-full border-collapse border border-black mt-100 mr-10 "
              style={{ tableLayout: "auto" }} // ปรับขนาดคอลัมน์อัตโนมัติ
              >
              <thead>
                  <tr>
                  <th className="border border-black bg-gray-300 p-2" style={{ width: '100px' }}>ขั้นตอน</th>
                  <th className="border border-black bg-gray-300 p-2" style={{ width: '200px' }}>
                        ลักษณะอันตรายที่อาจเกิดขึ้น
                  </th>
                  <th className="border border-black bg-gray-300 p-2" style={{ width: '200px' }}>
                        การป้องกันและการปรับปรุง
                  </th>
                  </tr>
                </thead>
                <tbody>
                  {currentRows.map((row, index) => (
                    <tr key={index}>
                      <td className="border border-black p-1 align-top"> 
                      <textarea
              type="text"
              value={wrapText(`${indexOfFirstRow + index + 1}.${row.step}`)} // แสดงลำดับจริงของแถวในหน้าทั้งหมด
              onChange={(e) => {
                const value = e.target.value.replace(/^\d+\.\s*/, ""); // ลบลำดับออกจากข้อความ
                const updatedData = [...rows];
                updatedData[indexOfFirstRow + index].step = value; // อัปเดตข้อมูลแถวที่ตรงกันใน tableData
                setRows(updatedData);
                adjustHeight(e); // ปรับความสูงให้พอดีกับข้อความที่ป้อน

              }}
              onKeyDown={(e) => handleKeyDown(e, index)} 
              className="w-full border-none focus:outline-none resize-none align-top"
              rows={1} // กำหนดจำนวนบรรทัดเริ่มต้น
              style={{ overflow: 'hidden' }} // ซ่อน scrollbar
            />
             </td>
                      <td className="border border-black p-1 align-top">
                            {row.hazard &&
                            row.hazard.split("\n").map((item, idx) => (
                                <div key={idx}>{`${item}`}</div> // แยกข้อความเป็นข้อ ๆ
                            ))}
                            {/* แสดงข้อความกำลังประมวลผล */}
                            {isProcessing[indexOfFirstRow + index]&& (
                                  <div className="text-center text-gray-500 align-top">
                                    กำลังวิเคราะห์ข้อมูล โปรดรอสักครู่...
                                  </div>
                                )}
                              </td>
                            <td className="border border-black p-1 align-top">
                            {row.prevention &&
                            row.prevention.split("\n").map((item, idx) => (
                                <div key={idx}>{` ${item}`}</div> // แยกข้อความเป็นข้อ ๆ
                            ))}
                            {/* แสดงข้อความกำลังประมวลผล */}
                            {isProcessing[indexOfFirstRow + index]&& (
                              <div className="text-center text-gray-500 align-top">
                                กำลังวิเคราะห์ข้อมูล โปรดรอสักครู่...
                              </div>
                            )}
                          </td>
                    </tr>
                  ))}
                </tbody>
              </table>
{/* ปุ่มเพิ่มแถว */}
<div className="text-right mt-2">
  <button
    onClick={() => {
      const newRow = { step: "", hazard: "", prevention: "" };

      setRows((prevRows) => {
        const updatedRows = [...prevRows, newRow];

        // คำนวณจำนวนหน้าทั้งหมด
        const totalPages = Math.ceil(updatedRows.length / rowsPerPage);

        // เปลี่ยนหน้าไปยังหน้าสุดท้าย
        setCurrentPage(totalPages);

        return updatedRows;
      });
    }}
    className="bg-green-700 text-white px-4 py-2 rounded"
  >
    เพิ่มแถว
  </button>
</div>


{/* ปุ่มแบ่งหน้าตาราง */}
<div className="flex justify-center">
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
          className={`px-4 py-2 mx-1 border border-gray-400 text-black rounded ${
            currentPage === pageNumber ? "bg-green-700 text-white" : "bg-green"
          }`}
        >
          {pageNumber}
        </button>
      ) : (
        <span key={idx} className="px-4 py-2 mx-1 text-gray-500">
          {pageNumber}
        </span>
      )
    );
  })()}
</div>



</div>

<label style={{ color: "red" }} className="mr-1 mt-2">
  ***หมายเหตุ: กด Enter เพื่อทำการวิเคราะห์ข้อมูลโดยใช้ AI
</label>

          
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
    </div>
  );
};


export default SafetyReportFormAnalysisForSafety;