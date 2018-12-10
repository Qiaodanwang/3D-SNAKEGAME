var container, stats;
var camera, scene, renderer;
var boundScene;
var snake, food;
var upperBound = [];
var lowerBound = [];
var leftBound = [];
var rightBound = [];
var boundGroup;
var NPC;
var cubeGroup;
var GameStart = false;



function Cube(x, y, z, a, color) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.a = a;
    this.color = color;
}

Cube.prototype.draw = function(isBound) {
    var geometry = new THREE.BoxGeometry( this.a, this.a, this.a );
    var material = new THREE.MeshLambertMaterial( { color: this.color, overdraw: 0.5 } );
    var cube = new THREE.Mesh( geometry, material );
    cube.position.x = this.x;
    cube.position.z = this.z;
    if(isBound){
        boundGroup.add(cube);
        console.log("adding into scene!");
        scene.add(boundGroup);
    }
    cubeGroup.add(cube);
    scene.add(cubeGroup);
}

function initBound() {

    for(var i = -350; i <= 350; i+=25){
        var cube = new Cube(i,25,-350, 25,"red");
        upperBound.splice(0,0,cube);
        var cube1 = new Cube(i,25,350,25,"red");
        lowerBound.splice(0,0,cube1);
    }

    for(var i=0; i<upperBound.length; i++){
        upperBound[i].draw(true);
        lowerBound[i].draw(true);
    }

    for(var j = -350; j<=350; j+=25){
        var cube = new Cube(-350,25,j,25,"red");
        leftBound.push(cube);
        var cube1 = new Cube(350,25,j,25,"red");
        rightBound.push(cube1);
    }

    for(var i=0; i<leftBound.length; i++){
        leftBound[i].draw(true);
        rightBound[i].draw(true);
    }
}

function Snake (color, initPos, isNpc) {
    var snakeArr = [];
    for (var i = initPos; i < initPos+3; i++) {
        var cube = new Cube(i*20, 20, 0, 20, 0xffffff);
        snakeArr.splice(0,0,cube);
    }
    var head = snakeArr[0];
    head.color = color;


    this.head = snakeArr[0];
    this.snakeArr = snakeArr;
    this.direction = 39;
    this.isNpc = isNpc;
}

Snake.prototype.draw = function () {
    if(this.isover) {
        return;
    }
    for (var i = 0; i < this.snakeArr.length; i++) {
        this.snakeArr[i].draw();
    }
}

Snake.prototype.move = function () {
     var cube = new Cube(this.head.x, this.head.y, this.head.z, this.head.a, 0xffffff);
     this.snakeArr.splice(1, 0, cube);
     if (isEat()) {
         food = new getRandomFood();
     } else {
         this.snakeArr.pop();
     }
     switch (this.direction) {
         case 37://左
             this.head.x -= this.head.a;
             break;
         case 38://上
             this.head.z -= this.head.a;
             break;
         case 39: //右
             this.head.x += this.head.a;
             break;
         case 40://下
             this.head.z += this.head.a;
             break;
         default:
             break;
     }
     if (this.head.x > 450 || this.head.x < -500 || this.head.z > 450 || this.head.z < -500){
        if(!this.isNpc){
            this.isover= true;
            stop();
        }    
        
    }

    for (var i = 1; i < this.snakeArr.length; i++) {
        if (this.snakeArr[i].x == this.head.x && this.snakeArr[i].z == this.head.z){
            if(!this.isNpc){
                this.isover= true;
                stop();
            }
        }
    }


 }

function getNumberInRange (min,max) {
    var range = max-min;
    var r = Math.random();
    return Math.round(r*range+min)
}

function getRandomFood () {

    var isOnSnake = true;
    while(isOnSnake){

        isOnSnake = false;
        var indexX = getNumberInRange(-10, 9);
        var indexZ = getNumberInRange(-10, 9);
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

function isEat () {
    if (snake.head.x == food.x && snake.head.z == food.z){
        return true;
    } else {
        return false;
    }
}

document.onkeydown = function (e) {
    if(snake.isover) {
        return;
    }
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
    camera.position.x = 50;
    camera.position.y = 50;
    camera.position.z = 50;

    scene = new THREE.Scene();

    cubeGroup = new THREE.Object3D();
    boundGroup = new THREE.Object3D();
    snake = new Snake("black",0,false);
    food = new getRandomFood();
    NPC = new Snake("red",Math.random() * 0x10,true);

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
    camera.lookAt( scene.position );
    renderer.render( scene, camera );
}

var ani;
function animate() {
    ani = setTimeout("requestAnimationFrame("+ animate +")", 120);
    render();
}

function start () {
    if (!ani && !this.isover) {
        animate();
    }
}

function stop () {
    if(ani) {
        cancelAnimationFrame(ani);
        clearTimeout(ani);
        ani = undefined;
    }
}

function render() {
    //写变化
    scene.remove(cubeGroup);
    cubeGroup = new THREE.Object3D();
    snake.draw();
    NPC.draw();
    //NPC.move();
    if(GameStart) {
        snake.move();
    }
    food.draw();
    camera.lookAt( scene.position );
    renderer.render( scene, camera );
}

