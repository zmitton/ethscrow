

// var balance;

// function setStatus(message) {
//   var status = document.getElementById("status");
//   status.innerHTML = message;
// };

function refreshBalances() {
  var contract = ethscrow.deployed();
  var balanceTable = document.getElementById('balances');
  balanceTable.innerHTML = "";
  for (var i = 0; i < web3.eth.accounts.length ; i++) {
    var value = web3.eth.getBalance(web3.eth.accounts[i])/(web3.toWei(1, "ether"));
    var row =  document.createElement("tr");
    var isCoinbase =  document.createElement("td");
    var accountData =  document.createElement("td");
    var balanceData =  document.createElement("td");
    accountData.innerHTML = web3.eth.accounts[i];
    balanceData.innerHTML = Math.round(value.valueOf()*1000)/1000 + " ETH";
    isCoinbase.innerHTML = i == 0 ? "ACTIVE COINBASE" : "";
    row.appendChild(isCoinbase);
    row.appendChild(accountData);
    row.appendChild(balanceData);
    balanceTable.appendChild(row);
  }
};

function holdEth() {
  var amount = Math.floor(document.getElementById("amount").value * 1000000000000000000);
  var receiver = document.getElementById("receiver").value;
  var owner1 = document.getElementById("owner1").value;
  var owner2 = document.getElementById("owner2").value;

  setStatus("Initiating transaction... (please wait)");

  ethscrow.holdEth(receiver, owner1, owner2, {from: , value: amount, gas: 1000000}).then(function(response) {
    console.log(response);

    setStatus("Transaction complete!");
    refreshBalances();
  }).catch(function(e) {
    console.log(e);
    setStatus("Error; See Log");
    if(web3.eth.accounts[0] != accounts[0]){
       setStatus("Make sure account " +accounts[0]+ " is unlocked in wallet")
    }
  });
};

// function signRelease() {
//   var contract = ethscrow.deployed();
//   var holdingNumber = Number(document.getElementById("holdingNumber").value);

//   setStatus("Initiating transaction... (please wait)");

//   contract.signRelease(holdingNumber, {from: web3.eth.accounts[0], gas: 1000000 }).then(function(response) {
//     console.log(response);

//     setStatus("Transaction complete!");
//     refreshBalances();
//   }).catch(function(e) {
//     console.log(e);
//     setStatus("Error sending coin; see log.");
//   });
// };



window.addEventListener('load', function(){
  if(typeof web3 === 'undefined'){
    web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io'));
    alert("Please install a wallet (like Metamask) to interact with the DAPP");
  }else{

    var ethscrowAddress = '0x9c95A3751aB9b71E29B4Dc715c15306067C405e7';
    abi = [{"constant":true,"inputs":[{"name":"ID","type":"uint256"},{"name":"recipient","type":"address"}],"name":"releasable","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"ID","type":"uint256"},{"name":"recipient","type":"address"}],"name":"signRelease","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"numHoldings","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"holdings","outputs":[{"name":"amount","type":"uint256"},{"name":"owner1","type":"address"},{"name":"owner2","type":"address"},{"name":"owner1Sig","type":"address"},{"name":"owner2Sig","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"owner1","type":"address"},{"name":"owner2","type":"address"}],"name":"holdEth","outputs":[],"payable":true,"type":"function"}];
    ethscrow = web3.eth.contract(abi).at(ethscrowAddress);
    // setTimeout(getNumHoldings, 500); //why do I need this timeout? no one knows :(
    getHoldingData();

    web3.version.getNetwork(function(e,r){ // rinkeby is "4"
      if(r == 1){
        console.log("MAINNET");
      }else{
        // alert("Please Connect Metamask to Ethereum Main Net");
      }
    })
  }
})


getHoldingData = function(){
  getNumHoldings();
}
getNumHoldings = function(){
  ethscrow.numHoldings.call(function(e,num){
    if(num){
      console.log('NUM: ', num.toNumber());
      // numHoldings = num.toNumber();
      getHoldings(num.toNumber());
    }else{
      console.log(e)
    }
  })
}
getHoldings = function(numHoldings){
  for (var i = 1; i <= numHoldings; i++) {
    getHolding(i);
  }
}
getHolding = function(ID){
  ethscrow.holdings.call(ID, function(e,holding){
    if(holding){
      console.log('HOLDING: ', holding);
      renderHolding(ID, holding);
    }else{
      console.log(e)
    }
  })
}
renderHolding = function(ID, holding){
  if(document.getElementById('holding'+ID)){
    var tr = document.getElementById('holding'+ID)
  }else{
    var holdingTable = document.getElementById('holdingTable');
    var tr = document.createElement("tr");
    tr.id = holding+ID;
    holdingTable.appendChild(tr);
  }
  tr.innerHTML = '<td>'+ holding[0] +'</td><td>'+ holding[1] +'</td><td>'+ holding[2] +'</td><td>'+ holding[3] +'</td><td>'+ holding[4] +'</td>';
}


