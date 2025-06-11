class PomodoroTimer {
    constructor() {
        this.minutesElement = document.getElementById('minutes');
        this.secondsElement = document.getElementById('seconds');
        this.timerElement = document.getElementById('timer');
        this.startButton = document.getElementById('start');
        this.pauseButton = document.getElementById('pause');
        this.resetButton = document.getElementById('reset');
        this.workModeButton = document.getElementById('workMode');
        this.restModeButton = document.getElementById('restMode');
        this.pomodoroButton = document.getElementById('pomodoro');
        this.shortBreakButton = document.getElementById('shortBreak');
        this.longBreakButton = document.getElementById('longBreak');
        this.quoteElement = document.getElementById('quote');
        this.settingsBtn = document.getElementById('settingsBtn');
        this.settingsPanel = document.getElementById('settingsPanel');
        this.customMinutes = document.getElementById('customMinutes');
        this.customSeconds = document.getElementById('customSeconds');
        this.applySettings = document.getElementById('applySettings');

        // Create overlay element
        this.overlay = document.createElement('div');
        this.overlay.className = 'overlay';
        document.body.appendChild(this.overlay);

        this.timeLeft = 25 * 60; // 25 minutes in seconds
        this.timerId = null;
        this.isRunning = false;
        this.isWorkMode = true;
        this.defaultTitle = 'Pomodoro Timer';
        this.quoteInterval = null;

        // Motivational quotes
        this.quotes = {
            work: [
                "Focus on being productive instead of busy.",
                "The key is not to prioritize what's on your schedule, but to schedule your priorities.",
                "Don't watch the clock; do what it does. Keep going.",
                "Productivity is never an accident. It is always the result of a commitment to excellence.",
                "The way to get started is to quit talking and begin doing.",
                "Your time is limited, so don't waste it living someone else's life.",
                "The future depends on what you do today.",
                "Success is not final, failure is not fatal: it is the courage to continue that counts.",
                "The only way to do great work is to love what you do.",
                "Stay focused, stay productive!"
            ],
            rest: [
                "Take a break, you've earned it!",
                "Rest is not idleness, it's essential for productivity.",
                "A short break can refresh your mind and boost your creativity.",
                "Rest when you're weary. Refresh and renew yourself.",
                "Taking breaks is part of the process.",
                "Rest is the sweet sauce of labor.",
                "Sometimes the most productive thing you can do is relax.",
                "A good rest is half the work.",
                "Take time to recharge your batteries.",
                "Rest is not a reward for work, it's a part of it."
            ]
        };

        this.initializeEventListeners();
        this.showQuote(); // Show initial quote
    }

    initializeEventListeners() {
        this.startButton.addEventListener('click', () => this.start());
        this.pauseButton.addEventListener('click', () => this.pause());
        this.resetButton.addEventListener('click', () => this.reset());
        this.workModeButton.addEventListener('click', () => this.setWorkMode());
        this.restModeButton.addEventListener('click', () => this.setRestMode());
        this.pomodoroButton.addEventListener('click', () => this.setMode('pomodoro'));
        this.shortBreakButton.addEventListener('click', () => this.setMode('shortBreak'));
        this.longBreakButton.addEventListener('click', () => this.setMode('longBreak'));
        this.settingsBtn.addEventListener('click', () => this.toggleSettings());
        this.applySettings.addEventListener('click', () => this.applyCustomSettings());
        this.overlay.addEventListener('click', () => this.toggleSettings());
        
        // Close settings panel when clicking outside
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.settingsPanel.classList.contains('show')) {
                this.toggleSettings();
            }
        });
    }

    setWorkMode() {
        this.isWorkMode = true;
        this.timeLeft = 25 * 60;
        this.updateModeButtons();
        this.updateDisplay();
        this.animateTimerChange();
        document.body.classList.remove('rest-mode', 'timer-active');
        document.body.classList.add('work-mode');
        if (!this.isRunning) {
            document.title = this.defaultTitle;
        }
        this.showQuote(); // Show a work quote
    }

    setRestMode() {
        this.isWorkMode = false;
        this.timeLeft = 5 * 60;
        this.updateModeButtons();
        this.updateDisplay();
        this.animateTimerChange();
        document.body.classList.remove('work-mode', 'timer-active');
        document.body.classList.add('rest-mode');
        if (!this.isRunning) {
            document.title = this.defaultTitle;
        }
        this.showQuote(); // Show a rest quote
    }

    updateModeButtons() {
        if (this.isWorkMode) {
            this.workModeButton.classList.add('active');
            this.restModeButton.classList.remove('active');
        } else {
            this.workModeButton.classList.remove('active');
            this.restModeButton.classList.add('active');
        }
    }

    animateTimerChange() {
        this.timerElement.classList.add('changing');
        setTimeout(() => {
            this.timerElement.classList.remove('changing');
        }, 300);
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.timerId = setInterval(() => this.updateTimer(), 1000);
            this.startButton.style.opacity = '0.7';
            this.pauseButton.style.opacity = '1';
            this.timerElement.classList.add('active');
            document.body.classList.add('timer-active');
            this.updateDisplay();
            this.startQuoteTicker();
        }
    }

    pause() {
        this.isRunning = false;
        clearInterval(this.timerId);
        clearInterval(this.quoteInterval);
        this.startButton.style.opacity = '1';
        this.pauseButton.style.opacity = '0.7';
        this.timerElement.classList.remove('active');
        document.body.classList.remove('timer-active');
        document.title = this.defaultTitle;
    }

    reset() {
        this.pause();
        this.setMode('pomodoro');
        this.animateTimerChange();
        document.title = this.defaultTitle;
        this.showQuote(); // Show a new quote on reset
    }

    setMode(mode) {
        this.pause();
        this.updateActiveButton(mode);
        
        switch (mode) {
            case 'pomodoro':
                this.timeLeft = 25 * 60;
                break;
            case 'shortBreak':
                this.timeLeft = 5 * 60;
                break;
            case 'longBreak':
                this.timeLeft = 15 * 60;
                break;
        }
        
        this.updateDisplay();
        this.animateTimerChange();
    }

    updateActiveButton(mode) {
        [this.pomodoroButton, this.shortBreakButton, this.longBreakButton].forEach(button => {
            button.classList.remove('active');
        });
        document.getElementById(mode).classList.add('active');
    }

    updateTimer() {
        if (this.timeLeft > 0) {
            this.timeLeft--;
            this.updateDisplay();
        } else {
            this.pause();
            this.playAlarm();
        }
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        this.minutesElement.textContent = minutes.toString().padStart(2, '0');
        this.secondsElement.textContent = seconds.toString().padStart(2, '0');
        
        // Update timer color based on remaining time
        this.timerElement.setAttribute('data-time-left', minutes.toString());

        if (this.isRunning) {
            const mode = this.isWorkMode ? 'Work' : 'Rest';
            document.title = `${timeString} - ${mode} Mode`;
        } else {
            document.title = this.defaultTitle;
        }
    }

    playAlarm() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
    }

    showQuote() {
        const quotes = this.isWorkMode ? this.quotes.work : this.quotes.rest;
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        
        // Remove show class for fade out
        this.quoteElement.classList.remove('show');
        
        // Wait for fade out, then update quote and fade in
        setTimeout(() => {
            this.quoteElement.textContent = randomQuote;
            this.quoteElement.classList.add('show');
        }, 500);
    }

    startQuoteTicker() {
        // Show a new quote every 30 seconds
        this.quoteInterval = setInterval(() => this.showQuote(), 30000);
    }

    toggleSettings() {
        this.settingsPanel.classList.toggle('show');
        this.overlay.classList.toggle('show');
        
        if (this.settingsPanel.classList.contains('show')) {
            // Set current values in settings panel
            const minutes = Math.floor(this.timeLeft / 60);
            const seconds = this.timeLeft % 60;
            this.customMinutes.value = minutes;
            this.customSeconds.value = seconds;
        }
    }

    applyCustomSettings() {
        const minutes = parseInt(this.customMinutes.value) || 0;
        const seconds = parseInt(this.customSeconds.value) || 0;
        
        // Validate input
        if (minutes < 0 || minutes > 60 || seconds < 0 || seconds > 30) {
            alert('Please enter valid time values:\nMinutes: 0-60\nSeconds: 0 or 30');
            return;
        }

        // Convert to seconds
        this.timeLeft = (minutes * 60) + seconds;
        
        // Update display
        this.updateDisplay();
        this.animateTimerChange();
        
        // Close settings panel
        this.toggleSettings();
        
        // Update work mode button text
        this.workModeButton.textContent = `Work Mode (${minutes}m${seconds ? '30s' : ''})`;
    }
}

// Initialize the timer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PomodoroTimer();
}); 