# � PAW Patrol Einsatz! - Drag & Drop Spiel

Ein kindgerechtes PAW Patrol Drag & Drop Spiel für 4-Jährige als Progressive Web App (PWA).

https://codeispoetry.github.io/pawpatroldragndrop

![QR Code](qr.png)

## Spielprinzip

- 6 PAW Patrol Welpen (Marshall, Chase, Rocky, Rubble, Skye, Zuma) müssen zu ihren passenden Fahrzeugen gezogen werden
- Intuitive Drag & Drop Funktionalität (optimiert für Touch-Geräte)
- Sofortiges positives Feedback mit Animationen und visuellen Effekten
- Timer-basierte Highscore-Liste mit localStorage-Speicherung
- Zufällige Anordnung der Charaktere bei jedem Spiel
- Automatische Namenseingabe für Highscores nach erfolgreichem Abschluss

## Features

- 🎮 **Sofort spielbereit** - keine Menüs oder komplizierte Einstellungen
- 🐕 **PAW Patrol Charaktere** - detaillierte SVG-Grafiken aller 6 Welpen
- 🚗 **Fahrzeug-Matching** - Feuerwehr, Polizeiauto, Bagger, Helikopter und mehr
- 📱 **Progressive Web App** - installierbar wie eine native App
- ⏱️ **Highscore-System** - Zeit messen und beste Rekorde speichern
- 🔀 **Zufällige Anordnung** - bei jedem Spielstart neue Positionen
- 📱 **Touch-optimiert** - perfekt für Tablets und Smartphones
- ✨ **Belohnungsanimationen** - Konfetti beim Gewinnen
- 📴 **Offline-fähig** - funktioniert ohne Internetverbindung
- 🏆 **Bestenliste** - Top 10 Zeiten mit Name und Zeit

## PAW Patrol Charaktere

Das Spiel enthält alle 6 Hauptcharaktere der PAW Patrol mit ihren charakteristischen Fahrzeugen:

- 🔥 **Marshall** - Feuerwehrwelpe mit Feuerwehrauto
- 🚔 **Chase** - Polizeiwelpe mit Polizeiauto  
- ♻️ **Rocky** - Recycling-Welpe mit Müllwagen
- 🚧 **Rubble** - Bau-Welpe mit Bagger
- 🚁 **Skye** - Flug-Welpe mit Helikopter
- 🌊 **Zuma** - Wasser-Welpe mit Hovercraft

Jeder Charakter ist als detaillierte SVG-Grafik mit originaltreuen Farben und Ausrüstung gestaltet.

## Installation und Start

### Als Webseite öffnen:
1. Öffne die `index.html` in einem modernen Browser
2. Das Spiel startet sofort

### Als PWA installieren:
1. Öffne die Seite im Browser (Chrome, Safari, Edge, Firefox)
2. Klicke auf das "Installieren" Icon in der Adressleiste
3. Die App wird wie eine native App installiert

### Lokaler Server (empfohlen für PWA-Features):
```bash
# Mit Python
python -m http.server 8000

# Mit Node.js
npx serve .

# Dann öffne: http://localhost:8000
```

## Technische Details

- **HTML5**: Semantische Struktur mit PAW Patrol Charakteren
- **CSS3**: Responsive Design, Touch-Optimierungen, Animationen
- **JavaScript**: Drag & Drop API, Touch Events, Timer-System, Highscore-Verwaltung
- **SVG-Grafiken**: Custom PAW Patrol Charaktere und Fahrzeuge
- **PWA**: Service Worker, Manifest, Offline-Support, PNG-Icons
- **localStorage**: Persistente Highscore-Speicherung
- **Keine externen Abhängigkeiten**

## Browser-Kompatibilität

- ✅ Chrome/Chromium (Desktop & Mobile)
- ✅ Firefox (Desktop & Mobile)
- ✅ Safari (Desktop & Mobile)  
- ✅ Edge (Desktop & Mobile)
- ✅ Tablet-optimiert

## Für Entwickler

### Dateistruktur:
```
├── index.html          # Haupt-HTML mit PAW Patrol Charakteren
├── style.css           # Responsive Design und Touch-Optimierung
├── script.js           # Spiellogik, Timer und Highscore-System
├── manifest.json       # PWA-Manifest mit korrekten Icons
├── sw.js              # Service Worker für Offline-Support
├── icon-144.png       # PWA Icon (144x144)
├── icon-192.png       # PWA Icon (192x192)
├── icon-512.png       # PWA Icon (512x512)
└── README.md          # Diese Datei
```

### Anpassungen:
- PAW Patrol Farben und Charaktere in `style.css`
- Anzahl der Welpen in `script.js` anpassen (Variable `totalDogs = 6`)
- Highscore-Funktionen in `loadHighscores()` und `saveHighscore()` anpassen
- Timer-Intervall in `updateTimer()` modifizieren

## Lizenz

Dieses PAW Patrol inspirierte Spiel ist als Lernsoftware für Kinder entwickelt und frei verwendbar.

---

**Hinweis**: Dies ist ein inoffizielles Fan-Projekt. PAW Patrol™ ist ein Markenzeichen von Spin Master Ltd.