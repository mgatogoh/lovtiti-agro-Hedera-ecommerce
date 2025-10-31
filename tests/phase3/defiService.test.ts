// DeFi Service Tests for Phase 3
import { defiService, LendingPool, StakingPosition, YieldFarmingPool, LendingPosition } from '../../utils/defiService';

describe('DeFi Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Lending Pools', () => {
    it('should create lending pool', async () => {
      const nftTokenId = '0.0.123456';
      const nftContract = '0.0.789012';
      const collateralValue = 10000;
      const initialLiquidity = 50000;
      const interestRate = 12.5;

      const pool = await defiService.createLendingPool(
        nftTokenId,
        nftContract,
        collateralValue,
        initialLiquidity,
        interestRate
      );

      expect(pool).toHaveProperty('id');
      expect(pool).toHaveProperty('nftTokenId', nftTokenId);
      expect(pool).toHaveProperty('nftContract', nftContract);
      expect(pool).toHaveProperty('collateralValue', collateralValue);
      expect(pool).toHaveProperty('availableLiquidity', initialLiquidity);
      expect(pool).toHaveProperty('interestRate', interestRate);
      expect(pool).toHaveProperty('totalLiquidity', initialLiquidity);
      expect(pool).toHaveProperty('borrowedAmount', 0);
      expect(pool).toHaveProperty('utilizationRate', 0);
      expect(pool).toHaveProperty('lenders');
      expect(pool).toHaveProperty('borrowers');
      expect(pool).toHaveProperty('createdAt');
      expect(pool).toHaveProperty('updatedAt');

      console.log(`Created lending pool ${pool.id} for NFT ${nftTokenId}`);
    });

    it('should deposit liquidity to pool', async () => {
      // First create a pool
      const pool = await defiService.createLendingPool(
        '0.0.123456',
        '0.0.789012',
        10000,
        50000,
        12.5
      );

      const lenderAddress = '0.0.lender123';
      const amount = 10000;

      const lender = await defiService.depositLiquidity(pool.id, lenderAddress, amount);

      expect(lender).toHaveProperty('address', lenderAddress);
      expect(lender).toHaveProperty('amount', amount);
      expect(lender).toHaveProperty('shares');
      expect(lender).toHaveProperty('interestEarned', 0);
      expect(lender).toHaveProperty('joinedAt');

      console.log(`Lender ${lenderAddress} deposited ${amount} HBAR to pool ${pool.id}`);
    });

    it('should borrow against NFT', async () => {
      // Create pool and add liquidity first
      const pool = await defiService.createLendingPool(
        '0.0.123456',
        '0.0.789012',
        10000,
        50000,
        12.5
      );

      await defiService.depositLiquidity(pool.id, '0.0.lender123', 30000);

      const borrowerAddress = '0.0.borrower456';
      const nftTokenId = '0.0.123456';
      const borrowedAmount = 5000;
      const collateralValue = 15000;

      const position = await defiService.borrowAgainstNFT(
        pool.id,
        borrowerAddress,
        nftTokenId,
        borrowedAmount,
        collateralValue
      );

      expect(position).toHaveProperty('id');
      expect(position).toHaveProperty('borrower', borrowerAddress);
      expect(position).toHaveProperty('nftTokenId', nftTokenId);
      expect(position).toHaveProperty('borrowedAmount', borrowedAmount);
      expect(position).toHaveProperty('collateralValue', collateralValue);
      expect(position).toHaveProperty('interestRate');
      expect(position).toHaveProperty('borrowedAt');
      expect(position).toHaveProperty('dueDate');
      expect(position).toHaveProperty('status', 'ACTIVE');
      expect(position).toHaveProperty('healthFactor');
      expect(position).toHaveProperty('accruedInterest', 0);

      const healthFactor = collateralValue / borrowedAmount;
      expect(position.healthFactor).toBe(healthFactor);

      console.log(`Borrower ${borrowerAddress} borrowed ${borrowedAmount} HBAR against NFT ${nftTokenId}`);
    });

    it('should handle insufficient liquidity for borrowing', async () => {
      const pool = await defiService.createLendingPool(
        '0.0.123456',
        '0.0.789012',
        10000,
        5000, // Low liquidity
        12.5
      );

      await expect(defiService.borrowAgainstNFT(
        pool.id,
        '0.0.borrower456',
        '0.0.123456',
        10000, // More than available
        20000
      )).rejects.toThrow('Insufficient liquidity in pool');
    });

    it('should handle insufficient collateral ratio', async () => {
      const pool = await defiService.createLendingPool(
        '0.0.123456',
        '0.0.789012',
        10000,
        50000,
        12.5
      );

      await defiService.depositLiquidity(pool.id, '0.0.lender123', 30000);

      await expect(defiService.borrowAgainstNFT(
        pool.id,
        '0.0.borrower456',
        '0.0.123456',
        10000,
        12000 // Low collateral ratio (1.2:1, below 1.5 threshold)
      )).rejects.toThrow('Insufficient collateral ratio');
    });

    it('should repay loan', async () => {
      // Create borrowing scenario first
      const pool = await defiService.createLendingPool(
        '0.0.123456',
        '0.0.789012',
        10000,
        50000,
        12.5
      );

      await defiService.depositLiquidity(pool.id, '0.0.lender123', 30000);

      const position = await defiService.borrowAgainstNFT(
        pool.id,
        '0.0.borrower456',
        '0.0.123456',
        5000,
        15000
      );

      const repaymentAmount = 5000;
      const result = await defiService.repayLoan(position.id, '0.0.borrower456', repaymentAmount);

      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('remainingBalance', 0);

      console.log(`Loan ${position.id} repaid successfully`);
    });
  });

  describe('NFT Staking', () => {
    it('should stake NFT', async () => {
      const nftTokenId = '0.0.stake123';
      const nftContract = '0.0.contract456';
      const stakerAddress = '0.0.staker789';
      const amount = 1000;
      const lockPeriod = 30; // 30 days

      const position = await defiService.stakeNFT(
        nftTokenId,
        nftContract,
        stakerAddress,
        amount,
        lockPeriod
      );

      expect(position).toHaveProperty('id');
      expect(position).toHaveProperty('staker', stakerAddress);
      expect(position).toHaveProperty('nftTokenId', nftTokenId);
      expect(position).toHaveProperty('nftContract', nftContract);
      expect(position).toHaveProperty('stakedAmount', amount);
      expect(position).toHaveProperty('stakedAt');
      expect(position).toHaveProperty('lockPeriod', lockPeriod);
      expect(position).toHaveProperty('unlockDate');
      expect(position).toHaveProperty('rewards', 0);
      expect(position).toHaveProperty('apy');
      expect(position).toHaveProperty('status', 'ACTIVE');

      // Verify unlock date calculation
      const expectedUnlockDate = new Date(Date.now() + lockPeriod * 24 * 60 * 60 * 1000);
      const timeDiff = Math.abs(position.unlockDate.getTime() - expectedUnlockDate.getTime());
      expect(timeDiff).toBeLessThan(1000); // Within 1 second

      console.log(`NFT ${nftTokenId} staked for ${lockPeriod} days by ${stakerAddress}`);
    });

    it('should unstake NFT after lock period', async () => {
      // Create a staking position with short lock period
      const position = await defiService.stakeNFT(
        '0.0.unstake123',
        '0.0.contract456',
        '0.0.staker789',
        1000,
        1 // 1 day lock
      );

      // Mock the unlock date to be in the past
      position.unlockDate = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const result = await defiService.unstakeNFT(position.id, '0.0.staker789');

      expect(result).toHaveProperty('stakedAmount', 1000);
      expect(result).toHaveProperty('rewards');
      expect(result.rewards).toBeGreaterThan(0);

      console.log(`NFT unstaked, rewards: ${result.rewards} HBAR`);
    });

    it('should prevent unstaking before lock period', async () => {
      const position = await defiService.stakeNFT(
        '0.0.locked123',
        '0.0.contract456',
        '0.0.staker789',
        1000,
        30 // 30 days lock
      );

      await expect(defiService.unstakeNFT(position.id, '0.0.staker789'))
        .rejects.toThrow('Staking period not yet completed');
    });
  });

  describe('Yield Farming', () => {
    it('should create yield farming pool', async () => {
      const name = 'Premium Crops Pool';
      const description = 'High-quality agricultural products yield farming';
      const nftTokenIds = ['0.0.crop123', '0.0.crop456', '0.0.crop789'];
      const rewardToken = 'HBAR';
      const rewardRate = 100; // 100 tokens per second
      const lockPeriod = 7; // 7 days

      const pool = await defiService.createYieldFarmingPool(
        name,
        description,
        nftTokenIds,
        rewardToken,
        rewardRate,
        lockPeriod
      );

      expect(pool).toHaveProperty('id');
      expect(pool).toHaveProperty('name', name);
      expect(pool).toHaveProperty('description', description);
      expect(pool).toHaveProperty('nftTokenIds', nftTokenIds);
      expect(pool).toHaveProperty('rewardToken', rewardToken);
      expect(pool).toHaveProperty('rewardRate', rewardRate);
      expect(pool).toHaveProperty('apy');
      expect(pool).toHaveProperty('lockPeriod', lockPeriod);
      expect(pool).toHaveProperty('totalStaked', 0);
      expect(pool).toHaveProperty('participants', 0);
      expect(pool).toHaveProperty('totalRewards', 0);
      expect(pool).toHaveProperty('distributedRewards', 0);
      expect(pool).toHaveProperty('createdAt');

      console.log(`Created yield farming pool ${pool.id}: ${name}`);
    });

    it('should join yield farming pool', async () => {
      // Create pool first
      const pool = await defiService.createYieldFarmingPool(
        'Test Pool',
        'Test description',
        ['0.0.nft123'],
        'HBAR',
        50,
        7
      );

      const participantAddress = '0.0.participant123';
      const nftTokenId = '0.0.nft123';
      const stakeAmount = 5000;

      const result = await defiService.joinYieldFarming(
        pool.id,
        participantAddress,
        nftTokenId,
        stakeAmount
      );

      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('rewards');
      expect(result.rewards).toBeGreaterThan(0);

      console.log(`Participant ${participantAddress} joined pool ${pool.id} with ${stakeAmount} HBAR`);
    });

    it('should validate stake amount limits', async () => {
      const pool = await defiService.createYieldFarmingPool(
        'Test Pool',
        'Test description',
        ['0.0.nft123'],
        'HBAR',
        50,
        7
      );

      // Test minimum stake amount
      await expect(defiService.joinYieldFarming(
        pool.id,
        '0.0.participant123',
        '0.0.nft123',
        50 // Below minimum (100)
      )).rejects.toThrow('Stake amount outside allowed range');

      // Test maximum stake amount
      await expect(defiService.joinYieldFarming(
        pool.id,
        '0.0.participant123',
        '0.0.nft123',
        2000000 // Above maximum (1M)
      )).rejects.toThrow('Stake amount outside allowed range');
    });

    it('should validate NFT support in pool', async () => {
      const pool = await defiService.createYieldFarmingPool(
        'Test Pool',
        'Test description',
        ['0.0.supported123'],
        'HBAR',
        50,
        7
      );

      await expect(defiService.joinYieldFarming(
        pool.id,
        '0.0.participant123',
        '0.0.unsupported456', // Not in supported list
        1000
      )).rejects.toThrow('NFT 0.0.unsupported456 not supported in this pool');
    });
  });

  describe('Liquidity Pools', () => {
    it('should create liquidity pool', async () => {
      const tokenA = 'HBAR';
      const tokenB = 'LP_TOKEN';
      const initialAmountA = 100000;
      const initialAmountB = 50000;

      const pool = await defiService.createLiquidityPool(
        tokenA,
        tokenB,
        initialAmountA,
        initialAmountB
      );

      expect(pool).toHaveProperty('id');
      expect(pool).toHaveProperty('tokenA', tokenA);
      expect(pool).toHaveProperty('tokenB', tokenB);
      expect(pool).toHaveProperty('reserveA', initialAmountA);
      expect(pool).toHaveProperty('reserveB', initialAmountB);
      expect(pool).toHaveProperty('totalSupply');
      expect(pool).toHaveProperty('feeRate', 0.3);
      expect(pool).toHaveProperty('volume24h', 0);
      expect(pool).toHaveProperty('liquidity24h', initialAmountA + initialAmountB);
      expect(pool).toHaveProperty('apy');
      expect(pool).toHaveProperty('createdAt');

      // Verify total supply calculation (sqrt of product)
      const expectedSupply = Math.sqrt(initialAmountA * initialAmountB);
      expect(pool.totalSupply).toBe(expectedSupply);

      console.log(`Created liquidity pool ${pool.id}`);
    });
  });

  describe('Analytics and Risk Assessment', () => {
    it('should get DeFi analytics', async () => {
      // Create some test data first
      await defiService.createLendingPool('0.0.analytics123', '0.0.contract456', 10000, 50000, 12.5);
      await defiService.stakeNFT('0.0.stake123', '0.0.contract456', '0.0.staker789', 1000, 30);

      const analytics = await defiService.getDeFiAnalytics();

      expect(analytics).toHaveProperty('totalLiquidity');
      expect(analytics).toHaveProperty('totalBorrowed');
      expect(analytics).toHaveProperty('activeLoans');
      expect(analytics).toHaveProperty('totalStaked');
      expect(analytics).toHaveProperty('activeStakers');
      expect(analytics).toHaveProperty('totalRewards');
      expect(analytics).toHaveProperty('averageAPY');

      expect(typeof analytics.totalLiquidity).toBe('number');
      expect(typeof analytics.totalBorrowed).toBe('number');
      expect(typeof analytics.activeLoans).toBe('number');
      expect(typeof analytics.totalStaked).toBe('number');
      expect(typeof analytics.activeStakers).toBe('number');
      expect(typeof analytics.totalRewards).toBe('number');
      expect(typeof analytics.averageAPY).toBe('number');

      console.log('DeFi Analytics:', analytics);
    });

    it('should assess risk for NFT', async () => {
      const nftTokenId = '0.0.risk123';

      const riskAssessment = await defiService.getRiskAssessment(nftTokenId);

      expect(riskAssessment).toHaveProperty('riskScore');
      expect(riskAssessment).toHaveProperty('riskLevel');
      expect(riskAssessment).toHaveProperty('factors');
      expect(riskAssessment).toHaveProperty('recommendation');

      expect(riskAssessment.riskScore).toBeGreaterThanOrEqual(0);
      expect(riskAssessment.riskScore).toBeLessThanOrEqual(100);
      expect(['LOW', 'MEDIUM', 'HIGH']).toContain(riskAssessment.riskLevel);
      expect(Array.isArray(riskAssessment.factors)).toBe(true);
      expect(typeof riskAssessment.recommendation).toBe('string');

      console.log(`Risk assessment for NFT ${nftTokenId}:`, riskAssessment);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid pool operations', async () => {
      const invalidPoolId = 'invalid_pool_id';

      await expect(defiService.depositLiquidity(invalidPoolId, '0.0.lender123', 1000))
        .rejects.toThrow(`Lending pool ${invalidPoolId} not found`);

      await expect(defiService.borrowAgainstNFT(invalidPoolId, '0.0.borrower456', '0.0.123456', 1000, 2000))
        .rejects.toThrow(`Lending pool ${invalidPoolId} not found`);
    });

    it('should handle invalid position operations', async () => {
      const invalidPositionId = 'invalid_position_id';

      await expect(defiService.repayLoan(invalidPositionId, '0.0.borrower456', 1000))
        .rejects.toThrow(`Lending position ${invalidPositionId} not found`);

      await expect(defiService.unstakeNFT(invalidPositionId, '0.0.staker789'))
        .rejects.toThrow(`Staking position ${invalidPositionId} not found`);
    });

    it('should handle unauthorized operations', async () => {
      // Create a borrowing position
      const pool = await defiService.createLendingPool('0.0.unauth123', '0.0.contract456', 10000, 50000, 12.5);
      await defiService.depositLiquidity(pool.id, '0.0.lender123', 30000);
      const position = await defiService.borrowAgainstNFT(pool.id, '0.0.borrower456', '0.0.unauth123', 5000, 15000);

      // Try to repay with different address
      await expect(defiService.repayLoan(position.id, '0.0.unauthorized789', 5000))
        .rejects.toThrow('Unauthorized repayment attempt');
    });
  });

  describe('Integration Tests', () => {
    it('should complete full DeFi workflow', async () => {
      const nftTokenId = '0.0.integration123';
      const nftContract = '0.0.contract456';
      const lenderAddress = '0.0.lender789';
      const borrowerAddress = '0.0.borrower012';

      // 1. Create lending pool
      const pool = await defiService.createLendingPool(nftTokenId, nftContract, 10000, 50000, 12.5);
      console.log(`✅ Created lending pool ${pool.id}`);

      // 2. Deposit liquidity
      const lender = await defiService.depositLiquidity(pool.id, lenderAddress, 30000);
      console.log(`✅ Deposited liquidity: ${lender.amount} HBAR`);

      // 3. Borrow against NFT
      const position = await defiService.borrowAgainstNFT(pool.id, borrowerAddress, nftTokenId, 10000, 20000);
      console.log(`✅ Borrowed ${position.borrowedAmount} HBAR`);

      // 4. Stake NFT
      const stakingPosition = await defiService.stakeNFT(nftTokenId, nftContract, borrowerAddress, 5000, 30);
      console.log(`✅ Staked NFT for ${stakingPosition.lockPeriod} days`);

      // 5. Create yield farming pool
      const farmingPool = await defiService.createYieldFarmingPool(
        'Integration Pool',
        'Test pool for integration',
        [nftTokenId],
        'HBAR',
        100,
        7
      );
      console.log(`✅ Created yield farming pool ${farmingPool.id}`);

      // 6. Join yield farming
      const farmingResult = await defiService.joinYieldFarming(farmingPool.id, borrowerAddress, nftTokenId, 2000);
      console.log(`✅ Joined yield farming: ${farmingResult.rewards} expected rewards`);

      // 7. Get analytics
      const analytics = await defiService.getDeFiAnalytics();
      console.log(`✅ Analytics - Total Liquidity: ${analytics.totalLiquidity} HBAR`);

      // 8. Risk assessment
      const riskAssessment = await defiService.getRiskAssessment(nftTokenId);
      console.log(`✅ Risk Assessment - Level: ${riskAssessment.riskLevel}`);

      // Verify all components worked
      expect(pool.id).toBeTruthy();
      expect(lender.amount).toBe(30000);
      expect(position.borrowedAmount).toBe(10000);
      expect(stakingPosition.stakedAmount).toBe(5000);
      expect(farmingResult.success).toBe(true);
      expect(analytics.totalLiquidity).toBeGreaterThan(0);
      expect(riskAssessment.riskLevel).toMatch(/LOW|MEDIUM|HIGH/);

      console.log('✅ Complete DeFi workflow test passed');
    });
  });
});
