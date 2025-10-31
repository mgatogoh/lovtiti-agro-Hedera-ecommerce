// AI Service Tests for Phase 3
import { aiService, PricePrediction, NFTInsights, PortfolioAnalysis, MarketAnalytics, RecommendationEngine } from '../../utils/aiService';

describe('AI Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Price Prediction', () => {
    it('should predict NFT price', async () => {
      const nftTokenId = '0.0.price123';

      const prediction = await aiService.predictNFTPrice(nftTokenId);

      expect(prediction).toHaveProperty('nftTokenId', nftTokenId);
      expect(prediction).toHaveProperty('currentPrice');
      expect(prediction).toHaveProperty('predictedPrice');
      expect(prediction).toHaveProperty('confidence');
      expect(prediction).toHaveProperty('factors');
      expect(prediction).toHaveProperty('recommendation');
      expect(prediction).toHaveProperty('riskLevel');
      expect(prediction).toHaveProperty('timestamp');

      // Verify predicted price structure
      expect(prediction.predictedPrice).toHaveProperty('1D');
      expect(prediction.predictedPrice).toHaveProperty('7D');
      expect(prediction.predictedPrice).toHaveProperty('30D');

      // Verify confidence structure
      expect(prediction.confidence).toHaveProperty('1D');
      expect(prediction.confidence).toHaveProperty('7D');
      expect(prediction.confidence).toHaveProperty('30D');

      // Verify factors array
      expect(Array.isArray(prediction.factors)).toBe(true);
      prediction.factors.forEach(factor => {
        expect(factor).toHaveProperty('name');
        expect(factor).toHaveProperty('impact');
        expect(factor).toHaveProperty('weight');
        expect(factor).toHaveProperty('description');
        expect(['POSITIVE', 'NEGATIVE', 'NEUTRAL']).toContain(factor.impact);
        expect(factor.weight).toBeGreaterThan(0);
        expect(factor.weight).toBeLessThanOrEqual(1);
      });

      // Verify recommendation
      expect(['BUY', 'SELL', 'HOLD']).toContain(prediction.recommendation);

      // Verify risk level
      expect(['LOW', 'MEDIUM', 'HIGH']).toContain(prediction.riskLevel);

      console.log(`Price prediction for NFT ${nftTokenId}:`, {
        current: prediction.currentPrice,
        predicted: prediction.predictedPrice,
        recommendation: prediction.recommendation,
        riskLevel: prediction.riskLevel
      });
    });

    it('should handle price prediction errors', async () => {
      const invalidNFTId = '';

      await expect(aiService.predictNFTPrice(invalidNFTId))
        .rejects.toThrow();
    });
  });

  describe('Market Analysis', () => {
    it('should analyze market', async () => {
      const analytics = await aiService.analyzeMarket();

      expect(analytics).toHaveProperty('totalMarketCap');
      expect(analytics).toHaveProperty('totalVolume24h');
      expect(analytics).toHaveProperty('activeListings');
      expect(analytics).toHaveProperty('averagePrice');
      expect(analytics).toHaveProperty('priceChange24h');
      expect(analytics).toHaveProperty('topPerformers');
      expect(analytics).toHaveProperty('categoryBreakdown');
      expect(analytics).toHaveProperty('trends');
      expect(analytics).toHaveProperty('sentiment');

      // Verify data types
      expect(typeof analytics.totalMarketCap).toBe('number');
      expect(typeof analytics.totalVolume24h).toBe('number');
      expect(typeof analytics.activeListings).toBe('number');
      expect(typeof analytics.averagePrice).toBe('number');
      expect(typeof analytics.priceChange24h).toBe('number');

      // Verify arrays
      expect(Array.isArray(analytics.topPerformers)).toBe(true);
      expect(Array.isArray(analytics.categoryBreakdown)).toBe(true);
      expect(Array.isArray(analytics.trends)).toBe(true);

      // Verify sentiment structure
      expect(analytics.sentiment).toHaveProperty('bullish');
      expect(analytics.sentiment).toHaveProperty('bearish');
      expect(analytics.sentiment).toHaveProperty('neutral');
      expect(typeof analytics.sentiment.bullish).toBe('number');
      expect(typeof analytics.sentiment.bearish).toBe('number');
      expect(typeof analytics.sentiment.neutral).toBe('number');

      console.log('Market Analytics:', {
        marketCap: analytics.totalMarketCap,
        volume: analytics.totalVolume24h,
        change: analytics.priceChange24h,
        sentiment: analytics.sentiment
      });
    });
  });

  describe('NFT Insights', () => {
    it('should generate NFT insights', async () => {
      const nftTokenId = '0.0.insights123';

      const insights = await aiService.generateNFTInsights(nftTokenId);

      expect(insights).toHaveProperty('nftTokenId', nftTokenId);
      expect(insights).toHaveProperty('rarity');
      expect(insights).toHaveProperty('qualityScore');
      expect(insights).toHaveProperty('sustainabilityScore');
      expect(insights).toHaveProperty('marketDemand');
      expect(insights).toHaveProperty('supplyChainHealth');
      expect(insights).toHaveProperty('priceVolatility');
      expect(insights).toHaveProperty('liquidityScore');
      expect(insights).toHaveProperty('recommendations');
      expect(insights).toHaveProperty('riskFactors');
      expect(insights).toHaveProperty('opportunities');

      // Verify rarity
      expect(['COMMON', 'RARE', 'EPIC', 'LEGENDARY']).toContain(insights.rarity);

      // Verify scores (0-100)
      expect(insights.qualityScore).toBeGreaterThanOrEqual(0);
      expect(insights.qualityScore).toBeLessThanOrEqual(100);
      expect(insights.sustainabilityScore).toBeGreaterThanOrEqual(0);
      expect(insights.sustainabilityScore).toBeLessThanOrEqual(100);
      expect(insights.supplyChainHealth).toBeGreaterThanOrEqual(0);
      expect(insights.supplyChainHealth).toBeLessThanOrEqual(100);
      expect(insights.priceVolatility).toBeGreaterThanOrEqual(0);
      expect(insights.priceVolatility).toBeLessThanOrEqual(100);
      expect(insights.liquidityScore).toBeGreaterThanOrEqual(0);
      expect(insights.liquidityScore).toBeLessThanOrEqual(100);

      // Verify market demand
      expect(['LOW', 'MEDIUM', 'HIGH']).toContain(insights.marketDemand);

      // Verify arrays
      expect(Array.isArray(insights.recommendations)).toBe(true);
      expect(Array.isArray(insights.riskFactors)).toBe(true);
      expect(Array.isArray(insights.opportunities)).toBe(true);

      console.log(`NFT Insights for ${nftTokenId}:`, {
        rarity: insights.rarity,
        quality: insights.qualityScore,
        sustainability: insights.sustainabilityScore,
        demand: insights.marketDemand
      });
    });
  });

  describe('Portfolio Analysis', () => {
    it('should analyze portfolio', async () => {
      const owner = '0.0.portfolio123';

      const analysis = await aiService.analyzePortfolio(owner);

      expect(analysis).toHaveProperty('owner', owner);
      expect(analysis).toHaveProperty('totalValue');
      expect(analysis).toHaveProperty('diversification');
      expect(analysis).toHaveProperty('riskScore');
      expect(analysis).toHaveProperty('expectedReturns');
      expect(analysis).toHaveProperty('nftBreakdown');
      expect(analysis).toHaveProperty('recommendations');
      expect(analysis).toHaveProperty('performance');

      // Verify data types
      expect(typeof analysis.totalValue).toBe('number');
      expect(typeof analysis.diversification).toBe('number');
      expect(typeof analysis.riskScore).toBe('number');
      expect(typeof analysis.expectedReturns).toBe('number');

      // Verify score ranges
      expect(analysis.diversification).toBeGreaterThanOrEqual(0);
      expect(analysis.diversification).toBeLessThanOrEqual(100);
      expect(analysis.riskScore).toBeGreaterThanOrEqual(0);
      expect(analysis.riskScore).toBeLessThanOrEqual(100);

      // Verify arrays
      expect(Array.isArray(analysis.nftBreakdown)).toBe(true);
      expect(Array.isArray(analysis.recommendations)).toBe(true);

      // Verify performance structure
      expect(analysis.performance).toHaveProperty('1D');
      expect(analysis.performance).toHaveProperty('7D');
      expect(analysis.performance).toHaveProperty('30D');
      expect(analysis.performance).toHaveProperty('90D');

      // Verify recommendation structure
      analysis.recommendations.forEach(rec => {
        expect(rec).toHaveProperty('action');
        expect(rec).toHaveProperty('reason');
        expect(rec).toHaveProperty('priority');
        expect(['BUY', 'SELL', 'HOLD', 'DIVERSIFY']).toContain(rec.action);
        expect(['LOW', 'MEDIUM', 'HIGH']).toContain(rec.priority);
      });

      console.log(`Portfolio analysis for ${owner}:`, {
        totalValue: analysis.totalValue,
        diversification: analysis.diversification,
        riskScore: analysis.riskScore,
        expectedReturns: analysis.expectedReturns
      });
    });
  });

  describe('Recommendation Engine', () => {
    it('should generate recommendations', async () => {
      const userAddress = '0.0.recommendation123';

      const recommendations = await aiService.generateRecommendations(userAddress);

      expect(recommendations).toHaveProperty('personalizedRecommendations');
      expect(recommendations).toHaveProperty('marketOpportunities');
      expect(recommendations).toHaveProperty('riskWarnings');

      // Verify personalized recommendations
      expect(Array.isArray(recommendations.personalizedRecommendations)).toBe(true);
      recommendations.personalizedRecommendations.forEach(rec => {
        expect(rec).toHaveProperty('nftTokenId');
        expect(rec).toHaveProperty('action');
        expect(rec).toHaveProperty('confidence');
        expect(rec).toHaveProperty('reasoning');
        expect(['BUY', 'SELL', 'HOLD']).toContain(rec.action);
        expect(rec.confidence).toBeGreaterThanOrEqual(0);
        expect(rec.confidence).toBeLessThanOrEqual(100);
      });

      // Verify market opportunities
      expect(Array.isArray(recommendations.marketOpportunities)).toBe(true);
      recommendations.marketOpportunities.forEach(opp => {
        expect(opp).toHaveProperty('category');
        expect(opp).toHaveProperty('opportunity');
        expect(opp).toHaveProperty('potentialReturn');
        expect(opp).toHaveProperty('risk');
        expect(['LOW', 'MEDIUM', 'HIGH']).toContain(opp.risk);
      });

      // Verify risk warnings
      expect(Array.isArray(recommendations.riskWarnings)).toBe(true);
      recommendations.riskWarnings.forEach(warning => {
        expect(warning).toHaveProperty('nftTokenId');
        expect(warning).toHaveProperty('warning');
        expect(warning).toHaveProperty('severity');
        expect(['LOW', 'MEDIUM', 'HIGH']).toContain(warning.severity);
      });

      console.log(`Generated recommendations for ${userAddress}:`, {
        personalized: recommendations.personalizedRecommendations.length,
        opportunities: recommendations.marketOpportunities.length,
        warnings: recommendations.riskWarnings.length
      });
    });
  });

  describe('Trend Analysis', () => {
    it('should analyze trends', async () => {
      const timeframe = '7D';

      const trends = await aiService.analyzeTrends(timeframe);

      expect(Array.isArray(trends)).toBe(true);

      trends.forEach(trend => {
        expect(trend).toHaveProperty('timeframe');
        expect(trend).toHaveProperty('direction');
        expect(trend).toHaveProperty('confidence');
        expect(trend).toHaveProperty('priceChange');
        expect(trend).toHaveProperty('volume');
        expect(trend).toHaveProperty('marketCap');
        expect(trend).toHaveProperty('timestamp');

        expect(['1H', '4H', '1D', '1W', '1M']).toContain(trend.timeframe);
        expect(['UP', 'DOWN', 'SIDEWAYS']).toContain(trend.direction);
        expect(trend.confidence).toBeGreaterThanOrEqual(0);
        expect(trend.confidence).toBeLessThanOrEqual(100);
        expect(typeof trend.priceChange).toBe('number');
        expect(typeof trend.volume).toBe('number');
        expect(typeof trend.marketCap).toBe('number');
      });

      console.log(`Analyzed ${trends.length} trends for timeframe ${timeframe}`);
    });
  });

  describe('Anomaly Detection', () => {
    it('should detect anomalies', async () => {
      const nftTokenId = '0.0.anomaly123';

      const anomalies = await aiService.detectAnomalies(nftTokenId);

      expect(anomalies).toHaveProperty('anomalies');
      expect(anomalies).toHaveProperty('severity');
      expect(anomalies).toHaveProperty('recommendations');

      expect(Array.isArray(anomalies.anomalies)).toBe(true);
      expect(['LOW', 'MEDIUM', 'HIGH']).toContain(anomalies.severity);
      expect(Array.isArray(anomalies.recommendations)).toBe(true);

      console.log(`Anomaly detection for NFT ${nftTokenId}:`, {
        anomalies: anomalies.anomalies.length,
        severity: anomalies.severity,
        recommendations: anomalies.recommendations.length
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle service errors gracefully', async () => {
      // Test with invalid parameters
      await expect(aiService.predictNFTPrice(''))
        .rejects.toThrow();

      await expect(aiService.generateNFTInsights(''))
        .rejects.toThrow();

      await expect(aiService.analyzePortfolio(''))
        .rejects.toThrow();
    });
  });

  describe('Integration Tests', () => {
    it('should complete full AI workflow', async () => {
      const nftTokenId = '0.0.integration123';
      const userAddress = '0.0.user456';

      // 1. Price prediction
      const pricePrediction = await aiService.predictNFTPrice(nftTokenId);
      console.log(`✅ Price prediction: ${pricePrediction.recommendation} (${pricePrediction.riskLevel} risk)`);

      // 2. NFT insights
      const insights = await aiService.generateNFTInsights(nftTokenId);
      console.log(`✅ NFT insights: ${insights.rarity} quality, ${insights.marketDemand} demand`);

      // 3. Market analysis
      const marketAnalytics = await aiService.analyzeMarket();
      console.log(`✅ Market analysis: ${marketAnalytics.totalMarketCap} market cap`);

      // 4. Portfolio analysis
      const portfolioAnalysis = await aiService.analyzePortfolio(userAddress);
      console.log(`✅ Portfolio analysis: ${portfolioAnalysis.totalValue} value, ${portfolioAnalysis.riskScore} risk`);

      // 5. Recommendations
      const recommendations = await aiService.generateRecommendations(userAddress);
      console.log(`✅ Recommendations: ${recommendations.personalizedRecommendations.length} personalized`);

      // 6. Trend analysis
      const trends = await aiService.analyzeTrends('1D');
      console.log(`✅ Trend analysis: ${trends.length} trends analyzed`);

      // 7. Anomaly detection
      const anomalies = await aiService.detectAnomalies(nftTokenId);
      console.log(`✅ Anomaly detection: ${anomalies.anomalies.length} anomalies found`);

      // Verify all components worked
      expect(pricePrediction.recommendation).toMatch(/BUY|SELL|HOLD/);
      expect(insights.rarity).toMatch(/COMMON|RARE|EPIC|LEGENDARY/);
      expect(marketAnalytics.totalMarketCap).toBeGreaterThan(0);
      expect(portfolioAnalysis.totalValue).toBeGreaterThanOrEqual(0);
      expect(recommendations.personalizedRecommendations.length).toBeGreaterThanOrEqual(0);
      expect(trends.length).toBeGreaterThanOrEqual(0);
      expect(anomalies.severity).toMatch(/LOW|MEDIUM|HIGH/);

      console.log('✅ Complete AI workflow test passed');
    });
  });
});
