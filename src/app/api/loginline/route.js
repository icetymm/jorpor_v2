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

          const richMenuDefault = 'richmenu-2d1197262441be4b45aefdc128a4ef86'; // Rich Menu LOG IN
          const richMenuIds = {
            'Safety Officer Supervisory level': 'richmenu-589d497bedefd68f87934399ee33300e', //role 1
            'Safety Officer Technical level': 'richmenu-c9f9b9b8a63af434735f624acb6ed4c3',    //role 2
            'Safety Officer Management level': 'richmenu-6d6a70888025fc17d1e942ad4d71a214',  //role 3
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