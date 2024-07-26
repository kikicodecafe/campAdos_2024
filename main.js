
function preload() {
    // Chargement de la police de caractères
	font = loadFont('assets/fonts/PixelOperator8.ttf');

    // Chargement des images des sprites
    playerSheet = loadImage('assets/sprites/knight.png');
    worldSheet = loadImage('assets/sprites/world_tileset.png');
    slimeSheet = loadImage('assets/sprites/slime_purple.png');
	fruitSheet = loadImage('assets/sprites/fruit.png');
    coinSheet = loadImage('assets/sprites/coin.png');
    // swordSheet = loadImage('assets/sprites/excalibur_.png');

}

function setup() {
	new Canvas(innerWidth / 4, innerHeight / 4, 'pixelated x4');
    allSprites.pixelPerfect = true;
    world.gravity.y = GRAVITY_Y;

    
    // blockObject fait référence à tous les objets de type plateforme
    blockObject = new Group();
    blockObject.collider = 'static';
    blockObject.friction = 0.8;
    blockObject.bounciness = 0.1;
    blockObject.spriteSheet = worldSheet;

    // backgroundObject fait référence à tous les object du décors
    backgroundObject = new Group();
    backgroundObject.collider = 'none';
    backgroundObject.spriteSheet = worldSheet;

    {
        grass = new blockObject.Group();
        grass.addAni({ w: 16, h: 16, row: 0, col: 0 });
        grass.tile = 'g';

        dirt = new blockObject.Group();
        dirt.drag = 0;
        dirt.addAni({ w: 16, h: 16, row: 1, col: 0 });
        dirt.tile = 'd';

        rocks = new blockObject.Group();
        rocks.width = 12;
        rocks.height = 12;
        rocks.debug = true;
        rocks.drag = 0;
        rocks.addAni({ w: 16, h: 16, row: 0, col: 1 });
        rocks.tile = 'r';
    }
    

    // Création des groupes pour le pont
    {
        bridge = new blockObject.Group();
        bridge.bounciness = 0.5;
        // bridge.debug = true

        leftBridge = new bridge.Group();
        leftBridge.addAni({ w: 16, h: 16, row: 0, col: 9 });
        leftBridge.tile = '<'

        middleBridge =  new bridge.Group();
        middleBridge.addAni({ w: 16, h: 16, row: 0, col: 10 });
        middleBridge.bounciness = 1.10;
        middleBridge.tile = '_'
        
        rightBridge =  new bridge.Group();
        rightBridge.addAni({ w: 16, h: 16, row: 0, col: 11 });
        rightBridge.tile = '>'
    }
    ladder = new backgroundObject.Group();
    ladder.collider = 'none';
    ladder.addAni({ w: 16, h: 16, row: 4, col: 7 });
    ladder.offset.y = 0;
    ladder.height = 12;
    ladder.tile = 'H';

    
    coins = new Group();
    coins.collider = 'none';
    coins.bounciness = 0.1;
    coins.friction = 0.1;
    coins.drag = 0;
    coins.spriteSheet = coinSheet;
    coins.addAni({ w: 16, h: 16, row: 0, frames: 12 });
    coins.tile = 'c';

    fruits = new Group();
    fruits.collider = 'none';
    fruits.bounciness = 0.1;
    fruits.friction = 0.1;
    fruits.drag = 0;
    fruits.spriteSheet = fruitSheet;
    fruits.addAni({ w: 16, h: 16, row: 3, col: 1 });
    fruits.tile = 'F';

    flower = new backgroundObject.Group();
    flower.addAni({ w: 16, h: 16, row: 6, col: 1 });
    flower.tile = 'f';

    flower2 = new backgroundObject.Group();
    flower2.addAni({ w: 16, h: 16, row: 5, col: 1 });
    flower2.tile = 'l';

    flower3 = new backgroundObject.Group();
    flower3.addAni({ w: 16, h: 16, row: 3, col: 1 });
    flower3.tile = 's';

    portal = new backgroundObject.Group();
    portal.addAni({ w: 16, h: 16, row: 8, col: 1 });
    portal.tile = 'P';

    sign = new backgroundObject.Group();
    sign.addAni({ w: 16, h: 16, row: 3, col: 8 });
    sign.tile = 'S';
    sign.message = 'Take the purple bottle to win';

    sign2 = new backgroundObject.Group();
    sign2.addAni({ w: 16, h: 16, row: 3, col: 8 });
    sign2.tile = '9';
    sign2.message = 'Press the down arrow to roll mid-air';


    tiles = new Tiles(map1, 30, 100, 16, 16);
    
    player = new Sprite(canvas.hw, -100);
    // hitbox
	player.width = 10;
	player.height = 14;

	// center the texture...
	player.anis.offset.y = -3;
    player.spriteSheet = playerSheet;
    player.addAnis({
        stand: { w: 32, h: 32, row: 0, frames: 4, frameDelay: 8},
        run: { w: 32, h: 32, row: 2, frames: 16},
        roll: { w: 32, h: 32, row: 5, frames: 8, frameDelay: 4},
        hurt: { w: 32, h: 32, row: 6, frames: 4, frameDelay: 8},
        dead: { w: 32, h: 32, row: 7, frames: 4, frameDelay: 16},
        death: { w: 32, h: 32, row: 7, col: 3}
    });
    player.changeAni('stand');
    player.rotationLock = true;
    player.jumpTimer = 0;
    // player.debug = true;
    // attribut personnalisé
    player.score = 0;
    player.lives = 3;
    player.isDead = false;
    player.gameOverPassedOnce = false;

    ennemy = new Group();
    
    slimePurple = new ennemy.Group();
    slimePurple.spriteSheet = slimeSheet;
    //slimePurple.rotationLock = true;
    slimePurple.anis.offset.y = -4;
    slimePurple.addAnis({
        spawn: { w: 24, h: 24, row: 0, frames: 4, frameDelay: 20},
        stands: { w: 24, h: 24, row: 1, frames: 4, frameDelay: 6},
        hurt: { w: 24, h: 24, row:2, frames: 4, frameDelay: 9}
    });
    slimePurple.health = 5;
    //slimePurple.debug = true;
    slimePurple.moveTowards(player.x, undefined, 0.01);
    for (let i = 0; i < 5; ++i) {
        delay(5000 + i * 10000).then(async () => {
            let sprite;
            do {
                sprite = findRandomBlockToSpawnOnto(grass);
            } while(!sprite);
            let slime = new slimePurple.Sprite(sprite.x, sprite.y - 16, 16, 16);
            slime.rotationLock = true;
            await slime.changeAni(['spawn', 'stands']);
            
        })
    }
    // Player take damage if touching enemy
    player.collides(slimePurple, purpleSlimeAttack);
}

async function draw() {
    background('skyblue')
    
    // different draw call for death screen
	if (player.dead) {
		gameOver();
		return;
	}

    camera.x = player.x;
    camera.y = player.y;

    if (kb.pressing('right')) {
        player.mirror.x = false;
        player.vel.x = PLAYER_SPEED;
        player.changeAni('run');
    } else if (kb.pressing('left')) {
        player.mirror.x = true;
        player.vel.x = -PLAYER_SPEED;
        player.changeAni('run');
    } else {
        if (player.ani.name !== 'roll' && 
            player.ani.name !== 'hurt' && 
            player.ani.name !== 'dead') {
                player.changeAni('stand');
            }
    }

    if (kb.presses('space') && player.colliding(tiles)) {
        player.vel.y = PLAYER_SPEED_JUMP;
        player.jumpTimer = 0;
        player.jumpTimer++; // jumpTimer = jumpTimer + 1;
    } else if (kb.presses('space') && player.jumpTimer === 1) {
        player.jumpTimer = 0;
        player.vel.y = PLAYER_SPEED_JUMP;
    }

    for (let slime of slimePurple) {
        if (slime.ani.name === 'spawn') continue;
        let distance = dist(player.x, 0, slime.x, 0);
        if (distance >= 40) slime.moveTowards(player.x, undefined, 0.005);
        else slime.moveTowards(player.x, undefined, 0.01);
        if (player.x < slime.x) {
            slime.mirror.x = true
        } else {
            slime.mirror.x = false
        }
    }
    // Player roll mechanic
	if (kb.pressed('down')) {

		// Apply vel in current direction
		if (player.mirror.x == true) {
			player.vel.x = -5;
		} else {
			player.vel.x = 5;
		}

		await player.changeAni('roll');
		player.changeAni('stand');
	}

	// Player Ladder climb mechanic
	if (player.overlapping(ladder) && kb.pressing('up')) {
		player.move(1, 'up', 1);
	}

	// Player Shoot projectiles
	if (kb.pressed('e')) {
		let proj = new Sprite();

		proj.d = 3;
		proj.color = color(255, 78, 0);

		//					Offset to avoid colliding with player's hitbox
		proj.x = player.x + (player.mirror.x ? -10 : 10);
		proj.y = player.y;

		proj.vel.x = player.mirror.x ? -12 : 12;

		// remove proj if touches tiles (the map)
		proj.collides(tiles, async () => {
			await delay(1000);
			proj.remove()
		});

		// Enemy take damage
		proj.collides(slimePurple, async (proj, slime) => {
			slime.moveAway(player, 0.6);
			await slime.changeAni('hurt');
			slime.remove();
		});
	}

	// Player dies if falls beneath world
	if (player.y > 2000) {
		player.dead = true;
	}

    for (let coin of coins) {
        if (player.overlaps(coin)) {
            coin.remove();
            player.score++;
        }
    }
    if (player.overlaps(portal)) {
        tiles.remove();
        // on change la position du joueur
        tiles = new Tiles(map2, 0, 0, 16, 16);
    }
    // HUD
	textFont(font);
	textSize(8);

    // Sign HUD tooltip 1
	if (player.overlapping(sign)) {
		push()
		textAlign(CENTER);
		text(sign.message, canvas.hw, canvas.hh - 16);
		pop()
	}

	// Sign HUD tooltip 2
	if (player.overlapping(sign2)) {
		push()
		textAlign(CENTER)
		text(sign2.message, canvas.hw + 32, canvas.hh - 16);
		pop()
	}

    text('Score: ' + player.score, 10, 10);
	text('Vies: ' + player.lives, 10, 20);
}

function gameOver() {

	// Black screen
	background(33);

	// Remove sprites
	ennemy.remove();
	tiles.remove();

	// Reset values
	player.score = 0;
	player.lives = 0;
	player.vel.x = 0;
	player.vel.y = 0;
	player.x = canvas.hw - 16;
	player.y = canvas.hh - 6;
	camera.x = canvas.hw;
	camera.y = canvas.hh;
	world.gravity.y = 0;

	// Render HUD
	fill(255)
	text('GAME OVER', canvas.hw, canvas.hh);
	if (player.gameOverPassedOnce) return;
	player.gameOverPassedOnce = true;

	// here we staydead when the promise has been resolved
	player.changeAni(['dead', 'death']);
}