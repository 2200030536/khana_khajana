// Test Session Functionality
// Open this in browser console to test

console.log('🧪 Starting Session Tests...');

// Test 1: Check if backend is reachable
fetch('http://localhost:3001/', { 
  credentials: 'include' 
})
.then(response => response.json())
.then(data => {
  console.log('✅ Backend reachable:', data);
})
.catch(error => {
  console.error('❌ Backend not reachable:', error);
});

// Test 2: Check session test endpoint
fetch('http://localhost:3001/auth/session-test', { 
  credentials: 'include' 
})
.then(response => response.json())
.then(data => {
  console.log('📋 Session test:', data);
})
.catch(error => {
  console.error('❌ Session test failed:', error);
});

// Test 3: Try to access protected endpoint (should fail without login)
fetch('http://localhost:3001/auth/profile', { 
  credentials: 'include' 
})
.then(response => {
  if (response.status === 401) {
    console.log('✅ Protected route correctly blocked (401)');
  } else {
    return response.json().then(data => {
      console.log('👤 Already logged in:', data);
    });
  }
})
.catch(error => {
  console.log('✅ Protected route correctly blocked:', error.message);
});

console.log('🔍 Check Network tab to see session cookies being set/sent');
console.log('📱 To test login, use the login form on the website');
