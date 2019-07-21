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

router.get('/test', async ctx => {
    try {
        // let balance =  await web3.eth.getBalance('0x85109F11A7E1385ee826FbF5dA97bB97dba0D76f')  
        // ctx.body = web3.utils.fromWei(balance, 'ether')
        // ctx.body = await web3.eth.getTransactionCount("0x85109F11A7E1385ee826FbF5dA97bB97dba0D76f")
        await getTransactionsByAccount('0x1BEbF732463cBEca54f6aFac1cE8bbe2aD124be1')
    } catch (er) {
        console.log(er);       
    }
})

app.use(router.routes())
app.listen(port, () => {
    console.log(`listening on port ${port} ...`)
    console.log(chalk.yellow(`http://localhost:${port}`))
})
async function getTransactionsByAccount(myaccount, startBlockNumber, endBlockNumber) {
    let blockNumber = await web3.eth.getBlockNumber()
    if (endBlockNumber == null) {
      endBlockNumber = blockNumber;
      console.log("Using endBlockNumber: " + endBlockNumber);
    }
    if (startBlockNumber == null) {
      startBlockNumber = blockNumber - 5000;
      console.log("Using startBlockNumber: " + startBlockNumber);
    }
    console.log("Searching for transactions to/from account \"" + myaccount + "\" within blocks "  + startBlockNumber + " and " + endBlockNumber);
  
    for (var i = startBlockNumber; i <= endBlockNumber; i++) {
        console.log('i ====>', i);
        
      var block = await web3.eth.getBlock(i, true);
      if (block != null && block.transactions != null) {
        block.transactions.forEach( function(e) {
          if (myaccount == "*" || myaccount == e.from || myaccount == e.to) {
            console.log("  tx hash          : " + e.hash + "\n"
              + "   nonce           : " + e.nonce + "\n"
              + "   blockHash       : " + e.blockHash + "\n"
              + "   blockNumber     : " + e.blockNumber + "\n"
              + "   transactionIndex: " + e.transactionIndex + "\n"
              + "   from            : " + e.from + "\n" 
              + "   to              : " + e.to + "\n"
              + "   value           : " + e.value + "\n"
              + "   time            : " + block.timestamp + " " + new Date(block.timestamp * 1000).toGMTString() + "\n"
              + "   gasPrice        : " + e.gasPrice + "\n"
              + "   gas             : " + e.gas + "\n"
              + "   input           : " + e.input);
          }
        })
      }
    }
  }