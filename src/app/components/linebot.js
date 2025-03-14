import express from 'express';
import next from 'next';
import path from 'path';
import botRouter from './src/app/api/bot/route'; // เส้นทางไปยังไฟล์ route.js ของคุณ

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();

    server.use(express.json());

    // ใช้ express.json() สำหรับ parse JSON body
    server.use(express.json());

    // เชื่อมต่อ router ของ bot ก่อนการเชื่อมต่อกับ Next.js
    server.use('/api/bot', botRouter);
    server.use('/download', express.static(path.join(__dirname,'download')));


    // เส้นทางอื่นๆ ให้ Next.js จัดการ
    server.all('*', (req, res) => {
        return handle(req, res);
    });

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, (err) => {
        if (err) throw err;
        console.log(`>Ready on http://localhost:${PORT}`);
    });
});