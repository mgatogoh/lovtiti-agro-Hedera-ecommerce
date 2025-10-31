const hre = require("hardhat");

    async function main() {
      const [deployer] = await hre.ethers.getSigners();
      console.log("Deploying with account:", deployer.address);

      const Agro = await hre.ethers.getContractFactory("agro");
      const agro = await Agro.deploy();

      await agro.waitForDeployment();
      const address = await agro.getAddress();
      console.log("Agro deployed to:", address);
    }

    main().catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
