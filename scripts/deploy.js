const { ethers } = require("hardhat");

async function main() {
    console.log("Deploying PaymentManager...");
    const PaymentManager = await ethers.getContractFactory("PaymentManager");
    const paymentManager = await PaymentManager.deploy();
    await paymentManager.waitForDeployment();

    const paymentManagerAddress = await paymentManager.getAddress();
    console.log("PaymentManager deployed at:", paymentManagerAddress);


    console.log("Deploying AssetManager...");
    const AssetManager = await ethers.getContractFactory("AssetManager");
    const assetManager = await AssetManager.deploy();
    await assetManager.waitForDeployment();
  
    const assetManagerAddress = await assetManager.getAddress();
    console.log("AssetManager deployed at:", assetManagerAddress);

    // (Optional) If your AssetManager has `setPaymentManager(...)`
    // and your script can make a transaction as Admin, do:
    console.log("Setting PaymentManager in AssetManager...");
    const tx = await assetManager.setPaymentManager(paymentManagerAddress);
    await tx.wait();

    console.log("PaymentManager set successfully in AssetManager.");

    console.log("Setting AssetManager in PaymentManager...");
    const tx2 = await paymentManager.setAssetManager(assetManagerAddress);
    await tx2.wait();
    console.log("PaymentManager knows about AssetManager now.");
    let tx3 = await assetManager.registerAsset(
        "Button Light1",
        "BuildingA",
        1,
        101,
        "Philips",
        "ModelX",
        "bafkreid472aabic3vwlpqtvm2kqjtdicsuas4kky5mpteopqmmtheevptq",
        "3KDlOYIonFEw0RTYs8cxm9",
        "BL1",
        "BL001"
    );
    await tx3.wait();
    console.log("Asset 1 registrato.");

    tx3 = await assetManager.registerAsset(
        "Button Light1",
        "BuildingA",
        1,
        102,
        "Philips",
        "ModelX",
        "bafkreif6uabvnxldpukbh7wenyf5cqlauwphlnmqfidockctaleud3vqse",
        "3KDlOYIonFEw0RTYs8cxm6",
        "BL2",
        "BL002"
    );
    await tx3.wait();
    console.log("Asset 2 registrato.");

    tx3 = await assetManager.registerAsset(
        "RedInt",
        "BuildingA",
        1,
        103,
        "Philips",
        "ModelX",
        "bafkreie5naoiiahgsd6uv7qpm65hwj5il44ohmhfnolqbkcobnvoc5q7ea",
        "3KDlOYIonFEw0RTYs8chY_",
        "RL3",
        "RL003"
    );
    await tx3.wait();
    console.log("Asset 3 registrato.");
    

}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
