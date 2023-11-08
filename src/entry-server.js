import createApp from "./main"
 
//context就是地址
export default context => {   
  return new Promise((resolve, reject) => {
    const { app } = createApp()
    resolve(app)
  })
}