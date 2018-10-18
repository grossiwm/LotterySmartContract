const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('Web3');
const web3 = new Web3(ganache.provider());

const { interface, bytecode } = require('../compile');

let lottery;
let accounts;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy( { data: bytecode })
        .send({ from: accounts[0], gas: '1000000' });
})

describe('Lottery Contract', () => {
    it('deploys a contract', () => {
        assert.ok(lottery.options.address);
    });

    it('Allows one user to enter', async () => {
        await lottery.methods.enterLottery().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(1, players.length);
    });

    it('Allows multiple users to enter', async () => {
        await lottery.methods.enterLottery().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });

        await lottery.methods.enterLottery().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02', 'ether')
        });

        await lottery.methods.enterLottery().send({
            from: accounts[2],
            value: web3.utils.toWei('0.02', 'ether')
        });
        
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);
        assert.equal(3, players.length);
    });

    it('Requires a minimum amount of ether', async () => {
        try {
            await lottery.methods.enterLottery().send({
                from: accounts[0],
                value: 10
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    })

    it('Requires manager to call selectWinner', async () => {
        try {
            await lottery.methods.SelectWinner().send({
                from: accounts[1]
            })
            assert(false);
        }catch(err) {
            assert(err);
        }
    })

    it('Pick a winner then reset array.', async () => {
       await lottery.methods.enterLottery().send({
           from: accounts[0],
           value: web3.utils.toWei('2', 'ether')
       });

       const initialBalance = await web3.eth.getBalance(accounts[0]);

       await lottery.methods.SelectWinner().send({ from: accounts[0] });

       const finalBalance = await web3.eth.getBalance(accounts[0]);

       const difference = finalBalance - initialBalance;

       assert( difference > web3.utils.toWei('1.8', 'ether'));
       //console.log(difference);
    });

    it('Reset players array', async () => {
        const players = await lottery.methods.getPlayers().call({from: accounts[0]});
        assert(players.length == 0);
        console.log(players.length)
    })

    
});