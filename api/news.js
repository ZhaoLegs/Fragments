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
        console.log('Request received:', {
            method: req.method,
            headers: req.headers,
            body: req.body
        });

        // 检查请求体
        if (!req.body) {
            throw new Error('No request body');
        }

        // 返回成功响应
        res.status(200).json({ 
            success: true,
            message: '请求已收到',
            receivedData: {
                title: req.body.title,
                hasImage: !!req.body.image
            }
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ 
            error: '服务器错误',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}; 