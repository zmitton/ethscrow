pragma solidity ^0.4.10;
contract Ethscrow {
  mapping (uint => Holding) public holdings;
  uint public numHoldings;

  struct Holding {
    uint amount;
    address owner1;
    address owner2;
    address owner1Sig;
    address owner2Sig;
  }

  function holdEth(address owner1, address owner2) payable{
    numHoldings++;
    holdings[numHoldings].amount = msg.value;
    holdings[numHoldings].owner1 = owner1;
    holdings[numHoldings].owner2 = owner2;
  }

  function signRelease(uint ID, address recipient){
    if(holdings[ID].owner1 == msg.sender){
      holdings[ID].owner1Sig = recipient;
    }
    if(holdings[ID].owner2 == msg.sender){
      holdings[ID].owner2Sig = recipient;
    }

    if(releasable(ID, recipient)){
      uint amount = holdings[ID].amount;
      holdings[ID].amount = 0;
      if(!holdings[ID].owner1Sig.send(amount)){ throw; }
    }
  }
//read only

  function releasable(uint ID, address recipient) constant returns(bool) {
    return holdings[ID].owner1Sig == holdings[ID].owner2Sig 
      && holdings[ID].owner1Sig != 0;
  }
}



//rinkeby: 0x9c95a3751ab9b71e29b4dc715c15306067c405e7




