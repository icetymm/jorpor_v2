import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function POST(req) {
  if (req.method === 'POST') {
    try {
      const { action, payload, storedId, file } = await req.json();

      if (action === 'fetchUsers') {
        const query = "SELECT id, name, lastname FROM users";
        const data = await db.query(query);

        console.log("NAME", data);

        if (!data || data.length === 0) {
          return NextResponse.json({
            success: false,
            message: 'No data found',
          }, { status: 404 });
        }

        return NextResponse.json({
          success: true,
          data: data,
        }, { status: 200 });

      } else if (action === 'fetchDates') {
        console.log("Payload received:", payload);
        const { userId } = payload;

        if (!userId) {
          return NextResponse.json({
            success: false,
            message: 'User ID is required',
          }, { status: 400 });
        }

        const query = `
          SELECT DISTINCT date
          FROM checklist_examine_row_2
          WHERE inspector = ?
          ORDER BY STR_TO_DATE(date, '%d/%m/%Y') DESC
        `;

        try {
          const data = await db.query(query, [userId]);

          if (!data || data.length === 0) {
            return NextResponse.json({
              success: false,
              message: 'No dates found for the selected user',
            }, { status: 404 });
          }

          return NextResponse.json({
            success: true,
            data: data,
          }, { status: 200 });
        } catch (error) {
          console.error('Error fetching dates:', error);
          return NextResponse.json({
            success: false,
            message: 'An error occurred while fetching dates',
          }, { status: 500 });
        }

      } else if (action === 'fetchExamines') {
        console.log("Payload received:", payload);
        const { date } = payload;

        if (!date) {
          return NextResponse.json({
            success: false,
            message: 'DATE is required',
          }, { status: 400 });
        }

        const query = `
          SELECT DISTINCT e.name, e.id
          FROM checklist_examine_row_2 cer
          JOIN examine e ON cer.examine_id = e.id
          WHERE cer.date = ?
          AND cer.examine_id = e.id
        `;

        const data = await db.query(query, [date]);
        console.log("DATA ", data);

        if (!data || data.length === 0) {
          return NextResponse.json({
            success: false,
            message: 'No dates found for the selected user',
          }, { status: 404 });
        }

        return NextResponse.json({
          success: true,
          data: data[0],
        }, { status: 200 });

      } else if (action === 'fetchExaminename') {
        console.log("Payload received:", payload);
        const { examinename, date } = payload;

        if (!examinename || !date) {
          return NextResponse.json({
            success: false,
            message: 'Examinename is required',
          }, { status: 400 });
        }

        const query = `
          SELECT en.name, cer.status, cer.details
          FROM checklist_examine_row_2 cer
          JOIN examinename en ON cer.examinename_id = en.id
          WHERE cer.examine_id = ?
          AND cer.date = ?
          AND cer.examinename_id = en.id
        `;

        const data = await db.query(query, [examinename, date]);
        console.log("DATA ", data[0]);

        if (!data || data.length === 0) {
          return NextResponse.json({
            success: false,
            message: 'No dates found for the selected user',
          }, { status: 404 });
        }

        return NextResponse.json({
          success: true,
          data: data[0],
        }, { status: 200 });

      } else if (action === 'fetchDetails') {
        const { date, time } = payload;
        console.log("Details payload:", payload);

        if (!date || !time) {
          return NextResponse.json({
            success: false,
            message: 'Date and time are required',
          }, { status: 400 });
        }

        const query = `
          SELECT title, detail, file 
          FROM notify 
          WHERE DATE(date) = ? AND TIME(date) = TIME(?) 
          LIMIT 1;
        `;

        const [data] = await db.query(query, [date, time]);

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
            file_name: data[0].file,
          },
        }, { status: 200 });

      } else if (action === 'aveFileToDatabaseData') {
        const saveFileToDatabase = async ({ storedId, file }) => {
          if (!file || !storedId) {
            throw new Error("ข้อมูลไม่ครบถ้วน: ไม่มีไฟล์หรือ storedId");
          }

          const employeeData = await getEmployeeData(storedId);
          if (!employeeData) {
            throw new Error("ไม่พบข้อมูลพนักงานในฐานข้อมูล");
          }

          const creatorName = `${employeeData.name} ${employeeData.lastname}`;
          const createdAt = formatDateToMySQL(new Date().toISOString());
          const fileName = "แบบตรวจสอบความปลอดภัย";
          const queryInsert = `
            INSERT INTO documents (document_name, creator_name, created_at, file_url, admin_id) 
            VALUES (?, ?, ?, ?, ?)
          `;
          const values = [fileName, creatorName, createdAt, file, storedId];

          await db.query(queryInsert, values);
          return { success: true, message: "File saved successfully." };
        };

        const saveResult = await saveFileToDatabase({ storedId, file });
        return NextResponse.json(saveResult);
      }

      return NextResponse.json({
        success: false,
        message: 'Invalid action',
      }, { status: 400 });

    } catch (error) {
      console.error("Error during request handling:", error);
      return NextResponse.json({
        success: false,
        message: "Internal Server Error",
      }, { status: 500 });
    }
  }
}

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

    if (!rows || rows.length === 0) {
      throw new Error("ไม่พบข้อมูลพนักงาน");
    }

    return rows[0];
  } catch (error) {
    console.error("Error retrieving employee data:", error);
    return null;
  }
};