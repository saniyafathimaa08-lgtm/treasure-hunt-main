const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const { path, httpMethod, body, headers } = event;
  
  // Extract the API route from the path
  const apiPath = path.replace('/.netlify/functions/api', '');
  
  // Backend URL - you'll need to set this as an environment variable
  const BACKEND_URL = process.env.BACKEND_URL || 'https://your-backend-url.com';
  
  try {
    const response = await fetch(`${BACKEND_URL}${apiPath}`, {
      method: httpMethod,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: httpMethod !== 'GET' ? body : undefined
    });
    
    const data = await response.text();
    
    return {
      statusCode: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      },
      body: data
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
