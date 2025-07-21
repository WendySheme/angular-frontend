export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  wsUrl: 'http://localhost:3000',
  appName: 'Registro Elettronico',
  version: '1.0.0',
  // Development bypass - remove in production
  enableAuthBypass: true,
  developmentUsers: {
    'student@demo.com': {
      id: 'dev-student-1',
      email: 'student@demo.com',
      name: 'Mario',
      surname: 'Rossi',
      role: 'student',
      studentId: 'STU001',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    'tutor@demo.com': {
      id: 'dev-tutor-1',
      email: 'tutor@demo.com',
      name: 'Prof. Anna',
      surname: 'Bianchi',
      role: 'tutor',
      tutorId: 'TUT001',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    'admin@demo.com': {
      id: 'dev-admin-1',
      email: 'admin@demo.com',
      name: 'Admin',
      surname: 'System',
      role: 'admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }
};
