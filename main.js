
function preload() {
    // Chargement de la police de caractères
	font = loadFont('assets/fonts/PixelOperator8.ttf');

    // Chargement des images des sprites
    playerSheet = loadImage('assets/sprites/knight.png');
    worldSheet = loadImage('assets/sprites/world_tileset.png');
    slimeSheet = loadImage('assets/sprites/slime_purple.png');
	fruitSheet = loadImage('assets/sprites/fruit.png');
    coinSheet = loadImage('assets/sprites/coin.png');
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
}

function draw() {
    background('skyblue')
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
        if (player.anis.name !== 'roll' || 
            player.anis.name !== 'hurt' || 
            player.anis.name !== 'dead') {
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


    // HUD
	textFont(font);
	textSize(8);

    text('Score: ' + player.score, 10, 10);
	text('Vies: ' + player.lives, 10, 20);
}