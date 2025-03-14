import db from '../../../lib/db';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// API Handler
export async function POST(req) {
    try {
        const body = await req.json();
        const { steps, action, storedId, file } = body;
        console.log("kdkkk",action);

        if (action === 'analysis') {
            if (!steps || steps.length === 0) {
                return NextResponse.json({ success: false, message: "No steps provided." });
            }

            const analysisInput = steps
                .map((step, index) => `ขั้นตอนที่ ${index + 1}: ${step}`)
                .join("\n");

            console.log("Analysis Input for AI:", analysisInput);

            const prompt = `โปรดวิเคราะห์ข้อมูลขั้นตอนต่อไปนี้ และให้คำแนะนำเกี่ยวกับลักษณะอันตรายที่อาจเกิดขึ้นและการป้องกันมาขั้นตอนละ 3 ข้อ
                ไม่เกิน 100 คำต่อขั้นตอนโดยมีโครงสร้างดังนี้:
                ขั้นตอนที่ X: [รายละเอียดขั้นตอน]
                อันตราย:
                1. [อันตรายข้อ 1]
                2. [อันตรายข้อ 2]
                3. [อันตรายข้อ 3]
                การป้องกัน:
                1. [การป้องกันข้อ 1]
                2. [การป้องกันข้อ 2]
                3. [การป้องกันข้อ 3]

                ${analysisInput}`;

            const aiResponse = await model.generateContent(prompt);
            const aiAnalysis = aiResponse.response.text();
            console.log("AI Analysis Result:", aiAnalysis);

            const analysisResults = aiAnalysis.split("\n\n").map((result, index) => {
                const hazardMatch = result.match(/อันตราย:\s*([\s\S]*?)(?=\nการป้องกัน|$)/);
                const preventionMatch = result.match(/การป้องกัน:\s*((?:.|\n)+)$/);

                const hazard = hazardMatch ? hazardMatch[1].trim() : "ไม่พบข้อมูลอันตราย";
                const prevention = preventionMatch ? preventionMatch[1].trim() : "ไม่พบข้อมูลการป้องกัน";

                return {
                    hazard: hazard.split("\n").slice(0, 3).join("\n"),
                    prevention: prevention.split("\n").slice(0, 3).join("\n"),
                };
            });

            const hazards = analysisResults
                .map(result => result.hazard)
                .filter(hazard => hazard !== "ไม่พบข้อมูลอันตราย");

            const preventions = analysisResults
                .map(result => result.prevention)
                .filter(prevention => prevention !== "ไม่พบข้อมูลการป้องกัน");

            return NextResponse.json({
                success: true,
                hazards,
                preventions,
            });
        }

        if (action === 'aveFileToDatabaseData') {
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
                const fileName = "แบบฟอร์มการวิเคราะห์งานเพื่อความปลอดภัย";
                const queryInsert = `INSERT INTO documents (document_name, creator_name, created_at, file_url, admin_id) VALUES (?, ?, ?, ?, ?)`;
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
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
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