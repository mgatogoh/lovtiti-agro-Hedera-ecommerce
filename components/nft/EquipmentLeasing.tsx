// Equipment Leasing Interface
import React from 'react';
import { BaseNFT, EquipmentLease } from '@/types/nft';

interface EquipmentLeasingProps {
  equipmentNFT: BaseNFT;
  onLeaseSuccess?: (lease: EquipmentLease) => void;
  onClose?: () => void;
}

export function EquipmentLeasing({ equipmentNFT, onLeaseSuccess, onClose }: EquipmentLeasingProps) {
  // Component temporarily disabled due to type issues
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Equipment Leasing</h2>
        <p className="text-gray-600 mb-6">This feature is temporarily unavailable.</p>
        {onClose && (
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}