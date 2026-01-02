-- ============================================
-- SERVEHUB DATABASE SCHEMA V2
-- Multi-tenant architecture (like Notion)
-- ============================================
-- Features:
--   • Users can create up to 3 churches
--   • Churches can have up to 10 members
--   • Users can be invited to multiple churches
--   • Role-based access (owner, admin, member)
-- ============================================

-- ============================================
-- STEP 1: CLEAN UP EXISTING OBJECTS
-- ============================================

-- Drop the auth trigger first (special handling)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop all functions (CASCADE will drop dependent triggers)
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS get_user_church_id() CASCADE;
DROP FUNCTION IF EXISTS get_user_church_ids() CASCADE;
DROP FUNCTION IF EXISTS get_user_church_role(UUID) CASCADE;
DROP FUNCTION IF EXISTS create_church_and_manager(TEXT, TEXT, TEXT) CASCADE;
DROP FUNCTION IF EXISTS create_church(TEXT) CASCADE;
DROP FUNCTION IF EXISTS invite_to_church(UUID, TEXT, TEXT) CASCADE;
DROP FUNCTION IF EXISTS accept_invitation(UUID) CASCADE;
DROP FUNCTION IF EXISTS get_my_churches() CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

-- Drop tables (CASCADE handles triggers and foreign keys)
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS songs CASCADE;
DROP TABLE IF EXISTS schedules CASCADE;
DROP TABLE IF EXISTS people CASCADE;
DROP TABLE IF EXISTS invitations CASCADE;
DROP TABLE IF EXISTS church_members CASCADE;
DROP TABLE IF EXISTS managers CASCADE;
DROP TABLE IF EXISTS churches CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- ============================================
-- STEP 2: CREATE CORE TABLES
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Churches table
CREATE TABLE churches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Church members (many-to-many relationship)
CREATE TABLE church_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  church_id UUID NOT NULL REFERENCES churches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(church_id, user_id)
);

-- Invitations table
CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  church_id UUID NOT NULL REFERENCES churches(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  invited_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled')),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(church_id, email, status)
);

-- ============================================
-- STEP 3: CREATE DATA TABLES
-- ============================================

-- People table (ministry members - NOT app users)
CREATE TABLE people (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  church_id UUID NOT NULL REFERENCES churches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  ministries TEXT[] NOT NULL DEFAULT '{}',
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  is_active BOOLEAN DEFAULT true,
  is_exempt BOOLEAN DEFAULT false,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('high', 'normal', 'low')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Schedules table
CREATE TABLE schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  church_id UUID NOT NULL REFERENCES churches(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  service_type TEXT NOT NULL CHECK (service_type IN ('sunday_morning', 'sunday_evening', 'midweek', 'special')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(church_id, date, service_type)
);

-- Assignments table
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  schedule_id UUID NOT NULL REFERENCES schedules(id) ON DELETE CASCADE,
  person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  ministry TEXT NOT NULL CHECK (ministry IN ('musician', 'usher', 'multimedia', 'singer', 'scripture_reader', 'prayer_leader', 'host')),
  confirmed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(schedule_id, person_id, ministry)
);

-- Songs table
CREATE TABLE songs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  church_id UUID NOT NULL REFERENCES churches(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  artist TEXT,
  genre TEXT CHECK (genre IN ('adoration', 'confession', 'thanksgiving', 'supplication', 'christmas', 'hymnal', 'praise_worship')),
  language TEXT NOT NULL DEFAULT 'english' CHECK (language IN ('tagalog', 'english')),
  lyrics TEXT NOT NULL,
  chords TEXT,
  key TEXT,
  tempo TEXT CHECK (tempo IN ('slow', 'moderate', 'fast')),
  last_sang DATE,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings table (per church)
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  church_id UUID NOT NULL REFERENCES churches(id) ON DELETE CASCADE UNIQUE,
  schedule_rules JSONB DEFAULT '{
    "singersPerMonth": 1,
    "techPerMonth": 2,
    "scriptureReadersPerMonth": 1,
    "singersPerService": 3,
    "minGapDays": 7,
    "alwaysAssignScriptureReader": true,
    "alwaysAssignTechPerson": true,
    "respectExemptions": true
  }'::jsonb,
  lineup_rules JSONB DEFAULT '{
    "minSongs": 4,
    "maxSongs": 6,
    "slowModerateCount": 2,
    "fastCount": 2,
    "requireAdoration": true,
    "requireThanksgiving": true,
    "requireConfession": true,
    "requireSupplication": true,
    "avoidRecentlyPlayed": true
  }'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- STEP 4: CREATE INDEXES
-- ============================================

CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_churches_owner ON churches(owner_id);
CREATE INDEX idx_church_members_church ON church_members(church_id);
CREATE INDEX idx_church_members_user ON church_members(user_id);
CREATE INDEX idx_church_members_role ON church_members(role);
CREATE INDEX idx_invitations_church ON invitations(church_id);
CREATE INDEX idx_invitations_email ON invitations(email);
CREATE INDEX idx_invitations_status ON invitations(status);
CREATE INDEX idx_people_church ON people(church_id);
CREATE INDEX idx_people_active ON people(is_active);
CREATE INDEX idx_people_ministries ON people USING GIN(ministries);
CREATE INDEX idx_schedules_church ON schedules(church_id);
CREATE INDEX idx_schedules_date ON schedules(date);
CREATE INDEX idx_assignments_schedule ON assignments(schedule_id);
CREATE INDEX idx_assignments_person ON assignments(person_id);
CREATE INDEX idx_songs_church ON songs(church_id);
CREATE INDEX idx_songs_genre ON songs(genre);
CREATE INDEX idx_settings_church ON settings(church_id);

-- ============================================
-- STEP 5: CREATE HELPER FUNCTIONS
-- ============================================

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

-- Create church function (with limits check)
CREATE OR REPLACE FUNCTION create_church(p_name TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_church_count INT;
  v_church_id UUID;
  v_max_churches INT := 3;
BEGIN
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Ensure profile exists (in case trigger didn't fire)
  INSERT INTO profiles (id, email, name)
  SELECT v_user_id, email, COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1))
  FROM auth.users WHERE id = v_user_id
  ON CONFLICT (id) DO NOTHING;
  
  -- Check how many churches user owns
  SELECT COUNT(*) INTO v_church_count
  FROM churches WHERE owner_id = v_user_id;
  
  IF v_church_count >= v_max_churches THEN
    RAISE EXCEPTION 'You can only create up to % churches', v_max_churches;
  END IF;
  
  -- Create the church
  INSERT INTO churches (name, owner_id)
  VALUES (p_name, v_user_id)
  RETURNING id INTO v_church_id;
  
  -- Add owner as a member with 'owner' role
  INSERT INTO church_members (church_id, user_id, role)
  VALUES (v_church_id, v_user_id, 'owner');
  
  -- Create default settings
  INSERT INTO settings (church_id)
  VALUES (v_church_id);
  
  RETURN json_build_object(
    'success', true,
    'church_id', v_church_id
  );
END;
$$;

-- Invite user to church
CREATE OR REPLACE FUNCTION invite_to_church(
  p_church_id UUID,
  p_email TEXT,
  p_role TEXT DEFAULT 'member'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_member_count INT;
  v_user_role TEXT;
  v_max_members INT := 10;
  v_invitation_id UUID;
BEGIN
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Check if user has permission (owner or admin)
  SELECT role INTO v_user_role
  FROM church_members
  WHERE church_id = p_church_id AND user_id = v_user_id;
  
  IF v_user_role IS NULL OR v_user_role = 'member' THEN
    RAISE EXCEPTION 'You do not have permission to invite members';
  END IF;
  
  -- Check member count
  SELECT COUNT(*) INTO v_member_count
  FROM church_members WHERE church_id = p_church_id;
  
  IF v_member_count >= v_max_members THEN
    RAISE EXCEPTION 'This church has reached the maximum of % members', v_max_members;
  END IF;
  
  -- Check if already a member
  IF EXISTS (
    SELECT 1 FROM church_members cm
    JOIN profiles p ON cm.user_id = p.id
    WHERE cm.church_id = p_church_id AND p.email = p_email
  ) THEN
    RAISE EXCEPTION 'This user is already a member';
  END IF;
  
  -- Cancel any existing pending invitations for this email
  UPDATE invitations
  SET status = 'cancelled'
  WHERE church_id = p_church_id AND email = p_email AND status = 'pending';
  
  -- Create invitation
  INSERT INTO invitations (church_id, email, role, invited_by)
  VALUES (p_church_id, p_email, p_role, v_user_id)
  RETURNING id INTO v_invitation_id;
  
  RETURN json_build_object(
    'success', true,
    'invitation_id', v_invitation_id
  );
END;
$$;

-- Accept invitation
CREATE OR REPLACE FUNCTION accept_invitation(p_invitation_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_user_email TEXT;
  v_invitation RECORD;
  v_member_count INT;
  v_max_members INT := 10;
BEGIN
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Ensure profile exists
  INSERT INTO profiles (id, email, name)
  SELECT v_user_id, email, COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1))
  FROM auth.users WHERE id = v_user_id
  ON CONFLICT (id) DO NOTHING;
  
  -- Get user email
  SELECT email INTO v_user_email FROM profiles WHERE id = v_user_id;
  
  -- Get invitation
  SELECT * INTO v_invitation
  FROM invitations
  WHERE id = p_invitation_id AND status = 'pending';
  
  IF v_invitation IS NULL THEN
    RAISE EXCEPTION 'Invitation not found or already used';
  END IF;
  
  -- Check if invitation is for this user
  IF v_invitation.email != v_user_email THEN
    RAISE EXCEPTION 'This invitation is not for you';
  END IF;
  
  -- Check if expired
  IF v_invitation.expires_at < NOW() THEN
    UPDATE invitations SET status = 'expired' WHERE id = p_invitation_id;
    RAISE EXCEPTION 'This invitation has expired';
  END IF;
  
  -- Check member count
  SELECT COUNT(*) INTO v_member_count
  FROM church_members WHERE church_id = v_invitation.church_id;
  
  IF v_member_count >= v_max_members THEN
    RAISE EXCEPTION 'This church has reached the maximum of % members', v_max_members;
  END IF;
  
  -- Add as member
  INSERT INTO church_members (church_id, user_id, role)
  VALUES (v_invitation.church_id, v_user_id, v_invitation.role)
  ON CONFLICT (church_id, user_id) DO NOTHING;
  
  -- Mark invitation as accepted
  UPDATE invitations SET status = 'accepted' WHERE id = p_invitation_id;
  
  RETURN json_build_object(
    'success', true,
    'church_id', v_invitation.church_id
  );
END;
$$;

-- Helper function to get user's church IDs (bypasses RLS to avoid circular dependency)
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

-- Helper function to get user's role in a church (bypasses RLS)
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

-- Get user's churches (for switching)
CREATE OR REPLACE FUNCTION get_my_churches()
RETURNS TABLE (
  church_id UUID,
  church_name TEXT,
  role TEXT,
  member_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  v_user_id := auth.uid();
  
  -- Ensure profile exists first
  IF v_user_id IS NOT NULL THEN
    INSERT INTO profiles (id, email, name)
    SELECT v_user_id, email, COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1))
    FROM auth.users WHERE id = v_user_id
    ON CONFLICT (id) DO NOTHING;
  END IF;

  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    cm.role,
    (SELECT COUNT(*) FROM church_members WHERE church_members.church_id = c.id)
  FROM churches c
  JOIN church_members cm ON c.id = cm.church_id
  WHERE cm.user_id = v_user_id
  ORDER BY cm.joined_at;
END;
$$;

-- ============================================
-- STEP 6: CREATE TRIGGERS
-- ============================================

-- Auto-create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Updated_at triggers
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_churches_updated_at 
  BEFORE UPDATE ON churches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_church_members_updated_at 
  BEFORE UPDATE ON church_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invitations_updated_at 
  BEFORE UPDATE ON invitations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_people_updated_at 
  BEFORE UPDATE ON people
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schedules_updated_at 
  BEFORE UPDATE ON schedules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assignments_updated_at 
  BEFORE UPDATE ON assignments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_songs_updated_at 
  BEFORE UPDATE ON songs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at 
  BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STEP 7: ENABLE RLS
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE churches ENABLE ROW LEVEL SECURITY;
ALTER TABLE church_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 8: CREATE RLS POLICIES
-- ============================================

-- PROFILES POLICIES
CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

-- Users can view profiles of people in same churches
CREATE POLICY "profiles_select_church_members"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT cm2.user_id FROM church_members cm1
      JOIN church_members cm2 ON cm1.church_id = cm2.church_id
      WHERE cm1.user_id = auth.uid()
    )
  );

-- CHURCHES POLICIES
CREATE POLICY "churches_select"
  ON churches FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM church_members cm
      WHERE cm.church_id = churches.id
      AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "churches_update"
  ON churches FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM church_members cm
      WHERE cm.church_id = churches.id
      AND cm.user_id = auth.uid()
      AND cm.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "churches_delete"
  ON churches FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

-- CHURCH_MEMBERS POLICIES
-- CRITICAL: Use SECURITY DEFINER function to avoid circular dependency
-- The function bypasses RLS, so it can query church_members without triggering the policy
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

CREATE POLICY "church_members_delete"
  ON church_members FOR DELETE
  TO authenticated
  USING (
    -- User must be owner or admin (use helper function to avoid recursion)
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

-- INVITATIONS POLICIES
CREATE POLICY "invitations_select"
  ON invitations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM church_members cm
      WHERE cm.church_id = invitations.church_id
      AND cm.user_id = auth.uid()
      AND cm.role IN ('owner', 'admin')
    )
    OR
    email = (SELECT email FROM profiles WHERE id = auth.uid())
  );

-- PEOPLE POLICIES
-- Use EXISTS for better performance and to avoid circular dependency issues
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

-- SCHEDULES POLICIES
CREATE POLICY "schedules_select"
  ON schedules FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM church_members cm
      WHERE cm.church_id = schedules.church_id
      AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "schedules_insert"
  ON schedules FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM church_members cm
      WHERE cm.church_id = schedules.church_id
      AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "schedules_update"
  ON schedules FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM church_members cm
      WHERE cm.church_id = schedules.church_id
      AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "schedules_delete"
  ON schedules FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM church_members cm
      WHERE cm.church_id = schedules.church_id
      AND cm.user_id = auth.uid()
      AND cm.role IN ('owner', 'admin')
    )
  );

-- ASSIGNMENTS POLICIES
CREATE POLICY "assignments_select"
  ON assignments FOR SELECT
  TO authenticated
  USING (
    schedule_id IN (
      SELECT s.id FROM schedules s
      JOIN church_members cm ON s.church_id = cm.church_id
      WHERE cm.user_id = auth.uid()
    )
  );

CREATE POLICY "assignments_insert"
  ON assignments FOR INSERT
  TO authenticated
  WITH CHECK (
    schedule_id IN (
      SELECT s.id FROM schedules s
      JOIN church_members cm ON s.church_id = cm.church_id
      WHERE cm.user_id = auth.uid()
    )
  );

CREATE POLICY "assignments_update"
  ON assignments FOR UPDATE
  TO authenticated
  USING (
    schedule_id IN (
      SELECT s.id FROM schedules s
      JOIN church_members cm ON s.church_id = cm.church_id
      WHERE cm.user_id = auth.uid()
    )
  );

CREATE POLICY "assignments_delete"
  ON assignments FOR DELETE
  TO authenticated
  USING (
    schedule_id IN (
      SELECT s.id FROM schedules s
      JOIN church_members cm ON s.church_id = cm.church_id
      WHERE cm.user_id = auth.uid() AND cm.role IN ('owner', 'admin')
    )
  );

-- SONGS POLICIES
CREATE POLICY "songs_select"
  ON songs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM church_members cm
      WHERE cm.church_id = songs.church_id
      AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "songs_insert"
  ON songs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM church_members cm
      WHERE cm.church_id = songs.church_id
      AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "songs_update"
  ON songs FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM church_members cm
      WHERE cm.church_id = songs.church_id
      AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "songs_delete"
  ON songs FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM church_members cm
      WHERE cm.church_id = songs.church_id
      AND cm.user_id = auth.uid()
      AND cm.role IN ('owner', 'admin')
    )
  );

-- SETTINGS POLICIES
CREATE POLICY "settings_select"
  ON settings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM church_members cm
      WHERE cm.church_id = settings.church_id
      AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "settings_update"
  ON settings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM church_members cm
      WHERE cm.church_id = settings.church_id
      AND cm.user_id = auth.uid()
      AND cm.role IN ('owner', 'admin')
    )
  );

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '══════════════════════════════════════════════════════════';
  RAISE NOTICE '  ✅ SERVEHUB V2 DATABASE CREATED SUCCESSFULLY!';
  RAISE NOTICE '══════════════════════════════════════════════════════════';
  RAISE NOTICE '';
  RAISE NOTICE '  📊 TABLES:';
  RAISE NOTICE '     • profiles (auto-created on signup)';
  RAISE NOTICE '     • churches (max 3 per user)';
  RAISE NOTICE '     • church_members (max 10 per church)';
  RAISE NOTICE '     • invitations';
  RAISE NOTICE '     • people, schedules, assignments, songs, settings';
  RAISE NOTICE '';
  RAISE NOTICE '  🔐 FUNCTIONS:';
  RAISE NOTICE '     • create_church(name) - Create a new church';
  RAISE NOTICE '     • invite_to_church(church_id, email, role)';
  RAISE NOTICE '     • accept_invitation(invitation_id)';
  RAISE NOTICE '     • get_my_churches() - List user churches';
  RAISE NOTICE '';
  RAISE NOTICE '  👥 ROLES:';
  RAISE NOTICE '     • owner - Full access, can delete church';
  RAISE NOTICE '     • admin - Can manage members and settings';
  RAISE NOTICE '     • member - Can view and add content';
  RAISE NOTICE '';
  RAISE NOTICE '══════════════════════════════════════════════════════════';
END $$;
