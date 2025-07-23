# Transform Service Documentation

The Transform Service acts as a bridge between your backend API and frontend components, handling data transformation and language mapping between Italian and English.

## Features

- **Language Support**: Maps Italian field names to English frontend structure
- **Type Safety**: Full TypeScript support with proper type checking
- **Error Handling**: Graceful error handling with fallback values
- **Validation**: Built-in field validation
- **Sanitization**: Data cleaning and type conversion

## Usage Examples

### Basic Usage

```typescript
import { TransformService } from '@core/services';

constructor(private transform: TransformService) {}

// Transform single user from Italian backend Utente entity
const backendUtente = {
  id: 123,
  nome: 'Mario',
  cognome: 'Rossi',
  dataNascita: '1995-05-15',
  indirizzo: 'Via Roma 123, Milano',
  cellulare: '+39 123 456 7890',
  email: 'mario.rossi@example.com',
  username: 'mario.rossi',
  ruolo: 'STUDENTE',
  tutor: {
    id: 456,
    nome: 'Giuseppe',
    cognome: 'Bianchi',
    email: 'giuseppe@tutor.com',
    ruolo: 'TUTOR'
  }
};

const frontendUser = this.transform.user.fromBackend(backendUtente);
// Result: { 
//   id: '123', 
//   name: 'Mario', 
//   surname: 'Rossi', 
//   birthDate: Date(1995-05-15),
//   address: 'Via Roma 123, Milano',
//   phoneNumber: '+39 123 456 7890',
//   email: 'mario.rossi@example.com',
//   username: 'mario.rossi',
//   role: 'STUDENT',
//   tutor: { name: 'Giuseppe', surname: 'Bianchi', ... }
// }
```

### API Response Transformation

```typescript
// Transform API response
this.apiService.getUsers().subscribe(response => {
  const users = this.transform.transformApiResponseArray(response, 
    data => this.transform.user.fromBackendArray(data)
  );
  this.users = users;
});
```

### Attendance Data with Stato Enum

```typescript
// Transform backend AttendanceDTO with Stato enum
const backendAttendance = {
  id: 456,
  studentId: 123,
  data: '2024-01-15',
  stato: Stato.PRESENTE,
  orarioEntrata: '2024-01-15T08:00:00Z',
  orarioUscita: '2024-01-15T17:00:00Z',
  note: 'Presente in orario',
  statoApprovazione: StatoApprovazione.APPROVATO,
  approvatoIl: '2024-01-15T18:00:00Z',
  latitudine: 45.4642,
  longitudine: 9.1900,
  creatoIl: '2024-01-15T07:00:00Z',
  aggiornatoIl: '2024-01-15T18:00:00Z'
};

const attendance = this.transform.attendance.fromBackend(backendAttendance);
// Result: {
//   id: '456',
//   studentId: '123',
//   status: AttendanceStatus.PRESENT,
//   approvalStatus: ApprovalStatus.APPROVED,
//   notes: 'Presente in orario',
//   latitude: 45.4642,
//   longitude: 9.1900,
//   ...
// }
```

### Safe Transformation

```typescript
// Safe transformation with fallback
const user = this.transform.safeTransform(
  backendData,
  data => this.transform.user.fromBackend(data),
  { id: '', name: 'Unknown', email: '', role: 'STUDENT' } // fallback
);
```

## Service Structure

- **BaseTransformService**: Core transformation engine
- **UserTransformerService**: User-specific transformations
- **JustificationTransformService**: Justification data transformations
- **AttendanceTransformService**: Attendance data transformations
- **TransformService**: Main service that aggregates all transformations

## Language Mappings

### User Fields (Utente Entity)
- `id` (Integer) → `id` (string)
- `nome` → `name`
- `cognome` → `surname`
- `dataNascita` (LocalDate) → `birthDate` (Date)
- `indirizzo` → `address`
- `cellulare` → `phoneNumber`
- `email` → `email`
- `username` → `username`
- `ruolo` → `role`
- `tutor` (nested Utente) → `tutor` (nested User)
- Role mappings:
  - `STUDENTE` → `STUDENT`
  - `TUTOR` → `TUTOR`
  - `ADMIN` / `AMMINISTRATORE` → `ADMIN`

### Attendance Fields (AttendanceDTO)
- `id` (Integer) → `id` (string)
- `studentId` (Integer) → `studentId` (string)
- `data` (LocalDate string) → `date` (Date)
- `stato` (Stato enum) → `status` (AttendanceStatus)
- `orarioEntrata` (LocalDateTime string) → `timeIn` (Date)
- `orarioUscita` (LocalDateTime string) → `timeOut` (Date)
- `note` → `notes`
- `statoApprovazione` (StatoApprovazione enum) → `approvalStatus` (ApprovalStatus)
- `approvatoDa` → `approvedById`
- `approvatoIl` → `approvedAt`
- `motivoRifiuto` → `rejectionReason`
- `latitudine` → `latitude`
- `longitudine` → `longitude`
- `creatoIl` → `createdAt`
- `aggiornatoIl` → `updatedAt`

#### Backend Enum Mappings:
- **Stato enum:**
  - `PRESENTE` → `AttendanceStatus.PRESENT`
  - `ASSENTE` → `AttendanceStatus.ABSENT`
- **StatoApprovazione enum:**
  - `IN_ATTESA` → `ApprovalStatus.PENDING`
  - `APPROVATO` → `ApprovalStatus.APPROVED`
  - `RIFIUTATO` → `ApprovalStatus.REJECTED`

### Justification Fields (JustificationDTO)
- `id` (Integer) → `id` (string)
- `studentId` (Integer) → `studentId` (string) 
- `data` (LocalDate string) → `date` (string)
- `dataPresenza` (LocalDate string) → `attendanceDate` (string)
- `tipo` (TipoGiustificazione enum) → `type` (JustificationType)
- `motivo` → `reason`
- `descrizione` → `description`
- `stato` (StatoApprovazione enum) → `status` ('pending'|'approved'|'rejected')
- `inviatoIl` (LocalDateTime string) → `submittedAt` (Date)
- `rivistoDa` → `reviewedBy`
- `revistoIl` (LocalDateTime string) → `reviewedAt` (Date)
- `noteRevisione` → `reviewNotes`
- `allegati` → `attachments`

#### Backend Enum Mappings:
- **TipoGiustificazione enum:**
  - `MEDICO` → `'medical'`
  - `MALATTIA` → `'illness'`
  - `FAMIGLIA` → `'family'`
  - `ALTRO` → `'other'`

## Error Handling

All transform services include:
- Required field validation
- Type validation
- Graceful error handling
- Detailed error messages
- Safe transformation methods

## Best Practices

1. Always use the main `TransformService` instead of individual services
2. Use `safeTransform` for uncertain data
3. Handle API responses with `transformApiResponse` methods
4. Provide meaningful fallback values
5. Log transformation errors for debugging