// import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// const corsHeaders = {
//   'Access-Control-Allow-Origin': '*',
//   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
// }

// serve(async (req) => {
//   // Handle CORS preflight requests
//   if (req.method === 'OPTIONS') {
//     return new Response('ok', { headers: corsHeaders })
//   }

//   try {
//     // Hard-coded Eden AI API key
//     const apiKey = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOGE1YmQwOTYtZTQ2OC00ZjEwLTk2Y2MtOWU2ZjUwMjIxZjY3IiwidHlwZSI6ImFwaV90b2tlbiJ9.QL-Qjs13w0VxiLng4b_9AS8uD16n1u7fM3vT31pX7F0";
    
//     return new Response(
//       JSON.stringify({ 
//         apiKey,
//         message: "API key retrieved successfully"
//       }),
//       { 
//         headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//         status: 200 
//       }
//     )
//   } catch (error) {
//     console.error("Error retrieving Eden AI API key:", error);
    
//     return new Response(
//       JSON.stringify({ 
//         error: error.message || "Failed to retrieve API key",
//         message: "Error occurred when retrieving API key" 
//       }),
//       { 
//         headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//         status: 500
//       }
//     )
//   }
// })