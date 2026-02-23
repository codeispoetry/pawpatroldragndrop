# 🐕 Hunde Heimfinden - Drag & Drop Spiel

Ein einfaches, kindgerechtes Drag & Drop Spiel für 4-Jährige als Progressive Web App (PWA).

https://codeispoetry.github.io/pawpatroldragndrop

## Spielprinzip

- 5 verschiedenfarbige Hundefiguren müssen zu ihren passenden Nestern gezogen werden
- Einfache Drag & Drop Funktionalität (funktioniert auch auf Tablets/Handys)
- Sofortiges positives Feedback mit Sounds und Animationen
- Automatischer Neustart nach erfolgreichem Abschluss

## Features

- 🎮 Sofort spielbereit - keine Menüs oder komplizierte Einstellungen
- 📱 Progressive Web App - kann wie eine native App installiert werden
- 🔊 Einfache, positive Sound-Effekte
- 🎨 Kinderfreundliche, bunte Grafik
- ✨ Belohnungsanimationen (Konfetti beim Gewinnen)
- 📴 Funktioniert offline
- 🔄 Einfacher Neustart-Button

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

- **HTML5**: Semantische Struktur
- **CSS3**: Responsive Design, Animationen
- **JavaScript**: Drag & Drop API, Touch Events, Web Audio API
- **PWA**: Service Worker, Manifest, Offline-Support
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
├── index.html          # Haupt-HTML-Datei
├── style.css           # Kindgerechtes CSS-Design
├── script.js           # Spiellogik und PWA-Features
├── manifest.json       # PWA-Manifest
├── sw.js              # Service Worker für Offline-Support
└── README.md          # Diese Datei
```

### Anpassungen:
- Farben in `style.css` ändern
- Anzahl der Hunde in `script.js` anpassen (Variable `totalDogs`)
- Sounds in den Funktionen `playSuccessSound()` und `playWinSound()` modifizieren

## Lizenz

Dieses Projekt ist als Lernsoftware für Kinder entwickelt und frei verwendbar.