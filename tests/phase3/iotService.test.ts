// IoT Service Tests for Phase 3
import { iotService, GPSCoordinates, IoTReading, SupplyChainUpdate } from '../../utils/iotService';

describe('IoT Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Device Registration', () => {
    it('should register IoT device with NFT', async () => {
      const deviceId = 'device_001';
      const nftTokenId = '0.0.123456';
      const deviceInfo = {
        type: 'MULTI_SENSOR' as const,
        capabilities: ['GPS', 'TEMPERATURE', 'HUMIDITY'],
        batteryLevel: 85,
        signalStrength: 95,
      };

      await expect(iotService.registerDevice(deviceId, nftTokenId, deviceInfo))
        .resolves.not.toThrow();

      console.log(`Device ${deviceId} registered for NFT ${nftTokenId}`);
    });

    it('should handle device registration errors', async () => {
      const deviceId = '';
      const nftTokenId = '0.0.123456';
      const deviceInfo = {
        type: 'GPS' as const,
        capabilities: ['GPS'],
        batteryLevel: 100,
        signalStrength: 90,
      };

      await expect(iotService.registerDevice(deviceId, nftTokenId, deviceInfo))
        .rejects.toThrow();
    });
  });

  describe('IoT Data Processing', () => {
    const mockReadings: IoTReading[] = [
      {
        deviceId: 'device_001',
        timestamp: new Date('2024-01-15T10:00:00Z'),
        location: {
          latitude: 6.5244,
          longitude: 3.3792,
          altitude: 10,
          accuracy: 5,
          timestamp: new Date('2024-01-15T10:00:00Z'),
        },
        temperature: 25.5,
        humidity: 60,
        pressure: 1013.25,
        lightLevel: 500,
        vibration: 0.1,
        batteryLevel: 85,
        signalStrength: 95,
      },
      {
        deviceId: 'device_001',
        timestamp: new Date('2024-01-15T10:05:00Z'),
        location: {
          latitude: 6.5245,
          longitude: 3.3793,
          altitude: 10,
          accuracy: 5,
          timestamp: new Date('2024-01-15T10:05:00Z'),
        },
        temperature: 26.0,
        humidity: 58,
        pressure: 1013.20,
        lightLevel: 520,
        vibration: 0.05,
        batteryLevel: 84,
        signalStrength: 94,
      },
    ];

    it('should process IoT data and create supply chain updates', async () => {
      // First register the device
      await iotService.registerDevice('device_001', '0.0.123456', {
        type: 'MULTI_SENSOR',
        capabilities: ['GPS', 'TEMPERATURE', 'HUMIDITY'],
        batteryLevel: 85,
        signalStrength: 95,
      });

      const updates = await iotService.processIoTData('device_001', mockReadings);

      expect(updates).toHaveLength(2);
      expect(updates[0]).toHaveProperty('nftTokenId', '0.0.123456');
      expect(updates[0]).toHaveProperty('action');
      expect(updates[0]).toHaveProperty('location');
      expect(updates[0]).toHaveProperty('coordinates');
      expect(updates[0]).toHaveProperty('iotData');
      expect(updates[0]).toHaveProperty('verified');
      expect(updates[0]).toHaveProperty('metadata');

      console.log(`Processed ${updates.length} IoT readings into supply chain updates`);
    });

    it('should detect anomalies in IoT data', async () => {
      const anomalousReadings: IoTReading[] = [
        {
          deviceId: 'device_001',
          timestamp: new Date('2024-01-15T10:00:00Z'),
          location: {
            latitude: 6.5244,
            longitude: 3.3792,
            altitude: 10,
            accuracy: 5,
            timestamp: new Date('2024-01-15T10:00:00Z'),
          },
          temperature: 60, // Anomalously high temperature
          humidity: 60,
          batteryLevel: 85,
          signalStrength: 95,
        },
      ];

      await iotService.registerDevice('device_001', '0.0.123456', {
        type: 'TEMPERATURE',
        capabilities: ['TEMPERATURE'],
        batteryLevel: 85,
        signalStrength: 95,
      });

      const updates = await iotService.processIoTData('device_001', anomalousReadings);

      expect(updates).toHaveLength(1);
      expect(updates[0].verified).toBe(false);
      expect(updates[0].metadata.anomalies).toContain('Extreme temperature: 60°C');

      console.log(`Detected anomaly: ${updates[0].metadata.anomalies[0]}`);
    });

    it('should handle unregistered device', async () => {
      const readings: IoTReading[] = [
        {
          deviceId: 'unregistered_device',
          timestamp: new Date('2024-01-15T10:00:00Z'),
          location: {
            latitude: 6.5244,
            longitude: 3.3792,
            timestamp: new Date('2024-01-15T10:00:00Z'),
          },
          temperature: 25,
          batteryLevel: 80,
          signalStrength: 90,
        },
      ];

      await expect(iotService.processIoTData('unregistered_device', readings))
        .rejects.toThrow('Device unregistered_device not registered');
    });
  });

  describe('Location Tracking', () => {
    it('should get current location for NFT', async () => {
      // Register device first
      await iotService.registerDevice('device_001', '0.0.123456', {
        type: 'GPS',
        capabilities: ['GPS'],
        batteryLevel: 85,
        signalStrength: 95,
      });

      const location = await iotService.getCurrentLocation('0.0.123456');

      // Since we don't have actual device data, this will return null
      expect(location).toBeNull();
    });

    it('should track NFT journey', async () => {
      await iotService.registerDevice('device_001', '0.0.123456', {
        type: 'GPS',
        capabilities: ['GPS'],
        batteryLevel: 85,
        signalStrength: 95,
      });

      const journey = await iotService.trackNFTJourney('0.0.123456');

      expect(journey).toHaveProperty('currentLocation');
      expect(journey).toHaveProperty('journey');
      expect(journey).toHaveProperty('qualityMetrics');
      expect(journey).toHaveProperty('alerts');

      expect(journey.qualityMetrics).toHaveProperty('temperature');
      expect(journey.qualityMetrics).toHaveProperty('humidity');
      expect(journey.qualityMetrics).toHaveProperty('lightExposure');
      expect(journey.qualityMetrics).toHaveProperty('vibration');
      expect(journey.qualityMetrics).toHaveProperty('overallScore');
    });
  });

  describe('QR Code Management', () => {
    it('should generate QR code for verification', async () => {
      const nftTokenId = '0.0.123456';
      const stepIndex = 0;

      const qrCode = await iotService.generateQRCode(nftTokenId, stepIndex);

      expect(qrCode).toHaveProperty('qrCode');
      expect(qrCode).toHaveProperty('verificationUrl');
      expect(qrCode).toHaveProperty('expiresAt');

      expect(qrCode.qrCode).toMatch(/^data:image\/png;base64,/);
      expect(qrCode.verificationUrl).toContain('/verify/');
      expect(qrCode.expiresAt).toBeInstanceOf(Date);

      console.log(`Generated QR code for NFT ${nftTokenId}, step ${stepIndex}`);
    });

    it('should scan and verify QR code', async () => {
      // Generate a QR code first
      const qrCode = await iotService.generateQRCode('0.0.123456', 0);
      
      // Extract the verification data from URL
      const url = new URL(qrCode.verificationUrl);
      const pathParts = url.pathname.split('/');
      const qrData = pathParts[pathParts.length - 1];

      const result = await iotService.scanQRCode(qrData);

      expect(result).toHaveProperty('valid');
      expect(result).toHaveProperty('nftTokenId');
      expect(result).toHaveProperty('stepIndex');
      expect(result).toHaveProperty('verificationStatus');
      expect(result).toHaveProperty('message');

      expect(result.valid).toBe(true);
      expect(result.nftTokenId).toBe('0.0.123456');
      expect(result.stepIndex).toBe(0);
      expect(result.verificationStatus).toBe('VERIFIED');

      console.log(`QR code verification result: ${result.message}`);
    });

    it('should handle invalid QR code', async () => {
      const invalidQrData = 'invalid_qr_data';

      const result = await iotService.scanQRCode(invalidQrData);

      expect(result.valid).toBe(false);
      expect(result.message).toBe('Invalid QR code format');
    });
  });

  describe('Geofencing', () => {
    it('should setup geofence for supply chain monitoring', async () => {
      const nftTokenId = '0.0.123456';
      const fenceConfig = {
        center: {
          latitude: 6.5244,
          longitude: 3.3792,
          timestamp: new Date(),
        },
        radius: 100, // 100 meters
        name: 'Farm Boundary',
        alertOnEnter: true,
        alertOnExit: true,
      };

      const fenceId = await iotService.setupGeofence(nftTokenId, fenceConfig);

      expect(fenceId).toBeTruthy();
      expect(fenceId).toMatch(/^fence_/);
      expect(fenceId).toContain(nftTokenId);

      console.log(`Setup geofence ${fenceId} for NFT ${nftTokenId}`);
    });
  });

  describe('Error Handling', () => {
    it('should handle device registration errors gracefully', async () => {
      const deviceId = 'device_001';
      const nftTokenId = '';
      const deviceInfo = {
        type: 'GPS' as const,
        capabilities: ['GPS'],
        batteryLevel: 100,
        signalStrength: 90,
      };

      await expect(iotService.registerDevice(deviceId, nftTokenId, deviceInfo))
        .rejects.toThrow();
    });

    it('should handle IoT data processing errors gracefully', async () => {
      const invalidReadings: any[] = [
        {
          deviceId: 'device_001',
          timestamp: 'invalid_date',
          location: null,
        },
      ];

      await expect(iotService.processIoTData('device_001', invalidReadings))
        .rejects.toThrow();
    });
  });

  describe('Integration Tests', () => {
    it('should complete full IoT workflow', async () => {
      const deviceId = 'device_workflow_001';
      const nftTokenId = '0.0.workflow123';

      // 1. Register device
      await iotService.registerDevice(deviceId, nftTokenId, {
        type: 'MULTI_SENSOR',
        capabilities: ['GPS', 'TEMPERATURE', 'HUMIDITY', 'VIBRATION'],
        batteryLevel: 90,
        signalStrength: 95,
      });

      // 2. Process IoT data
      const readings: IoTReading[] = [
        {
          deviceId,
          timestamp: new Date('2024-01-15T10:00:00Z'),
          location: {
            latitude: 6.5244,
            longitude: 3.3792,
            timestamp: new Date('2024-01-15T10:00:00Z'),
          },
          temperature: 25,
          humidity: 60,
          vibration: 0.1,
          batteryLevel: 89,
          signalStrength: 94,
        },
      ];

      const updates = await iotService.processIoTData(deviceId, readings);

      // 3. Generate QR code
      const qrCode = await iotService.generateQRCode(nftTokenId, 0);

      // 4. Track journey
      const journey = await iotService.trackNFTJourney(nftTokenId);

      // 5. Setup geofence
      const fenceId = await iotService.setupGeofence(nftTokenId, {
        center: {
          latitude: 6.5244,
          longitude: 3.3792,
          timestamp: new Date(),
        },
        radius: 50,
        name: 'Test Farm',
        alertOnEnter: true,
        alertOnExit: false,
      });

      // Verify all components worked
      expect(updates).toHaveLength(1);
      expect(qrCode.qrCode).toBeTruthy();
      expect(journey.qualityMetrics).toBeTruthy();
      expect(fenceId).toBeTruthy();

      console.log('✅ Complete IoT workflow test passed');
    });
  });
});
