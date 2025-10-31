'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, User, MapPin, Phone, CreditCard, Globe, CheckCircle, Building2, FileText } from 'lucide-react';
import { distributorKycSchema } from "@/utils/validators";

export default function DistributorOnboarding() {
	const [formData, setFormData] = useState({
		fullName: '',
		phone: '',
		address: '',
		idNumber: '',
		hederaWallet: '',
		country: '',
		businessLicense: '',
		warehouseCert: '',
		taxId: '',
		businessType: '',
		storageCapacity: '',
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [currentStep, setCurrentStep] = useState(1);
	const [status, setStatus] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const steps = [
		{ id: 1, title: 'Personal Info', icon: User },
		{ id: 2, title: 'Business Details', icon: Building2 },
		{ id: 3, title: 'Location & Storage', icon: MapPin },
			{ id: 4, title: 'Wallet Setup', icon: CreditCard },
	];

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);

		try {
			const parsed = distributorKycSchema.safeParse({ 
				...formData, 
				type: "DISTRIBUTOR" as const,
				storageCapacity: formData.storageCapacity ? parseInt(formData.storageCapacity) : undefined,
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
				router.push('/dashboard/distributor');
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

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12">
			<div className="max-w-4xl mx-auto px-4">
				{/* Header */}
				<div className="text-center mb-8">
					<div className="flex items-center justify-center space-x-2 mb-4">
						<Package className="h-8 w-8 text-purple-600" />
						<span className="text-2xl font-bold text-purple-800">Lovtiti Agro Mart</span>
					</div>
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Distributor Onboarding</h1>
					<p className="text-gray-600">Join our marketplace as a distribution partner</p>
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
											? 'border-purple-600 bg-purple-600 text-white' 
											: isCompleted 
											? 'border-purple-600 bg-purple-600 text-white'
											: 'border-gray-300 bg-white text-gray-500'
									}`}>
										{isCompleted ? (
											<CheckCircle className="h-5 w-5" />
										) : (
											<Icon className="h-5 w-5" />
										)}
									</div>
									<span className={`ml-2 text-sm font-medium ${
										isActive ? 'text-purple-600' : isCompleted ? 'text-purple-600' : 'text-gray-500'
									}`}>
										{step.title}
									</span>
									{index < steps.length - 1 && (
										<div className={`w-16 h-0.5 mx-4 ${
											isCompleted ? 'bg-purple-600' : 'bg-gray-300'
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
							{currentStep === 2 && 'Business Details'}
							{currentStep === 3 && 'Location & Storage'}
							{currentStep === 4 && 'Wallet Setup'}
						</CardTitle>
						<CardDescription className="text-center">
							{currentStep === 1 && 'Tell us about yourself'}
							{currentStep === 2 && 'Provide your business registration details'}
							{currentStep === 3 && 'Where is your warehouse located?'}
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

							{/* Step 2: Business Details */}
							{currentStep === 2 && (
								<div className="space-y-6">
									<div>
										<Label htmlFor="businessLicense" className="flex items-center space-x-2">
											<FileText className="h-4 w-4" />
											<span>Business License Number *</span>
										</Label>
										<Input
											id="businessLicense"
											value={formData.businessLicense}
											onChange={(e) => setFormData({ ...formData, businessLicense: e.target.value })}
											placeholder="Business registration number"
											required
										/>
									</div>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<Label htmlFor="warehouseCert">Warehouse Certification</Label>
											<Input
												id="warehouseCert"
												value={formData.warehouseCert}
												onChange={(e) => setFormData({ ...formData, warehouseCert: e.target.value })}
												placeholder="Warehouse certification number"
											/>
										</div>
										<div>
											<Label htmlFor="taxId">Tax ID Number</Label>
											<Input
												id="taxId"
												value={formData.taxId}
												onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
												placeholder="Tax identification number"
											/>
										</div>
									</div>
									<div>
										<Label htmlFor="businessType">Business Type</Label>
										<Input
											id="businessType"
											value={formData.businessType}
											onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
											placeholder="e.g., Agricultural products distributor, Food wholesaler"
										/>
									</div>
								</div>
							)}

							{/* Step 3: Location & Storage */}
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
											<span>Warehouse Address</span>
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
										<Label htmlFor="storageCapacity">Storage Capacity (tons)</Label>
										<Input
											id="storageCapacity"
											type="number"
											value={formData.storageCapacity}
											onChange={(e) => setFormData({ ...formData, storageCapacity: e.target.value })}
											placeholder="e.g., 1000"
										/>
									</div>
								</div>
							)}

							{/* Step 4: Wallet Setup */}
							{currentStep === 4 && (
								<div className="space-y-6">
									<div className="bg-purple-50 p-4 rounded-lg">
										<h3 className="font-semibold text-purple-800 mb-2">Why Hedera Wallet?</h3>
										<ul className="text-sm text-purple-700 space-y-1">
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
											Don't have a Hedera wallet? <a href="#" className="text-purple-600 hover:underline">Create one here</a>
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
											(currentStep === 2 && !formData.businessLicense) ||
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
