'use strict';
var current = 'chrome';
var $source;
var enemy = 'chrome';

$(document).ready(init);

// start button
// win animation
// reset button

function init(){
  initBoard();
  switchUser();
  winGame();

  // only allow active class to be clicked
  $('#board').on('click', '.active', select);
  $('#board').on('click', '.empty', drop);
}

function initBoard(){
  $('#board tr:lt(3) .valid').addClass('chrome player');
  $('#board tr:gt(4) .valid').addClass('firefox player');
  $('td.valid:not(.player)').addClass('empty black');
}

function switchUser(){
  current = (current === 'firefox') ? 'chrome' : 'firefox';
  $('.valid').removeClass('active source').addClass('inactive');
  $('.' + current).addClass('active');
}

function select(){
  $source = $(this);
  $('.valid').removeClass('source');
  $source.addClass('source');
}

//manipulate drop function
function drop(){
  if (!$source) {
    return;
  }

  var $target = $(this);
  var isKing = $source.is('.king');

  var src = {};
  var tgt = {};

  src.x = $source.data('x') * 1;
  src.y = $source.data('y') * 1;
  tgt.x = $target.data('x') * 1;
  tgt.y = $target.data('y') * 1;

  // directional commands
  var compass = {};
  compass.north = (current === 'firefox') ? -1 : 1;
  compass.east = (current === 'firefox') ? 1 : 1;
  compass.west = compass.east * -1;
  compass.south = compass.north * -1;

  switch(moveType(src, tgt, compass, isKing)){
    case 'move':
      switchUser();
      movePiece($source, $target);
      break;
    case 'jump':

      movePiece($source, $target);
      $source.addClass('empty black');
      $target.addClass('player');
      $source = $target;

      // dblJumpBool = true;

      src.x = $source.data('x') * 1;
      src.y = $source.data('y') * 1;

      // code to check if double jump possible
      $('td').each(function(e){
        if ($(this).data('y') === src.y + (compass.north * 2) && ($(this).data('x') === src.x + (compass.east * 2) || $(this).data('x') === src.x + (compass.west * 2))){
          $target = $(this)[0];

          if ($($target).hasClass('empty')){

            enemy = (current === 'chrome') ? 'chrome' : 'firefox';
            $('.valid').removeClass('enemy');
            $('.' + current).addClass('enemy');

            tgt.x = $($target).data('x');
            tgt.y = $($target).data('y');

            var checkX = ((src.x + tgt.x) / 2);
            var checkY = ((src.y + tgt.y) / 2);
            var $middle = $('td[data-x=' + checkX + '][data-y='+ checkY +']');
            $middle = $middle[0];

            console.log('middle' + $middle[0]);

            console.log('target', $target);



            if ($($middle).is('.inactive') && $($target).is('.empty')){
              console.log("dbl jump possible");
              switchUser();
            }

          }

        }
      })
      switchUser();
  }
}

function moveType(src, tgt, compass, isKing){

  if (isJump(src, tgt, compass, isKing) && isEnemy(src, tgt, compass, isKing)){
    return 'jump';
  }

  if (isMove(src, tgt, compass, isKing)){
    return 'move';
  }
}

function movePiece($source, $target){
  var targetClasses = $target.attr('class');
  var sourceClasses = $source.attr('class');


  $target.attr('class', sourceClasses);
  $source.attr('class', targetClasses);

  // console.log("Target X-coordinates: " + $target.data('x'))
  // console.log("Target Y-coordinates: " + $target.data('y'));

  // add king classes
  $target.data('y') === 0 ? $target.addClass('king kingfirefox') : console.log();
  $target.data('y') === 7 ? $target.addClass('king kingchrome') : console.log();

}

function isMove(src, tgt, compass, isKing){
  // if tgt is left o right, north or south, is a king and  can go south
  var moveLateral = src.x + compass.east === tgt.x || src.x + compass.west === tgt.x;
  var moveRow = src.y + compass.north === tgt.y;
  var kingMove = isKing && src.y + compass.south === tgt.y;
  return (moveLateral) && (moveRow) || (moveLateral) && (kingMove);
}

function isJump(src, tgt, compass, isKing){

  var checkEast = compass.east * 2;
  var checkWest = compass.west * 2;
  var checkNorth = compass.north * 2;
  var compassSouth = compass.south * 2;

  var jumpLateral = src.x + checkEast === tgt.x || src.x + checkWest === tgt.x;
  var jumpRow = src.y + checkNorth === tgt.y;
  var kingJump = isKing && src.y + compassSouth === tgt.y;

  return (jumpLateral) && (jumpRow) || (jumpLateral) && (kingJump);
}

function isEnemy(src, tgt, compass, isKing){

  enemy = (current === 'chrome') ? 'chrome' : 'firefox';
  $('.valid').removeClass('enemy');
  $('.' + current).addClass('enemy');

  var checkX = ((src.x + tgt.x) / 2);
  // checkX = checkX.toString();
  var checkY = ((src.y + tgt.y) / 2);
  // checkY = checkY.toString();
  var $middle = $('td[data-x=' + checkX + '][data-y='+ checkY +']');
  console.log($middle[0]);
  $middle = $middle[0];


  if ($($middle).hasClass('player')){
    $($middle).removeClass().addClass('valid empty black');
    return true;
  }
  return false;
}

function winGame(){
  if($('.firefox').length === 0){
    alert('chrome Wins');
  }
  else if($('.chrome').length === 0){
    alert('firefox Wins')
  }
}
