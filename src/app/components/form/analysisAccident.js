//แบบบันทึกการวิเคราะห์อุบัติเหตุ

"use client";

import React, { useState, useEffect ,useRef} from 'react';
import Link from 'next/link'
import '../../globals.css';
import '@fontsource/mitr';
import { IoMdDownload } from "react-icons/io";
import { Document, Packer, Paragraph, Table, TableRow, TableCell, AlignmentType,VerticalAlign,TableLayoutType , TextDirection, TextRun, BorderStyle, WidthType } from "docx";
import CompNavbar from '../compNavbar/role_1';
import { ChevronRightIcon } from '@heroicons/react/solid';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { th } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";



const SafetyReportFormAnalysisAccident = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [time, setTime] = useState('');
  const [detail, setDetail] = useState('');
  const [injury, setInjury] = useState('');
  const [body, setBody] = useState('');
  const [beginninginjury, setBeginninginjury] = useState('');
  const [type, setType] = useState('');
  const [dangerous, setDangerous] = useState('');
  const [accident, setAccident] = useState('');
  const [partaccident, setPartaccident] = useState('');
  const [unsafe, setUnsafe] = useState('');
  const router = useRouter(); // ใช้ useRouter เพื่อควบคุมการเปลี่ยนหน้า

  

  
  useEffect(() => {

    const today = new Date();
    const formattedDate = today.toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    setCurrentDate(formattedDate);
  }, []);

  const formatDate = (date) => {
    if (!date) return ""; // ถ้า date ไม่มีค่า ให้คืนค่าว่าง
    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) return ""; // ถ้าไม่สามารถแปลงเป็นวันที่ได้ ให้คืนค่าว่าง
    const day = String(parsedDate.getDate());
    const month = String(parsedDate.getMonth() + 1);
    //const year = parsedDate.getFullYear() + 543; // แปลงปี ค.ศ. เป็น พ.ศ.
    const year = String(parsedDate.getFullYear() + 543).slice(-2); // แปลงปี ค.ศ. เป็น พ.ศ. และเอาแค่ 2 ตัวท้าย

    return `${day}/${month}/${year}`; // คืนค่าที่เป็นรูปแบบ dd/mm/yyyy
  };

  

  const handleNext = () => {
    const formData = {
      name,
      department,
      selectedDate: formatDate(selectedDate),
      time,
      detail,
      injury,
      body,
      beginninginjury,
      type,
      dangerous,
      accident,
      partaccident,
      unsafe,
    };
    localStorage.setItem('analysisAccident', JSON.stringify(formData));
  };

  const handleFormSubmit = () => {
    // ตรวจสอบว่าข้อมูลทุกฟิลด์กรอกครบหรือไม่
    if (
      name &&
      department &&
      selectedDate &&
      time &&
      detail &&
      injury &&
      body &&
      beginninginjury &&
      type &&
      dangerous &&
      accident &&
      partaccident &&
      unsafe
    ) {
      // ถ้าข้อมูลครบถ้วน, เรียกฟังก์ชันดาวน์โหลด
      generateDOCX();
      return true; // ส่งค่า true เพื่อบอกว่าข้อมูลครบ
    } else {
      // ถ้าข้อมูลไม่ครบ, แจ้งเตือนผู้ใช้
      alert("กรุณากรอกข้อมูลให้ครบทุกช่อง!");
      return false; // ส่งค่า false เพื่อบอกว่าข้อมูลไม่ครบ
    }
  };
  
  const generateDOCX = async () => {
    try {
        const formattedDate = selectedDate
        ? selectedDate.toLocaleDateString("th-TH", { day: "2-digit", month: "2-digit", year: "numeric" })
        : ".............................................................";
  
      const doc = new Document({
        sections: [],
      });
  
      const content = [];
  
      // หัวข้อเอกสาร
      content.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "แบบบันทึกการวิเคราะห์อุบัติเหตุ",
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
            new TextRun({ text: "ชื่อผู้ได้รับบาดเจ็บ  ", font: "TH SarabunPSK", size: 32 }),
            new TextRun({ text: name|| "...................................................." , font: "TH SarabunPSK", size: 32 }),
            new TextRun({ text: "\t", font: "TH SarabunPSK", size: 32 }),
            new TextRun({ text: "แผนก  ", font: "TH SarabunPSK", size: 32 }),
            new TextRun({ text: department|| "................................................."  , font: "TH SarabunPSK", size: 32 }),
          ],
          tabStops: [
            {
              type: "left",
              position: 5788,
            }
          ],
          spacing: { after: 0 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "วัน/เดือน/ปี         ", font: "TH SarabunPSK", size: 32 }),
            new TextRun({ text: formattedDate||".............................................................", font: "TH SarabunPSK", size: 32 }),
            new TextRun({ text: "\t", font: "TH SarabunPSK", size: 32 }),
            new TextRun({ text: "เวลา   ", font: "TH SarabunPSK", size: 32 }),
            new TextRun({ text: time|| ".................................................." , font: "TH SarabunPSK", size: 32 }),
          ],
          tabStops: [
            {
              type: "left",
              position: 5788,
            }
          ],
          spacing: { after: 0 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "รายละเอียดการเกิดอุบัติเหตุ (โดยสังเขป)   ", font: "TH SarabunPSK", size: 32 }),
            new TextRun({ text: detail|| "..........................................................................................................................................................................................................................................................................................................................................................." ,font: "TH SarabunPSK", size: 32 }),
          ],
          spacing: { after: 400 },
        })
      );
  
      // ตาราง 1
      const table1 = new Table({
        rows: [
          // แถวหัวข้อหลัก
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun ({ text: "หัวข้อการวิเคราะห์", bold: true, font: "TH SarabunPSK", size: 32, })
                    ],
                    shading: { fill: "D9D9D9" },
                    alignment: AlignmentType.CENTER,
                  }),
                ],
                verticalAlign: VerticalAlign.CENTER, // จัดแนวข้อความให้อยู่ตรงกลางแนวตั้ง
                width: {
                  size: 300, // ขนาดของเซลล์ที่กำหนด (สามารถปรับได้ตามต้องการ)
                  type: WidthType.DXA,
                },
                textDirection: TextDirection.LEFT_TO_RIGHT, // กำหนดทิศทางข้อความ
              }),

              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun ({ text: "ผลการวิเคราะห์", bold: true, font: "TH SarabunPSK", size: 32, })
                    ],
                    shading: { fill: "D9D9D9" },
                    alignment: AlignmentType.CENTER,
                  }),
                ]
              }),
            ],
            verticalAlign: VerticalAlign.CENTER, // จัดแนวข้อความให้อยู่ตรงกลางแนวตั้ง
            width: {
              size: 300, // ขนาดของเซลล์ที่กำหนด (สามารถปรับได้ตามต้องการ)
              type: WidthType.DXA,
            },
            textDirection: TextDirection.LEFT_TO_RIGHT, // กำหนดทิศทางข้อความ
          }),
          
              //1.
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun ({ text: "1. ลักษณะการบาดเจ็บ" , font: "TH SarabunPSK", size: 32, })                       
                        ],
                      }),
                    ] 
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun ({ text: injury|| "....................................................................." , font: "TH SarabunPSK", size: 32, })                       
                        ],
                      }),
                    ],
                    margins: { top: 100, bottom: 100, left: 100, right: 100 }, // เพิ่มระยะขอบภายในเซลล์ 
                  })
                ],
              }),

              //2. ส่วนของร่างกาย
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun ({ text: "2. ส่วนของร่างกาย" , font: "TH SarabunPSK", size: 32, })                       
                        ],
                      }),
                    ] 
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun ({ text: body || "..................................................................." , font: "TH SarabunPSK", size: 32, })                       
                        ],
                      }),
                    ],
                    margins: { top: 100, bottom: 100, left: 100, right: 100 }, // เพิ่มระยะขอบภายในเซลล์ 
                  })
                ],
              }),

              // 3.
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun ({ text: "3. ต้นตอการบาดเจ็บ" , font: "TH SarabunPSK", size: 32, })                       
                        ],
                      }),
                    ] 
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun ({ text: beginninginjury || "....................................................................." , font: "TH SarabunPSK", size: 32, })                       
                        ],
                      }),
                    ],
                    margins: { top: 100, bottom: 100, left: 100, right: 100 }, // เพิ่มระยะขอบภายในเซลล์ 
                  })
                ],
          }),

          //4.
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun ({ text: "4. ประเภท (ชนิด) อุบัติเหตุ " , font: "TH SarabunPSK", size: 32, })                       
                    ],
                  }),
                ] 
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun ({ text: type || "....................................................................." , font: "TH SarabunPSK", size: 32, })                       
                    ],
                  }),
                ],
                margins: { top: 100, bottom: 100, left: 100, right: 100 }, // เพิ่มระยะขอบภายในเซลล์ 
              })
            ],
          }),

          //5.
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun ({ text: "5. สภาพที่เป็นอันตราย" , font: "TH SarabunPSK", size: 32, })                       
                    ],
                  }),
                ] 
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun ({ text: dangerous || "....................................................................." , font: "TH SarabunPSK", size: 32, })                       
                    ],
                  }),
                ],
                margins: { top: 100, bottom: 100, left: 100, right: 100 }, // เพิ่มระยะขอบภายในเซลล์ 
              })
            ],
          }),
          //6
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun ({ text: "6. ตัวเหตุที่ทำให้เกิดอุบัติเหตุ" , font: "TH SarabunPSK", size: 32, })                       
                    ],
                  }),
                ] 
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun ({ text: accident || "....................................................................." , font: "TH SarabunPSK", size: 32, })                       
                    ],
                  }),
                ],
                margins: { top: 100, bottom: 100, left: 100, right: 100 }, // เพิ่มระยะขอบภายในเซลล์ 
              })
            ],
          }),
          //7
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun ({ text: "7. ส่วนของตัวเหตุที่ทำให้เกิดอุบัติเหตุ  " , font: "TH SarabunPSK", size: 32, })                       
                    ],
                  }),
                ],
                
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun ({ text: partaccident || "....................................................................." , font: "TH SarabunPSK", size: 32, })                       
                    ],
                  }),
                ],
                margins: { top: 100, bottom: 100, left: 100, right: 100 }, // เพิ่มระยะขอบภายในเซลล์ 
              })
            ],
            
          }),
          //8
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun ({ text: "8. การกระทำที่ไม่ปลอดภัย" , font: "TH SarabunPSK", size: 32, })                       
                    ],
                  }),
                ] 
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [ 
                      new TextRun ({ text: unsafe || "....................................................................." , font: "TH SarabunPSK", size: 32, })                       
                    ],
                  }),
                ],
                margins: { top: 100, bottom: 100, left: 100, right: 100 }, // เพิ่มระยะขอบภายในเซลล์ 
              })
            ],
          }),
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
  
      // เพิ่มตาราง 1 ลงใน content
      content.push(table1);
  
      // เพิ่มหัวข้อการจำแนกลักษณะการบาดเจ็บ
      content.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "ตัวอย่าง การจำแนกลักษณะการบาดเจ็บและประเภท (ชนิด) อุบัติเหตุ",
              font: "TH SarabunPSK",
              bold: true,
              size: 30,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 100, before: 100 },
        })
      );
  
      // ตาราง 2
      const table2 = new Table({
        rows: [
           // แถวหัวข้อหลัก
           new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun ({ text: "ลักษณะการบาดเจ็บ", bold: true, font: "TH SarabunPSK", size: 28, })
                    ],
                    shading: { fill: "D9D9D9" },
                    alignment: AlignmentType.CENTER,
                  }),
                ],
                verticalAlign: VerticalAlign.CENTER, // จัดแนวข้อความให้อยู่ตรงกลางแนวตั้ง
                width: {
                  size: 50, // ขนาดของเซลล์ที่กำหนด (สามารถปรับได้ตามต้องการ)
                  type: WidthType.DXA,
                },
                textDirection: TextDirection.LEFT_TO_RIGHT, // กำหนดทิศทางข้อความ
              }),

              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun ({ text: "ประเภท (ชนิด) อุบัติเหตุ", bold: true, font: "TH SarabunPSK", size: 28, })
                    ],
                    shading: { fill: "D9D9D9" },
                    alignment: AlignmentType.CENTER,
                  }),
                ]
              }),
            ],
            verticalAlign: VerticalAlign.CENTER, // จัดแนวข้อความให้อยู่ตรงกลางแนวตั้ง
            width: {
              size: 50, // ขนาดของเซลล์ที่กำหนด (สามารถปรับได้ตามต้องการ)
              type: WidthType.DXA,
            },
            textDirection: TextDirection.LEFT_TO_RIGHT, // กำหนดทิศทางข้อความ
          }),

          //1
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun ({ text: "⠀แผลถูกตัด⠀⠀⠀⠀⠀⠀⠀⠀ แผลฉีกขาด"  , font: "TH SarabunPSK", size: 28, })                       
                    ],
                  }),
                ] 
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun ({ text: "⠀ล้ม ตกจากที่สูง⠀⠀ ⠀⠀ การกระเด็น" , font: "TH SarabunPSK", size: 28, })                       
                    ],
                  }),
                ],
              })
            ],
          }),

          //2
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun ({ text: "⠀แผลไฟไหม้ น้ำร้อนลวก⠀⠀⠀แผลถลอก ฟกช้ำ"  , font: "TH SarabunPSK", size: 28, })                       
                    ],
                  }),
                ] 
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun ({ text: "⠀ลื่นล้ม⠀⠀ ⠀⠀⠀ ⠀⠀  ถูกขูดข่วน ถลอก" , font: "TH SarabunPSK", size: 28, })                       
                    ],
                  }),
                ],
              })
            ],
          }),

           //3
           new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun ({ text: "⠀แผลไหม้จากสารเคมี⠀⠀ ⠀⠀ไส้เลื่อน"  , font: "TH SarabunPSK", size: 28, })                       
                    ],
                  }),
                ] 
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun ({ text: "⠀ถูกหนีบ ดึง⠀⠀⠀⠀⠀⠀ ไฟฟ้า ไฟไหม้" , font: "TH SarabunPSK", size: 28, })                       
                    ],
                  }),
                ],
              })
            ],
          }),

          //4
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun ({ text: "⠀ถูกกระแทก ชน⠀⠀⠀⠀⠀⠀ ปวดกล้ามเนื้อ"  , font: "TH SarabunPSK", size: 28, })                       
                    ],
                  }),
                ] 
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun ({ text: "⠀ถูกกระแทก ชน⠀⠀⠀⠀  สัมผัสสารเคมี"  , font: "TH SarabunPSK", size: 28, })                       
                    ],
                  }),
                ],
              })
            ],
          }),


          //5
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun ({ text: "⠀แผลถูกบาด ฉีกข่วน⠀⠀⠀⠀ โรคผิวหนังอักเสบ"  , font: "TH SarabunPSK", size: 28, })                       
                    ],
                  }),
                ] 
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun ({ text: "⠀การถูกตัด บาด⠀⠀⠀⠀⠀อุบัติเหตุจากยานพาหนะ"  , font: "TH SarabunPSK", size: 28, })                       
                    ],
                  }),
                ],
              })
            ],
          }),

          //6
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun ({ text: "⠀แผลถูกทิ่มแทง เจาะ⠀⠀⠀⠀ข้อเคล็ด"  , font: "TH SarabunPSK", size: 28, })                       
                    ],
                  }),
                ] 
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun ({ text: "⠀การหล่นทับ พังหลาย⠀⠀ โรคจากการทำงาน" , font: "TH SarabunPSK", size: 28, })                       
                    ],
                  }),
                ],
              })
            ],
          }),

          //7
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun ({ text: "⠀กระดูกหัก⠀⠀⠀⠀⠀⠀⠀⠀อื่นๆ เช่น เนื้อโปน"  , font: "TH SarabunPSK", size: 28, })                       
                    ],
                  }),
                ] 
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun ({ text: "⠀ยกของหนัก⠀⠀⠀⠀⠀⠀ ท่าทางการทำงาน" , font: "TH SarabunPSK", size: 28, })                       
                    ],
                  }),
                ],
              })
            ],
          }),

           //8
           new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun ({ text: "⠀⠀⠀⠀"  , font: "TH SarabunPSK", size: 28, })                       
                    ],
                  }),
                ] 
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun ({ text: "⠀การถูกเจาะ ทิ่มแทง" , font: "TH SarabunPSK", size: 28, })                       
                    ],
                  }),
                ],
              })
            ],
          }),
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
          insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" }, // เส้นสีขาว
          insideVertical: { style: BorderStyle.SINGLE, size: 1,},   // เส้นสีขาว
        },
      });
  
      // เพิ่มตาราง 2 ลงใน content
      content.push(table2);
  
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
    link.download = "แบบบันทึกการวิเคราะห์อุบัติเหตุ.docx";
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
          storedId: storedId,
          file: base64String, // ส่ง Base64 string ไปใน JSON
        };
        //console.log("Payloads to send:", payloads);
  
        // ส่งข้อมูลไปยัง backend
        const response = await fetch("/api/form_analysisaccident", {
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
        height: "320mm", // ความสูงของ A4
        marginTop: "100px", // ระยะห่างจากขอบบน
        marginBottom: "100px", // ระยะห่างจากขอบล่าง
        backgroundSize: 'contain', // ไม่ให้ขยายภาพพื้นหลังให้เต็มพื้นที่
        backgroundRepeat: 'no-repeat', // ป้องกันไม่ให้ภาพพื้นหลังซ้ำ
      }}
    >


        {/* Form */}
        <div className="p-8">
          {/* */}
           {/* Header */}
        <div className="text-end mb-5">
          <h1 className="text-lg text-center text-black font-bold">
          แบบบันทึกการวิเคราะห์อุบัติเหตุ
          </h1>
        </div>
 {/* Form Content */}
 <div className="space-y-6 text-black">
          {/* ชื่อ-แผนก */}
          <div className="flex items-center justify-start w-full flex-wrap">
          <label className="text-black mr-1 ">ชื่อผู้ได้รับการบาดเจ็บ</label>
          <input
            type="text" id="type" name="type" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "40%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
              <label className="text-black mr-1 ml-2 ">⠀แผนก</label>
              <input
            type="text" id="type" name="type" 
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            style={{
              width: "30%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
          </div>
          {/** วัน-เวลา */}
          <div className="flex items-center justify-start w-full flex-wrap">
              <label className="text-black mr-12 ">วัน/เดือน/ปี</label>
              <DatePicker
               selected={selectedDate}
               onChange={(date) => setSelectedDate(date)}
               locale={th}
               dateFormat="dd/MM/yyyy"
               placeholderText="-- กรุณาระบุวันที่ --"
               className="text-black ml-4 mr-2 text-center"
               style={{
                   width: "100px",
                   padding: "6px",
                   border: "1px solid #ccc",
                   borderRadius: "4px",
                   fontSize: "14px",
               }}
          />
              <label className="text-black mr-3 ml-14">⠀เวลา</label>
              <input
            type="text" id="type" name="type" 
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="text-black text-center"
            style={{
              width: "30%",
              padding: "6px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
          </div>
          <div>
  <label className="text-black mr-1">รายละเอียดการอุบัติเหตุ (โดยสังเขป)</label>
</div>
<textarea
    id="details"
    name="details"
    rows="4"
    value={detail}
    onChange={(e) => setDetail(e.target.value)}
    style={{
      width: "99%",
      padding: "6px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      fontSize: "14px",
      resize: "none", // ป้องกันการขยายขนาดของ textarea หากไม่ต้องการ
    }}
  ></textarea>

{/* ตาราง */}
<div>
      <table className="w-full border-collapse border border-black mt-10">
        <thead>
          <tr>
            <th className="border border-black bg-gray-300 p-2">หัวข้อการวิเคราะห์</th>
            <th className="border border-black bg-gray-300 p-2">ผลการวิเคราะห์</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-black p-2">1. ลักษณะการบาดเจ็บ</td>
            <td className="border border-black p-2">
            <input
                type="text"
                value={injury}
                onChange={(e) => setInjury(e.target.value)}
                className="border-b border-black w-[92%] ml-3 focus:outline-none text-black"
              />          
            </td>          
          </tr>
          <tr>
            <td className="border border-black p-2">2. ส่วนของร่างกาย</td>
            <td className="border border-black p-2">
            <input
                type="text"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="border-b border-black w-[92%] ml-3 focus:outline-none text-black"
              />          
            </td>
          </tr>
          <tr>
            <td className="border border-black p-2">3. ต้นตอการบาดเจ็บ</td>
            <td className="border border-black p-2">
            <input
                type="text"
                value={beginninginjury}
                onChange={(e) => setBeginninginjury(e.target.value)}
                className="border-b border-black w-[92%] ml-3 focus:outline-none text-black"
              />          
            </td>          
            </tr>
          <tr>
            <td className="border border-black p-2">4. ประเภท (ชนิด) อุบัติเหตุ</td>
            <td className="border border-black p-2">
            <input
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="border-b border-black w-[92%] ml-3 focus:outline-none text-black"
              />          
            </td>
            </tr>
          <tr>
            <td className="border border-black p-2">5. สภาพที่เป็นอันตราย</td>
            <td className="border border-black p-2">
            <input
                type="text"
                value={dangerous}
                onChange={(e) => setDangerous(e.target.value)}
                className="border-b border-black w-[92%] ml-3 focus:outline-none text-black"
              />          
            </td>
          </tr>
          <tr>
            <td className="border border-black p-2">6. ตัวเหตุที่ทำให้เกิดอุบัติเหตุ</td>
            <td className="border border-black p-2">
            <input
                type="text"
                value={accident}
                onChange={(e) => setAccident(e.target.value)}
                className="border-b border-black w-[92%] ml-3 focus:outline-none text-black"
              />          
            </td>          
            </tr>
          <tr>
            <td className="border border-black p-2">7. ส่วนของตัวเหตุที่ทำให้เกิดอุบัติเหตุ</td>
            <td className="border border-black p-2">
            <input
                type="text"
                value={partaccident}
                onChange={(e) => setPartaccident(e.target.value)}
                className="border-b border-black w-[92%] ml-3 focus:outline-none text-black"
              />          
            </td>          
            </tr>
          <tr>
            <td className="border border-black p-2">8. การกระทำที่ไม่ปลอดภัย</td>
            <td className="border border-black p-2">
            <input
                type="text"
                value={unsafe}
                onChange={(e) => setUnsafe(e.target.value)}
                className="border-b border-black w-[92%] ml-3 focus:outline-none text-black"
              />          
            </td>
            </tr>
        </tbody>
      </table>
    </div>

    <div className="mt-10">
      <h2 className="text-center">ตัวอย่าง การจำแนกลักษณะการบาดเจ็บและประเภท (ชนิด) อุบัติเหตุ</h2>
      <table className="w-full border-collapse border border-black mt-6">
        <thead>
          <tr>
            <th className="border border-black bg-gray-300 p-2">ลักษณะการบาดเจ็บ</th>
            <th className="border border-black bg-gray-300 p-2">ประเภท (ชนิด) อุบัติเหตุ</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-black p-2">
              แผลถูกตัด⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀แผลฉีกขาด<br />
              แผลไฟไหม้ น้ำร้อนลวก⠀⠀⠀⠀⠀แผลถลอก ฟกช้ำ<br />
              แผลไหม้จากสารเคมี⠀⠀ ⠀⠀ ⠀⠀ไส้เลื่อน<br />
              ถูกกระแทก ชน⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ปวดกล้ามเนื้อ<br />
              แผลถูกบาด ฉีกข่วน⠀⠀⠀⠀⠀⠀⠀โรคผิวหนังอักเสบ<br />
              แผลถูกทิ่มแทง เจาะ⠀⠀⠀⠀⠀⠀⠀ข้อเคล็ด<br />
              กระดูกหัก⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀อื่นๆ เช่น เนื้อโปน
            </td>
            <td className="border border-black p-2">
              ล้ม ตกจากที่สูง⠀⠀ ⠀⠀⠀ ⠀การกระเด็น<br />
              ลื่นล้ม⠀⠀ ⠀⠀⠀ ⠀⠀⠀ ⠀⠀⠀ถูกขูดข่วน ถลอก <br />
              ถูกหนีบ ดึง⠀⠀⠀⠀⠀⠀⠀⠀⠀ไฟฟ้า ไฟไหม้<br />
              ถูกกระแทก ชน⠀⠀⠀⠀⠀⠀ สัมผัสสารเคมี<br />
              การถูกตัด บาด⠀⠀⠀⠀⠀⠀ อุบัติเหตุจากยานพาหนะ<br />
              การหล่นทับ พังทลาย⠀⠀ โรคจากการทำงาน<br />
              ยกของหนัก⠀⠀⠀⠀⠀⠀⠀⠀ ท่าทางการทำงาน<br />
              การถูกเจาะ ทิ่มแทง
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    </div>

     

    </div>

    {/** ปุ่มดาวโหลด 
    <div className="absolute bottom-9 w-full flex justify-center">
            <button  onClick={handleFormSubmit} 
                className="bg-[#5A975E] text-white py-3 px-9 rounded-xl hover:bg-green-700"
              >
                Download
              </button>
            </div> */}

<button
  className="absolute bottom-10 right-10 bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-xl flex items-center"
  onClick={() => {
    if (handleFormSubmit()) {
      handleNext(); // เปลี่ยนไปยังหน้าถัดไปถ้าข้อมูลครบ
      router.push("/form_analysisaccidentdetail");
    }
  }}
>
  <span className="mr-2">หน้าถัดไป</span>
  <ChevronRightIcon className="h-5 w-5" />
</button>



    </div>
    
</div>
</div>

  );

}


export default SafetyReportFormAnalysisAccident;