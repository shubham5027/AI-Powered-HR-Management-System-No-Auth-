
// Import necessary Deno modules
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body
    const { githubUrl } = await req.json();
    
    // Basic validation
    if (!githubUrl || !githubUrl.includes('github.com')) {
      return new Response(
        JSON.stringify({ error: 'Invalid GitHub URL' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Extract the username from the GitHub URL
    const username = githubUrl.split('github.com/')[1].split('/')[0];
    
    if (!username) {
      return new Response(
        JSON.stringify({ error: 'Could not extract GitHub username' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Fetch the user's repos from GitHub API
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`);
    
    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch GitHub repositories' }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const repos = await response.json();
    
    // Process the repos to extract useful information
    const languages = new Set<string>();
    let lastCommitDate = null;
    const repoData = [];
    
    for (const repo of repos) {
      if (repo.language) {
        languages.add(repo.language);
      }
      
      // Track the most recent update across all repos
      if (!lastCommitDate || new Date(repo.updated_at) > new Date(lastCommitDate)) {
        lastCommitDate = repo.updated_at;
      }
      
      // Collect basic data about each repo
      repoData.push({
        name: repo.name,
        description: repo.description,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        updated_at: repo.updated_at,
        clone_url: repo.clone_url,
        html_url: repo.html_url
      });
    }
    
    // Format the last commit date
    const formattedLastCommit = lastCommitDate 
      ? new Date(lastCommitDate).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        })
      : 'N/A';
    
    // Calculate a GitHub score (simple algorithm)
    // 0-25 scale based on:
    // - Number of repos (up to 10 points)
    // - Language diversity (up to 5 points)
    // - Recent activity (up to 10 points)
    const activeRepos = repos.length;
    const languageDiversity = languages.size;
    
    let recentActivityScore = 0;
    if (lastCommitDate) {
      const lastCommitDaysAgo = (new Date().getTime() - new Date(lastCommitDate).getTime()) / (1000 * 60 * 60 * 24);
      if (lastCommitDaysAgo <= 7) {
        recentActivityScore = 10; // Very active (last week)
      } else if (lastCommitDaysAgo <= 30) {
        recentActivityScore = 7; // Active (last month)
      } else if (lastCommitDaysAgo <= 90) {
        recentActivityScore = 4; // Somewhat active (last quarter)
      } else {
        recentActivityScore = 2; // Not very active
      }
    }
    
    const githubScore = Math.min(Math.ceil(activeRepos * 1.5), 10) + 
                         Math.min(languageDiversity, 5) + 
                         recentActivityScore;
    
    // Construct the result
    const result = {
      username,
      languages: Array.from(languages),
      activeRepos,
      lastCommit: formattedLastCommit,
      repositories: repoData,
      score: githubScore,
    };
    
    // Return successful response
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error analyzing GitHub profile:', error);
    
    // Return error response
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to analyze GitHub profile' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
