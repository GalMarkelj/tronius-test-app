# Trnoius test app

## Task breakdown

### Objective

Create a simple slot machine game using Phaser3 and TypeScript. The game should
consist of a single scene with basic functionality.

### Requirements

#### Reels (3x3 Grid)

- The game should display 3 vertical reels, each containing 3 rows (forming a grid of 9 symbols in total, 3 rows by 3 columns).

#### Symbols

- Create a set of 5 distinct symbols (these can be images or basic shapes).
  Each reel should randomly display one of these symbols after spinning.

#### Spin Button

- Add a button labeled "Spin." When the player clicks this button, the reels
  should start spinning.

#### Reel Spin Mechanism

- When the spin button is pressed, all reels should start spinning like a traditional slot machine.
- The reels should spin for a few seconds (e.g., 2-3 seconds).
- After the spin time ends, the reels should stop, showing random symbols.

### Tools & Setup

- Phaser3 Framework: Use Phaser3 for building the game.
- TypeScript: Write the game logic in TypeScript for better type safety and
  structure.
- Git: Use Git for version control.

### Submission:

- Upload your project to a Git repository (e.g., GitHub) and share the repository link with us.

## Setup

**Requirements**

- working Docker environment

**Quickstart**

1. Clone this repository and move into its directory
2. Run
   ```sh
   docker compose pull
   docker compose run --rm app npm install
   ```

**Start the game**

1. Start dev container `docker compose up`
2. Open the website at http://localhost:3000
3. Stop and remove containers `docker compose down`
