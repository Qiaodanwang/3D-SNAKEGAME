var container;
var camera, scene, renderer;
var snake, food;
var upperBound = [];
var lowerBound = [];
var leftBound = [];
var rightBound = [];
var boundGroup;
var NPC;
var cubeGroup;
var GameStart = false;
var info;



function Cube(x, y, z, size, color) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.size = size;
    this.color = color;
}

Cube.prototype.draw = function(isBound) {
    var geometry = new THREE.BoxGeometry( this.size, this.size, this.size );
    var material = new THREE.MeshLambertMaterial( { color: this.color, overdraw: 0.5 } );
    var cube = new THREE.Mesh( geometry, material );
    cube.position.x = this.x;
    cube.position.z = this.z;
    if(isBound){
        boundGroup.add(cube);
        console.log("adding into scene!");
        scene.add(boundGroup);
        return;
    }
    cubeGroup.add(cube);
    scene.add(cubeGroup);
}

function initBound() {

    for(var i = -300; i <= 300; i+=25){
        var cube = new Cube(i,0,-300, 25,"red");
        upperBound.splice(0,0,cube);
        var cube1 = new Cube(i,0,300,25,"red");
        lowerBound.splice(0,0,cube1);
    }

    for(var i=0; i<upperBound.length; i++){
        upperBound[i].draw(true);
        lowerBound[i].draw(true);
    }

    for(var j = -300; j<=300; j+=25){
        var cube = new Cube(-300,0,j,25,"red");
        leftBound.push(cube);
        var cube1 = new Cube(300,0,j,25,"red");
        rightBound.push(cube1);
    }

    for(var i=0; i<leftBound.length; i++){
        leftBound[i].draw(true);
        rightBound[i].draw(true);
    }
}

function Snake (color, initPos, isNpc) {
    var snakeArr = [];
    var indexX = 1;
    var indexZ = 0;
    if(isNpc){
        indexX = Math.round(Math.random()*19-9);
        indexZ = Math.round(Math.random()*19-9);
    }
    for (var i = initPos; i < initPos+3; i++) {
        var cube = new Cube(i*20*indexX, 20, 0+20*indexZ, 20, 0xffffff);
        snakeArr.splice(0,0,cube);
    }
    var head = snakeArr[0];
    head.color = color;

    this.head = snakeArr[0];
    this.snakeArr = snakeArr;
    this.direction = 40;
    this.isNpc = isNpc;
    this.score = 0;
}

Snake.prototype.draw = function () {
    for (var i = 0; i < this.snakeArr.length; i++) {
        this.snakeArr[i].draw();
    }
}

Snake.prototype.eat = function () {
    if (this.head.x == food.x && this.head.z == food.z){
        return true;
    } else {
        return false;
    }
}

Snake.prototype.move = function () {
     var cube = new Cube(this.head.x, this.head.y, this.head.z, this.head.size, 0xffffff);
     this.snakeArr.splice(1, 0, cube);
     if (this.eat()) {
         food = new getRandomFood();
         this.score++;
         console.log("eat!");
         console.log(this.score);
     } else {
         this.snakeArr.pop();
     }
     detectCollision();

     switch (this.direction) {
         case 37://左
             this.head.z += this.head.size;
             break;
         case 38://上
             this.head.x -= this.head.size;
             break;
         case 39: //右
             this.head.z -= this.head.size;
             break;
         case 40://下
             this.head.x += this.head.size;
             break;
         default:
             break;
     }

     //outOfBoundCheck
     if (this.head.x > 300 || this.head.x < -300 || this.head.z > 300 || this.head.z < -300){
        if(!this.isNpc){
            snake = new Snake("black",0,false);
        } else {
            NPC = new Snake("red",0,true);
        }   
    }

    //hitItselfCheck
    for (var i = 1; i < this.snakeArr.length; i++) {
        if (this.snakeArr[i].x == this.head.x && this.snakeArr[i].z == this.head.z){
            if(!this.isNpc){
                snake = new Snake("black",0,false);
            } else {
                NPC = new Snake("red",0,true);
            }
        }
    }

    //NPC changes direction
    if(this.isNpc){
        var curDir = this.direction;
        var next = Math.floor(Math.random()*3);
        if(curDir == 37) {
            if(next == 0) {
                this.direction = 38;
            }
            if(next == 1) {
                this.direction = 40;
            }
        }
        else if(curDir == 38){
            if(next == 0) {
                this.direction = 37;
            }
            if(next == 1) {
                this.direction = 39;
            }
        }
        else if(curDir == 39){
            if(next == 0) {
                this.direction = 38;
            }
            if(next == 1) {
                this.direction = 40;
            }
        }
        else if(curDir == 40){
            if(next == 0) {
                this.direction = 37;
            }
            if(next == 1) {
                this.direction = 39;
            }
        }
    }


 }

function detectCollision() {
    for (var i = 0; i < NPC.snakeArr.length; i++) {
        if (NPC.snakeArr[i].x == snake.head.x && NPC.snakeArr[i].z == snake.head.z){
            snake = new Snake("black",0,false);
            return;
        }
    }

    for (var i = 0; i < snake.snakeArr.length; i++) {
        if (snake.snakeArr[i].x == NPC.head.x && snake.snakeArr[i].z == NPC.head.z){
            NPC = new Snake("red",Math.random() * 0x10,true);
            return;
        }
    }
}

function getRandomFood () {

    var isOnSnake = true;
    while(isOnSnake){

        isOnSnake = false;
        var indexX = Math.round(Math.random()*19-9);
        var indexZ = Math.round(Math.random()*19-9);
        var cube = new Cube(indexX*20, 20, indexZ*20, 20, "green");
        for (var i = 0; i < snake.snakeArr.length; i++) {
            if(snake.snakeArr[i].x == cube.x && snake.snakeArr[i].z == cube.z){
                isOnSnake = true;
                break;
            }
        }
    }
    return cube;
}


document.onkeydown = function (e) {
    var ev = e||window.event;
    console.log(ev.keyCode)

    switch(ev.keyCode){
        case 37:{
            if (snake.direction !== 39){
                snake.direction = 37;
            }
            GameStart = true;
            break;
        }
        case 38:{
            if (snake.direction !== 40){
                snake.direction = 38;
            }
            GameStart = true;
            break;
        }
        case 39:{
            if (snake.direction !== 37){
                snake.direction = 39;
            }
            GameStart = true;
            break;
        }
        case 40:{
            if (snake.direction !== 38){
                snake.direction = 40;
            }
            GameStart = true;
            break;
        }
        default:
            break;
    }
    ev.preventDefault();
}



function init() {
    container = document.createElement("div");
    document.body.appendChild(container);

    camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -500, 1000);
    camera.position.x = 200;
    camera.position.y = 200;
    camera.position.z = 0;

    scene = new THREE.Scene();

    cubeGroup = new THREE.Object3D();
    boundGroup = new THREE.Object3D();
    snake = new Snake("black",0,false);
    food = new getRandomFood();
    NPC = new Snake("red",0,true);

    var ambientLight = new THREE.AmbientLight( Math.random() * 0x10 );
    scene.add( ambientLight );
    var directionalLight = new THREE.DirectionalLight( 0xffffff );
    directionalLight.position.x = -0.5;
    directionalLight.position.y = 1.0;
    directionalLight.position.z = 0.5;
    directionalLight.position.normalize();
    scene.add( directionalLight );

    renderer = new THREE.CanvasRenderer();
    renderer.setClearColor("rgb(100,100,100)");
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    initBound();
    camera.lookAt({
        x:0,
        y:0,
        z:0
    });
    info = document.createElement('div');
    info.style.position = 'absolute';
    info.style.top = '10px';
    info.style.width = '100%';
    info.style.textAlign = 'center';
    info.style.fontSize = "30px";
    info.style.fontFamily = "微软雅黑";
    info.style.color = "red";
    container.appendChild(info);
    //renderer.render( scene, camera );
}

var ani;
function run() {
    ani = setTimeout("requestAnimationFrame("+ run +")", 120);
    render();
}

function start () {
    run();
}

function stop () {
     if(ani) {
        snake = new Snake("black",0,false);
     }
}

function render() {
    scene.remove(cubeGroup);
    cubeGroup = new THREE.Object3D();
    detectCollision();
    snake.draw();
    NPC.draw();
    NPC.move();
    if(GameStart) {
        snake.move();
    }
    
    info.innerText = "Your score(black) is: "+snake.score +"             NP's score(red) is: "+NPC.score;
    container.appendChild(info);
    food.draw();
    renderer.render( scene, camera );
}

