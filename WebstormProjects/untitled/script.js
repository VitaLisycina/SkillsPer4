const accountCorner = document.getElementById("accountCorner");
const accountName = document.getElementById("accountName");

const loginOverlay = document.getElementById("loginOverlay");
const profileOverlay = document.getElementById("profileOverlay");

const loginButton = document.getElementById("loginButton");

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");

const closeLoginButton = document.getElementById("closeLoginButton");

const profileNickname = document.getElementById("profileNickname");

const editNicknameButton = document.getElementById("editNicknameButton");

const addFriendButton = document.getElementById("addFriendButton");

const friendNicknameInput = document.getElementById("friendNicknameInput");

const friendsList = document.getElementById("friendsList");

const friendRequests = document.getElementById("friendRequests");

const logoutButton = document.getElementById("logoutButton");

const closeProfileButton = document.getElementById("closeProfileButton");

const notificationDot = document.getElementById("notificationDot");

let currentUser = null;

/* ACCOUNT CORNER CLICK */

accountCorner.addEventListener("click", () => {

    if (!currentUser) {

        loginOverlay.classList.remove("hidden");

    } else {

        openProfile();
    }
});

/* LOGIN */

loginButton.addEventListener("click", () => {

    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();

    const users =
        JSON.parse(localStorage.getItem("users")) || [];

    const foundUser = users.find(user =>
        user.email === email &&
        user.password === password
    );

    if (!foundUser) {
        alert("Wrong login.");
        return;
    }

    currentUser = foundUser;

    updateAccountUI();

    loginOverlay.classList.add("hidden");
});

/* LOGOUT */

logoutButton.addEventListener("click", () => {

    currentUser = null;
    localStorage.removeItem("currentUserEmail");

    updateAccountUI();

    profileOverlay.classList.add("hidden");

});

/* UPDATE ACCOUNT UI */

function updateAccountUI() {

    if (currentUser) {

        accountName.textContent =
            currentUser.nickname;

    } else {

        accountName.textContent =
            "ACCOUNT";
    }
}

/* PROFILE */

function openProfile() {

    profileOverlay.classList.remove("hidden");

    profileNickname.textContent =
        currentUser.nickname;

    renderFriends();
    renderFriendRequests();
}

/* CLOSE */

closeProfileButton.addEventListener("click", () => {
    profileOverlay.classList.add("hidden");
});

closeLoginButton.addEventListener("click", () => {
    loginOverlay.classList.add("hidden");
});

/* CHANGE NICKNAME */

editNicknameButton.addEventListener("click", () => {

    const newNickname =
        prompt("NEW NICKNAME");

    if (!newNickname) return;

    if (newNickname.length < 1 ||
        newNickname.length > 15) {

        alert("Invalid nickname.");
        return;
    }

    const users =
        JSON.parse(localStorage.getItem("users")) || [];

    const nicknameExists = users.some(user =>
        user.nickname.toLowerCase() ===
        newNickname.toLowerCase()
    );

    if (nicknameExists) {

        alert("Nickname taken.");
        return;
    }

    currentUser.nickname = newNickname;

    saveCurrentUser();

    updateAccountUI();

    profileNickname.textContent =
        newNickname;
});

/* SAVE */

function saveCurrentUser() {

    let users =
        JSON.parse(localStorage.getItem("users")) || [];

    users = users.map(user => {

        if (user.email === currentUser.email) {
            return currentUser;
        }

        return user;
    });

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );
}

/* ADD FRIEND */

addFriendButton.addEventListener("click", () => {

    const nickname =
        friendNicknameInput.value.trim();

    let users =
        JSON.parse(localStorage.getItem("users")) || [];

    const targetUser = users.find(user =>
        user.nickname.toLowerCase() ===
        nickname.toLowerCase()
    );

    if (!targetUser) {

        alert("User not found.");
        return;
    }

    if (!targetUser.friendRequests) {
        targetUser.friendRequests = [];
    }

    targetUser.friendRequests.push(
        currentUser.nickname
    );

    users = users.map(user => {

        if (user.email === targetUser.email) {
            return targetUser;
        }

        return user;
    });

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

    alert("Friend request sent.");
});

/* FRIEND REQUESTS */

function renderFriendRequests() {

    friendRequests.innerHTML = "";

    if (!currentUser.friendRequests) {
        currentUser.friendRequests = [];
    }

    if (currentUser.friendRequests.length > 0) {
        notificationDot.classList.remove("hidden");
    } else {
        notificationDot.classList.add("hidden");
    }

    currentUser.friendRequests.forEach(name => {

        const button =
            document.createElement("button");

        button.textContent =
            `${name} +`;

        button.addEventListener("click", () => {

            if (!currentUser.friends) {
                currentUser.friends = [];
            }

            currentUser.friends.push(name);

            currentUser.friendRequests =
                currentUser.friendRequests.filter(
                    n => n !== name
                );

            saveCurrentUser();

            renderFriendRequests();
            renderFriends();
        });

        friendRequests.appendChild(button);
    });
}

/* FRIENDS */

function renderFriends() {

    friendsList.innerHTML = "";

    if (!currentUser.friends) {
        currentUser.friends = [];
    }

    currentUser.friends.forEach(friend => {

        const div =
            document.createElement("div");

        div.textContent = friend;

        friendsList.appendChild(div);
    });
}


const colors = ["red", "orange", "yellow", "green", "blue", "purple", "pink"];
const hardColorMap = {
    red: "hard-red",
    orange: "hard-orange",
    yellow: "hard-yellow",
    green: "hard-green",
    blue: "hard-blue",
    purple: "hard-purple",
    pink: "hard-pink"
};
function getVisualClass(color) {
    if (gameMode === "hard") {
        return hardColorMap[color];
    }

    return color;
}

let sequence = [];
let playerSequence = [];
let sequenceLength = 3;
let correctInRow = 0;
let canClick = false;
let score = 0;

let bestScore = Number(localStorage.getItem("bestScore")) || 0;

const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const startButton = document.getElementById("startButton");
const onlineButton = document.getElementById("onlineButton");

const registerOverlay = document.getElementById("registerOverlay");
const registerButton = document.getElementById("registerButton");

const emailInput = document.getElementById("emailInput");
const nicknameInput = document.getElementById("nicknameInput");
const passwordInput = document.getElementById("passwordInput");

const createAccountButton = document.getElementById("createAccountButton");
const closeRegisterButton = document.getElementById("closeRegisterButton");

registerButton.addEventListener("click", () => {
    registerOverlay.classList.remove("hidden");
});

closeRegisterButton.addEventListener("click", () => {
    registerOverlay.classList.add("hidden");
});

createAccountButton.addEventListener("click", () => {
    const email = emailInput.value.trim();
    const nickname = nicknameInput.value.trim();
    const password = passwordInput.value.trim();

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (!email.includes("@")) {
        alert("Invalid email.");
        return;
    }

    if (nickname.length < 1 || nickname.length > 15) {
        alert("Nickname must be 1-15 symbols.");
        return;
    }

    if (password.length < 4) {
        alert("Password too short.");
        return;
    }

    const nicknameExists = users.some(user =>
        user.nickname.toLowerCase() === nickname.toLowerCase()
    );

    if (nicknameExists) {
        alert("Nickname already taken.");
        return;
    }

    const emailExists = users.some(user =>
        user.email.toLowerCase() === email.toLowerCase()
    );

    if (emailExists) {
        alert("Email already registered.");
        return;
    }

    const newUser = {
        email: email,
        nickname: nickname,
        password: password,
        bestScore: 0,
        friends: [],
        friendRequests: []
    };

    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));

    // site remembers logged-in user
    localStorage.setItem("currentUserEmail", email);

    currentUser = newUser;
    updateAccountUI();

    alert("Account created.");

    registerOverlay.classList.add("hidden");

    emailInput.value = "";
    nicknameInput.value = "";
    passwordInput.value = "";
});

function loadSavedUser() {
    const savedEmail = localStorage.getItem("currentUserEmail");
    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (!savedEmail) return;

    const foundUser = users.find(user => user.email === savedEmail);

    if (foundUser) {
        currentUser = foundUser;
        updateAccountUI();
    }
}

/* CLOSE WINDOW */

closeRegisterButton.addEventListener("click", () => {
    registerOverlay.classList.add("hidden");
});

/* CREATE ACCOUNT */

createAccountButton.addEventListener("click", () => {

    const email = emailInput.value.trim();
    const nickname = nicknameInput.value.trim();
    const password = passwordInput.value.trim();

    /* nickname rules */

    if (nickname.length < 1) {
        alert("Nickname too short.");
        return;
    }

    if (nickname.length > 15) {
        alert("Nickname too long.");
        return;
    }

    /* load all users */

    let users = JSON.parse(localStorage.getItem("users")) || [];

    /* nickname uniqueness */

    const nicknameExists = users.some(user =>
        user.nickname.toLowerCase() === nickname.toLowerCase()
    );

    if (nicknameExists) {
        alert("Nickname already taken.");
        return;
    }

    /* email check */

    if (!email.includes("@")) {
        alert("Invalid email.");
        return;
    }

    /* password check */

    if (password.length < 4) {
        alert("Password too short.");
        return;
    }

    /* create user */

    const newUser = {
        email: email,
        nickname: nickname,
        password: password,
        bestScore: 0
    };

    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));

    alert("Account created.");

    registerOverlay.classList.add("hidden");

    emailInput.value = "";
    nicknameInput.value = "";
    passwordInput.value = "";
});

const message = document.getElementById("message");
const cubes = document.querySelectorAll(".cube");

const tower = document.getElementById("tower");
const towerArea = document.getElementById("towerArea");

const landscape = document.getElementById("landscape");
const sky = document.getElementById("sky");

const hintOverlay = document.getElementById("hintOverlay");
const hintCubes = document.getElementById("hintCubes");

const scoreText = document.getElementById("scoreText");
const bestText = document.getElementById("bestText");

const leaderboard = document.getElementById("leaderboard");
const currentScoreText = document.getElementById("currentScoreText");
const bestScoreText = document.getElementById("bestScoreText");

const restartButton = document.getElementById("restartButton");
const mainMenuButton = document.getElementById("mainMenuButton");
const shareButton = document.getElementById("shareButton");

let gameMode = "easy";

const singlePlayButton = document.getElementById("singlePlayButton");
const easyButton = document.getElementById("easyButton");
const hardButton = document.getElementById("hardButton");
const backButton = document.getElementById("backButton");
const mainMenu = document.getElementById("mainMenu");
const difficultyMenu = document.getElementById("difficultyMenu");

singlePlayButton.addEventListener("click", () => {
    mainMenu.classList.add("hidden");
    difficultyMenu.classList.remove("hidden");
});

easyButton.addEventListener("click", () => {
    gameMode = "easy";
    document.body.classList.remove("hardMode");
    startGame();
});

hardButton.addEventListener("click", () => {
    gameMode = "hard";
    startGame();
});

backButton.addEventListener("click", () => {
    difficultyMenu.classList.add("hidden");
    mainMenu.classList.remove("hidden");
});
restartButton.addEventListener("click", restartGame);
mainMenuButton.addEventListener("click", goToMainMenu);
shareButton.addEventListener("click", shareScore);

cubes.forEach(cube => {
    cube.addEventListener("click", () => {
        if (!canClick) return;

        const color = cube.dataset.color;

        playerSequence.push(color);
        addCubeToTower(color);
        checkPlayerInput();
    });
});

function startGame() {
    startScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    resetGame();
    startRound();
}

function restartGame() {
    leaderboard.classList.add("hidden");

    resetGame();
    startRound();
}

function goToMainMenu() {
    leaderboard.classList.add("hidden");
    gameScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");

    difficultyMenu.classList.add("hidden");
    mainMenu.classList.remove("hidden");
    document.body.classList.remove("hardMode");

    resetGame();
}

function resetGame() {
    sequence = [];
    playerSequence = [];
    sequenceLength = 3;
    correctInRow = 0;
    canClick = false;
    score = 0;

    tower.innerHTML = "";

    tower.style.bottom = "70px";
    landscape.style.transform = "translateY(0px)";

    generateClouds();
    updateScoreText();

    message.textContent = "Watch the hint...";
}

function startRound() {
    canClick = false;
    playerSequence = [];

    sequence = createRandomSequence(sequenceLength);

    message.textContent = "Watch the hint...";

    showHint();
}

function createRandomSequence(length) {
    const result = [];

    for (let i = 0; i < length; i++) {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        result.push(randomColor);
    }

    return result;
}

function showHint() {
    hintCubes.innerHTML = "";

    sequence.forEach(color => {
        const cube = document.createElement("div");

        cube.classList.add("hintCube");
        cube.classList.add(getVisualClass(color));

        hintCubes.appendChild(cube);
    });

    hintOverlay.classList.remove("hidden");

    setTimeout(() => {
        hintOverlay.classList.add("hidden");
        canClick = true;
        message.textContent = "Build the tower!";
    }, 2200);
}

function addCubeToTower(color) {
    const towerCube = document.createElement("div");

    towerCube.classList.add("towerCube");
    towerCube.classList.add(getVisualClass(color));

    tower.appendChild(towerCube);

    playBuildSound();
}

function checkPlayerInput() {
    const currentIndex = playerSequence.length - 1;

    const playerColor = playerSequence[currentIndex];
    const correctColor = sequence[currentIndex];

    if (playerColor !== correctColor) {
        loseGame();
        return;
    }

    score++;
    updateScoreText();
    updateTowerCamera();

    if (playerSequence.length === sequence.length) {
        winRound();
    }
}

function winRound() {
    canClick = false;
    correctInRow++;

    message.textContent = "Perfect!";

    playPerfectSound();

    if (correctInRow === 2) {
        sequenceLength++;
        correctInRow = 0;
    }

    setTimeout(startRound, 1200);
}

function updateTowerCamera() {
    const towerHeight = tower.scrollHeight;
    const visibleHeight = towerArea.clientHeight - 70;

    if (towerHeight > visibleHeight) {
        const moveAmount = towerHeight - visibleHeight;

        tower.style.bottom = `${70 - moveAmount}px`;

        landscape.style.transform = `translateY(${moveAmount}px)`;

        renewClouds(moveAmount);
    }
}

function loseGame() {
    canClick = false;

    message.textContent = "Tower collapsed!";

    playCollapseSound();

    const towerCubes = document.querySelectorAll(".towerCube");

    towerCubes.forEach(cube => {
        cube.classList.add("collapse");
    });

    saveBestScore();

    currentScoreText.textContent = "Current score: " + score;
    bestScoreText.textContent = "Best score: " + bestScore;

    leaderboard.classList.remove("hidden");
}

function updateScoreText() {
    scoreText.textContent = "Score: " + score;
    bestText.textContent = "Best: " + bestScore;
}

function saveBestScore() {
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem("bestScore", bestScore);
    }

    updateScoreText();
}

function shareScore() {
    const text = `I scored ${score} in Color Tower! My best score is ${bestScore}.`;

    if (navigator.share) {
        navigator.share({
            title: "Color Tower",
            text: text
        });
    } else {
        navigator.clipboard.writeText(text);
        alert("Score copied!");
    }
}

/* CLOUDS */

function generateClouds() {
    sky.innerHTML = "";

    for (let y = 0; y < 8000; y += 170) {
        if (Math.random() > 0.25) {
            createCloud(y);
        }
    }
}

function createCloud(yPosition) {
    const cloud = document.createElement("div");

    cloud.classList.add("cloud");

    const randomX = Math.random() * 190;

    cloud.style.left = randomX + "px";
    cloud.style.bottom = yPosition + "px";

    sky.appendChild(cloud);
}

function renewClouds(moveAmount) {
    const clouds = document.querySelectorAll(".cloud");

    clouds.forEach(cloud => {
        const cloudBottom = Number(cloud.style.bottom.replace("px", ""));

        if (cloudBottom < moveAmount - 300) {
            cloud.remove();
            createCloud(moveAmount + 900 + Math.random() * 500);
        }
    });
}

/* SOUNDS */

function playTone(frequency, duration, type = "sine") {
    const audio = new AudioContext();

    const oscillator = audio.createOscillator();
    const gain = audio.createGain();

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    oscillator.connect(gain);
    gain.connect(audio.destination);

    gain.gain.setValueAtTime(0.12, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + duration);

    oscillator.start();
    oscillator.stop(audio.currentTime + duration);
}

function playBuildSound() {
    playTone(420, 0.08, "square");
}

function playPerfectSound() {
    playTone(700, 0.15, "sine");
}

function playCollapseSound() {
    playTone(110, 0.5, "sawtooth");
}

loadSavedUser();
