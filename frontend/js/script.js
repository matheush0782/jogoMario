// Seleciona os elementos principais do DOM
const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const restartMessage = document.getElementById('restart-message');
const currentScoreElement = document.getElementById('current-score');
const highScoreElement = document.getElementById('high-score');

// Variáveis de estado do jogo
let isGameOver = false; // Indica se o jogo terminou
let isJumping = false; // Indica se o Mario está no meio de um pulo

// Variáveis de pontuação
let score = 0; // Pontuação atual
let highScore = localStorage.getItem('marioHighScore') || 0; // Maior pontuação salva no localStorage
highScoreElement.textContent = highScore; // Atualiza o HTML com a maior pontuação inicial

// Função responsável por fazer o Mario pular
const jump = () => {
  if (isGameOver || isJumping) return;
  
  isJumping = true;
  mario.classList.add('jump'); 

  setTimeout(() => {
    mario.classList.remove('jump');
    isJumping = false;
  }, 500);
};

// Incrementa a pontuação a cada vez que a animação do tubo recomeça (o que significa que passou pelo Mario)
pipe.addEventListener('animationiteration', () => {
  if (!isGameOver) {
    score += 10;
    currentScoreElement.textContent = score;
    
    // Se a pontuação atual superar o recorde, atualiza o recorde
    if (score > highScore) {
      highScore = score;
      highScoreElement.textContent = highScore;
      localStorage.setItem('marioHighScore', highScore); // Salva no navegador
    }
  }
});

// Loop principal de verificação de colisões a cada 10 milissegundos
const loop = setInterval(() => {
  const pipePosition = pipe.offsetLeft; // Posição horizontal do tubo
  // Posição vertical do Mario
  const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

  // Verifica a condição de colisão
  if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
    // Para a animação do tubo no ponto atual
    pipe.style.animation = 'none';
    pipe.style.left = `${pipePosition}px`;

    // Para a animação do Mario no ponto atual
    mario.style.animation = 'none';
    mario.style.bottom = `${marioPosition}px`;

    // Muda a imagem do Mario para a de "Game Over"
    mario.src = './images/game-over.png';
    mario.style.width = '75px';
    mario.style.marginLeft = '50px';

    // Sinaliza o fim de jogo e exibe a mensagem de reiniciar
    isGameOver = true;
    restartMessage.style.display = 'block';
    clearInterval(loop); // Interrompe o loop de colisão
  }
}, 10);

document.addEventListener('keydown', (event) => {
  if (!isGameOver) {
    jump();
  } else {
    // Se o jogo acabou, pressione a tecla 'R' para reiniciar
    if (event.key.toLowerCase() === 'r') {
      location.reload();
    }
  }
});
