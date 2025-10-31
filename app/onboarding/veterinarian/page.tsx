'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Stethoscope, User, MapPin, Phone, CreditCard, Globe, CheckCircle, FileText, Award, Plus, X } from 'lucide-react';
import { agroExpertKycSchema } from "@/utils/validators";

export default function AGROEXPERTOnboarding() {
	const [formData, setFormData] = useState({
		fullName: '',
		phone: '',
		address: '',
		idNumber: '',
		hederaWallet: '',
		country: '',
		professionalLicense: '',
		productSupplierPermits: [''],
		agriculturalExpertiseCert: [''],
		specialization: [''],
		yearsOfExperience: '',
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [currentStep, setCurrentStep] = useState(1);
	const [status, setStatus] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const steps = [
		{ id: 1, title: 'Personal Info', icon: User },
		{ id: 2, title: 'Professional License', icon: FileText },
		{ id: 3, title: 'Certifications', icon: Award },
		{ id: 4, title: 'Wallet Setup', icon: CreditCard },
	];

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);

		try {
			const parsed = agroExpertKycSchema.safeParse({
				...formData,
				type: "AGROEXPERT" as const,
				productSupplierPermits: formData.productSupplierPermits.filter(permit => permit.trim() !== ''),
				agriculturalExpertiseCert: formData.agriculturalExpertiseCert.filter(cert => cert.trim() !== ''),
				specialization: formData.specialization.filter(spec => spec.trim() !== ''),
				yearsOfExperience: formData.yearsOfExperience ? parseInt(formData.yearsOfExperience) : undefined,
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
				router.push('/dashboard/agro-vet');
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

	const addItem = (field: string) => {
		const currentItems = formData[field as keyof typeof formData] as string[];
		setFormData({
			...formData,
			[field]: [...currentItems, '']
		});
	};

	const removeItem = (field: string, index: number) => {
		const currentItems = formData[field as keyof typeof formData] as string[];
		setFormData({
			...formData,
			[field]: currentItems.filter((_, i) => i !== index)
		});
	};

	const updateItem = (field: string, index: number, value: string) => {
		const currentItems = formData[field as keyof typeof formData] as string[];
		const updated = [...currentItems];
		updated[index] = value;
		setFormData({
			...formData,
			[field]: updated
		});
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 py-12">
			<div className="max-w-4xl mx-auto px-4">
				{/* Header */}
				<div className="text-center mb-8">
					<div className="flex items-center justify-center space-x-2 mb-4">
						<Stethoscope className="h-8 w-8 text-teal-600" />
						<span className="text-2xl font-bold text-teal-800">Lovtiti Agro Mart</span>
					</div>
					<h1 className="text-3xl font-bold text-gray-900 mb-2">AGROEXPERT Onboarding</h1>
					<p className="text-gray-600">Join our expert network and provide agricultural expertise</p>
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
									<div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${isActive
											? 'border-teal-600 bg-teal-600 text-white'
											: isCompleted
												? 'border-teal-600 bg-teal-600 text-white'
												: 'border-gray-300 bg-white text-gray-500'
										}`}>
										{isCompleted ? (
											<CheckCircle className="h-5 w-5" />
										) : (
											<Icon className="h-5 w-5" />
										)}
									</div>
									<span className={`ml-2 text-sm font-medium ${isActive ? 'text-teal-600' : isCompleted ? 'text-teal-600' : 'text-gray-500'
										}`}>
										{step.title}
									</span>
									{index < steps.length - 1 && (
										<div className={`w-16 h-0.5 mx-4 ${isCompleted ? 'bg-teal-600' : 'bg-gray-300'
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
							{currentStep === 2 && 'Professional License'}
							{currentStep === 3 && 'Certifications & Specialization'}
							{currentStep === 4 && 'Wallet Setup'}
						</CardTitle>
						<CardDescription className="text-center">
							{currentStep === 1 && 'Tell us about yourself'}
							{currentStep === 2 && 'Provide your professional veterinary license'}
							{currentStep === 3 && 'Add your certifications and areas of expertise'}
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
												placeholder="Dr. John Smith"
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
									<div>
										<Label htmlFor="yearsOfExperience">Years of Experience</Label>
										<Input
											id="yearsOfExperience"
											type="number"
											value={formData.yearsOfExperience}
											onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
											placeholder="e.g., 5"
										/>
									</div>
								</div>
							)}

							{/* Step 2: Professional License */}
							{currentStep === 2 && (
								<div className="space-y-6">
									<div>
										<Label htmlFor="professionalLicense" className="flex items-center space-x-2">
											<FileText className="h-4 w-4" />
											<span>Professional Veterinary License Number *</span>
										</Label>
										<Input
											id="professionalLicense"
											value={formData.professionalLicense}
											onChange={(e) => setFormData({ ...formData, professionalLicense: e.target.value })}
											placeholder="Veterinary license registration number"
											required
										/>
									</div>
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
											<span>Practice Address</span>
										</Label>
										<Input
											id="address"
											value={formData.address}
											onChange={(e) => setFormData({ ...formData, address: e.target.value })}
											placeholder="Street address, city, state"
											required
										/>
									</div>
								</div>
							)}

							{/* Step 3: Certifications & Specialization */}
							{currentStep === 3 && (
								<div className="space-y-6">
									<div>
										<Label className="flex items-center space-x-2">
											<Award className="h-4 w-4" />
											<span>Product Supplier Permits</span>
										</Label>
										<div className="space-y-2">
											{formData.productSupplierPermits.map((permit, index) => (
												<div key={index} className="flex items-center space-x-2">
													<Input
														value={permit}
														onChange={(e) => updateItem('productSupplierPermits', index, e.target.value)}
														placeholder={`Permit ${index + 1} (e.g., Vaccine supply permit)`}
													/>
													{formData.productSupplierPermits.length > 1 && (
														<Button
															type="button"
															variant="outline"
															size="sm"
															onClick={() => removeItem('productSupplierPermits', index)}
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
												onClick={() => addItem('productSupplierPermits')}
												className="flex items-center space-x-2"
											>
												<Plus className="h-4 w-4" />
												<span>Add Permit</span>
											</Button>
										</div>
									</div>

									<div>
										<Label className="flex items-center space-x-2">
											<Award className="h-4 w-4" />
											<span>Agricultural Expertise Certifications</span>
										</Label>
										<div className="space-y-2">
											{formData.agriculturalExpertiseCert.map((cert, index) => (
												<div key={index} className="flex items-center space-x-2">
													<Input
														value={cert}
														onChange={(e) => updateItem('agriculturalExpertiseCert', index, e.target.value)}
														placeholder={`Certification ${index + 1} (e.g., Livestock Management Certificate)`}
													/>
													{formData.agriculturalExpertiseCert.length > 1 && (
														<Button
															type="button"
															variant="outline"
															size="sm"
															onClick={() => removeItem('agriculturalExpertiseCert', index)}
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
												onClick={() => addItem('agriculturalExpertiseCert')}
												className="flex items-center space-x-2"
											>
												<Plus className="h-4 w-4" />
												<span>Add Certification</span>
											</Button>
										</div>
									</div>

									<div>
										<Label>Areas of Specialization</Label>
										<div className="space-y-2">
											{formData.specialization.map((spec, index) => (
												<div key={index} className="flex items-center space-x-2">
													<Input
														value={spec}
														onChange={(e) => updateItem('specialization', index, e.target.value)}
														placeholder={`Specialization ${index + 1} (e.g., Poultry, Cattle, Crop Protection)`}
													/>
													{formData.specialization.length > 1 && (
														<Button
															type="button"
															variant="outline"
															size="sm"
															onClick={() => removeItem('specialization', index)}
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
												onClick={() => addItem('specialization')}
												className="flex items-center space-x-2"
											>
												<Plus className="h-4 w-4" />
												<span>Add Specialization</span>
											</Button>
										</div>
									</div>
								</div>
							)}

							{/* Step 4: Wallet Setup */}
							{currentStep === 4 && (
								<div className="space-y-6">
									<div className="bg-teal-50 p-4 rounded-lg">
										<h3 className="font-semibold text-teal-800 mb-2">Why Hedera Wallet?</h3>
										<ul className="text-sm text-teal-700 space-y-1">
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
											Don't have a Hedera wallet? <a href="#" className="text-teal-600 hover:underline">Create one here</a>
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
											(currentStep === 2 && (!formData.professionalLicense || !formData.country || !formData.address)) ||
											(currentStep === 3 && false) // No required fields in step 3
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
