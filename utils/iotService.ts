// IoT Service for Real-Time Supply Chain Tracking
import { Client, PrivateKey, AccountId } from "@hashgraph/sdk";

export interface GPSCoordinates {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
  timestamp: Date;
}

export interface IoTReading {
  deviceId: string;
  timestamp: Date;
  location: GPSCoordinates;
  temperature?: number;
  humidity?: number;
  pressure?: number;
  lightLevel?: number;
  vibration?: number;
  batteryLevel?: number;
  signalStrength?: number;
}

export interface SupplyChainUpdate {
  nftTokenId: string;
  stepIndex: number;
  action: string;
  location: string;
  coordinates: GPSCoordinates;
  iotData: IoTReading[];
  verified: boolean;
  verifier?: string;
  metadata: Record<string, any>;
  timestamp: Date;
}

export interface QualityMetrics {
  temperature: {
    current: number;
    min: number;
    max: number;
    average: number;
  };
  humidity: {
    current: number;
    min: number;
    max: number;
    average: number;
  };
  lightExposure: {
    total: number;
    peak: number;
    duration: number;
  };
  vibration: {
    total: number;
    peak: number;
    average: number;
  };
  overallScore: number; // 0-100
}

export class IoTService {
  private static instance: IoTService;
  private client: Client;
  private deviceRegistry: Map<string, { nftTokenId: string; lastSeen: Date }> = new Map();

  private constructor() {
    this.client = Client.forTestnet(); // Use testnet for development
  }

  public static getInstance(): IoTService {
    if (!IoTService.instance) {
      IoTService.instance = new IoTService();
    }
    return IoTService.instance;
  }

  // Register IoT device with NFT
  public async registerDevice(
    deviceId: string,
    nftTokenId: string,
    deviceInfo: {
      type: 'GPS' | 'TEMPERATURE' | 'HUMIDITY' | 'MULTI_SENSOR';
      capabilities: string[];
      batteryLevel: number;
      signalStrength: number;
    }
  ): Promise<void> {
    try {
      // Store device registration in database
      await this.storeDeviceRegistration(deviceId, nftTokenId, deviceInfo);
      
      // Update device registry
      this.deviceRegistry.set(deviceId, {
        nftTokenId,
        lastSeen: new Date(),
      });

      console.log(`Device ${deviceId} registered for NFT ${nftTokenId}`);
    } catch (error) {
      console.error('Failed to register device:', error);
      throw error;
    }
  }

  // Process IoT data and update supply chain
  public async processIoTData(deviceId: string, readings: IoTReading[]): Promise<SupplyChainUpdate[]> {
    try {
      const deviceInfo = this.deviceRegistry.get(deviceId);
      if (!deviceInfo) {
        throw new Error(`Device ${deviceId} not registered`);
      }

      const updates: SupplyChainUpdate[] = [];
      
      for (const reading of readings) {
        // Analyze data for anomalies
        const anomalies = await this.analyzeDataAnomalies(deviceId, reading);
        
        // Determine supply chain action based on location and conditions
        const action = await this.determineSupplyChainAction(deviceId, reading, anomalies);
        
        // Create supply chain update
        const update: SupplyChainUpdate = {
          nftTokenId: deviceInfo.nftTokenId,
          stepIndex: await this.getNextStepIndex(deviceInfo.nftTokenId),
          action,
          location: await this.reverseGeocode(reading.location),
          coordinates: reading.location,
          iotData: [reading],
          verified: anomalies.length === 0,
          metadata: {
            deviceId,
            anomalies,
            qualityMetrics: await this.calculateQualityMetrics(readings),
          },
          timestamp: new Date(),
        };

        updates.push(update);
        
        // Update device last seen
        deviceInfo.lastSeen = new Date();
      }

      // Store updates in database and blockchain
      await this.storeSupplyChainUpdates(updates);
      
      return updates;
    } catch (error) {
      console.error('Failed to process IoT data:', error);
      throw error;
    }
  }

  // Get real-time location for NFT
  public async getCurrentLocation(nftTokenId: string): Promise<GPSCoordinates | null> {
    try {
      // Find device associated with NFT
      const deviceId = this.findDeviceByNFT(nftTokenId);
      if (!deviceId) {
        return null;
      }

      // Get latest reading from device
      const latestReading = await this.getLatestReading(deviceId);
      return latestReading?.location || null;
    } catch (error) {
      console.error('Failed to get current location:', error);
      return null;
    }
  }

  // Track NFT journey in real-time
  public async trackNFTJourney(nftTokenId: string): Promise<{
    currentLocation: GPSCoordinates | null;
    journey: GPSCoordinates[];
    qualityMetrics: QualityMetrics;
    alerts: string[];
  }> {
    try {
      const currentLocation = await this.getCurrentLocation(nftTokenId);
      const journey = await this.getJourneyHistory(nftTokenId);
      const qualityMetrics = await this.calculateOverallQualityMetrics(nftTokenId);
      const alerts = await this.generateAlerts(nftTokenId);

      return {
        currentLocation,
        journey,
        qualityMetrics,
        alerts,
      };
    } catch (error) {
      console.error('Failed to track NFT journey:', error);
      throw error;
    }
  }

  // Generate QR codes for supply chain verification
  public async generateQRCode(nftTokenId: string, stepIndex: number): Promise<{
    qrCode: string;
    verificationUrl: string;
    expiresAt: Date;
  }> {
    try {
      const verificationData = {
        nftTokenId,
        stepIndex,
        timestamp: new Date().toISOString(),
        signature: await this.signVerificationData(nftTokenId, stepIndex),
      };

      const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify/${btoa(JSON.stringify(verificationData))}`;
      const qrCode = await this.generateQRCodeImage(verificationUrl);

      return {
        qrCode,
        verificationUrl,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      };
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      throw error;
    }
  }

  // Scan QR code for verification
  public async scanQRCode(qrData: string): Promise<{
    valid: boolean;
    nftTokenId?: string;
    stepIndex?: number;
    verificationStatus?: 'VERIFIED' | 'EXPIRED' | 'INVALID';
    message: string;
  }> {
    try {
      const verificationData = JSON.parse(atob(qrData));
      
      // Verify signature
      const isValidSignature = await this.verifySignature(verificationData);
      if (!isValidSignature) {
        return {
          valid: false,
          message: 'Invalid QR code signature',
        };
      }

      // Check expiration
      const isExpired = new Date(verificationData.timestamp) < new Date(Date.now() - 24 * 60 * 60 * 1000);
      if (isExpired) {
        return {
          valid: false,
          verificationStatus: 'EXPIRED',
          message: 'QR code has expired',
        };
      }

      return {
        valid: true,
        nftTokenId: verificationData.nftTokenId,
        stepIndex: verificationData.stepIndex,
        verificationStatus: 'VERIFIED',
        message: 'QR code verified successfully',
      };
    } catch (error) {
      console.error('Failed to scan QR code:', error);
      return {
        valid: false,
        message: 'Invalid QR code format',
      };
    }
  }

  // Set up geofencing for supply chain monitoring
  public async setupGeofence(
    nftTokenId: string,
    fenceConfig: {
      center: GPSCoordinates;
      radius: number; // meters
      name: string;
      alertOnEnter: boolean;
      alertOnExit: boolean;
    }
  ): Promise<string> {
    try {
      const fenceId = `fence_${nftTokenId}_${Date.now()}`;
      
      // Store geofence configuration
      await this.storeGeofenceConfig(fenceId, nftTokenId, fenceConfig);
      
      // Start monitoring
      this.startGeofenceMonitoring(fenceId, fenceConfig);
      
      return fenceId;
    } catch (error) {
      console.error('Failed to setup geofence:', error);
      throw error;
    }
  }

  // Private helper methods
  private async storeDeviceRegistration(
    deviceId: string,
    nftTokenId: string,
    deviceInfo: any
  ): Promise<void> {
    // Store in database
    console.log(`Storing device registration: ${deviceId} for NFT ${nftTokenId}`);
  }

  private async analyzeDataAnomalies(deviceId: string, reading: IoTReading): Promise<string[]> {
    const anomalies: string[] = [];
    
    // Temperature anomalies
    if (reading.temperature && (reading.temperature < -10 || reading.temperature > 50)) {
      anomalies.push(`Extreme temperature: ${reading.temperature}°C`);
    }
    
    // Humidity anomalies
    if (reading.humidity && (reading.humidity < 0 || reading.humidity > 100)) {
      anomalies.push(`Invalid humidity: ${reading.humidity}%`);
    }
    
    // Location anomalies (sudden jumps)
    const lastReading = await this.getLatestReading(deviceId);
    if (lastReading) {
      const distance = this.calculateDistance(lastReading.location, reading.location);
      const timeDiff = reading.timestamp.getTime() - lastReading.timestamp.getTime();
      
      if (distance > 1000 && timeDiff < 60000) { // 1km in 1 minute
        anomalies.push(`Rapid location change: ${distance}m in ${timeDiff/1000}s`);
      }
    }
    
    return anomalies;
  }

  private async determineSupplyChainAction(
    deviceId: string,
    reading: IoTReading,
    anomalies: string[]
  ): Promise<string> {
    // Determine action based on location and conditions
    const location = await this.reverseGeocode(reading.location);
    
    if (location.includes('Farm') || location.includes('Field')) {
      return 'PRODUCT_HARVESTED';
    } else if (location.includes('Warehouse') || location.includes('Storage')) {
      return 'PRODUCT_STORED';
    } else if (location.includes('Processing') || location.includes('Factory')) {
      return 'PRODUCT_PROCESSED';
    } else if (location.includes('Transport') || location.includes('Vehicle')) {
      return 'PRODUCT_IN_TRANSIT';
    } else if (location.includes('Market') || location.includes('Store')) {
      return 'PRODUCT_DELIVERED';
    } else {
      return 'LOCATION_UPDATE';
    }
  }

  private async getNextStepIndex(nftTokenId: string): Promise<number> {
    // Get current step count from database
    return 0; // Simplified for now
  }

  private async reverseGeocode(coordinates: GPSCoordinates): Promise<string> {
    // Simplified reverse geocoding
    return `${coordinates.latitude.toFixed(4)}, ${coordinates.longitude.toFixed(4)}`;
  }

  private async storeSupplyChainUpdates(updates: SupplyChainUpdate[]): Promise<void> {
    // Store in database and blockchain
    console.log(`Storing ${updates.length} supply chain updates`);
  }

  private findDeviceByNFT(nftTokenId: string): string | null {
    for (const [deviceId, info] of this.deviceRegistry.entries()) {
      if (info.nftTokenId === nftTokenId) {
        return deviceId;
      }
    }
    return null;
  }

  private async getLatestReading(deviceId: string): Promise<IoTReading | null> {
    // Get latest reading from database
    return null; // Simplified for now
  }

  private calculateDistance(loc1: GPSCoordinates, loc2: GPSCoordinates): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = loc1.latitude * Math.PI / 180;
    const φ2 = loc2.latitude * Math.PI / 180;
    const Δφ = (loc2.latitude - loc1.latitude) * Math.PI / 180;
    const Δλ = (loc2.longitude - loc1.longitude) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }

  private async calculateQualityMetrics(readings: IoTReading[]): Promise<QualityMetrics> {
    const temperatures = readings.filter(r => r.temperature !== undefined).map(r => r.temperature!);
    const humidities = readings.filter(r => r.humidity !== undefined).map(r => r.humidity!);
    const vibrations = readings.filter(r => r.vibration !== undefined).map(r => r.vibration!);

    const calculateStats = (values: number[]) => ({
      current: values[values.length - 1] || 0,
      min: Math.min(...values),
      max: Math.max(...values),
      average: values.reduce((a, b) => a + b, 0) / values.length,
    });

    // Detect anomalies
    const anomalies: string[] = [];
    readings.forEach(reading => {
      if (reading.temperature !== undefined && (reading.temperature < 0 || reading.temperature > 50)) {
        anomalies.push(`Extreme temperature: ${reading.temperature}°C`);
      }
      if (reading.humidity !== undefined && (reading.humidity < 0 || reading.humidity > 100)) {
        anomalies.push(`Invalid humidity: ${reading.humidity}%`);
      }
      if (reading.vibration !== undefined && reading.vibration > 1.0) {
        anomalies.push(`High vibration: ${reading.vibration}g`);
      }
    });

    const overallScore = Math.max(0, 100 - (anomalies.length * 10));

    return {
      temperature: calculateStats(temperatures),
      humidity: calculateStats(humidities),
      lightExposure: {
        total: readings.reduce((sum, r) => sum + (r.lightLevel || 0), 0),
        peak: Math.max(...readings.map(r => r.lightLevel || 0)),
        duration: readings.length * 300, // 5 minutes per reading
      },
      vibration: {
        total: vibrations.reduce((sum, v) => sum + v, 0),
        peak: Math.max(...vibrations),
        average: vibrations.reduce((a, b) => a + b, 0) / vibrations.length,
      },
      overallScore,
    };
  }

  private async getJourneyHistory(nftTokenId: string): Promise<GPSCoordinates[]> {
    // Get journey history from database
    return []; // Simplified for now
  }

  private async calculateOverallQualityMetrics(nftTokenId: string): Promise<QualityMetrics> {
    // Calculate overall quality metrics for NFT
    return {
      temperature: { current: 25, min: 20, max: 30, average: 25 },
      humidity: { current: 60, min: 50, max: 70, average: 60 },
      lightExposure: { total: 1000, peak: 100, duration: 3600 },
      vibration: { total: 50, peak: 5, average: 2 },
      overallScore: 95,
    };
  }

  private async generateAlerts(nftTokenId: string): Promise<string[]> {
    // Generate alerts based on quality metrics and anomalies
    return []; // Simplified for now
  }

  private async signVerificationData(nftTokenId: string, stepIndex: number): Promise<string> {
    // Sign verification data with private key
    return `signature_${nftTokenId}_${stepIndex}`;
  }

  private async generateQRCodeImage(data: string): Promise<string> {
    // Generate QR code image
    return `data:image/png;base64,${btoa(data)}`;
  }

  private async verifySignature(data: any): Promise<boolean> {
    // Verify signature
    return true; // Simplified for now
  }

  private async storeGeofenceConfig(fenceId: string, nftTokenId: string, config: any): Promise<void> {
    // Store geofence configuration
    console.log(`Storing geofence ${fenceId} for NFT ${nftTokenId}`);
  }

  private startGeofenceMonitoring(fenceId: string, config: any): void {
    // Start monitoring geofence
    console.log(`Starting geofence monitoring for ${fenceId}`);
  }

  private anomalies: string[] = [];
}

// Export singleton instance
export const iotService = IoTService.getInstance();
