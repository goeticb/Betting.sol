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

let matchIdCounter=0;
const addressP=document.getElementById("address");
const balanceP=document.getElementById("balance");
const logInBtn=document.getElementById("loginBtn");
logInBtn.addEventListener('click',async()=>{
    const web3 = await getWeb3();
    const walletAddress =await web3.eth.requestAccounts();
    logInBtn.style.display="none";
    console.log("ovde");
    console.log(walletAddress);
    window.walletAddress=walletAddress;
    addressP.innerText="You are logged in as: "+ walletAddress;
    const wei= await web3.eth.getBalance(walletAddress[0]);
    balanceP.innerText="Your balance is: "+wei/10**18+" ether";
    console.log(walletAddress);
})

const provider= new ethers.providers.Web3Provider(web3.currentProvider)
const contract= new ethers.Contract(CONTRACT_ADDRESS, ABI, provider.getSigner())

const matchesEl=document.getElementById("matchesEl")
fetch('http://localhost:8080/api/matches',{
    mode : "cors"
})           //api for the get request
.then(response => response.json())
.then(data => {
    let i=0;
    while(data[i]!=undefined){
        let main = document.createElement('div');
        main.className="col-lg-4";
        let match = document.createElement('div');
        match.className="container match text-center"
        main.appendChild(match);
        let h4 = document.createElement('h4');
        h4.id="gameDay"
        h4.innerHTML=data[i].competition+"<br>"+data[i].gameDay;
        match.appendChild(h4);
        let p = document.createElement('p');
        p.id="rivals"
        p.innerHTML="<b>"+data[i].teamA +"-"+data[i].teamB +"</b>";
        match.appendChild(p);
        let btn1 = document.createElement('button');
        btn1.id=data[i].matchId;
        btn1.className="button btn betBtn";
        btn1.innerHTML="1("+data[i].teamAWin+")";
        btn1.addEventListener('click', async ()=>{
            const weiValue = document.getElementById(btn1.id+"amount").value*10**18;
            const odds=document.getElementById(btn1.id+"odds").value;
            console.log(btn1.id+" "+weiValue.toString());
            await contract.placeBet(btn1.id,"1",odds,{value:weiValue.toString()}).catch((data)=>{
                console.log(data);
                createAndShowModal('Error',data.error.message);
            });
        })
        match.appendChild(btn1);
        let btn2 = document.createElement('button');
        btn2.id=data[i].matchId;
        btn2.className="button btn betBtn";
        btn2.innerHTML="x("+data[i].tie+")";
        btn2.addEventListener('click', async ()=>{
            const weiValue = document.getElementById(btn2.id+"amount").value*10**18;
            const odds=document.getElementById(btn1.id+"odds").value;
            await contract.placeBet(btn1.id,"x",odds,{value:weiValue.toString()}).catch((data)=>{
                console.log(data);
                createAndShowModal('Error',data.error.message);
             });
        })
        
        match.appendChild(btn2);
        let btn3 = document.createElement('button');
        btn3.id=data[i].matchId;
        btn3.className="button btn betBtn";
        btn3.innerHTML="2("+data[i].teamBWin+")";
        btn3.addEventListener('click', async ()=>{
            const weiValue = document.getElementById(btn3.id+"amount").value*10**18;
            const odds=document.getElementById(btn1.id+"odds").value;
            await contract.placeBet(btn1.id,"2",odds,{value:weiValue.toString()}).catch((data)=>{
                createAndShowModal('Error',data.error.message);
            });
        })
        match.appendChild(btn3);
        let br1= document.createElement('br');
        match.appendChild(br1);
        let br2= document.createElement('br');
        match.appendChild(br2);
        let input1= document.createElement('input');
        input1.type="number";
        input1.placeholder="Betting amount (eth)";
        input1.id=data[i].matchId+"amount";
        let input2= document.createElement('input');
        input2.id=data[i].matchId+"odds";
        input2.type="number";
        input2.placeholder="Your odds";
        match.appendChild(input1);
        match.appendChild(input2);
        matchesEl.append(main);
        i++;
    }
    matchIdCounter=i;




    
});

window.ethereum.on('accountsChanged', async ()=> {
    logInBtn.style.display="none";
    const web3 = await getWeb3();
    const walletAddress =await web3.eth.requestAccounts();
    addressP.innerText="You are logged in as: "+ walletAddress;
    const wei= await web3.eth.getBalance(walletAddress[0]);
    balanceP.innerText="Your balance is: "+wei/10**18+" ether";    
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
                        <p>${text}</p>
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

contract.on("matchAdded", (addedMatch) => {
    let main = document.createElement('div');
    main.className="col-lg-4";
    let match = document.createElement('div');
    match.className="container match text-center"
    main.appendChild(match);
    let h4 = document.createElement('h4');
    h4.id="gameDay"
    h4.innerHTML=addedMatch.competition+"<br>"+addedMatch.gameDay;
    match.appendChild(h4);
    let p = document.createElement('p');
    p.id="rivals"
    p.innerHTML="<b>"+addedMatch.teamA +"-"+addedMatch.teamB +"</b>";
    match.appendChild(p);
    let btn1 = document.createElement('button');
    btn1.id=matchIdCounter;
    console.log("OVDEEEEEEEEEE");
    console.log(addedMatch);
    console.log(addedMatch.matchId);
    btn1.className="button btn betBtn";
    btn1.innerHTML="1("+addedMatch.teamAWin+")";
    btn1.addEventListener('click', async ()=>{
        const weiValue = document.getElementById(btn1.id+"amount").value*10**18;
        const odds=document.getElementById(btn1.id+"odds").value;
        await contract.placeBet(btn1.id,"1",odds,{value:weiValue.toString()}).catch((data)=>{
            createAndShowModal('Error',data.error.message);
        });
    })
    match.appendChild(btn1);
    let btn2 = document.createElement('button');
    btn2.id=matchIdCounter;
    btn2.className="button btn betBtn";
    btn2.innerHTML="x("+addedMatch.tie+")";
    btn2.addEventListener('click', async ()=>{
        const weiValue = document.getElementById(btn2.id+"amount").value*10**18;
        const odds=document.getElementById(btn1.id+"odds").value;
        await contract.placeBet(btn1.id,"x",odds,{value:weiValue.toString()}).catch((data)=>{
            createAndShowModal('Error',data.error.message);
        });
    })
    match.appendChild(btn2);
    let btn3 = document.createElement('button');
    btn3.id=matchIdCounter;
    btn3.className="button btn betBtn";
    btn3.innerHTML="2("+addedMatch.teamBWin+")";
    btn3.addEventListener('click', async ()=>{
        const weiValue = document.getElementById(btn3.id+"amount").value*10**18;
        const odds=document.getElementById(btn1.id+"odds").value;
        await contract.placeBet(btn1.id,"2",odds,{value:weiValue.toString()}).catch((data)=>{
            createAndShowModal('Error',data.error.message);
        });
    })
    match.appendChild(btn3);
    let br1= document.createElement('br');
    match.appendChild(br1);
    let br2= document.createElement('br');
    match.appendChild(br2);
    let input1= document.createElement('input');
    input1.type="number";
    input1.placeholder="Betting amount (eth)";
    input1.id=matchIdCounter+"amount";
    let input2= document.createElement('input');
    input2.id=matchIdCounter+"odds";
    input2.type="number";
    input2.placeholder="Your odds";
    match.appendChild(input1);
    match.appendChild(input2);
    matchesEl.append(main);
    matchIdCounter++;
});
