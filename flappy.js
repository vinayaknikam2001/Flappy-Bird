//Canvas variables
const cvs = document.getElementById("game_window")
const ctx = cvs.getContext("2d")

//Game sprites and images 
const bird1 = new Image();
bird1.src = "img/bird1.png";
const bird2 = new Image();
bird2.src = "img/bird2.png";
const bird3 = new Image();
bird3.src = "img/bird3.png";
const bird_fall = new Image();
bird_fall.src = "img/bird_fall.png";
const bird_fly = new Image();
bird_fly.src = "img/fly2.png";
const darkbg = new Image();
darkbg.src = "img/darkbg.png";
const base = new Image();
base.src = "img/base.png";
const ready = new Image();
ready.src = "img/get_ready.png";
const tap = new Image();
tap.src = "img/tap.png";
const start = new Image();
start.src = "img/start.png";
const over = new Image();
over.src = "img/game_over.png";
const play_again = new Image();
play_again.src = "img/play_again.png";
const u_pipe = new Image();
u_pipe.src = "img/usd_pipe.png";
const l_pipe = new Image();
l_pipe.src = "img/straight_pipe.png";
let bird = [
    [bird1, bird2, bird3, bird3, bird2, bird1],
    [bird_fall, bird_fall, bird_fall, bird_fall, bird_fall, bird_fall]
]


//Game Audios
const fly_sound = new Audio("audio/fly.mp3");
const hit_sound = new Audio("audio/hit.wav");
const die_sound = new Audio("audio/die.wav");
const point_sound = new Audio("audio/point.wav");
const swoosh_sound = new Audio("audio/swoosh.wav");

//Time variables
let fps = 30 ,canvas_speed = 5;
var then = Date.now();
//Bird  variables
let bi = 0, birdx = 80, birdy = 150, bird_speed = 0, gravity = 0.45, fly = -6, si = 0, sizex = 42, sizey = 30;
//Base variables 
let basex1 = 0, basex2 = 336, basey = 400;
// let pipex = [350,500];
// let pipey = [-200,-150];
let pipes = [{x : 350 ,y : -100} ,{x : 570 ,y: -250}];
let pipew = 70 , pipeh = 400 ,offsetv = 500 ,offseth = 250 ,a = -350 ,b = -160;

let game_state = 0 ,score = 0;

//Game loop
function game_loop() {
    now = Date.now();
    var diffrence = now - then;
    if (diffrence >= 1000 / fps) {
        switch (game_state) {
            case 0:
                get_ready();
                break;
            case 1:
                game_on();
                break;
            case 2:
                game_over();
                break;
            default:
                break;
        }
        //Assigning new time value
        then = now;

    }
    requestAnimationFrame(game_loop);
}
game_loop();

//Start game
function game_on() {
    //Drawing all images
    ctx.drawImage(darkbg, 0, 0, 144, 256, 0, 0, 200, 400);
    ctx.drawImage(darkbg, 0, 0, 144, 256, 200, 0, 400, 400);
    pipes.forEach((lst,index) => {
        ctx.drawImage(u_pipe, 0, 0, 52, 399, lst.x, lst.y, pipew, pipeh);
        ctx.drawImage(l_pipe, 0, 0, 52, 399, lst.x, (lst.y+offsetv), pipew, pipeh);
        if((lst.x+pipew) === 80){
            score += 1;
            score_board.innerHTML = "Score : "+score;
            point_sound.play();
        }
    });
    ctx.drawImage(bird[si][bi], 0, 0, sizex, sizey, birdx, birdy, sizex, sizey);
    ctx.drawImage(base, 0, 0, 336, 112, basex1, basey, 336, 112);
    ctx.drawImage(base, 0, 0, 336, 112, basex2, basey, 336, 112);

    //Capturing events
    document.addEventListener("keydown", k => {
        if (k.code === "Space") {
            //If space is pressed fly
            fly_sound.play();
            bird_speed = fly;
        }
    });


    //Moving base platform
    if (basex1 <= -336) {
        basex1 = 320;
    }
    else {
        basex1 -= canvas_speed;
    }
    if (basex2 <= -336) {
        basex2 = 320;
    }
    else {
        basex2 -= canvas_speed;
    }

    //Bird image iterator
    if (bi >= 5) {
        bi = 0; //Bird image iterator
    }
    if (bi < 5) {
        bi += 1; //Bird image iterator
    }

    //Changing bird speed with gravity
    bird_speed += gravity;
    birdy += bird_speed;

    //If bird falls on ground
    if (birdy >= 375) {
        hit_sound.play();
        birdy = 375;
        game_state = 2;
        die_sound.play();
        return;
    }

    //Changing bird state to falling
    if (bird_speed > 5) {
        si = 1; //Bird state iterator
        sizex = 30;
        sizey = 42;
    }
    else {
        si = 0; //Bird state iterator
        sizex = 42;
        sizey = 30;
    }

    //Moving pipes
    pipes[0].x -= canvas_speed;
    pipes[1].x -= canvas_speed;

    //Creating new pipes
    if(pipes[0].x <= -70){

        pipes[0].x = pipes[1].x+offseth;
        pipes[0].y =  Math.round(a + (b-a)* Math.random());
    } 
    if(pipes[1].x <= -70){

        pipes[1].x = pipes[0].x+offseth;
        pipes[1].y =  Math.round(a + (b-a)* Math.random());
    } 
    
    //Detecting collison
    if(is_collide()){
        hit_sound.play();
        game_state = 2;
        die_sound.play();
        return;
    }

}

//Get ready
function get_ready() {
    //Displaying play again button
    document.getElementById("play_again").style.display="none";

    //Stoping other event sounds 
    hit_sound.pause();
    //Enabling start button again
    document.getElementById("start").style.display = "block";
    //Disabling tap button
    document.getElementById("tap").style.display = "block";
    birdx = 80;
    birdy = 150;
    sizex = 35;
    sizey = 25;
    bird_speed = 0; 
    gravity = 0.45;
    si = 0;
    pipes = [{x : 350 ,y : -200} ,{x : 570 ,y: -240}];
    score = 0;
    score_board.innerHTML = "Score : "+score;
    //Drawing all images
    ctx.drawImage(darkbg, 0, 0, 144, 256, 0, 0, 200, 400);
    ctx.drawImage(darkbg, 0, 0, 144, 256, 200, 0, 400, 400);
    ctx.drawImage(ready, 0, 0, 96, 28, 100, 70, 130, 40);
    ctx.drawImage(tap, 0, 0, 118, 100, 100, 150, 118, 100);
    ctx.drawImage(start, 0, 0, 84, 28, 110, 350, 100, 33);
    ctx.drawImage(base, 0, 0, 336, 112, 0, 400, 336, 112);
    ctx.drawImage(bird[si][bi], 0, 0, sizex, sizey, birdx, birdy, sizex, sizey);

    //Capturing events 
    addEventListener("keydown", k => {
        if (k.code === "KeyR") {
            game_state = 0; 
            return;
        }
    });


    //Bird image iterator
    if (bi >= 5) {
        bi = 0; //Bird image iterator
    }
    if (bi < 5) {
        bi += 1; //Bird image iterator
    }

}

function on_state() {
    swoosh_sound.play();
    game_state = 1;
    //Disabling start button
    document.getElementById("start").style.display = "none";
    //Disabling tap button
    document.getElementById("tap").style.display = "none";
    //Displaying play again button
    document.getElementById("play_again").style.display="none";
}

function is_collide() {
    let mask = 15;
    //Collision detection of upper pipes 
    if(birdx+sizex >= pipes[0].x+mask && birdx <= pipes[0].x+pipew && birdy <= pipes[0].y+pipeh){
        return true;
    }
    if(birdx+sizex >= pipes[1].x+mask && birdx <= pipes[1].x+pipew && birdy <= pipes[1].y+pipeh){
        return true;
    }

    //Collision detection for lower pipes
    if(birdx+sizex >= pipes[0].x+mask && birdx <= pipes[0].x+pipew && birdy+sizey >= pipes[0].y+offsetv){
        return true;
    }
    if(birdx+sizex >= pipes[1].x+mask && birdx <= pipes[1].x+pipew && birdy+sizey >= pipes[1].y+offsetv){
        return true;
    }


}
//Game over state
function start_state() {
    //Adding swooshing sound
    swoosh_sound.play();
    game_state = 0;
    swoosh_sound.play();
}

function game_over() {
    //Displaying play again button
    document.getElementById("play_again").style.display="block";

    //Drawing images in canvas
    ctx.drawImage(darkbg, 0, 0, 144, 256, 0, 0, 200, 400);
    ctx.drawImage(darkbg, 0, 0, 144, 256, 200, 0, 400, 400);
    pipes.forEach((lst,index) => {
        ctx.drawImage(u_pipe, 0, 0, 52, 399, lst.x, lst.y, pipew, pipeh);
        ctx.drawImage(l_pipe, 0, 0, 52, 399, lst.x, (lst.y+offsetv), pipew, pipeh);
    });
    ctx.drawImage(play_again, 0, 0, 338, 146, 87, 240, 150, 50);
    ctx.drawImage(base, 0, 0, 336, 112, 0, 400, 336, 112);
    ctx.drawImage(bird[si][bi], 0, 0, sizex, sizey, birdx, birdy, sizex, sizey);
    ctx.drawImage(over, 0, 0, 99, 23, 90, 70, 142, 33);


    //Capturing events
    addEventListener("keydown", k => {
        if (k.code === "KeyR") {
            game_state = 0; 
            return;
        }
        if (k.code === "Space") {
            //If space is pressed fly
            
        }
    });

    fly_sound.pause();

    //Changing bird speed with gravity
    bird_speed += 3;
    birdy += bird_speed;
    if (birdy >= 375) {
        birdy = 375;
    }

    //Changing bird state to falling
    if (bird_speed > 4) {
        si = 1; //Bird state iterator
        sizex = 30;
        sizey = 42;
    }

}
function flap() {
    //If screen touched fly
    fly_sound.play();
    bird_speed = fly;
}
//This  function is error this is causing to call event listner unnecessarily
