
export interface UtenteDTO {
  id: number;
  nome: string;
  cognome: string;
  dataNascita?: string;
  indirizzo?: string;
  cellulare?: string;
  email: string;
  username?: string;
  password?: string;
  ruolo: RuoloEnum;
  tutor?: UtenteDTO;
  students?: UtenteDTO[];
}

export enum RuoloEnum {
  STUDENTE = 'STUDENTE',
  TUTOR = 'TUTOR',
  ADMIN = 'ADMIN',
}

export enum Stato {
  PRESENTE = 'PRESENTE',
  ASSENTE = 'ASSENTE'
}

export enum StatoApprovazione {
  IN_ATTESA = 'IN_ATTESA',
  APPROVATO = 'APPROVATO',
  RIFIUTATO = 'RIFIUTATO'
}

export enum TipoGiustificazione {
  MEDICO = 'MEDICO',
  MALATTIA = 'MALATTIA',
  FAMIGLIA = 'FAMIGLIA',
  ALTRO = 'ALTRO'
}


export interface PresenzaDTO {
id:number;
data:string;
approvato: boolean;
user: UtenteDTO;
idGiustificativo?:number;
idMese?:number;
mese: MeseDTO;
}

export interface GiustificativoDTO {
id:number;
descrizione:string;
accettata: boolean;
}

export interface MeseDTO {
id: number;
meseChiuso:boolean;
numeroMese:number;
anno: number;
utente: UtenteDTO;
}

