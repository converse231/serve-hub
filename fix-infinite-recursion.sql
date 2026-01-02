-- ============================================
-- FIX INFINITE RECURSION IN CHURCH_MEMBERS RLS
-- ============================================
-- This fixes the "infinite recursion detected in policy" error
-- Run this in Supabase SQL Editor

-- Step 1: Create helper function to get user's church IDs (bypasses RLS)
CREATE OR REPLACE FUNCTION get_user_church_ids()
RETURNS UUID[]
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN ARRAY[]::UUID[];
  END IF;
  
  -- This function bypasses RLS, so it can query church_members directly
  RETURN ARRAY(
    SELECT church_id FROM church_members WHERE user_id = v_user_id
  );
END;
$$;

-- Step 2: Create helper function to get user's role in a church (bypasses RLS)
CREATE OR REPLACE FUNCTION get_user_church_role(p_church_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_role TEXT;
BEGIN
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- This function bypasses RLS, so it can query church_members directly
  SELECT role INTO v_role
  FROM church_members
  WHERE church_id = p_church_id AND user_id = v_user_id;
  
  RETURN v_role;
END;
$$;

-- Step 3: Drop and recreate church_members SELECT policy (fixes infinite recursion)
DROP POLICY IF EXISTS "church_members_select" ON church_members;

CREATE POLICY "church_members_select"
  ON church_members FOR SELECT
  TO authenticated
  USING (
    -- User can always see their own membership (no query needed - avoids recursion)
    user_id = auth.uid()
    OR
    -- User can see members of churches they're a member of
    -- Use SECURITY DEFINER function to avoid circular dependency
    church_members.church_id = ANY(get_user_church_ids())
  );

-- Step 4: Fix church_members DELETE policy
DROP POLICY IF EXISTS "church_members_delete" ON church_members;

CREATE POLICY "church_members_delete"
  ON church_members FOR DELETE
  TO authenticated
  USING (
    -- User must be owner or admin (use helper functions to avoid recursion)
    (
      -- Check if user owns the church
      EXISTS (
        SELECT 1 FROM churches c
        WHERE c.id = church_members.church_id
        AND c.owner_id = auth.uid()
      )
      OR
      -- Check if user is admin (use helper function)
      get_user_church_role(church_members.church_id) IN ('owner', 'admin')
    )
    AND church_members.user_id != auth.uid()  -- Can't delete yourself
  );

-- ============================================
-- SUCCESS
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '✅ Fixed infinite recursion in church_members policies!';
  RAISE NOTICE 'The policies now use SECURITY DEFINER helper functions';
  RAISE NOTICE 'to avoid circular dependencies.';
END $$;


