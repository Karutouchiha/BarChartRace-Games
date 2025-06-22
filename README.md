# Story Telling with Data: Top-Videogame-Genres (1985–2016)

**Kurzfassung:**  
Diese Dokumentation fasst den Aufbau und die zentralen Erkenntnisse unserer interaktiven D3.js-Visualisierung der Top-Videogame-Genres (1985–2016) kompakt zusammen.



## Kurs & Team
- **Kurs:** Informationsvisualisierung, FH Salzburg  
- **Team:** Game Insights – Sarah Haböck, Christina Kollnig, Dina Alhusaini  
- **Version:** v1.0.0 (erstellt am 22.06.2025)



## Inhaltsverzeichnis
1. [Zielsetzung & Zielgruppe](#zielsetzung--zielgruppe)  
2. [Workflow & Datenaufbereitung](#workflow--datenaufbereitung)  
3. [Architektur & Komponenten](#architektur--komponenten)  
4. [Design & Interaktion](#design--interaktion)  
5. [Herausforderungen & Erkenntnisse](#herausforderungen--erkenntnisse)  
6. [Evaluation & Resultate](#evaluation--resultate)  
7. [Ausblick & To-Do](#ausblick--to-do)  
8. [Lizenzhinweise & Bildquellen](#lizenzhinweise--bildquellen)



## Zielsetzung & Zielgruppe
**Ziel:**  
Visualisierung der fünf erfolgreichsten Videospiel-Genres (Top 5) von 1985 bis 2016 und deren regionale Verkaufsentwicklung in Nordamerika, Europa und Japan.

**Zielgruppe:**  
- Spieler:innen, die Genre-Trends im Zeitverlauf verfolgen möchten  
- Studierende und Data-Viz-Enthusiast:innen, die nach einem interaktiven D3.js-Beispiel suchen



## Workflow & Datenaufbereitung
**Datenquelle:**  
- CSV „Video Game Sales“ von Kaggle: https://www.kaggle.com/datasets/gregorut/videogamesales

**Einlesen & Cleaning:**  
1. Laden mit `d3.csv(..., d3.autoType)`  
2. Entfernen leerer Jahre und Nullwerte

**Aggregation:**  
- `byYearGenre`: Summierung `Global_Sales` pro Jahr und Genre  
- Regionale Tabelle: Aufsummieren der Verkäufe in NA, EU und JP



## Architektur & Komponenten
| Komponente            | Datei(en)               | Beschreibung                                          |
|-----------------------|-------------------------|-------------------------------------------------------|
| Header & Hero         | `index.html`, `styles.css`   | Titel, Logo, Retro-Design                             |
| Fun-Fact-Cards        | `index.html`            | Fakten zu Wii Sports, GTA V, Super Mario Bros.        |
| Bar-Chart-Race        | `barChartRace.js`       | Animierte Top-5-Balken mit Verkaufszahlen am Ende     |
| Stacked-Area-Chart    | `stackedArea.js`        | Gestapelte Flächen für Regionen; Filter per Checkbox  |
| State-Management      | `state.js`, `main.js`   | Zentrales Event-System zur Synchronisation von Jahr und Regionen |



## Design & Interaktion
- **Farbschema:** Drei kontrastierende Farben für NA, EU, JP  
- **Slider:** Auswahl des Jahres (1985–2016) – GIF unter `/assets/demo.gif`  
- **Checkboxen:** Ein-/Ausblenden einzelner Regionen  
- **Animation:** Sanftes Übergangs-Rendering per D3-Transition  
- **Screenshots/GIFs:** `/assets/screenshots/`, `/assets/demo.gif`



## Herausforderungen & Erkenntnisse
- **CORS-Problematik:** Lokales Laden der CSV erfordert HTTP-Server (z. B. VS Code Live Server)  
- **Uneinheitliche Genre-Namen:** Varianten wie „Role-Playing“ vs. „Role Playing“ – geringe Auswirkung auf Top 5  
- **Projektstruktur:** Konsistente Verzeichnis- und Pfadnamen essentiell für Modul-Importe



## Evaluation & Resultate
**Funktions-Checkliste:**  
- Datenimport und Cleaning: ✅  
- Aggregation korrekt: ✅  
- Animation & Interaktivität: ✅  
- Performance getestet: ✅

**Feedback:**  
- Nutzer:innen fanden die Animation flüssig und informativ  
- Wunsch: Erweiterung um andere Regionen (z. B. Asien gesamt)



## Ausblick & To-Do
- **Geplante Features:**  
  - Mobile-Optimierung  
  - Konsistente Genre-Cleaning-Logik  
  - Einbindung weiterer Regionen (Asien, Rest der Welt)



## Lizenzhinweise & Bildquellen
Alle Cover-Bilder dienen ausschließlich zu Lehr- und Demonstrationszwecken. Rechte liegen bei den jeweiligen Rechteinhabern.

## Lizenzhinweise & Bildquellen

Alle Cover-Bilder dienen ausschließlich zu Lehr- und Demonstrationszwecken. Rechte liegen bei den jeweiligen Rechteinhabern.

| Spiel                | Bildquelle                                                                                                         | Lizenzhinweis                                      |
|----------------------|--------------------------------------------------------------------------------------------------------------------|----------------------------------------------------|
| Wii Sports           | [Wii Sports Europe](https://upload.wikimedia.org/wikipedia/commons/1/18/Wii_Sports_Europe.jpg)                     | © Nintendo, nur zu Lehr-/Demozwecken verwendet     |
| Grand Theft Auto V   | [GTA V](https://upload.wikimedia.org/wikipedia/commons/d/dc/Grand_Theft_Auto_V.png)                                 | © Rockstar Games, nur zu Lehr-/Demozwecken verwendet |
| Super Mario Bros.    | [Super Mario Bros. Box](https://upload.wikimedia.org/wikipedia/commons/6/6d/Super_Mario_Bros._box.png)              | © Nintendo, nur zu Lehr-/Demozwecken verwendet     |
