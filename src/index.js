const { combineReducers, createStore } = require('redux');

//Util methods
const createPattern = (level) => {
  
  const values = [0,1,2,3,4,5,6,7,8];
  let returnPattern = [];
  let prevIndex = -1;
  
  while(returnPattern.length < level) {
    
    let newIndex = Math.floor(Math.random() * values.length);
    
    if(prevIndex === -1){
      prevIndex = newIndex;
    }else{
      while(prevIndex === newIndex) {
         newIndex = Math.floor(Math.random() * values.length);
      }
      prevIndex = newIndex;
    }
    
    returnPattern.push(values[newIndex]);
  }
  
  return returnPattern;
};

//Actions
const UPDATE_CURRENT_PATTERN  = 'UPDATE_CURRENT_PATTERN';
const UPDATE_PAST_PATTERNS    = 'UPDATE_PAST_PATTERNS';
const UPDATE_LEVEL            = 'UPDATE_LEVEL';
const UPDATE_USER_INDEX       = 'UPDATE_USER_INDEX';
const UPDATE_USER_TURN        = 'UPDATE_USER_TURN';

const updateCurrentPattern = (level) => {
  return {
    pattern: createPattern(level),
    type: UPDATE_CURRENT_PATTERN
  }
};
const updateLevel = (newLevel) => {
  return {
    type: UPDATE_LEVEL,
    level: newLevel
  }
};
const updateUserIndex = (userIndex) => {
  return {
    type: UPDATE_USER_INDEX,
    userIndex: userIndex
  }
};
const updateUserTurn = (userTurn) => {
  return {
    type: UPDATE_USER_TURN,
    userTurn: userTurn
  }
};

function userIndex(state = 0, action) {
  switch(action.type) {
        case UPDATE_USER_INDEX:
            return action.userIndex;
        default:
            return state;
  }
}
function userTurn(state = false, action) {
  switch(action.type) {
        case UPDATE_USER_TURN:
            return action.userTurn;
        default:
            return state;
  }
}
function currentPattern(state = createPattern(1),  action) {
  switch(action.type) {
        case UPDATE_CURRENT_PATTERN:
            return action.pattern;
        default:
            return state;
  }
}  
function level(state = 1,  action) {
  switch(action.type) {
        case UPDATE_LEVEL:
            return action.level;
        default:
            return state;
  }
}  

const reducer = combineReducers({
  currentPattern,
  level,
  userIndex,
  userTurn
});

const store = createStore(reducer);

const showPattern = () => {
  
  const state         = store.getState();
  const level         = state.level;
  let currentPattern  = state.currentPattern;
  let prevEl;
  let time = 1500;
  store.dispatch(updateUserTurn(false));
  
  currentPattern.forEach(function(val, index) {
      
      time += 1000;
      setTimeout(function() {
        const id = 'spot-' + val;
        let curEl = document.getElementById(id);
        curEl.classList.toggle('show');  
        if(prevEl === undefined) {
          prevEl = curEl.id; 
        }else {
          prevEl = curEl.id;
        }
      }, time);  
    
      setTimeout(function(){
        const id = 'spot-' + val;
        let curEl = document.getElementById(id);
        curEl.classList.toggle('show');
        
        if(index === (currentPattern.length - 1)) {
          console.log('setting user turn now');
          store.dispatch(updateUserTurn(true));
        }
      },time+500);
    
  });
};

const setupBoard = () => {
  
  document.getElementById('resetBtn').addEventListener('click', function(){
    reset();
  });

  const spots = Array.prototype.slice.call(document.querySelectorAll('.spot'));
  
  spots.forEach(function(el, index) {
    const id = el.id.split('-')[1];
   
    el.addEventListener('mouseout', function(e) {
      if(el.classList.contains('clicked')){
        el.classList.remove('clicked');
      }
    });
    
    el.addEventListener('click', function(e) {
      el.classList.toggle('clicked');
      const state = store.getState();
      const currentPatternValue = store.getState().currentPattern[store.getState().userIndex].toString();
    console.log('clicked: ' + id + ' expected ' + currentPatternValue);
      //console.log('state on click: ');
      //console.log({ state });
      if(state.userTurn) {
        const state = store.getState();
        
        const {currentPattern, userIndex, level } = state;
        const currentPatternValue = currentPattern[userIndex].toString();

        if(currentPatternValue.trim() === id.trim()) {
          
          //console.log('right pick');       
          if(state.userIndex === state.currentPattern.length -1 ) {
            //console.log('you win round');
            swal("You won!", "Get ready for round " + (level + 1), "success");
            //increment level
            store.dispatch(updateLevel(level + 1));
            
            //make new pattern
            store.dispatch(updateCurrentPattern(store.getState().level));
            
            //reset user index to 0
            store.dispatch(updateUserIndex(0));
            //console.log('new state: ');
            console.log(store.getState());
            
            //show pattern
            setTimeout(function(){
              showPattern();  
            }, 2000);
          }else {
            //update user index
            store.dispatch(updateUserIndex(userIndex + 1));
          }
          
          
        }else {
          swal({
            title: "You lost :(",
            text: "Would you like to play again?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Restart Game",
            closeOnConfirm: true
          },
          function() {
            reset();
          });
        }
      }else {
        console.log('its not clicking time');
      }
    });
  });
};

store.getState();
setupBoard();
showPattern();

const reset = () => {
  console.log('reset everything');
  //increment level
  store.dispatch(updateLevel(1));
            
  //make new pattern
  store.dispatch(updateCurrentPattern(store.getState().level));
            
  //reset user index to 0
  store.dispatch(updateUserIndex(0));
  
  //set user turn to false
  store.dispatch(updateUserTurn(false));
  
  showPattern();
};