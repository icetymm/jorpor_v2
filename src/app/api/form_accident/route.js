import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function POST(req) {
  if (req.method === 'POST') {  // ตรวจสอบว่าเป็น method POST
    try {
      const { action,payload ,file, storedId,fileName} = await req.json();  // รับค่า action จาก body ของคำขอ
      // ตรวจสอบว่า action เป็น 'fetchZones'
      if (action === 'fetchZones') {
        // Query ข้อมูลจากตาราง examinelist
        const query = "SELECT name FROM examinelist";  // ตรวจสอบให้แน่ใจว่า query ถูกต้อง
        const data = await db.query(query);  // ใช้ db.query เพื่อดึงข้อมูล
        console.log("kkkkk", data);  // ดูข้อมูลที่ได้จากการ query

        // ตรวจสอบว่า data.rows มีข้อมูลหรือไม่
        if (!data) {
          return NextResponse.json({
            success: false,
            message: 'No data found',
          }, { status: 404 });
        }
        // ส่งข้อมูลกลับในรูปแบบ JSON
        return NextResponse.json({
          success: true,
          data: data,  // ส่ง data.rows ซึ่งคือข้อมูลที่ได้จาก query
        }, { status: 200 });
      }

      else if (action === 'fetchDates') {
        console.log("Payload received:", payload); // ตรวจสอบ payload
        const { zone } = payload;

        if (!zone) {
          return NextResponse.json({
            success: false,
            message: 'Zone is required',
          }, { status: 400 });
        }

                      const query = `
                      SELECT DISTINCT DATE_FORMAT(date, '%e/%c/%Y') AS formatted_date ,date
                      FROM notify 
                      WHERE location = ?
                    `;
                    
     
        try {
          const data = await db.query(query, [zone]); // ส่ง userId เป็นพารามิเตอร์ใน query
      
          if (!data || data.length === 0) {
            return NextResponse.json({
              success: false,
              message: 'No dates found for the selected user',
            }, { status: 404 });
          }
      
          return NextResponse.json({
            success: true,
            data: data, // ส่ง data ซึ่งคือข้อมูลที่ได้จาก query
          }, { status: 200 });
        } catch (error) {
          console.error('Error fetching dates:', error);
          return NextResponse.json({
            success: false,
            message: 'An error occurred while fetching dates',
          }, { status: 500 });
        }
  }

      else if (action === 'fetchTimes') {
        console.log("Payload received:", payload); // ตรวจสอบ payload
        const { date } = payload;

        if (!date) {
          return NextResponse.json({
            success: false,
            message: 'Date is required',
          }, { status: 400 });
        }

        const query = `
          SELECT DISTINCT TIME(date) AS time FROM notify WHERE DATE(date) = ? 
          ORDER BY time ASC`;
        const [data] = await db.query(query, [date]);
        

        if (!data || data.length === 0) {
          return NextResponse.json({
            success: false,
            message: 'No times found for the selected date',
          }, { status: 404 });
        }

        return NextResponse.json({
          success: true,
          data: data.map((row) => row.time),  // ส่งเฉพาะรายการเวลา
        }, { status: 200 });

      } else if (action === 'fetchDetails') {
        const { date, time } = payload;
        console.log("gggggg",payload);

        if (!date || !time) {
          return NextResponse.json({
            success: false,
            message: 'Date, time, and zone are required',
          }, { status: 400 });
        }

        const query = ` SELECT title, detail, file FROM notify 
        WHERE DATE(date) = ? AND TIME(date) = TIME(?) LIMIT 1;`;
        const [data] = await db.query(query, [date, time]);
        console.log("Executing with values:", [date, time]);

        if (!data || data.length === 0) {
          return NextResponse.json({
            success: false,
            message: 'No matching record found',
          }, { status: 404 });
        }

        return NextResponse.json({
          success: true,
          data: {
            title: data[0].title,
            detail: data[0].detail,
            file_name: data[0].file, // ควรเป็นชื่อไฟล์หรือ path รูปภาพ
          },
        }, { status: 200 });

      }else if (action === 'aveFileToDatabaseData') {
        const saveFileToDatabase = async (payloads) => {
          try {
            const { storedId, file,fileName } = payloads;
            console.log("lllll",payloads);
  
            if (!fileName || !storedId || !file) {
              return NextResponse.json({
                success: false,
                message: 'Incomplete data: fileName, storedId, or file is missing',
              }, { status: 400 });
            }
  
            // ดึงข้อมูลพนักงานจาก storedId
            const employeeData = await getEmployeeData(storedId);
            if (!employeeData) {
              throw new Error("ไม่พบข้อมูลพนักงานในฐานข้อมูล");
            }
  
            // รวมชื่อและนามสกุล
            const creatorName = `${employeeData.name} ${employeeData.lastname}`;
  
            // เตรียมข้อมูลสำหรับบันทึกลงฐานข้อมูล
            const createdAt = formatDateToMySQL(new Date().toISOString());
            const queryInsert = `INSERT INTO documents (document_name, creator_name, created_at, file_url, admin_id) VALUES (?, ?, ?, ?, ?)`;
            const values = [fileName, creatorName, createdAt, file, storedId];
  
            // ทำการบันทึกข้อมูลในฐานข้อมูล
            await db.query(queryInsert, values);
  
            return { success: true, message: "File saved successfully." };
          } catch (error) {
            console.error("Error saving file to database:", error);
            return { success: false, message: error.message };
          }
        };

        // บันทึกไฟล์และส่งผลลัพธ์กลับ
            const saveResult = await saveFileToDatabase({ storedId, file ,fileName});
            return NextResponse.json(saveResult);
            } else {
              return NextResponse.json({
                success: false,
                message: 'Invalid action',
              }, { status: 400 });
            }
          } catch (error) {
            console.error('Error:', error);
            return NextResponse.json({
              success: false,
              message: 'Internal Server Error',
            }, { status: 500 });
          }
        } else {
          return NextResponse.json({
            success: false,
            message: 'Method Not Allowed',
          }, { status: 405 });
        }
      }
// ฟังก์ชันสำหรับแปลง ISO String เป็นรูปแบบ YYYY-MM-DD HH:MM:SS
const formatDateToMySQL = (isoString) => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};


  const getEmployeeData = async (storedId) => {
    try {
      const query = "SELECT name, lastname FROM role_admin WHERE id = ?";
      const [rows] = await db.query(query, [storedId]);
      console.log("kkkkk",rows);
  
      if (!rows || rows.length === 0) {
        throw new Error("ไม่พบข้อมูลพนักงาน");
      }
  
      return rows[0]; // คืนค่าข้อมูลพนักงาน เช่น { name: "John", lastname: "Doe" }
    } catch (error) {
      console.error("Error retrieving employee data:", error);
      return null;
    }
  };