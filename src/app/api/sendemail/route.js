import db from '../../../lib/db';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  if (request.method === 'POST') {
    const res = await request.json();

    try {
      const checkEmailQuery1 = "SELECT COUNT(*) AS emailCount FROM users WHERE email = ?";
      const [emailCountResult1] = await db.query(checkEmailQuery1, [res.email]);

      // console.log("3333: ",emailCountResult1)
      if (emailCountResult1[0]?.emailCount === 0) {
        const checkEmailQuery2 = "SELECT COUNT(*) AS emailCount FROM users_r2 WHERE email = ?";
        const [emailCountResult2] = await db.query(checkEmailQuery2, [res.email]);
        // console.log("4444: ",emailCountResult2)

        if (emailCountResult2[0]?.emailCount === 0) {
          const checkEmailQuery3 = "SELECT COUNT(*) AS emailCount FROM users_r3 WHERE email = ?";
          const [emailCountResult3] = await db.query(checkEmailQuery3, [res.email]);
          // console.log("5555: ",emailCountResult3)

          if (emailCountResult3[0]?.emailCount === 0) {
            return NextResponse.json({ success: false, error: 'Account not found.' }, { res });
          }
        }
      }
            // Send email to the user to confirm password change
            const transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: 'platformsjorpor@gmail.com',
                pass: 'qnzhidjxikwyiocl',
              },
            });

            const confirmationCode = Math.floor(100000 + Math.random() * 900000);

            const mailOptions = {
              from: 'platformsjorpor@gmail.com',
              to: res.email,
              subject: 'ยืนยันการเปลี่ยนรหัสผ่าน',
              html: `
              <p>สวัสดี ${res.email},</p>
              <p>โปรดยืนยันบัญชี JorPor ของคุณ</p>
              <p>รหัสยืนยัน: ${confirmationCode}</p>
              <p>ขอบคุณที่ใช้บริการ JorPor!</p>
            `,
            };
           

            await transporter.sendMail(mailOptions);

            // Save the confirmation code in the database or send it to the relevant part for confirmation

            return NextResponse.json({
              success: true,
              message: 'Confirmation code sent successfully',
              redirect: '/confirm',
              email: res.email,
              PIN: confirmationCode,
            });
          
        
      

      return NextResponse.json({ success: false, error: 'Account not found.' }, { res });
    } catch (error) {
      console.error('Error sending email:', error);
      return NextResponse.json({ success: false, error: 'Error sending email' }, { res });
    }
  } else {
    return NextResponse.json('Method not allowed', { res });
  }
}
