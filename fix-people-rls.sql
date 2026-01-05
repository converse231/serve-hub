-- ============================================
-- FIX PEOPLE RLS POLICIES
-- ============================================
-- This fixes potential circular dependency issues
-- Run this in Supabase SQL Editor

-- Drop existing people policies
DROP POLICY IF EXISTS "people_select" ON people;
DROP POLICY IF EXISTS "people_insert" ON people;
DROP POLICY IF EXISTS "people_update" ON people;
DROP POLICY IF EXISTS "people_delete" ON people;

-- Recreate with better structure
-- SELECT: Users can see people in churches they're members of
CREATE POLICY "people_select"
  ON people FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM church_members cm
      WHERE cm.church_id = people.church_id
      AND cm.user_id = auth.uid()
    )
  );

-- INSERT: Users can add people to churches they're members of
CREATE POLICY "people_insert"
  ON people FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM church_members cm
      WHERE cm.church_id = people.church_id
      AND cm.user_id = auth.uid()
    )
  );

-- UPDATE: Users can update people in churches they're members of
CREATE POLICY "people_update"
  ON people FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM church_members cm
      WHERE cm.church_id = people.church_id
      AND cm.user_id = auth.uid()
    )
  );

-- DELETE: Only owners/admins can delete people
CREATE POLICY "people_delete"
  ON people FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM church_members cm
      WHERE cm.church_id = people.church_id
      AND cm.user_id = auth.uid()
      AND cm.role IN ('owner', 'admin')
    )
  );

-- ============================================
-- DIAGNOSTIC QUERIES (for debugging)
-- ============================================
-- Uncomment and run these to check your setup:

-- Check if user is in church_members:
-- SELECT * FROM church_members WHERE user_id = auth.uid();

-- Check if people exist:
-- SELECT * FROM people LIMIT 5;

-- Check if you can see your churches:
-- SELECT * FROM get_my_churches();

-- ============================================
-- SUCCESS
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '✅ People RLS policies fixed!';
  RAISE NOTICE 'The policies now use EXISTS instead of IN for better performance';
END $$;



