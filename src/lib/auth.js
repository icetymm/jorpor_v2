// 'use client'

// import CredentialsProvider from "next-auth/providers/credentials"

// const authOptions = {
//   session: {
//         strategy: "jwt",
//     },
//     providers: [
//         CredentialsProvider({
//          name: 'Credentials',
//          credentials: {
//             username: { label: "employee", type: "text" },
//             password: { label: "password", type: "password" }
//           },
//           authorize: async (credentials) => {
//             try {
//               data = JSON.stringify(credentials);
//               const res = await axios.post("/api/login", 
//               data, {
//               headers: { "Content-Type": "application/json" }
              
//             });
            
//             const data = await res.json();

//           if (data.success) {
//             // ถ้าการตรวจสอบผ่าน คืนค่าข้อมูลผู้ใช้
//             return Promise.resolve(data.user);
//           } else {
//             // ถ้าการตรวจสอบไม่ผ่าน คืนค่า null
//             return Promise.resolve(null);
//           }
//         } catch (error) {
//           console.error('เกิดข้อผิดพลาดในการเชื่อมต่อ API:', error);
//           throw new Error('ไม่สามารถเชื่อมต่อกับ API ได้');
//         }
//       }
//     }),
//   ],
// };

// export default authOptions;