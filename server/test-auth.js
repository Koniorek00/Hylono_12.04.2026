// Quick test script
const testAuth = async () => {
  // Test login (user already registered)
  const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'demo@hylono.com',
      password: 'demo123456'
    })
  });
  const loginData = await loginResponse.json();
  console.log('Login:', JSON.stringify(loginData, null, 2));
  
  if (loginData.success) {
    // Test session endpoint
    const sessionResponse = await fetch('http://localhost:3001/api/auth/session', {
      headers: { 'Authorization': `Bearer ${loginData.data.session.sessionId}` }
    });
    const sessionData = await sessionResponse.json();
    console.log('Session:', JSON.stringify(sessionData, null, 2));
  }
};

testAuth();
