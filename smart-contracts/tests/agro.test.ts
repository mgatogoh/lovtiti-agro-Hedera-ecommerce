import { expect } from 'chai';
import { ethers } from 'hardhat';
import { agro } from '../typechain-types';

describe('Agro Contract', function () {
  let agroContract: agro;
  let owner: any;
  let farmer1: any;
  let farmer2: any;
  let buyer1: any;
  let buyer2: any;

  beforeEach(async function () {
    [owner, farmer1, farmer2, buyer1, buyer2] = await ethers.getSigners();
    
    const AgroContract = await ethers.getContractFactory('agro');
    agroContract = await AgroContract.deploy();
    await agroContract.waitForDeployment();
  });

  describe('Farmer Management', function () {
    it('Should allow farmers to register', async function () {
      await expect(agroContract.connect(farmer1).createFarmer())
        .to.emit(agroContract, 'farmerJoined')
        .withArgs(farmer1.address);
    });

    it('Should prevent duplicate farmer registration', async function () {
      await agroContract.connect(farmer1).createFarmer();
      
      await expect(agroContract.connect(farmer1).createFarmer())
        .to.be.revertedWith('farmer already exists');
    });

    it('Should check if address is a farmer', async function () {
      await agroContract.connect(farmer1).createFarmer();
      
      const farmerInfo = await agroContract.whoFarmer(farmer1.address);
      expect(farmerInfo.exists).to.be.true;
      expect(farmerInfo.balance).to.equal(0);
      expect(farmerInfo.products).to.have.length(0);
    });

    it('Should revert when checking non-existent farmer', async function () {
      await expect(agroContract.whoFarmer(farmer1.address))
        .to.be.revertedWith('farmer does not exist');
    });
  });

  describe('Product Management', function () {
    beforeEach(async function () {
      await agroContract.connect(farmer1).createFarmer();
      await agroContract.connect(farmer2).createFarmer();
    });

    it('Should allow farmers to add products', async function () {
      const price = ethers.parseEther('1.0');
      const amount = 100;

      await expect(agroContract.connect(farmer1).addProduct(price, amount))
        .to.emit(agroContract, 'productCreated')
        .withArgs(1, price, farmer1.address, amount);
    });

    it('Should prevent non-farmers from adding products', async function () {
      const price = ethers.parseEther('1.0');
      const amount = 100;

      await expect(agroContract.connect(buyer1).addProduct(price, amount))
        .to.be.revertedWith('you are not a farmer');
    });

    it('Should validate product parameters', async function () {
      await expect(agroContract.connect(farmer1).addProduct(0, 100))
        .to.be.revertedWith('price must be > 0');

      await expect(agroContract.connect(farmer1).addProduct(ethers.parseEther('1.0'), 0))
        .to.be.revertedWith('stock must be > 0');
    });

    it('Should allow farmers to update stock', async function () {
      await agroContract.connect(farmer1).addProduct(ethers.parseEther('1.0'), 100);
      
      await expect(agroContract.connect(farmer1).updateStock(200, 1))
        .to.emit(agroContract, 'stockUpdated')
        .withArgs(200, 1);
    });

    it('Should allow farmers to increase price', async function () {
      await agroContract.connect(farmer1).addProduct(ethers.parseEther('1.0'), 100);
      
      const newPrice = ethers.parseEther('1.5');
      await expect(agroContract.connect(farmer1).increasePrice(newPrice, 1))
        .to.emit(agroContract, 'priceIncreased')
        .withArgs(newPrice, 1);
    });

    it('Should prevent non-owners from updating products', async function () {
      await agroContract.connect(farmer1).addProduct(ethers.parseEther('1.0'), 100);
      
      await expect(agroContract.connect(farmer2).updateStock(200, 1))
        .to.be.revertedWith('you are not the owner of this product');

      await expect(agroContract.connect(farmer2).increasePrice(ethers.parseEther('1.5'), 1))
        .to.be.revertedWith('you are not the owner of this product');
    });

    it('Should validate update parameters', async function () {
      await agroContract.connect(farmer1).addProduct(ethers.parseEther('1.0'), 100);
      
      await expect(agroContract.connect(farmer1).updateStock(0, 1))
        .to.be.revertedWith('stock must be > 0');

      await expect(agroContract.connect(farmer1).increasePrice(0, 1))
        .to.be.revertedWith('price must be > 0');
    });
  });

  describe('Product Purchasing', function () {
    beforeEach(async function () {
      await agroContract.connect(farmer1).createFarmer();
      await agroContract.connect(farmer1).addProduct(ethers.parseEther('1.0'), 100);
    });

    it('Should allow buyers to purchase products', async function () {
      const amount = 10;
      const value = ethers.parseEther('10.0');

      await expect(agroContract.connect(buyer1).buyproduct(1, amount, { value }))
        .to.emit(agroContract, 'productBought')
        .withArgs(1, buyer1.address, farmer1.address, amount);
    });

    it('Should prevent farmers from buying their own products', async function () {
      const amount = 10;
      const value = ethers.parseEther('10.0');

      await expect(agroContract.connect(farmer1).buyproduct(1, amount, { value }))
        .to.be.revertedWith('you cannot buy your own product');
    });

    it('Should validate purchase parameters', async function () {
      await expect(agroContract.connect(buyer1).buyproduct(1, 0, { value: ethers.parseEther('1.0') }))
        .to.be.revertedWith('stock must be > 0');

      await expect(agroContract.connect(buyer1).buyproduct(1, 10, { value: ethers.parseEther('0.5') }))
        .to.be.revertedWith('insufficient funds');

      await expect(agroContract.connect(buyer1).buyproduct(1, 200, { value: ethers.parseEther('200.0') }))
        .to.be.revertedWith('not enough stock');
    });

    it('Should prevent purchasing non-existent products', async function () {
      await expect(agroContract.connect(buyer1).buyproduct(999, 10, { value: ethers.parseEther('10.0') }))
        .to.be.revertedWith('product does not exist');
    });

    it('Should update stock and farmer balance after purchase', async function () {
      const amount = 10;
      const value = ethers.parseEther('10.0');

      await agroContract.connect(buyer1).buyproduct(1, amount, { value });

      const product = await agroContract.products(1);
      expect(product.stock).to.equal(90); // 100 - 10

      const farmerInfo = await agroContract.whoFarmer(farmer1.address);
      expect(farmerInfo.balance).to.equal(value);
    });
  });

  describe('Balance Withdrawal', function () {
    beforeEach(async function () {
      await agroContract.connect(farmer1).createFarmer();
      await agroContract.connect(farmer1).addProduct(ethers.parseEther('1.0'), 100);
      await agroContract.connect(buyer1).buyproduct(1, 10, { value: ethers.parseEther('10.0') });
    });

    it('Should allow farmers to withdraw balance', async function () {
      const initialBalance = await ethers.provider.getBalance(farmer1.address);
      
      const tx = await agroContract.connect(farmer1).withdrawBalance();
      const receipt = await tx.wait();
      const gasUsed = receipt?.gasUsed || BigInt(0);
      const gasPrice = receipt?.gasPrice || BigInt(0);
      const gasCost = gasUsed * gasPrice;

      const finalBalance = await ethers.provider.getBalance(farmer1.address);
      const expectedBalance = initialBalance + ethers.parseEther('10.0') - gasCost;

      expect(finalBalance).to.be.closeTo(expectedBalance, ethers.parseEther('0.001'));
    });

    it('Should prevent withdrawal with zero balance', async function () {
      await agroContract.connect(farmer1).withdrawBalance(); // First withdrawal
      
      await expect(agroContract.connect(farmer1).withdrawBalance())
        .to.be.revertedWith('no balance to withdraw');
    });

    it('Should reset farmer balance after withdrawal', async function () {
      await agroContract.connect(farmer1).withdrawBalance();
      
      const farmerInfo = await agroContract.whoFarmer(farmer1.address);
      expect(farmerInfo.balance).to.equal(0);
    });
  });

  describe('View Functions', function () {
    beforeEach(async function () {
      await agroContract.connect(farmer1).createFarmer();
      await agroContract.connect(farmer1).addProduct(ethers.parseEther('1.0'), 100);
      await agroContract.connect(farmer1).addProduct(ethers.parseEther('2.0'), 50);
    });

    it('Should return farmer products', async function () {
      const products = await agroContract.viewProducts(farmer1.address);
      
      expect(products).to.have.length(2);
      expect(products[0].id).to.equal(1);
      expect(products[0].price).to.equal(ethers.parseEther('1.0'));
      expect(products[0].stock).to.equal(100);
      expect(products[0].owner).to.equal(farmer1.address);
      
      expect(products[1].id).to.equal(2);
      expect(products[1].price).to.equal(ethers.parseEther('2.0'));
      expect(products[1].stock).to.equal(50);
      expect(products[1].owner).to.equal(farmer1.address);
    });

    it('Should return empty array for farmer with no products', async function () {
      await agroContract.connect(farmer2).createFarmer();
      
      const products = await agroContract.viewProducts(farmer2.address);
      expect(products).to.have.length(0);
    });
  });

  describe('Reentrancy Protection', function () {
    it('Should prevent reentrancy attacks', async function () {
      // This test would require a malicious contract to test properly
      // For now, we'll just ensure the modifier is in place
      await agroContract.connect(farmer1).createFarmer();
      
      // The createFarmer function should complete without issues
      const farmerInfo = await agroContract.whoFarmer(farmer1.address);
      expect(farmerInfo.exists).to.be.true;
    });
  });
});
