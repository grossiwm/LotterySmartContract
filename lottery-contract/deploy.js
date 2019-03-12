const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3  = require('Web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
    // 'your mnemonic phrase',
    // 'https://rinkeby.infura.io/v3/[wallet-address]'
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
 