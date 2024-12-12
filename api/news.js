module.exports = async (req, res) => {
    // 设置 CORS 头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // 处理 OPTIONS 请求
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 只允许 POST 请求
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // 简单返回成功响应
        res.status(200).json({ 
            success: true,
            message: '请求已收到'
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ 
            error: '服务器错误',
            message: error.message
        });
    }
}; 