-- Add ON DELETE CASCADE to foreign keys and performance indexes
-- This migration improves data integrity (no orphan records) and query performance

-- ── User → Community (SET NULL when community deleted) ────────────────────────
ALTER TABLE "User" DROP CONSTRAINT IF EXISTS "User_communityId_fkey";
ALTER TABLE "User" ADD CONSTRAINT "User_communityId_fkey"
  FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ── Property → Community (CASCADE) ───────────────────────────────────────────
ALTER TABLE "Property" DROP CONSTRAINT IF EXISTS "Property_communityId_fkey";
ALTER TABLE "Property" ADD CONSTRAINT "Property_communityId_fkey"
  FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ── Account → Community (CASCADE) ────────────────────────────────────────────
ALTER TABLE "Account" DROP CONSTRAINT IF EXISTS "Account_communityId_fkey";
ALTER TABLE "Account" ADD CONSTRAINT "Account_communityId_fkey"
  FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ── Transaction → Account (CASCADE) ──────────────────────────────────────────
ALTER TABLE "Transaction" DROP CONSTRAINT IF EXISTS "Transaction_accountId_fkey";
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_accountId_fkey"
  FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ── Budget → Community (CASCADE) ─────────────────────────────────────────────
ALTER TABLE "Budget" DROP CONSTRAINT IF EXISTS "Budget_communityId_fkey";
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_communityId_fkey"
  FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ── Incident → Community (CASCADE) ───────────────────────────────────────────
ALTER TABLE "Incident" DROP CONSTRAINT IF EXISTS "Incident_communityId_fkey";
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_communityId_fkey"
  FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ── Incident → User/reportedBy (CASCADE) ─────────────────────────────────────
ALTER TABLE "Incident" DROP CONSTRAINT IF EXISTS "Incident_reportedById_fkey";
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_reportedById_fkey"
  FOREIGN KEY ("reportedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ── Document → Community (CASCADE) ───────────────────────────────────────────
ALTER TABLE "Document" DROP CONSTRAINT IF EXISTS "Document_communityId_fkey";
ALTER TABLE "Document" ADD CONSTRAINT "Document_communityId_fkey"
  FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ── Document → User/uploadedBy (CASCADE) ─────────────────────────────────────
ALTER TABLE "Document" DROP CONSTRAINT IF EXISTS "Document_uploadedById_fkey";
ALTER TABLE "Document" ADD CONSTRAINT "Document_uploadedById_fkey"
  FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ── Space → Community (CASCADE) ──────────────────────────────────────────────
ALTER TABLE "Space" DROP CONSTRAINT IF EXISTS "Space_communityId_fkey";
ALTER TABLE "Space" ADD CONSTRAINT "Space_communityId_fkey"
  FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ── Booking → Space (CASCADE) ─────────────────────────────────────────────────
ALTER TABLE "Booking" DROP CONSTRAINT IF EXISTS "Booking_spaceId_fkey";
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_spaceId_fkey"
  FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ── Booking → User (CASCADE) ──────────────────────────────────────────────────
ALTER TABLE "Booking" DROP CONSTRAINT IF EXISTS "Booking_userId_fkey";
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ── Booking → Community (CASCADE) ────────────────────────────────────────────
ALTER TABLE "Booking" DROP CONSTRAINT IF EXISTS "Booking_communityId_fkey";
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_communityId_fkey"
  FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ── Announcement → Community (CASCADE) ───────────────────────────────────────
ALTER TABLE "Announcement" DROP CONSTRAINT IF EXISTS "Announcement_communityId_fkey";
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_communityId_fkey"
  FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ── Announcement → User/author (CASCADE) ─────────────────────────────────────
ALTER TABLE "Announcement" DROP CONSTRAINT IF EXISTS "Announcement_authorId_fkey";
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_authorId_fkey"
  FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ── Meeting → Community (CASCADE) ────────────────────────────────────────────
ALTER TABLE "Meeting" DROP CONSTRAINT IF EXISTS "Meeting_communityId_fkey";
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_communityId_fkey"
  FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ── Meeting → User/createdBy (CASCADE) ───────────────────────────────────────
ALTER TABLE "Meeting" DROP CONSTRAINT IF EXISTS "Meeting_createdById_fkey";
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_createdById_fkey"
  FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ── Vote → Community (CASCADE) ────────────────────────────────────────────────
ALTER TABLE "Vote" DROP CONSTRAINT IF EXISTS "Vote_communityId_fkey";
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_communityId_fkey"
  FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ── VoteResponse → Vote (CASCADE) ────────────────────────────────────────────
ALTER TABLE "VoteResponse" DROP CONSTRAINT IF EXISTS "VoteResponse_voteId_fkey";
ALTER TABLE "VoteResponse" ADD CONSTRAINT "VoteResponse_voteId_fkey"
  FOREIGN KEY ("voteId") REFERENCES "Vote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ── VoteResponse → User (CASCADE) ────────────────────────────────────────────
ALTER TABLE "VoteResponse" DROP CONSTRAINT IF EXISTS "VoteResponse_userId_fkey";
ALTER TABLE "VoteResponse" ADD CONSTRAINT "VoteResponse_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ── Performance indexes ───────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS "Transaction_date_idx" ON "Transaction"("date");
CREATE INDEX IF NOT EXISTS "Community_subscriptionStatus_idx" ON "Community"("subscriptionStatus");
CREATE INDEX IF NOT EXISTS "Document_uploadedAt_idx" ON "Document"("uploadedAt");
CREATE INDEX IF NOT EXISTS "Incident_status_idx" ON "Incident"("status");
CREATE INDEX IF NOT EXISTS "Booking_date_idx" ON "Booking"("date");
