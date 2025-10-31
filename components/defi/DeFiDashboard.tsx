// DeFi Dashboard Component for Phase 3
import React, { useState, useEffect } from 'react';
import { defiService } from '@/utils/defiService';
import { LendingPool, StakingPosition, YieldFarmingPool, LendingPosition } from '@/utils/defiService';

interface DeFiDashboardProps {
  userAddress: string;
}

export function DeFiDashboard({ userAddress }: DeFiDashboardProps) {
  const [activeTab, setActiveTab] = useState<'lending' | 'staking' | 'farming' | 'analytics'>('lending');
  const [lendingPools, setLendingPools] = useState<LendingPool[]>([]);
  const [stakingPositions, setStakingPositions] = useState<StakingPosition[]>([]);
  const [yieldFarmingPools, setYieldFarmingPools] = useState<YieldFarmingPool[]>([]);
  const [userPositions, setUserPositions] = useState<LendingPosition[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadDeFiData();
  }, [userAddress]);

  const loadDeFiData = async () => {
    setIsLoading(true);
    try {
      const [pools, staking, farming, analyticsData] = await Promise.all([
        [], // Mock lending pools data
        [], // Mock staking positions data  
        [], // Mock yield farming pools data
        defiService.getDeFiAnalytics(),
      ]);

      setLendingPools(pools);
      setStakingPositions(staking);
      setYieldFarmingPools(farming);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Failed to load DeFi data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderLendingTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Total Liquidity</h3>
          <p className="text-3xl font-bold text-blue-600">
            {analytics?.totalLiquidity?.toLocaleString() || '0'} HBAR
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-2">Total Borrowed</h3>
          <p className="text-3xl font-bold text-green-600">
            {analytics?.totalBorrowed?.toLocaleString() || '0'} HBAR
          </p>
        </div>
        <div className="bg-purple-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-purple-900 mb-2">Active Loans</h3>
          <p className="text-3xl font-bold text-purple-600">
            {analytics?.activeLoans || '0'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Lending Pools</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {lendingPools.map((pool) => (
              <div key={pool.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">Pool #{pool.id.slice(-8)}</h3>
                    <p className="text-sm text-gray-600">NFT: {pool.nftTokenId}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                    {pool.interestRate}% APY
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Liquidity</p>
                    <p className="font-semibold">{pool.totalLiquidity.toLocaleString()} HBAR</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Utilization</p>
                    <p className="font-semibold">{pool.utilizationRate.toFixed(1)}%</p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Provide Liquidity
                  </button>
                  <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                    Borrow
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStakingTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-orange-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-orange-900 mb-2">Total Staked</h3>
          <p className="text-3xl font-bold text-orange-600">
            {analytics?.totalStaked?.toLocaleString() || '0'} HBAR
          </p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-2">Active Stakers</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {analytics?.activeStakers || '0'}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-2">Total Rewards</h3>
          <p className="text-3xl font-bold text-green-600">
            {analytics?.totalRewards?.toLocaleString() || '0'} HBAR
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Your Staking Positions</h2>
        </div>
        <div className="p-6">
          {stakingPositions.length > 0 ? (
            <div className="space-y-4">
              {stakingPositions.map((position) => (
                <div key={position.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">NFT #{position.nftTokenId.slice(-8)}</h3>
                      <p className="text-sm text-gray-600">
                        Staked: {position.stakedAmount.toLocaleString()} HBAR
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      position.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {position.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">APY</p>
                      <p className="font-semibold">{position.apy.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Rewards</p>
                      <p className="font-semibold">{position.rewards.toLocaleString()} HBAR</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Unlock Date</p>
                      <p className="font-semibold">
                        {new Date(position.unlockDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    {position.status === 'UNLOCKED' && (
                      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                        Claim Rewards
                      </button>
                    )}
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No staking positions found</p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                Start Staking
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderFarmingTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Yield Farming Pools</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {yieldFarmingPools.map((pool) => (
              <div key={pool.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{pool.name}</h3>
                    <p className="text-sm text-gray-600">{pool.description}</p>
                  </div>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm">
                    {pool.apy.toFixed(1)}% APY
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Staked</p>
                    <p className="font-semibold">{pool.totalStaked.toLocaleString()} HBAR</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Participants</p>
                    <p className="font-semibold">{pool.participants}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600">Supported NFTs</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {pool.nftTokenIds.slice(0, 3).map((tokenId) => (
                      <span key={tokenId} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        #{tokenId.slice(-4)}
                      </span>
                    ))}
                    {pool.nftTokenIds.length > 3 && (
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        +{pool.nftTokenIds.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                  Join Pool
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Total Liquidity</h3>
          <p className="text-3xl font-bold text-blue-600">
            {analytics?.totalLiquidity?.toLocaleString() || '0'}
          </p>
          <p className="text-sm text-blue-600">HBAR</p>
        </div>
        <div className="bg-green-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-2">Total Borrowed</h3>
          <p className="text-3xl font-bold text-green-600">
            {analytics?.totalBorrowed?.toLocaleString() || '0'}
          </p>
          <p className="text-sm text-green-600">HBAR</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-purple-900 mb-2">Active Loans</h3>
          <p className="text-3xl font-bold text-purple-600">
            {analytics?.activeLoans || '0'}
          </p>
          <p className="text-sm text-purple-600">Loans</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-orange-900 mb-2">Average APY</h3>
          <p className="text-3xl font-bold text-orange-600">
            {analytics?.averageAPY?.toFixed(1) || '0'}%
          </p>
          <p className="text-sm text-orange-600">Annual</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Market Overview</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Top Performing Pools</h3>
              <div className="space-y-3">
                {lendingPools.slice(0, 5).map((pool, index) => (
                  <div key={pool.id} className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded">
                        #{index + 1}
                      </span>
                      <span className="text-sm text-gray-600">Pool {pool.id.slice(-8)}</span>
                    </div>
                    <span className="font-semibold text-green-600">
                      {pool.interestRate.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Risk Assessment</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Overall Risk Level</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                    Low Risk
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Liquidation Rate</span>
                  <span className="font-semibold">2.3%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Default Rate</span>
                  <span className="font-semibold">0.8%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">DeFi Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage your lending, staking, and yield farming positions
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'lending', label: 'Lending & Borrowing' },
                { id: 'staking', label: 'NFT Staking' },
                { id: 'farming', label: 'Yield Farming' },
                { id: 'analytics', label: 'Analytics' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'lending' && renderLendingTab()}
            {activeTab === 'staking' && renderStakingTab()}
            {activeTab === 'farming' && renderFarmingTab()}
            {activeTab === 'analytics' && renderAnalyticsTab()}
          </div>
        </div>
      </div>
    </div>
  );
}
