const { ethers } = require("ethers")
const fs = require("fs-extra")
require("dotenv").config()

async function main() {
    //create a provider
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)

    //create a signer
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

    //print RPC_URL and PRIVATE_KEY
    console.log("RPC_URL:", process.env.RPC_URL)
    console.log("PRIVATE_KEY:", process.env.PRIVATE_KEY)

    const abi = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.abi",
        "utf-8"
    )
    const binary = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.bin",
        "utf-8"
    )

    //create a contract factory
    const factory = new ethers.ContractFactory(abi, binary, signer)

    //log and deploy the contract
    console.log("Deploying contract...")
    const contract = await factory.deploy()
    console.log("Contract deployed to:", contract.address)

    //get receipt
    const receipt = await contract.deployTransaction.wait()
    console.log("Contract deployed in block:", receipt.blockNumber)

    //get favorite number from contract
    const favNumber = await contract.retrieve()
    console.log("Favorite number:", favNumber.toString())

    //call store to updata favorite number
    const txResponse = await contract.store(69)

    //get receipt from txResponse
    const txReceipt = await txResponse.wait()
    console.log("Transaction mined in block:", txReceipt.blockNumber)

    //get favorite number from contract
    const favNumber2 = await contract.retrieve()

    //log with backtick
    console.log(`New Favorite number is now: ${favNumber2.toString()}`)
}

//call this function
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
