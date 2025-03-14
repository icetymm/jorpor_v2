
/*import db from '../../../lib/db'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server';
import { useRouter } from 'next/navigation'; // แทนที่ 'next/router'
import { useSession, signIn, signOut } from "next-auth/react"

export async function POST(request)  {
  if (request.method === 'POST') {

    const res = await request.json();

    try {
      const {
        newpassword,
        confirmpassword,
        email,
        code
      } = res;

      // console.log("RES_ROUTE: ",res);


      const passwordMatch = await bcrypt.compare(confirmpassword, newpassword);

      if (!passwordMatch) {
        return NextResponse.json({ success: false, error: "passwords don't match" });
      } else {
        const getUserQueryTable1 = "SELECT * FROM users WHERE email = ?";
        const [userResultTable1] = await db.query(getUserQueryTable1, [email]);
      
        const getUserQueryTable2 = "SELECT * FROM users_r2 WHERE email = ?";
        const [userResultTable2] = await db.query(getUserQueryTable2, [email]);
      
        const getUserQueryTable3 = "SELECT * FROM users_r3 WHERE email = ?";
        const [userResultTable3] = await db.query(getUserQueryTable3, [email]);
      
        let userTable;

        if (userResultTable1.length > 0) {
          userTable = "users";
        } else if (userResultTable2.length > 0) {
          userTable = "users_r2";
        } else if (userResultTable3.length > 0) {
          userTable = "users_r3";
        }


        const userResults = [...userResultTable1, ...userResultTable2, ...userResultTable3];
      
        // console.log("USER CHANGE:", userResults);
      
        if (userResults.length === 0) {
          return NextResponse.json({ success: false, error: 'User not found.' });
        }
      
        for (const user of userResults) {
          const storedPassword = user.password;

      
          const newPasswordMatch = await bcrypt.compare(confirmpassword, storedPassword);
      
          if (!newPasswordMatch) {
            await db.query(`UPDATE ${userTable} SET password = ? WHERE email = ?`, [newpassword, email]);
          } else if (newPasswordMatch) {
            return NextResponse.json({ success: false, error: 'This password has recently been changed.' });
          }
        }
      
        return NextResponse.json({ success: true, message: 'the password has been changed.', redirect: '/login' });
      }
      

    } catch (error) {
      console.error('Error change password:', error);
      return NextResponse.json({ success: false, error: error.message }, { res });
    }
  } else {
    return NextResponse.error('Method Not Allowed', { res });
  }
}*/

import db from '../../../lib/db'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server';
/* import { useRouter } from 'next/navigation'; // แทนที่ 'next/router'
import { useSession, signIn, signOut } from "next-auth/react" */



export async function POST(request)  {
  if (request.method === 'POST') {

    const res = await request.json();

    try {
      const {
        newpassword,
        confirmpassword,
        email,
        code
      } = res;

      // console.log("RES_ROUTE: ",res);


      const passwordMatch = await bcrypt.compare(confirmpassword, newpassword);

      if (!passwordMatch) {
        return NextResponse.json({ success: false, error: "passwords don't match" });
      } else {
        const getUserQueryTable1 = "SELECT * FROM users WHERE email = ?";
        const [userResultTable1] = await db.query(getUserQueryTable1, [email]);
      
        const getUserQueryTable2 = "SELECT * FROM users_r2 WHERE email = ?";
        const [userResultTable2] = await db.query(getUserQueryTable2, [email]);
      
        const getUserQueryTable3 = "SELECT * FROM users_r3 WHERE email = ?";
        const [userResultTable3] = await db.query(getUserQueryTable3, [email]);

        const getUserQueryTable4 = "SELECT * FROM role_admin WHERE email = ?";
        const [userResultTable4] = await db.query(getUserQueryTable4, [email]);
      
        let userTable;

        if (userResultTable1.length > 0) {
          userTable = "users";
        } else if (userResultTable2.length > 0) {
          userTable = "users_r2";
        } else if (userResultTable3.length > 0) {
          userTable = "users_r3";
        } else if (userResultTable4.length > 0) {
          userTable = "role_admin";
        }


        const userResults = [...userResultTable1, ...userResultTable2, ...userResultTable3, ...userResultTable4];
      
        // console.log("USER CHANGE:", userResults);
      
        if (userResults.length === 0) {
          return NextResponse.json({ success: false, error: 'User not found.' });
        }
      
        for (const user of userResults) {
          const storedPassword = user.password;

      
          const newPasswordMatch = await bcrypt.compare(confirmpassword, storedPassword);
      
          if (!newPasswordMatch) {
            await db.query(`UPDATE ${userTable} SET password = ? WHERE email = ?`, [newpassword, email]);
          } else if (newPasswordMatch) {
            return NextResponse.json({ success: false, error: 'This password has recently been changed.' });
          }
        }
      
        return NextResponse.json({ success: true, message: 'the password has been changed.', redirect: '/login' });
      }
      

    } catch (error) {
      console.error('Error change password:', error);
      return NextResponse.json({ success: false, error: error.message }, { res });
    }
  } else {
    return NextResponse.error('Method Not Allowed', { res });
  }
}