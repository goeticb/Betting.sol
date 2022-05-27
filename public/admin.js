const ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"components":[{"internalType":"address","name":"better","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"matchID","type":"uint256"},{"internalType":"string","name":"betType","type":"string"},{"internalType":"uint256","name":"oddForWinning","type":"uint256"}],"indexed":false,"internalType":"struct IBetting.Bet","name":"_bet","type":"tuple"}],"name":"betPlaced","type":"event"},{"anonymous":false,"inputs":[{"components":[{"internalType":"string","name":"competition","type":"string"},{"internalType":"string","name":"teamA","type":"string"},{"internalType":"string","name":"teamB","type":"string"},{"internalType":"uint8","name":"tie","type":"uint8"},{"internalType":"uint8","name":"teamAWin","type":"uint8"},{"internalType":"uint8","name":"teamBWin","type":"uint8"},{"internalType":"string","name":"gameDay","type":"string"}],"indexed":false,"internalType":"struct IBetting.Match","name":"_match","type":"tuple"}],"name":"matchAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"_matchID","type":"uint256"}],"name":"winningsPayed","type":"event"},{"inputs":[{"internalType":"string","name":"_competition","type":"string"},{"internalType":"string","name":"_teamA","type":"string"},{"internalType":"string","name":"_teamB","type":"string"},{"internalType":"uint8","name":"_tie","type":"uint8"},{"internalType":"uint8","name":"_teamAWin","type":"uint8"},{"internalType":"uint8","name":"_teamBWin","type":"uint8"},{"internalType":"string","name":"_gameDay","type":"string"}],"name":"addMatch","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"fund","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"getMatches","outputs":[{"components":[{"internalType":"string","name":"competition","type":"string"},{"internalType":"string","name":"teamA","type":"string"},{"internalType":"string","name":"teamB","type":"string"},{"internalType":"uint8","name":"tie","type":"uint8"},{"internalType":"uint8","name":"teamAWin","type":"uint8"},{"internalType":"uint8","name":"teamBWin","type":"uint8"},{"internalType":"string","name":"gameDay","type":"string"}],"internalType":"struct IBetting.Match[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_matchID","type":"uint256"},{"internalType":"string","name":"_winningType","type":"string"}],"name":"payWinningBets","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_matchID","type":"uint256"},{"internalType":"string","name":"_betType","type":"string"},{"internalType":"uint8","name":"_oddForWinning","type":"uint8"}],"name":"placeBet","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}]
const CONTRACT_ADDRESS = '0x4C9fF349246B5444dAd7440B2bF3112fCC628C59';
const getWeb3 = async()=>{
    return new Promise(async(resolve,reject)=>{
        const web3 = new Web3(window.ethereum);
        window.web3 = web3;
        try {
            await window.ethereum.request({method:"eth_requestAccounts"});
            resolve (web3);
        } catch (error) {
            reject(error);
        }
    })


}
const logInBtn=document.getElementById("loginBtn");
const addressP=document.getElementById("address");
logInBtn.addEventListener('click',async()=>{
    //ovo treba gore test
    const web3 = await getWeb3();
    const walletAddress =await web3.eth.requestAccounts();
    logInBtn.style.display="none";
    window.walletAddress=walletAddress;
    addressP.innerText="You are logged in as: "+ walletAddress;
    console.log(walletAddress);
})

const provider= new ethers.providers.Web3Provider(web3.currentProvider);
const contract= new ethers.Contract(CONTRACT_ADDRESS, ABI, provider.getSigner());


const addMatchBtn = document.getElementById('addMatchBtn');
addMatchBtn.addEventListener('click',()=>{
    const competition = document.getElementById('competitionEl').value;
    const teamA = document.getElementById('teamAEl').value;
    const teamB = document.getElementById('teamBEl').value;
    const tie = document.getElementById('tieEl').value;
    const teamBWin = document.getElementById('teamBWinEl').value;
    const teamAWin = document.getElementById('teamAWinEl').value;
    const gameDay = document.getElementById('gameDayEl').value;
    contract.addMatch(competition,teamA,teamB,tie,teamAWin,teamBWin,gameDay).catch((data)=>{
        createAndShowModal('Error',data.error.message);
    });
})

const payWinningBetsBtn = document.getElementById('payWinningBetsBtn');
payWinningBetsBtn.addEventListener('click',()=>{
    // payWinningBets(uint _matchID, string memory _winningType)
    const matchID = document.getElementById('matchIDEl').value;
    const winningType = document.getElementById('winningTypeEl').value;
    console.log(matchID+" "+winningType);
    contract.payWinningBets(matchID,winningType).catch((data)=>{
        createAndShowModal('Error',data.error.message);
    });

})
const fundBtn = document.getElementById('fundBtn');
fundBtn.addEventListener('click',()=>{
    const amount = document.getElementById('fundETH').value;
    contract.fund({value:(amount*10**18).toString()}).catch((data)=>{
        createAndShowModal('Error',data.error.message);
    });
})
const widthdrawBtn = document.getElementById('widthdrawBtn');
widthdrawBtn.addEventListener('click',()=>{
    const amount = document.getElementById('widthdrawETH').value;
    contract.withdraw((amount*10**18).toString()).catch((data)=>{
        createAndShowModal('Error',data.error.message);
    });
})


function createAndShowModal(title,text){
    let modalWrap =null;
    const showModal = ()=> {
        if(modalWrap !== null){
            modalWrap.remove();
        }
        modalWrap=document.createElement('div');
        modalWrap.innerHTML=`
        <div class="modal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p id="modal-text">${text}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
        `;
        document.body.append(modalWrap);
        let modal = new bootstrap.Modal(modalWrap.querySelector('.modal'));
        modal.show();
    }
    showModal();
}

window.ethereum.on('accountsChanged', async ()=> {
    logInBtn.style.display="none";
    const web3 = await getWeb3();
    const walletAddress =await web3.eth.requestAccounts();
    addressP.innerText="You are logged in as: "+ walletAddress;    
})

