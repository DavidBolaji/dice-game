/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

// Game Controller
var gameController = (() => {

    var inPlay = true;
   
    var rand; 
    var dataObj = {
        winSc: 20,
        activePlayer: 0,
        currentScr: [0,0],
        roundScore: [0,0]
    }

    return {
        updateCurrentObj: function(){
            // Generate Random Number
            rand = Math.floor(Math.random() * 6) + 1;

             
            if(rand !== 1) {// Check if number is not one   
                // Set current Score to random number
                 dataObj.currentScr[dataObj.activePlayer] += rand;

            } else { //if no is 1
                // Set current sore to zero
                dataObj.currentScr[dataObj.activePlayer] = 0;
                //Change Active Player
                dataObj.activePlayer === 0 ? dataObj.activePlayer = 1 : dataObj.activePlayer = 0;

               
            }
            // return CurrentScore of active player
            return dataObj.currentScr[dataObj.activePlayer]

        },
        setObj: function(){ // set all values back to starting values
            dataObj.activePlayer = 0;
            dataObj.currentScr[1] = 0;
            dataObj.currentScr[0] = 0;
            dataObj.roundScore[0] = 0;
            dataObj.roundScore[1] = 0;
            inPlay = true;
            return dataObj;
        },
        updateRound: function(aP, sc){ //Update the round score
            // set roundscore of active player to the current score
            dataObj.roundScore[aP] += sc;
            // set current score of active player to zero
            dataObj.currentScr[aP] = 0;
            // return object with round score and current score
            return {
                round: dataObj.roundScore[aP],
                curr: dataObj.currentScr[aP]
            } 
        },
        activePlayer: function(){
            // return Active player
            return dataObj.activePlayer;
        }, 
        returnRand: function () {
            // return the random number
            return rand;
        },
        returnObj: function(){
            // return the whole object
            return dataObj;
        },
        setActive: function(aP) {
            // set active player
            dataObj.activePlayer = aP
            // dataObj.activePlayer === 0 ? dataObj.activePlayer = 1 : dataObj.activePlayer = 0;
        },
        getPlay: function(){
            // return value of if game is in play
            return inPlay;
        },
        setPlay: function (val) {
            // Set game play to value
            inPlay = val;
            return inPlay;
        },
        setWinSc: function(winSc){
            // set winning score
            winSc === "" ? dataObj.winSc = 100 : dataObj.winSc = winSc;
        } 
    }

})();


// UI Controller
var UIcontroller = (() => {

    var domStrings = {
        score0: 'score-0',
        score1: 'score-1',
        current0: 'current-0',
        current1: 'current-1',
        dice: '.dice',
        player0: '.player-0-panel',
        player1: '.player-1-panel',
        winSc: '.win-sc'
       
    }

    

    return {
        upateCurrent: function(aP,sc) { // update current score using active player and score
            document.querySelector(`#current-${aP}`).textContent = sc;
        },
        setWinSc : function() { // get the value of winning score from ui
           return document.querySelector(domStrings.winSc).value;
        },
        upateRound: function(aP,sc) { //update round score of active player with score 
            document.querySelector(`#score-${aP}`).textContent = sc;
        },
        setUi: function () { // initial ui default setup
            document.getElementById(domStrings.score0).textContent = 0;
            document.getElementById(domStrings.score1).textContent = 0;
            document.getElementById(domStrings.current0).textContent = 0;
            document.getElementById(domStrings.current1).textContent = 0;
            document.querySelector(domStrings.dice).style.visibility = 'hidden'
            document.querySelector(domStrings.player1).classList.remove('winner');
            document.querySelector(domStrings.player0).classList.remove('winner');
            document.querySelector(domStrings.player0).classList.remove('active');
            document.querySelector(domStrings.player1).classList.remove('active');
            document.querySelector(domStrings.player0).classList.add('active')
            document.querySelector(`#name-0`).textContent = 'PLAYER 1';
            document.querySelector(`#name-1`).textContent = 'PLAYER 2';
        },
        updateDice: function (no) { // set dice 
            document.querySelector(domStrings.dice).style.visibility = 'visible',
            document.querySelector(domStrings.dice).src = 'dice-'+ no +'.png'
        },
        updateActive: function(aP) { // set ui Active player style
            if(aP === 1) {
                document.querySelector(domStrings.player0).classList.remove('active');
                document.querySelector(domStrings.player1).classList.add('active');
            } else if( aP === 0) {
                document.querySelector(domStrings.player0).classList.add('active');
                document.querySelector(domStrings.player1).classList.remove('active');
            }
           

        },
        setWinner: function(aP) { // set Winning player
            document.querySelector(`#name-${aP}`).textContent = 'Winner';
            document.querySelector(domStrings.dice).style.visibility = 'hidden';
            
            if(aP === 1){
                 document.querySelector(domStrings.player1).classList.remove('active')
                 document.querySelector(domStrings.player1).classList.toggle('winner')
                } else { 
                 document.querySelector(domStrings.player0).classList.remove('active')
                 document.querySelector(domStrings.player0).classList.toggle('winner')
                }
            
        }
    }

    

})();



//App Controller
var controller = ((gmCtrl, uiCtrl) => {

    
    //Click event listener for roll button
    document.querySelector('.btn-roll').addEventListener('click', function(){
      if(gmCtrl.getPlay()) { // Check if game is still in play

        // Get winning score from ui
        var win = uiCtrl.setWinSc();

        // Set winning score in game play
        gmCtrl.setWinSc(win);
      
        //Get the active player
        var aP = gmCtrl.activePlayer();
       
        //Generate random number and update current score in data
        var sc = gmCtrl.updateCurrentObj();

        //get the dice value
        var dice = gmCtrl.returnRand();

        // show current score in ui
        uiCtrl.upateCurrent(aP, sc);

        // show dice in ui
        uiCtrl.updateDice(dice);

        // Check if the value of dice is onw
        if(dice === 1) {
            // change active player
            aP === 0 ? aP = 1 : aP = 0;
            // update active user in ui
            uiCtrl.updateActive(aP);
        }
         
      }
     
    });

    // Click event listener for hold button
    document.querySelector('.btn-hold').addEventListener('click', function(){
      if(gmCtrl.getPlay()) { // if game is in play

        // get the value of all data
        var obj = gmCtrl.returnObj();
        // Winning score
        var winSc = obj.winSc;
        // Active player
        var aP = obj.activePlayer;
        // Score of active player
        var sc = obj.currentScr[obj.activePlayer];

        // Update  the round score with current score of active player
        var roundUi = gmCtrl.updateRound(aP,sc)

        // update the ui round score
        uiCtrl.upateRound(aP, roundUi.round)

        // Update ui current score
        uiCtrl.upateCurrent(aP, roundUi.curr)
        // set it to round score
      
        // check if player round score equla or greater than winning score
        if(roundUi.round >= winSc) {
            // Set winning class
            uiCtrl.setWinner(aP);
            // Set game play to false
            gmCtrl.setPlay(false);
        } else {
          // change active player
          aP === 0 ? aP = 1 : aP = 0;
            gmCtrl.setActive(aP);
            // update active user in ui
            uiCtrl.updateActive(aP);
        }
      }

      

    });


    // function for start or init
    function start () {
        gmCtrl.setObj();
        uiCtrl.setUi();
    }

    // Event listener for When the new Game button is clicked
    document.querySelector('.btn-new').addEventListener('click', function(){
       start()
    })



    return {
        init: function () {
           start();
        }
    }


})(gameController,UIcontroller);

controller.init();