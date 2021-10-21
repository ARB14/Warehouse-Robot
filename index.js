let currentPosColumn = 0;
let currentPosRow = 9;
const crates = [
  [4, 5],
  [0, 9],
];
const robotArm = [];

(async () => {
  /**
   * Moves the robots position in a 10 x 10 grid.
   * @param {String} command
   * @returns
   */
  const moveRobot = async (command) => {
    let commands = command.split(" ");
    let isSuccessful = false;
    commands = await parseCommands(commands);
    for await (const command of commands) {
      console.log("\nCommand: ", command);
      isSuccessful = await executeCommand(command);
    }
    return isSuccessful;
  };

  /**
   * Parses commands to allow for diagonals.
   * @param {String} commands
   * @returns
   */
  const parseCommands = async (commands) => {
    const finalCommands = [];
    for (let i = 0; i < commands.length; i++) {
      if (commands[i] === "N" || commands[i] === "S") {
        if (commands[i + 1] === "W" || commands[i + 1] === "E") {
          finalCommands.push(commands[i] + commands[i + 1]);
          i = i + 1;
        } else {
          finalCommands.push(commands[i]);
        }
      } else if (commands[i] === "E" || commands[i] === "W") {
        if (commands[i + 1] === "N" || commands[i + 1] === "S") {
          finalCommands.push(commands[i] + commands[i + 1]);
          i = i + 1;
        } else {
          finalCommands.push(commands[i]);
        }
      } else {
        finalCommands.push(commands[i]);
      }
    }
    console.log("\nFinal Commands: ", finalCommands);
    return finalCommands;
  };

  /**
   * Executes a command.
   * @param {String} command
   * @returns
   */
  const executeCommand = async (command) => {
    const existingPosRow = currentPosRow;
    const existingPosColumn = currentPosColumn;

    switch (command) {
      case "N":
        currentPosRow = currentPosRow - 1;
        break;
      case "S":
        currentPosRow = currentPosRow + 1;
        break;
      case "E":
        currentPosColumn = currentPosColumn + 1;
        break;
      case "W":
        currentPosColumn = currentPosColumn - 1;
        break;
      case "NW":
      case "WN":
        currentPosRow = currentPosRow - 1;
        currentPosColumn = currentPosColumn - 1;
        break;
      case "SW":
      case "WS":
        currentPosRow = currentPosRow + 1;
        currentPosColumn = currentPosColumn - 1;
        break;
      case "NE":
      case "EN":
        currentPosRow = currentPosRow - 1;
        currentPosColumn = currentPosColumn + 1;
        break;
      case "SE":
      case "ES":
        currentPosRow = currentPosRow + 1;
        currentPosColumn = currentPosColumn + 1;
        break;
      case "G":
        if (!(await checkForCrate())) {
          break;
        }
        await pickUpCrate();
        break;
      case "D":
        if (await checkForCrate()) {
          console.log("\nCrate already in position.", crates);
          break;
        }
        await dropCrate();
        break;
    }

    console.log(
      "\nCurrent Position: ",
      [currentPosRow, currentPosColumn],
      "\n"
    );

    if (!(await checkBounds())) {
      currentPosRow = existingPosRow;
      currentPosColumn = existingPosColumn;
      return false;
    }
  };

  /**
   * Check if there is a crate in robots current position.
   * @returns
   */
  const checkForCrate = async () => {
    for await (const crate of crates) {
      if (crate[0] === currentPosRow && crate[1] === currentPosColumn) {
        return true;
      }
    }
    return false;
  };

  /**
   * Picks up crate at robots current position.
   */
  const pickUpCrate = async () => {
    for await (const crate of crates) {
      if (crate[0] === currentPosRow && crate[1] === currentPosColumn) {
        robotArm.push(crate);
        console.log("\nPicked up crate: ", crate);
      }
    }
    console.log("\nCrates: ", crates);
    console.log("\nRobot Arm: ", robotArm);
  };

  /**
   * Drops crate at robots current position.
   */
  const dropCrate = async () => {
    if (robotArm.length) {
      let cratesCounter = 0;
      for await (const crate of crates) {
        if (robotArm[0][0] === crate[0] && robotArm[0][1] === crate[1]) {
          crates[cratesCounter][0] = currentPosRow;
          crates[cratesCounter][1] = currentPosColumn;
          robotArm.length = 0;
          console.log("\nDropped crate: ", crate);
        }
        cratesCounter++;
      }
    }
    console.log("\nCrates: ", crates);
    console.log("\nRobot Arm: ", robotArm);
  };

  /**
   * Check that the command does not move the robot
   * out of bounds.
   * @returns
   */
  const checkBounds = async () => {
    if (currentPosRow < 0 || currentPosRow > 9) {
      return false;
    }

    if (currentPosColumn < 0 || currentPosColumn > 9) {
      return false;
    }
    return true;
  };

/**
 * Picks up crate in north east corner
 * Moves to middle crate
 * Attempts drop which fails as crate exists
 * Moves passed crate
 * Succesfully drops crate
 * Updates crates coords in crates array
 * Remove crate from robotArm array
 */
  await moveRobot(
    "N N N N N N N N N E E E E E E E E E G W W W W S S S S D S D"
  );
})();