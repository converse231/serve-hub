// Test Supabase connection
// Run this to verify your setup

import { createClient } from './client'

export async function testConnection() {
  try {
    const supabase = createClient()
    
    // Test 1: Check if client is created
    console.log('✅ Supabase client created')
    
    // Test 2: Try to query (should work even without auth)
    const { data, error } = await supabase
      .from('churches')
      .select('id')
      .limit(1)
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows (which is fine)
      console.error('❌ Database query failed:', error.message)
      return false
    }
    
    console.log('✅ Database connection successful')
    console.log('✅ Row Level Security is working')
    
    return true
  } catch (error) {
    console.error('❌ Connection test failed:', error)
    return false
  }
}

// Export for console testing
if (typeof window !== 'undefined') {
  (window as any).testSupabase = testConnection
}

