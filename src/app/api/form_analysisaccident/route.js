import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function POST(req) {
  try {
    const { file, storedId } = await req.json();

    const saveFileToDatabase = async (payloads) => {
      try {
        const { storedId, file } = payloads;

        if (!file || !storedId) {
          throw new Error("ข้อมูลไม่ครบถ้วน: ไม่มีไฟล์หรือ storedId");
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
        const fileName = "แบบบันทึกการวิเคราะห์อุบัติเหตุ";
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
    const saveResult = await saveFileToDatabase({ storedId, file });
    return NextResponse.json(saveResult);

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal Server Error',
    }, { status: 500 });
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