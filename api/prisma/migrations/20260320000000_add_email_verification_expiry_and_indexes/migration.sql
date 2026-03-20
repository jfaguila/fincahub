-- Add emailVerificationExpiresAt to User
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emailVerificationExpiresAt" TIMESTAMP(3);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS "User_communityId_idx" ON "User"("communityId");
CREATE INDEX IF NOT EXISTS "Transaction_accountId_idx" ON "Transaction"("accountId");
CREATE INDEX IF NOT EXISTS "Transaction_type_idx" ON "Transaction"("type");
CREATE INDEX IF NOT EXISTS "Booking_spaceId_idx" ON "Booking"("spaceId");
CREATE INDEX IF NOT EXISTS "Booking_communityId_idx" ON "Booking"("communityId");
