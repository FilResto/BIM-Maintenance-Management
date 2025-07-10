require('dotenv').config();
const { ethers } = require('ethers');

// Signer wallets for each role (Admin, Technician, User)
const {
  ADMIN_KEY, TECH_KEY, USER_KEY,
  SEPOLIA_RPC_URL, AMOY_RPC_URL,
  SEPOLIA_ASSET_MANAGER_ADDRESS, AMOY_ASSET_MANAGER_ADDRESS
} = process.env;

// RPC endpoints for Sepolia and Amoy (Infura/Alchemy or public RPC)
const providerSepolia = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
const providerAmoy    = new ethers.JsonRpcProvider(AMOY_RPC_URL);



const adminSepolia = new ethers.Wallet(ADMIN_KEY, providerSepolia);
const techSepolia  = new ethers.Wallet(TECH_KEY,  providerSepolia);
const userSepolia  = new ethers.Wallet(USER_KEY,  providerSepolia);
const adminAmoy    = new ethers.Wallet(ADMIN_KEY, providerAmoy);
const techAmoy     = new ethers.Wallet(TECH_KEY,  providerAmoy);
const userAmoy     = new ethers.Wallet(USER_KEY,  providerAmoy);

// Load AssetManager ABI and deployed addresses on each network
const assetManagerAbi = require('../artifacts/contracts/AssetManager.sol/AssetManager.json').abi;
const assetManagerAddressSepolia = SEPOLIA_ASSET_MANAGER_ADDRESS;
const assetManagerAddressAmoy    = AMOY_ASSET_MANAGER_ADDRESS;

// Contract instances (connect with admin by default; will switch signer per call)
const assetManagerSepolia = new ethers.Contract(assetManagerAddressSepolia, assetManagerAbi, adminSepolia);
const assetManagerAmoy    = new ethers.Contract(assetManagerAddressAmoy, assetManagerAbi, adminAmoy);

// Define an example new asset's metadata (for registerAsset) and maintenance details
const newAssetData = {
  name:       "Lamp5",
  building:   "BuildingA",
  floor:      1,
  room:       104,
  brand:      "Philips",
  model:      "ModelX",
  ipfsHash:   "bafkreiewjfijkxcs5wdhjwnebhs7dum5cvnjymb72ljb6fv2h2y4vtp72a",  // sample IPFS CID
  globalId:   "0wl6RGv6L2yx2_OHNfdKbL",  // slightly modified to be unique
  positionId: "P5",
  physicalId: "LAMP005"
};
const testAssetId = 0;  // existing asset (Lamp1 with ID 0) to use for fault/maintenance
const faultDescription = "Overheat issue";
const maintStartComment = "Beginning maintenance";
const maintEndComment   = "Maintenance completed";
function pickGasPrice (receipt, tx) {
  if (receipt.effectiveGasPrice)      return BigInt(receipt.effectiveGasPrice);   // EIP-1559 (most accurate)
  if (tx.gasPrice)                    return BigInt(tx.gasPrice);                 // legacy
  if (tx.maxFeePerGas)                return BigInt(tx.maxFeePerGas);             // fallback for type-2
  return 0n;                          // should never be hit on public nets
}
async function measureWorkflow(providerName, assetManagerContract, adminSigner, techSigner, userSigner) {
  console.log(`\nTesting on ${providerName}...`);
  // 1. Admin registers a new asset
  let t0 = Date.now();
  let tx = await assetManagerContract.connect(adminSigner).registerAsset(
    newAssetData.name, newAssetData.building, newAssetData.floor, newAssetData.room,
    newAssetData.brand, newAssetData.model, newAssetData.ipfsHash,
    newAssetData.globalId, newAssetData.positionId, newAssetData.physicalId
  );
  let receipt = await tx.wait();
  let t1 = Date.now();
  const gasUsed1 = BigInt(receipt.gasUsed);
  const gasPrice1 = pickGasPrice(receipt, tx);
  const cost1     = gasUsed1 * gasPrice1;                 // bigint × bigint
   console.log(
     `Admin registers asset: gasUsed=${gasUsed1}, `
  +  `cost=${ethers.formatEther(cost1.toString())} `
   + `${providerName.includes('Sepolia') ? 'ETH' : 'POL'}, `
   + `time=${((t1 - t0)/1000).toFixed(2)} s`);

  // 2. User reports a fault on asset ID testAssetId
  t0 = Date.now();
  tx = await assetManagerContract.connect(userSigner).reportFault(testAssetId, faultDescription);
  receipt = await tx.wait();
  t1 = Date.now();
  const gasUsed2 = BigInt(receipt.gasUsed);
  const gasPrice2 = pickGasPrice(receipt, tx);
  const cost2 = gasUsed2 * gasPrice2;
   console.log(
     `Admin reportFault: gasUsed=${gasUsed2}, `
   + `cost=${ethers.formatEther(cost2.toString())} `
   + `${providerName.includes('Sepolia') ? 'ETH' : 'POL'}, `
   + `time=${((t1 - t0)/1000).toFixed(2)} s`);
  // 3. Technician starts maintenance on the broken asset
  t0 = Date.now();
  tx = await assetManagerContract.connect(techSigner).startMaintenance(testAssetId, maintStartComment);
  receipt = await tx.wait();
  t1 = Date.now();
  const gasUsed3 = BigInt(receipt.gasUsed);
const gasPrice3 = pickGasPrice(receipt, tx);
  const cost3 = gasUsed3 * gasPrice3;
   console.log(
     `Admin startMaintenance: gasUsed=${gasUsed3}, `
   + `cost=${ethers.formatEther(cost3.toString())} `
   + `${providerName.includes('Sepolia') ? 'ETH' : 'POL'}, `
   + `time=${((t1 - t0)/1000).toFixed(2)} s`);
  // 4. Technician completes maintenance on the asset
  t0 = Date.now();
  tx = await assetManagerContract.connect(techSigner).completeMaintenance(testAssetId, maintEndComment);
  receipt = await tx.wait();
  t1 = Date.now();
  const gasUsed4 = BigInt(receipt.gasUsed);
const gasPrice4 = pickGasPrice(receipt, tx);
  const cost4 = gasUsed4 * gasPrice4;
     console.log(
     `Admin reportFault: gasUsed=${gasUsed4}, `
   + `cost=${ethers.formatEther(cost4.toString())} `
   + `${providerName.includes('Sepolia') ? 'ETH' : 'POL'}, `
   + `time=${((t1 - t0)/1000).toFixed(2)} s`);
}

// Execute measurements for Sepolia and Amoy
(async () => {
  try {
    await measureWorkflow("Ethereum Sepolia", assetManagerSepolia, adminSepolia, techSepolia, userSepolia);
    await measureWorkflow("Polygon Amoy", assetManagerAmoy, adminAmoy, techAmoy, userAmoy);
  } catch (err) {
    console.error("Error during workflow execution:", err);
  }
})();
