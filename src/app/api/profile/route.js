/*import db from '../../../lib/db';
import { NextResponse } from 'next/server';
import { Client } from '@line/bot-sdk';

const client = new Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.SECRETCODE,
});

export async function POST(request) {
  if (request.method === 'POST') {
    const res = await request.json();
    
    try {
      const {
        id,
        employee,
        name,
        lastname,
        position,
        phone,
        line,
        email,
        img
      } = res;
      console.log("RES.Route profile88811111111: ", res);


      if (res.profile_role_1) {
          const getUserQuery = "SELECT * FROM users WHERE id = ?";
          const [userResult] = await db.query(getUserQuery, [res.storedId]);
          // console.log("list ID1: ", userResult);
          return NextResponse.json({ success: true, message: 'successfully', profile: userResult });
      }
      
      if (res.profile_role_2) {
          const getUserQuery = "SELECT * FROM users_r2 WHERE id = ?";
          const [userResult] = await db.query(getUserQuery, [res.storedId]);
          // console.log("list ID2: ", userResult);
          return NextResponse.json({ success: true, message: 'successfully', profile: userResult });
      }
      
      if (res.profile_role_3) {
          const getUserQuery = "SELECT * FROM users_r3 WHERE id = ?";
          const [userResult] = await db.query(getUserQuery, [res.storedId]);
          // console.log("list ID3: ", userResult);
          return NextResponse.json({ success: true, message: 'successfully', profile: userResult });
      }

      if (res.fetch) {
        const UsersQuery = "SELECT employee FROM users WHERE id = ?";
        const [UsersResult] = await db.query(UsersQuery, [res.id]);
    
        // Check if there are results in the users table
        if (UsersResult.length === 0) {
            // If no results in users table, query the users_r2 table
            const UsersR2Query = "SELECT employee FROM users_r2 WHERE id = ?";
            const [UsersR2Result] = await db.query(UsersR2Query, [res.id]);
    
            // Check if there are results in the users_r2 table
            if (UsersR2Result.length === 0) {
                // If no results in users_r2 table, query the users_r3 table
                const UsersR3Query = "SELECT employee FROM users_r3 WHERE id = ?";
                const [UsersR3Result] = await db.query(UsersR3Query, [res.id]);
    
                // console.log("list ID from users_r3: ", UsersR3Result);
    
                return NextResponse.json({ success: true, UsersResult: UsersR3Result });
            }
    
            // console.log("list ID from users_r2: ", UsersR2Result);
    
            return NextResponse.json({ success: true, UsersResult: UsersR2Result });
        }
    
        // console.log("list ID from users: ", UsersResult);
    
        return NextResponse.json({ success: true, UsersResult });
    }
    
    // ลบ lineUserId
    if (res.deleteLineUserId_role_1) {
      const { userId } = res; // เพิ่ม lineUserId จาก payload
    
      if (!userId) {
        return NextResponse.json({
          success: false,
          error: 'User ID is required for deletion',
        });
      }
    
      try {
        // ดึง lineUserId ของผู้ใช้จากฐานข้อมูล
        const getUserLineUserIdQuery = "SELECT lineUserId FROM users WHERE id = ?";
        const [userResult] = await db.query(getUserLineUserIdQuery, [userId]);
        const lineUserId = userResult[0]?.lineUserId;
    
        if (lineUserId) {
          // Unlink Rich Menu จาก LINE User
          try {
            await client.unlinkRichMenuFromUser(lineUserId);
            console.log('Successfully unlinked rich menu for user:', lineUserId);
          } catch (unlinkError) {
            console.error('Failed to unlink rich menu:', unlinkError);
            return NextResponse.json({
              success: false,
              error: 'Failed to unlink rich menu for the user',
            });
          }
        }
    
        // ลบ lineUserId ออกจากฐานข้อมูล
        const deleteFromUsersQuery = "UPDATE users SET lineUserId = NULL WHERE id = ?";
        await db.execute(deleteFromUsersQuery, [userId]);
    
        return NextResponse.json({
          success: true,
          message: 'lineUserId removed and rich menu unlinked successfully',
        });
      } catch (error) {
        console.error('Error removing lineUserId:', error);
        return NextResponse.json({
          success: false,
          error: 'Database error occurred while removing lineUserId',
        });
      }
    }
    if (res.deleteLineUserId_role_2) {
      const { userId } = res; // เพิ่ม lineUserId จาก payload
    
      if (!userId) {
        return NextResponse.json({
          success: false,
          error: 'User ID is required for deletion',
        });
      }
    
      try {
        // ดึง lineUserId ของผู้ใช้จากฐานข้อมูล
        const getUserLineUserIdQuery = "SELECT lineUserId FROM users_r2 WHERE id = ?";
        const [userResult] = await db.query(getUserLineUserIdQuery, [userId]);
        const lineUserId = userResult[0]?.lineUserId;
    
        if (lineUserId) {
          // Unlink Rich Menu จาก LINE User
          try {
            await client.unlinkRichMenuFromUser(lineUserId);
            console.log('Successfully unlinked rich menu for user:', lineUserId);
          } catch (unlinkError) {
            console.error('Failed to unlink rich menu:', unlinkError);
            return NextResponse.json({
              success: false,
              error: 'Failed to unlink rich menu for the user',
            });
          }
        }
    
        // ลบ lineUserId ออกจากฐานข้อมูล
        const deleteFromUsersQuery = "UPDATE users_r2 SET lineUserId = NULL WHERE id = ?";
        await db.execute(deleteFromUsersQuery, [userId]);
    
        return NextResponse.json({
          success: true,
          message: 'lineUserId removed and rich menu unlinked successfully',
        });
      } catch (error) {
        console.error('Error removing lineUserId:', error);
        return NextResponse.json({
          success: false,
          error: 'Database error occurred while removing lineUserId',
        });
      }
    }
    if (res.deleteLineUserId_role_3) {
      const { userId } = res; // เพิ่ม lineUserId จาก payload
    
      if (!userId) {
        return NextResponse.json({
          success: false,
          error: 'User ID is required for deletion',
        });
      }
    
      try {
        // ดึง lineUserId ของผู้ใช้จากฐานข้อมูล
        const getUserLineUserIdQuery = "SELECT lineUserId FROM users_r3 WHERE id = ?";
        const [userResult] = await db.query(getUserLineUserIdQuery, [userId]);
        const lineUserId = userResult[0]?.lineUserId;
    
        if (lineUserId) {
          try {
            await client.unlinkRichMenuFromUser(lineUserId);    // Unlink Rich Menu จาก LINE User เพื่อกลับไปหน้า Rich Menu login
            console.log('Successfully unlinked rich menu for user:', lineUserId);
          } catch (unlinkError) {
            console.error('Failed to unlink rich menu:', unlinkError);
            return NextResponse.json({
              success: false,
              error: 'Failed to unlink rich menu for the user',
            });
          }
        }
    
        // ลบ lineUserId ออกจากฐานข้อมูล
        const deleteFromUsersQuery = "UPDATE users_r3 SET lineUserId = NULL WHERE id = ?";
        await db.execute(deleteFromUsersQuery, [userId]);
    
        return NextResponse.json({
          success: true,
          message: 'lineUserId removed and rich menu unlinked successfully',
        });
      } catch (error) {
        console.error('Error removing lineUserId:', error);
        return NextResponse.json({
          success: false,
          error: 'Database error occurred while removing lineUserId',
        });
      }
    }
    
        if (res.edit_role_1) {
          // console.log("RES.Route profile_EDITTT222222222: ",res);

          // const file = formData.get('file');
          // const fileBuffer = await res.picture.arrayBuffer();
            // Declare fileBuffer outside the if block

          if (res.img) {
              // Assuming res.img is a base64-encoded string, decode it and store in fileBuffer
              const fileBuffer = Buffer.from(res.img.split(',')[1], 'base64');
          
          
          // console.log("buffer333: ", fileBuffer);
          // มีการเปลี่ยนแปลง ดังนั้นเราจะทำการอัปเดตข้อมูล
          const updateQuery = `
            UPDATE users
            SET
                name = ?,
                lastname = ?,
                position = ?,
                employee = ?,
                phone = ?,
                line = ?,
                email = ?,
                picture = ?
            WHERE
                id = ?
        `;
        // console.log('update: ',fileBuffer)

        const updatedUserResult = await db.query(updateQuery, [
            res.name,
            res.lastname,
            res.position,
            res.employee,
            res.phone,
            res.line,
            res.email,
            fileBuffer,  
            res.id
        ]);
          
          // console.log('Afterrow: ',updatedUserResult[0].affectedRows)

          if (updatedUserResult[0].affectedRows > 0) {
            // อัปเดตข้อมูลสำเร็จ
            // ส่งข้อมูลผู้ใช้งานที่อัปเดตแล้วกลับไปยัง client
            const updatedUserQuery = "SELECT * FROM users WHERE id = ?";
            const [updatedUser] = await db.query(updatedUserQuery, [id]);
            
            return NextResponse.json({success: true ,message: 'User updated successfully',profile: updatedUser,
            });
          } else {
            return NextResponse.json({success: false,message: 'User update failed',
            });
          }
        } else {
          const updateQuery = `
            UPDATE users
            SET
                name = ?,
                lastname = ?,
                position = ?,
                employee = ?,
                phone = ?,
                line = ?,
                email = ?
            WHERE
                id = ?
        `;
        // console.log('update: ',fileBuffer)

        const updatedUserResult = await db.query(updateQuery, [
            res.name,
            res.lastname,
            res.position,
            res.employee,
            res.phone,
            res.line,
            res.email,
            res.id
        ]);
          
          // console.log('Afterrow: ',updatedUserResult[0].affectedRows)

          if (updatedUserResult[0].affectedRows > 0) {
            // อัปเดตข้อมูลสำเร็จ
            // ส่งข้อมูลผู้ใช้งานที่อัปเดตแล้วกลับไปยัง client
            const updatedUserQuery = "SELECT * FROM users_r2 WHERE id = ?";
            const [updatedUser] = await db.query(updatedUserQuery, [id]);
            
            return NextResponse.json({success: true ,message: 'User updated successfully',profile: updatedUser,
            });
          } else {
            return NextResponse.json({success: false,message: 'User update failed',
            });
          }
        }

        }  
        if (res.edit_role_2) {
          // console.log("RES.Route profile_EDITTT222222222: ",res.picture.data.length);

          // const file = formData.get('file');
          // const fileBuffer = await res.picture.arrayBuffer();
            // Declare fileBuffer outside the if block

          if (res.img) {
              // Assuming res.img is a base64-encoded string, decode it and store in fileBuffer
              const fileBuffer = Buffer.from(res.img.split(',')[1], 'base64');
          
          
          // console.log("buffer333: ", fileBuffer);
          // มีการเปลี่ยนแปลง ดังนั้นเราจะทำการอัปเดตข้อมูล
          const updateQuery = `
            UPDATE users_r2
            SET
                name = ?,
                lastname = ?,
                position = ?,
                employee = ?,
                phone = ?,
                line = ?,
                email = ?,
                picture = ?
            WHERE
                id = ?
        `;
        // console.log('update: ',fileBuffer)

        const updatedUserResult = await db.query(updateQuery, [
            res.name,
            res.lastname,
            res.position,
            res.employee,
            res.phone,
            res.line,
            res.email,
            fileBuffer,  
            res.id
        ]);
          
          // console.log('Afterrow: ',updatedUserResult[0].affectedRows)

          if (updatedUserResult[0].affectedRows > 0) {
            // อัปเดตข้อมูลสำเร็จ
            // ส่งข้อมูลผู้ใช้งานที่อัปเดตแล้วกลับไปยัง client
            const updatedUserQuery = "SELECT * FROM users_r3 WHERE id = ?";
            const [updatedUser] = await db.query(updatedUserQuery, [id]);
            
            return NextResponse.json({success: true ,message: 'User updated successfully',profile: updatedUser,
            });
          } else {
            return NextResponse.json({success: false,message: 'User update failed',
            });
          }
        } else {
          const updateQuery = `
            UPDATE users_r2
            SET
                name = ?,
                lastname = ?,
                position = ?,
                employee = ?,
                phone = ?,
                line = ?,
                email = ?
            WHERE
                id = ?
        `;
        // console.log('update: ',fileBuffer)

        const updatedUserResult = await db.query(updateQuery, [
            res.name,
            res.lastname,
            res.position,
            res.employee,
            res.phone,
            res.line,
            res.email,
            res.id
        ]);
          
          // console.log('Afterrow: ',updatedUserResult[0].affectedRows)

          if (updatedUserResult[0].affectedRows > 0) {
            // อัปเดตข้อมูลสำเร็จ
            // ส่งข้อมูลผู้ใช้งานที่อัปเดตแล้วกลับไปยัง client
            const updatedUserQuery = "SELECT * FROM users WHERE id = ?";
            const [updatedUser] = await db.query(updatedUserQuery, [id]);
            
            return NextResponse.json({success: true ,message: 'User updated successfully',profile: updatedUser,
            });
          } else {
            return NextResponse.json({success: false,message: 'User update failed',
            });
          }
        }

        }  
        if (res.edit_role_3) {
          // console.log("RES.Route profile_EDITTT222222222: ",res.picture.data.length);

          // const file = formData.get('file');
          // const fileBuffer = await res.picture.arrayBuffer();
            // Declare fileBuffer outside the if block

          if (res.img) {
              // Assuming res.img is a base64-encoded string, decode it and store in fileBuffer
              const fileBuffer = Buffer.from(res.img.split(',')[1], 'base64');
          
          
          // console.log("buffer333: ", fileBuffer);
          // มีการเปลี่ยนแปลง ดังนั้นเราจะทำการอัปเดตข้อมูล
          const updateQuery = `
            UPDATE users_r3
            SET
                name = ?,
                lastname = ?,
                position = ?,
                employee = ?,
                phone = ?,
                line = ?,
                email = ?,
                picture = ?
            WHERE
                id = ?
        `;
        // console.log('update: ',fileBuffer)

        const updatedUserResult = await db.query(updateQuery, [
            res.name,
            res.lastname,
            res.position,
            res.employee,
            res.phone,
            res.line,
            res.email,
            fileBuffer,  
            res.id
        ]);
          
          // console.log('Afterrow: ',updatedUserResult[0].affectedRows)

          if (updatedUserResult[0].affectedRows > 0) {
            // อัปเดตข้อมูลสำเร็จ
            // ส่งข้อมูลผู้ใช้งานที่อัปเดตแล้วกลับไปยัง client
            const updatedUserQuery = "SELECT * FROM users WHERE id = ?";
            const [updatedUser] = await db.query(updatedUserQuery, [id]);
            
            return NextResponse.json({success: true ,message: 'User updated successfully',profile: updatedUser,
            });
          } else {
            return NextResponse.json({success: false,message: 'User update failed',
            });
          }
        } else {
          const updateQuery = `
            UPDATE users_r3
            SET
                name = ?,
                lastname = ?,
                position = ?,
                employee = ?,
                phone = ?,
                line = ?,
                email = ?
            WHERE
                id = ?
        `;
        // console.log('update: ',fileBuffer)

        const updatedUserResult = await db.query(updateQuery, [
            res.name,
            res.lastname,
            res.position,
            res.employee,
            res.phone,
            res.line,
            res.email,
            res.id
        ]);
          
          // console.log('Afterrow: ',updatedUserResult[0].affectedRows)

          if (updatedUserResult[0].affectedRows > 0) {
            // อัปเดตข้อมูลสำเร็จ
            // ส่งข้อมูลผู้ใช้งานที่อัปเดตแล้วกลับไปยัง client
            const updatedUserQuery = "SELECT * FROM users WHERE id = ?";
            const [updatedUser] = await db.query(updatedUserQuery, [id]);
            
            return NextResponse.json({success: true ,message: 'User updated successfully',profile: updatedUser,
            });
          } else {
            return NextResponse.json({success: false,message: 'User update failed',
            });
          }
        }

        }
          
      return NextResponse.json({ success: true});
    } catch (error) {
      console.error('Error Profile:', error);
      return NextResponse.json({ success: false, error: error.message });
    }
  } else {
    return NextResponse.error('Method Not Allowed');
  } 
}*/


import db from '../../../lib/db';
import { NextResponse } from 'next/server';
import { Client } from '@line/bot-sdk';

const client = new Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.SECRETCODE,
});

export async function POST(request) {
  if (request.method === 'POST') {
    const res = await request.json();
    
    try {
      const {
        id,
        employee,
        name,
        lastname,
        position,
        phone,
        line,
        email,
        img
      } = res;
      console.log("RES.Route profile88811111111: ", res);


      if (res.profile_role_1) {
          const getUserQuery = "SELECT * FROM users WHERE id = ?";
          const [userResult] = await db.query(getUserQuery, [res.storedId]);
          // console.log("list ID1: ", userResult);
          return NextResponse.json({ success: true, message: 'successfully', profile: userResult });
      }
      
      if (res.profile_role_2) {
          const getUserQuery = "SELECT * FROM users_r2 WHERE id = ?";
          const [userResult] = await db.query(getUserQuery, [res.storedId]);
          return NextResponse.json({ success: true, message: 'successfully', profile: userResult });
      }
      
      if (res.profile_role_3) {
          const getUserQuery = "SELECT * FROM users_r3 WHERE id = ?";
          const [userResult] = await db.query(getUserQuery, [res.storedId]);
          // console.log("list ID3: ", userResult);
          return NextResponse.json({ success: true, message: 'successfully', profile: userResult });
      }

      if (res.profile_role_admin) {
        const getUserQuery = "SELECT * FROM role_admin WHERE id = ?";
        const [userResult] = await db.query(getUserQuery, [res.storedId]);
        // console.log("list ID3: ", userResult);
        return NextResponse.json({ success: true, message: 'successfully', profile: userResult });
    }

      if (res.fetch) {
        const UsersQuery = "SELECT employee FROM users WHERE id = ?";
        const [UsersResult] = await db.query(UsersQuery, [res.id]);
    
        // Check if there are results in the users table
        if (UsersResult.length === 0) {
            const UsersR2Query = "SELECT employee FROM users_r2 WHERE id = ?";
            const [UsersR2Result] = await db.query(UsersR2Query, [res.id]);
    
            // Check if there are results in the users_r2 table
            if (UsersR2Result.length === 0) {
                // If no results in users_r2 table, query the users_r3 table
                const UsersR3Query = "SELECT employee FROM users_r3 WHERE id = ?";
                const [UsersR3Result] = await db.query(UsersR3Query, [res.id]);
    
    
                return NextResponse.json({ success: true, UsersResult: UsersR3Result });
            }
    
            // console.log("list ID from users_r2: ", UsersR2Result);
    
            return NextResponse.json({ success: true, UsersResult: UsersR2Result });
        }
    
        // console.log("list ID from users: ", UsersResult);
    
        return NextResponse.json({ success: true, UsersResult });
    }
    
// ลบ lineUserId
if (res.deleteLineUserId_role_1) {
  const { userId } = res; // เพิ่ม lineUserId จาก payload

  if (!userId) {
    return NextResponse.json({
      success: false,
      error: 'User ID is required for deletion',
    });
  }

  try {
    // ดึง lineUserId ของผู้ใช้จากฐานข้อมูล
    const getUserLineUserIdQuery = "SELECT lineUserId FROM users WHERE id = ?";
    const [userResult] = await db.query(getUserLineUserIdQuery, [userId]);
    const lineUserId = userResult[0]?.lineUserId;

    if (lineUserId) {
      // Unlink Rich Menu จาก LINE User
      try {
        await client.unlinkRichMenuFromUser(lineUserId);
        console.log('Successfully unlinked rich menu for user:', lineUserId);
      } catch (unlinkError) {
        console.error('Failed to unlink rich menu:', unlinkError);
        return NextResponse.json({
          success: false,
          error: 'Failed to unlink rich menu for the user',
        });
      }
    }

    // ลบ lineUserId ออกจากฐานข้อมูล
    const deleteFromUsersQuery = "UPDATE users SET lineUserId = NULL WHERE id = ?";
    await db.execute(deleteFromUsersQuery, [userId]);

    return NextResponse.json({
      success: true,
      message: 'lineUserId removed and rich menu unlinked successfully',
    });
  } catch (error) {
    console.error('Error removing lineUserId:', error);
    return NextResponse.json({
      success: false,
      error: 'Database error occurred while removing lineUserId',
    });
  }
}
if (res.deleteLineUserId_role_2) {
  const { userId } = res; // เพิ่ม lineUserId จาก payload

  if (!userId) {
    return NextResponse.json({
      success: false,
      error: 'User ID is required for deletion',
    });
  }

  try {
    // ดึง lineUserId ของผู้ใช้จากฐานข้อมูล
    const getUserLineUserIdQuery = "SELECT lineUserId FROM users_r2 WHERE id = ?";
    const [userResult] = await db.query(getUserLineUserIdQuery, [userId]);
    const lineUserId = userResult[0]?.lineUserId;

    if (lineUserId) {
      // Unlink Rich Menu จาก LINE User
      try {
        await client.unlinkRichMenuFromUser(lineUserId);
        console.log('Successfully unlinked rich menu for user:', lineUserId);
      } catch (unlinkError) {
        console.error('Failed to unlink rich menu:', unlinkError);
        return NextResponse.json({
          success: false,
          error: 'Failed to unlink rich menu for the user',
        });
      }
    }

    // ลบ lineUserId ออกจากฐานข้อมูล
    const deleteFromUsersQuery = "UPDATE users_r2 SET lineUserId = NULL WHERE id = ?";
    await db.execute(deleteFromUsersQuery, [userId]);

    return NextResponse.json({
      success: true,
      message: 'lineUserId removed and rich menu unlinked successfully',
    });
  } catch (error) {
    console.error('Error removing lineUserId:', error);
    return NextResponse.json({
      success: false,
      error: 'Database error occurred while removing lineUserId',
    });
  }
}
if (res.deleteLineUserId_role_3) {
  const { userId } = res; // เพิ่ม lineUserId จาก payload

  if (!userId) {
    return NextResponse.json({
      success: false,
      error: 'User ID is required for deletion',
    });
  }

  try {
    // ดึง lineUserId ของผู้ใช้จากฐานข้อมูล
    const getUserLineUserIdQuery = "SELECT lineUserId FROM users_r3 WHERE id = ?";
    const [userResult] = await db.query(getUserLineUserIdQuery, [userId]);
    const lineUserId = userResult[0]?.lineUserId;

    if (lineUserId) {
      try {
        await client.unlinkRichMenuFromUser(lineUserId);    // Unlink Rich Menu จาก LINE User เพื่อกลับไปหน้า Rich Menu login
        console.log('Successfully unlinked rich menu for user:', lineUserId);
      } catch (unlinkError) {
        console.error('Failed to unlink rich menu:', unlinkError);
        return NextResponse.json({
          success: false,
          error: 'Failed to unlink rich menu for the user',
        });
      }
    }

    // ลบ lineUserId ออกจากฐานข้อมูล
    const deleteFromUsersQuery = "UPDATE users_r3 SET lineUserId = NULL WHERE id = ?";
    await db.execute(deleteFromUsersQuery, [userId]);

    return NextResponse.json({
      success: true,
      message: 'lineUserId removed and rich menu unlinked successfully',
    });
  } catch (error) {
    console.error('Error removing lineUserId:', error);
    return NextResponse.json({
      success: false,
      error: 'Database error occurred while removing lineUserId',
    });
  }
}
      // if (userResult) {
        // ค้นพบข้อมูลผู้ใช้งาน ดังนั้นเราจะตรวจสอบการเปลี่ยนแปลง
        if (res.edit_role_1) {
          // console.log("RES.Route profile_EDITTT222222222: ",res);

          // const file = formData.get('file');
          // const fileBuffer = await res.picture.arrayBuffer();
            // Declare fileBuffer outside the if block

          if (res.img) {
              // Assuming res.img is a base64-encoded string, decode it and store in fileBuffer
              const fileBuffer = Buffer.from(res.img.split(',')[1], 'base64');
          
          
          // console.log("buffer333: ", fileBuffer);
          // มีการเปลี่ยนแปลง ดังนั้นเราจะทำการอัปเดตข้อมูล
          const updateQuery = `
            UPDATE users
            SET
                name = ?,
                lastname = ?,
                position = ?,
                employee = ?,
                phone = ?,
                line = ?,
                email = ?,
                picture = ?
            WHERE
                id = ?
        `;
        // console.log('update: ',fileBuffer)

        const updatedUserResult = await db.query(updateQuery, [
            res.name,
            res.lastname,
            res.position,
            res.employee,
            res.phone,
            res.line,
            res.email,
            fileBuffer,  
            res.id
        ]);
          
          // console.log('Afterrow: ',updatedUserResult[0].affectedRows)

          if (updatedUserResult[0].affectedRows > 0) {
            // อัปเดตข้อมูลสำเร็จ
            // ส่งข้อมูลผู้ใช้งานที่อัปเดตแล้วกลับไปยัง client
            const updatedUserQuery = "SELECT * FROM users WHERE id = ?";
            const [updatedUser] = await db.query(updatedUserQuery, [id]);
            
            return NextResponse.json({success: true ,message: 'User updated successfully',profile: updatedUser,
            });
          } else {
            return NextResponse.json({success: false,message: 'User update failed',
            });
          }
        } else {
          const updateQuery = `
            UPDATE users
            SET
                name = ?,
                lastname = ?,
                position = ?,
                employee = ?,
                phone = ?,
                line = ?,
                email = ?
            WHERE
                id = ?
        `;
        // console.log('update: ',fileBuffer)

        const updatedUserResult = await db.query(updateQuery, [
            res.name,
            res.lastname,
            res.position,
            res.employee,
            res.phone,
            res.line,
            res.email,
            res.id
        ]);
          
          // console.log('Afterrow: ',updatedUserResult[0].affectedRows)

          if (updatedUserResult[0].affectedRows > 0) {
            // อัปเดตข้อมูลสำเร็จ
            // ส่งข้อมูลผู้ใช้งานที่อัปเดตแล้วกลับไปยัง client
            const updatedUserQuery = "SELECT * FROM users_r2 WHERE id = ?";
            const [updatedUser] = await db.query(updatedUserQuery, [id]);
            
            return NextResponse.json({success: true ,message: 'User updated successfully',profile: updatedUser,
            });
          } else {
            return NextResponse.json({success: false,message: 'User update failed',
            });
          }
        }

        } 
        
        if (res.edit_role_2) {
          // console.log("RES.Route profile_EDITTT222222222: ",res.picture.data.length);

          // const file = formData.get('file');
          // const fileBuffer = await res.picture.arrayBuffer();
            // Declare fileBuffer outside the if block

          if (res.img) {
              // Assuming res.img is a base64-encoded string, decode it and store in fileBuffer
              const fileBuffer = Buffer.from(res.img.split(',')[1], 'base64');
          
          
          // console.log("buffer333: ", fileBuffer);
          // มีการเปลี่ยนแปลง ดังนั้นเราจะทำการอัปเดตข้อมูล
          const updateQuery = `
            UPDATE users_r2
            SET
                name = ?,
                lastname = ?,
                position = ?,
                employee = ?,
                phone = ?,
                line = ?,
                email = ?,
                picture = ?
            WHERE
                id = ?
        `;
        // console.log('update: ',fileBuffer)

        const updatedUserResult = await db.query(updateQuery, [
            res.name,
            res.lastname,
            res.position,
            res.employee,
            res.phone,
            res.line,
            res.email,
            fileBuffer,  
            res.id
        ]);
          
          // console.log('Afterrow: ',updatedUserResult[0].affectedRows)

          if (updatedUserResult[0].affectedRows > 0) {
            // อัปเดตข้อมูลสำเร็จ
            // ส่งข้อมูลผู้ใช้งานที่อัปเดตแล้วกลับไปยัง client
            const updatedUserQuery = "SELECT * FROM users_r3 WHERE id = ?";
            const [updatedUser] = await db.query(updatedUserQuery, [id]);
            
            return NextResponse.json({success: true ,message: 'User updated successfully',profile: updatedUser,
            });
          } else {
            return NextResponse.json({success: false,message: 'User update failed',
            });
          }
        } else {
          const updateQuery = `
            UPDATE users_r2
            SET
                name = ?,
                lastname = ?,
                position = ?,
                employee = ?,
                phone = ?,
                line = ?,
                email = ?
            WHERE
                id = ?
        `;
        // console.log('update: ',fileBuffer)

        const updatedUserResult = await db.query(updateQuery, [
            res.name,
            res.lastname,
            res.position,
            res.employee,
            res.phone,
            res.line,
            res.email,
            res.id
        ]);
          
          // console.log('Afterrow: ',updatedUserResult[0].affectedRows)

          if (updatedUserResult[0].affectedRows > 0) {
            // อัปเดตข้อมูลสำเร็จ
            // ส่งข้อมูลผู้ใช้งานที่อัปเดตแล้วกลับไปยัง client
            const updatedUserQuery = "SELECT * FROM users WHERE id = ?";
            const [updatedUser] = await db.query(updatedUserQuery, [id]);
            
            return NextResponse.json({success: true ,message: 'User updated successfully',profile: updatedUser,
            });
          } else {
            return NextResponse.json({success: false,message: 'User update failed',
            });
          }
        }

        }  
        if (res.edit_role_3) {
          // console.log("RES.Route profile_EDITTT222222222: ",res.picture.data.length);

          // const file = formData.get('file');
          // const fileBuffer = await res.picture.arrayBuffer();
            // Declare fileBuffer outside the if block

          if (res.img) {
              // Assuming res.img is a base64-encoded string, decode it and store in fileBuffer
              const fileBuffer = Buffer.from(res.img.split(',')[1], 'base64');
          
          
          // console.log("buffer333: ", fileBuffer);
          // มีการเปลี่ยนแปลง ดังนั้นเราจะทำการอัปเดตข้อมูล
          const updateQuery = `
            UPDATE users_r3
            SET
                name = ?,
                lastname = ?,
                position = ?,
                employee = ?,
                phone = ?,
                line = ?,
                email = ?,
                picture = ?
            WHERE
                id = ?
        `;
        // console.log('update: ',fileBuffer)

        const updatedUserResult = await db.query(updateQuery, [
            res.name,
            res.lastname,
            res.position,
            res.employee,
            res.phone,
            res.line,
            res.email,
            fileBuffer,  
            res.id
        ]);
          
          // console.log('Afterrow: ',updatedUserResult[0].affectedRows)

          if (updatedUserResult[0].affectedRows > 0) {
            // อัปเดตข้อมูลสำเร็จ
            // ส่งข้อมูลผู้ใช้งานที่อัปเดตแล้วกลับไปยัง client
            const updatedUserQuery = "SELECT * FROM users WHERE id = ?";
            const [updatedUser] = await db.query(updatedUserQuery, [id]);
            
            return NextResponse.json({success: true ,message: 'User updated successfully',profile: updatedUser,
            });
          } else {
            return NextResponse.json({success: false,message: 'User update failed',
            });
          }
        } else {
          const updateQuery = `
            UPDATE users_r3
            SET
                name = ?,
                lastname = ?,
                position = ?,
                employee = ?,
                phone = ?,
                line = ?,
                email = ?
            WHERE
                id = ?
        `;
        // console.log('update: ',fileBuffer)

        const updatedUserResult = await db.query(updateQuery, [
            res.name,
            res.lastname,
            res.position,
            res.employee,
            res.phone,
            res.line,
            res.email,
            res.id
        ]);
          
          // console.log('Afterrow: ',updatedUserResult[0].affectedRows)

          if (updatedUserResult[0].affectedRows > 0) {
            // อัปเดตข้อมูลสำเร็จ
            // ส่งข้อมูลผู้ใช้งานที่อัปเดตแล้วกลับไปยัง client
            const updatedUserQuery = "SELECT * FROM users WHERE id = ?";
            const [updatedUser] = await db.query(updatedUserQuery, [id]);
            
            return NextResponse.json({success: true ,message: 'User updated successfully',profile: updatedUser,
            });
          } else {
            return NextResponse.json({success: false,message: 'User update failed',
            });
          }
        }

        }
        if (res.edit_role_admin) {
          // console.log("RES.Route profile_EDITTT222222222: ",res.picture.data.length);

          // const file = formData.get('file');
          // const fileBuffer = await res.picture.arrayBuffer();
            // Declare fileBuffer outside the if block

          if (res.img) {
              // Assuming res.img is a base64-encoded string, decode it and store in fileBuffer
              const fileBuffer = Buffer.from(res.img.split(',')[1], 'base64');
          
          
          // console.log("buffer333: ", fileBuffer);
          // มีการเปลี่ยนแปลง ดังนั้นเราจะทำการอัปเดตข้อมูล
          const updateQuery = `
            UPDATE role_admin
            SET
                name = ?,
                lastname = ?,
                position = ?,
                employee = ?,
                phone = ?,
                line = ?,
                email = ?,
                picture = ?
            WHERE
                id = ?
        `;
        // console.log('update: ',fileBuffer)

        const updatedUserResult = await db.query(updateQuery, [
            res.name,
            res.lastname,
            res.position,
            res.employee,
            res.phone,
            res.line,
            res.email,
            fileBuffer,  
            res.id
        ]);
          
          // console.log('Afterrow: ',updatedUserResult[0].affectedRows)

          if (updatedUserResult[0].affectedRows > 0) {
            // อัปเดตข้อมูลสำเร็จ
            // ส่งข้อมูลผู้ใช้งานที่อัปเดตแล้วกลับไปยัง client
            const updatedUserQuery = "SELECT * FROM users WHERE id = ?";
            const [updatedUser] = await db.query(updatedUserQuery, [id]);
            
            return NextResponse.json({success: true ,message: 'User updated successfully',profile: updatedUser,
            });
          } else {
            return NextResponse.json({success: false,message: 'User update failed',
            });
          }
        } else {
          const updateQuery = `
            UPDATE role_admin
            SET
                name = ?,
                lastname = ?,
                position = ?,
                employee = ?,
                phone = ?,
                line = ?,
                email = ?
            WHERE
                id = ?
        `;
        // console.log('update: ',fileBuffer)

        const updatedUserResult = await db.query(updateQuery, [
            res.name,
            res.lastname,
            res.position,
            res.employee,
            res.phone,
            res.line,
            res.email,
            res.id
        ]);
          
          // console.log('Afterrow: ',updatedUserResult[0].affectedRows)

          if (updatedUserResult[0].affectedRows > 0) {
            // อัปเดตข้อมูลสำเร็จ
            // ส่งข้อมูลผู้ใช้งานที่อัปเดตแล้วกลับไปยัง client
            const updatedUserQuery = "SELECT * FROM users WHERE id = ?";
            const [updatedUser] = await db.query(updatedUserQuery, [id]);
            
            return NextResponse.json({success: true ,message: 'User updated successfully',profile: updatedUser,
            });
          } else {
            return NextResponse.json({success: false,message: 'User update failed',
            });
          }
        }

        }
      
      return NextResponse.json({ success: true});

      
    } catch (error) {
      console.error('Error Profile:', error);
      return NextResponse.json({ success: false, error: error.message });
    }
  } else {
    return NextResponse.error('Method Not Allowed');
  } 
}