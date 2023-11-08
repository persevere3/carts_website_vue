//nodejs服务器
const express = require("express")
const app = express()

const fs = require("fs")
let https = require("https")
 
const { createBundleRenderer } = require("vue-server-renderer")

//
function getSeo(req) {
    return new Promise((resolve, reject) => {
        // let url = `${req.protocol}://${req.get('host')}/interface/web/getStore`
        // console.log(url)
	    https.get('https://majoyreesa.com/interface/web/getStore', res => {
            res.setEncoding("utf8")
            let body = ''
        
            //接收資料
            res.on("data", data => {
                body += data;
            });
            //接收完畢
            res.on("end", () => {
                body = JSON.parse(body)
                resolve(body.data[0].Name)
            });
        });
    })
}

// 中间件处理静态文件请求
	app.use(express.static("./dist/client", {index: false})) // ???

//
app.get("*", async (req, res) => {
    try {
        console.log('====================================================================================================')
        console.log(req.url)

        let title = await getSeo(req)

        // 
        const serverBundle = require("./dist/server/vue-ssr-server-bundle.json") // ???
        const clientManifest = require("./dist/client/vue-ssr-client-manifest.json") // ???
        const renderer = createBundleRenderer(serverBundle, {
            runInNewContext: false,
            template: fs.readFileSync("./dist/client/index.temp.html", "utf-8"), // ???
            clientManifest
        })

        const context = {
            title
        }
        const ssrStream = await renderer.renderToStream(context)
        const buffers = []
        ssrStream.on("data", (data) => {
            buffers.push(data)
        })
        ssrStream.on("end", () => {
            res.end(Buffer.concat(buffers))
        })
    } catch {
        res.status(500).send("服务器内部错误！")
    }
})
 
app.listen(process.env.PORT, () => {
    console.log("服务器渲染成功！")
})