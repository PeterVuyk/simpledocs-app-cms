Upload een beslisboom als csv-bestand met svg illustratie. 
Na het uploaden wordt deze weergegeven in de concepten weergave. 
Zodra je de beslisboom publiceert wordt de contentId verwisselt 
met het daadwerkelijke bestand om zo te voorkomen dat wijzigingen 
op het bestand geen invloed hebben op wat al gepubliceerd is.

Wil je een gepubliceerde beslisboom wijzigen? Upload de wijzigingen 
en geef hierbij dezelfde titel op. De gepubliceerde beslisboom wordt
vervolgens automatisch gemarkeerd voor verwijdering.

De volgende validaties worden uitgevoerd op het csv-bestand:

- id (een verplicht veld, unieke oplopende nummer)
- label (een verplicht veld, de vraagstelling of laatste antwoord van de besliboom)
- parentId (met uitzondering van de eerste vraag een verplicht veld, verwijst naar het id van de bovenliggende vraagstelling)
- lineLabel (met uitzondering van de eerste vraag een verplicht veld, 'Ja' of 'Nee')
- contentId (deze is alleen verplicht voor het laatste antwoord, verwijzing naar het 'ID bestand' die je wilt weergeven)
