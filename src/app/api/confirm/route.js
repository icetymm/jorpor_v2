
import db from '../../../lib/db'
import { NextResponse } from 'next/server';
import { useRouter } from 'next/navigation'; // แทนที่ 'next/router'
import { useSession, signIn, signOut } from "next-auth/react"



export async function POST(request)  {
  if (request.method === 'POST') {

    const res = await request.json();

    try {
      const {
        PIN_confirm,
        PIN,
      } = res;

      // console.log("RES_ROUTE: ",res);


      if (PIN_confirm === PIN) {
        return NextResponse.json({ success: true, message: 'success', redirect: '/changepass'});
      } else {
        return NextResponse.json({ success: false, error: "verification don't match" });
      }

    } catch (error) {
      // console.error('Error change password:', error);
      return NextResponse.json({ success: false, error: error.message }, { res });
    }
  } else {
    return NextResponse.error('Method Not Allowed', { res });
  }
}

