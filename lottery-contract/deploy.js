const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3  = require('Web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
    'hour luggage section bunker unhappy license ten sun syrup bundle bunker select',
    'https://rinkeby.infura.io/v3/fb6aafed519a44a29c1dc166c58daf32'
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log("Attempting to deploy from ", accounts[0]);
    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: '0x' + bytecode })
            .send({ gas: "1000000", from: accounts[0] });

    
    console.log(interface);
    console.log("Contract created at", result.options.address); 
}

deploy();
 