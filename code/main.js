import kaboom from "kaboom";

// initialize context
kaboom(
  {
    width: 800,
    height: 500,
    background: [ 179, 209, 249, ]
  }
);

let args = {}
// constants
const MOVE_SPEED = 200
const JUMP_FORCE = 580
const BIG_JUMP_FORCE = 850
const MAGIC_SPEED = 400
const ENEMY_SPEED = 40
const FALL_DEATH = 600
let LEVEL_INDEX = args.level ?? 0 
let SCORE_GLOBAL = args.score ?? 0


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
loadSprite("environment", "sprites/environment.png");
loadSprite("play-button", "sprites/play-button.png");
loadSprite("instructions", "sprites/instructions.png");



/* --------------- SCENES -----------------*/
// TO-DO: win scene

  // add layers
  layers(['bg','obj', 'ui'], 'obj')

  // map creation
  const maps = [
    [
    '                                       ',
    '                                       ',
    '                                       ',
    '                                       ',
    '                                       ',
    '                                       ',
    '                     =z                ',
    '                                       ',
    '            =*=%=                      ',
    '                                       ',
    '      ==                               ',
    't                           tt         ',
    '                                      |',
    '                   ^    ^              ',
    '                                       ',
    '===============================  ======',
    ], [
    '                                       ',
    '                                       ',
    '                                       ',
    '                                       ',
    '                          =%           ',
    '                                       ',
    '                                       ',
    '                                       ',
    '            _*_z_                      ',
    '                                       ',
    '       __                              ',
    'f                           tt         ',
    '                                  |    ',
    '                   ^    ^              ',
    '                                       ',
    '_______________________________  ______',
    ],
    ]

  const levelCfg = {
    width: 20,
    height: 20,
    '=': () => [sprite('block-4'), 'ground', 'block', solid(), scale(0.35), area()],
    '$': () => [sprite('present'), 'green-present', 'gift', solid(), scale(0.9), area()],
    'j': () => [sprite('candy-cane2'), 'candy-cane','gift', solid(), scale(0.35), area()],
    'l': () => [sprite('lightning-blue'), 'lightning-blue', 'gift', solid(), scale(0.2), area()],
    '%': () => [sprite('mystery-box2'), 'present-surprise','surprise-box', solid(), scale(0.35), area()],
    '*': () => [sprite('mystery-box2'), 'candy-cane-surprise','surprise-box', solid(), scale(0.35), area()],
    'z': () => [sprite('mystery-box2'), 'lightning-surprise','surprise-box', solid(), scale(0.35), area()],
    '\}': () => [sprite('unboxed'), solid(), scale(0.35), area()],
    '|': () => [sprite('lamp-post'),'post', area(), solid()],
    '^': () => [sprite('bunny-enemy'), 'b-enemy', solid(), scale(0.2), area()],
    '-': () => [sprite('block-2'), 'ground', solid(), scale(0.35), area()],
    '_': () => [sprite('block-3'), 'ground', solid(), scale(0.35), area()],
    'x': () => [sprite('block-5'), 'ground', solid(), scale(0.35), area()],
    't': () => [sprite('tree'), 'right-tree', solid(), scale(0.45), area()],
    'f': () => [sprite('tree'), 'left-tree', solid(), scale(0.45), area()],
  }

// menu scene
scene('menu', () => {
  // add background image (TO-DO: replace w/ instructions)
  add([
    sprite('instructions'),
    layer('bg'),
    origin('center'),
    pos(width()/2, height()/2),
    scale(1)
  ])

  // add play button 
  const playButton = add([
    sprite('play-button'),
    layer('bg'),
    origin('center'),
    pos(658, 410),
    scale(.15),
    area(),
    'play'
  ])

  // playButton.onMouseDown('left', () => {
  //   go('game')
  // })

})

// game scene
scene('game', () => {


  // add layers
  layer(['obj', 'ui'], 'obj')

  // variables
  let CURRENT_JUMP_FORCE = JUMP_FORCE
  let CURRENT_E_SPEED = -ENEMY_SPEED
  let isJumping = true

  // add background
  add([
    sprite('environment'),
    layer('bg'),
    origin('topleft'),
    scale(width()/240, height()/240),
    // scale(1)
  ])

  const gameLevel = addLevel(maps[LEVEL_INDEX], levelCfg)

  // add a score
  const score = add([
    text(SCORE_GLOBAL),
    pos(20,6),
    layer('ui'),
    {
      value: SCORE_GLOBAL,  
    }, 
    scale(.3),
    fixed()
  ])

  // add level numbers
  const level = add([
    text('level ' + parseInt(LEVEL_INDEX)), 
    pos(50,6), 
    {
      value: LEVEL_INDEX,
    },
    scale(0.3),
    fixed()
  ])

  // add player
  const player = add([sprite('santa'), pos(50,0), area(), body(), big(), scale(.65)])

  // add camera movement
  player.onUpdate(() => {
    camPos(player.pos)
    if(player.pos.y >= FALL_DEATH) {
      go('lose', {
        score: SCORE_GLOBAL
      })
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

  // add bunny enemy motion
  onUpdate('b-enemy', (b) => {
    b.move(CURRENT_E_SPEED, 0)
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

  // -- magic collides with boxes -- 
  // surprise box - green present 
  onCollide('magic', 'present-surprise', (m, p) => {
    gameLevel.spawn('$', p.gridPos.sub(1,2))
    gameLevel.spawn('=', p.gridPos.sub(0,0))
    destroy(m)
  })

  // surprise box - candy cane
  onCollide('magic', 'candy-cane-surprise', (m, c) => {
    gameLevel.spawn('j', c.gridPos.sub(0,1))
    gameLevel.spawn('=', c.gridPos.sub(0,0))
    destroy(m)
  })

  // surprise box - blue lightning
  onCollide('magic', 'lightning-surprise', (m, l) => {
    gameLevel.spawn('l', l.gridPos.sub(0,1.5))
    gameLevel.spawn('=', l.gridPos.sub(0,0))
    destroy(m)
  })
    
  // regular block
  onCollide('magic', 'block', (m, b) => {
    destroy(m)
  })

  // -- enemies collide with objects --
  // // left tree
  // onCollide('b-enemy', 'left-tree', () => {
  //   CURRENT_E_SPEED = ENEMY_SPEED
  //   every('b-enemy', (b) => {
  //     b.move(CURRENT_E_SPEED,  0)
  //   })
  // })
  
  // // right tree
  // onCollide('b-enemy', 'right-tree', (b, r) => {
  //   CURRENT_E_SPEED = -ENEMY_SPEED
  //   every('b-enemy', (b) => {
  //     b.move(CURRENT_E_SPEED,  0)
  //   })
  // })

  // -- player collides with objects --
  // blue lightning
  player.onCollide('lightning-blue', (b) => {
    player.biggify(7)
    destroy(b)
  })

  // green present
  player.onCollide('green-present', (g) => {
    destroy(g)
    SCORE_GLOBAL++
    score.text = SCORE_GLOBAL
    console.log(score)
  })

  // candy cane
  player.onCollide('candy-cane', (c) => {
    destroy(c)
    SCORE_GLOBAL++
    score.text = SCORE_GLOBAL
    console.log(score)
  })

  // bunny enemies
  player.onCollide('b-enemy', (b) => {
    if (isJumping) {
      destroy(b)
    } else {
      go('lose', {
        level: (LEVEL_INDEX),
        score: SCORE_GLOBAL
      })
    }
  })

  // lamp post 
  player.onCollide('post', (p) => {
    LEVEL_INDEX++
    console.log(level.value)
    // TO-DO: condition for last level
    go('game', {
      level: level.value,
      score: SCORE_GLOBAL
    })
  })

})

// lose scene  
scene('lose', () => {
  add([
  text('Game Over' + '\n' + SCORE_GLOBAL), 
  origin('center'),
  pos(width()/2, height()/2),
  scale(1)
  ])
})

go('menu')