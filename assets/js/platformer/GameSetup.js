
// GameSehup.js Key objective is to define GameLevel objects and their assets.
import GameEnv from './GameEnv.js';
import GameLevel from './GameLevel.js';
// To build GameLevels, each contains GameObjects from below imports
import GameControl from './GameControl.js';
import GameSet from './GameSet.js';
import GameSetterStart from './GameSetterStart.js';
import GameSetterHills from './GameSetterHills.js';
import GameSetterGreece from './GameSetterGreece.js';
import GameSetterQuidditch from './GameSetterQuidditch.js';
import GameSetterWinter from './GameSetterWinter.js';
import GameSetterSkibidi from './GameSetterSkibidi.js';
import GameSetterBossFight from './GameSetterBossFight.js'
import GameSetterEnd from './GameSetterEnd.js';
import Leaderboard from './Leaderboard.js';
//test comment

/* Coding Style Notes
 *
 * GameSetup is defined as an object literal in in Name Function Expression (NFE) style
 * * const GameSetup = function() { ... } is an NFE
 * * NFEs are a common pattern in JavaScript, reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function 
 *
 * * Informerly, inside of GameSetup it looks like defining keys and values that are functions.
 * * * GameSetup is a singleton object, object literal, without a constructor.
 * * * This coding style ensures one instance, thus the term object literal.
 * * * Inside of GameSetup, the keys are functions, and the values are references to the functions.
 * * * * The keys are the names of the functions.
 * * * * The values are the functions themselves.
 *
 * * Observe, encapulation of this.assets and sharing data between methods.
 * * * this.assets is defined in the object literal scope.
 * * * this.assets is shared between methods.
 * * * this.assets is not accessible outside of the object literal scope.
 * * * this.assets is not a global variable.
 * 
 * * Observe, the use of bind() to bind methods to the GameSetup object.
 * * * * bind() ensures "this" inside of methods binds to "GameSetup"
 * * * * this avoids "Temporal Dead Zone (TDZ)" error...
 * 
 * 
 * Usage Notes
 * * call GameSetup.initLevels() to setup the game levels and assets.
 * * * the remainder of GameSetup supports initLevels()
 * 
*/

// Define the GameSetup object literal
const GameSetup = {

  /*  ==========================================
   *  ===== Game Level Methods +++==============
   *  ==========================================
   * Game Level methods support Game Play, and Game Over
   * * Helper functions assist the Callback methods
   * * Callback methods are called by the GameLevel objects
   */

  /**
   * Helper function that waits for a button click event.
   * @param {string} id - The HTML id or name of the button.
   * @returns {Promise<boolean>} - A promise that resolves when the button is clicked.
   * References:
   * * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
   * *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve
   */
  waitForButtonStart: function (id) {
    // Returns a promise that resolves when the button is clicked
    return new Promise((resolve) => {
      const waitButton = document.getElementById(id);
      // Listener function to resolve the promise when the button is clicked
      const waitButtonListener = () => {
        resolve(true);
      };
      // Add the listener to the button's click event
      waitButton.addEventListener('click', waitButtonListener);
    });
  },

  waitForButtonRestart: function (id) {
    // Returns a promise that resolves when the button is clicked
    return new Promise((resolve) => {
      const waitButton = document.getElementById(id);
      // Listener function to resolve the promise when the button is clicked
      const waitButtonListener = () => {
        if (document.getElementById('timeScore')) {
          document.getElementById('timeScore').textContent = GameEnv.time
        }
        const userScoreElement = document.getElementById('userScore');

        if (userScoreElement) {
          // Update the displayed time
          userScoreElement.textContent = (GameEnv.coinScore / 1000).toFixed(2);
        }
        resolve(true);
      };
      // Add the listener to the button's click event
      waitButton.addEventListener('click', waitButtonListener);
    });
  },

  /*  ==========================================
   *  ===== Game Level Call Backs ==============
   *  ==========================================
   * Game Level callbacks are functions that return true or false
   */

  /**
   * Start button callback.
   * Unhides the gameBegin button, waits for it to be clicked, then hides it again.
   * @async
   * @returns {Promise<boolean>} Always returns true.
   */
  startGameCallback: async function () {
    const id = document.getElementById("gameBegin");
    // Unhide the gameBegin button
    id.hidden = false;

    // Wait for the startGame button to be clicked
    await this.waitForButtonStart('startGame');
    // Hide the gameBegin button after it is clicked
    id.hidden = true;

    return true;
  },

  /**
   * Home screen exits on the Game Begin button.
   * Checks if the gameBegin button is hidden, which means the game has started.
   * @returns {boolean} Returns true if the gameBegin button is hidden, false otherwise.
   */
  homeScreenCallback: function () {
    // gameBegin hidden means the game has started
    const id = document.getElementById("gameBegin");
    return id.hidden;
  },

  /**
   * Level completion callback, based on Player off screen.
   * Checks if the player's x position is greater than the innerWidth of the game environment.
   * If it is, resets the player for the next level and returns true.
   * If it's not, returns false.
   * @returns {boolean} Returns true if the player's x position is greater than the innerWidth, false otherwise.
   */
  playerOffScreenCallBack: function () {
    // console.log(GameEnv.player?.x)
    if (GameEnv.player?.x > GameEnv.innerWidth) {
      GameEnv.player = null; // reset for next level
      //Leaderboard.openLeaderboardPanel();
      alert("Level Complete! Click OK to continue to the next level.");
      return true;
    } else {
      return false;
    }
  },

  /**
   * Game Over callback.
   * Unhides the gameOver button, waits for it to be clicked, then hides it again.
   * Also sets the currentLevel of the game environment to null.
   * @async
   * @returns {Promise<boolean>} Always returns true.
   */
  gameOverCallBack: async function () {
    const id = document.getElementById("gameOver");
    id.hidden = false;
    GameControl.stopTimer()
    // Wait for the restart button to be clicked
    await this.waitForButtonRestart('restartGame');
    id.hidden = true;

    // Change currentLevel to start/restart value of null
    GameEnv.currentLevel = false;

    return true;
  },

  /*  ==========================================
   *  ========== Game Level Init ===============
   *  ==========================================
  */
  initLevels: function (path) {  
    // ensure valid {{site.baseurl}} for path
    this.path = path;

    var fun_facts = {
      //data structure
      "Fun Fact #1": "Scripps is a nonprofit medical research facility.", 
      "Fun Fact #2": "Scripps focuses on research and education in biomedical sciences.", 
      "Fun Fact #3": "Scripps' insitute has been around for over 100 years.",
      "Fun Fact #4": "Scripps' insitute has over 170 laboratories.",
      "Fun Fact #5": "Scripps has over 2100 administrative staff.",
      "Fun Fact #6": "Scripps Research integrates AI into their research.",
      "Fun Fact #7": "Many Pilot City innovations have turned into collaborations and internships.",
      "Fun Fact #8": "Pilot City helps make biotech accessible and understandable.",
      "Fun Fact #9": "High School and college students have helped scientists brainstorm biotech through Pilot City."
    }
    function generate() {
      var nums = Object.keys(fun_facts);
      //console.log(nums);
      var num = nums[Math.floor(Math.random() * nums.length)]
      var fun_fact = fun_facts[num]; //using dictionary
      //access ids
      document.getElementById("fun_fact").innerHTML = fun_fact;
      document.getElementById("num").innerHTML = num;
    }

    let k = 0;
    let interval2 = setInterval(() => {
      generate();
      k++;
      if (k == fun_facts.length) {
        clearInterval(interval2);
      }
    }, 3000);


    // Initialize Game Levels
    function GameLevelSetup(GameSetter, path, callback, passive = false) {
      var gameObjects = new GameSet(GameSetter.assets, GameSetter.objects, path);
      return new GameLevel({ tag: GameSetter.tag, callback: callback, objects: gameObjects.getGameObjects(), passive: passive });
    }

    // Start Game
    GameLevelSetup(GameSetterStart, this.path, this.homeScreenCallback, true);
    // Game Levels added to the Game ...
    GameLevelSetup(GameSetterHills, this.path, this.playerOffScreenCallBack);
    GameLevelSetup(GameSetterBossFight, this.path, this.playerOffScreenCallBack);
    // End Game
    GameLevelSetup(GameSetterEnd, this.path, this.gameOverCallBack, true);
    
    const savedLevelIndex = localStorage.getItem('currentLevelIndex');
    if (savedLevelIndex !== null) {
        GameEnv.currentLevel = GameEnv.levels[parseInt(savedLevelIndex)];
        GameControl.transitionToLevel(GameEnv.levels[savedLevelIndex]);
        console.log("Restored level index from localStorage:", savedLevelIndex);
    } else {
        console.log("No saved level index found in localStorage. Starting from the beginning.");
        GameEnv.currentLevel = GameEnv.levels[1];
        GameControl.transitionToLevel(GameEnv.levels[1]);
    }

    // Load the GameControl.lastLocalStorageTime value
    const savedTime = localStorage.getItem(GameControl.lastLocalStorageTime);

    // Set game time to saved local time or 0 if not set
    // Note: local storage key values are stored as strings, so have to convert to int
    GameEnv.time = savedTime ? parseInt(savedTime, 10) : 0;
  }
}
// Bind the methods to the GameSetup object, ensures "this" inside of methods binds to "GameSetup"
// * * this avoids "Temporal Dead Zone (TDZ)" error... 
// * * * * "Cannot access 'GameSetup' before initialization", light reading TDZ (ha ha)...
// * * * * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let#Temporal_Dead_Zone
GameSetup.startGameCallback = GameSetup.startGameCallback.bind(GameSetup);
GameSetup.gameOverCallBack = GameSetup.gameOverCallBack.bind(GameSetup);

export default GameSetup;