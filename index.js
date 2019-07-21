import 'dotenv/config'
import chalk from 'chalk'
import Web3 from 'web3'
import Koa from 'koa'
import Router from 'koa-router'
const web3 = new Web3(new Web3.providers.WebsocketProvider(`wss://kovan.infura.io/ws/v3/${process.env.INFURA_SECRET}`));  // kovan
const app = new Koa();
const router = new Router();
const port = process.env.PORT || 3000

router.get('/', ctx => {
    ctx.body = 'nodejs'
})
router.get('/blockNumber',async ctx=> {
    try{
        let data = {
            blockNumber: await web3.eth.getBlockNumber(),
            networkType: await web3.eth.net.getNetworkType()
        }
        ctx.body= data
    } catch (er){
        console.log(er)
    }
    
})

app.use(router.routes())
app.listen(port, () => {
    console.log(`listening on port ${port} ...`)
    console.log(chalk.yellow(`http://localhost:${port}`))
})