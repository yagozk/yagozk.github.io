const startGameBtn = document.getElementById("start-game-btn");
const homeScreen = document.querySelector(".home-screen");
let gameContainer = document.getElementById("game-container");
const pauseBtn = document.getElementById("pause-btn");
const overlayMenu = document.getElementById("overlay-menu");
const continueBtn = document.getElementById("continue-btn");
const exitBtn = document.getElementById("exit-btn");
const volumeBtn = document.getElementById("volume-btn");

//mobile buttons
const leftBtn = document.getElementById("left-btn");
const rightBtn = document.getElementById("right-btn");
const shootBtn = document.getElementById("shoot-btn");

//const saucer3Line = document.querySelector(".saucer3-line");
//const saucer2Lines = document.querySelectorAll(".saucer2-line");
//const saucer1Lines = document.querySelectorAll(".saucer1-line");
let invaderLines = [];
let gameMode;

const player = document.getElementById("player");
let moveInterval;
let moveDelay = 500;
const reductionFactor = 25;
let direction = "right";
let movesCount = 0;

let playerPosition = window.innerWidth / 4;
console.log(playerPosition);
let canFire = true;
let isPaused = false;

let gameContainerWidth;
let gameContainerHeight;

let playerScore = 0;

function levelSelection() {
  if (document.getElementById("regular-mode-radio").checked) {
    gameMode = document.getElementById("regular-mode");
    const saucer3Line = gameMode.querySelector(".saucer3-line");
    const saucer2Lines = gameMode.querySelectorAll(".saucer2-line");
    const saucer1Lines = gameMode.querySelectorAll(".saucer1-line");

    invaderLines = [saucer3Line, ...saucer2Lines, ...saucer1Lines];
  } else if (document.getElementById("bullet-hell-mode-radio").checked) {
    gameMode = document.getElementById("bullet-hell-mode");
    const saucer3Lines = gameMode.querySelectorAll(".saucer3-line");

    invaderLines = [...saucer3Lines];
  } else if (document.getElementById("double-fire-mode-radio").checked) {
    gameMode = document.getElementById("double-fire-mode");
    const saucer3Line = gameMode.querySelector(".saucer3-line");
    const saucer2Lines = gameMode.querySelectorAll(".saucer2-line");
    const saucer1Lines = gameMode.querySelectorAll(".saucer1-line");

    invaderLines = [saucer3Line, ...saucer2Lines, ...saucer1Lines];
  } else if (document.getElementById("machine-gun-mode-radio").checked) {
    gameMode = document.getElementById("machine-gun-mode");
    const saucer3Line = gameMode.querySelector(".saucer3-line");
    const saucer2Lines = gameMode.querySelectorAll(".saucer2-line");
    const saucer1Lines = gameMode.querySelectorAll(".saucer1-line");

    invaderLines = [saucer3Line, ...saucer2Lines, ...saucer1Lines];
  }
}

function startGame() {
  levelSelection();
  leftBtn.disabled = false;
  rightBtn.disabled = false;
  shootBtn.disabled = false;

  console.log("Game mode is set as " + gameMode.id);
  gameMode.style.display = "block";
  // Call the function on page load to initialize the size
  resizeGameContainer();
  // Show the invaders
  invaderLines.forEach((line, lineIndex) => {
    // Set initial positions for the invaders
    const invaders = line.querySelectorAll(".invader");
    invaders.forEach((invader, index) => {
      invader.style.left = `${index * gameContainer.offsetWidth * 0.06}px`; // Adjust the spacing as needed
      invader.style.top = `${lineIndex * gameContainer.offsetWidth * 0.075}px`; // Adjust the spacing as needed
    });
  });

  player.style.left = `${playerPosition}px`;
  // Set the initial movement interval
  moveInterval = setInterval(moveInvaders, moveDelay);
  startSaucer3Firing();
  document.getElementById("score-div").style.display = "block";
}

function togglePause() {
  if (isPaused) {
    // Resume the game
    overlayMenu.style.display = "none";
    isPaused = false;
  } else {
    // Pause the game
    overlayMenu.style.display = "flex";
    isPaused = true;
  }
}

pauseBtn.addEventListener("click", togglePause);

continueBtn.addEventListener("click", () => {
  togglePause(); // Resume the game
});

exitBtn.addEventListener("click", () => {
  endGame("lose"); // End the game and show the home screen (player loses)
});

// Function to resize the game container and its contents
function resizeGameContainer() {
  const newHeight = gameContainer.offsetWidth * 0.8;
  gameContainer.style.height = newHeight + "px";
  playerPosition = window.innerWidth / 4;

  resizeInvaders();
  resizePlayer();

  gameContainerHeight = gameContainer.offsetHeight;
  gameContainerWidth = gameContainer.offsetWidth;
}

function resizePlayer() {
  player.style.bottom = gameContainer.offsetHeight * 0.02 + "px";
}

function resizeInvaders() {
  const widthRatio = gameContainer.offsetWidth / gameContainerWidth;
  const heightRatio = gameContainer.offsetHeight / gameContainerHeight;

  invaderLines.forEach((line, lineIndex) => {
    const invaders = line.querySelectorAll(".invader");
    invaders.forEach((invader, index) => {
      // Update invader width and height
      const newWidth = gameContainer.offsetWidth * 0.06;
      const newHeight = gameContainer.offsetHeight * 0.06;

      invader.style.width = newWidth + "px";
      invader.style.height = newHeight + "px";

      // Update left and top positions
      const newLeft = parseInt(invader.style.left) * widthRatio;
      const newTop = parseInt(invader.style.top) * heightRatio;

      //invader.style.left = newLeft + "px";
      //invader.style.top = newTop + "px";
    });
  });
}
// Event listener to handle window resize
window.addEventListener("resize", resizeGameContainer);

function moveInvadersLeft() {
  invaderLines.forEach((line) => {
    const invaders = line.querySelectorAll(".invader");
    invaders.forEach((invader) => {
      const currentPosition = parseInt(invader.style.left) || 0;
      invader.style.left =
        currentPosition - gameContainer.offsetWidth * 0.025 + "px";
    });
  });
  console.log("Invaders move left");
}

function moveInvadersRight() {
  invaderLines.forEach((line) => {
    const invaders = line.querySelectorAll(".invader");
    invaders.forEach((invader) => {
      const currentPosition = parseInt(invader.style.left) || 0;
      invader.style.left =
        currentPosition + gameContainer.offsetWidth * 0.025 + "px";
    });
  });
  console.log("Invaders move right");
}

// Function to move the invaders in a cycle
function moveInvaders() {
  if (isPaused) {
    return;
  }

  movesCount++;
  playInvaderMoveSound();

  if (movesCount % 10 === 0 && moveDelay > 250) {
    // Reduce the moveDelay by 25 milliseconds after every 10 moves
    moveDelay -= reductionFactor;
    clearInterval(moveInterval);
    moveInterval = setInterval(moveInvaders, moveDelay);
    console.log("New move interval has been set to: " + moveDelay);
  }

  // Determine the direction of movement based on the current leftmost invader's position
  const leftmostInvader = invaderLines.reduce((leftmost, line) => {
    const invaders = line.querySelectorAll(".invader");
    const leftmostInvader = Math.min(
      ...Array.from(invaders).map(
        (invader) => parseInt(invader.style.left) || 0
      )
    );
    return Math.min(leftmost, leftmostInvader);
  }, Infinity);

  const rightmostInvader = invaderLines.reduce((rightmost, line) => {
    const invaders = line.querySelectorAll(".invader");
    const rightmostInvader = Math.max(
      ...Array.from(invaders).map(
        (invader) => parseInt(invader.style.left) || 0
      )
    );
    return Math.max(rightmost, rightmostInvader);
  }, -Infinity);

  if (
    rightmostInvader >
    gameContainer.offsetWidth - gameContainer.offsetWidth * 0.1
  ) {
    // If the rightmost invader reaches the container's right edge, move the invaders down
    moveInvadersDown();
    moveInvadersLeft();
    direction = "left";
  } else if (leftmostInvader < 0) {
    // If the leftmost invader reaches the container's left edge, move the invaders down
    moveInvadersDown();
    moveInvadersRight();
    direction = "right";
  } else {
    // Otherwise, move the invaders to the same direction they were moving previously
    direction === "left" ? moveInvadersLeft() : moveInvadersRight();
  }
}

function moveInvadersDown() {
  invaderLines.forEach((line) => {
    const invaders = line.querySelectorAll(".invader");
    invaders.forEach((invader) => {
      const currentPosition = parseInt(invader.style.top) || 0;
      invader.style.top =
        currentPosition + gameContainer.offsetHeight * 0.05 + "px";

      if (
        currentPosition >=
        gameContainer.offsetHeight - gameContainer.offsetHeight * 0.2
      ) {
        endGame("lose"); // Invaders reached the bottom (player loses)
        return;
      }
    });
  });
  console.log("Invaders move down");
}

function movePlayerLeft() {
  if (!isPaused) {
    const containerLeftEdge = 0;
    const playerWidth = player.offsetWidth;
    const newPlayerPosition = playerPosition - gameContainer.offsetWidth * 0.04;

    // Check if the new position is within the container boundaries
    if (
      newPlayerPosition >= containerLeftEdge &&
      newPlayerPosition <= containerLeftEdge + gameContainer.offsetWidth
    ) {
      playerPosition = newPlayerPosition;
      player.style.left = `${playerPosition}px`;
    }
  }
}

function movePlayerRight() {
  if (!isPaused) {
    const containerLeftEdge = 0;
    const containerRightEdge = gameContainer.offsetWidth;
    const playerWidth = player.offsetWidth;
    const newPlayerPosition = playerPosition + gameContainer.offsetWidth * 0.04;

    // Check if the new position is within the container boundaries
    if (
      newPlayerPosition >= containerLeftEdge &&
      newPlayerPosition <= containerRightEdge
    ) {
      playerPosition = newPlayerPosition;
      player.style.left = `${playerPosition}px`;
    }
  }
}

function fireBullet() {
  if (canFire && !isPaused) {
    console.log("Pew!");
    playPlayerShootSound();

    const bullet = document.createElement("div");
    bullet.className = "bullet";
    bullet.style.left = `${playerPosition}px`;
    bullet.style.top = `${
      gameContainer.offsetHeight - gameContainer.offsetHeight * 0.075
    }px`;
    bullet.style.width = `${gameContainer.offsetWidth * 0.0075}px`;
    bullet.style.height = `${gameContainer.offsetWidth * 0.03}px`;
    gameContainer.appendChild(bullet);

    let bullet2 = bullet.cloneNode(true); //For double-fire mode
    if (gameMode.id === "double-fire-mode") {
      bullet.style.left =
        parseInt(bullet.style.left) - gameContainer.offsetWidth * 0.025 + "px";
      bullet2.style.left =
        parseInt(bullet2.style.left) + gameContainer.offsetWidth * 0.025 + "px";
      gameContainer.appendChild(bullet2);
    }

    // Move the bullet up
    const bulletInterval = setInterval(() => {
      if (!isPaused) {
        const bulletPosition = parseInt(bullet.style.top) || 0;
        bullet.style.top =
          bulletPosition - gameContainer.offsetHeight * 0.05 + "px";
        if (gameMode.id === "double-fire-mode") {
          const bullet2Position = parseInt(bullet2.style.top) || 0;
          bullet2.style.top =
            bullet2Position - gameContainer.offsetHeight * 0.05 + "px";
          checkCollision([bullet, bullet2], bulletInterval);
        } else {
          checkCollision([bullet], bulletInterval);
        }
      }
    }, 50);

    // Disable firing temporarily to limit firing rate
    canFire = false;
    setTimeout(
      () => {
        canFire = true;
      },
      gameMode.id === "machine-gun-mode" ? 150 : 1000
    );
  }
}

// Function to check for collisions between bullets and invaders
function checkCollision(bullets, interval) {
  invaderLines.forEach((line) => {
    const invaders = line.querySelectorAll(".invader");

    invaders.forEach((invader) => {
      bullets.forEach((bullet) => {
        const invaderRect = invader.getBoundingClientRect();
        const bulletRect = bullet.getBoundingClientRect();

        if (
          bulletRect.left >= invaderRect.left &&
          bulletRect.right <= invaderRect.right &&
          bulletRect.bottom >= invaderRect.top &&
          bulletRect.top <= invaderRect.bottom
        ) {
          if (invader.parentElement.classList.contains("saucer3-line")) {
            playerScore += 30;
          }
          if (invader.parentElement.classList.contains("saucer2-line")) {
            playerScore += 20;
          }
          if (invader.parentElement.classList.contains("saucer1-line")) {
            playerScore += 10;
          }
          // Bullet hit an invader, remove both the invader and the bullet
          invader.remove();
          bullet.remove();
          playInvaderKilledSound();

          document.getElementById("score").innerHTML = playerScore + " points";
          console.log("Player score: " + playerScore);

          // Check if all invaders are dead (player wins)
          if (gameMode.querySelectorAll(".invader").length === 0) {
            endGame("win");
          }
        }
      });
    });
  });

  // Check if the bullet reaches the top of the container
  bullets.forEach((bullet) => {
    if (bullet.offsetTop <= 0) {
      bullet.remove();
    }
  });
  if (!bullets) {
    clearInterval(interval);
  }
}

// Function to handle the game ending (win/lose)
function endGame(result) {
  clearInterval(moveInterval); // Stop the invaders' movement
  document.removeEventListener("keydown", handleKeyPress); // Remove keydown event listener
  document.removeEventListener("click", movePlayerLeft);
  document.removeEventListener("click", movePlayerRight);
  document.removeEventListener("click", fireBullet);
  // Remove mobile controls too
  leftBtn.disabled = true;
  rightBtn.disabled = true;
  shootBtn.disabled = true;

  if (result === "win") {
    document.getElementById("game-won").style.display = "block";
    const homeBtn = document.getElementById("win-go-home-btn");
    homeBtn.addEventListener("click", () => {
      window.location.reload();
    });
  } else {
    document.getElementById("game-lost").style.display = "block";

    const homeBtn = document.getElementById("lost-go-home-btn");
    homeBtn.addEventListener("click", () => {
      window.location.reload();
    });
  }
}

// Function to handle keypress events for player movement and firing
function handleKeyPress(event) {
  event.preventDefault();
  if (event.key === "ArrowLeft") {
    movePlayerLeft();
  } else if (event.key === "ArrowRight") {
    movePlayerRight();
  } else if (event.key === " ") {
    fireBullet();
  }
}

startGameBtn.addEventListener("click", () => {
  homeScreen.style.display = "none";
  gameContainer.style.display = "block";

  // Add event listener to handle player movement and firing
  document.addEventListener("keydown", handleKeyPress);
  leftBtn.addEventListener("click", movePlayerLeft);
  rightBtn.addEventListener("click", movePlayerRight);
  shootBtn.addEventListener("click", fireBullet);

  startGame();
});

function saucer3Fire() {
  const saucer3Invaders = gameMode.querySelectorAll(".saucer3-line .invader");
  if (saucer3Invaders.length === 0) {
    return; // No Saucer3 invaders left, stop firing
  }

  const randomSaucer3Index = Math.floor(Math.random() * saucer3Invaders.length);
  const randomSaucer3 = saucer3Invaders[randomSaucer3Index];

  const bullet = document.createElement("div");
  bullet.className = "bullet invader-bullet";
  bullet.style.left = `${
    randomSaucer3.offsetLeft + randomSaucer3.offsetWidth / 2
  }px`;
  bullet.style.top = `${
    randomSaucer3.offsetTop + randomSaucer3.offsetHeight
  }px`;
  bullet.style.width = `${gameContainer.offsetWidth * 0.006}px`;
  bullet.style.height = `${gameContainer.offsetWidth * 0.02}px`;
  bullet.style.backgroundColor = "red";
  gameContainer.appendChild(bullet);
  const bulletSpeed = 50;

  const bulletInterval = setInterval(() => {
    if (!isPaused) {
      const bulletPosition = parseInt(bullet.style.top) || 0;
      bullet.style.top =
        bulletPosition + gameContainer.offsetHeight * 0.03 + "px";

      // Check for collision with player
      const playerRect = player.getBoundingClientRect();
      const bulletRect = bullet.getBoundingClientRect();

      if (
        bulletRect.left >= playerRect.left &&
        bulletRect.right <= playerRect.right &&
        bulletRect.bottom >= playerRect.top &&
        bulletRect.top <= playerRect.bottom
      ) {
        endGame("lose"); // Player got hit by the invader's bullet (player loses)
        clearInterval(bulletInterval);
        bullet.remove();
        return;
      }

      // Check if the bullet reaches the bottom of the container
      if (bullet.offsetTop >= gameContainer.offsetHeight) {
        bullet.remove();
        clearInterval(bulletInterval);
      }
    }
  }, bulletSpeed);
}

function startSaucer3Firing() {
  let bulletInterval = Math.random() * 1000 + 1000; // Random interval between 1 and 2 seconds
  if (gameMode.id === "bullet-hell-mode") {
    bulletInterval = Math.random() * 250 + 250; // Random interval between 0.25 and 0.5 seconds
  }
  if (gameMode.id === "machine-gun-mode") {
    bulletInterval = Math.random() * 100 + 100; // VERY FAST!!
  }

  setInterval(() => {
    if (!isPaused) {
      saucer3Fire();
      console.log("Saucer is firing!");
    }
  }, bulletInterval);
}

function playInvaderMoveSound() {
  const invaderMoveSound = document.getElementById("invaderMoveSound");
  invaderMoveSound.play();
}

function playPlayerShootSound() {
  const playerShootSound = document.getElementById("playerShootSound");
  playerShootSound.play();
}

function playInvaderKilledSound() {
  const invaderKilledSound = document.getElementById("invaderKilledSound");
  invaderKilledSound.play();
}

// Function to toggle the audio volume on and off
function toggleVolume() {
  const invaderMoveSound = document.getElementById("invaderMoveSound");
  const playerShootSound = document.getElementById("playerShootSound");
  const invaderKilledSound = document.getElementById("invaderKilledSound");

  // Check if any of the sounds are currently muted
  const isMuted =
    invaderMoveSound.muted ||
    playerShootSound.muted ||
    invaderKilledSound.muted;

  // Toggle the mute state for all audio elements
  invaderMoveSound.muted = !isMuted;
  playerShootSound.muted = !isMuted;
  invaderKilledSound.muted = !isMuted;

  // Update the volume button icon based on the mute state
  const volumeIcon = isMuted ? "volume_off" : "volume_up";
  volumeBtn.innerHTML = `<span class="material-symbols-outlined"> ${volumeIcon} </span>`;
}

// Add a click event listener to the volume button
volumeBtn.addEventListener("click", toggleVolume);
