'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, User, MapPin, Phone, CreditCard, Globe, CheckCircle, Car, FileText, Plus, X } from 'lucide-react';
import { transporterKycSchema } from "@/utils/validators";

export default function TransporterOnboarding() {
	const [formData, setFormData] = useState({
		fullName: '',
		phone: '',
		address: '',
		idNumber: '',
		hederaWallet: '',
		country: '',
		vehicleRegistrations: [''],
		insurancePolicy: '',
		drivingLicense: '',
		fleetSize: '',
		vehicleTypes: [''],
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [currentStep, setCurrentStep] = useState(1);
	const [status, setStatus] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const steps = [
		{ id: 1, title: 'Personal Info', icon: User },
		{ id: 2, title: 'Vehicle Details', icon: Car },
		{ id: 3, title: 'Location & Fleet', icon: MapPin },
		{ id: 4, title: 'Wallet Setup', icon: CreditCard },
	];

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);

		try {
			const parsed = transporterKycSchema.safeParse({ 
				...formData, 
				type: "TRANSPORTER" as const,
				vehicleRegistrations: formData.vehicleRegistrations.filter(reg => reg.trim() !== ''),
				vehicleTypes: formData.vehicleTypes.filter(type => type.trim() !== ''),
				fleetSize: formData.fleetSize ? parseInt(formData.fleetSize) : undefined,
			});
			if (!parsed.success) {
				setError("Please correct the highlighted fields.");
				return;
			}

			const response = await fetch('/api/kyc/submit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(parsed.data),
			});

			if (response.ok) {
				const json = await response.json();
				setStatus(json.profile?.kycStatus ?? "PENDING");
				router.push('/dashboard/transporter');
			} else {
				setError("Failed to submit KYC.");
			}
		} catch (error) {
			console.error('Error submitting KYC:', error);
			setError("An error occurred. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const nextStep = () => {
		if (currentStep < steps.length) {
			setCurrentStep(currentStep + 1);
		}
	};

	const prevStep = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		}
	};

	const addVehicleRegistration = () => {
		setFormData({
			...formData,
			vehicleRegistrations: [...formData.vehicleRegistrations, '']
		});
	};

	const removeVehicleRegistration = (index: number) => {
		setFormData({
			...formData,
			vehicleRegistrations: formData.vehicleRegistrations.filter((_, i) => i !== index)
		});
	};

	const updateVehicleRegistration = (index: number, value: string) => {
		const updated = [...formData.vehicleRegistrations];
		updated[index] = value;
		setFormData({
			...formData,
			vehicleRegistrations: updated
		});
	};

	const addVehicleType = () => {
		setFormData({
			...formData,
			vehicleTypes: [...formData.vehicleTypes, '']
		});
	};

	const removeVehicleType = (index: number) => {
		setFormData({
			...formData,
			vehicleTypes: formData.vehicleTypes.filter((_, i) => i !== index)
		});
	};

	const updateVehicleType = (index: number, value: string) => {
		const updated = [...formData.vehicleTypes];
		updated[index] = value;
		setFormData({
			...formData,
			vehicleTypes: updated
		});
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 py-12">
			<div className="max-w-4xl mx-auto px-4">
				{/* Header */}
				<div className="text-center mb-8">
					<div className="flex items-center justify-center space-x-2 mb-4">
						<Truck className="h-8 w-8 text-orange-600" />
						<span className="text-2xl font-bold text-orange-800">Lovtiti Agro Mart</span>
					</div>
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Transporter Onboarding</h1>
					<p className="text-gray-600">Join our logistics network and start transporting agricultural products</p>
				</div>

				{/* Progress Steps */}
				<div className="mb-8">
					<div className="flex items-center justify-center space-x-4">
						{steps.map((step, index) => {
							const Icon = step.icon;
							const isActive = currentStep === step.id;
							const isCompleted = currentStep > step.id;
							
							return (
								<div key={step.id} className="flex items-center">
									<div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
										isActive 
											? 'border-orange-600 bg-orange-600 text-white' 
											: isCompleted 
											? 'border-orange-600 bg-orange-600 text-white'
											: 'border-gray-300 bg-white text-gray-500'
									}`}>
										{isCompleted ? (
											<CheckCircle className="h-5 w-5" />
										) : (
											<Icon className="h-5 w-5" />
										)}
									</div>
									<span className={`ml-2 text-sm font-medium ${
										isActive ? 'text-orange-600' : isCompleted ? 'text-orange-600' : 'text-gray-500'
									}`}>
										{step.title}
									</span>
									{index < steps.length - 1 && (
										<div className={`w-16 h-0.5 mx-4 ${
											isCompleted ? 'bg-orange-600' : 'bg-gray-300'
										}`} />
									)}
								</div>
							);
						})}
					</div>
				</div>

				<Card className="shadow-lg">
					<CardHeader>
						<CardTitle className="text-2xl text-center">
							{currentStep === 1 && 'Personal Information'}
							{currentStep === 2 && 'Vehicle Details'}
							{currentStep === 3 && 'Location & Fleet'}
							{currentStep === 4 && 'Wallet Setup'}
						</CardTitle>
						<CardDescription className="text-center">
							{currentStep === 1 && 'Tell us about yourself'}
							{currentStep === 2 && 'Provide vehicle registration and insurance details'}
							{currentStep === 3 && 'Where is your base located?'}
							{currentStep === 4 && 'Connect your Hedera wallet for secure payments'}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-6">
							{/* Step 1: Personal Information */}
							{currentStep === 1 && (
								<div className="space-y-6">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<Label htmlFor="fullName" className="flex items-center space-x-2">
												<User className="h-4 w-4" />
												<span>Full Name</span>
											</Label>
											<Input
												id="fullName"
												value={formData.fullName}
												onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
												placeholder="Enter your full name"
												required
											/>
										</div>
										<div>
											<Label htmlFor="phone" className="flex items-center space-x-2">
												<Phone className="h-4 w-4" />
												<span>Phone Number</span>
											</Label>
											<Input
												id="phone"
												type="tel"
												value={formData.phone}
												onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
												placeholder="+234 123 456 7890"
												required
											/>
										</div>
									</div>
									<div>
										<Label htmlFor="idNumber">ID Number</Label>
										<Input
											id="idNumber"
											value={formData.idNumber}
											onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
											placeholder="National ID or Passport Number"
											required
										/>
									</div>
								</div>
							)}

							{/* Step 2: Vehicle Details */}
							{currentStep === 2 && (
								<div className="space-y-6">
									<div>
										<Label className="flex items-center space-x-2">
											<Car className="h-4 w-4" />
											<span>Vehicle Registration Numbers *</span>
										</Label>
										<div className="space-y-2">
											{formData.vehicleRegistrations.map((registration, index) => (
												<div key={index} className="flex items-center space-x-2">
													<Input
														value={registration}
														onChange={(e) => updateVehicleRegistration(index, e.target.value)}
														placeholder={`Vehicle ${index + 1} registration number`}
														required={index === 0}
													/>
													{formData.vehicleRegistrations.length > 1 && (
														<Button
															type="button"
															variant="outline"
															size="sm"
															onClick={() => removeVehicleRegistration(index)}
														>
															<X className="h-4 w-4" />
														</Button>
													)}
												</div>
											))}
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={addVehicleRegistration}
												className="flex items-center space-x-2"
											>
												<Plus className="h-4 w-4" />
												<span>Add Vehicle</span>
											</Button>
										</div>
									</div>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<Label htmlFor="insurancePolicy" className="flex items-center space-x-2">
												<FileText className="h-4 w-4" />
												<span>Insurance Policy Number *</span>
											</Label>
											<Input
												id="insurancePolicy"
												value={formData.insurancePolicy}
												onChange={(e) => setFormData({ ...formData, insurancePolicy: e.target.value })}
												placeholder="Vehicle insurance policy number"
												required
											/>
										</div>
										<div>
											<Label htmlFor="drivingLicense">Driving License Number *</Label>
											<Input
												id="drivingLicense"
												value={formData.drivingLicense}
												onChange={(e) => setFormData({ ...formData, drivingLicense: e.target.value })}
												placeholder="Valid driving license number"
												required
											/>
										</div>
									</div>
								</div>
							)}

							{/* Step 3: Location & Fleet */}
							{currentStep === 3 && (
								<div className="space-y-6">
									<div>
										<Label htmlFor="country" className="flex items-center space-x-2">
											<Globe className="h-4 w-4" />
											<span>Country</span>
										</Label>
										<Input
											id="country"
											value={formData.country}
											onChange={(e) => setFormData({ ...formData, country: e.target.value })}
											placeholder="Nigeria"
											required
										/>
									</div>
									<div>
										<Label htmlFor="address" className="flex items-center space-x-2">
											<MapPin className="h-4 w-4" />
											<span>Base Location Address</span>
										</Label>
										<Input
											id="address"
											value={formData.address}
											onChange={(e) => setFormData({ ...formData, address: e.target.value })}
											placeholder="Street address, city, state"
											required
										/>
									</div>
									<div>
										<Label htmlFor="fleetSize">Fleet Size (Number of Vehicles)</Label>
										<Input
											id="fleetSize"
											type="number"
											value={formData.fleetSize}
											onChange={(e) => setFormData({ ...formData, fleetSize: e.target.value })}
											placeholder="e.g., 5"
										/>
									</div>
									<div>
										<Label>Vehicle Types</Label>
										<div className="space-y-2">
											{formData.vehicleTypes.map((type, index) => (
												<div key={index} className="flex items-center space-x-2">
													<Input
														value={type}
														onChange={(e) => updateVehicleType(index, e.target.value)}
														placeholder={`Vehicle type ${index + 1} (e.g., Truck, Van, Refrigerated Truck)`}
													/>
													{formData.vehicleTypes.length > 1 && (
														<Button
															type="button"
															variant="outline"
															size="sm"
															onClick={() => removeVehicleType(index)}
														>
															<X className="h-4 w-4" />
														</Button>
													)}
												</div>
											))}
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={addVehicleType}
												className="flex items-center space-x-2"
											>
												<Plus className="h-4 w-4" />
												<span>Add Vehicle Type</span>
											</Button>
										</div>
									</div>
								</div>
							)}

							{/* Step 4: Wallet Setup */}
							{currentStep === 4 && (
								<div className="space-y-6">
									<div className="bg-orange-50 p-4 rounded-lg">
										<h3 className="font-semibold text-orange-800 mb-2">Why Hedera Wallet?</h3>
										<ul className="text-sm text-orange-700 space-y-1">
											<li>• Secure blockchain-based payments</li>
											<li>• Low transaction fees</li>
											<li>• Fast settlement times</li>
											<li>• Transparent transaction history</li>
										</ul>
									</div>
									<div>
										<Label htmlFor="hederaWallet" className="flex items-center space-x-2">
											<CreditCard className="h-4 w-4" />
											<span>Hedera Wallet Address</span>
										</Label>
										<Input
											id="hederaWallet"
											value={formData.hederaWallet}
											onChange={(e) => setFormData({ ...formData, hederaWallet: e.target.value })}
											placeholder="0.0.123456"
											required
										/>
										<p className="text-sm text-gray-500 mt-1">
											Don't have a Hedera wallet? <a href="#" className="text-orange-600 hover:underline">Create one here</a>
										</p>
									</div>
								</div>
							)}

							{/* Status Messages */}
							{status && (
								<div className="bg-green-50 border border-green-200 rounded-lg p-4">
									<p className="text-green-700">KYC status: {status}</p>
								</div>
							)}
							{error && (
								<div className="bg-red-50 border border-red-200 rounded-lg p-4">
									<p className="text-red-700">{error}</p>
								</div>
							)}

							{/* Navigation Buttons */}
							<div className="flex justify-between pt-6">
								<Button
									type="button"
									variant="outline"
									onClick={prevStep}
									disabled={currentStep === 1}
								>
									Previous
								</Button>
								
								{currentStep < steps.length ? (
									<Button
										type="button"
										onClick={nextStep}
										disabled={
											(currentStep === 1 && (!formData.fullName || !formData.phone || !formData.idNumber)) ||
											(currentStep === 2 && (!formData.vehicleRegistrations[0] || !formData.insurancePolicy || !formData.drivingLicense)) ||
											(currentStep === 3 && (!formData.country || !formData.address))
										}
									>
										Next
									</Button>
								) : (
									<Button type="submit" disabled={isSubmitting || !formData.hederaWallet}>
										{isSubmitting ? 'Submitting...' : 'Complete Onboarding'}
									</Button>
								)}
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
