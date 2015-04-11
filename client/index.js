'use strict';
var current = 'ruby';
var $selected;
var enemy = 'red';

$(document).ready(init);

function init(){
  initBoard();
  switchBoard();

  // only allow active clas to be clicked
  $('#board').on('click', '.active', select);
  $('#board').on('click', '.empty', drop);
}

function select(){
  $selected = $(this);
  $('.valid').removeClass('selected');
  $selected.addClass('selected');
}

function drop(){

  if (!$selected) {
    return;
  }

  var $target = $(this);
  // bool to check if selected is king
  var isKing = $selected.is('.king');

  var src = {};
  var tgt = {};

  src.x = $selected.data('x') * 1;
  src.y = $selected.data('y') * 1;
  tgt.x = $target.data('x') * 1;
  tgt.y = $target.data('y') * 1;

  // directional commands
  var compass = {};
  compass.north = (current === 'js') ? -1 : 1;
  compass.east = (current === 'js') ? 1 : 1;
  compass.west = compass.east * -1;
  compass.south = compass.north * -1;

  switch(moveType(src, tgt, compass, isKing)){
    case 'move':
      console.log('move');
      switchBoard();
      movePiece($selected, $target);
      break;
    case 'jump':
      console.log('jump');
      switchBoard();
      var trackColor = $selected.css('background-color');
      movePiece($selected, $target);
      $selected.addClass('empty black')
      $target.css('background-color', trackColor).addClass('player inactive');
  }
}

function movePiece($selected, $target){
  var targetClasses = $target.attr('class');
  var selectedClasses = $selected.attr('class');

  $target.attr('class', selectedClasses);
  $selected.attr('class', targetClasses);
}

function moveType(src, tgt, compass, isKing){

  if (isJump(src, tgt, compass, isKing) && isEnemy(src, tgt, compass, isKing)){
    return 'jump';
  }

  if (isMove(src, tgt, compass, isKing)){
    return 'move';
  }
}

function initBoard(){
  $('#board tr:lt(3) .valid').addClass('ruby player');
  $('#board tr:gt(4) .valid').addClass('js player');
  $('td.valid:not(.player)').addClass('empty black');
}

function isMove(src, tgt, compass, isKing){
  // if tgt is left o right, north or south, is a king and  can go south
  return (src.x + compass.east === tgt.x || src.x + compass.west === tgt.x) && (src.y + compass.north === tgt.y) || (src.y + compass.south === tgt.y) || (isKing && src.y + compass.south === tgt.y);
}

function isJump(src, tgt, compass, isKing){

  var checkEast = compass.east * 2
  var checkWest = compass.west * 2
  var checkNorth = compass.north * 2
  var compassSouth = compass.south * 2

  // fix
  return (src.x + checkEast === tgt.x || src.x + checkWest === tgt.x) && (src.y + checkNorth === tgt.y) || (src.y + compassSouth === tgt.y) || (isKing && src.y + compassSouth === tgt.y);
}

function isEnemy(src, tgt, compass, isKing){

  enemy = (current === 'ruby') ? 'ruby' : 'js';
  $('.valid').removeClass('enemy');
  $('.' + current).addClass('enemy');

  var checkX = ((src.x + tgt.x) / 2);
  checkX = checkX.toString();
  var checkY = ((src.y + tgt.y) / 2).toString();
  checkY = checkY.toString();
  var $middle = $('td[data-x=' + checkX + '][data-y='+ checkY +']');
  console.log($middle[0]);
  $middle = $middle[0];


  if ($($middle).hasClass('player')){
    console.log('current test');
    $($middle).removeClass().addClass('empty black').css('background-color', 'black');
    return true;
  }
  return false;
}

function switchBoard(){
  current = (current === 'js') ? 'ruby' : 'js';
  $('.valid').removeClass('active selected').addClass('inactive');
  $('.' + current).addClass('active');
}
