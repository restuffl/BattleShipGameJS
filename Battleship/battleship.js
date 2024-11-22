// View object for display updates
var view = {
    displayMessage: function (msg) {
        document.getElementById("messageArea").innerHTML = msg;
    },
    displayHit: function (location) {
        document.getElementById(location).classList.add("hit");
    },
    displayMiss: function (location) {
        document.getElementById(location).classList.add("miss");
    },
};

// Model object for game state
var model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,
    //Ship Locations
    ships: [
        { locations: [0, 0, 0], hits: ["", "", ""] },
        { locations: [0, 0, 0], hits: ["", "", ""] },
        { locations: [0, 0, 0], hits: ["", "", ""] },
    ],
    //Function to guess at a ship and if the ship is hit, outputs
    // "HIT" messaging the user
    fire: function (guess) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess);
            if (index >= 0) {
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("HIT!");
                if (this.isSunk(ship)) {
                    this.shipsSunk++;
                    view.displayMessage("You sank my battleship!");
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("You missed.");
        return false;
    },
    isSunk: function (ship) {
        return ship.hits.every(hit => hit === "hit");
    },
    generateShipLocations: function () {
        for (var i = 0; i < this.numShips; i++) {
            var locations;
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
    },
    generateShip: function () {
        var direction = Math.floor(Math.random() * 2);
        var row, col;
        if (direction === 1) {
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        } else {
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
            col = Math.floor(Math.random() * this.boardSize);
        }

        var newShipLocations = [];
        for (var i = 0; i < this.shipLength; i++) {
            newShipLocations.push(
                direction === 1 ? row + "" + (col + i) : (row + i) + "" + col
            );
        }
        return newShipLocations;
    },
    collision: function (locations) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            if (locations.some(loc => ship.locations.includes(loc))) {
                return true;
            }
        }
        return false;
    },
};

// Controller object for player interaction
var controller = {
    guesses: 0,
    processGuess: function (guess) {
        var location = parseGuess(guess);
        if (location) {
            this.guesses++;
            var hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage(
                    "You sank all my battleships, in " + this.guesses + " guesses"
                );
            }
        }
    },
};

// Helper function to validate guesses
function parseGuess(guess) {
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
    if (guess === null || guess.length !== 2) {
        alert("Oops, please enter a letter and a number on the board.");
        return null;
    }
    var row = alphabet.indexOf(guess.charAt(0).toUpperCase());
    var column = guess.charAt(1);
    if (row === -1 || isNaN(column) || column < 0 || column >= model.boardSize) {
        alert("Oops, that's not on the board.");
        return null;
    }
    return row + column;
}

// Event handlers
function init() {
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = function (e) {
        if (e.keyCode === 13) {
            fireButton.click();
            return false;
        }
    };
    generateTable();
    model.generateShipLocations();
}

function handleFireButton() {
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value;
    controller.processGuess(guess);
    guessInput.value = "";
}

// Generate table grid
function generateTable() {
    var table = document.querySelector("table");
    for (var i = 0; i < model.boardSize; i++) {
        var row = document.createElement("tr");
        for (var j = 0; j < model.boardSize; j++) {
            var cell = document.createElement("td");
            cell.id = i + "" + j;
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
}

window.onload = init;