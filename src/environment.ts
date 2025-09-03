export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  wsUrl: 'http://localhost:8080',
  appName: 'Registro Elettronico',
  version: '1.0.0',


  // backdoor
  enableAuthBypass: false,
  developmentUsers: {
    'student@demo.com': {
      id: 1,
      email: 'student@demo.com',
      nome: 'Mario',
      cognome: 'Rossi',  
      ruolo: 'student',
      name: 'Mario',
      surname: 'Rossi',
      role: 'student',
      isActive: true
    },
    'tutor@demo.com': {
      id: 2,
      email: 'tutor@demo.com',
      nome: 'Prof. Anna',
      cognome: 'Bianchi',
      ruolo: 'tutor',
      name: 'Prof. Anna',
      surname: 'Bianchi', 
      role: 'tutor',
      isActive: true
    },
    'admin@demo.com': {
      id: 3,
      email: 'admin@demo.com',
      nome: 'Admin',
      cognome: 'System',
      ruolo: 'admin',
      name: 'Admin',
      surname: 'System',
      role: 'admin',
      isActive: true
    }
  }
};
