const prompt = require("prompt-sync")({ sigint: true });

const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";

const DEFAULT_FIELD = [
  [pathCharacter, fieldCharacter, hole],
  [fieldCharacter, hole, fieldCharacter],
  [fieldCharacter, hat, fieldCharacter],
];

class Field {
  constructor(field = DEFAULT_FIELD) {
    this.field = field;
    this.locationX = 0;
    this.locationY = 0;

    this.field[0][0] = pathCharacter;
  }

  playGame() {
    let playing = true;

    while (playing) {
      this.print();
      this.askDirection();

      if (!this.isInBounds()) {
        console.log("Out of bounds!");
        playing = false;
        break;
      } else if (this.isHole()) {
        console.log("Sorry, you fell down a hole!");
        playing = false;
        break;
      } else if (this.isWin()) {
        console.log("Congrats, you found your hat!");
        playing = false;
        break;
      }

      this.field[this.locationX][this.locationY] = pathCharacter;
    }
  }

  askDirection() {
    const direction = prompt("Which way? ").toUpperCase();

    const previousLocationX = this.locationX;
    const previousLocationY = this.locationY;

    switch (direction) {
      case "U":
        this.locationX -= 1;
        break;
      case "D":
        this.locationX += 1;
        break;
      case "L":
        this.locationY -= 1;
        break;
      case "R":
        this.locationY += 1;
        break;
      default:
        console.log("Enter U, D, L or R.");
        this.askDirection();
        break;
    }

    this.field[previousLocationX][previousLocationY] = fieldCharacter;
  }

  isWin() {
    return this.field[this.locationX][this.locationY] === hat;
  }

  isHole() {
    return this.field[this.locationX][this.locationY] === hole;
  }

  isInBounds() {
    return (
      this.locationX >= 0 &&
      this.locationY >= 0 &&
      this.locationX < this.field.length &&
      this.locationY < this.field[0].length
    );
  }

  print() {
    const formattedRows = this.field.map((row) => row.join(""));

    console.log(formattedRows.join("\n"));
  }

  static generateField(height, width, percentage = 0.1) {
    const newField = Array(height)
      .fill(0)
      .map(() => Array(width));

    for (let row = 0; row < height; row++) {
      for (let column = 0; column < width; column++) {
        const prob = Math.random();
        newField[row][column] = prob > percentage ? fieldCharacter : hole;
      }
    }

    const hatLocation = {
      x: Math.floor(Math.random() * height),
      y: Math.floor(Math.random() * width),
    };

    while (hatLocation.x === 0 && hatLocation.y === 0) {
      hatLocation.x = Math.floor(Math.random() * height);
      hatLocation.y = Math.floor(Math.random() * width);
    }

    newField[hatLocation.x][hatLocation.y] = hat;

    return newField;
  }
}

const generateField = Field.generateField(20, 20, 0.2);

const myField = new Field(generateField);

myField.playGame();
