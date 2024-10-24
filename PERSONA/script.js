const wordContainer = document.getElementById('wordContainer');
const startButton = document.getElementById('startButton');
const usedLettersElement = document.getElementById('usedLetters');
const achievementsList = document.getElementById('achievementsList');

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
ctx.canvas.width = 0;
ctx.canvas.height = 0;

const bodyParts = [
    [4, 2, 1, 1],
    [4, 3, 1, 2],
    [3, 5, 1, 1],
    [5, 5, 1, 1],
    [3, 3, 1, 1],
    [5, 3, 1, 1]
];

let selectedWord;
let usedLetters;
let mistakes;
let hits;
let achievement = null; // Variable para rastrear logros
let consecutiveWins = 0; // Contador de victorias consecutivas

// Definición de logros
const achievements = {
    "Sabio: Adivina la palabra completa sin cometer errores en el primer intento.": false,
    "Rápido: Completa el juego adivinando la palabra en menos de 5 intentos.": false,
    "Perfeccionista: Adivina todas las letras de la palabra sin usar letras incorrectas.": false,
    "Novato: Completa el juego por primera vez.": false,
    "Maestro: Gana 5 juegos consecutivos sin perder.": false
};

const addLetter = letter => {
    const letterElement = document.createElement('span');
    letterElement.innerHTML = letter.toUpperCase();
    usedLettersElement.appendChild(letterElement);
};

const addBodyPart = bodyPart => {
    ctx.fillStyle = '#fff';
    ctx.fillRect(...bodyPart);
};

const animateBodyPart = (bodyPart, index) => {
    let alpha = 0; // Opacidad inicial
    const animate = () => {
        alpha += 0.05; // Incrementar opacidad
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`; // Cambiar color con opacidad
        ctx.fillRect(...bodyPart);

        if (alpha < 1) {
            requestAnimationFrame(animate); // Continuar animación
        }
    };
    animate();
};

const wrongLetter = () => {
    if (mistakes < bodyParts.length) {
        setTimeout(() => {
            animateBodyPart(bodyParts[mistakes], mistakes);
            mistakes++;
            if (mistakes === bodyParts.length) endGame();
        }, 500 * mistakes); // Retraso de 500 ms por error
    }
};

const updateAchievementsDisplay = () => {
    achievementsList.innerHTML = ''; // Limpiar lista
    for (const [name, obtained] of Object.entries(achievements)) {
        const li = document.createElement('li');
        li.textContent = obtained ? `✔️ ${name}` : `❌ ${name}`;
        achievementsList.appendChild(li);
    }
};

const endGame = () => {
    document.removeEventListener('keydown', letterEvent);
    startButton.style.display = 'block';

    // Verificar logros
    if (mistakes === 0 && hits === selectedWord.length) {
        achievements["Sabio"] = true; // Adivinaste la palabra completa sin errores
        alert("¡Logro desbloqueado: Sabio!");
    }

    if (hits === selectedWord.length && mistakes < 5) {
        achievements["Rápido"] = true; // Adivinaste la palabra en menos de 5 intentos
        alert("¡Logro desbloqueado: Rápido!");
    }

    if (mistakes === 0) {
        achievements["Perfeccionista"] = true; // Adivinaste todas las letras sin errores
        alert("¡Logro desbloqueado: Perfeccionista!");
    }

    if (consecutiveWins === 0) {
        achievements["Novato"] = true; // Primera vez que se completa un juego
        alert("¡Logro desbloqueado: Novato!");
    }

    // Incrementar contador de victorias consecutivas
    consecutiveWins++;
    if (consecutiveWins === 5) {
        achievements["Maestro"] = true; // Ganar 5 juegos consecutivos
        alert("¡Logro desbloqueado: Maestro!");
        consecutiveWins = 0; // Reiniciar contador
    }

    updateAchievementsDisplay(); // Actualizar la lista de logros
};

const correctLetter = letter => {
    const { children } = wordContainer;
    for (let i = 0; i < children.length; i++) {
        if (children[i].innerHTML === letter) {
            children[i].classList.toggle('hidden');
            hits++;
        }
    }
    if (hits === selectedWord.length) endGame();
};

const letterInput = letter => {
    if (selectedWord.includes(letter)) {
        correctLetter(letter);
    } else {
        wrongLetter();
    }
    addLetter(letter);
    usedLetters.push(letter);
};

const letterEvent = event => {
    let newLetter = event.key.toUpperCase();
    if (newLetter.match(/^[a-zñ]$/i) && !usedLetters.includes(newLetter)) {
        letterInput(newLetter);
    }
};

const drawWord = () => {
    selectedWord.forEach(letter => {
        const letterElement = document.createElement('span');
        letterElement.innerHTML = letter.toUpperCase();
        letterElement.classList.add('letter');
        letterElement.classList.add('hidden');
        wordContainer.appendChild(letterElement);
    });
};

const selectRandomWord = () => {
    let word = words[Math.floor((Math.random() * words.length))].toUpperCase();
    selectedWord = word.split('');
};

const drawHangMan = () => {
    ctx.canvas.width = 120;
    ctx.canvas.height = 160;
    ctx.scale(20, 20);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#d95d39';
    ctx.fillRect(0, 7, 4, 1);
    ctx.fillRect(1, 0, 1, 8);
    ctx.fillRect(2, 0, 3, 1);
    ctx.fillRect(4, 1, 1, 1);
};

const startGame = () => {
    usedLetters = [];
    mistakes = 0;
    hits = 0;
    achievement = null; // Reiniciar logro al empezar un nuevo juego
    wordContainer.innerHTML = '';
    usedLettersElement.innerHTML = '';
    startButton.style.display = 'none';
    drawHangMan();
    selectRandomWord();
    drawWord();
    document.addEventListener('keydown', letterEvent);
};

startButton.addEventListener('click', startGame);
updateAchievementsDisplay(); // Mostrar logros al cargar la página
