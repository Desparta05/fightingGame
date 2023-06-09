const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite(
  {
    position: {
      x: 0,
      y: 0
    },
    imageSrc:'public/assets/Background/Reference-Image.png'
  }
);

const shop = new Sprite({
  position: {
    x: 600,
    y: 128
  },
  imageSrc: 'public/assets/shop/shop_anim.png',
  scale: 2.75,
  framesMax: 6
})

const player = new Fighter(
  {
    position: {
      x: 0, 
      y: 0
    },
    velocity: {
      x: 0,
      y: 0,
    },
    offset: {
      x: 0,
      y: 0
    },
    imageSrc: 'public/assets/PlayerSprite/Idle-Sheet.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
      x: 5,
      y: 105
    },
    sprites: {
      idle : {
        imageSrc: 'public/assets/PlayerSprite/Idle-Sheet.png',
        framesMax: 4
      },
      run: {
        imageSrc: 'public/assets/PlayerSprite/Run-sheet.png',
        framesMax: 8
      },
      jump: {
        imageSrc: 'public/assets/PlayerSprite/Jump-All-Sheet.png',
        framesMax: 6
      },
      fall: {
        imageSrc: 'public/assets/PlayerSprite/Fall-All-Sheet.png',
        framesMax: 4
      }
    }
  });

const enemy = new Fighter(
  {
    position: {
      x: 400, 
      y: 0
    },
    velocity: {
      x: 0,
      y: 0,
    },
    color: 'blue',
    offset: {
      x: -50,
      y: 0
    }
  }
);

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  w: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  },
  ArrowUp: {
    pressed: false
  }
}


decreaseTimer()

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  player.update();
  // enemy.update();

  player.velocity.x = 0
  enemy.velocity.x = 0
//Player Movement
  
  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -5
    player.switchSprite('run')
  }else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = 5
    player.switchSprite('run')
  } else {
    player.switchSprite('idle')
  }

  //Jumping Movement
  if (player.velocity.y < 0) {
    player.switchSprite('jump')
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall')
    console.log(player.velocity.y)
  }

//Enemy Movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -3
  }else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = 3
  }

//Collision detection
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy
    })
      && player.isAttacking) {
        player.isAttacking = false
        enemy.health -= 20
        document.querySelector('#enemyFrontHealth').style.width = enemy.health + '%'
  }
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player
    })
      && enemy.isAttacking) {
        enemy.isAttacking = false
        player.health -= 20
        document.querySelector('#playerFrontHealth').style.width = player.health + '%'
  }

  //End game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    winnerIs({player, enemy, timerId})
  } 
  
}

animate();


window.addEventListener('keydown', (event) =>{ 
  //Player buttons
  switch (event.key) {
    case 'd':
      keys.d.pressed = true
      player.lastKey = 'd'
      break
    case 'a':
      keys.a.pressed = true
      player.lastKey = 'a'
      break
    case 'w':
      player.velocity.y = -20
      break
    case ' ':
      player.attack()
      break
//Enemy buttons
    case 'ArrowRight':
      keys.ArrowRight.pressed = true
      enemy.lastKey = 'ArrowRight'
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true
      enemy.lastKey = 'ArrowLeft'
      break
    case 'ArrowUp':
      enemy.velocity.y = -10
      break
    case 'ArrowDown':
      enemy.isAttacking = true
      break
  }
})

window.addEventListener('keyup', (event) =>{
//Player buttons
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
    case 'w':
      keys.w.pressed = false
      break
//Enemy buttons
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break
    case 'ArrowUp':
      keys.ArrowUp.pressed = false
      break
    case 'ArrowDown':
      enemy.isAttacking = false
      break
  }
  console.log(event.key)
})
//End Character Movement