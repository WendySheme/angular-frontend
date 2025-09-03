// Enhanced test script to verify backend connectivity and test different payload formats
const baseCredentials = [
  { email: 'admin@realeites.com', password: 'password123' },
  { email: 'luca.marini@email.com', password: 'password123' },
  { email: 'enrico.giacomini@realeites.com', password: 'password123' }
];

const payloadVariations = [
  // Original format with role
  (base) => ({ ...base, role: 'ADMIN' }),
  // Without role
  (base) => ({ email: base.email, password: base.password }),
  // With lowercase role
  (base) => ({ ...base, role: 'admin' }),
  // With ruolo field (Italian)
  (base) => ({ email: base.email, password: base.password, ruolo: 'ADMIN' }),
  // With both role and ruolo
  (base) => ({ ...base, role: 'ADMIN', ruolo: 'ADMIN' })
];

async function testLogin(credentials, testName) {
  try {
    const requestBody = JSON.stringify(credentials);
    console.log(`\n=== ${testName} ===`);
    console.log('📤 Request URL:', 'http://localhost:8080/api/auth/login');
    console.log('📤 Request Body:', requestBody);
    console.log('📤 Request Headers:', { 'Content-Type': 'application/json' });

    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestBody
    });

    console.log('📥 Response Status:', response.status);
    console.log('📥 Response Status Text:', response.statusText);
    console.log('📥 Response Headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('📥 Response Body:', responseText);

    if (response.ok) {
      try {
        const data = JSON.parse(responseText);
        console.log('✅ Success! Parsed JSON:', JSON.stringify(data, null, 2));
      } catch (e) {
        console.log('⚠️ Response is not valid JSON');
      }
    } else {
      console.log('❌ Request failed');
    }

  } catch (error) {
    console.error(`💥 Network error for ${testName}:`, error.message);
  }
}

async function testBackendHealth() {
  console.log('\n🏥 Testing Backend Health...');
  try {
    const response = await fetch('http://localhost:8080/api/auth/health', {
      method: 'GET'
    });
    console.log('Health check status:', response.status);
  } catch (error) {
    console.log('Health check failed:', error.message);
  }

  // Try basic ping
  try {
    const response = await fetch('http://localhost:8080', {
      method: 'GET'
    });
    console.log('Basic ping status:', response.status);
  } catch (error) {
    console.log('Basic ping failed:', error.message);
  }
}

async function runTests() {
  console.log('🧪 Enhanced Backend Authentication Testing\n');
  
  await testBackendHealth();
  
  // Test with first user (admin) using different payload formats
  const adminCreds = baseCredentials[0];
  
  for (let i = 0; i < payloadVariations.length; i++) {
    const variation = payloadVariations[i];
    const testCreds = variation(adminCreds);
    const testName = `Admin Test Variation ${i + 1}: ${Object.keys(testCreds).join(', ')}`;
    
    await testLogin(testCreds, testName);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n🎯 Recommendation: Check the Spring Boot logs for detailed server error information.');
}

runTests();