import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { logUserRegistration } from '@/utils/userActivityLogger';
import { getRoleDisplayName, getRolePermissions, UserRole } from '@/utils/roleManager';
import { z } from 'zod';
import { AGRO_CONTRACT_ID, hederaClient } from '@/lib/hederaClient';
import { ContractExecuteTransaction, ContractFunctionParameters } from '@hashgraph/sdk';


// Validation schema for create user request
const createUserSchema = z.object({
  userId: z.string().optional(), // Clerk user ID if provided
  email: z.string().email('Invalid email format'),
  role: z.enum(['BUYER', 'FARMER', 'DISTRIBUTOR', 'TRANSPORTER', 'AGROEXPERT', 'ADMIN']).default('BUYER'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  profileData: z.object({
    fullName: z.string().optional(),
    country: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    idNumber: z.string().optional(),
    hederaWallet: z.string().optional(),
  }).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate request body
    const validationResult = createUserSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        message: 'Invalid request data',
        errors: validationResult.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      }, { status: 400 });
    }

    const { userId: providedUserId, email, role, firstName, lastName, profileData } = validationResult.data;

    console.log('🔍 Creating user:', { email, role, firstName, lastName });

    // Use provided userId (from Clerk) or generate a unique ID
    const userId = providedUserId || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Check if user already exists by email
    const existingUser = await prisma.user.findFirst({
      where: { email }
    });

    if (existingUser) {
      console.log('⚠️ User already exists:', existingUser.id);
      return NextResponse.json({
        success: true,
        message: 'User already exists',
        data: existingUser
      });
    }

    // Create new user with validated role
    const newUser = await prisma.user.create({
      data: {
        id: userId,
        email,
        role: role as any
      }
    });

    // Create profile if profile data is provided
    let profile = null;
    if (profileData) {
      profile = await prisma.profile.create({
        data: {
          userId: newUser.id,
          type: role as any, // This will be validated by Prisma
          fullName: profileData.fullName || `${firstName || ''} ${lastName || ''}`.trim() || email.split('@')[0],
          country: profileData.country || '',
          address: profileData.address || '',
          phone: profileData.phone || '',
          idNumber: profileData.idNumber || '',
          hederaWallet: profileData.hederaWallet || 'Not provided',
        }
      });
    }

    if (role === "FARMER" && profile && profile.hederaWallet) {
      try {
        console.log("🌾 Executing registerFarmer() on Hedera...");
        console.log("📜 Contract ID:", AGRO_CONTRACT_ID.toString());
        console.log("👤 Wallet:", profile.hederaWallet);
    
        const tx = await new ContractExecuteTransaction()
          .setContractId(AGRO_CONTRACT_ID)
          .setGas(400_000)
          .setFunction(
            "registerFarmer",
            new ContractFunctionParameters().addAddress(profile.hederaWallet)
          )
          .execute(hederaClient); // Automatically signed using your operator key
    
        const receipt = await tx.getReceipt(hederaClient);
        console.log("✅ Hedera transaction status:", receipt.status.toString());
      } catch (hederaError: any) {
        console.error("❌ Hedera contract execution failed:", hederaError.message || hederaError);
      }
    }
    console.log('✅ User created successfully:', newUser);

    // Log user registration activity
    logUserRegistration(newUser.id, newUser.role, newUser.email, {
      registrationMethod: 'google_signin',
      timestamp: new Date().toISOString(),
      source: 'manual_creation'
    });

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      data: {
        user: newUser,
        profile: profile,
        roleInfo: {
          role: newUser.role,
          displayName: getRoleDisplayName(newUser.role as UserRole),
          permissions: getRolePermissions(newUser.role as UserRole)
        }
      }
    });

  } catch (error) {
    console.error('❌ Error creating user:', error);

    return NextResponse.json({
      success: false,
      message: 'Failed to create user',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// GET endpoint to retrieve available roles and their information
export async function GET() {
  try {
    const availableRoles = [
      {
        value: 'BUYER',
        displayName: getRoleDisplayName('BUYER' as UserRole),
        description: 'Individual or business that purchases agricultural products from farmers and distributors',
        permissions: getRolePermissions('BUYER' as UserRole),
        features: ['Browse products', 'Place orders', 'Track purchases', 'Rate farmers']
      },
      {
        value: 'FARMER',
        displayName: getRoleDisplayName('FARMER' as UserRole),
        description: 'Agricultural producer who grows and sells crops, livestock, and other farm products',
        permissions: getRolePermissions('FARMER' as UserRole),
        features: ['List products', 'Manage orders', 'Track sales', 'Access analytics']
      },
      {
        value: 'DISTRIBUTOR',
        displayName: getRoleDisplayName('DISTRIBUTOR' as UserRole),
        description: 'Supply chain intermediary who manages inventory and connects farmers with buyers',
        permissions: getRolePermissions('DISTRIBUTOR' as UserRole),
        features: ['Manage inventory', 'Connect suppliers', 'Track distribution', 'Market insights']
      },
      {
        value: 'TRANSPORTER',
        displayName: getRoleDisplayName('TRANSPORTER' as UserRole),
        description: 'Logistics provider who handles transportation and delivery of agricultural products',
        permissions: getRolePermissions('TRANSPORTER' as UserRole),
        features: ['Route optimization', 'Cargo tracking', 'Fleet management', 'Delivery analytics']
      },
      {
        value: 'AGROEXPERT',
        displayName: getRoleDisplayName('AGROEXPERT' as UserRole),
        description: 'Agricultural expert who sells products, leases equipment, and provides expert advice',
        permissions: getRolePermissions('AGROEXPERT' as UserRole),
        features: ['Sell products', 'Lease equipment', 'Expert consultations', 'Knowledge sharing']
      },
      {
        value: 'ADMIN',
        displayName: getRoleDisplayName('ADMIN' as UserRole),
        description: 'Platform administrator with full access to all features and user management',
        permissions: getRolePermissions('ADMIN' as UserRole),
        features: ['User management', 'System configuration', 'Analytics', 'Content moderation']
      }
    ];

    return NextResponse.json({
      success: true,
      message: 'Available roles retrieved successfully',
      data: {
        roles: availableRoles,
        defaultRole: 'BUYER'
      }
    });

  } catch (error) {
    console.error('❌ Error retrieving roles:', error);

    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve roles',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}







