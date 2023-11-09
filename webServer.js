//nodejs服务器
const express = require("express")
const app = express()
const fs = require("fs")
const axios = require('axios');
const { createBundleRenderer } = require("vue-server-renderer")

// 
function getSeo(req) {
    return new Promise((resolve, reject) => {
        let protocol = req.protocol
        let host = req.get('host')
        let query = req.query
        console.log('protocol:', protocol)
        console.log('host:', host)
        console.log('query:', query)
        
        let getSeoUrl = `${protocol}://${host}/interface/web/GetTitle`
        console.log('getSeo url:', getSeoUrl)

        let id = query['id'] ? query['id'] : 0
        let webid = query['store'] ? query['store'] : 0
        let pagetype = 1
        if(req.url.indexOf('cart') > -1) pagetype = 0
        else if (req.url === '/' || req.url.indexOf('/?') > -1 || req.url.indexOf('index') > -1)  pagetype = 1
        else if (req.url.indexOf('allProducts') > -1 || req.url.indexOf('category') > -1)  pagetype = 3
        else if (req.url.indexOf('contact') > -1 )  pagetype = 5
        else if (req.url.indexOf('rich') > -1 ) {
        if(query['cid'] == 0) pagetype = 3
            else if(query['cid'] == 1 || query['cid'] == 2) pagetype = 4
            else if(query['cid'] == 3) pagetype = 2
        }
        let params = `webid=${webid}&id=${id}&pagetype=${pagetype}&WebPreview=1`
        console.log('params:', params)

        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        
        axios.post(getSeoUrl, params, config).then(function (response) {
            console.log('response.data:', response.data);
            let title = response.data.data[0] ? response.data.data[0].title : null
            resolve(title)
        })
        .catch(function (error) {
            console.log(error);
        });
    })
}

// 中间件处理静态文件请求
app.use(express.static("./dist/client", {index: false})) // ???

// 
app.enable('trust proxy')

//
app.get("*", async (req, res) => {
    try {
        console.log('====================================================================================================')
        console.log('req url:', req.url)

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