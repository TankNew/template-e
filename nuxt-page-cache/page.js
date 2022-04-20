const LRU = require('lru-cache')
export const cachePage = new LRU({
  max: 100, // 缓存队列长度 最大缓存数量
  maxAge: 1000 * 60 * 20 // 缓存时间 单位：毫秒
})
export default function(req, res, next) {
    const url = req._parsedOriginalUrl
    const pathname = url.pathname
    if (typeof (pathname) === 'string') {
        const arrUrl = pathname.split('/')
        if (arrUrl.length > 0 && arrUrl[arrUrl.length - 1] !== 'null' && arrUrl[arrUrl.length - 1] !== 'undefined') {
            const existsHtml = cachePage.get(pathname)
            if (existsHtml) {
                console.log(url.href, '读取缓存')
                res.setHeader('Content-Type', ' text/html; charset=utf-8')
                return res.end(existsHtml.html, 'utf-8')
            } else {
                res.original_end = res.end
                res.end = function(data) {
                    if (res.statusCode === 200) {
                        console.log(url.href, '写入缓存')
                        // 设置缓存
                        cachePage.set(pathname, { html: data })
                    }
                    res.original_end(data, 'utf-8')
                }
            }
        }
    }
    next()
}
