const express = require('express');
const app = express();
/* import moralis */
const Moralis = require("moralis/node");
const path = require('path');

let niz =[];
/* Moralis init code */
const serverUrl = "https://shhgnlyuxwon.usemoralis.com:2053/server";
const appId = "0xY1LJ4XusEny6GmLuMgzzMbpejO98XjJTomDV9N";
const moralisSecret = "s3GvpReAyFQMN545QUNaIZ88PTqGNtMBjJBzxpdhkfdY3CzYythfiWfH6k0s7i1e";

const execute = async (res) => {
    await Moralis.start({ serverUrl, appId, moralisSecret });
  
    // Enable web3
    await Moralis.enableWeb3({
      chainId: 0x4,
      privateKey:
        "a5025df563ccf7c6441a9234f6ded62855a1112da1d0cb06f4b2ddf408f65a03",
    });
  
    const options = {
        // CAPSULE contract
        contractAddress: "0x4C9fF349246B5444dAd7440B2bF3112fCC628C59",
        // calling tokenURI function
        functionName: "getMatches",
        // contract ABI
        abi: [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"components":[{"internalType":"address","name":"better","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"matchID","type":"uint256"},{"internalType":"string","name":"betType","type":"string"},{"internalType":"uint256","name":"oddForWinning","type":"uint256"}],"indexed":false,"internalType":"struct IBetting.Bet","name":"_bet","type":"tuple"}],"name":"betPlaced","type":"event"},{"anonymous":false,"inputs":[{"components":[{"internalType":"string","name":"competition","type":"string"},{"internalType":"string","name":"teamA","type":"string"},{"internalType":"string","name":"teamB","type":"string"},{"internalType":"uint8","name":"tie","type":"uint8"},{"internalType":"uint8","name":"teamAWin","type":"uint8"},{"internalType":"uint8","name":"teamBWin","type":"uint8"},{"internalType":"string","name":"gameDay","type":"string"}],"indexed":false,"internalType":"struct IBetting.Match","name":"_match","type":"tuple"}],"name":"matchAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"_matchID","type":"uint256"}],"name":"winningsPayed","type":"event"},{"inputs":[{"internalType":"string","name":"_competition","type":"string"},{"internalType":"string","name":"_teamA","type":"string"},{"internalType":"string","name":"_teamB","type":"string"},{"internalType":"uint8","name":"_tie","type":"uint8"},{"internalType":"uint8","name":"_teamAWin","type":"uint8"},{"internalType":"uint8","name":"_teamBWin","type":"uint8"},{"internalType":"string","name":"_gameDay","type":"string"}],"name":"addMatch","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"fund","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"getMatches","outputs":[{"components":[{"internalType":"string","name":"competition","type":"string"},{"internalType":"string","name":"teamA","type":"string"},{"internalType":"string","name":"teamB","type":"string"},{"internalType":"uint8","name":"tie","type":"uint8"},{"internalType":"uint8","name":"teamAWin","type":"uint8"},{"internalType":"uint8","name":"teamBWin","type":"uint8"},{"internalType":"string","name":"gameDay","type":"string"}],"internalType":"struct IBetting.Match[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_matchID","type":"uint256"},{"internalType":"string","name":"_winningType","type":"string"}],"name":"payWinningBets","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_matchID","type":"uint256"},{"internalType":"string","name":"_betType","type":"string"},{"internalType":"uint8","name":"_oddForWinning","type":"uint8"}],"name":"placeBet","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}] ,
        // token URI of token ID 700
        params: {},
    };
    await Moralis.executeFunction(options).then((result) => {
        let i=0;
        while(result[i]!==undefined){
            niz[i]={
                matchId : i,
                competition : result[i][0],
                teamA : result[i][1],
                teamB : result[i][2],
                tie : result[i][3],
                teamAWin : result[i][4],
                teamBWin : result[i][5],
                gameDay : result[i][6]
            }
            i++;
        }
    });
    res.header("Content-Type",'application/json');
    res.send(JSON.stringify(niz, null, 4));
};
  
app.use(express.static("public"));

app.get('/api/matches',(req,res)=>{
    res.header('Access-Control-Allow-Origin','*');
    execute(res);
})
app.get('/',(req,res)=>{
    res.sendFile(path.resolve(__dirname,"index.html"));
})
app.get('/admin',(req,res)=>{
    res.sendFile(path.resolve(__dirname,"admin.html"))
})

app.listen(8080,()=>{
    console.log("Server listening on port 8080");
})
