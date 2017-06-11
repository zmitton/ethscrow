

var balance;

function setStatus(message) {
  var status = document.getElementById("status");
  status.innerHTML = message;
};

function refreshBalances() {
  var contract = escrow.deployed();
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

function holdCoin() {
  var contract = escrow.deployed();
  var amount = Math.floor(document.getElementById("amount").value * 1000000000000000000);
  var receiver = document.getElementById("receiver").value;
  var signer_1 = document.getElementById("signer_1").value;

  setStatus("Initiating transaction... (please wait)");

  contract.holdCoin(receiver, signer_1, {from: web3.eth.accounts[0], value: amount, gas: 1000000}).then(function(response) {
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

function signRelease() {
  var contract = escrow.deployed();
  var holdingNumber = Number(document.getElementById("holdingNumber").value);

  setStatus("Initiating transaction... (please wait)");

  contract.signRelease(holdingNumber, {from: web3.eth.accounts[0], gas: 1000000 }).then(function(response) {
    console.log(response);

    setStatus("Transaction complete!");
    refreshBalances();
  }).catch(function(e) {
    console.log(e);
    setStatus("Error sending coin; see log.");
  });
};

window.onload = function() {
  web3.eth.getAccounts(function(err, accs) {
    if (err != null) {
      alert("There was an error fetching your accounts.");
      return;
    }

    if (accs.length == 0) {
      alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
      return;
    }

    refreshBalances();
  });
}


 // Added by Truffle bootstrap.                                

// Supports Mist, and other wallets that provide 'web3'.      

if (typeof web3 !== 'undefined') {                            

  // Use the Mist/wallet provider.                            

  window.web3 = new Web3(web3.currentProvider);               

} else {                                                      

  // Use the provider from the config.                        

  window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545')); 

}                                                             

                                                              
