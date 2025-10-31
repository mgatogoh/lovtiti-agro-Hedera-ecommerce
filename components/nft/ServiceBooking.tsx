// Service Booking Platform with Time-Slot Management
import React, { useState, useEffect } from 'react';
import { useServiceBooking } from '@/hooks/useNFT';
import { useWallet } from '@/hooks/useWallet';
import { BaseNFT, ServiceBooking as ServiceBookingType, ServiceAttributes } from '@/types/nft';

interface ServiceBookingProps {
  serviceNFT: BaseNFT;
  onBookingSuccess?: (booking: ServiceBookingType) => void;
  onClose?: () => void;
}

export function ServiceBooking({ serviceNFT, onBookingSuccess, onClose }: ServiceBookingProps) {
  const { wallet, isConnected, connectWallet } = useWallet();
  const { bookService, isLoading, error } = useServiceBooking();
  const [step, setStep] = useState<'calendar' | 'details' | 'confirm'>('calendar');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [duration, setDuration] = useState(1);
  const [location, setLocation] = useState('');
  const [requirements, setRequirements] = useState('');
  const [estimatedCost, setEstimatedCost] = useState(0);

  const attributes = serviceNFT.metadata.attributes;
  const isService = attributes.type === 'SERVICE';
  const serviceAttributes = isService ? attributes as ServiceAttributes : null;

  // Generate time slots for selected date
  const generateTimeSlots = (date: string) => {
    if (!date) return [];
    
    const slots = [];
    const startHour = 8; // 8 AM
    const endHour = 18; // 6 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      slots.push({
        time,
        available: Math.random() > 0.3, // Random availability for demo
      });
    }
    
    return slots;
  };

  const timeSlots = generateTimeSlots(selectedDate);

  // Calculate estimated cost
  useEffect(() => {
    if (serviceAttributes && duration > 0) {
      const hourlyRate = serviceAttributes.pricing.basePrice;
      const totalCost = hourlyRate * duration;
      setEstimatedCost(totalCost);
    }
  }, [duration, serviceAttributes]);

  const handleBooking = async () => {
    if (!wallet || !selectedDate || !selectedTimeSlot) return;

    try {
      const startTime = new Date(`${selectedDate}T${selectedTimeSlot}`);
      const endTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000);

      const booking = await bookService(
        serviceNFT.tokenId,
        startTime,
        endTime,
        location,
        requirements
      );

      if (onBookingSuccess) {
        onBookingSuccess(booking);
      }
    } catch (err) {
      console.error('Booking failed:', err);
    }
  };

  const renderCalendarStep = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Select Date & Time</h3>
        
        {/* Date Picker */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Time Slots */}
        {selectedDate && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Time Slots
            </label>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => setSelectedTimeSlot(slot.time)}
                  disabled={!slot.available}
                  className={`px-3 py-2 text-sm rounded-md ${
                    selectedTimeSlot === slot.time
                      ? 'bg-blue-600 text-white'
                      : slot.available
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Service Details */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Service Details</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Service Type:</span>
            <span className="font-medium">{serviceAttributes?.serviceType || 'Unknown'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Provider:</span>
            <span className="font-medium">{serviceAttributes?.provider.name || 'Unknown'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Rating:</span>
            <span className="font-medium">{serviceAttributes?.provider.rating || 0}/5 ⭐</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Rate:</span>
            <span className="font-medium">{serviceAttributes?.pricing.basePrice || 0} {serviceAttributes?.pricing.currency || 'USD'} per {serviceAttributes?.pricing.unit || 'hour'}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDetailsStep = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Booking Details</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (hours)
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>1 hour</option>
              <option value={2}>2 hours</option>
              <option value={3}>3 hours</option>
              <option value={4}>4 hours</option>
              <option value={8}>8 hours (Full day)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter service location address"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Requirements
            </label>
            <textarea
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="Describe any special requirements or instructions"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Base Rate:</span>
            <span className="font-medium">{serviceAttributes?.pricing.basePrice || 0} {serviceAttributes?.pricing.currency || 'USD'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Duration:</span>
            <span className="font-medium">{duration} hour(s)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Service Fee (5%):</span>
            <span className="font-medium">{(estimatedCost * 0.05).toFixed(2)} {serviceAttributes?.pricing.currency || 'USD'}</span>
          </div>
          <hr />
          <div className="flex justify-between text-lg font-semibold">
            <span>Total:</span>
            <span>{(estimatedCost * 1.05).toFixed(2)} {serviceAttributes?.pricing.currency || 'USD'}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConfirmStep = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="text-green-600 text-6xl mb-4">✓</div>
        <h3 className="font-semibold text-green-900 mb-2">Booking Confirmed!</h3>
        <p className="text-green-700">
          Your service booking has been confirmed. The service provider will be notified and will contact you shortly.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Booking Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Service:</span>
            <span className="font-medium">{serviceAttributes?.serviceType || 'Unknown'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Provider:</span>
            <span className="font-medium">{serviceAttributes?.provider.name || 'Unknown'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date & Time:</span>
            <span className="font-medium">
              {new Date(selectedDate).toLocaleDateString()} at {selectedTimeSlot}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Duration:</span>
            <span className="font-medium">{duration} hour(s)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Location:</span>
            <span className="font-medium">{location}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Cost:</span>
            <span className="font-medium">{(estimatedCost * 1.05).toFixed(2)} {serviceAttributes?.pricing.currency || 'USD'}</span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-4">What's Next?</h3>
        <div className="space-y-3 text-left">
          <div className="flex items-start">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full mr-3 mt-0.5">1</span>
            <span className="text-blue-700">You will receive a confirmation email with booking details</span>
          </div>
          <div className="flex items-start">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full mr-3 mt-0.5">2</span>
            <span className="text-blue-700">The service provider will contact you to confirm details</span>
          </div>
          <div className="flex items-start">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full mr-3 mt-0.5">3</span>
            <span className="text-blue-700">Payment will be processed when service is completed</span>
          </div>
          <div className="flex items-start">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full mr-3 mt-0.5">4</span>
            <span className="text-blue-700">You can rate and review the service after completion</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (!isService) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Invalid NFT Type</h2>
          <p className="text-gray-600 mb-6">This NFT is not a service NFT and cannot be booked.</p>
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Book Service</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          )}
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 'calendar' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 ${step === 'details' || step === 'confirm' ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 'details' ? 'bg-blue-600 text-white' : step === 'confirm' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
            <div className={`w-16 h-1 ${step === 'confirm' ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 'confirm' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              3
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Step Content */}
        {step === 'calendar' && renderCalendarStep()}
        {step === 'details' && renderDetailsStep()}
        {step === 'confirm' && renderConfirmStep()}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          {step === 'calendar' && (
            <>
              <button
                onClick={onClose}
                className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setStep('details')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                disabled={!selectedDate || !selectedTimeSlot}
              >
                Continue
              </button>
            </>
          )}

          {step === 'details' && (
            <>
              <button
                onClick={() => setStep('calendar')}
                className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleBooking}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                disabled={!isConnected || isLoading}
              >
                {!isConnected ? 'Connect Wallet' : isLoading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </>
          )}

          {step === 'confirm' && (
            <button
              onClick={onClose}
              className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Service Provider Dashboard Component
interface ServiceProviderDashboardProps {
  serviceNFT: BaseNFT;
}

export function ServiceProviderDashboard({ serviceNFT }: ServiceProviderDashboardProps) {
  const [bookings, setBookings] = useState<ServiceBookingType[]>([]);
  const [activeTab, setActiveTab] = useState<'bookings' | 'schedule' | 'analytics'>('bookings');

  // Mock bookings data
  useEffect(() => {
    const mockBookings: ServiceBookingType[] = [
      {
        id: '1',
        serviceTokenId: serviceNFT.tokenId,
        client: '0.0.123456',
        startTime: new Date('2024-01-20T09:00:00'),
        endTime: new Date('2024-01-20T11:00:00'),
        amount: 100,
        currency: 'USD',
        status: 'BOOKED',
        location: 'Lagos, Nigeria',
        requirements: 'Need help with soil analysis',
        createdAt: new Date(),
      },
      {
        id: '2',
        serviceTokenId: serviceNFT.tokenId,
        client: '0.0.789012',
        startTime: new Date('2024-01-22T14:00:00'),
        endTime: new Date('2024-01-22T16:00:00'),
        amount: 150,
        currency: 'USD',
        status: 'COMPLETED',
        location: 'Abuja, Nigeria',
        requirements: 'Equipment maintenance',
        createdAt: new Date(),
      },
    ];
    setBookings(mockBookings);
  }, [serviceNFT.tokenId]);

  const renderBookings = () => (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div key={booking.id} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Booking #{booking.id}</h3>
              <p className="text-sm text-gray-600">Client: {booking.client}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              booking.status === 'BOOKED' ? 'bg-blue-100 text-blue-800' :
              booking.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {booking.status}
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <span className="text-sm text-gray-600">Date:</span>
              <p className="font-medium">{new Date(booking.startTime).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Time:</span>
              <p className="font-medium">
                {new Date(booking.startTime).toLocaleTimeString()} - {new Date(booking.endTime).toLocaleTimeString()}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Amount:</span>
              <p className="font-medium">{booking.amount} {booking.currency}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Location:</span>
              <p className="font-medium">{booking.location}</p>
            </div>
          </div>

          {booking.requirements && (
            <div className="mb-4">
              <span className="text-sm text-gray-600">Requirements:</span>
              <p className="text-gray-900">{booking.requirements}</p>
            </div>
          )}

          {booking.status === 'BOOKED' && (
            <div className="flex space-x-3">
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                Accept
              </button>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                Decline
              </button>
            </div>
          )}

          {booking.feedback && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-2">
                <span className="text-sm text-gray-600">Client Feedback:</span>
                <div className="ml-2">
                  {[...Array(booking.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">⭐</span>
                  ))}
                </div>
              </div>
              <p className="text-gray-900">{booking.feedback}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {['bookings', 'schedule', 'analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'bookings' && renderBookings()}
        {activeTab === 'schedule' && (
          <div className="text-center py-12">
            <p className="text-gray-600">Schedule view coming soon...</p>
          </div>
        )}
        {activeTab === 'analytics' && (
          <div className="text-center py-12">
            <p className="text-gray-600">Analytics dashboard coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}
