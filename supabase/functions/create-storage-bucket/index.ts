
// This is a one-time function to create the necessary storage bucket
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  try {
    // Create a Supabase client with the Admin key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    
    const supabase = createClient(supabaseUrl, supabaseServiceRole)
    
    // Check if bucket already exists
    const { data: buckets } = await supabase.storage.listBuckets()
    
    if (!buckets?.find(b => b.name === 'puppy-events')) {
      // Create the bucket if it doesn't exist
      const { data, error } = await supabase.storage.createBucket('puppy-events', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
      })
      
      if (error) {
        throw error
      }
      
      console.log('Created puppy-events bucket')
      return new Response(
        JSON.stringify({ message: 'Successfully created puppy-events storage bucket' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    } else {
      console.log('Bucket already exists')
      return new Response(
        JSON.stringify({ message: 'Bucket already exists' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }
  } catch (error) {
    console.error('Error creating bucket:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
