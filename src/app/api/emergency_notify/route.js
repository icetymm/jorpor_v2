import db from '../../../lib/db';
import { NextResponse } from 'next/server';
import axios from 'axios';

const LINE_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN; // Access Token ของ LINE

// ฟังก์ชันดึง Line User IDs
async function fetchAllUserIds() {
  const results = await db.query(`
    SELECT lineUserId FROM users WHERE lineUserId IS NOT NULL
    UNION
    SELECT lineUserId FROM users_r2 WHERE lineUserId IS NOT NULL
    UNION
    SELECT lineUserId FROM users_r3 WHERE lineUserId IS NOT NULL
  `);
  console.log('RESULT ', results); 
  return results[0].map(row => row.lineUserId); // คืนค่า Array ของ lineUserId
}

// ฟังก์ชันสำหรับส่งข้อความแจ้งเตือนไปยัง LINE
async function sendLineNotification(userIds, message) {
  if (!userIds || userIds.length === 0) {
    console.error('No user IDs available for notification');
    return;
  }

  try {
    await axios.post(
      'https://api.line.me/v2/bot/message/multicast', // ใช้ multicast เมื่อส่งข้อความหลายคน
      {
        to: userIds, // Array ของ User IDs
        messages: [{ type: 'text', text: message }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${LINE_ACCESS_TOKEN}`,
        },
      }
    );
    console.log('Notification sent to LINE for users:', userIds);
  } catch (error) {
    console.error('Error sending LINE notification:', error.response?.data || error.message);
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    console.log('Received Data: ', data);

    const { date, time, location, status, user_id, button } = data;

    // กรณี GET ข้อมูล
    if (data.get) {
      const currentDate = new Date();
      const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;

      const getNumQuery = 'SELECT * FROM emergency_notify WHERE date = ? AND location = ?';
      const [numResult] = await db.query(getNumQuery, [formattedDate, data.storedButton]);

      console.log('Data_examine: ', numResult);
      return NextResponse.json({ success: true, dbNumResult: numResult });
    }

    // กรณีอัปเดตข้อมูล
    if (data.change) {
      const updateStatusQuery =
        'UPDATE emergency_notify SET status = 1 WHERE date = ? AND time = ? AND location = ? AND status = 0';
      const [updateResult] = await db.query(updateStatusQuery, [
        data.notification.date,
        data.notification.time,
        data.notification.location,
      ]);

      if (updateResult.affectedRows > 0) {
        console.log('Status updated successfully');
      } else {
        console.log('No matching records found to update');
      }
      return NextResponse.json({ success: true });
    }

    // กรณีบันทึกข้อมูลใหม่
    if (data.button) {
      const insertSql = 'INSERT INTO emergency_notify (date, time, location, status, user_id) VALUES (?, ?, ?, ?, ?)';
      const insertValues = await db.execute(insertSql, [date, time, location, status, user_id]);


      if (insertValues[0].affectedRows === 1) {
        const message = `⚠️ แจ้งเตือนฉุกเฉิน ⚠️\n\nเกิดเหตุฉุกเฉินบริเวณกล่อง: ${location}\nวันที่: ${date}\nเวลา: ${time}\nกรุณาตรวจสอบโดยด่วน!`;
        
        // ดึง User IDs และส่งแจ้งเตือนไปยัง LINE
        const userIds = await fetchAllUserIds();
        console.log('user id:' ,userIds)
        await sendLineNotification(userIds, message);

        return NextResponse.json({ success: true, message: 'Notification has been sent successfully.' });
      } else {
        return NextResponse.json({ success: false, error: 'Failed to insert notify data' });
      }
    } else {
      return NextResponse.json({ success: false, error: 'Button data is missing' });
    }
  } catch (error) {
    console.error('Error processing the request:', error.message);
    return NextResponse.json({ success: false, error: 'Failed to process the request' });
  }
}
