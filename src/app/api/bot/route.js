import db from '../../../lib/db';
import express from 'express';
import linebot from '@line/bot-sdk';
//import axios from 'axios';
import bcrypt from 'bcrypt';
import { type } from 'os';
import { text } from 'body-parser';
import { layer } from '@fortawesome/fontawesome-svg-core';
import { table } from 'console';

const line = require('@line/bot-sdk');
const router = express.Router();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const util = require('util');
const { pipeline } = require('stream/promises');
const sharp = require('sharp');
const FormData = require('form-data');
const server = express();
const schedule = require('node-schedule');

// ฟังก์ชันสำหรับตั้งเวลาเคลียร์ข้อมูล
function scheduleDataClear() {
    // ตั้งเวลา 16:20 ของวันปัจจุบัน
    const now = new Date();
    const clearTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 55, 0);

    if (now.getTime() > clearTime.getTime()) {
        clearTime.setDate(clearTime.getDate() + 1); // ตั้งเวลาเป็นวันถัดไป
    }

    schedule.scheduleJob(clearTime, () => {
        console.log('ข้อมูลถูกเคลียร์แล้วในเวลา 23.55 น.');

        // ล้างข้อมูลทั้งหมด
        userExamineData.clear();
        selectedZoneData.clear();
        selectedExamineData.clear();

        console.log('ข้อมูลถูกล้างเรียบร้อย');

        // ถ้าต้องการตั้งเวลาใหม่สำหรับวันถัดไป
        scheduleDataClear();
    });
}
// เรียกใช้ฟังก์ชันเมื่อเริ่มระบบ
scheduleDataClear();

const config = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.SECRETCODE
};

const client = new line.Client({
  channelAccessToken: config.channelAccessToken,
  channelSecret: config.channelSecret
});

async function startLoadingAnimation(chatId) {
  try {
    const response = await axios.post(
      'https://api.line.me/v2/bot/chat/loading/start',
      {
        chatId: chatId,
        loadingSeconds: 10,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.channelAccessToken}`,
        },
      }
    );
    console.log('Loading started:', response.data);
  } catch (error) {
    console.error('Error starting loading:', error.response?.data || error.message);
  }
}

// ฟังก์ชันสำหรับหยุด Loading Indicator
async function stopLoadingAnimation(chatId) {
  try {
    const response = await axios.post(
      'https://api.line.me/v2/bot/chat/loading/stop',
      {
        chatId: chatId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.channelAccessToken}`,
        },
      }
    );
    //console.log('Loading stopped:', response.data);
  } catch (error) {
    //console.error('Error stopping loading:', error.response?.data || error.message);
  }
}

// Middleware สำหรับ LINE
export async function POST(req) {
  try {
    // เช็คว่า request มี body หรือไม่
    if (!req.body) {
      return new Response('No body found', { status: 400 });
    }

    // เช็คว่า body เป็น JSON ที่ถูกต้อง
    const body = await req.json();
    console.log('Request body:', body);

    // ตรวจสอบว่ามี events ใน body หรือไม่
    if (!body.events || body.events.length === 0) {
      return new Response('No events found', { status: 400 });
    }

    // ดำเนินการกับ events
    const result = await Promise.all(body.events.map(handleEvents));
    return new Response(JSON.stringify(result), { status: 200 });

  } catch (err) {
    console.error('Error:', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}

/*export default function handler(req, res) {
  const { imageId } = req.query;
  const filePath = path.join(process.cwd(), 'download', `${imageId}.jpg`);

  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'image/jpeg');
    return res.status(200).send(fs.readFileSync(filePath));
  } else {
    return res.status(404).json({ error: 'File not found' });
  }
}*/
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const imageId = url.searchParams.get("imageId");

    if (!imageId) {
      return new Response(JSON.stringify({ error: "Missing imageId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const filePath = path.join(process.cwd(), "download", `${imageId}.jpg`);

    if (!fs.existsSync(filePath)) {
      return new Response(JSON.stringify({ error: "File not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const fileStream = fs.createReadStream(filePath);
    return new Response(fileStream, {
      status: 200,
      headers: { "Content-Type": "image/jpeg" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// ฟังก์ชันสร้าง Flex Message จากข้อมูลพนักงาน
export function createEmployeeFlexMessage(employeeData, role) {
  // ตรวจสอบว่า employeeData มีข้อมูลหรือไม่
  if (!employeeData || employeeData.length === 0) {
    return {
      type: "text",
      text: "ไม่พบข้อมูลพนักงาน"
    };
  }

  const employeeContents = employeeData.map((employee, index) => ({
    type: 'box',
    layout: 'vertical',
    contents: [
        {
          type: 'box',
          layout: 'horizontal',
          contents: [
            {
              type: 'text',
              text: `ลำดับ.${index + 1}`, // ลำดับพนักงาน
              color: '#363636',
              align: 'start',
              flex: 1
            },
            {
              type: 'text',
              text: `รหัสพนักงาน: `, // รหัสพนักงาน
              color: '#363636',
              align: 'end',
              flex: 2, // ปรับ flex ให้ใกล้เคียงกัน
              gravity: 'center' // จัดตำแหน่งให้กลาง
            },
            {
              type: 'box',
              layout: 'vertical',
              backgroundColor: '#5A975E', // เพิ่มพื้นหลังสีเขียว
              cornerRadius: '9px', // มุมกล่องมน
              paddingAll: '5px', // ระยะห่างรอบตัวอักษรภายในกล่อง
              contents: [
                {
                  type: 'text',
                  text: `${employee.employee}`, // รหัสพนักงาน
                  color: '#ffffff',
                  align: 'center',
                 // weight: 'bold',
                  flex: 3
                }
              ]
            }
          ]      
      },
      {
        type: 'text',
        text: `ชื่อ: ${employee.name} ${employee.lastname}`, // ชื่อและนามสกุล
        color: '#363636',
        align: 'start',
        flex: 2,
        margin: 'sm'
      },
      {
        type: 'separator', // เส้นตัวกั้นใต้ข้อความ "รายชื่อพนักงาน"
        margin: 'md',
        color: '#D3D3D3'
      }
    ]
  }));
  
  const quickReplyItems = [];
  
  // เพิ่ม quick reply ตามบทบาท
  if (role === 'manager') {
    quickReplyItems.push({
      type: 'action',
      action: {
        type: 'message',
        label: 'เพิ่มจป.ระดับเทคนิค',
        text: 'เพิ่มจป.ระดับเทคนิค'
      },
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/4315/4315451.png'
    });
  } else if (role === 'technical') {
    quickReplyItems.push({
      type: 'action',
      action: {
        type: 'message',
        label: 'เพิ่มจป.ระดับหัวหน้างาน',
        text: 'เพิ่มจป.ระดับหัวหน้างาน'
      },
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/4315/4315451.png'
    });
  } 
  else if (role === 'super') {
    quickReplyItems.push({
      type: 'action',
      action: {
        type: 'message',
        label: 'เพิ่มพนักงาน',
        text: 'เพิ่มพนักงาน'
      },
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/4315/4315451.png'
    });
  }

  return {
    type: 'flex',
    size: 'giga',
    altText: 'Employee List',
    contents: {
      type: 'bubble',
      body: {
        type: 'box',
        backgroundColor: '#FFFFFF', 
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'รายชื่อพนักงาน',
            weight: 'bold',
            align: 'start',
            size: 'xl',
            color: '#5A975E'
          },
          {
            type: 'separator', 
            margin: 'md',
            color: '#D3D3D3'
          },
          {
            type: 'box',
            layout: 'vertical',
            margin: 'lg',
            spacing: 'md',
            contents: employeeContents
          }
        ]
      }
    },
    quickReply: {
      items: quickReplyItems
    }
  };
}

// ฟังก์ชันสร้าง Flex Message จากแผนงาน
export function createPlanFlexMessage(planData, role) {
  const quickReplyItems = [];
  
  // เพิ่ม quick reply ตามบทบาท
  if (role === 'manager') {
    quickReplyItems.push({
      type: 'action',
      action: {
        type: 'message',
        label: 'add plan SO.Man',
        text: 'add plan SO.Man'
      },
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/5246/5246210.png'
    });
  } else if (role === 'technical') {
    quickReplyItems.push({
      type: 'action',
      action: {
        type: 'message',
        label: 'add plan SO.Tech',
        text: 'add plan SO.Tech'
      },
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/5246/5246210.png'
    });
  } else if(role === 'super'){
    quickReplyItems.push({
      type: 'action',
      action: {
        type: 'message',
        label: 'add plan SO.Sup',
        text: 'add plan SO.Sup'
      },
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/5246/5246210.png'
    });
  }

   // ถ้า planData ไม่มีข้อมูล ให้แสดงข้อความว่าไม่มีข้อมูลแผนงาน
   if (!planData || planData.length === 0) {
    return {
      type: "flex",
      size: "giga",
      altText: "ไม่มีข้อมูลแผนงาน",
      contents: {
        type: "bubble",
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "ไม่มีข้อมูลแผนงาน!",
              weight: "bold",
              size: "lg",
              color: "#5A975E",
              align: "center"
            },
            {
              type: "text",
              text: "กรุณาเพิ่มข้อมูลแผนงานหรือสอบถามผู้ดูแลระบบ",
              size: "sm",
              color: "#666666",
              align: "center",
              margin: "md"
            }
          ]
        },
        styles: {
          body: {
            backgroundColor: "#FFFFFF"
          }
        }
      },
      quickReply: {
        items: quickReplyItems,
      }
    };
  }


  const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];

  // จัดกลุ่มข้อมูลตามเดือนและปี
  const groupedByMonth = planData.reduce((acc, plan) => {
    if (!plan.date || plan.date.length !== 10) {
      console.error(`Invalid date format for plan: ${plan.date}`);
      return acc;
    }

    const [day, month, year] = plan.date.split('/'); 
    const monthYear = `${month}/${year}`; 
    
    if (!acc[monthYear]) acc[monthYear] = {};
    if (!acc[monthYear][day]) acc[monthYear][day] = [];
    
    acc[monthYear][day].push(plan);
    return acc;
  }, {});

  // เรียงลำดับตามปีและเดือนที่ใกล้ถึงมาก่อน
  const sortedMonthKeys = Object.keys(groupedByMonth)
    .sort((a, b) => {
      const [monthA, yearA] = a.split('/').map(Number);
      const [monthB, yearB] = b.split('/').map(Number);
      return yearA - yearB || monthA - monthB;
    });

  // แปลงข้อมูลที่จัดกลุ่มแล้วเป็นแผนใน Flex Message
  const planContents = sortedMonthKeys.map((monthYear) => {
    const [month, year] = monthYear.split('/');
    const monthName = monthNames[parseInt(month, 10) - 1];

    const days = Object.keys(groupedByMonth[monthYear])
      .sort((a, b) => Number(a) - Number(b)) // เรียงลำดับวันที่ใกล้ถึงมาก่อน
      .map((day) => {
        const plans = groupedByMonth[monthYear][day]
          .sort((a, b) => {
            const [startHourA, startMinuteA] = a.startTime.split(':').map(Number);
            const [startHourB, startMinuteB] = b.startTime.split(':').map(Number);
            return startHourA - startHourB || startMinuteA - startMinuteB;
          })
          .map((plan, index) => {
            const formattedStartTime = plan.startTime.replace(/:00$/, '');
            const formattedEndTime = plan.endTime.replace(/:00$/, '');

            return {
              type: "box",
              layout: "horizontal",
              spacing: "sm",
              contents: [
                {
                  type: "text",
                  text: `${index + 1}) ` + plan.activity,
                  size: "sm",
                  align: "start",
                  color: "#111111"
                },
                {
                  type: "text",
                  text: `${formattedStartTime} - ${formattedEndTime}`,
                  size: "sm",
                  color: "#111111"
                },
              ],
            };
          });

        return {
          type: "box",
          layout: "vertical",
          spacing: "sm",
          contents: [
            {
              type: "box",
              layout: "horizontal",
              backgroundColor: "#5A975E",
              paddingAll: "xs",
              width: "140px",
              cornerRadius: "md",
              contents: [
                {
                  type: "text",
                  text: `วันที่ ${day}/${month}/${year}`, 
                  weight: "bold",
                  size: "md",
                  align: "start",
                  color: "#FFFFFF",
                  margin: "md",
                }
              ]
            },
            {
              type: "box",
              layout: "horizontal",
              contents: [
                {
                  type: "text",
                  text: "กิจกรรม",
                  weight: "bold",
                  size: "md",
                  color: "#333333"
                },
                {
                  type: "text",
                  text: "เวลา",
                  weight: "bold",
                  size: "md",
                  color: "#333333",
                  align: "start",
                },
              ],
            },
            ...plans,
            {
              type: "separator",
              margin: "md",
              color: "#FFFFFF",
            },
            {
              type: "separator",
              margin: "md",
              color: "#D3D3D3",
            },
          ],
        };
      });

    return {
      type: "bubble",
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: `แผนงานเดือน ${monthName} ${year}`,
            weight: "bold",
            size: "lg",
            color: "#363636",
          },
          {
            type: "separator",
            margin: "md",
            color: "#D3D3D3",
          },
          {
            type: "box",
            layout: "vertical",
            margin: "lg",
            spacing: "sm",
            contents: days,
          },
        ],
      },
      styles: {
        body: {
          backgroundColor: "#FFFFFF",
          separator: true,
          separatorColor: "#E0E0E0",
        },
      },
    };
  });

  return {
    type: "flex",
    size: "giga",
    altText: "ข้อมูลแผนงานประจำเดือน",
    contents: {
      type: "carousel",
      contents: planContents,
    },
    quickReply: {
      items: quickReplyItems,
    }
  }
}

// ฟังก์ชันสร้าง Flex Message : zone
export function createZoneListFlexMessage(examineData) {
  if (!examineData || examineData.length === 0) {
    return {
      type: "text",
      text: "ไม่พบข้อมูลการตรวจสอบ"
    };
  }
  
  const zoneContents = examineData.map((zone, index) => ({
    type: "button",
    action: {
      type: "postback",
      label: zone.name, // ชื่อโซน
      data: `action=selectZone&zoneId=${zone.id}&zoneName=${zone.name}`, // ระบุ zoneId สำหรับดึงข้อมูล
      displayText: `ต้องการตรวจสอบ ${zone.name}` // แสดงข้อความนี้ในแชท
    },
    style: "primary"
  }));

  return {
    type: 'flex',
    altText: 'เลือกโซน',
    contents: {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'โซน',
            weight: 'bold',
            size: 'xl'
          },
          {
            type: 'separator',
            margin: 'md',
            color: '#D3D3D3'
          },
          {
            type: 'box',
            layout: 'vertical',
            margin: 'lg',
            spacing: 'sm',
            contents: zoneContents
          }
        ]
      }
    }
  };
}
// ฟังก์ชันสร้าง Flex Message : examine
export function createExamineFlexMessage(examineData) {
  if (!examineData || examineData.length === 0) {
    return {
      type: "text",
      text: "ไม่พบข้อมูลการตรวจสอบ"
    };
  }

  const examineContents = examineData.map((examine) => ({
    type: "button",
    action: {
      type: "postback",
      label: examine.name,
      data: `action=selectExamine&examineId=${examine.id}&examineName=${examine.name}`,
      displayText: `เลือกตรวจสอบ ${examine.name}`
    },
    style: "primary"
  }));

  return {
    type: 'flex',
    altText: 'รายการตรวจสอบ',
    contents: {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'ตรวจสอบ',
            weight: 'bold',
            size: 'xl'
          },
          {
            type: 'separator',
            margin: 'md',
            color: '#D3D3D3'
          },
          {
            type: 'box',
            layout: 'vertical',
            margin: 'lg',
            spacing: 'sm',
            contents: examineContents
          }
        ]
      }
    }
  };
}
// ฟังก์ชันสร้าง Flex Message : examinename ไม่ใช้พนักงาน
export function createExamineNameFlexMessage(examineNameData, zoneId, examineId) {
  if (!examineNameData || examineNameData.length === 0) {
    return {
      type: "text",
      text: "ไม่พบข้อมูลพื้นที่ตรวจสอบ"
    };
  }

  const examineNameContents = examineNameData.map((item, index) => ({
    type: "box",
    backgroundColor: '#f5f5f5',
    cornerRadius: "15px",
    paddingStart: "2%",
    paddingEnd: "2%",
    layout: "vertical",
    margin: "md",
    spacing: "sm",
    contents: [
      {
        type: "text",
        text: `${index + 1}. ${item.name}`,
        size: "md",
        weight: "bold",
        align: "start",
        margin: "lg"
      },
      {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: "button",
            action: {
              type: "postback",
              label: "ผ่าน",
              data: `action=pass&zoneId=${zoneId}&examineId=${examineId}&examinenameId=${item.id}&name=${item.name}&status=pass`,
              displayText: `${item.name} 'ผ่าน'`
            },
            style: "primary",
            color: "#1DB954"
          },
          {
            type: 'separator',
            margin: 'md',
            color: '#f5f5f5'
          },
          {
            type: "button",
            action: {
              type: "postback",
              label: "ไม่ผ่าน",
              data: `action=fail&zoneId=${zoneId}&examineId=${examineId}&examinenameId=${item.id}&name=${item.name}&status=fail`,
              displayText: `${item.name} 'ไม่ผ่าน'`
            },
            style: "primary",
            color: "#808080"
          }
        ]
      },
      {
        type: 'separator',
        margin: 'lg',
        color: '#f5f5f5'
      }
    ]
  }));

  return {
    type: 'flex',
    altText: 'รายละเอียดการตรวจสอบ',
    contents: {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: "text",
            text: "ตรวจสอบ",
            weight: "bold",
            size: "xl",
            align: "start",
            margin: "md"
          },
          {
            type: 'separator',
            margin: 'md',
            color: '#D3D3D3'
          },
          ...examineNameContents
        ]
      }
    }
  };
}
// ฟังก์ชันสร้าง Flex Message : examinename ใช้พนักงาน
export function createExamineUseEmployeeFlexMessage(examineUseEmp) {
  // จัดกลุ่มข้อมูลตาม employeeId
  const groupedExamine = examineUseEmp.reduce((acc, examine) => {
    const key = examine.employeeId;
    if (!acc[key]) {
      acc[key] = {
        employeeId: examine.employeeId,
        employee: examine.employee,
        employeeName: examine.employeeName,
        employeeLastname: examine.employeeLastname,
        exams: [],
      };
    }
    acc[key].exams.push({
      examinenameName: examine.examinenameName,
      examinenameId: examine.examinenameId,
    });
    return acc;
  }, {});

  // แปลงข้อมูลที่จัดกลุ่มเป็น Bubble
  const bubbles = Object.values(groupedExamine).map((employee) => ({
    type: 'bubble',
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'text',
          text: 'ตรวจสอบ (พนักงาน)',
          weight: 'bold',
          size: 'lg',
          wrap: true,
          color: '#111111',
        },
        {
          type: 'separator',
          margin: 'md',
        },
        {
          type: 'box',
          layout: 'horizontal',
          contents: [
            {
              type: 'text',
              text: employee.employee, // รหัสพนักงาน
              weight: 'bold',
              size: 'md',
              color: '#5A975E',
              flex: 2,
              align: 'start',
            },
            {
              type: 'text',
              text: `${employee.employeeName} ${employee.employeeLastname}`, // ชื่อ-นามสกุล
              size: 'sm',
              color: '#111111',
              flex: 2,
              align: 'end',
            },
          ],
          margin: 'md',
        },
        {
          type: 'separator',
          margin: 'lg',
        },
        ...employee.exams.map((exam) => ({
          type: 'box',
          backgroundColor: '#f5f5f5',
          cornerRadius: "15px",
          paddingStart: "2%",
          paddingEnd: "2%",
          paddingBottom: "4%",
          margin: "md",
          spacing: "sm",
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: exam.examinenameName, // ข้อมูลการตรวจสอบ เช่น "safety hat"
              align: 'center',
              size: 'md',
              color: '#111111',
              wrap: true,
              margin: 'lg',
            },
            {
              type: 'box',
              
              layout: 'horizontal',
              contents: [
                {
                  type: 'button',
                  action: {
                    type: 'postback',
                    label: 'ผ่าน',
                    data: `action=pass&id=${employee.employeeId}&examinenameId=${exam.examinenameId}&name=${exam.examinenameName}&nameEmp=${employee.employeeName}&lastnameEmp=${employee.employeeLastname}`,
                    displayText: `${exam.examinenameName} "ผ่าน" สำหรับ ${employee.employeeName} ${employee.employeeLastname}`,
                  },
                  style: 'primary',
                  color: '#00c300',
                  flex: 1,
                },
                {
                  type: 'button',
                  action: {
                    type: 'postback',
                    label: 'ไม่ผ่าน',
                    data: `action=fail&id=${employee.employeeId}&examinenameId=${exam.examinenameId}&name=${exam.examinenameName}&nameEmp=${employee.employeeName}&lastnameEmp=${employee.employeeLastname}`,
                    displayText: `${exam.examinenameName} "ไม่ผ่าน" สำหรับ ${employee.employeeName} ${employee.employeeLastname}`,
                  },
                  style: 'primary',
                  color: '#808080',
                  flex: 1,
                },
              ],
              margin: 'lg',
              spacing: 'sm',
            },
          ],
          margin: 'lg',
        })),
      ],
    },
    styles: {
      body: {
        backgroundColor: '#ffffff',
      },
      footer: {
        separator: true,
      },
    },
  }));

  // สร้าง Carousel Message
  return {
    type: 'flex',
    altText: 'ข้อมูลการตรวจสอบพนักงาน',
    contents: {
      type: 'carousel',
      contents: bubbles,
    },
  };
}

function formatDateForDB(inputDate) {
  const [year, month, day] = inputDate.split('-');
  return `${day}/${month}/${year}`;
}

let userIdsMap = new Map(); // ใช้ Map ในการจัดเก็บ lineUserId และ user_id
// ฟังก์ชันดึงข้อมูลแผนงาน
async function fetchPlansFromDB(lineUserId, nameTable) {
  try {
    if (!nameTable || !['plan_r2', 'plan_r3', 'plan'].includes(nameTable)) {
      throw new Error('Invalid nameTable: ' + nameTable);
    }
    
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;

    let getPlanQuery;
    if (nameTable === 'plan_r3') {
      getPlanQuery = `SELECT plan_r3.* FROM plan_r3 JOIN users_r3 ON plan_r3.user_id = users_r3.id WHERE users_r3.lineUserId = ? AND STR_TO_DATE(plan_r3.date, '%d/%m/%Y') >= ?;`;
    } else if (nameTable === 'plan_r2') {
      getPlanQuery = `SELECT plan_r2.* FROM plan_r2 JOIN users_r2 ON plan_r2.user_id = users_r2.id WHERE users_r2.lineUserId = ? AND STR_TO_DATE(plan_r2.date, '%d/%m/%Y') >= ?;`;
    } else if (nameTable === 'plan') {
      getPlanQuery = `SELECT plan.* FROM plan JOIN users ON plan.user_id = users.id WHERE users.lineUserId = ? AND STR_TO_DATE(plan.date, '%d/%m/%Y') >= ?;`;
    }

    const [planResult] = await db.query(getPlanQuery, [lineUserId, formattedDate]);

    // ตรวจสอบว่ามี user_id แล้วหรือยัง
    if (!userIdsMap.has(lineUserId)) {
      const userIdQuery = `SELECT id FROM ${nameTable === 'plan_r3' ? 'users_r3' : nameTable === 'plan_r2' ? 'users_r2' : 'users'} WHERE lineUserId = ?`;
      const [userResult] = await db.query(userIdQuery, [lineUserId]);
      console.log("ผลลัพธ์จากการดึง user_id:", userResult);

      if (userResult.length > 0) {
        const userId = userResult[0].id;
        userIdsMap.set(lineUserId, userId); // เก็บ lineUserId และ user_id ใน Map
        console.log("เก็บ user_id ใน Map:", userId);
      }else {
        console.log("ไม่พบ user_id ที่เกี่ยวข้องกับ LINE User ID นี้");
      }
    }
    
    return planResult;
  } catch (error) {
    console.error('Error fetching plans:', error);
    return [];
  }
}

// ฟังก์ชันดึงข้อมูลพนักงาน
async function fetchEmployeesFromDB(lineUserId, tableName) {
  try {
    if (!tableName || !['users_r2', 'users', 'employee'].includes(tableName)) {
      throw new Error('Invalid tableName: ' + tableName);
    }
    
    console.log('Connecting to database...');
    let getEmployeeQuery;

    if (tableName === 'users_r2'){
      getEmployeeQuery = `SELECT users_r2.* FROM users_r2 JOIN users_r3 ON users_r3.id = users_r2.users_r3_id WHERE users_r3.lineUserId = ?`
    } else if (tableName === 'users') {
      getEmployeeQuery = `SELECT users.* FROM users JOIN users_r2 ON users_r2.id = users.role_2_id WHERE users_r2.lineUserId = ?`
    } else if (tableName === 'employee') {
      getEmployeeQuery = `SELECT employee.* FROM employee JOIN users ON users.id = employee.users_id WHERE users.lineUserId = ?`
    } else {
      console.error(`Invalid table name: ${tableName}`); // Log ชื่อที่ไม่ถูกต้อง
      throw new Error('Invalid table name');    }

      const [employeeResult] = await db.query(getEmployeeQuery,[lineUserId]);
      console.log('Employee data fetched:', employeeResult);

      if (!userIdsMap.has(lineUserId)) {
        const userIdQuery = `SELECT id FROM ${tableName === 'users_r2' ? 'users_r3' : tableName === 'users' ? 'users_r2' : 'users'} WHERE lineUserId = ?`;
        const [userResult] = await db.query(userIdQuery, [lineUserId]);
        console.log("ผลลัพธ์จากการดึง user_id:", userResult);
  
        if (userResult.length > 0) {
          const userId = userResult[0].id;
          userIdsMap.set(lineUserId, userId); // เก็บ lineUserId และ user_id ใน Map
          console.log("เก็บ user_id ใน Map:", userId);
        }else {
          console.log("ไม่พบ user_id ที่เกี่ยวข้องกับ LINE User ID นี้");
        }
      }

    return employeeResult;  // คืนค่าข้อมูลพนักงาน
  } catch (error) {
    console.error('Error fetching employees:', error);
    return []; // คืนค่าตารางว่างหากมีข้อผิดพลาด
  }
}

// ฟังก์ชันดึงข้อมูล examinelist & examine
async function fetchExamineFromDB(lineUserId, columnName, selectedExamineListId = null) {
  try {
    console.log('Connecting to database...');
    let getExamineQuery;
    let queryParams = [lineUserId];
    let examineResult;

    if (columnName === 'zone') {
      getExamineQuery = `
        SELECT examinelist.id, examinelist.name 
        FROM examinelist 
        JOIN users ON users.id = examinelist.user_id 
        WHERE users.lineUserId = ?;
      `;
    } else if (columnName === 'examine') {
      if (!selectedExamineListId) {
        throw new Error("SelectedExamineListId is required for 'examine' column.");
      }

      getExamineQuery = `
        SELECT examine.id, examine.name, examine.useEmployee
        FROM examine 
        JOIN examinelist ON examinelist.id = examine.examinelist_id 
        JOIN users ON users.id = examinelist.user_id 
        WHERE users.lineUserId = ? 
        AND examinelist.id = ?;
      `;
      queryParams.push(selectedExamineListId);
    } else if (columnName === 'examineTrue') {
      if (!selectedExamineListId) {
        throw new Error("SelectedExamineListId is required for 'examineTrue' column.");
      }
    
      getExamineQuery = `
  SELECT examine.id AS examineId, examine.name AS examineName, examine.useEmployee,
         employee.id AS employeeId, employee.employee, employee.name AS employeeName, employee.lastname AS employeeLastname,
         examinename.id AS examinenameId, examinename.name AS examinenameName
         FROM examine
         LEFT JOIN examinename ON examinename.examine_id = examine.id
          JOIN examinelist ON examinelist.id = examine.examinelist_id
          JOIN users ON users.id = examinelist.user_id
          JOIN employee ON employee.examinelist_id = examinelist.id -- เพิ่มเงื่อนไขเชื่อมตาราง employee กับ examinelist
          WHERE users.lineUserId = ? AND examinelist.id = ? AND examine.useEmployee = 'true';
`;

      queryParams.push(selectedExamineListId);
    }
    

    [examineResult] = await db.query(getExamineQuery, queryParams);
    console.log('Examine data fetched (before filtering):', examineResult);

    // กรองข้อมูลเฉพาะเมื่อ columnName === 'examine'
    /*if (columnName === 'examine') {
      examineResult = examineResult.filter(item => item.useEmployee === 'false');
      console.log('Examine data fetched (after filtering):', examineResult);
    } else if (columnName === 'examineTrue'){
      examineResult = examineResult.filter(item => item.useEmployee === 'true');
      console.log('Examine data fetched (after filtering):', examineResult);
    }*/

    return examineResult; // ส่งตัวแปรเดิมกลับ
  } catch (error) {
    console.error('Error fetching examine data:', error);
    return [];
  }
}
// ดึงข้อมูล examinename
async function fetchExamineDetails(examineId, lineUserId) {
  try {

    console.log('Connecting to database to fetch examine details...');
    const getDetailsQuery = `
      SELECT examinename.id, examinename.name 
      FROM examinename 
      WHERE examinename.examine_id = ?;
    `;
    
    const [detailsResult] = await db.query(getDetailsQuery, [examineId]);
    console.log('Examine details fetched:', detailsResult);

   
    return detailsResult;
  } catch (error) {
    console.error('Error fetching examine details:', error);
    return []; // คืนค่าตารางว่างหากมีข้อผิดพลาด
  }
}

// ฟังก์ชันส่ง FlexMessage ไป Line
export async function sendFlexMessageToLine(flexMessage, userId) {
  const lineApiUrl = "https://api.line.me/v2/bot/message/push";

  const messagePayload = {
    to: userId,  // LINE User ID ที่จะส่งข้อความถึง
    messages: [flexMessage]
  };

  try {
    await axios.post(lineApiUrl, messagePayload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.channelAccessToken}`
      }
    });
    console.log('Flex Message ส่งสำเร็จ!');
  } catch (error) {
    console.error('Error sending message to LINE:', error.message);
  }
}

const saltRounds = 10; 
// ฟังก์ชันสำหรับบันทึกข้อมูล -EMPLOYEE LIST- ลงฐานข้อมูล 
async function saveEmployeeToDatabase(employee, name, lastname,rawpassword,lineUserId, tableName) {
  try {
    
      const users_r3_id = userIdsMap.get(lineUserId);
      const role_2_id = userIdsMap.get(lineUserId);
      const users_id = userIdsMap.get(lineUserId);
    console.log("Checking user_id:", users_id);

    if (!users_id) {
      console.error("ไม่พบ user_id สำหรับ Line User ID นี้");
      return;
    }
    console.log("Using tableName:", tableName); // ตรวจสอบชื่อ table

    if (!tableName || !['users_r2', 'users', 'employee'].includes(tableName)) {
      console.error("Invalid tableName:", tableName);
      return;
    }
    const password = await bcrypt.hash(rawpassword, saltRounds);

    let insertSql;
    let values;

    if (tableName === 'users_r2') {
      insertSql = `INSERT INTO users_r2 (position, employee, name, lastname, password, users_r3_id, phone, line, picture, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      values = ['Safety Officer Technical level', employee, name, lastname, password, users_r3_id, null, null, null, null];
    } else if (tableName === 'users') {
      insertSql = `INSERT INTO users (position, employee, name, lastname, password, role_2_id, phone, line, picture, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      values = ['Safety Officer Supervisory level', employee, name, lastname, password, role_2_id, null, null, null, null];
    } else if (tableName === 'employee') {
      insertSql = `INSERT INTO employee (employee, name, lastname, examinelist_id, users_id, lineUserId) VALUES (?, ?, ?, ?, ?, ? )`;
      values = [employee, name, lastname, null, users_id, null ];
    }
    console.log("SQL Query:", insertSql); // ตรวจสอบคำสั่ง SQL

    await db.query(insertSql, values);
    console.log("Employee saved successfully for user_id:", values);
    console.log("table save เหลือ " + tableName);

  } catch (error) {
    console.error('Error saving employee:', error);
  }
}

async function handleDateTimePostback(postback) {
  try {
    // ดึงค่า datetime จาก postback
    const datetime = postback.params.datetime;
   // แยก date และ time
    const [date, time] = datetime.split('T'); // date = '2024-10-10', time = '15:13'
    // กำหนดค่าที่จะใช้ในการบันทึก
    const startDate = date;       
    const startTime = time;      
    const endTime =  time;   
    //const userIdToSave = storedUserIds; 
    const user_id = decodedToken.user_id;   
    await savePlanToDatabase({
      date: startDate,
      startTime: startTime,
      endTime: endTime,
      activity: activity,
      user_id: user_id
    }, nameTable);
    console.log("บันทึกข้อมูลสำเร็จ");
  } catch (error) {
    console.error("Error handling postback datetime:", error);
  }
}

// ฟังก์ชันสำหรับบันทึกข้อมูล -PLAN- ลงฐานข้อมูล 
async function savePlanToDatabase({ date, startTime, endTime, activity, lineUserId, nameTable }) {
  try {
    // ตรวจสอบว่ามี user_id ใน Map
    const user_id = userIdsMap.get(lineUserId);
    console.log("Checking user_id:", user_id);
    if (!user_id) {
      console.error("ไม่พบ user_id สำหรับ Line User ID นี้");
      return;
    }
    console.log("Using nameTable:", nameTable); // ตรวจสอบชื่อ table

    if (!nameTable || !['plan_r2', 'plan_r3', 'plan'].includes(nameTable)) {
      console.error("Invalid nameTable:", nameTable);
      return;
    }

    // ใช้ฟังก์ชัน formatDateForDB เพื่อแปลงวันที่
    const formattedDate = formatDateForDB(date);
    console.log("Formatted Date:", formattedDate);

    let insertSql;
    if (nameTable === 'plan_r3') {
      insertSql = 'INSERT INTO plan_r3 (date, startTime, endTime, activity, user_id, meeting) VALUES (?, ?, ?, ?, ?, ?)';
    } else if (nameTable === 'plan_r2') {
      insertSql = 'INSERT INTO plan_r2 (date, startTime, endTime, activity, user_id, meeting) VALUES (?, ?, ?, ?, ?, ?)';
    } else if (nameTable === 'plan') {
      insertSql = 'INSERT INTO plan (date, startTime, endTime, activity, user_id, meeting) VALUES (?, ?, ?, ?, ?, ?)';
    }

    console.log("SQL Query:", insertSql); // ตรวจสอบคำสั่ง SQL
    console.log("Values to insert:", [formattedDate, startTime, endTime, activity, user_id, null]);

    console.log("Preparing to save with user_id:", user_id);

    // บันทึกข้อมูล
    await db.query(insertSql, [formattedDate, startTime, endTime, activity, user_id, null]);
    console.log("Plan saved successfully for user_id:", user_id);

  } catch (error) {
    console.error("Error saving plan:", error);
  }
}

// ฟังก์ชันสำหรับบันทึกข้อมูล -EXAMINE- ลงฐานข้อมูล 
async function saveExamineResultToDB(zoneArray, zone, examine, itemId, status, idEmp, lineUserId) {
  // ตรวจสอบกรณีที่ itemName (examinename_id) เป็น null
  if (!itemId) {
      console.error('Error: examineName_id is null or undefined');
      throw new Error('ไม่สามารถบันทึกข้อมูลได้ เนื่องจาก examineName_id เป็น null');
  }

  if (!userIdsMap.has(lineUserId)) {
      const userIdQuery = `SELECT users.id AS user_id, users.role_2_id AS r2_id FROM users 
                           WHERE lineUserId = ?;`;
      const [userResult] = await db.query(userIdQuery, [lineUserId]);
      if (userResult.length > 0) {
          const { user_id, r2_id } = userResult[0];
          userIdsMap.set(lineUserId, { user_id, r2_id });
      } else {
          console.error("ไม่พบ user_id หรือ r2_id สำหรับ LINE User ID นี้");
          throw new Error("ไม่พบ user_id หรือ r2_id สำหรับ lineUserId นี้");
      }
  }

  const { user_id, r2_id } = userIdsMap.get(lineUserId);
  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
  const sendDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')} ${currentDate.toTimeString().split(' ')[0]}`;
  
  // Check if the data already exists
  const checkSql = "SELECT * FROM `select` WHERE date = ? AND user_id = ?";
  const checkValues = await db.query(checkSql, [formattedDate, user_id]);
  console.log("resultcheckValues: ", checkValues);

  if (checkValues[0].length === 0) {
    // แปลง zoneArray ให้เป็น JSON string โดยรักษารูปแบบตัวเลข
    const formattedZoneArray = JSON.stringify(zoneArray.map(Number)); // แปลงค่าทั้งหมดใน array เป็นตัวเลขก่อน stringify
  
    const insertSql = "INSERT INTO `select` (date, select_id, user_id) VALUES (?, ?, ?)";
    
    try {
      const insertValues = await db.query(insertSql, [formattedDate, formattedZoneArray, user_id]);
      console.log("result555: ", insertValues[0]);
    } catch (error) {
      console.error("Error inserting data:", error);
    }
  }
  
  try {
    if (idEmp) {
          console.log('******* employee checklist **********')
          const insertEmployeeDataSql = `INSERT INTO checklist_employee_row_2
                                         (date, employee_name_id, examinename_id, status, details, inspector, examine_id, examinelist_id, users_r2_id)
                                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

          await db.query(insertEmployeeDataSql, [ formattedDate, idEmp, itemId, status, '-', user_id, examine, zone, r2_id ]);
          console.log('บันทึกข้อมูลสำเร็จในตารางที่มีข้อมูลพนักงาน' , [ formattedDate, idEmp, itemId, status, '-', user_id, examine, zone, r2_id ] );

          // Insert into checklist_employee
          const insertEmployeeSql = `INSERT INTO checklist_employee 
                                    (date, employee_name_id, examinename_id, status, details, inspector, examine_id, examinelist_id)
                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

          await db.query(insertEmployeeSql, [formattedDate, idEmp, itemId, status, '-', user_id, examine, zone]);
          console.log('บันทึกข้อมูลสำเร็จในตาราง checklist_employee', [formattedDate, idEmp, itemId, status, '-', user_id, examine, zone]);
      } else {
          // บันทึกข้อมูลในตารางเดิม
          const insertSqlR2 = `INSERT INTO checklist_examine_row_2 
                             (date, examinename_id, status, details, inspector, examine_id, examinelist_id, send_date, r2_id) 
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

          await db.query(insertSqlR2, [ formattedDate, itemId, status, '-', user_id, examine, zone, sendDate, r2_id ]);
          console.log('บันทึกข้อมูลตรวจสอบสำเร็จ checklist_examine_r2', [ formattedDate, itemId, status, '-', user_id, examine, zone, sendDate, r2_id ]);

          const insertSql = `INSERT INTO checklist_examine
                             (date, examinename_id, status, details, inspector, examine_id, examinelist_id) 
                             VALUES (?, ?, ?, ?, ?, ?, ?)`;

          await db.query(insertSql, [ formattedDate, itemId, status, '-', user_id, examine, zone, sendDate ]);
          console.log('บันทึกข้อมูลตรวจสอบสำเร็จ checklist_examine', [ formattedDate, itemId, status, '-', user_id, examine, zone, sendDate ]);
      }

      return { success: true, message: 'บันทึกข้อมูลตรวจสอบสำเร็จ' };
  } catch (error) {
      console.error('Error บันทึกข้อมูล:', error);
      throw error;
  }
}

// แยกวัน/เดือน/ปี และเวลา
function formatDateTimeForDB(dateTime) {
  const [day, month, yearWithTime] = dateTime.split('/');
  const [year, time] = yearWithTime.split(' '); // แยกปีและเวลาออกจากกัน
  
  // แปลงปี พ.ศ. เป็น ค.ศ.
  const convertedYear = parseInt(year, 10) - 543;

  // จัดรูปแบบ ปี-เดือน-วัน ชั่วโมง:นาที:วินาที
  return `${convertedYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')} ${time}`;
}

// ฟังก์ชันสำหรับบันทึกข้อมูล -NOTIFY- ลงฐานข้อมูล 
async function saveNotifyToDatabase({ title, employee, location, fullname, position,dateTime,fileBuffer,filename,detail,id,role_2_id }) {
  try {

    //const dateTime = new Date().toLocaleString(); // กำหนดวันที่และเวลา

    console.error("สสสสสสสสสสสสสสสส:" ,title, employee, location, fullname, position,dateTime,fileBuffer,filename,detail,id,role_2_id );
    const getRole3Query = "SELECT users_r3_id FROM users_r2 WHERE id = ?";
    const [ResultRole3] = await db.query(getRole3Query, [role_2_id]);
    if (!ResultRole3.length) {
      console.error("ไม่พบ role_3_id สำหรับ role_2_id:", role_2_id);
      return;
    }
    const formattedDateTime = formatDateTimeForDB(dateTime);

    const insertSql = "INSERT INTO notify (title, employee, location, work_owner, status, date, file, file_name, detail, user_id, Verification_status, role_2_id, role_3_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const insertValues = [
      title,
      employee,
      location,
      fullname,
      position,
      formattedDateTime,
      fileBuffer, 
      filename,
      detail,
      id,
      1,
      role_2_id,
      ResultRole3[0].users_r3_id
    ];

    const [insertResult] = await db.execute(insertSql, insertValues);

    console.log("Notify saved successfully for notify_id:", insertResult.insertId);
  } catch (error) {
    console.error("Error saving Notify:", error);
  }
}

//******************* NOTIFY ******************************* */
const fetchNotifyDetails = async (userId) => {
  try {
    const lineUserId = userId;
    // ใช้ userId เพื่อดึงข้อมูลการแจ้งเตือน
    const fetchNotifyQuery = `SELECT id,employee, CONCAT(name, ' ',lastname) As fullname, position,role_2_id FROM users WHERE lineUserId = ?`;
    const [notifyResult] = await db.query(fetchNotifyQuery, [lineUserId]);  // ใช้ userId ที่กำหนดมา

    console.log("Query executed with userId:", lineUserId);
    console.log("Query result:", notifyResult); // ตรวจสอบว่าได้ข้อมูลหรือไม่

    if (notifyResult.length === 0) {
      console.log("ไม่พบข้อมูลการแจ้งเตือนสำหรับ userId:", lineUserId);
    }

    return notifyResult;
  } catch (error) {
    console.error('Error fetching notify details:', error);
    return []; // คืนค่าตารางว่างหากมีข้อผิดพลาด
  }
};

function createInfoBox(label, value) {
  return {
    type: 'box',
    layout: 'baseline',
    contents: [
      { type: 'text', text: label, weight: 'bold', size: 'sm', color: '#333333', flex: 2 },
      { type: 'text', text: value, size: 'sm', color: '#666666', flex: 3, wrap: true },
    ],
  };
}

async function fetchZonesForUser(lineUserId) {
  try {
    let userId;

    // ตรวจสอบ userId จาก Map หรือดึงจากฐานข้อมูลถ้าไม่มี
    if (userIdsMap.has(lineUserId)) {
      userId = userIdsMap.get(lineUserId);
      console.log("พบ user_id ใน Map:", userId);
    } else {
      const userIdQuery = `SELECT id FROM users WHERE lineUserId = ?`;
      const [userResult] = await db.query(userIdQuery, [lineUserId]);
      console.log("ผลลัพธ์จากการดึง user_id:", userResult);

      if (userResult.length > 0) {
        userId = userResult[0].id;
        userIdsMap.set(lineUserId, userId); // เก็บ lineUserId และ user_id ใน Map
        console.log("เก็บ user_id ใน Map:", userId);
      } else {
        console.log("ไม่พบ user_id ที่เกี่ยวข้องกับ LINE User ID นี้");
        return []; // ออกถ้าไม่พบ user_id
      }
    }

    // ดึงข้อมูลโซนสำหรับ userId จากฐานข้อมูล
    const query = `SELECT examinelist.name FROM examinelist
                   JOIN users ON users.id = examinelist.user_id
                   WHERE examinelist.user_id = ?`;
    const [rows] = await db.query(query, [userId]); // ใช้ userId ที่อัปเดตจาก Map

    console.log('Zone data fetched for user:', rows);
    return rows; // ส่งผลลัพธ์โซนกลับมา

  } catch (error) {
    console.error('Error fetching zones for user from database:', error);
    return []; // คืนค่าตารางว่างหากมีข้อผิดพลาด
  }
}

async function downloadImage(messageId) {
  try {
    const tempDir = path.join(__dirname, 'temp'); // โฟลเดอร์ temp
    const filePath = path.join(tempDir, `${messageId}.jpg`); // ที่อยู่ไฟล์

    // ตรวจสอบว่า temp มีอยู่หรือยัง
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // ดึงข้อมูล Media
    const stream = await client.getMessageContent(messageId);
    if (!stream) {
      console.error("ไม่พบ Media สำหรับ Message ID:", messageId);
      throw new Error("Media not found");
    }

    // บันทึกไฟล์
    return new Promise((resolve, reject) => {
      const writable = fs.createWriteStream(filePath);
      stream.pipe(writable);
      writable.on('finish', () => resolve(filePath));
      writable.on('error', reject);
    });
  } catch (error) {
    console.error("Error downloading image:", error.message);
    throw error; // ส่งต่อข้อผิดพลาดให้ผู้เรียก
  }
}

// ฟังก์ชันอัปโหลดไปยัง Imgur
async function uploadToImgur(imagePath) {
  const imgurClientId = '27d45fbaf03fb9a'; // ใช้ Imgur client ID 
  const formData = new FormData();
  formData.append('image', fs.createReadStream(imagePath));

  try {
    const response = await axios.post('https://api.imgur.com/3/image', formData, {
      headers: {
        'Authorization': `Client-ID ${imgurClientId}`,
        ...formData.getHeaders()
      }
    });
    return response.data.data.link; // จะได้รับ URL ของไฟล์ที่อัปโหลด
  } catch (error) {
    console.error('Error uploading image to Imgur:', error);
    throw error;
  }
}

//***********************************************************************
const addEmployeeData = {};
const confirmSaveEmployee = {};

const addNotifyData ={};
const confirmSaveNotify = {};

const addActivityPlan = {};
const confirmSavePlan = {};

const selectedZoneData = new Map(); // ใช้ Map เพื่อเก็บคู่ userId -> zoneId
const selectedExamineData = new Map(); 
const selectedExamineNameData = new Map(); 
const userExamineData = new Map(); 
const userSavedTodayData = new Map();

// ฟังก์ชันช่วยในการจัดการวัน (เช่น เช็คว่าเป็นวันเดียวกันหรือไม่)
function getCurrentDateKey() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // เดือนเริ่มต้นที่ 0
    const day = today.getDate();
    return `${year}-${month}-${day}`; // ใช้รูปแบบ YYYY-MM-DD
}
async function runLoadingAnimation(chatId, duration) {
  try {
    // เริ่ม Loading Animation
    await startLoadingAnimation(chatId);

    // หยุด Loading Animation หลังจากเวลาที่กำหนด (duration)
    setTimeout(async () => {
      await stopLoadingAnimation(chatId);
    }, duration);
  } catch (error) {
    console.error('Error in runLoadingAnimation:', error.message);
  }
}

const deleteEmployeeData = {};

async function handleEvents(event) {
  try 
  {
      console.log(event); 

      const initialQuickReply = {
      items: [
        {
          type: 'action',
          action: {
            type: 'message',
            label: 'Emergency',
            text: 'emergency',
          },
          imageUrl: 'https://cdn-icons-png.flaticon.com/512/6014/6014184.png',
        },
      ],
    };

      if (event.type === 'message' && event.message.type === 'text') {
        
        const userMessage = event.message.text;

        /******************* EXAMINE *************************/
        if (userMessage === 'examine role1'){
          const userId = event.source.userId;
          runLoadingAnimation(userId, 10000);
          const examinelist = await fetchExamineFromDB(userId,'zone'); // ดึงข้อมูลจาก zone จาก users role1
          const flexMessage = createZoneListFlexMessage(examinelist);
          
          flexMessage.quickReply = {
            items: [
                {
                    type: "action",
                    action: {
                        type: "message",
                        label: "ข้อมูลตรวจสอบวันนี้",
                        text: "ข้อมูลตรวจสอบวันนี้"
                    },
                 //   imageUrl: 'https://cdn.icon-icons.com/icons2/2892/PNG/512/data_icon_182835.png'
                }
            ]
        };
          return client.replyMessage(event.replyToken, flexMessage)
            .then(() => {
              console.log('Flex Message ส่งสำเร็จ');
            })
            .catch((err) => {
              console.error('Error ส่ง Flex Message:', err);
            });
        }
        if (userMessage === 'ข้อมูลตรวจสอบวันนี้') {
          const userId = event.source.userId;
          const userData = userExamineData.get(userId);

          startLoadingAnimation(userId);
            setTimeout(() => {
              stopLoadingAnimation(userId);
          }, 5000);
      
          if (!userData || userData.length === 0) {
              return client.replyMessage(event.replyToken, {
                  type: 'text',
                  text: 'ยังไม่มีข้อมูลการตรวจสอบวันนี้',
              });
          }
      
          const addedItems = new Set();
          const zoneAccumulator = {};
          const currentDate = new Date();
          const formattedDate = currentDate.toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit' });
      
          userData.forEach((item) => {
              const uniqueKey = `${item.zoneName}-${item.examineName}-${item.itemName}-${item.nameEmp}`;
              if (addedItems.has(uniqueKey)) return;
      
              addedItems.add(uniqueKey);
              const zoneKey = item.zoneName;
              const examineKey = item.examineName;
              const employeeKey = item.nameEmp ? `${item.nameEmp} ${item.lastnameEmp || ''}`.trim() : null;
      
              if (!zoneAccumulator[zoneKey]) {
                  zoneAccumulator[zoneKey] = {};
              }
      
              const accumulatorKey = employeeKey || examineKey;
              if (!zoneAccumulator[zoneKey][accumulatorKey]) {
                  zoneAccumulator[zoneKey][accumulatorKey] = {
                      type: 'bubble',
                      body: {
                          type: 'box',
                          layout: 'vertical',
                          contents: [
                              { type: 'text', text: `ข้อมูลตรวจสอบวันนี้(${formattedDate})`, weight: 'bold', size: 'xl', margin: 'md' },
                              { type: 'text', text: `ตรวจสอบ: ${zoneKey}`, weight: 'bold', size: 'lg', color: '#5A975E', margin: 'sm' },
                              { type: 'text', text: `${examineKey}${employeeKey ? ` (${employeeKey})` : ''}`, weight: 'bold', size: 'lg', margin: 'md' },
                              { type: 'separator', margin: 'lg', color: '#B0B0B0' },
                              { type: 'box', layout: 'vertical', spacing: 'sm', contents: [] },
                          ],
                      },
                  };
              }
      
              const bubbleContents = zoneAccumulator[zoneKey][accumulatorKey].body.contents;
              if (bubbleContents[4]?.contents) {
                  let index = bubbleContents[4].contents.length + 1;
                  let statusText;
                  let backgroundColor;
                  switch (item.status) {
                      case 'pass':
                          statusText = 'ผ่าน';
                          backgroundColor = '#5A975E';
                          break;
                      case 'fail':
                          statusText = 'ไม่ผ่าน';
                          backgroundColor = '#bf360c';
                          break;
                  }
      
                  bubbleContents[4].contents.push({
                      type: 'box',
                      layout: 'vertical',
                      contents: [
                          {
                              type: 'box',
                              layout: 'horizontal',
                              contents: [
                                  { type: 'text', text: `${index++}.`, flex: 1, size: 'sm', color: '#333333' },
                                  { type: 'text', text: item.itemName, flex: 4, size: 'sm', weight: 'bold', color: '#333333', wrap: true },
                              ],
                          },
                          {
                              type: 'box',
                              layout: 'horizontal',
                              contents: [
                                  {
                                      type: 'text',
                                      text: 'สถานะ:',
                                      size: 'sm',
                                      flex: 1,
                                      color: '#333333',
                                  },
                                  {
                                      type: 'box',
                                      layout: 'horizontal',
                                      flex: 4,
                                      contents: [
                                          {
                                              type: 'box',
                                              layout: 'vertical',
                                              paddingAll: 'xs',
                                              width: '50px',
                                              backgroundColor: backgroundColor,
                                              cornerRadius: 'md',
                                              contents: [
                                                  {
                                                      type: 'text',
                                                      text: statusText,
                                                      size: 'xs',
                                                      align: 'center',
                                                      color: '#ffffff',
                                                      weight: 'bold',
                                                  },
                                              ],
                                          },
                                      ],
                                  },
                              ],
                          },
                          {
                              type: 'separator',
                              margin: 'sm',
                              color: '#B0B0B0',
                          },
                      ],
                  });
              }
          });
      
          const flexMessageContents = Object.values(zoneAccumulator)
              .flatMap((zone) => Object.values(zone))
              .filter((bubble) => bubble.body?.contents[4]?.contents.length > 0);
      
          if (flexMessageContents.length === 0) {
              return client.replyMessage(event.replyToken, {
                  type: 'text',
                  text: 'ไม่มีข้อมูลที่จะแสดงผลในขณะนี้',
              });
          }
      
          const flexMessage = {
              type: 'flex',
              altText: 'การตรวจสอบวันนี้',
              contents: {
                  type: 'carousel',
                  contents: flexMessageContents,
              },
              quickReply: {
                items: [
                    {
                        type: 'action',
                        action: {
                            type: 'postback',
                            label: 'submit',
                            data: 'action=confirmSave',
                            displayText: 'ยืนยันการส่ง'
                        },
                        imageUrl: 'https://t3.ftcdn.net/jpg/09/80/56/32/360_F_980563257_kx0dqQgOqMLZ30uJ9xXif6yABQi6gCka.jpg'
                    },
                    {
                        type: 'action',
                        action: {
                            type: 'postback',
                            label: 'cancel',
                            data: 'action=cancelSave',
                            displayText: 'ยกเลิกการส่ง'
                        },
                        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfC8Ht5uJOJCqp9oQNwajaN37VvFC51zq3oA&s'
                    }
                ]
            }
          };
      
          return client.replyMessage(event.replyToken, flexMessage)
              .then(() => {
                  console.log('แสดงรายการตรวจสอบวันนี้สำเร็จ');
              })
              .catch((err) => {
                  console.error('Error แสดงรายการตรวจสอบวันนี้:', err);
              });
        }
        /************************************************** */
        
        /**************** EMPLOYEE LIST *********************/
        // เพิ่มลูกทีมให้จป.ทุกระดับ
        if (userMessage === 'เพิ่มจป.ระดับเทคนิค' || userMessage === 'เพิ่มจป.ระดับหัวหน้างาน' || userMessage === 'เพิ่มพนักงาน') {
          const table = userMessage === 'เพิ่มจป.ระดับเทคนิค' ? 'users_r2' 
                    : userMessage === 'เพิ่มจป.ระดับหัวหน้างาน' ? 'users' 
                    : userMessage === 'เพิ่มพนักงาน' ? 'employee' 
                    : null;
                    
        addEmployeeData[event.source.userId] = { Table: table, data: [] };
        console.log("table in add: " + table);
          return client.replyMessage(event.replyToken, {
            type: 'text',
            text: 'กรุณากรอกรหัสพนักงาน'
          });
        } else if (addEmployeeData[event.source.userId]) {
          // หากมีข้อมูลอยู่ใน addEmployeeData
          addEmployeeData[event.source.userId].data.push(userMessage);
    
          // ตรวจสอบว่ากรอกข้อมูลครบแล้วหรือไม่ (รหัสพนักงาน, ชื่อ, นามสกุล, รหัสผ่าน)
          if (addEmployeeData[event.source.userId].data.length === 4) {
            const [employee, name, lastname, rawpassword] = addEmployeeData[event.source.userId].data;
            const tableName = addEmployeeData[event.source.userId].Table
            confirmSaveEmployee[event.source.userId] = { employee, name, lastname, rawpassword, tableName };
            console.log("table0000: " + tableName);
    
            delete addEmployeeData[event.source.userId];
            
            return client.replyMessage(event.replyToken, {
              type: 'flex',
              altText: 'ข้อมูลพนักงานก่อนยืนยันการบันทึก',
              contents: {
                type: 'bubble',
                body: {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                    {
                      type: 'text',
                      text: 'ข้อมูลพนักงานที่ต้องการเพิ่ม',
                      weight: 'bold',
                      size: 'lg',
                      align: 'center'
                    },
                    {
                      type: 'separator',
                      margin: 'md'
                    },
                    {
                      type: 'box',
                      layout: 'vertical',
                      margin: 'lg',
                      spacing: 'sm',
                      contents: [
                      {
                        type: 'box',
                        layout: 'baseline',
                        spacing: 'sm',
                        contents: [
                        {
                          type: 'text',
                          text: 'รหัสพนักงาน:',
                          color: '#666666',
                          size: 'sm',
                          flex: 2
                        },
                        {
                          type: 'text',
                          text: employee,
                          wrap: true,
                          color: '#666666',
                          size: 'sm',
                          flex: 3
                        }
                        ]
                      },
                      {
                        type: 'box',
                        layout: 'baseline',
                        spacing: 'sm',
                        contents: [
                        {
                          type: 'text',
                          text: 'ชื่อ:',
                          color: '#666666',
                          size: 'sm',
                          flex: 2
                        },
                        {
                          type: 'text',
                          text: name,
                          wrap: true,
                          color: '#666666',
                          size: 'sm',
                          flex: 3
                        }
                      ]
                      },
                      {
                        type: 'box',
                        layout: 'baseline',
                        spacing: 'sm',
                        contents: [
                        {
                          type: 'text',
                          text: 'นามสกุล:',
                          color: '#666666',
                          size: 'sm',
                          flex: 2
                        },
                        {
                          type: 'text',
                          text: lastname,
                          wrap: true,
                          color: '#666666',
                          size: 'sm',
                          flex: 3
                        }
                        ]
                      }
                    ]
                  },
                  {
                    type: 'separator',
                    margin: 'lg'
                  },
                  {
                    type: 'text',
                    text: 'ต้องการยืนยันการบันทึกหรือไม่?',
                    wrap: true,
                    margin: 'lg',
                    align: 'center',
                    color: '#666666'
                  }
                ]
              }
            },
              quickReply: {
                items: [
                    {
                        type: 'action',
                        action: {
                            type: 'message',
                            label: 'ยืนยัน',
                            text: 'ยืนยัน'
                        }
                    },
                    {
                        type: 'action',
                        action: {
                            type: 'message',
                            label: 'ยกเลิก',
                            text: 'ยกเลิก'
                        }
                    }
                ]
            }
          });
          } else {
            const prompts = ['กรุณากรอกชื่อพนักงาน', 'กรุณากรอกนามสกุล', 'กรุณากรอกรหัสผ่าน'];
            return client.replyMessage(event.replyToken, {
              type: 'text',
              text: prompts[addEmployeeData[event.source.userId].data.length - 1]
            });
          }
          
        } else if (confirmSaveEmployee[event.source.userId]) {
          if (userMessage === 'ยืนยัน') {
            const lineUserId = event.source.userId;
            const { employee, name, lastname, rawpassword, tableName } = confirmSaveEmployee[event.source.userId];
            console.log("table YES:" + tableName)
    
            if (tableName) {
            await saveEmployeeToDatabase(employee, name, lastname, rawpassword, lineUserId, tableName);
            //delete confirmSaveEmployee[event.source.userId].employee;
             
            // ลบเฉพาะข้อมูลพนักงานใน confirmSaveEmployee แต่คง tableName ไว้
            confirmSaveEmployee[event.source.userId] = { tableName };
            console.log("ข้อมูลที่เหลือ " + confirmSaveEmployee[event.source.userId].tableName);
            
            return client.replyMessage(event.replyToken, {
                  type: 'text',
                  text: 'ข้อมูลพนักงานใหม่ถูกบันทึกเรียบร้อยแล้ว! ต้องการเพิ่มพนักงานอีกหรือไม่?',
                  quickReply: {
                     items: [
                    {
                      type: 'action',
                      action: { 
                          type: 'message', 
                          label: 'ใช่', 
                          text: 'ใช่'
                        }
                    },
                    {
                      type: 'action',
                      action: { 
                        type: 'message', 
                        label: 'ไม่ใช่', 
                        text: 'ไม่ใช่'
                      }
                    }
                  ]
                }
              });      
            } else {
                console.error("ไม่สามารถเข้าถึง tableName");
                return client.replyMessage(event.replyToken, { type: 'text', text: 'เกิดข้อผิดพลาดในการบันทึกข้อมูลแผนงาน โปรดลองใหม่อีกครั้ง' });
            } 
            
          } else if (userMessage === 'ยกเลิก') {
            delete confirmSaveEmployee[event.source.userId];
            return client.replyMessage(event.replyToken, {
              type: 'text',
              text: 'ยกเลิกการบันทึกข้อมูลพนักงาน'
            });
          } else if (userMessage === 'ใช่') {
            // ตรวจสอบว่ามีตารางล่าสุดอยู่ใน confirmSaveEmployee หรือไม่
            const lastTable = confirmSaveEmployee[event.source.userId]?.tableName;
            // ถ้ามีการกำหนดตารางล่าสุดไว้ ใช้ตารางนั้นในการเพิ่มพนักงานใหม่
            addEmployeeData[event.source.userId] = { Table: lastTable || null, data: [] };
            return client.replyMessage(event.replyToken, {
                type: 'text',
                text: 'กรุณากรอกรหัสพนักงาน'
            });
          } else if (userMessage === 'ไม่ใช่') {
          delete addEmployeeData[event.source.userId]
          return client.replyMessage(event.replyToken, {
              type: 'text',
              text: 'สิ้นสุดการเพิ่มพนักงานใหม่'
          });
        } 
        } 
        // ดูข้อมูลพนักงาน
        if (userMessage === 'employee list role3') {
          const userId = event.source.userId;
          runLoadingAnimation(userId, 10000);
          const employees = await fetchEmployeesFromDB(userId,'users_r2'); // ดึงข้อมูลจาก users role2
          const flexMessage = createEmployeeFlexMessage(employees, 'manager');
          return client.replyMessage(event.replyToken, flexMessage)
            .then(() => {
              console.log('Flex Message ส่งสำเร็จ');
            })
            .catch((err) => {
              console.error('Error ส่ง Flex Message:', err);
            });
        }
        if (userMessage === 'employee list role2') {
          const userId = event.source.userId;
          runLoadingAnimation(userId, 10000);
          const employees = await fetchEmployeesFromDB(userId, 'users'); // ดึงข้อมูลจาก users role1
          const flexMessage = createEmployeeFlexMessage(employees, 'technical');
          return client.replyMessage(event.replyToken, flexMessage)
            .then(() => {
              console.log('Flex Message ส่งสำเร็จ');
            })
            .catch((err) => {
              console.error('Error ส่ง Flex Message:', err);
            });
        }
        if (userMessage === 'employee list role1') {
          const userId = event.source.userId;

          runLoadingAnimation(userId, 10000);

          const employees = await fetchEmployeesFromDB(userId, 'employee'); // ดึงข้อมูลจาก employee
          const flexMessage = createEmployeeFlexMessage(employees, 'super');
          return client.replyMessage(event.replyToken, flexMessage)
            .then(() => {
              console.log('Flex Message ส่งสำเร็จ');
            })
            .catch((err) => {
              console.error('Error ส่ง Flex Message:', err);
            });
        }
        
        /****************************************************/
        /******************** NOTIFY ***********************/
        const messageId = event.message.id;
        const userId = event.source.userId;

          if (userMessage === 'notify role1') {
            runLoadingAnimation(userId, 10000);
            return client.replyMessage(event.replyToken, {
              type: 'text',
              text: 'กรุณาเลือกประเภทการแจ้งเตือน\n\n\nหมายเหตุ:\nemergency คือการแจ้งเตือนด่วน',
              quickReply: {
                items: [
                  {
                    type: 'action',
                    action: {
                      type: 'message',
                      label: 'Notify',
                      text: 'notify',
                    },
                    imageUrl: 'https://cdn-icons-png.flaticon.com/512/1827/1827301.png'
                  },
                  {
                    type: 'action',
                    action: {
                      type: 'message',
                      label: 'Emergency',
                      text: 'emergency',
                    },
                    imageUrl: 'https://cdn-icons-png.flaticon.com/512/6014/6014184.png',
                  },
                ],
              },
            });
          }
          if (userMessage === 'emergency') {
            // ดึงโซนที่ผู้ใช้มีสิทธิ์เข้าถึง
            const zones = await fetchZonesForUser(userId);
            const quickReplyItems = zones.map(zone => ({
              type: 'action',
              action: { type: 'message', label: zone.name, text: `zone: ${zone.name}` },
            }));
          
            // ตอบกลับด้วย Quick Reply เพื่อให้เลือกโซน
            return client.replyMessage(event.replyToken, {
              type: 'text',
              text: 'กรุณาเลือกโซนที่เกิดเหตุฉุกเฉิน:',
              quickReply: { items: quickReplyItems },
            });
          }
          // ตรวจจับข้อความที่เป็นการเลือกโซน
          if (userMessage.startsWith('zone:')) {
            const selectedZone = userMessage.replace('zone:', ''); // ดึงชื่อโซนจากข้อความ
          
            // สร้างข้อความแจ้งเตือนฉุกเฉิน
            const emergencyMessage = {
              type: 'text',
              text: `⚠️ แจ้งเตือนฉุกเฉิน ⚠️\n\nแจ้งเหตุฉุกเฉินในโซน:${selectedZone}\nกรุณาตรวจสอบโดยด่วน!`,
            };
          
            // ดึง userId ทั้งหมดจากฐานข้อมูล
            const allUserIds = await fetchAllUserIds(); // ฟังก์ชันนี้ควรดึง userId ทั้งหมดจากฐานข้อมูล
            console.log('USER: ', allUserIds);
            // ตรวจสอบว่า allUserIds เป็นอาร์เรย์และไม่ว่าง
            if (!Array.isArray(allUserIds) || allUserIds.length === 0) {
              console.error('No valid user IDs found');
              return client.replyMessage(event.replyToken, {
                type: 'text',
                text: 'ไม่พบผู้ใช้งานที่สามารถส่งการแจ้งเตือนได้',
              });
            }
      
            // ส่งข้อความถึงผู้ใช้ทุกคน
            try {
              console.log('USER IDs to send:', allUserIds);
              await client.multicast(allUserIds, emergencyMessage);
              return client.replyMessage(event.replyToken, {
                type: 'text',
                text: `ได้ส่งแจ้งเตือนเหตุฉุกเฉินในโซน '${selectedZone}' ไปยังผู้ใช้ทุกคนในระบบเรียบร้อยแล้ว`,
              });
            } catch (error) {
              console.error('Error sending emergency message:', error);
              return client.replyMessage(event.replyToken, {
                type: 'text',
                text: 'เกิดข้อผิดพลาดในการส่งการแจ้งเตือน',
              });
            }
          }
          async function fetchAllUserIds() {
            const results = await db.query(`
              SELECT lineUserId FROM users WHERE lineUserId IS NOT NULL
              UNION
              SELECT lineUserId FROM users_r2 WHERE lineUserId IS NOT NULL
              UNION
              SELECT lineUserId FROM users_r3 WHERE lineUserId IS NOT NULL
            `);            
            console.log('RESULT ', results); 
            return results[0].map(row => row.lineUserId).filter(id => id && id.trim() !== ''); 
          }
          if (userMessage === 'notify') {
            addNotifyData[userId] = { data: [], type: 'notify' }; // กำหนดให้เป็นประเภท notify
            return client.replyMessage(event.replyToken, {
              type: 'text',
              text: 'ระบุหัวข้อในการแจ้งเตือน (Topic) ที่ต้องการ 💡\n\nเช่น: ถังดับเพลิงหมดอายุ',
            });
          }
          if (addNotifyData[userId] && addNotifyData[userId].type === 'notify') {
          if (event.message.type === 'text') {
            addNotifyData[userId].data.push(userMessage);
          }
        // ตรวจสอบสถานะของข้อมูล
          if (addNotifyData[userId].data.length === 1) {
            const zones = await fetchZonesForUser(userId);
            const quickReplyItems = zones.map(zone => ({
                type: 'action',
                action: { type: 'message', label: zone.name, text: zone.name },
            }));
            return client.replyMessage(event.replyToken, {
              type: 'text',
              text: 'กรุณาระบุโซน 🏢',
              quickReply: { items: quickReplyItems },
            });
          } else if (addNotifyData[userId].data.length === 2) {
            return client.replyMessage(event.replyToken, {
              type: 'text',
              text: 'กรุณาแนบรูปภาพ 📸',
              quickReply: {
                items: [
                  { type: 'action', action: { type: 'camera', label: 'ถ่ายรูป' } },
                  { type: 'action', action: { type: 'cameraRoll', label: 'เลือกจากแกลเลอรี' } },
                ],
              },
            });
          }
        
          if (addNotifyData[userId]) {
            const { status, data, imageUrl } = addNotifyData[userId];
            const notifyDetails = await fetchNotifyDetails(userId);
      
            // กรณีรอรายละเอียด
            if (status === 'awaiting_detail') {
              data.push(userMessage); // เก็บข้อความใน data
              addNotifyData[userId].status = 'ready_to_flex'; // ตั้งสถานะว่า Flex พร้อมแล้ว
      
              // ตรวจสอบว่าข้อมูลพร้อมส่ง Flex หรือยัง
              if (data.length >= 3 && imageUrl) {
                const [title, location, detail] = data;

                  function formatDateTime(date) {
                    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
                    const formattedDate = date.toLocaleDateString('th-TH', options);
                    const formattedTime = date
                      .toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
                      .replace(':', '.'); // เปลี่ยน `:` เป็น `.` ในเวลา
                    return `${formattedDate} ${formattedTime}น.`;
                    }
              
                const dateTimeString = formatDateTime(new Date());
      
                const replyMessage = {
                  type: 'flex',
                  altText: 'ข้อมูลการแจ้งเตือนก่อนยืนยันการบันทึก',
                  contents: {
                              type: 'bubble',
                              size: 'mega',
                              styles: {
                                  header: { backgroundColor: '#5A975E' },
                                  body: { backgroundColor: '#ffffff' },
                              },
                              header: {
                              type: 'box',
                              layout: 'vertical',
                              contents: [
                              { type: 'text', text: title, weight: 'bold', size: 'lg', align: 'center', color: '#ffffff', }
                              ]
                              },
                              body: {
                              type: 'box',
                              layout: 'vertical',
                              spacing: 'md',
                              contents: [
                            {
                              type: 'box',
                              layout: 'vertical',
                              spacing: 'sm',
                                contents: [
                                    createInfoBox('รหัสพนักงาน', notifyDetails[0].employee),
                                    createInfoBox('ผู้ดูแล', notifyDetails[0].fullname),
                                    createInfoBox('ตำแหน่ง', notifyDetails[0].position),
                                    createInfoBox('โซน', location),
                                    createInfoBox('วันที่', dateTimeString),
                                  ]
                            },
                            { type: 'separator', margin: 'xl' },
                      { type: 'text', text: 'รูปภาพที่อัพโหลด', weight: 'bold', size: 'sm', color: '#000000', align: 'start', margin: 'sm' },
                      { type: 'image', url: imageUrl, size: 'xl', aspectMode: 'cover', margin: 'md'},
                      { type: 'text',  text: 'รายละเอียด', weight: 'bold', size: 'sm', color: '#000000', align: 'start', margin: 'sm', },
                      { type: 'text', text: detail, wrap: true, size: 'sm', margin: 'md',color: '#555555'},
                      { type: 'separator', margin: 'lg' },
                      {
                        type: 'text',
                        text: 'ต้องการส่งการแจ้งเตือนหรือไม่? 🔔',
                        wrap: true,
                        margin: 'lg',
                        align: 'center',
                        color: '#666666',
                      },
                    ],
                  },
                },
                quickReply: {
                  items: [
                    { type: 'action', action: { type: 'message', label: 'send', text: 'send' } },
                    { type: 'action', action: { type: 'message', label: 'cancel', text: 'cancel' } },
                  ],
                },
              };
      
              await client.replyMessage(event.replyToken, replyMessage);
              console.log('Flex Message sent successfully.');
            } else {
              // ถ้าข้อมูลยังไม่ครบ
              return client.replyMessage(event.replyToken, {
                type: 'text',
                text: 'กรุณาระบุข้อมูลเพิ่มเติม ✏️',
              });
            }
          }
        }
       
        if (addNotifyData[userId] && addNotifyData[userId].status === 'ready_to_flex') {
          const { data, fileBuffer,filename } = addNotifyData[userId]; // ดึงค่าจาก addNotifyData
          const [title, location, detail] = data; // แยกค่าที่ต้องการจาก data
          const notifyDetails = await fetchNotifyDetails(userId)
          // ตรวจสอบว่า notifyDetails มีข้อมูล
          if (notifyDetails && notifyDetails.length > 0) {
            const { employee, fullname, position, id,role_2_id } = notifyDetails[0];
            confirmSaveNotify[userId] = {
              title,
              employee,
              location,
              fullname,
              position,
              dateTime: new Date().toLocaleString('th-TH'),
              fileBuffer,
              filename,
              detail,
              id,
              role_2_id
            };
            console.log('ข้อมูลที่บันทึกใน confirmSaveNotify:', confirmSaveNotify[userId]);
          } else {
            console.log('ไม่พบข้อมูลสำหรับ userId:', userId);
          }
        }
        
        if (confirmSaveNotify[event.source.userId]) {
          console.log('confirmSaveNotify:', confirmSaveNotify[event.source.userId]);
        
          if (userMessage === 'send') {
            console.log('userMessage คือ send');
        
            const { title, employee, location, fullname, position, dateTime,fileBuffer,filename,detail,id,role_2_id} = confirmSaveNotify[event.source.userId];
            console.log('ข้อมูลที่ต้องการบันทึก:', { title, employee, location, fullname, position, dateTime,fileBuffer,filename,detail,id,role_2_id });
        
            // เรียกฟังก์ชันบันทึกข้อมูล
            await saveNotifyToDatabase({ title, employee, location, fullname, position, dateTime,fileBuffer,filename,detail,id,role_2_id});
          // ลบข้อมูลหลังจากบันทึกเสร็จ
        delete confirmSaveNotify[userId];
        await client.replyMessage(event.replyToken, {
          type: 'text',
          text: 'ส่งข้อมูลการแจ้งเตือนสำเร็จ',
        });
      } else if (userMessage === 'cancel') {
        console.log('userMessage คือ cancel');
    
        // ลบข้อมูลใน confirmSaveNotify
        delete confirmSaveNotify[userId];
        await client.replyMessage(event.replyToken, {
          type: 'text',
          text: 'ยกเลิกการส่งข้อมูลเรียบร้อยแล้ว',
        });
      } else {
        console.log('userMessage ไม่ตรงกับคำสั่งที่กำหนด:', userMessage);
      }
    } else {
      console.log('confirmSaveNotify ไม่มีข้อมูลสำหรับ userId:', userId);
    
      // ตอบกลับว่าข้อมูลไม่พบ
      await client.replyMessage(event.replyToken, {
        type: 'text',
        text: 'ไม่มีข้อมูลที่ต้องการส่งหรือยกเลิก',
      });
      }
          }

        /********************* PLAN *************************/
          // ดูข้อมูลแผนงาน
          if(userMessage === 'plan role3'){
            const userId = event.source.userId;
            runLoadingAnimation(userId, 10000);
            const planData = await fetchPlansFromDB(userId, 'plan_r3');
            const flexMessage = createPlanFlexMessage(planData, 'manager');
            return client.replyMessage(event.replyToken, flexMessage);
          }
          if(userMessage === 'plan role2'){
            const userId = event.source.userId;
            runLoadingAnimation(userId, 10000);
            const planData = await fetchPlansFromDB(userId, 'plan_r2');
            const flexMessage = createPlanFlexMessage(planData, 'technical');
            return client.replyMessage(event.replyToken, flexMessage);
          }    
          if (userMessage === 'plan role1') {
            const userId = event.source.userId;
            runLoadingAnimation(userId, 10000);
            const planData = await fetchPlansFromDB(userId, 'plan');
            const flexMessage = createPlanFlexMessage(planData, 'super');
            return client.replyMessage(event.replyToken, flexMessage);
          }
          // เพิ่มแผนงาน
          if (userMessage === 'add plan SO.Man' || userMessage === 'add plan SO.Tech' || userMessage === 'add plan SO.Sup') {
              const table = userMessage === 'add plan SO.Man' ? 'plan_r3' 
                          : userMessage === 'add plan SO.Tech' ? 'plan_r2' 
                          : userMessage === 'add plan SO.Sup' ? 'plan' 
                          : null;  
              addActivityPlan[event.source.userId] = { Table: table, data: [] };
              console.log("table in add plan: " + table);
              // ตอบกลับเป็นข้อความที่มีลิงก์ให้เปิด
              return client.replyMessage(event.replyToken, {
                      type: 'text',
                      text: 'ระบุวันที่และเวลาที่เริ่มแผนงาน',
                      quickReply: {
                      items: [
                      {
                        type: 'action',
                        action: { 
                            type: 'datetimepicker', 
                            label: 'เลือกวันที่และเวลา', 
                            data: 'startDatetime', 
                            mode: 'datetime' 
                          }
                        }
                      ]
                    }
                  });
          }
              // จัดการ postback
              if (event.type === 'postback') {
                const postbackData = event.postback.data;
    
              if (postbackData === 'startDatetime' && event.postback.params) {
                const selectedDateTime = event.postback.params.datetime;
                addActivityPlan[event.source.userId].data.push(selectedDateTime);
            
                await client.replyMessage(event.replyToken, [
                  {
                    type: 'text',
                    text: `คุณเลือกวันที่: ${selectedDateTime.split('T')[0]} และเวลา: ${selectedDateTime.split('T')[1]}`
                  },
                  {
                    type: 'text',
                    text: 'กรุณาระบุเวลาสิ้นสุดของแผนงาน',
                    quickReply: {
                        items: [
                            {
                                type: 'action',
                                action: {
                                    type: 'datetimepicker',
                                    label: 'เลือกเวลา',
                                    data: 'endTime',
                                    mode: 'time'
                                }
                            }
                        ]
                      }
                    }
                  ]);
                }
              if (postbackData === 'endTime' && event.postback.params) {
                  const selectedEndTime = event.postback.params.time;
                  addActivityPlan[event.source.userId].data.push(selectedEndTime);
            
                  await client.replyMessage(event.replyToken, [
                  {
                    type: 'text',
                    text: `คุณเลือกเวลา: ${selectedEndTime}`
                  },
                  {
                    type: 'text',
                    text: 'กรุณาระบุชื่อของกิจกรรมหรือรายละเอียดของแผนงาน เช่น\n ประชุมประจำเดือน'
                  }
                ]);
              }
            }
          // เมื่อผู้ใช้ตอบกลับข้อความกิจกรรม
          if (addActivityPlan[event.source.userId] && addActivityPlan[event.source.userId].data.length === 2) {
              addActivityPlan[event.source.userId].data.push(userMessage);
              const [startDatetime, endTime, activity] = addActivityPlan[event.source.userId].data;
    
              const createConfirmPlanFlexMessage = (plan) => {
                return {
                  type: 'flex',
                  altText: 'ข้อมูลแผนงานก่อนยืนยันการบันทึก',
                  contents: {
                    type: 'bubble',
                    body: {
                        type: 'box',
                        layout: 'vertical',
                        contents: [
                        {
                          type: 'text',
                          text: 'ข้อมูลแผนงานที่ต้องการเพิ่ม',
                          weight: 'bold',
                          size: 'lg',
                          align: 'center'
                        },
                        {
                          type: 'separator',
                          margin: 'md'
                        },
                        {
                          type: 'box',
                          layout: 'vertical',
                          margin: 'lg',
                          spacing: 'sm',
                          contents: [
                          {
                            type: 'box',
                            layout: 'baseline',
                            spacing: 'sm',
                            contents: [
                            {
                              type: 'text',
                              text: 'กิจกรรม:',
                              color: '#666666',
                              size: 'sm',
                              flex: 2
                            },
                            {
                              type: 'text',
                              text: plan.activity,
                              wrap: true,
                              color: '#666666',
                              size: 'sm',
                              flex: 3
                            }
                            ]
                          },
                          {
                            type: 'box',
                            layout: 'baseline',
                            spacing: 'sm',
                            contents: [
                            {
                              type: 'text',
                              text: 'วันที่:',
                              color: '#666666',
                              size: 'sm',
                              flex: 2
                            },
                            {
                              type: 'text',
                              text: plan.date,
                              wrap: true,
                              color: '#666666',
                              size: 'sm',
                              flex: 3
                            }
                          ]
                          },
                          {
                            type: 'box',
                            layout: 'baseline',
                            spacing: 'sm',
                            contents: [
                            {
                              type: 'text',
                              text: 'เวลาเริ่ม:',
                              color: '#666666',
                              size: 'sm',
                              flex: 2
                            },
                            {
                              type: 'text',
                              text: plan.startTime,
                              wrap: true,
                              color: '#666666',
                              size: 'sm',
                              flex: 3
                            }
                            ]
                          },
                          {
                            type: 'box',
                            layout: 'baseline',
                            spacing: 'sm',
                            contents: [
                            {
                              type: 'text',
                              text: 'เวลาสิ้นสุด:',
                              color: '#666666',
                              size: 'sm',
                              flex: 2
                            },
                            {
                              type: 'text',
                              text: plan.endTime,
                              wrap: true,
                              color: '#666666',
                              size: 'sm',
                              flex: 3
                            }
                          ]
                          }
                        ]
                      },
                      {
                        type: 'separator',
                        margin: 'lg'
                      },
                      {
                        type: 'text',
                        text: 'ต้องการยืนยันการบันทึกหรือไม่?',
                        wrap: true,
                        margin: 'lg',
                        align: 'center',
                        color: '#666666'
                      }
                    ]
                  }
                },
                  quickReply: {
                    items: [
                        {
                            type: 'action',
                            action: {
                                type: 'message',
                                label: 'บันทึก',
                                text: 'บันทึก'
                            }
                        },
                        {
                            type: 'action',
                            action: {
                                type: 'message',
                                label: 'ไม่',
                                text: 'ไม่'
                            }
                        }
                    ]
                  }
                };
              };
    
              const planDetails = {
                activity: activity,
                date: startDatetime.split('T')[0],
                startTime: startDatetime.split('T')[1],
                endTime: endTime
            };
            
              confirmSavePlan[event.source.userId] = { startDatetime, endTime, activity, nameTable: addActivityPlan[event.source.userId].Table };
              delete addActivityPlan[event.source.userId];
        
              return client.replyMessage(event.replyToken, createConfirmPlanFlexMessage(planDetails));
    
              }
          // ตรวจสอบการยืนยันการบันทึก
          if (confirmSavePlan[event.source.userId]) {
            if (userMessage === 'บันทึก') {
                const lineUserId = event.source.userId;
                const { startDatetime, endTime, activity, nameTable } = confirmSavePlan[event.source.userId];
    
            if (nameTable) {
                await savePlanToDatabase({
                    date: startDatetime.split('T')[0],
                    startTime: startDatetime.split('T')[1],
                    endTime: endTime,
                    activity: activity,
                    lineUserId: lineUserId,
                    nameTable: nameTable
                });
    
                delete confirmSavePlan[event.source.userId];
    
                // เริ่มต้นขั้นตอนการเพิ่มแผนงานใหม่
                addActivityPlan[event.source.userId] = { Table: nameTable, data: [] };
    
                return client.replyMessage(event.replyToken, {
                  type: 'text',
                  text: 'ข้อมูลแผนงานใหม่ถูกบันทึกเรียบร้อยแล้ว! ต้องการเพิ่มแผนงานอีกหรือไม่?',
                  quickReply: {
                     items: [
                    {
                      type: 'action',
                      action: { 
                          type: 'message', 
                          label: 'ใช่', 
                          text: 'ใช่'
                        }
                    },
                    {
                      type: 'action',
                      action: { 
                        type: 'message', 
                        label: 'ไม่ใช่', 
                        text: 'ไม่ใช่'
                      }
                    }
                  ]
                }
              });
            } else {
                console.error("ไม่สามารถเข้าถึง nameTable");
                return client.replyMessage(event.replyToken, { type: 'text', text: 'เกิดข้อผิดพลาดในการบันทึกข้อมูลแผนงาน โปรดลองใหม่อีกครั้ง' });
            }
            } else if (userMessage === 'ไม่') {
                delete confirmSavePlan[event.source.userId];
                return client.replyMessage(event.replyToken, { type: 'text', text: 'ยกเลิกการบันทึกข้อมูลแผนงานใหม่' });
            }
          }
    
        // หากผู้ใช้กด "ใช่" สำหรับการเพิ่มแผนงานใหม่
    if (userMessage === 'ใช่' && !confirmSavePlan[event.source.userId]) {
      return client.replyMessage(event.replyToken, {
          type: 'text',
          text: 'ระบุวันที่และเวลาที่เริ่มแผนงาน',
          quickReply: {
              items: [
                  {
                      type: 'action',
                      action: { 
                          type: 'datetimepicker', 
                          label: 'เลือกวันที่และเวลา', 
                          data: 'startDatetime', 
                          mode: 'datetime' 
                      }
                  }
              ]
          }
      });
    }else if (userMessage === 'ไม่ใช่'){
      return client.replyMessage(event.replyToken, { type: 'text', text: 'สิ้นสุดการบันทึกข้อมูลแผนงาน' });
    }
          /***************************************************/
    }  

// จัดการ postback : EXAMINE
if (event.type === 'postback') {
  const data = event.postback.data; // รับข้อมูลจากปุ่ม
  const params = new URLSearchParams(data);
  
  if (params.get('action') === 'selectZone') {
    const userId = event.source.userId;
    const selectedExamineListId = params.get('zoneId'); // ดึง zoneId จากปุ่ม
    const selectedExamineListName = params.get('zoneName');

    if (!selectedExamineListId) {
      console.error('Error: zoneId is undefined in postback data.');
      return client.replyMessage(event.replyToken, {
        type: 'text',
        text: 'ไม่พบข้อมูลโซนที่เลือก'
      });
    }

    // ตรวจสอบว่ามี userId ใน selectedZoneData หรือไม่
    if (!selectedZoneData.has(userId)) {
        selectedZoneData.set(userId, { zoneId: [], zoneName: [] });   // ถ้ายังไม่มี ให้สร้างรายการใหม่
    }

    // ดึงข้อมูลเดิมของ userId จาก selectedZoneData
    const existingData = selectedZoneData.get(userId);

    // ลบค่าที่ซ้ำกับค่าใหม่ออก
    existingData.zoneId = existingData.zoneId.filter(id => id !== selectedExamineListId);
    existingData.zoneName = existingData.zoneName.filter(name => name !== selectedExamineListName);

    // เพิ่มค่าใหม่เข้าไปในอาเรย์ (ค่าล่าสุดจะอยู่ท้ายสุด)
    existingData.zoneId.push(selectedExamineListId);
    existingData.zoneName.push(selectedExamineListName);

    // อัปเดตข้อมูลใน selectedZoneData
    selectedZoneData.set(userId, existingData);
    console.log('Updated selectedZoneData:', selectedZoneData);

   // selectedZoneData.set(userId, { zoneId: selectedExamineListId, zoneName: selectedExamineListName });

    const examineData = await fetchExamineFromDB(userId, 'examine', selectedExamineListId);
    const flexMessage = createExamineFlexMessage(examineData);
    const useEmployee = examineData.some(item => item.useEmployee === 'true'); // หากมี examine ที่ใช้ employee

    flexMessage.quickReply = {
      items: [
          {
              type: "action",
              action: {
                  type: "message",
                  label: "ข้อมูลตรวจสอบวันนี้",
                  text: "ข้อมูลตรวจสอบวันนี้"
              }
          }
      ]
  };
  
    return client.replyMessage(event.replyToken, flexMessage)
      .then(() => {
        console.log('Flex Message ส่งสำเร็จ');
      })
      .catch((err) => {
        console.error('Error ส่ง Flex Message:', err);
      });
  } 
  else if (params.get('action') === 'selectExamine') {
    const userId = event.source.userId;
    const selectedExamineId = params.get('examineId'); // ดึง examineId จากปุ่ม
    const selectedExamineName = params.get('examineName'); // ดึง examineName จากปุ่ม

    const selectedZone = selectedZoneData.get(userId);
    const zoneIdArray = selectedZone.zoneId; // ค่าที่เป็นอาเรย์
    const zoneIdString = zoneIdArray[zoneIdArray.length - 1]; // ใช้โซนล่าสุด

    if (!selectedExamineId) {
        console.error('Error: examineId is undefined in postback data.');
        return client.replyMessage(event.replyToken, {
            type: 'text',
            text: 'ไม่พบข้อมูลการตรวจสอบที่เลือก'
        });
    }

    selectedExamineData.set(userId, { examineId: selectedExamineId, examineName: selectedExamineName });
    
    try {
        const useEmployeeDB = await fetchExamineFromDB(userId, 'examine', zoneIdString); // ใช้ zoneIdString
        const examineNameData = await fetchExamineDetails(selectedExamineId);
        const examineUseEmp = await fetchExamineFromDB(userId, 'examineTrue', zoneIdString); // ใช้ zoneIdString
        const useEmployee = useEmployeeDB.some(item => 
          item.id === parseInt(selectedExamineId) && item.useEmployee === 'true'
      );

        console.log('useEmployee:', useEmployee); // true หรือ false
        const flexMessage = useEmployee
        ? createExamineUseEmployeeFlexMessage(examineUseEmp)  // ถ้า useEmployee = true
        : createExamineNameFlexMessage(examineNameData);         // ถ้า useEmployee = false
        flexMessage.quickReply = {
          items: [
              {
                  type: "action",
                  action: {
                      type: "message",
                      label: "ข้อมูลตรวจสอบวันนี้",
                      text: "ข้อมูลตรวจสอบวันนี้"
                  },
                  imageUrl: 'https://cdn.icon-icons.com/icons2/2892/PNG/512/data_icon_182835.png'
              }
          ]
      };
      
      return client.replyMessage(event.replyToken, flexMessage)
      .then(() => {
        console.log('Flex Message ส่งสำเร็จ');
      })
      .catch((err) => {
        console.error('Error ส่ง Flex Message:', err);
      });

    } catch (error) {
        console.error('Error in fetching data:', error);
        return client.replyMessage(event.replyToken, {
            type: 'text',
            text: 'เกิดข้อผิดพลาดในการดึงข้อมูล'
        });
    }
  } 
  else if (params.get('action') === 'pass' || params.get('action') === 'fail') {
    const userId = event.source.userId;

    const selectExaminenameId = params.get('examinenameId'); // id ของรายการตรวจสอบ
    const selectExaminenameName = params.get('name'); // ชื่อของรายการตรวจสอบ
    const selectExaminenameStatus = params.get('status');

    const idEmp = params.get('id'); // ID ของพนักงาน
    const nameEmp = params.get('nameEmp'); // ชื่อของพนักงาน
    const lastnameEmp = params.get('lastnameEmp'); // นามสกุลของพนักงาน

    if (!selectExaminenameId || !selectExaminenameName) {
        console.error('Error: examineNameId หรือ examineName ไม่ถูกต้องใน postback data');
        return client.replyMessage(event.replyToken, {
            type: 'text',
            text: 'ข้อมูลรายการตรวจสอบไม่สมบูรณ์ กรุณาลองอีกครั้ง'
        });
    }
    
    const selectedZone = selectedZoneData.get(userId);
    const selectedExamine = selectedExamineData.get(userId);

    if (!selectedZone || !selectedExamine) {
        return client.replyMessage(event.replyToken, {
            type: 'text',
            text: 'ไม่พบข้อมูลโซนหรือการตรวจสอบที่เลือก'
        });
    }

    // ดึงโซนล่าสุดจาก selectedZone
    const zoneId = selectedZone.zoneId[selectedZone.zoneId.length - 1]; // ค่าโซนล่าสุด
    const zoneName = selectedZone.zoneName[selectedZone.zoneName.length - 1]; // ชื่อโซนล่าสุด
    const examineId = selectedExamine.examineId;
    const examineName = selectedExamine.examineName;

    const itemId = selectExaminenameId; // ดึง ID จาก params
    const itemName = selectExaminenameName; // ดึงชื่อจาก params
    const status = params.get('action') === 'pass' ? 'pass' : 'fail';

    console.log('examineId:', examineId);
    console.log('zoneName:', zoneName);
    console.log('zone ID:', zoneId);
    console.log('itemId:', itemId);
    console.log('itemName:', itemName);

    console.log('id:', idEmp);
    console.log('name:', nameEmp);
    console.log('lastname:', lastnameEmp);

    // บันทึกข้อมูลลงใน memory (แก้ไขโค้ดส่วนนี้)
    if (!userExamineData.has(userId)) {
        userExamineData.set(userId, []);
    }

    const userData = userExamineData.get(userId);
    const existingItemIndex = userData.findIndex(
        (item) =>
            item.zoneId === zoneId &&
            item.examineId === examineId &&
            item.itemId === itemId &&
            item.idEmp === idEmp // ตรวจสอบพนักงานที่เกี่ยวข้อง
    );

    if (existingItemIndex !== -1) {
        // อัปเดตสถานะของรายการที่ซ้ำกัน (สำหรับพนักงานเดียวกัน)
        userData[existingItemIndex].status = status;
    } else {
        // เพิ่มรายการใหม่สำหรับพนักงานคนใหม่ หรือรายการที่ยังไม่มี
        userData.push({
            zoneId,
            zoneName,
            examineId,
            examineName,
            itemId,
            itemName,
            status,
            idEmp,
            nameEmp,
            lastnameEmp,
        });
    }

    userExamineData.set(userId, userData);

    // ส่งข้อความยืนยัน
    const confirmMessage = {
        type: 'text',
        text: `บันทึกข้อมูลตรวจสอบเรียบร้อย`,
        quickReply: {
            items: [
                {
                    type: "action",
                    action: {
                        type: "message",
                        label: "ดูข้อมูลตรวจสอบวันนี้",
                        text: "ข้อมูลตรวจสอบวันนี้"
                    },
                  //  imageUrl: 'https://cdn.icon-icons.com/icons2/2892/PNG/512/data_icon_182835.png'
                }
            ]
        }
    };

    return client.replyMessage(event.replyToken, confirmMessage)
        .then(() => {
            console.log('บันทึกข้อมูลใน memory สำเร็จ');
        })
        .catch((err) => {
            console.error('Error บันทึกข้อมูล:', err);
        });
  }
  else if (params.get('action') === 'confirmSave') {
  const userId = event.source.userId;
  const currentDate = getCurrentDateKey(); // เก็บวันที่ปัจจุบัน
  startLoadingAnimation(userId);
            setTimeout(() => {
              stopLoadingAnimation(userId);
          }, 5000);

  // ตรวจสอบสถานะการบันทึกของผู้ใช้ในวันนี้
  const userSavedToday = userSavedTodayData.get(userId);

  if (userSavedToday === currentDate) { // เช็คว่า userId ได้บันทึกข้อมูลในวันนี้แล้ว
      return client.replyMessage(event.replyToken, {
          type: 'text',
          text: 'คุณได้ทำการบันทึกข้อมูลการตรวจสอบแล้วในวันนี้'
      });
  }

  const userExamineRecords = userExamineData.get(userId); // ดึงข้อมูลตรวจสอบทั้งหมดของผู้ใช้

  if (!userExamineRecords || userExamineRecords.length === 0) {
      return client.replyMessage(event.replyToken, {
          type: 'text',
          text: 'ไม่พบข้อมูลการตรวจสอบที่จะบันทึก'
      });
  }

  try {

      let saveErrors = []; 
      const selectedZone = selectedZoneData.get(userId);
      const zoneIdArray = selectedZone.zoneId; // ค่าที่เป็นอาเรย์
      console.log('ZONE ARRAY BEFORE SAVE: ', zoneIdArray)

      for (const record of userExamineRecords) {
          const { zoneId, examineId, itemId, status, idEmp } = record; // ดึงข้อมูลจากแต่ละรายการ

          try {
              const result = await saveExamineResultToDB(zoneIdArray, zoneId, examineId, itemId, status, idEmp, userId);
              if (!result.success) {
                  saveErrors.push(`รายการ ${itemId}: ${result.message}`);
              }
          } catch (error) {
              console.error(`Error ส่งข้อมูลสำหรับรายการ ${itemId}:`, error);
              saveErrors.push(`รายการ ${itemId}: เกิดข้อผิดพลาด`);
          }
      }
      // ตรวจสอบว่ามีข้อผิดพลาดหรือไม่
      if (saveErrors.length > 0) {
        const errorMessage = `มีบางรายการส่งไม่สำเร็จ:\n${saveErrors.join('\n')}`;
        return client.replyMessage(event.replyToken, {
            type: 'text',
            text: errorMessage
        });
    }
    
    // บันทึกสถานะการบันทึกข้อมูลในวันที่นี้
    userSavedTodayData.set(userId, currentDate); // ตั้งสถานะว่าได้บันทึกข้อมูลแล้วในวันนี้
    
    // เพิ่ม Quick Reply สำหรับดาวน์โหลดข้อมูล
    return client.replyMessage(event.replyToken, {
        type: 'text',
        text: 'บันทึกข้อมูลสำเร็จ! ',
       /* quickReply: {
            items: [
                {
                    type: 'action',
                    action: {
                        type: 'postback',
                        label: 'ดาวน์โหลด',
                        data: 'action=download',
                        displayText: 'ดาวน์โหลดข้อมูลวันนี้'
                    },
                  //  imageUrl: 'https://freeiconshop.com/wp-content/uploads/edd/download-flat.png'
                }
            ]
        }*/
    });
    
  } catch (error) {
      console.error('Error ในการบันทึกข้อมูลทั้งหมด:', error);
      return client.replyMessage(event.replyToken, {
          type: 'text',
          text: 'เกิดข้อผิดพลาดในการส่งข้อมูล'
      });
    }
  }
  else if (params.get('action') === 'cancelSave'){
    const userId = event.source.userId;
    const currentDate = getCurrentDateKey(); // เก็บวันที่ปัจจุบัน
    startLoadingAnimation(userId);
            setTimeout(() => {
              stopLoadingAnimation(userId);
          }, 10000);
// ตรวจสอบสถานะการบันทึกของผู้ใช้ในวันนี้
const userSavedToday = userSavedTodayData.get(userId);

if (userSavedToday === currentDate) { // เช็คว่า userId ได้บันทึกข้อมูลในวันนี้แล้ว
    return client.replyMessage(event.replyToken, {
        type: 'text',
        text: 'คุณได้ทำการบันทึกข้อมูลการตรวจสอบของวันนี้แล้ว'
    });
} else {
  userExamineData.clear();
  selectedZoneData.clear();
  selectedExamineData.clear();
  console.log('ข้อมูลถูกล้างเรียบร้อย');

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: 'ล้างข้อมูลการตรวจวันนี้สำเร็จ'
      });
    }    
  }
}

 // จัดการ postback : PLAN
if (event.type === 'postback') {   
  const postbackData = event.postback.data;

  // ตัวอย่าง: ตรวจสอบ postback สำหรับการเลือกวันที่เริ่มต้น
  if (postbackData === 'startDatetime' && event.postback.params) {
      const selectedDateTime = event.postback.params.datetime;
      addActivityPlan[event.source.userId].data.push(selectedDateTime);
      
      await client.replyMessage(event.replyToken, [
          {
              type: 'text',
              text: `คุณเลือกวันที่: ${selectedDateTime.split('T')[0]} และเวลา: ${selectedDateTime.split('T')[1]}`
          },
          {
              type: 'text',
              text: 'กรุณาระบุเวลาสิ้นสุดของแผนงาน',
              quickReply: {
                  items: [
                      {
                          type: 'action',
                          action: {
                              type: 'datetimepicker',
                              label: 'เลือกเวลา',
                              data: 'endTime',
                              mode: 'time'
                          }
                      }
                  ]
              }
          }
      ]);
    }
  // ตัวอย่าง: ตรวจสอบ postback สำหรับการเลือกเวลาสิ้นสุด
  if (postbackData === 'endTime' && event.postback.params) {
      const selectedEndTime = event.postback.params.time;
      addActivityPlan[event.source.userId].data.push(selectedEndTime);
      
      await client.replyMessage(event.replyToken, [
          {
              type: 'text',
              text: `คุณเลือกเวลา: ${selectedEndTime}`
          },
          {
              type: 'text',
              text: 'กรุณาระบุชื่อของกิจกรรมหรือรายละเอียดของแผนงาน เช่น\n ประชุมประจำเดือน'
          }
      ]);
    }
  }
  const userId = event.source.userId;
  const messageId = event.message.id; // ID ของรูปภาพที่ส่งมา
// เช็คว่าเป็นข้อความและเป็นภาพ : NOTIFY
if (event.type === 'message' && event.message.type === 'image') {

  runLoadingAnimation(userId, 10000);

  if (addNotifyData[userId]) {
    try {
      if (event.message.contentProvider.type === 'line') {
        // ดาวน์โหลดและอัปโหลดรูปภาพ
        const imagePath = await downloadImage(messageId);

        // อัปโหลดรูปภาพไปที่ Imgur
        const imgurUrl = await uploadToImgur(imagePath);
        console.log('Image uploaded to Imgur:', imgurUrl);

        
        console.log('กำลังบันทึกข้อมูลภาพ, messageId:', messageId);
          // อ่านไฟล์เป็น buffer
          const fileBuffer = fs.readFileSync(imagePath);
          console.log('Image uploaded to Imgur:', fileBuffer);

        
        // บันทึก imageUrl และตั้งสถานะว่า "รอรายละเอียด"
        addNotifyData[userId].imageUrl = imgurUrl;
        addNotifyData[userId].fileBuffer = fileBuffer;
        addNotifyData[userId].filename = `${messageId}.jpg`;;
        addNotifyData[userId].status = 'awaiting_detail'; // สถานะใหม่

        // แจ้งให้ผู้ใช้พิมพ์รายละเอียด
        return client.replyMessage(event.replyToken, {
          type: 'text',
          text: 'กรุณาระบุรายละเอียดเพิ่มเติมเกี่ยวกับการแจ้งเตือน ✏️',
        });
      } else {
        console.log('Image is not stored on LINE server.');
        return client.replyMessage(event.replyToken, {
          type: 'text',
          text: 'ไม่สามารถดาวน์โหลดรูปภาพได้จาก LINE server',
        });
      }
    } catch (error) {
      console.error('Error saving image:', error);
      return client.replyMessage(event.replyToken, {
        type: 'text',
        text: 'ไม่สามารถบันทึกรูปภาพได้ กรุณาลองใหม่',
      });
    }
  } else {
    console.log(`No data found for userId: ${userId}`);
  }
  }
} catch (err) {
  console.error('Error handling event:', err);
 }
return Promise.resolve(null);
}