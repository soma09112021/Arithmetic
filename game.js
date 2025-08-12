class MathGame {
    constructor() {
        this.age = null;
        this.theme = null;
        this.level = 1;
        this.coins = 0;
        this.exp = 0;
        this.currentQuestion = null;
        this.correctAnswers = 0;
        this.totalQuestions = 0;
        this.questionsPerRound = 10;
        this.themes = {
            animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵'],
            vehicles: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛', '🚜', '🛴', '🚲'],
            fruits: ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝'],
            sweets: ['🍰', '🧁', '🍪', '🍩', '🍫', '🍬', '🍭', '🍮', '🎂', '🍡', '🍨', '🍧', '🍦', '🥧', '🍯']
        };
        
        this.loadGameData();
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.querySelectorAll('.age-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.playClickSound();
                this.selectAge(parseInt(e.target.dataset.age));
            });
        });

        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.playClickSound();
                this.selectTheme(e.currentTarget.dataset.theme);
            });
        });

        document.getElementById('playAgainBtn').addEventListener('click', () => {
            this.playClickSound();
            this.resetGame();
        });

        document.getElementById('backToStartBtn').addEventListener('click', () => {
            this.playClickSound();
            this.showScreen('startScreen');
        });

        document.getElementById('backFromTheme').addEventListener('click', () => {
            this.playClickSound();
            this.showScreen('startScreen');
        });

        document.getElementById('backFromGame').addEventListener('click', () => {
            this.playClickSound();
            if (confirm('ゲームをやめますか？')) {
                this.showScreen('startScreen');
            }
        });
    }

    selectAge(age) {
        this.age = age;
        this.showScreen('themeScreen');
    }

    selectTheme(theme) {
        this.theme = theme;
        this.startGame();
    }

    startGame() {
        this.correctAnswers = 0;
        this.totalQuestions = 0;
        this.showScreen('gameScreen');
        this.updateUI();
        this.generateQuestion();
    }

    generateQuestion() {
        if (this.totalQuestions >= this.questionsPerRound) {
            this.showResults();
            return;
        }

        const difficultySettings = this.getDifficultySettings();
        const { maxNumber, operations } = difficultySettings;
        
        const operation = operations[Math.floor(Math.random() * operations.length)];
        let num1, num2, answer;

        if (operation === 'add') {
            num1 = Math.floor(Math.random() * (maxNumber / 2)) + 1;
            num2 = Math.floor(Math.random() * (maxNumber / 2)) + 1;
            answer = num1 + num2;
        } else {
            num1 = Math.floor(Math.random() * maxNumber) + 2;
            num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
            answer = num1 - num2;
        }

        this.currentQuestion = {
            num1,
            num2,
            operation,
            answer
        };

        this.displayQuestion();
        this.generateAnswerOptions();
        this.totalQuestions++;
    }

    getDifficultySettings() {
        const settings = {
            3: { maxNumber: 5, operations: ['add'] },
            4: { maxNumber: 10, operations: ['add', 'subtract'] },
            5: { maxNumber: 20, operations: ['add', 'subtract'] },
            6: { maxNumber: 30, operations: ['add', 'subtract'] }
        };
        return settings[this.age] || settings[3];
    }

    displayQuestion() {
        const questionDisplay = document.getElementById('questionDisplay');
        const operatorDisplay = document.getElementById('operatorDisplay');
        const themeEmojis = this.themes[this.theme];
        
        questionDisplay.innerHTML = '';
        
        // 最大表示数を5個に制限し、それ以上は数字で表示
        const maxEmojis = 5;
        const selectedEmoji = themeEmojis[Math.floor(Math.random() * themeEmojis.length)];
        
        const group1 = document.createElement('div');
        group1.className = 'emoji-group';
        
        if (this.currentQuestion.num1 <= maxEmojis) {
            for (let i = 0; i < this.currentQuestion.num1; i++) {
                const emoji = document.createElement('span');
                emoji.className = 'emoji-item';
                emoji.textContent = selectedEmoji;
                group1.appendChild(emoji);
            }
        } else {
            const numberDisplay = document.createElement('span');
            numberDisplay.className = 'number-with-emoji';
            numberDisplay.innerHTML = `<span class="emoji-item">${selectedEmoji}</span> × ${this.currentQuestion.num1}`;
            group1.appendChild(numberDisplay);
        }
        
        const operator = document.createElement('span');
        operator.className = 'operator';
        operator.textContent = this.currentQuestion.operation === 'add' ? '＋' : '−';
        
        const group2 = document.createElement('div');
        group2.className = 'emoji-group';
        
        if (this.currentQuestion.num2 <= maxEmojis) {
            for (let i = 0; i < this.currentQuestion.num2; i++) {
                const emoji = document.createElement('span');
                emoji.className = 'emoji-item';
                emoji.textContent = selectedEmoji;
                group2.appendChild(emoji);
            }
        } else {
            const numberDisplay = document.createElement('span');
            numberDisplay.className = 'number-with-emoji';
            numberDisplay.innerHTML = `<span class="emoji-item">${selectedEmoji}</span> × ${this.currentQuestion.num2}`;
            group2.appendChild(numberDisplay);
        }
        
        const equals = document.createElement('span');
        equals.className = 'operator';
        equals.textContent = '＝';
        
        const questionMark = document.createElement('span');
        questionMark.className = 'question-mark';
        questionMark.textContent = '？';
        questionMark.style.fontSize = '2em';
        
        questionDisplay.appendChild(group1);
        questionDisplay.appendChild(operator);
        questionDisplay.appendChild(group2);
        questionDisplay.appendChild(equals);
        questionDisplay.appendChild(questionMark);
    }

    generateAnswerOptions() {
        const answerButtons = document.getElementById('answerButtons');
        answerButtons.innerHTML = '';
        
        const correctAnswer = this.currentQuestion.answer;
        const options = [correctAnswer];
        
        while (options.length < 4) {
            const wrongAnswer = Math.max(0, correctAnswer + Math.floor(Math.random() * 10) - 5);
            if (!options.includes(wrongAnswer)) {
                options.push(wrongAnswer);
            }
        }
        
        options.sort(() => Math.random() - 0.5);
        
        options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'answer-btn';
            button.textContent = option;
            button.addEventListener('click', () => this.checkAnswer(option));
            answerButtons.appendChild(button);
        });
    }

    checkAnswer(selectedAnswer) {
        this.playClickSound();
        const isCorrect = selectedAnswer === this.currentQuestion.answer;
        
        if (isCorrect) {
            this.correctAnswers++;
            this.addCoins(10);
            this.addExp(20);
            this.showFeedback('せいかい！', 'correct');
            this.playCorrectSound();
        } else {
            this.showFeedback('もういちど！', 'wrong');
            this.playWrongSound();
        }
        
        setTimeout(() => {
            this.hideFeedback();
            this.generateQuestion();
        }, 1500);
    }

    showFeedback(message, type) {
        const feedback = document.getElementById('feedback');
        feedback.textContent = message;
        feedback.className = `feedback ${type}`;
        feedback.classList.remove('hidden');
    }

    hideFeedback() {
        const feedback = document.getElementById('feedback');
        feedback.classList.add('hidden');
    }

    addCoins(amount) {
        this.coins += amount;
        this.updateUI();
        this.saveGameData();
    }

    addExp(amount) {
        this.exp += amount;
        if (this.exp >= 100) {
            this.levelUp();
        }
        this.updateUI();
        this.saveGameData();
    }

    levelUp() {
        this.level++;
        this.exp = this.exp - 100;
        this.showFeedback('レベルアップ！', 'correct');
    }

    updateUI() {
        document.getElementById('currentLevel').textContent = this.level;
        document.getElementById('coinCount').textContent = this.coins;
        
        const expProgress = document.querySelector('.exp-progress');
        if (expProgress) {
            expProgress.style.width = `${this.exp}%`;
        }
    }

    showResults() {
        this.showScreen('resultScreen');
        document.getElementById('correctCount').textContent = this.correctAnswers;
        const earnedCoins = this.correctAnswers * 10;
        document.getElementById('earnedCoins').textContent = earnedCoins;
    }

    resetGame() {
        this.age = null;
        this.theme = null;
        this.correctAnswers = 0;
        this.totalQuestions = 0;
        this.showScreen('startScreen');
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    playClickSound() {
        const audio = document.getElementById('clickSound');
        if (audio && audio.src) {
            audio.play().catch(() => {});
        }
    }

    playCorrectSound() {
        const audio = document.getElementById('correctSound');
        if (audio && audio.src) {
            audio.play().catch(() => {});
        }
    }

    playWrongSound() {
        const audio = document.getElementById('wrongSound');
        if (audio && audio.src) {
            audio.play().catch(() => {});
        }
    }

    saveGameData() {
        const gameData = {
            level: this.level,
            coins: this.coins,
            exp: this.exp
        };
        localStorage.setItem('mathGameData', JSON.stringify(gameData));
    }

    loadGameData() {
        const savedData = localStorage.getItem('mathGameData');
        if (savedData) {
            const gameData = JSON.parse(savedData);
            this.level = gameData.level || 1;
            this.coins = gameData.coins || 0;
            this.exp = gameData.exp || 0;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MathGame();
});