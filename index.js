import 'dotenv/config'
import chalk from 'chalk'
import Web3 from 'web3'
import Koa from 'koa'
import Router from 'koa-router'
import cors from 'koa2-cors'
const web3 = new Web3(new Web3.providers.WebsocketProvider(`wss://kovan.infura.io/ws/v3/${process.env.INFURA_SECRET}`));  // kovan
const app = new Koa();
const router = new Router();
const port = process.env.PORT || 3001

router.get('/', ctx => {
    ctx.body = 'nodejs'
})
router.get('/ethBlock',async ctx=> {
    try{
        ctx.body= {
            blockNumber: await web3.eth.getBlockNumber(),
            networkType: await web3.eth.net.getNetworkType()
        }
    } catch (err){
        console.log(err)
    }   
})
router.get('/balance/:myAddress',async ctx=> {
    try{
        let balance =  await web3.eth.getBalance(ctx.params.myAddress)
        ctx.body = web3.utils.fromWei(balance, 'ether')
    } catch (err){
        console.log(err)
    }   
})
router.get('/transactionsHistory/:myAddress', async ctx => {
    try {
        ctx.body = await getTransactionsByAccount(ctx.params.myAddress)
    } catch (er) {
        console.log(er);       
    }
})
app.use(cors())
app.use(router.routes())
app.listen(port, () => {
    console.log(`listening on port ${port} ...`)
    console.log(chalk.yellow(process.env.HOST ||`http://localhost:${port}`))
})

const getTransactionsByAccount = async (myaccount) => {
    let endBlockNumber = await web3.eth.getBlockNumber()
    let startBlockNumber = endBlockNumber - 1000;
    let result = await Promise.all(Array.from({length: endBlockNumber - (startBlockNumber - 1)}, (_, k) => startBlockNumber + k).map(async value => {
        var { transactions, timestamp, difficulty } =  await web3.eth.getBlock(value, true);
        if (transactions != null) {
            return transactions
            .filter( e => myaccount == "*" || myaccount == e.from || myaccount == e.to)
            .map(element => {
                return {
                    ...element,
                    gasPrice: web3.utils.fromWei(element.gasPrice, 'ether'),
                    timestamp,
                    difficulty}
            })
        }
    }))
    // remove empty array and Flattening nested arrays
    return result.filter(String).flat()
}