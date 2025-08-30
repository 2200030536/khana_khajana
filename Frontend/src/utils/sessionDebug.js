import axiosInstance from '../axiosConfig';

// Debug utility to test session functionality
export const debugSession = async () => {
  try {
    console.log('=== Session Debug Test ===');
    
    // Test if backend is reachable
    const healthResponse = await axiosInstance.get('/');
    console.log('✅ Backend is reachable:', healthResponse.data);
    
    // Test session endpoint
    const sessionResponse = await axiosInstance.get('/auth/session-test');
    console.log('📋 Session test result:', sessionResponse.data);
    
    // Test profile endpoint (requires authentication)
    try {
      const profileResponse = await axiosInstance.get('/auth/profile');
      console.log('👤 Profile data:', profileResponse.data);
    } catch (profileError) {
      console.log('❌ Profile access failed (expected if not logged in):', profileError.response?.status);
    }
    
    console.log('=== End Session Debug ===');
    return sessionResponse.data;
  } catch (error) {
    console.error('🚨 Session debug failed:', error.response?.data || error.message);
    throw error;
  }
};

// Test login functionality
export const debugLogin = async (credentials = { email: 'test@test.com', password: 'test' }) => {
  try {
    console.log('=== Login Debug Test ===');
    console.log('Attempting login with:', credentials);
    
    const loginResponse = await axiosInstance.post('/auth/login', credentials);
    console.log('✅ Login successful:', loginResponse.data);
    
    // Test session after login
    const sessionAfterLogin = await axiosInstance.get('/auth/session-test');
    console.log('📋 Session after login:', sessionAfterLogin.data);
    
    console.log('=== End Login Debug ===');
    return loginResponse.data;
  } catch (error) {
    console.error('🚨 Login debug failed:', error.response?.data || error.message);
    throw error;
  }
};
