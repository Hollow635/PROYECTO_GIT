const startBtn = document.querySelector("#start"), 
  screens = document.querySelectorAll(".screen"),
  timeList = document.querySelector("#time-list"),
  difficultyList = document.querySelector("#difficulty-list"),
  timeEl = document.querySelector("#time"),
  board = document.querySelector("#board"),
  hitsEl = document.querySelector("#hits");  

let time = 0,
    unlimited = false,
    difficulty = 0,
    playing = false,
    hits = 0,
    missed = 0,
    accuracy = "0%",
    interval;

startBtn.addEventListener("click", () => {
    screens[0].classList.add("up");
});

timeList.addEventListener("click", (e) => {
    if (e.target.classList.contains("time-btn")) {
        time = parseInt(e.target.getAttribute("data-time"));
        unlimited = e.target.getAttribute("data-unlimited");
        screens[1].classList.add("up");
    }
});

difficultyList.addEventListener("click", (e) => {
    if (e.target.classList.contains("difficulty-btn")) {
        difficulty = parseInt(e.target.getAttribute("data-difficulty"));
        screens[2].classList.add("up");
        startGame();
    }
});

function startGame() {
    playing = true;
    interval = setInterval(decreaseTime, 1000);
    createRandomCircle(); // Llamar a createRandomCircle en interval para crear círculos repetidamente
}

function decreaseTime() {
    if (unlimited) {
        setTime("∞");
        return;
    }
    if (time === 0) {
        clearInterval(interval); 
        // Aquí puedes agregar lógica para finalizar el juego
        return;
    }
    let current = --time;
    let milliseconds = time * 1000;

    let minutes = Math.floor(milliseconds / (1000 * 60));
    let seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

    seconds = seconds < 10 ? "0" + seconds : seconds;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    setTime(`${minutes}:${seconds}`); 
    createRandomCircle(); // Crear un nuevo círculo cada segundo
}

function setTime(time) {
    timeEl.innerHTML = time; 
}

function createRandomCircle() {
    if (!playing) {
        return;
    }

    const circle = document.createElement("div");
    const size = getRandomNumber(30, 100);
    const colors = ["#03DAC6", "#FF0266", "#b3ff00", "#ccff00", "#9D00FF"];
    const { width, height } = board.getBoundingClientRect();
    const x = getRandomNumber(0, width - size);
    const y = getRandomNumber(0, height - size);
    circle.classList.add("circle");
    circle.style.width = `${size}px`; // Corregido para usar comillas invertidas
    circle.style.height = `${size}px`; // Corregido para usar comillas invertidas
    circle.style.top = `${y}px`; // Corregido para usar comillas invertidas
    circle.style.left = `${x}px`; // Corregido para usar comillas invertidas

    let color = Math.floor(Math.random() * colors.length); // Usar la longitud del array
    circle.style.background = `${colors[color]}`; // Corregido para usar comillas invertidas
    board.append(circle);

    // Ajustes de dificultad
    if (difficulty === 1) {
        circle.style.animationDuration = "3s";
    } else if (difficulty === 2) {
        circle.style.animationDuration = "2s"; // Corregido 'animetion' a 'animation'
    } else {
        circle.style.animationDuration = "1s";
    }

    //crear un nueco circluo cuando el actual desapericio

    circle.addEventListener("animationend", () => {
        circle.remove();
        createRandomCircle();
    });
} 

//obtener evento al presionar en un circulo

board.addEventListener("click", (e) => {
    if (e.target.classList.contains("circle")){
        //aumentar golpes de 1 en 1
        hits++;
        //quitar circulo
        e.target.remove();
    } else {
        //si no clickea sobre un circulo es un fallo
        missed++;
    }

    //mostrar aciertos
    hitsEl.innerHTML = hits;
});

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min); // Corregido 'Math.florr' a 'Math.floor'
}
