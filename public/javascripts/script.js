let isAlive = setInterval(checkCollision, 10);
function jump() {
  if (dino.classList != "jump") {
    dino.classList.add("jump");

    setTimeout(function () {
      dino.classList.remove("jump");
    }, 300);
  }
}
function checkCollision() {
  let dinoTop = parseInt(window.getComputedStyle(dino).getPropertyValue("top"));
  let cactusLeft = parseInt(window.getComputedStyle(cactus).getPropertyValue("left"));

  if (cactusLeft < 50 && cactusLeft > 0 && dinoTop >= 140) {
    gameOver();
  }
}

function gameOver() {
  // Stop the cactus animation
  cactus.style.animation = "none";
  cactus.style.display = "none"; // Optionally hide the cactus

  // Stop the game loop
  clearInterval(isAlive);

  // Display the restart button
  document.getElementById("restartBtn").style.display = "block";
  document.getElementById("over").style.display = "block";
}

function restartGame() {
  cactus.style.display = "block"; // If you hid the cactus, show it again
  cactus.style.animation = "block 1s infinite linear";
  isAlive = setInterval(checkCollision, 10); // Restart the game loop
  document.getElementById("restartBtn").style.display = "none"; // Hide the restart button
  document.getElementById("over").style.display = "none";

}

document.addEventListener("keydown", function (event) {
  if(event.code === "Space" || event.key === "ArrowUp") {
    jump();
  }
});

window.addEventListener('keydown', function(e) {
  if(e.keyCode == 32 && e.target == document.body) {
    e.preventDefault();
  }
});
// Call restartGame when the restart button is clicked
document.getElementById("restartBtn").addEventListener("click", restartGame);
