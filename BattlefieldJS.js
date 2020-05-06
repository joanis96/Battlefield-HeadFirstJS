// The Model View Controller man !!!
var view = {
    displayMessage: function(msg) {
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },
    
    displayHit: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },
    
    displayMiss: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
};

var model = {
    boardSize: 7,
    
    numShips: 3,
    
    shipsSunk: 0,
    
    shipLength: 3,
    
    /*ships: [{ locations: ["06", "16", "26"], hits: ["", "", ""] },
            { locations: ["24", "34", "44"], hits: ["", "", ""] },
            { locations: ["10", "11", "12"], hits: ["", "", ""] }],  old code*/
    
    ships: [{ locations: [0, 0, 0], hits: ["", "", ""]}, 
            { locations: [0, 0, 0], hits: ["", "", ""]},
            { locations: [0, 0, 0], hits: ["", "", ""]}],
    
    fire: function(guess) {
        
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess);
            if(index >= 0) {
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("HIT!");
                
                if (this.isSunk(ship)) {
                    view.displayMessage("You sank my battleship!");
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("You missed.");
        return false;
    },
    
    isSunk: function(ship) {
        for(var i = 0; i < this.shipLength; i++) {
            if(ship.hits[i] !== "hit") {
                return false;
            }
        } 
        return true;
    }, 
    
    // method to generate Ship!  
    //using a do while loop : it works like the while except u first execute the statements in the body then check the condition
    generateShipLocations: function() {
        var locations;
        for (var i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations; // Once we have locations that work, we assign the location to the ship's locations..
        }
    },
    // GenerateShip method
    generateShip: function() {
        var direction = Math.floor(Math.random() * 2); // Math random to generate a number between 0 and 1, multiply by 2 to get an numb between 0 and 2(not including 2) we then turn that into a 0 or a 1 using math.floor
        var row, col;
        
        if (direction === 1) {
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        } else {
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
            col = Math.floor(Math.random() * this.boardSize);
        }
        // for the new ship location we'll start with an empty array, and add the locations one by one.
        var newShipLocations = [];
        for (var i = 0; i < this.shipLength; i++) {
            if (direction ===1) {
                // add location to array for new horizontal ship
                newShipLocations.push(row + "" + (col + i));
            } else {
                // add location to array for new vertical ship
                newShipLocations.push((row + i) + "" + col);
            }
        }
        
        return newShipLocations;
        
    },
    
    collision: function (locations) {
        for (var i = 0; i < this.numShips; i++) { // for each ship already on the board
            var ship = model.ships[i];
            for (var j = 0; j < locations.length; j++) { // check if any of the locations in the new ship's location array are in an existing ship's location array
                if(ship.locations.indexOf(locations[j]) >= 0) { // index of if location already exist in a ship so if the index is greater than or equal to zero, we know it matched an existing location so we return true(meaning we found a collision)
                    return true;
                }
            }
        }
        return false; // we never found a match for any of the locations we were checking so we return false(no collision)
    }
};

var controller = {
    guesses: 0,
    
    processGuess: function (guess) {
        var location = parseGuess(guess);
        if (location) {
            this.guesses++;
            var hit = model.fire(location);
            
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses");
            }
        }
    }
};

// to convert a letter to number for the sake of the game
function parseGuess(guess) {
    
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
    
    if (guess === null || guess.length !== 2) {
        alert("Oops, please enter a letter and a number on the board.");
    } else {
        firstChar = guess.charAt(0);
        var row = alphabet.indexOf(firstChar);
        var column = guess.charAt(1);
        
        if (isNaN(row) || isNaN(column)) {
            alert("Oops, that isn't on the board.");
        } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
            alert("Oops that's off the board!");
        } else {
            return row + column;
        }
    } 
    return null; // if we get there, there was a failed check along the way, so return null 
}

// function to fire !!!!

function init() {
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    // to be able to press return and not just click all the time, too slow 
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;
    
    model.generateShipLocations(); // calling it onload !!!
}

function handleKeyPress(e) {
    var fireButton = document.getElementById("fireButton");
    if(e.keyCode === 13) {
        fireButton.click(); // if press enter key, event keyCode property will be set to 13
        return false; // return false so the form doesn't do anything else(like trying to submit itself)
    }
}

// fire !!!
function handleFireButton() {
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value;
    controller.processGuess(guess);
    
    guessInput.value = ""; // resets the form input element to be the empty string. That way U don't have to explicitly select the text nd delete it before entering the next guess wich would be annoying!
}

// browser run init when the page is fully loaded!
window.onload = init;

/*view.displayMiss("00");
view.displayHit("34");
view.displayMiss("55");
view.displayHit("12");
view.displayMiss("25");
view.displayHit("26");*/

/*view.displayMessage("Tap tap, is this thing working yet bro ??");

model.fire("53");

model.fire("06");
model.fire("16");
model.fire("26");

model.fire("34");
model.fire("24");
model.fire("44");

model.fire("12");
model.fire("11");
model.fire("10");*/

/*console.log(parseGuess("A0"));
console.log(parseGuess("B6"));
console.log(parseGuess("G3"));
console.log(parseGuess("H0"));
console.log(parseGuess("A7"));*/

/*controller.processGuess("A0");

controller.processGuess("A6");
controller.processGuess("B6");
controller.processGuess("C6");

controller.processGuess("C4");
controller.processGuess("D4");
controller.processGuess("E4");

controller.processGuess("B0");
controller.processGuess("B1");
controller.processGuess("B2");*/

