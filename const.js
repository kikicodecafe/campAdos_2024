const GRAVITY_Y = 9.81;
const PLAYER_SPEED = 1.75;
const PLAYER_SPEED_JUMP = -4;

// Toutes les fonctions utilsées dans le script principale

async function purpleSlimeAttack(player, slimePurple) {
    if (player.lives <= 1) {

        player.dead = true;
        return;

    } else {

        player.moveAway(slimePurple, 0.2);
        slimePurple.moveAway(player, 0.2);

        await player.changeAni('hurt');
        player.changeAni('stand');

        player.lives--;
    }
}

function findRandomBlockToSpawnOnto(typeBlock) {
    let sprite;
    do {
        sprite = typeBlock[int(random(0, typeBlock.size()))];
    } while(isThereSomethingAbove(sprite));
   return sprite;
}

function isThereSomethingAbove(object) {
    const xMin = object.x - object.w / 2;
    const xMax = object.x + object.w / 2;
    const yMax = object.y - object.h - 5;
    for (let sprite of allSprites) {
        if (sprite == object) continue;
        if (((sprite.x + sprite.w / 2 >= xMin && sprite.x + sprite.w / 2 <= xMax) ||
            (sprite.x - sprite.w / 2 >= xMin && sprite.x - sprite.w / 2 <= xMax) ||
            (sprite.x >= xMin && sprite.x <= xMax)) && 
            (sprite.y + sprite.h / 2 >= object.y - object.h / 2 && sprite.y + sprite.h / 2 <= yMax)) {
            return true;
        }
    }
    return false;
}
