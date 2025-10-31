-- Manual migration to change AGROEXPERT to AGROEXPERT
-- Run this SQL in your database console

-- Step 1: Add the new AGROEXPERT value to both enums
ALTER TYPE "Role" ADD VALUE 'AGROEXPERT';
ALTER TYPE "ProfileType" ADD VALUE 'AGROEXPERT';

-- Step 2: Update existing AGROEXPERT records to AGROEXPERT
UPDATE "User" SET role = 'AGROEXPERT' WHERE role = 'AGROEXPERT';
UPDATE "Profile" SET type = 'AGROEXPERT' WHERE type = 'AGROEXPERT';

-- Step 3: Remove the old AGROEXPERT value (this might require recreating the enum)
-- Note: PostgreSQL doesn't allow removing enum values directly
-- You may need to recreate the enums if you want to remove AGROEXPERT completely

-- Alternative approach: Create new enums and migrate
-- CREATE TYPE "Role_new" AS ENUM ('FARMER', 'DISTRIBUTOR', 'TRANSPORTER', 'BUYER', 'AGROEXPERT', 'ADMIN');
-- CREATE TYPE "ProfileType_new" AS ENUM ('FARMER', 'DISTRIBUTOR', 'TRANSPORTER', 'BUYER', 'AGROEXPERT');

-- ALTER TABLE "User" ALTER COLUMN role TYPE "Role_new" USING role::text::"Role_new";
-- ALTER TABLE "Profile" ALTER COLUMN type TYPE "ProfileType_new" USING type::text::"ProfileType_new";

-- DROP TYPE "Role";
-- DROP TYPE "ProfileType";

-- ALTER TYPE "Role_new" RENAME TO "Role";
-- ALTER TYPE "ProfileType_new" RENAME TO "ProfileType";