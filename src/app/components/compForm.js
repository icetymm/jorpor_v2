'use client'; 

import React, { useState, useEffect } from 'react';
import '../globals.css'
import '@fontsource/mitr';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon } from '@heroicons/react/solid'; // or '@heroicons/react/outline' if you're using the outlined version
import CompNavbar from './compNavbar/role_admin';
import { CompLanguageProvider, useLanguage } from './compLanguageProvider_role_admin';
import { useTranslation } from 'react-i18next';


function CompForm() {
  return (
    <CompLanguageProvider>
      <FilterForm/>
    </CompLanguageProvider>
  );
}

const FilterForm = () => {
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();

    const[tags, setTags] = useState([]);
    const[selectedTag, setSelectedTag] = useState("");//ค่าที่กรอกใน input Tag
    const[startDate, setStartDate] = useState("");
    const[endDate, setEndDate] = useState("");
    const [results, setResults] = useState([]);// เก็บผลลัพธ์การค้นหา
    const [documentType, setDocumentType] = useState("");
    const [currentPage, setCurrentPage] = useState(1); // หน้าปัจจุบัน
    const router = useRouter();
    const [documents, setDocuments] = useState([]); // เก็บข้อมูลเอกสารทั้งหมด
    const [filteredDocuments, setFilteredDocuments] = useState(documents);
    const itemsPerPage = 4; // กำหนดจำนวนแถวต่อหน้า
    const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
    const [isLoading, setIsLoading] = useState(false); // สถานะการโหลด


    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('/api/form'); // ตรวจสอบเส้นทาง API
          const data = await response.json();
          setDocuments(data); // ตั้งค่าข้อมูลเอกสาร
        } catch (error) {
          console.error('Error fetching documents:', error);
        }
      };
    
      fetchData();
    }, []);

    // ฟังก์ชันสำหรับแปลง ISO String เป็นรูปแบบ YYYY-MM-DD HH:MM:SS
const formatDate = (isoString) => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  //const hours = String(date.getHours()).padStart(2, '0');
  //const minutes = String(date.getMinutes()).padStart(2, '0');
  //const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${day}/${month}/${year}`;
};

    function base64ToBlob(base64, mimeType) {
      const byteCharacters = atob(base64); // แปลง Base64 เป็น binary string
      const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0)); // แปลงเป็น array ของ byte
      const byteArray = new Uint8Array(byteNumbers); // แปลงเป็น Uint8Array
      return new Blob([byteArray], { type: mimeType }); // สร้าง Blob
    }
    
    // ฟังก์ชันดาวน์โหลด Blob
    function downloadBlob(blob, fileName) {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // ลบลิงก์หลังจากคลิก
    }
    
    // ฟังก์ชันแปลง Base64 ซ้อนชั้น
    function handleViewFile(nestedBase64, fileName = 'document.docx') {
      try {
        const mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        
        // แปลง Base64 ครั้งแรก
        const firstDecode = atob(nestedBase64); 
        const secondBase64 = firstDecode.trim(); // ลบช่องว่างหรือ newline หากมี
    
        // แปลง Base64 ครั้งที่สอง
        const blob = base64ToBlob(secondBase64, mimeType);
        
        // ดาวน์โหลดไฟล์
        downloadBlob(blob, fileName);
        console.log("ไฟล์ถูกสร้างและดาวน์โหลดสำเร็จ!");
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการแปลง Base64:', error);
      }
    }

 // ฟังก์ชันกรองข้อมูลตามวันที่, Tag, ชื่อเอกสาร และผู้สร้าง
 const handleSearch = () => {
  let filtered = documents;

  // กรองตามช่วงวันที่
  if (startDate && endDate) {
    filtered = filtered.filter((doc) => {
      const docDate = new Date(doc.created_at).toISOString().split('T')[0];
      return docDate >= startDate && docDate <= endDate;
    });
  }

  // กรองตาม Tag (ค้นหาจากชื่อเอกสาร หรือผู้สร้าง)
  if (selectedTag) {
    filtered = filtered.filter((doc) => {
      const lowerCaseTag = selectedTag.toLowerCase(); // แปลงคำค้นหาเป็นตัวพิมพ์เล็ก
      return (
        doc.document_name.toLowerCase().includes(lowerCaseTag) || // เปรียบเทียบคำค้นหากับชื่อเอกสาร
        doc.creator_name.toLowerCase().includes(lowerCaseTag) // เปรียบเทียบคำค้นหากับผู้สร้าง
      );
    });
  }
  // กรองตามประเภทเอกสาร
  if (documentType) {
    filtered = filtered.filter((doc) => doc.document_name === documentType);
  }

  setFilteredDocuments(filtered);
};

useEffect(() => {
  handleSearch();
}, [startDate, endDate, documentType, documents]); // คำนวณใหม่ทุกครั้งที่เลือกวันที่หรือประเภทเอกสารหรือเอกสารมีการเปลี่ยนแปลง

    
     // เพิ่ม Tag เข้าไปในรายการ
  const handleAddTag = () => {
    if (selectedTag && !tags.includes(selectedTag)) {
      setTags([...tags, selectedTag]);
      setSelectedTag("");
    }
  };
  // ลบ Tag ออกจากรายการ
  const handleRemoveTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

      const handleSelectChange = (e) => {
        const selectedForm = e.target.value; // ค่าที่ผู้ใช้เลือกจาก Dropdown
    
        // ตรวจสอบค่าและเปลี่ยนเส้นทางไปหน้าที่กำหนด
        switch (selectedForm) {
          case "แบบฟอร์มการวิเคราะห์งานเพื่อความปลอดภัย":
            router.push("/form_analysisforsafety");
            break;
          case "แบบการเฝ้าสังเกตุการปฏิบัติงาน":
            router.push("/form_operationwork");
            break;
          case "แบบตรวจความปลอดภัย":
            router.push("/form_examine");
            break;
          case "แบบบันทึกการสอบสวนอุบัติเหตุ":
            router.push("/form_accident");
            break;
          case "แบบบันทึกการวิเคราะห์อุบัติเหตุ":
            router.push("/form_analysisaccident");
            break;
          case "แบบ สปร.5":
            router.push("/form_seriousaccident");
            break;
          case "แบบ จป.(ท)":
            router.push("/safetyform");
            break;
          default:
            break;
        }
      };
    
// คำนวณข้อมูลที่จะแสดงในแต่ละหน้าของ **ตาราง**
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentItems = filteredDocuments.slice(indexOfFirstItem, indexOfLastItem);


  // ในกรณีเริ่มต้น แสดงเอกสารทั้งหมดใน `results`
useEffect(() => {
  setResults(documents); // ตั้งค่าเอกสารทั้งหมดในตอนเริ่มต้น
}, [documents]);

  // ฟังก์ชันเพื่อเปลี่ยนหน้า
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

return (
  <div>
      <CompNavbar />

    <div className=' bg-[url("/bg1.png")]  overflow-auto bg-cover bg-no-repeat absolute z-[-1] top-0 left-0 w-full h-full bg-center '>
      <div className='md:w-[1000px] flex justify-center items-center mx-auto'>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0'>
          <div className='bg-[#5A985E] mx-auto max-w-[500px] sm:max-w-[350px] py-[100px] rounded-[50px]'></div>
        </div>
        
        <div className='relative mx-auto w-full max-w-[1000px] py-5 text-black flex flex-col rounded-[30px] bg-[#fff]  z-10 shadow-md'
        style={{
          height: "162mm", // ความสูงของ A4
          marginTop: "100px", // ระยะห่างจากขอบบน
          //marginBottom: "100px", // ระยะห่างจากขอบล่าง
          backgroundSize: 'contain', // ไม่ให้ขยายภาพพื้นหลังให้เต็มพื้นที่
          backgroundRepeat: 'no-repeat', // ป้องกันไม่ให้ภาพพื้นหลังซ้ำ
        }}>
          
          <h1 className='text-left text-[25px] md:text-[30px] mt-1 mb-2 px-5'>{"รายงานเอกสาร"}</h1>
          <div className="border-t border-gray-300"></div>

          <div className="px-5">

          {/** เอกสารและวันที่ */}
            <div className="flex justify-start items-center mb-5">
             {/** เอกสาร */}
              <div className="flex items-center mt-3">
              <img src="https://cdn-icons-png.flaticon.com/512/176/176040.png" 
              alt="เอกสาร" className="w-5 h-5 mr-2" />
                <label className="mr-2">{"เอกสาร"}</label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-[85%] ml-2 item-left border border-gray-300 rounded-lg px-2 py-2 text-black bg-white focus:ring-2 focus:ring-gray-500 focus:outline-none"
                  >
                  <option value="">{"ทั้งหมด"}</option>
                  <option value="แบบฟอร์มการวิเคราะห์งานเพื่อความปลอดภัย">{"แบบฟอร์มการวิเคราะห์งานเพื่อความปลอดภัย"}</option>
                  <option value="แบบการเฝ้าสังเกตุการปฏิบัติงาน">{"แบบการเฝ้าสังเกตุการปฏิบัติงาน"}</option>
                  <option value="แบบตรวจความปลอดภัย">{"แบบตรวจความปลอดภัย"}</option>
                  <option value="แบบบันทึกการสอบสวนอุบัติเหตุ">{"แบบบันทึกการสอบสวนอุบัติเหตุ"}</option>
                  <option value="แบบบันทึกการวิเคราะห์อุบัติเหตุ">{"แบบบันทึกการวิเคราะห์อุบัติเหตุ"}</option>
                  <option value="แบบ สปร.5">{"แบบ สปร.5"}</option>
                  <option value="แบบ จป.(ท)">{"แบบ จป.(ท)"}</option>
                </select>
              </div>
              {/** ระหว่างวันที่ */}
              <div className="flex items-center  mt-3">
              <img src="https://cdn-icons-png.flaticon.com/512/55/55281.png" 
              alt="วันที่" className="w-5 h-5 mr-2 ml-24" />
                <label className="mr-2">{"ระหว่าง"}</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mx-2 px-2 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
                />
                ~
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mx-2 px-2 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-start items-center">
            {/** tags */}
            <div className="flex items-center ">
            <img src="https://cdn-icons-png.flaticon.com/512/126/126422.png" 
              alt="แท็ก" className="w-4 h-5 mr-2" />
              <label className="mr-5">{"Tag(s)"}</label>
              <div className="flex items-center ">
                <input
                  type="text"
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                      handleSearch();
                    }
                  }}
                  placeholder={"กรอก Tag"}
                  className="px-2 py-2 border rounded-lg mr-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
                />
                <button
                  onClick={handleSearch}
                  className="bg-[#5A985E] ml-3 hover:bg-green-700 text-white px-3 py-1 text-sm rounded transition"
                >
                  {"ค้นหา"}
                </button>
              </div>

             
          
            </div>
             {/** สร้างเอกสาร */}
             <div className="flex items-center">
              <img src="https://cdn2.iconfinder.com/data/icons/folderico-nic/128/Folder_Plus_Add_Create_Insert-512.png" 
              alt="สร้างเอกสาร" className="w-5 h-5 mr-2 ml-32" />
              <label className="block text-md text-black">{"สร้าง"}
                
              </label>
  <select
    onChange={handleSelectChange}
    defaultValue="" // ค่าเริ่มต้น
    className="w-[90%] ml-6  border border-gray-300 rounded-lg px-2 py-2 text-gray-800 bg-white focus:ring-2 focus:ring-gray-500 focus:outline-none"
  >
    <option value="" disabled hidden>
      {"เลือกเอกสารที่ต้องการ"}
    </option>
    <option value="แบบฟอร์มการวิเคราะห์งานเพื่อความปลอดภัย">
      {"แบบฟอร์มการวิเคราะห์งานเพื่อความปลอดภัย"}
    </option>
    <option value="แบบการเฝ้าสังเกตุการปฏิบัติงาน">
      {"แบบการเฝ้าสังเกตุการปฏิบัติงาน"}
    </option>
    <option value="แบบตรวจความปลอดภัย">{"แบบตรวจความปลอดภัย"}</option>
    <option value="แบบบันทึกการสอบสวนอุบัติเหตุ">
      {"แบบบันทึกการสอบสวนอุบัติเหตุ"}
    </option>
    <option value="แบบบันทึกการวิเคราะห์อุบัติเหตุ">
      {"แบบบันทึกการวิเคราะห์อุบัติเหต"}
    </option>
    <option value="แบบ สปร.5">{"แบบ สปร.5"}</option>
    <option value="แบบ จป.(ท)">{"แบบ จป.(ท)"}</option>
  </select>
          </div>
 </div>

            {/** Tag */}
            <div className="mt-3 flex flex-wrap">
              {tags.length > 0 && (
                <div>
                  {/*<h3 className="text-sm font-medium mb-2">{"Tags ที่เลือก:"}</h3>*/}
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 bg-white border border-green-700 text-sm text-gray-800 rounded-full"
                      >
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-3 text-gray-400 hover:text-red-600 text-xs font-bold"
                        >
                          x
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className='px-5'>
  {/** ตารางข้อมูล */}
  <div className='mt-5'>
  {currentItems.length > 0 ? (
    <table className='min-w-full table-auto rounded-lg overflow-hidden border border-gray-300 shadow-md'>
      <thead className='bg-[#5A985E] text-white'>
        <tr>
          <th className='border p-3 text-left font-medium w-1/4'>วันที่สร้าง</th>
          <th className='border p-3 text-left font-medium w-1/3'>ชื่อเอกสาร</th>
          <th className='border p-3 text-left font-medium w-1/4'>ผู้สร้าง</th>
          <th className='border p-3 text-left font-medium w-1/6'>ไฟล์</th>
        </tr>
      </thead>
      <tbody>
        {currentItems.map((item, index) => (
          <tr
            key={index}
            className='hover:bg-[#EDF2F7] transition-colors duration-300'
          >
            <td className='border p-3 text-ellipsis overflow-hidden whitespace-nowrap'>
              {formatDate(item.created_at)}
            </td>
            <td className='border p-3 text-ellipsis overflow-hidden whitespace-nowrap'>
              {item.document_name}
            </td>
            <td className='border p-3 text-ellipsis overflow-hidden whitespace-nowrap'>
              {item.creator_name}
            </td>
            <td className='border p-3 text-center'>
              <button
                onClick={() =>
                  handleViewFile(
                    typeof item.file_url !== "string"
                      ? Buffer.from(item.file_url).toString("base64") // กรณีเป็น Buffer
                      : item.file_url, // กรณีเป็น Base64
                    item.document_name
                  )
                }
                className='px-2 py-1 bg-gray-500 text-center item-center justify-center text-sm text-white rounded hover:bg-[#5A985E] transition-colors'
              >
                ดูเอกสาร
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <div className='flex justify-center absolute top-1/2 text-gray-400 left-1/2 transform -translate-x-1/2'>
      ไม่มีข้อมูล
    </div>
  )}
  </div>
    </div>
          </div>

        {/** pagination */}
          <div className="flex justify-center absolute bottom-6 left-1/2 transform -translate-x-1/2">  <button
    onClick={() => paginate(currentPage - 1)}
    disabled={currentPage === 1}
    className={`px-4 py-2 mx-1 border border-gray-300 rounded-l ${
      currentPage === 1
        ? "bg-gray-200 text-gray-400 rounded"
        : "bg-white text-gray-600 hover:bg-gray-100"
    }`}
  >
    Previous
  </button>

  {/* แสดงเลขหน้า */}
  {[...Array(totalPages)].map((_, index) => {
    if (
      index === 0 || // หน้าแรก
      index === totalPages - 1 || // หน้าสุดท้าย
      (index >= currentPage - 2 && index <= currentPage + 2) // หน้ารอบๆ currentPage
    ) {
      return (
        <button
          key={index}
          onClick={() => paginate(index + 1)}
          className={`px-4 py-2 mx-1 border ${
            currentPage === index + 1
              ? "bg-[#5A985E] text-white rounded"
              : "bg-white text-gray-600 hover:bg-gray-100 rounded"
          }`}
        >
          {index + 1}
        </button>
      );
    }

    if (
      index === currentPage - 3 || // ก่อนหน้าช่วงที่แสดง
      index === currentPage + 3 // หลังช่วงที่แสดง
    ) {
      return (
        <span
          key={index}
          className="px-4 py-2 mx-1 border bg-white text-gray-400"
        >
          ...
        </span>
      );
    }

    return null;
  })}

  <button
    onClick={() => paginate(currentPage + 1)}
    disabled={currentPage >= totalPages}
    className={`px-4 py-2 mx-1 border border-gray-300 rounded-r ${
      currentPage >= totalPages
        ? "bg-gray-200 text-gray-400  rounded"
        : "bg-white text-gray-600 hover:bg-gray-100 rounded"
    }`}
  >
    Next
  </button>
</div>


        </div>

      </div>
    </div>

    </div>
  );
};

export default CompForm;