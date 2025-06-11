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

        this.timeLeft = 25 * 60; // 25 minutes in seconds
        this.timerId = null;
        this.isRunning = false;
        this.isWorkMode = true;
        this.defaultTitle = 'Pomodoro Timer';

        this.initializeEventListeners();
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
        }
    }

    pause() {
        this.isRunning = false;
        clearInterval(this.timerId);
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
}

// Initialize the timer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PomodoroTimer();
}); 