# ⚙️ Hedera dApp UI — Contract Call Guide

# 0️⃣  Setup
## make sure all env vars set

import { useContract, formatEther, parseEther } from "@/hooks/useContract"

const CONTRACT_ADDRESS="0xYOUR_DEPLOYED_AGRO_ON_HEDERA_TESTNET"
const {
  account,isConnected,loading,error,
  connectWallet,disconnectWallet,
  ensureFarmer,createFarmer,
  addProduct,increasePrice,updateStock,buyProduct,withdrawBalance,
  getFarmerInfo,getProduct,getFarmerProducts,
  listenToEvents
} = useContract(CONTRACT_ADDRESS)


# 1️⃣  Connect / Disconnect
await connectWallet        # switches to Hedera Testnet (chainId 296)
disconnectWallet           # resets local state


# 2️⃣  Ensure Farmer (Safe Signup)
if (!isConnected) await connectWallet
const { created } = await ensureFarmer()
# created: true  -> farmer created
# created: false -> already exists


# 3️⃣  Create Farmer (Raw)
await connectWallet
await createFarmer()       # throws if farmer already exists


# 4️⃣  Add Product
await connectWallet
await addProduct "0.15" 20
# price in HBAR (string), amount as integer


# 5️⃣  Increase Price
await connectWallet
await increasePrice 1 "0.20"
# args: productId newPriceHBAR


# 6️⃣  Update Stock
await connectWallet
await updateStock 1 50
# args: productId newStock


# 7️⃣  Buy Product
await connectWallet
await buyProduct 1 3 "0.60"
# args: pid amount totalPriceHBAR


# 8️⃣  Withdraw Farmer Balance
await connectWallet
await withdrawBalance


# 9️⃣  Get Farmer Info
const f = await getFarmerInfo(account)
echo $(formatEther f.balance)
# -> { products[], balance, exists }


# 🔟  Get Single Product
const p = await getProduct 1
echo $(formatEther p.price)
# -> { price, owner, stock, id }


# 1️⃣1️⃣  Get Farmer Products
const list = await getFarmerProducts account
echo list


# 1️⃣2️⃣  Listen to Events
const stop = listenToEvents (e) => console.log(e.type,e)
# possible e.type values:
# productCreated, farmerJoined, stockUpdated,
# priceIncreased, productBought, farmerEarnt
# stop() to remove listeners


# 1️⃣3️⃣  Unit Helpers
formatEther 123400000000000000n  # -> "0.1234"
parseEther "0.1234"              # -> 123400000000000000n


# 1️⃣4️⃣  Minimal Demo Component
<button onClick={connectWallet}>Connect</button>
<button onClick={async()=>{if(!isConnected)await connectWallet();await ensureFarmer();}}>Signup</button>
<button onClick={()=>addProduct("0.10",5)}>Add Product</button>
<button onClick={()=>increasePrice(1,"0.12")}>Increase Price</button>
<button onClick={()=>updateStock(1,50)}>Update Stock</button>
<button onClick={()=>buyProduct(1,2,"0.24")}>Buy</button>
<button onClick={withdrawBalance}>Withdraw</button>
<button onClick={async()=>console.log(await getFarmerInfo(account))}>My Info</button>
