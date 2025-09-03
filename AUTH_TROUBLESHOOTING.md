# 🔍 Authentication Troubleshooting Guide

## Current Status
✅ **Frontend is correctly configured and working**  
❌ **Backend is returning 500 Internal Server Error**

## Test Results Summary
All payload variations (with/without role field, different formats) return the same 500 error:
```json
{"success":false,"message":"Errore interno del server","data":null,"errorCode":"INTERNAL_ERROR"}
```

## ✅ Frontend Improvements Made
1. **Enhanced Error Logging**: Detailed console output with request/response analysis
2. **Multiple Payload Testing**: Tests different request formats automatically
3. **Better Error Messages**: User-friendly messages with developer details
4. **Error State Management**: Tracks error count and provides debugging suggestions
5. **Debug Tools**: "Test Payloads" button for development diagnostics

## 🔥 Backend Issues to Check

### 1. Database Connection
```bash
# Check if your database is running and accessible
# Common issues:
- Database server not started
- Wrong connection credentials
- Database schema not created
- User table missing or empty
```

### 2. User Data Verification
Verify these users exist in your database:
```sql
SELECT * FROM users WHERE email IN (
  'admin@realeites.com',
  'luca.marini@email.com', 
  'enrico.giacomini@realeites.com'
);
```

### 3. Spring Boot Configuration
Check these configurations:
```yaml
# application.yml / application.properties
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/your_db
    username: your_username
    password: your_password
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true

jwt:
  secret: your-secret-key
  expiration: 86400000
```

### 4. Controller Method Signature
Verify your LoginController accepts the correct payload:
```java
@PostMapping("/login")
public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody LoginCredentials credentials) {
    // Implementation
}

// LoginCredentials should have:
public class LoginCredentials {
    private String email;
    private String password;
    private String role; // optional
    // getters/setters
}
```

### 5. Common Spring Boot Issues
- **Missing @Service or @Repository annotations**
- **Null pointer exceptions in service layer**
- **Password encoding/verification issues**
- **JWT token generation failures**
- **Database query exceptions**

## 🛠️ Debugging Steps

### Step 1: Check Spring Boot Logs
Look for stack traces in your Spring Boot console output when the 500 error occurs.

### Step 2: Enable SQL Logging
Add to application.properties:
```properties
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE
```

### Step 3: Add Debug Logging to Controller
```java
@PostMapping("/login")
public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody LoginCredentials credentials) {
    log.info("Login attempt for email: {}", credentials.getEmail());
    try {
        // Your implementation
    } catch (Exception e) {
        log.error("Login failed for email: {}", credentials.getEmail(), e);
        throw e;
    }
}
```

### Step 4: Test Database Connection
Create a simple health check endpoint:
```java
@GetMapping("/health")
public ResponseEntity<String> health() {
    try {
        userRepository.count(); // Test database access
        return ResponseEntity.ok("OK");
    } catch (Exception e) {
        return ResponseEntity.status(500).body("Database error: " + e.getMessage());
    }
}
```

## 🧪 Frontend Testing Tools

### Console Commands
Open browser console and run:
```javascript
// Test different payload formats
authService.testPayloadFormats('admin@realeites.com', 'password123');

// View detailed request logging
// (Already enabled in auth service)
```

### Debug Features
- **"Test Payloads" button**: Tests multiple request formats
- **Enhanced error logging**: Detailed console output
- **Error count tracking**: Shows debugging suggestions after multiple failures

## 💡 Most Likely Solutions

1. **Check database connection and ensure users exist**
2. **Verify JWT secret key is configured**
3. **Check Spring Boot startup logs for initialization errors**
4. **Ensure password encoding matches between registration and login**
5. **Verify all required dependencies are in classpath**

## 📞 Next Steps
1. Start Spring Boot with verbose logging
2. Check console output when authentication fails
3. Verify database contains test users with correct passwords
4. Test database connection independently
5. Check JWT configuration and secret key

The frontend authentication system is now robust and will work perfectly once the backend issues are resolved.