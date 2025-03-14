"use client";
//แบบตรวจสอบความปลอดภัย
import React, { useState, useEffect } from 'react';
import '../../globals.css';
import '@fontsource/mitr';
import { IoMdDownload } from "react-icons/io";
import { Document, Packer, Paragraph, Table, TableRow, TableCell, AlignmentType, TextRun, BorderStyle, WidthType } from "docx";

const SafetyReportFormExamine = () => {
  const [currentDate, setCurrentDate] = useState('');
  //const [rows, setRows] = useState([{ checklist: "", standard: "", notStandard: "", suggestion: "" }]);
  const [rows, setRows] = useState([]);
  const [checklistData, setChecklistData] = useState([]); // จะใช้เก็บข้อมูล checklist ที่มีหลาย name
  const [selectedUsers, setSelectedUsers] = useState({
    id: '', // จะเก็บ id ของผู้ใช้ที่เลือก
    name: '', // จะเก็บชื่อ
    lastname: '', // จะเก็บนามสกุล
  });
  const [users, setUsers] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [dates, setDates] = useState('');
  const [selectedExamine, setSelectedExamine] = useState('');
  const [examines, setExamines] = useState('');
  const [selectedExamineName, setSelectedExamineName] = useState('');
  const [examinenames, setExaminenames] = useState('');
  const [part, setPart] = useState('');
  const [currentPage, setCurrentPage] = useState(0); // หน้าปัจจุบัน
  const itemsPerPage = 10; // จำนวนรายการต่อหน้า

// คำนวณข้อมูลในหน้าปัจจุบัน
  const paginatedRows = [];
  for (let i = 0; i < rows.length; i += itemsPerPage) {
    paginatedRows.push(rows.slice(i, i + itemsPerPage));
  }

  const handlePageChange = (pageIndex) => {
    setCurrentPage(pageIndex);
  };



  //ดึงข้อมูลผู้ตรวจสอบความปลอดภัย
  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/form_examine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: 'fetchUsers' }),
      });
  
      const data = await response.json();
      console.log("Response from API:", data);
  
      if (data.success) {
        // แยกเฉพาะ array ด้านในที่ต้องการ
        const nameData = Array.isArray(data.data) && Array.isArray(data.data[0]) ? data.data[0] : [];
        setUsers(nameData);
      } else {
        console.log("Error fetching users:", data.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  //ดึงข้อมูลวันที่ตรวจสอบ
  const fetchDate = async (userId) => {
    try {
      const response = await fetch("/api/form_examine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: 'fetchDates',
          payload: { userId } 
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

  //ดึงข้อมูลงานที่ตรวจ 
  const fetchExamine = async (date) => {
    try {
      const response = await fetch("/api/form_examine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: 'fetchExamines',
          payload: { date } 
        }), 
      });

      const result = await response.json();
      console.log("Response from API:", result);


    if (result.success) {
      const flattenedData = result.data.flat(); // ลดระดับของ array
      setExamines(flattenedData); // ตั้งค่า dates ใน state
    } else {
      setExamines([]); // รีเซ็ตวันที่
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

 // ดึงข้อมูลรายการตรวจสอบในตาราง
const fetchChecklistData = async (examinename, date) => {
  try {
    const response = await fetch("/api/form_examine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: 'fetchExaminename',
        payload: { examinename, date }
      }),
    });

    const data = await response.json();
    console.log("Response from API:", data);

    if (data.success) {
      // สร้างแถวใน rows โดยแยกข้อมูลตาม name และ status
      const newRows = data.data
        .flat()  // แบนอาร์เรย์ให้เป็นอาร์เรย์เดียว
        .filter(item => item.name || item.status || item.details)  // กรองเฉพาะอ็อบเจ็กต์ที่มี name หรือ status
        .map(item => {
          const isPass = item.status === 'pass'; // ตรวจสอบว่า status เป็น 'pass'
          const isFail = item.status === 'fail'; // ตรวจสอบว่า status เป็น 'fail'

          return {
            checklist: item.name || '',  // ใส่ name ในช่อง "รายการตรวจสอบ"
            standard: isPass ? '✔' : '', // ถ้า status เป็น 'pass' จะติ๊กในช่อง "ได้มาตรฐาน"
            notStandard: isFail ? '✔' : '', // ถ้า status เป็น 'fail' จะติ๊กในช่อง "ไม่ได้มาตรฐาน"
            suggestion: item.details || '-'
          };
        });

      setRows(newRows); // อัปเดตแถวในตาราง

    } else {
      console.error("Failed to fetch checklist data:", data.message);
      setRows([]); // Reset rows on failure
    }
  } catch (error) {
    console.error("Error fetching checklist data:", error);
  }
};

 const handleCheckboxChange = (index, field, value) => {
      const updatedRows = [...rows]; // สร้างสำเนาของ rows
      updatedRows[index][field] = value; // อัปเดตค่าในแถวที่เลือก
      setRows(updatedRows); // อัปเดต rows ด้วยข้อมูลใหม่
    };

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows); // อัปเดตข้อมูลในแถวที่กำหนด
  };

  const handleKeyDown = (e, index) => {
    // ตัวอย่างฟังก์ชันการจัดการ keyDown
    if (e.key === 'Enter') {
      console.log(`Enter pressed in row ${index}`);
    }
  };

  useEffect(() => {
    fetchUsers();

    const today = new Date();
    const formattedDate = today.toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    setCurrentDate(formattedDate);
  }, []);  
  
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
              text: "แบบตรวจความปลอดภัย",
              font: "TH SarabunPSK",
              bold: true,
              size: 32,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 0 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "ผู้ตรวจสอบความปลอดภัย ", font: "TH SarabunPSK", size: 32 }),
            new TextRun({
              text: `${selectedUsers.name && selectedUsers.lastname ? selectedUsers.name + ' ' + selectedUsers.lastname : "...................................................."}`,
              font: "TH SarabunPSK",
              size: 32,
            }),
            new TextRun({ text: "\t\t", font: "TH SarabunPSK", size: 32 }),
            new TextRun({ text: "แผนก/ส่วน ", font: "TH SarabunPSK", size: 32 }),
            new TextRun({ text: `${part || ".................................." }`  , font: "TH SarabunPSK", size: 32 }),
          ],
          tabStops: [
            {
              type: "left",
              position: 5200,
            }
          ],
          spacing: { after: 0 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "งานที่ตรวจ ", font: "TH SarabunPSK", size: 32 }),
            new TextRun({ text: `${selectedExamine.name || "............................................................................"}` , font: "TH SarabunPSK", size: 32 }),
            new TextRun({ text: "\t", font: "TH SarabunPSK", size: 32 }),
            new TextRun({ text: "วันที่ตรวจ  ", font: "TH SarabunPSK", size: 32 }),
            new TextRun({ text: `${selectedDate || "..................................."}` , font: "TH SarabunPSK", size: 32 }),
          ],
          tabStops: [
            {
              type: "left",
              position: 5788,
            }
          ],
          spacing: { after: 400 },
        }),
        new Paragraph({
            children: [
              new TextRun({ text: "คำชี้แจง   ", bold: true, font: "TH SarabunPSK", size: 32, }),
              new TextRun({ text: "(แบบตรวจสอบความปลอดภัยจะมีคำอธิบายในการใช้แบบ เพื่อให้ผู้ตรวจสามารถบันทึกผลการตรวจสอบได้ถูกต้อง)", font: "TH SarabunPSK", size: 28, }),
            ],
            spacing: { after: 400 },
          }),
        );
  
      // สร้างแถวเนื้อหาตามข้อมูลใน rows
const tableRows = rows.map((row, index) => 
  new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: `${index + 1}. ${row.checklist || "-"}` , font: "TH SarabunPSK", size: 32 }),
            ],
          }),
        ],
      }),
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: row.standard === '✔' ? "✔" : "",
                font: "TH SarabunPSK",
                size: 32,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
        ],
      }),
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: row.notStandard === '✔' ? "✔" : "",
                font: "TH SarabunPSK",
                size: 32,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
        ],
      }),
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: row.suggestion || "-", font: "TH SarabunPSK", size: 32 }),
            ],
            alignment: AlignmentType.CENTER,
          }),
        ],
      }),
    ],
  })
);

// เพิ่มแถวหัวข้อ (คงเดิม) และรวมกับแถวเนื้อหาที่สร้างจาก rows
const table = new Table({
  rows: [
    // แถวหัวข้อหลัก
    new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: "รายการตรวจสอบ", bold: true, font: "TH SarabunPSK", size: 32 }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
          shading: { fill: "D9D9D9" },
          rowSpan: 2, 
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: "ผลการตรวจสอบ", bold: true, font: "TH SarabunPSK", size: 32 }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
          columnSpan: 3,
          shading: { fill: "D9D9D9" },
        }),
      ],
    }),

    // แถวหัวข้อย่อย
    new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: "ได้มาตรฐาน", bold: true, font: "TH SarabunPSK", size: 32 }),
              ],
              shading: { fill: "D9D9D9" },
              alignment: AlignmentType.CENTER,
            }),
          ],
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: "ไม่ได้มาตรฐาน", bold: true, font: "TH SarabunPSK", size: 32 }),
              ],
              shading: { fill: "D9D9D9" },
              alignment: AlignmentType.CENTER,
            }),
          ],
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: "ข้อเสนอแนะ", bold: true, font: "TH SarabunPSK", size: 32 }),
              ],
              shading: { fill: "D9D9D9" },
              alignment: AlignmentType.CENTER,
            }),
          ],
        }),
      ],
    }),

    // เพิ่มแถวเนื้อหาที่สร้างจาก rows
    ...tableRows,
  ],
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
      link.download = "แบบตรวจสอบความปลอดภัย.docx";
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
        const response = await fetch("/api/form_examine", {
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
            height: "260mm", // ความสูงของ A4
            marginTop: "100px", // ระยะห่างจากขอบบน
            marginBottom: "100px", // ระยะห่างจากขอบล่าง
            backgroundSize: 'contain', // ไม่ให้ขยายภาพพื้นหลังให้เต็มพื้นที่
            backgroundRepeat: 'no-repeat', // ป้องกันไม่ให้ภาพพื้นหลังซ้ำ
          }}
        >
         {/* Form */}
         <div className="p-8">
        {/* Header */}
        <div className="text-end mb-7">
          <h1 className="text-lg text-center text-black font-bold">
            แบบตรวจความปลอดภัย
          </h1>
        </div>

        {/* Form Content */}
        <div className="space-y-6 text-black">
        
        
          {/* USERS / แผนก */}
          <div className="flex-wrap justify-start">
            <div>
              <label className="text-black mr-1">ผู้ตรวจสอบความปลอดภัย</label>
              <select
          value={`${selectedUsers.name} ${selectedUsers.lastname}`} // ค่า value คือการรวมชื่อและนามสกุล
          onChange={(e) => {
            const selectedName = e.target.value;
            const selectedUser = users.find(user => `${user.name} ${user.lastname}` === selectedName); // หา user ที่เลือก
            setSelectedUsers(selectedUser); // เก็บข้อมูลที่เลือก
            if (selectedUser) {
              fetchDate(selectedUser.id); // เรียก fetchDate เมื่อเลือกผู้ใช้
            }
          }}
          style={{
            width: "36%",
            padding: "6px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "14px",
          }}
        >
          <option value="">เลือกผู้ตรวจสอบ</option>
          {users && users.length > 0 && users.map(user => (
          <option key={user.id} value={`${user.name} ${user.lastname}`}>
            {user.name} {user.lastname}
          </option>
          ))}
        </select>
        
              <label className="text-black mr-1 ml-2">⠀แผนก/ส่วน</label>
              <input
            type="text" id="time" name="time" 
            value={part}
            onChange={(e) => setPart(e.target.value)} 
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

   {/* วันที่ / งานที่ตรวจ */}
          <div className="flex-wrap justify-start ">
            <div>
              <label className="text-black mr-2">วันที่</label>
              <select
                value={selectedDate}
                onChange={(e) => {
                const date = e.target.value;
                setSelectedDate(date);
                if (date) {
                  fetchExamine(date); // เรียก fetchDate เมื่อเลือกผู้ใช้
                }
            }}  
  style={{
    width: "25%",
    padding: "6px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "14px",
  }}
>
  <option value="">-- วันที่ตรวจสอบ --</option>
  {dates.length > 0 ? (
    dates.map((item, index) => (
      <option key={index} value={item.date}>
        {item.date}
      </option>
    ))
  ) : (
    <option value="">ไม่มีวันที่ตรวจสอบความปลอดภัย</option>
  )}
</select>

<label className="text-black ml-4 mr-1">งานที่ตรวจ</label>
<select
  value={selectedExamine.name} // Display only the 'name' value
  onChange={(e) => {
    const selectedOption = examines.find(item => item.name === e.target.value);
    setSelectedExamine(selectedOption); // Set the selected object with 'id' and 'name'
    if (selectedOption) {
      fetchChecklistData(selectedOption.id, selectedDate); // Call the function with 'id'
      //fetchStatus(selectedOption.id, selectedDate)
    }
  }}
  style={{
    width: "50%",
    padding: "6px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "14px",
  }}
>
  <option value="">-- เลือกงานที่ตรวจสอบ --</option>
  {examines.length > 0 ? (
    examines.map((item, index) => (
      <option key={index} value={item.name}> {/* Only display the name in the option */}
        {item.name}
      </option>
    ))
  ) : (
    <option value="">ไม่มีงานที่ตรวจสอบ</option>
  )}
</select>


            </div>
          </div>

        
        
          <div>
              <label className="text-black font-bold ">คำชี้แจง</label>
              <label className="text-black mt-5 ">  (แบบตรวจสอบความปลอดภัยจะมีคำอธิบายในการใช้แบบ เพื่อให้ผู้ตรวจสามารถบันทึกผลการตรวจสอบได้ถูกต้อง)</label>

            </div>

{/* ตาราง */}
<table className="w-full border-collapse border border-black">
        <thead>
          <tr>
            <th className="border border-black bg-gray-300 p-2" style={{ width: "40%" }} rowSpan="2">
              รายการตรวจสอบ
            </th>
            <th className="border border-black bg-gray-300 p-2" colSpan="3">
              ผลการตรวจสอบ
            </th>
          </tr>
          <tr>
            <th className="border border-black bg-gray-300 p-2" style={{ width: "16%" }} >ได้มาตรฐาน</th>
            <th className="border border-black bg-gray-300 p-2" style={{ width: "16%" }}>ไม่ได้มาตรฐาน</th>
            <th className="border border-black bg-gray-300 p-2" style={{ width: "30%" }} >ข้อเสนอแนะ</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRows[currentPage]?.map((row, index) => (
            <tr key={index}>
              <td className="border border-black p-2 text-start">
                {`${currentPage * itemsPerPage + index + 1}. ${row.checklist}`}
              </td>
              <td className="border border-black p-2 text-center">
                <div
                  className={`mx-auto w-6 h-6 rounded-lg flex items-center justify-center ${
                    row.standard === "✔" ? "bg-green-700 text-white" : "bg-white border-gray-400"
                  }`}
                >
                  {row.standard === "✔" && "✔"}
                </div>
              </td>
              <td className="border border-black p-2 text-center">
                <div
                  className={`mx-auto w-6 h-6 rounded-lg flex items-center justify-center ${
                    row.notStandard === "✔" ? "bg-gray-500 text-white" : "bg-white border-gray-400"
                  }`}
                >
                  {row.notStandard === "✔" && "✔"}
                </div>
              </td>
              <td className="border text-center border-black p-2">
                {row.suggestion || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

 {/* ตัวแบ่งหน้า */}
 <div className="flex justify-center mt-4">
        {paginatedRows.map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index)}
            className={`mx-1 px-4 py-2 rounded ${
              currentPage === index ? "bg-green-700 text-white" : "bg-gray-200 text-black"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      </div>
    </div>

{/* ปุ่มดาวโหลด */}
<div className="flex justify-center item-center absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <button  onClick={generateDOCX} 
        className="bg-[#5A975E] download-button text-center">
          download
        </button>
      </div>
    </div>
    </div>
    </div>
);
}

export default SafetyReportFormExamine;