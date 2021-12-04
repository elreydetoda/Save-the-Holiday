import kaboom from "kaboom";

// initialize context
kaboom({background: [0, 0, 0]});

// load assets
loadSprite("santa", "sprites/santa.png");
loadSprite("mystery-box", "sprites/mystery-box.png");
loadSprite("mystery-box2", "sprites/mystery-box2.png");
loadSprite("background-tile", "sprites/background-tile.png");
loadSprite("block-4", "sprites/block-4.png");
loadSprite("block-2", "sprites/block-2.png");
loadSprite("block-5", "sprites/block-5.png");
loadSprite("block-3", "sprites/block-3.png");
loadSprite("present2", "sprites/present2.png");
loadSprite("present", "sprites/present.png");
loadSprite("lighting_yellow", "sprites/lighting_yellow.png");
loadSprite("explosion", "sprites/explosion.png");
loadSprite("candy-cane2", "sprites/candy-cane2.png");
loadSprite("candy-cane", "sprites/candy-cane.png");
loadSprite("bunny-enemy", "sprites/bunny-enemy.png");
loadSprite("brown-block", "sprites/brown-block.png");
loadSprite("wingMan1", "sprites/wingMan1.png");
loadSprite("unboxed", "sprites/unboxed.png");
loadSprite("tree", "sprites/tree.png");
loadSprite("sharp-spike1", "sprites/sharp-spike1.png");
loadSprite("lamp-post", "sprites/lamp-post.png");
loadSprite("arrowRight", "sprites/arrowRight.png");
loadSprite("arrowLeft", "sprites/arrowLeft.png");
loadSprite("buttonStart", "sprites/buttonStart.png");
loadSprite("arrowUp", "sprites/arrowUp.png");
loadPedit("magic", "sprites/magic.pedit");
loadSprite("lightning-blue", "sprites/lightning-blue.png");

/* --------------- SCENES -----------------*/
// win scene

// lose scene  
scene('lose', () => {
  add([
  text('Game Over'), //args.score
  origin('center'),
  pos(width()/2, height()/2),
  scale(1)
  ])
})

// add layers
layer(['obj', 'ui'], 'obj')

// constants
const MOVE_SPEED = 200
const JUMP_FORCE = 580
const BIG_JUMP_FORCE = 750
const MAGIC_SPEED = 400
const ENEMY_SPEED = 50
const FALL_DEATH = 600

// variables
let CURRENT_JUMP_FORCE = JUMP_FORCE
let isJumping = true

// map creation
const maps = [
  [
  '                                   ',
  '                                   ',
  '                                   ',
  '                                   ',
  '                                   ',
  '                                   ',
  '                     =z            ',
  '                                   ',
  '            =*=%=                  ',
  '                                   ',
  '      ==                           ',
  't                                tt',
  '                             |     ',
  '                   ^    ^          ',
  '                                   ',
  '===============================  ==',
  ], [
  '                                   ',
  '                                   ',
  '                                   ',
  '                                   ',
  '                                   ',
  '                                   ',
  '                     =z            ',
  '                                   ',
  '            =*=%=                  ',
  '                                   ',
  '      ==                           ',
  't                                tt',
  '                             |     ',
  '                   ^    ^          ',
  '                                   ',
  '===============================  ==',
  ],
  ]

const levelCfg = {
  width: 20,
  height: 20,
  '=': () => [sprite('block-4'), 'ground', solid(), scale(0.35), area()],
  '$': () => [sprite('present'), 'green-present', 'gift', solid(), scale(0.9), area()],
  'j': () => [sprite('candy-cane2'), 'candy-cane','gift', solid(), scale(0.35), area()],
  'l': () => [sprite('lightning-blue'), 'lightning-blue', 'gift', solid(), scale(0.2), area()],
  '%': () => [sprite('mystery-box2'), 'present-surprise','surprise-box', solid(), scale(0.35), area()],
  '*': () => [sprite('mystery-box2'), 'candy-cane-surprise','surprise-box', solid(), scale(0.35), area()],
  'z': () => [sprite('mystery-box2'), 'lightning-surprise','surprise-box', solid(), scale(0.35), area()],
  '}': () => [sprite('unboxed'), solid(), scale(0.35), area()],
  '|': () => [sprite('lamp-post'),'post', area(), solid()],
  '^': () => [sprite('bunny-enemy'), 'b-enemy', solid(), scale(0.2), area()],
  '#': () => [sprite('block-4'), 'ground', scale(0.35), area()],
  '-': () => [sprite('block-2'), 'ground', scale(0.35), area()],
  '_': () => [sprite('block-3'), 'ground', scale(0.35), area()],
  'x': () => [sprite('block-5'), 'ground', scale(0.35), area()],
  't': () => [sprite('tree'), 'ground', scale(0.45), area()],
}

const gameLevel = addLevel(maps[0], levelCfg)

// TO-DO: add a score
const score = add[(
  text('0'),
  pos(30,6),
  layer('ui'),
  {
    value: 0,  
  }
)]

// add level numbers
add([text('level ' + '0'), pos(40,6), scale(0.3)])

// add player
const player = add([sprite('santa'), pos(30,0), area(), body(), big(), scale(.65)])

// add camera movement
player.action(() => {
  camPos(player.pos)
  if(player.pos.y >= FALL_DEATH) {
    go('lose') //, score:scoreLabel.value)
  }
})


// keystroke events
keyDown('left', () => {
  player.move(-MOVE_SPEED, 0)
})

keyDown('right', () => {
  player.move(MOVE_SPEED, 0)
})

player.action(() => {
  if (player.grounded()) {
    isJumping = false
  }
})

keyPress('space', () => {
  if(player.grounded())
    isJumping = true
  player.jump(CURRENT_JUMP_FORCE)
})

keyDown('up', () => {
  spawnMagic(player.pos.add(0, -35))
})

//TO-DO: use magic image if possible
// add magic casting
function spawnMagic(p) {
  add([
    rect(3,3),
    pos(p),
    origin('center'),
    area(),
    color(44, 171, 77),
    'magic'
  ])
}

// add magic motion
onUpdate('magic', (m) => {
  m.move(0, -MAGIC_SPEED)
  if (m.pos.y < 0){
    destroy(m)
  }
})

onUpdate('b-enemy', (b) => {
  b.move(-ENEMY_SPEED, 0)
})

// make santa grow 
function big() {
  let timer = 0
  let isBig = false
  return {
    update() {
      if (isBig) {
        timer -=dt()
        if (timer <= 0) {
          this.smallify()
        }
      }
    },
    isBig() {
      return isBig
    },
    smallify() {
      this.scale = vec2(.65)
      timer = 0
      isBig = false
      CURRENT_JUMP_FORCE = JUMP_FORCE
    },
    biggify(time) {
      this.scale = vec2(1)
      timer = time
      isBig = true
            CURRENT_JUMP_FORCE = BIG_JUMP_FORCE
    }
  }
}

/* --------------- COLLISIONS -----------------*/

// -- magic collides with surprise boxes -- 
// green present
onCollide('magic', 'present-surprise', (m, p) => {
  gameLevel.spawn('$', p.gridPos.sub(1,2))
  gameLevel.spawn('=', p.gridPos.sub(0,0))
  destroy(m)
})

// candy cane
onCollide('magic', 'candy-cane-surprise', (m, c) => {
  gameLevel.spawn('j', c.gridPos.sub(0,1))
  gameLevel.spawn('=', c.gridPos.sub(0,0))
  destroy(m)
})

// blue lightning
onCollide('magic', 'lightning-surprise', (m, l) => {
  gameLevel.spawn('l', l.gridPos.sub(0,1.5))
  gameLevel.spawn('=', l.gridPos.sub(0,0))
  destroy(m)
})

// -- player collides with objects --
// blue lightning
player.onCollide('lightning-blue', (b) => {
  player.biggify(7)
  destroy(b)
})

// green present
player.onCollide('green-present', (g) => {
  destroy(g)
  // score.value++
  // score.text = score.value
  // console.log(score)
})

// candy cane
player.onCollide('candy-cane', (c) => {
  destroy(c)
  // score.value++
  // score.text = score.value
  // console.log(score)
})

// bunny enemies
player.onCollide('b-enemy', (b) => {
  if (isJumping) {
    destroy(b)
  } else {
    go('lose') //, score:scoreLabel.value)
  }
})

// lamp post 
player.onCollide('post', (p) => {
  // go('game', {
  //   level: (level + 1)
  //   // score: score.value
  // })
})