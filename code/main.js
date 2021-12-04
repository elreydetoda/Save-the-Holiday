import kaboom from "kaboom";

// initialize context
kaboom();

// load assets
loadSprite("santa", "sprites/santa.png");

// map creation
const map = [
'                                    ',
'                                    ',
'                                    ',
'                                    ',
'                                    ',
'     %      =*=%=                   ',
'                                    ',
'                                    ',
'                   ^    ^     |     ',
'===============================  ===',
]

const levelCfg = {
  width: 20,
  height: 20,
  '=': [sprite('block')],
  '$': [sprite('present')],
  '%': [sprite('question'), 'present-surprise'],
  '*': [sprite('question'), 'candy-cane-surprise'],
  '}': [sprite('unboxed')],
  '|': [sprite('lamp-post')],
  '^': [sprite('bunny-enemy')],
}

addLevel(map, levelCfg)