const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// 配置文件上传
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

// 服务静态文件
app.use(express.static('public'));

// 管理页面路由
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// API 端点
app.post('/api/news', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('没有上传图片');
        }

        const { title } = req.body;
        if (!title) {
            return res.status(400).send('标题不能为空');
        }

        const imageUrl = `/uploads/${req.file.filename}`;

        // 确保上传目录存在
        const uploadDir = path.join(__dirname, 'public/uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // 更新 index.html
        updateIndexHtml(title, imageUrl);
        res.json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('服务器错误：' + error.message);
    }
});

function updateIndexHtml(title, imageUrl) {
    const htmlTemplate = `
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fragments News</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h2 class="page-title">${title}</h2>
        <div class="logo-section">
            <h1 class="brand-name">Nike au Centre</h1>
        </div>
        <div class="image-section">
            <img src="${imageUrl}" alt="News Image">
        </div>
        <footer>
            <p><span class="designed-by">Designed by: </span>Pentagram</p>
            <p><span class="designed-by">Time: </span>2024</p>
            <p>www.yoursite.com</p>
        </footer>
    </div>
</body>
</html>`;

    fs.writeFileSync(path.join(__dirname, 'public/index.html'), htmlTemplate);
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 