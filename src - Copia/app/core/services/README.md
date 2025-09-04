# Cosa fa il 'transform layer' service?
  obiettivo principale è quello di sopperire al gap creato dalla discrepanza di dati tra il back-end e front-end. 

# funzionalità
**supporto della lingua** mapping per la differenza delle lingue usate: inglese per frontend e italiano per backend.
**type safety** typechecking con ts
**gestione errori**gestione errori
**validation** validazione
**sanitization** data cleaning e conversione delle stringhe e degli array/data/number/string 


# Suggerimenti
Il layer **deve** essere  stateless, senza elementi di presentazione e che non crei una situazione "bottleneck":

  >il layer è stateless (spero), non sono presenti variabili che immagazzinano stati.
  >i metodi sono funzioni (input e output uguali)
  >non ci sono dipendenze esterne a parte il BaseTransformService
  >ogni transform e indipendente

  >>il layer non presenta alcuna componente di design 

  >>>bottleneck situation. 
  >>> il layer è scalabile, non sono presenti "nested loops" o chiamate API
  >>> non sono presenti operazioni IO


# pattern usati 
**singola responsabilità** - ogni servizio gestisce solo una cosa 
**dependecy injection** di BaseTransformSErvice
**funzioni pure** 
**data validation** 
**mapping degli enum**
**null coalescing**


# come è stato pensato 
>Questo layer ha una funzione unica, trasformare i dati e non svolge altro compito
>>le componenti gestiranno la presentazione 
>>>i pipe gestiranno il display formatting 
>>>> i services business logc 

# sezione esempi
  ## come avviene la conversione di:
 
  ### user
   ### Input (Backend DTO)
  ```
  
  {
    id: 1,
    nome: "Dante",
    cognome: "Alighieri",
    email: "dante.alighieri@email.com",
    ruolo: "STUDENTE",
    
    tutor: {
      id: 2,
      nome: "virgilio",
      cognome: "il Duca",
      ruolo: "TUTOR"
    }
  }
```

  ### Output (Frontend Model)
```
  {
    id: "1",
    name: "Dante",
    surname: "Alighieri",
    email: "dante.alighieri@email.com",
    role: "student",
    profilePicture: "",
    isActive: true,
    tutor: {
      id: "2",
      name: "Virgilio",
      surname: "il Duca",
      role: "tutor"
    }
  }
```

### presenza
  ### Input
  ```
    {
      id: 1,
      data: "2024-01-15",
      stato: "PRESENTE",
      stato_approvazione: "APPROVATO"
    }
  ```
   ### Output
  ```
    {
     id: "1",
      date: new Date("2024-01-15"),
      status: "present",
      approvalStatus: "approved"
    }
  ```

  ### gestione degli errori 
  
  >>dati errati
  { email: "invalid-email", ruolo: "UNKNOWN_ROLE" }

 >>Validazione dei dati fallita, i dati vengono 'sanificati' e reimpostati in maniera 'sicura'
  {
    email: "",  **campo non valido sostituito con una stringa vuota**
    role: "student" **il valore non essendo riconosciuto viene impostato di default come studente**
  }
  



