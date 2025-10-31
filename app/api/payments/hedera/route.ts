import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const {
            fromWallet,
            toWallet,
            amount,
            items,
            sellerId
        } = await request.json();

        // Validate required fields
        if (!fromWallet || !toWallet || !amount || !items || !sellerId) {
            return NextResponse.json(
                { error: 'Missing required fields: fromWallet, toWallet, amount, items, sellerId' },
                { status: 400 }
            );
        }

        // Validate amount
        if (amount <= 0) {
            return NextResponse.json(
                { error: 'Amount must be greater than 0' },
                { status: 400 }
            );
        }

        // Validate wallet formats (basic validation for Hedera format)
        const hederaWalletRegex = /^0\.0\.\d+$/;
        if (!hederaWalletRegex.test(toWallet)) {
            return NextResponse.json(
                { error: 'Invalid farmer wallet format. Expected Hedera format: 0.0.123456' },
                { status: 400 }
            );
        }

        // Simulate Hedera payment processing
        // In a real implementation, you would:
        // 1. Connect to Hedera network
        // 2. Create and submit transaction
        // 3. Wait for consensus
        // 4. Return transaction ID

        const transactionId = `hedera_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Create payment record in database
        const payment = await prisma.payment.create({
            data: {
                id: transactionId,
                amount: Math.round(amount * 100), // Convert to cents
                currency: 'HBAR',
                status: 'COMPLETED',
                paymentMethod: 'HEDERA',
                fromWallet,
                toWallet,
                sellerId,
                metadata: {
                    items: items.map((item: any) => ({
                        productId: item.productId,
                        listingId: item.listingId,
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price
                    })),
                    network: 'hedera-testnet',
                    transactionType: 'direct_payment'
                }
            }
        });

        // Update farmer's balance (optional - for tracking purposes)
        try {
            await prisma.user.update({
                where: { id: sellerId },
                data: {
                    // You might want to add a balance field to track earnings
                    updatedAt: new Date()
                }
            });
        } catch (error) {
            console.warn('Could not update farmer balance:', error);
        }

        // Log the transaction
        console.log(`Hedera payment processed:`, {
            transactionId,
            from: fromWallet,
            to: toWallet,
            amount: amount,
            currency: 'HBAR',
            sellerId,
            itemCount: items.length
        });

        return NextResponse.json({
            success: true,
            transactionId,
            amount,
            currency: 'HBAR',
            status: 'completed',
            network: 'hedera-testnet',
            message: 'Payment processed successfully'
        });

    } catch (error) {
        console.error('Hedera payment error:', error);

        return NextResponse.json(
            {
                error: 'Payment processing failed',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const transactionId = searchParams.get('transactionId');

        if (!transactionId) {
            return NextResponse.json(
                { error: 'Transaction ID is required' },
                { status: 400 }
            );
        }

        // Get payment status
        const payment = await prisma.payment.findUnique({
            where: { id: transactionId },
            select: {
                id: true,
                amount: true,
                currency: true,
                status: true,
                paymentMethod: true,
                fromWallet: true,
                toWallet: true,
                sellerId: true,
                createdAt: true,
                metadata: true
            }
        });

        if (!payment) {
            return NextResponse.json(
                { error: 'Payment not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            payment: {
                transactionId: payment.id,
                amount: payment.amount / 100, // Convert back from cents
                currency: payment.currency,
                status: payment.status.toLowerCase(),
                paymentMethod: payment.paymentMethod,
                fromWallet: payment.fromWallet,
                toWallet: payment.toWallet,
                sellerId: payment.sellerId,
                createdAt: payment.createdAt,
                metadata: payment.metadata
            }
        });

    } catch (error) {
        console.error('Error fetching payment status:', error);

        return NextResponse.json(
            { error: 'Failed to fetch payment status' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}