import { ethers } from 'hardhat';
import fs from 'fs';
import path from 'path';

async function main() {
  console.log('Deploying Agro Contract...');

  // Get the contract factory
  const AgroContract = await ethers.getContractFactory('agro');
  
  // Deploy the contract
  const agroContract = await AgroContract.deploy();
  
  // Wait for deployment to complete
  await agroContract.waitForDeployment();
  
  const contractAddress = await agroContract.getAddress();
  
  console.log(`Agro Contract deployed to: ${contractAddress}`);
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress,
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId,
    deployedAt: new Date().toISOString(),
    deployer: (await ethers.getSigners())[0].address
  };
  
  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, '../deployments');
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  // Save deployment info to file
  const deploymentFile = path.join(deploymentsDir, 'agro-deployment.json');
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  
  console.log(`Deployment info saved to: ${deploymentFile}`);
  
  // Verify contract on Etherscan (if on a supported network)
  if (process.env.ETHERSCAN_API_KEY && deploymentInfo.network !== 'localhost') {
    console.log('Verifying contract on Etherscan...');
    try {
      await agroContract.deploymentTransaction()?.wait(6); // Wait for 6 confirmations
      await hre.run('verify:verify', {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log('Contract verified on Etherscan');
    } catch (error) {
      console.log('Contract verification failed:', error);
    }
  }
  
  // Test basic contract functionality
  console.log('Testing contract functionality...');
  
  try {
    // Test farmer creation
    const [deployer, farmer1, buyer1] = await ethers.getSigners();
    
    console.log('Creating farmer account...');
    const createFarmerTx = await agroContract.connect(farmer1).createFarmer();
    await createFarmerTx.wait();
    console.log('✓ Farmer account created');
    
    // Test product addition
    console.log('Adding test product...');
    const addProductTx = await agroContract.connect(farmer1).addProduct(
      ethers.parseEther('1.0'), // 1 ETH price
      100 // 100 units stock
    );
    await addProductTx.wait();
    console.log('✓ Test product added');
    
    // Test product purchase
    console.log('Testing product purchase...');
    const buyProductTx = await agroContract.connect(buyer1).buyproduct(1, 10, {
      value: ethers.parseEther('10.0') // Buy 10 units for 10 ETH
    });
    await buyProductTx.wait();
    console.log('✓ Product purchase successful');
    
    // Check farmer balance
    const farmerInfo = await agroContract.whoFarmer(farmer1.address);
    console.log(`✓ Farmer balance: ${ethers.formatEther(farmerInfo.balance)} ETH`);
    
    console.log('All tests passed! Contract is working correctly.');
    
  } catch (error) {
    console.error('Contract test failed:', error);
  }
  
  console.log('\n=== Deployment Summary ===');
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Network: ${deploymentInfo.network}`);
  console.log(`Chain ID: ${deploymentInfo.chainId}`);
  console.log(`Deployer: ${deploymentInfo.deployer}`);
  console.log(`Deployed At: ${deploymentInfo.deployedAt}`);
  
  // Generate environment variables
  console.log('\n=== Environment Variables ===');
  console.log(`NEXT_PUBLIC_AGRO_CONTRACT_ADDRESS=${contractAddress}`);
  console.log(`AGRO_CONTRACT_ADDRESS=${contractAddress}`);
  console.log(`NETWORK=${deploymentInfo.network}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
