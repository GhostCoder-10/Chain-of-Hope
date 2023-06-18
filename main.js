// Set the contract address and ABI
const contractAddress = 'CONTRACT_ADDRESS';
const contractABI = [
    // Paste the ABI of the CharityDonation contract here
];

// Connect to the Ethereum network using web3.js
let web3;
let charityDonationContract;

window.addEventListener('load', async () => {
    // Modern dapp browsers
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            // Request account access if needed
            await window.ethereum.enable();
        } catch (error) {
            // User denied account access
            console.error("User denied account access");
        }
    }
    // Legacy dapp browsers
    else if (window.web3) {
        web3 = new Web3(web3.currentProvider);
    }
    // Non-dapp browsers
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
        return;
    }

    // Load the CharityDonation contract
    charityDonationContract = new web3.eth.Contract(contractABI, contractAddress);
    displayContractInfo();
});

async function displayContractInfo() {
    // Get contract owner address
    const owner = await charityDonationContract.methods.owner().call();
    document.getElementById('ownerAddress').textContent = owner;

    // Get donation count
    const donationCount = await charityDonationContract.methods.donationCount().call();
    document.getElementById('donationCount').textContent = donationCount;
}

async function donate() {
    const amount = document.getElementById('amount').value;
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        alert("Invalid donation amount!");
        return;
    }

    const accounts = await web3.eth.getAccounts();
    const donation = charityDonationContract.methods.donate().send({
        from: accounts[0],
        value: web3.utils.toWei(amount, 'ether')
    });

    console.log('Donation successful!', donation);
    alert('Thank you for your donation!');
    displayContractInfo();
}

async function withdraw() {
    const accounts = await web3.eth.getAccounts();
    const withdrawal = charityDonationContract.methods.withdrawFunds().send({
        from: accounts[0]
    });

    console.log('Withdrawal successful!', withdrawal);
    alert('Funds have been withdrawn!');
    displayContractInfo();
}
