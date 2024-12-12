const getRawBody = require('raw-body');
const formidable = require('formidable');

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
        // 使用 formidable 解析 multipart/form-data
        const form = new formidable.IncomingForm();
        
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Form parsing error:', err);
                return res.status(500).json({ 
                    error: '表单解析错误',
                    message: err.message 
                });
            }

            console.log('Received fields:', fields);
            console.log('Received files:', files);

            // 检查必要字段
            if (!fields.title) {
                return res.status(400).json({ error: '标题不能为空' });
            }

            // 返回成功响应
            res.status(200).json({ 
                success: true,
                message: '请求已收到',
                data: {
                    title: fields.title,
                    hasImage: !!files.image
                }
            });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ 
            error: '服务器错误',
            message: error.message
        });
    }
}; 