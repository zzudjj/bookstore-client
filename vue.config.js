module.exports = {
    devServer: {
        host: '0.0.0.0',
        port: 8081,
        disableHostCheck: true, // 允许外部访问，解决ngrok等内网穿透工具的Host header问题
        // 跨域代理
        proxy: {
            '/api': {
                //target: 'http://47.100.236.223:1211/',
                target: 'http://localhost:8080/',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            },
        }
    },
    // 基本路径
    publicPath: './',
}
