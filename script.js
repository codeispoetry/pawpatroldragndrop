// Paw Patrol Spiel Variablen
let dogsPlaced = 0;
const totalDogs = 6;
let gameCompleted = false;

// Highscore System
let gameStartTime = null;
let gameEndTime = null;
let gameTimer = null;
let currentGameTime = 0;

// Sounds (einfache Audio-Feedback mit Web Audio API)
function playSuccessSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}

function playWinSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    
    frequencies.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + index * 0.15);
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime + index * 0.15);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.15 + 0.4);
        
        oscillator.start(audioContext.currentTime + index * 0.15);
        oscillator.stop(audioContext.currentTime + index * 0.15 + 0.4);
    });
}

// Drag and Drop Event Listener
document.addEventListener('DOMContentLoaded', function() {
    initializeGame();
    loadHighscores();
    startGameTimer();
    
    // Enter-Taste im Namens-Input
    document.getElementById('playerName').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            saveHighscore();
        }
    });
});

// Shuffle-Funktion für zufällige Reihenfolge
function shuffleElements() {
    // Dogs shuffeln
    const dogsArea = document.querySelector('.dogs-area');
    const dogs = Array.from(dogsArea.children);
    
    // Fisher-Yates Shuffle Algorithm
    for (let i = dogs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [dogs[i], dogs[j]] = [dogs[j], dogs[i]];
    }
    
    // Elemente in neuer Reihenfolge zurück ins DOM
    dogs.forEach(dog => dogsArea.appendChild(dog));
    
    // Nests shuffeln
    const nestsArea = document.querySelector('.nests-area');
    const nests = Array.from(nestsArea.children);
    
    // Fisher-Yates Shuffle Algorithm
    for (let i = nests.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [nests[i], nests[j]] = [nests[j], nests[i]];
    }
    
    // Elemente in neuer Reihenfolge zurück ins DOM
    nests.forEach(nest => nestsArea.appendChild(nest));
}

function initializeGame() {
    // Zufällige Reihenfolge der Elemente
    shuffleElements();
    
    const dogs = document.querySelectorAll('.dog');
    const nests = document.querySelectorAll('.nest');
    
    // Event Listener für Hunde (Drag)
    dogs.forEach(dog => {
        dog.addEventListener('dragstart', handleDragStart);
        dog.addEventListener('dragend', handleDragEnd);
        
        // Touch Events für Mobilgeräte - optimiert
        dog.addEventListener('touchstart', handleTouchStart, { passive: false });
        dog.addEventListener('touchmove', handleTouchMove, { passive: false });
        dog.addEventListener('touchend', handleTouchEnd, { passive: false });
        dog.addEventListener('touchcancel', handleTouchCancel, { passive: false });
        
        // Verhindere Context-Menü auf Touch-Geräten
        dog.addEventListener('contextmenu', e => e.preventDefault());
    });
    
    // Event Listener für Nester (Drop)
    nests.forEach(nest => {
        nest.addEventListener('dragover', handleDragOver);
        nest.addEventListener('drop', handleDrop);
        nest.addEventListener('dragenter', handleDragEnter);
        nest.addEventListener('dragleave', handleDragLeave);
    });
    
    updateProgress();
}

// Drag Events
let draggedElement = null;

function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.outerHTML);
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    draggedElement = null;
}

function handleDragEnter(e) {
    e.preventDefault();
    this.classList.add('drag-over');
}

function handleDragLeave(e) {
    this.classList.remove('drag-over');
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
    
    if (draggedElement && !this.classList.contains('occupied')) {
        const dogColor = draggedElement.dataset.color;
        const nestColor = this.dataset.color;
        
        if (dogColor === nestColor) {
            // Erfolgreiche Platzierung
            placeDogInNest(draggedElement, this);
        } else {
            // Falsche Platzierung - Hund zurück zur ursprünglichen Position
            animateIncorrectPlacement();
        }
    }
}

// Touch Events für Mobilgeräte - Verbessert
let touchDragElement = null;
let touchOffset = { x: 0, y: 0 };
let initialTouchPosition = { x: 0, y: 0 };
let isDragging = false;
let dragThreshold = 5; // Pixel threshold für Drag-Start
let currentDropZone = null;

function handleTouchStart(e) {
    e.preventDefault();
    
    // Wenn bereits ein anderes Element gedraggt wird, abbrechen
    if (touchDragElement && touchDragElement !== this) {
        return;
    }
    
    touchDragElement = this;
    isDragging = false;
    
    const touch = e.touches[0];
    const rect = this.getBoundingClientRect();
    
    // Ursprüngliche Position merken
    initialTouchPosition.x = touch.clientX;
    initialTouchPosition.y = touch.clientY;
    
    touchOffset.x = touch.clientX - rect.left;
    touchOffset.y = touch.clientY - rect.top;
    
    // Kurze Vibration auf unterstützten Geräten
    if ('vibrate' in navigator) {
        navigator.vibrate(10);
    }
    
    // Feedback-Klasse hinzufügen
    this.classList.add('touch-active');
}

function handleTouchMove(e) {
    if (!touchDragElement) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const moveDistance = Math.sqrt(
        Math.pow(touch.clientX - initialTouchPosition.x, 2) + 
        Math.pow(touch.clientY - initialTouchPosition.y, 2)
    );
    
    // Drag-Modus erst nach Threshold aktivieren
    if (!isDragging && moveDistance > dragThreshold) {
        isDragging = true;
        
        // Element für Dragging vorbereiten
        touchDragElement.style.position = 'fixed';
        touchDragElement.style.zIndex = '2000';
        touchDragElement.style.pointerEvents = 'none';
        touchDragElement.classList.add('dragging');
        touchDragElement.classList.remove('touch-active');
        
        // Körper scrolling verhindern
        document.body.style.overflow = 'hidden';
        
        console.log('Started dragging:', touchDragElement.dataset.color);
    }
    
    if (isDragging) {
        // Element position aktualisieren
        touchDragElement.style.left = (touch.clientX - touchOffset.x) + 'px';
        touchDragElement.style.top = (touch.clientY - touchOffset.y) + 'px';
        
        // Drop-Zone Highlighting
        checkDropZone(touch.clientX, touch.clientY);
    }
}

function handleTouchEnd(e) {
    if (!touchDragElement) return;
    e.preventDefault();
    
    touchDragElement.classList.remove('touch-active');
    
    if (!isDragging) {
        // Kein Drag, nur ein Tap - Element zurücksetzen
        resetTouchElement();
        return;
    }
    
    const touch = e.changedTouches[0];
    let nest = null;
    
    // Mehrere Strategien für Drop-Target-Detection
    // Strategie 1: pointer-events temporär aktivieren
    touchDragElement.style.pointerEvents = 'none';
    let elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    nest = elementBelow?.closest('.nest');
    
    // Strategie 2: Falls nicht gefunden, alle Nester prüfen
    if (!nest) {
        const nests = document.querySelectorAll('.nest');
        for (let nestElement of nests) {
            const rect = nestElement.getBoundingClientRect();
            if (touch.clientX >= rect.left && touch.clientX <= rect.right &&
                touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
                nest = nestElement;
                break;
            }
        }
    }
    
    // Strategie 3: Falls immer noch nicht gefunden, erweiterte Suche
    if (!nest) {
        const tolerance = 20; // Pixel-Toleranz
        const nests = document.querySelectorAll('.nest');
        for (let nestElement of nests) {
            const rect = nestElement.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const distance = Math.sqrt(
                Math.pow(touch.clientX - centerX, 2) + 
                Math.pow(touch.clientY - centerY, 2)
            );
            if (distance <= (Math.max(rect.width, rect.height) / 2) + tolerance) {
                nest = nestElement;
                break;
            }
        }
    }
    
    // Drop-Zone Highlighting entfernen
    clearDropZoneHighlights();
    
    console.log('Touch drop at:', touch.clientX, touch.clientY, 'Found nest:', nest);
    
    if (nest && !nest.classList.contains('occupied')) {
        const dogColor = touchDragElement.dataset.color;
        const nestColor = nest.dataset.color;
        
        console.log('Dog color:', dogColor, 'Nest color:', nestColor);
        
        if (dogColor === nestColor) {
            // Erfolgreiche Platzierung
            console.log('Successful placement!');
            const draggedDog = touchDragElement;
            resetTouchElement();
            placeDogInNest(draggedDog, nest);
            
            // Erfolgs-Vibration
            if ('vibrate' in navigator) {
                navigator.vibrate([50, 50, 50]);
            }
            return;
        } else {
            // Falsche Platzierung - Animation
            console.log('Wrong color placement');
            resetTouchElement();
            animateIncorrectPlacement();
            
            // Fehler-Vibration
            if ('vibrate' in navigator) {
                navigator.vibrate([100, 100, 100]);
            }
            return;
        }
    }
    
    // Kein gültiges Ziel - zurück zur ursprünglichen Position
    console.log('No valid target found, animating back');
    animateBackToOriginalPosition();
}

function handleTouchCancel(e) {
    if (touchDragElement) {
        clearDropZoneHighlights();
        animateBackToOriginalPosition();
    }
}

function checkDropZone(x, y) {
    let elementBelow = null;
    let nest = null;
    
    // Temporär pointer-events deaktivieren für bessere Detection
    if (touchDragElement) {
        touchDragElement.style.pointerEvents = 'none';
        elementBelow = document.elementFromPoint(x, y);
        touchDragElement.style.pointerEvents = 'none'; // Wieder auf none setzen
    }
    
    nest = elementBelow?.closest('.nest');
    
    // Fallback: Direkte Kollisionserkennung
    if (!nest) {
        const nests = document.querySelectorAll('.nest');
        for (let nestElement of nests) {
            const rect = nestElement.getBoundingClientRect();
            if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
                nest = nestElement;
                break;
            }
        }
    }
    
    // Alle Highlights entfernen
    clearDropZoneHighlights();
    
    // Neues Highlight setzen
    if (nest && !nest.classList.contains('occupied')) {
        const dogColor = touchDragElement.dataset.color;
        const nestColor = nest.dataset.color;
        
        if (dogColor === nestColor) {
            nest.classList.add('valid-drop-zone');
            currentDropZone = nest;
        } else {
            nest.classList.add('invalid-drop-zone');
            currentDropZone = null;
        }
    }
}

function clearDropZoneHighlights() {
    document.querySelectorAll('.nest').forEach(nest => {
        nest.classList.remove('valid-drop-zone', 'invalid-drop-zone', 'drag-over');
    });
    currentDropZone = null;
}

function animateBackToOriginalPosition() {
    if (!touchDragElement) return;
    
    touchDragElement.style.transition = 'all 0.3s ease-out';
    touchDragElement.style.left = '';
    touchDragElement.style.top = '';
    touchDragElement.style.transform = 'scale(1)';
    
    setTimeout(() => {
        resetTouchElement();
    }, 300);
}

function resetTouchElement() {
    if (touchDragElement) {
        touchDragElement.style.position = '';
        touchDragElement.style.left = '';
        touchDragElement.style.top = '';
        touchDragElement.style.zIndex = '';
        touchDragElement.style.pointerEvents = '';
        touchDragElement.style.transition = '';
        touchDragElement.classList.remove('dragging', 'touch-active');
        
        // Körper scrolling wieder aktivieren
        document.body.style.overflow = '';
        
        touchDragElement = null;
        isDragging = false;
        currentDropZone = null;
    }
    
    clearDropZoneHighlights();
}

// Spiellogik
function placeDogInNest(dog, nest) {
    // Spiel-Timer beim ersten Zug starten
    if (dogsPlaced === 0 && !gameStartTime) {
        gameStartTime = Date.now();
    }
    
    // Nest als belegt markieren
    nest.classList.add('occupied');
    
    // Hund ins Nest setzen
    nest.querySelector('.nest-inner').appendChild(dog);
    dog.draggable = false;
    dog.style.position = 'relative';
    dog.style.margin = '0';
    dog.style.transform = 'scale(0.8)';
    
    // Erfolgsanimation
    nest.classList.add('success-animate');
    
    // Sound abspielen
    playSuccessSound();
    
    dogsPlaced++;
    updateProgress();
    
    // Animation nach kurzer Zeit entfernen
    setTimeout(() => {
        nest.classList.remove('success-animate');
    }, 600);
    
    // Prüfen ob Spiel gewonnen
    if (dogsPlaced === totalDogs) {
        gameEndTime = Date.now();
        setTimeout(showWinMessage, 500);
    }
}

function animateIncorrectPlacement() {
    // Visuelles Feedback für falsche Platzierung
    document.body.style.background = 'linear-gradient(45deg, #FFB6C1, #FFA07A)';
    
    setTimeout(() => {
        document.body.style.background = 'linear-gradient(45deg, #87CEEB, #98FB98)';
    }, 200);
}

function updateProgress() {
    const progressCount = document.getElementById('progress-count');
    const progressFill = document.getElementById('progressFill');
    
    progressCount.textContent = dogsPlaced;
    const percentage = (dogsPlaced / totalDogs) * 100;
    progressFill.style.width = percentage + '%';
}

function showWinMessage() {
    gameCompleted = true;
    playWinSound();
    
    // Finale Zeit anzeigen
    const finalTime = gameEndTime - gameStartTime;
    const timeString = formatTime(finalTime);
    document.getElementById('finalTime').textContent = timeString;
    
    const successMessage = document.getElementById('successMessage');
    successMessage.style.display = 'block';
    
    // Konfetti-Effekt (einfache Version)
    createConfetti();
    
    // Automatisch Namenseingabe nach kurzer Zeit anzeigen
    setTimeout(() => {
        showNameInput();
    }, 2000);
}

function createConfetti() {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#D63384'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.innerHTML = ['🎉', '⭐', '🌟', '✨', '🎊'][Math.floor(Math.random() * 5)];
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-50px';
            confetti.style.fontSize = Math.random() * 20 + 20 + 'px';
            confetti.style.zIndex = '999';
            confetti.style.pointerEvents = 'none';
            
            document.body.appendChild(confetti);
            
            const animation = confetti.animate([
                { transform: 'translateY(-50px) rotate(0deg)', opacity: 1 },
                { transform: `translateY(${window.innerHeight + 50}px) rotate(360deg)`, opacity: 0 }
            ], {
                duration: 3000 + Math.random() * 2000,
                easing: 'linear'
            });
            
            animation.onfinish = () => confetti.remove();
        }, i * 50);
    }
}

function restartGame() {
    // Neuer Paw Patrol Einsatz
    dogsPlaced = 0;
    gameCompleted = false;
    gameStartTime = null;
    gameEndTime = null;
    currentGameTime = 0;
    
    // Erfolgsmeldung und Dialoge verstecken
    document.getElementById('successMessage').style.display = 'none';
    document.getElementById('nameInputDialog').style.display = 'none';
    
    // Alle Welpen zurück in den ursprünglichen Bereich
    const dogsArea = document.querySelector('.dogs-area');
    const dogs = document.querySelectorAll('.dog');
    
    dogs.forEach(dog => {
        dog.draggable = true;
        dog.style.position = '';
        dog.style.margin = '8px';
        dog.style.transform = '';
        dogsArea.appendChild(dog);
    });
    
    // Zufällige Reihenfolge für neues Spiel
    shuffleElements();
    
    // Nester zurücksetzen
    const nests = document.querySelectorAll('.nest');
    nests.forEach(nest => {
        nest.classList.remove('occupied');
        nest.classList.remove('success-animate');
    });
    
    updateProgress();
    startGameTimer();
}

// Highscore System Funktionen
function startGameTimer() {
    currentGameTime = 0;
    clearInterval(gameTimer);
    gameTimer = setInterval(() => {
        if (!gameStartTime || gameCompleted) return;
        
        currentGameTime = Date.now() - gameStartTime;
        document.getElementById('gameTime').textContent = formatTime(currentGameTime);
    }, 100);
}

function formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function showNameInput() {
    document.getElementById('nameInputDialog').style.display = 'flex';
    document.getElementById('playerName').focus();
}

function saveHighscore() {
    const name = document.getElementById('playerName').value.trim();
    if (!name) {
        alert('Bitte gib deinen Namen ein!');
        return;
    }
    
    const finalTime = gameEndTime - gameStartTime;
    const score = {
        name: name,
        time: finalTime,
        timestamp: Date.now()
    };
    
    let highscores = JSON.parse(localStorage.getItem('pawPatrolHighscores') || '[]');
    highscores.push(score);
    
    // Sortieren nach Zeit (schnellste zuerst)
    highscores.sort((a, b) => a.time - b.time);
    
    // Nur Top 10 behalten
    highscores = highscores.slice(0, 10);
    
    localStorage.setItem('pawPatrolHighscores', JSON.stringify(highscores));
    
    // Dialog schließen und Highscore anzeigen
    document.getElementById('nameInputDialog').style.display = 'none';
    document.getElementById('playerName').value = '';
    
    loadHighscores();
    toggleHighscore();
    restartGame();
}

function skipHighscore() {
    document.getElementById('nameInputDialog').style.display = 'none';
    document.getElementById('playerName').value = '';
    restartGame();
}

function loadHighscores() {
    const highscores = JSON.parse(localStorage.getItem('pawPatrolHighscores') || '[]');
    const highscoreList = document.getElementById('highscoreList');
    
    if (highscores.length === 0) {
        highscoreList.innerHTML = '<div class="empty-highscore">Noch keine Rekorde!<br>Spiele dein erstes Spiel!</div>';
        return;
    }
    
    highscoreList.innerHTML = '';
    
    highscores.forEach((score, index) => {
        const entry = document.createElement('div');
        entry.className = 'highscore-entry';
        
        // Highlight für Top 3
        if (index < 3) {
            entry.classList.add('highlight');
        }
        
        const rank = document.createElement('div');
        rank.className = 'highscore-rank';
        rank.textContent = (index + 1) + '.';
        
        const name = document.createElement('div');
        name.className = 'highscore-name';
        name.textContent = score.name;
        
        const time = document.createElement('div');
        time.className = 'highscore-time';
        time.textContent = formatTime(score.time);
        
        entry.appendChild(rank);
        entry.appendChild(name);
        entry.appendChild(time);
        
        highscoreList.appendChild(entry);
    });
}

function toggleHighscore() {
    const panel = document.getElementById('highscorePanel');
    panel.classList.toggle('show');
}

function clearHighscores() {
    if (confirm('Wirklich alle Rekorde löschen?')) {
        localStorage.removeItem('pawPatrolHighscores');
        loadHighscores();
    }
}

// Event Listener für Highscore UI
document.addEventListener('DOMContentLoaded', function() {
    // Touch Events Setup
    setupTouchEvents();
    
    // Highscores laden und anzeigen
    loadHighscores();
    
    // Name Input Dialog Event Listener
    document.getElementById('submitName').addEventListener('click', function() {
        const nameInput = document.getElementById('playerName');
        const playerName = nameInput.value.trim();
        
        if (playerName) {
            saveHighscore(playerName, currentGameTime);
            document.getElementById('nameInputDialog').style.display = 'none';
            nameInput.value = '';
            loadHighscores();
        } else {
            alert('Bitte gib deinen Namen ein!');
        }
    });
    
    // Highscore Panel Toggle
    document.getElementById('showHighscores').addEventListener('click', function() {
        const panel = document.getElementById('highscorePanel');
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    });
    
    document.getElementById('closeHighscores').addEventListener('click', function() {
        document.getElementById('highscorePanel').style.display = 'none';
    });
    
    // Clear Highscores Button
    document.getElementById('clearHighscores').addEventListener('click', function() {
        if (confirm('Wirklich alle Rekorde löschen?')) {
            localStorage.removeItem('pawPatrolHighscores');
            loadHighscores();
        }
    });
});

// Service Worker registrieren
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}