# Cursor Rules for Lovtiti Agro Mart

## Project Context
- Project Name: Lovtiti Agro Mart
- Description: A web-based decentralized marketplace for African farmers and buyers, using Hedera Hashgraph for transactions, Clerk for authentication, Stripe for payments, and Neon (PostgreSQL) with Prisma for data storage. Requires KYC for buyers and farmers, mandatory accounts.
- Tech Stack:
  - Frontend: Next.js (TypeScript), TailwindCSS, Shadcn, Radix UI
  - Backend: Next.js API routes, Node.js (USSD), Prisma (Neon PostgreSQL)
  - Blockchain: Hedera Hashgraph (HBAR, smart contracts)
  - Authentication: Clerk
  - Payments: Stripe
  - Storage: Neon (PostgreSQL), optional IPFS for images
  - Deployment: Vercel, GitHub, Jest/Cypress

## Coding Standards
1. **Language**: Use TypeScript for all code.
2. **File Structure**:
   - Next.js: Use `/app` for routing, `/components` for UI.
   - Backend: Use `/backend/services` for USSD logic.
   - Prisma: Use `/prisma/schema.prisma` for Neon PostgreSQL.
   - Smart Contracts: Store in `/smart-contracts/contracts`, tests in `/smart-contracts/tests`.
   - Cursor Rules: Store in `/.cursorrules/rules.md`.
   - Prompts: Store in `/prompts.md`.
3. **Naming Conventions**:
   - Files: PascalCase for components (e.g., `BuyerDashboard.tsx`), kebab-case for routes (e.g., `buyer-dashboard.ts`).
   - Variables/Functions: camelCase (e.g., `fetchListings`, `userData`).
   - Constants: UPPER_SNAKE_CASE (e.g., `NEON_DATABASE_URL`).
4. **Styling**:
   - Use TailwindCSS for responsive, utility-first styling.
   - Use Shadcn and Radix UI for accessible components.
   - Ensure mobile-first design with desktop breakpoints.
5. **Error Handling**:
   - Use try-catch for API, Prisma, Stripe, and Hedera calls.
   - Return user-friendly error messages for UI.
   - Log errors to console and Neon for debugging.
6. **Testing**:
   - Jest for unit tests (components, hooks, services).
   - Cypress for end-to-end tests (login, KYC, ordering).
   - Mocha/Chai for Hedera smart contract tests.
7. **Performance**:
   - Use `useMemo`, `useCallback`, and Next.js dynamic imports.
   - Cache data in localStorage for offline mode.
8. **Security**:
   - Sanitize inputs to prevent XSS/SQL injection.
   - Use Clerk for secure auth with role-based access (buyer, farmer, admin).
   - Encrypt Hedera keys in localStorage.
   - Ensure Stripe PCI compliance.
9. **Accessibility**:
   - Follow WCAG 2.1 (ARIA labels, keyboard navigation).
   - Support multilingual UI (English, Swahili) with i18n.
   - Simulate USSD for feature phone users.

## Code Generation Guidelines
- Include TypeScript interfaces for models (e.g., `IUser`, `IKYC`, `IProduct`, `IOrder`).
- Use functional components with hooks in Next.js.
- Follow RESTful conventions for API routes (e.g., `/api/kyc`, `/api/listings`).
- Generate Hedera smart contracts in Solidity for Hedera Contract Service.
- Use Prisma for Neon PostgreSQL queries and schema definitions.
- Include JSDoc comments for complex logic.
- Use environment variables for sensitive data (Clerk, Stripe, Neon, Hedera).

## Debugging and Suggestions
- Suggest optimizations (e.g., memoization, code-splitting).
- Highlight security risks (e.g., unhandled errors, exposed keys).
- Recommend UX improvements (e.g., micro-interactions).
- Validate Hedera transactions against testnet.

## Integration Requirements
- Clerk: Use `@clerk/nextjs` for authentication.
- Hedera: Use `@hashgraph/sdk` for wallet and transaction signing.
- Stripe: Use `@stripe/stripe-js` and `stripe` for payments.
- Prisma: Use `@prisma/client` for Neon PostgreSQL.
- IPFS: Optional for images; use `ipfs-http-client`.
- USSD: Simulate menu-driven flows in `/backend/services/ussd.js`.

## Project-Specific Notes
- KYC: Mandatory for buyers and farmers, stored in Neon with Prisma.
- Offline Mode: Cache listings and user data in localStorage.
- Buyer Accounts: Require Clerk-based login with KYC verification.
- USSD: Simulate flows (e.g., register, list products) for

## Completed Setup (to date)

### ✅ PROMPT 1: Project Structure Initialization - COMPLETED
- ✅ Next.js 14 TypeScript project with App Router structure
- ✅ Complete folder structure: `/app`, `/prisma`, `/smart-contracts`, `/backend`, `/.cursorrules`, `/prompts.md`
- ✅ Subfolders: auth, onboarding, dashboard, listings, admin, components, API routes
- ✅ `package.json` with all required dependencies: `@clerk/nextjs`, `@hashgraph/sdk`, `@prisma/client`, `@stripe/stripe-js`, `stripe`, `tailwindcss`, `shadcn/ui`, `@radix-ui/react-components`, `ipfs-http-client`, `redis`, `elasticsearch`
- ✅ Configuration files: `tailwind.config.js`, `tsconfig.json`, `prisma/schema.prisma`, `.env`
- ✅ `README.md` and GitHub Actions workflow in `/.github/workflows/ci.yml`

### ✅ PROMPT 2: Multi-Role Authentication Setup - COMPLETED
- ✅ Clerk authentication with multiple user roles: farmers, distributors, transporters, buyers, agro AGROEXPERTs
- ✅ Auth pages: `/app/auth/login.tsx`, `/app/auth/signup.tsx`, `/app/auth/logout.tsx`
- ✅ Email, phone, and social login with `@clerk/nextjs`
- ✅ Role-based access control with `DashboardGuard` component
- ✅ Offline Hedera account login with encrypted credential caching
- ✅ API routes: `/app/api/auth/clerk/route.ts`, `/app/api/auth/assign-role/route.ts`
- ✅ TailwindCSS, Shadcn, and Radix UI styling
- ✅ TypeScript interfaces for multi-role user data
- ✅ Environment variables for Clerk keys

### ✅ PROMPT 3: Multi-Role KYC Verification System - COMPLETED
- ✅ Comprehensive KYC verification for all user types
- ✅ Onboarding pages: `/app/onboarding/farmer/page.tsx`, `/app/onboarding/buyer/page.tsx`
- ✅ Role-specific KYC requirements implemented
- ✅ Multi-step forms with validation and progress indicators
- ✅ KYC data storage in Neon using Prisma with role-based schemas
- ✅ Integration with Clerk for authentication
- ✅ USSD KYC flows simulation in `/backend/services/ussdService.ts`
- ✅ TailwindCSS, Shadcn, and Radix UI styling
- ✅ TypeScript interfaces and API routes: `/app/api/kyc/submit/route.ts`, `/app/api/kyc/status/route.ts`

### ✅ PROMPT 4: Hedera Wallet Integration & Supply Chain Tracking - COMPLETED
- ✅ TypeScript module `/utils/hedera.ts` for Hedera Hashgraph wallet integration
- ✅ Multi-stakeholder transaction support
- ✅ Wallet connection, transaction signing, and encrypted private key caching
- ✅ `@hashgraph/sdk` integration for testnet interactions
- ✅ Solidity contracts: `/smart-contracts/contracts/Marketplace.sol` for HBAR escrow payments
- ✅ Deployment scripts in `/smart-contracts/scripts/deploy.ts`
- ✅ Comprehensive Hedera testing with multiple API endpoints
- ✅ Secure key management and TypeScript interfaces
- ✅ Test transaction functionality with working Hedera integration

### ✅ PROMPT 5: Multi-Role Listing & Service Management System - COMPLETED
- ✅ Comprehensive listing system for all user types
- ✅ Listing pages: `/app/listings/create/page.tsx`, `/app/listings/browse/page.tsx`
- ✅ Role-based forms for farmers, distributors, transporters, agro AGROEXPERTs
- ✅ Product listing with validation, images, video support
- ✅ Supply chain tracking and quality certifications
- ✅ Data storage in Neon using Prisma
- ✅ Hedera smart contract integration for listing publication
- ✅ TailwindCSS, Shadcn, and Radix UI styling
- ✅ API routes: `/app/api/listings/route.ts`, `/app/api/listings/[id]/route.ts`
- ✅ Jest tests: `/tests/listings/listings.test.ts`

### 🚀 ADDITIONAL FEATURES COMPLETED
- ✅ **Multi-Currency Support**: 10+ fiat currencies + 4 cryptocurrencies with real-time conversion
- ✅ **Multi-Language Support**: 10 languages including RTL support for Arabic
- ✅ **Multiple Payment Methods**: Stripe, MPESA Daraja, Cryptocurrency payments
- ✅ **Enhanced Farmer Dashboard**: Agro-vet products, equipment leasing, tutorials
- ✅ **Comprehensive Settings Page**: Currency, language, payment preferences management
- ✅ **About Us Page**: Company information, team details, mission/vision
- ✅ **Enhanced Navigation**: Dropdown dashboards, role-based access, active states
- ✅ **Role Management System**: Complete role utilities and permission management
- ✅ **Payment Processing**: Full payment method integration with fee calculation
- ✅ **Internationalization**: Complete translation system with language switching