import { handleUssd } from '../../backend/services/ussdService';

describe('USSD Service', () => {
	describe('Main Menu', () => {
		it('should show main menu for empty input', async () => {
			const response = await handleUssd({
				sessionId: 'test-session',
				text: '',
			});

			expect(response).toContain('Welcome to Lovtiti Agro Mart');
			expect(response).toContain('1. Browse listings');
			expect(response).toContain('2. My orders');
			expect(response).toContain('3. Help');
			expect(response).toContain('4. KYC Registration');
			expect(response).toContain('5. Track Order');
		});

		it('should show browse categories', async () => {
			const response = await handleUssd({
				sessionId: 'test-session',
				text: '1',
			});

			expect(response).toContain('Browse Products');
			expect(response).toContain('1. Grains');
			expect(response).toContain('2. Vegetables');
			expect(response).toContain('3. Fruits');
			expect(response).toContain('4. Livestock');
		});

		it('should handle help request', async () => {
			const response = await handleUssd({
				sessionId: 'test-session',
				text: '3',
			});

			expect(response).toContain('For help, call 0800-AGRO');
		});

		it('should handle order tracking request', async () => {
			const response = await handleUssd({
				sessionId: 'test-session',
				text: '2',
			});

			expect(response).toContain('Order tracking sent via SMS');
		});
	});

	describe('KYC Registration', () => {
		it('should show role selection for KYC', async () => {
			const response = await handleUssd({
				sessionId: 'test-session',
				text: '4',
			});

			expect(response).toContain('Select Role');
			expect(response).toContain('1. Farmer');
			expect(response).toContain('2. Distributor');
			expect(response).toContain('3. Transporter');
			expect(response).toContain('4. Buyer');
			expect(response).toContain('5. AGROEXPERT');
		});

		describe('Farmer KYC Flow', () => {
			it('should start farmer registration', async () => {
				const response = await handleUssd({
					sessionId: 'test-session',
					text: '4*1',
				});

				expect(response).toContain('Farmer Registration');
				expect(response).toContain('Enter Full Name:');
			});

			it('should progress through farmer KYC steps', async () => {
				const sessionId = 'test-session';

				// Step 1: Full name
				let response = await handleUssd({
					sessionId,
					text: '4*1*John Doe',
				});
				expect(response).toContain('Enter Phone Number:');

				// Step 2: Phone
				response = await handleUssd({
					sessionId,
					text: '4*1*John Doe*+2341234567890',
				});
				expect(response).toContain('Enter Country:');

				// Step 3: Country
				response = await handleUssd({
					sessionId,
					text: '4*1*John Doe*+2341234567890*Nigeria',
				});
				expect(response).toContain('Enter Farm Address:');

				// Step 4: Address
				response = await handleUssd({
					sessionId,
					text: '4*1*John Doe*+2341234567890*Nigeria*123 Farm Road, Lagos',
				});
				expect(response).toContain('Enter ID Number:');

				// Step 5: ID Number
				response = await handleUssd({
					sessionId,
					text: '4*1*John Doe*+2341234567890*Nigeria*123 Farm Road, Lagos*1234567890',
				});
				expect(response).toContain('Enter Farm Size (acres):');

				// Step 6: Farm Size
				response = await handleUssd({
					sessionId,
					text: '4*1*John Doe*+2341234567890*Nigeria*123 Farm Road, Lagos*1234567890*50',
				});
				expect(response).toContain('Enter Crop Types:');

				// Step 7: Crop Types
				response = await handleUssd({
					sessionId,
					text: '4*1*John Doe*+2341234567890*Nigeria*123 Farm Road, Lagos*1234567890*50*Rice, Maize',
				});
				expect(response).toContain('Enter Hedera Wallet:');

				// Step 8: Hedera Wallet
				response = await handleUssd({
					sessionId,
					text: '4*1*John Doe*+2341234567890*Nigeria*123 Farm Road, Lagos*1234567890*50*Rice, Maize*0.0.123456',
				});
				expect(response).toContain('KYC submitted successfully');
			});
		});

		describe('Distributor KYC Flow', () => {
			it('should start distributor registration', async () => {
				const response = await handleUssd({
					sessionId: 'test-session',
					text: '4*2',
				});

				expect(response).toContain('Distributor Registration');
				expect(response).toContain('Enter Full Name:');
			});

			it('should handle business license requirement', async () => {
				const sessionId = 'test-session';

				// Progress through initial steps
				let response = await handleUssd({
					sessionId,
					text: '4*2*Jane Smith*+2340987654321*Nigeria*456 Business Ave, Lagos*0987654321',
				});
				expect(response).toContain('Enter Business License:');

				// Business License
				response = await handleUssd({
					sessionId,
					text: '4*2*Jane Smith*+2340987654321*Nigeria*456 Business Ave, Lagos*0987654321*BL123456789',
				});
				expect(response).toContain('Enter Tax ID (optional):');
			});
		});

		describe('Transporter KYC Flow', () => {
			it('should start transporter registration', async () => {
				const response = await handleUssd({
					sessionId: 'test-session',
					text: '4*3',
				});

				expect(response).toContain('Transporter Registration');
				expect(response).toContain('Enter Full Name:');
			});

			it('should handle vehicle registration requirement', async () => {
				const sessionId = 'test-session';

				// Progress through initial steps
				let response = await handleUssd({
					sessionId,
					text: '4*3*Mike Johnson*+2345555555555*Nigeria*789 Transport Hub, Lagos*5555555555',
				});
				expect(response).toContain('Enter Vehicle Registration:');
			});
		});

		describe('Buyer KYC Flow', () => {
			it('should start buyer registration', async () => {
				const response = await handleUssd({
					sessionId: 'test-session',
					text: '4*4',
				});

				expect(response).toContain('Buyer Registration');
				expect(response).toContain('Enter Full Name:');
			});

			it('should handle business type and volume', async () => {
				const sessionId = 'test-session';

				// Progress through initial steps
				let response = await handleUssd({
					sessionId,
					text: '4*4*Sarah Wilson*+2347777777777*Nigeria*321 Market Street, Lagos*7777777777',
				});
				expect(response).toContain('Enter Business Type (optional):');

				// Business Type
				response = await handleUssd({
					sessionId,
					text: '4*4*Sarah Wilson*+2347777777777*Nigeria*321 Market Street, Lagos*7777777777*Restaurant Chain',
				});
				expect(response).toContain('Enter Monthly Volume (kg):');
			});
		});

		describe('AGROEXPERT KYC Flow', () => {
			it('should start AGROEXPERT registration', async () => {
				const response = await handleUssd({
					sessionId: 'test-session',
					text: '4*5',
				});

				expect(response).toContain('AGROEXPERT Registration');
				expect(response).toContain('Enter Full Name:');
			});

			it('should handle professional license requirement', async () => {
				const sessionId = 'test-session';

				// Progress through initial steps
				let response = await handleUssd({
					sessionId,
					text: '4*5*Dr. Emma Brown*+2349999999999*Nigeria*654 Clinic Road, Lagos*9999999999',
				});
				expect(response).toContain('Enter Professional License:');

				// Professional License
				response = await handleUssd({
					sessionId,
					text: '4*5*Dr. Emma Brown*+2349999999999*Nigeria*654 Clinic Road, Lagos*9999999999*PL123456789',
				});
				expect(response).toContain('Enter Years of Experience:');
			});
		});
	});

	describe('Order Tracking', () => {
		it('should prompt for order ID', async () => {
			const response = await handleUssd({
				sessionId: 'test-session',
				text: '5',
			});

			expect(response).toContain('Enter Order ID:');
			expect(response).toContain('Format: ORD-XXXXXX');
		});
	});

	describe('Error Handling', () => {
		it('should handle invalid selections', async () => {
			const response = await handleUssd({
				sessionId: 'test-session',
				text: '99',
			});

			expect(response).toContain('Invalid selection');
		});

		it('should handle invalid KYC role', async () => {
			const response = await handleUssd({
				sessionId: 'test-session',
				text: '4*99',
			});

			expect(response).toContain('Invalid selection');
		});
	});

	describe('Session Management', () => {
		it('should maintain session state across requests', async () => {
			const sessionId = 'persistent-session';

			// Start farmer registration
			await handleUssd({
				sessionId,
				text: '4*1',
			});

			// Continue with farmer data
			const response = await handleUssd({
				sessionId,
				text: '4*1*John Doe',
			});

			expect(response).toContain('Enter Phone Number:');
		});

		it('should handle different sessions independently', async () => {
			const session1 = 'session-1';
			const session2 = 'session-2';

			// Start farmer registration in session 1
			await handleUssd({
				sessionId: session1,
				text: '4*1',
			});

			// Start distributor registration in session 2
			await handleUssd({
				sessionId: session2,
				text: '4*2',
			});

			// Continue farmer registration in session 1
			const response1 = await handleUssd({
				sessionId: session1,
				text: '4*1*John Doe',
			});

			// Continue distributor registration in session 2
			const response2 = await handleUssd({
				sessionId: session2,
				text: '4*2*Jane Smith',
			});

			expect(response1).toContain('Enter Phone Number:');
			expect(response2).toContain('Enter Phone Number:');
		});
	});
});
