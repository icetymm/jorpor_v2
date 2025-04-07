import db from '../../../lib/db';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { Client } from '@line/bot-sdk';

const client = new Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.SECRETCODE,
});

export async function POST(request) {
  if (request.method === 'POST') {
    const res = await request.json();
    console.log('RES-----------------: ', res);

    try {
      const checkemployeeQuery1 = 'SELECT COUNT(*) AS employeeCount FROM users WHERE employee = ?';
      const [employeeCountResult1] = await db.query(checkemployeeQuery1, [res.formData.employee]);

      const checkemployeeQuery2 = 'SELECT COUNT(*) AS employeeCount FROM users_r2 WHERE employee = ?';
      const [employeeCountResult2] = await db.query(checkemployeeQuery2, [res.formData.employee]);

      const checkemployeeQuery3 = 'SELECT COUNT(*) AS employeeCount FROM users_r3 WHERE employee = ?';
      const [employeeCountResult3] = await db.query(checkemployeeQuery3, [res.formData.employee]);

      let userEmployeeTable = false;
      let foundInTable = '';
      let userResult = null;

      if (employeeCountResult1[0].employeeCount > 0) {
        foundInTable = 'users';
        userEmployeeTable = true;
      } else if (employeeCountResult2[0].employeeCount > 0) {
        foundInTable = 'users_r2';
        userEmployeeTable = true;
      } else if (employeeCountResult3[0].employeeCount > 0) {
        foundInTable = 'users_r3';
        userEmployeeTable = true;
      }

      if (!userEmployeeTable) {
        return NextResponse.json({ success: false, error: 'Account not found. Please register.' });
      }

      const getUserQuery = `SELECT * FROM ${foundInTable} WHERE employee = ?`;
      const [userQueryResult] = await db.query(getUserQuery, [res.formData.employee]);
      userResult = userQueryResult[0];

      const storedPassword = userResult.password;
      const passwordMatch = await bcrypt.compare(res.formData.password, storedPassword);

      if (!passwordMatch) {
        return NextResponse.json({ success: false, error: 'Invalid password for user ' + res.formData.employee });
      } else {
        if (!userResult.lineUserId) {
          const updateSql = `UPDATE ${foundInTable} SET lineUserId = ? WHERE employee = ?`;
          await db.query(updateSql, [res.formData.lineUserId, res.formData.employee]);
          userResult.lineUserId = res.formData.lineUserId;
        }

          const richMenuDefault = 'richmenu-668a614e96f30102c18f46ebdcec79ab'; // Rich Menu LOG IN
          const richMenuIds = {
            'Safety Officer Supervisory level': 'richmenu-b2f8ceb805a044bdce67709c0274a9cc', //role 1
            'Safety Officer Technical level': 'richmenu-5a023a81e2935441f066b1a62521aa46',    //role 2
            'Safety Officer Management level': 'richmenu-7f46850944f1da8f75db775a9e493c60',  //role 3
          };


          const richMenuId = userResult.lineUserId
            ? richMenuIds[userResult.position] || richMenuDefault
            : richMenuDefault;

          try {
            await client.linkRichMenuToUser(userResult.lineUserId || res.formData.lineUserId, richMenuId);
            console.log('Rich menu set successfully for user:', userResult.lineUserId || res.formData.lineUserId);
          } catch (error) {
            console.error('Failed to set rich menu:', error);
            return NextResponse.json({ success: false, message: 'Failed to set rich menu.' });
          }
          
        const tokenPayload = {
          employee: res.formData.employee,
          password: res.formData.password,
          rememberPassword: res.rememberPassword,
          exp: Math.floor(Date.now() / 1000) + 86400,
          iat: Math.floor(Date.now() / 1000),
        };

        const token = jwt.sign(tokenPayload, 'user_login');

        return NextResponse.json({
          success: true,
          message: 'Login successful.',
          profile: [userResult],
          token,
        });
      }
    } catch (error) {
      console.error('Error login:', error);
      return NextResponse.json({ success: false, error: error.message });
    }
  } else {
    return NextResponse.error('Method Not Allowed');
  }
}