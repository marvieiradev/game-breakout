let canvas = document.getElementById('game');
let ctx = canvas.getContext('2d');
let ballRadius = 9;
let x = canvas.width / (Math.floor(Math.random() * Math.random() * 10) + 3);
let y = canvas.height - 40;
let dx = 2;
let dy = -2;

let paddleHeight = 12;
let paddleWidth = 72;

//Posição inicial
let paddleX = (canvas.width - paddleWidth) / 2;

//Blocos
let rowCount = 5; //Linhas
let collumCount = 9; //Colunas
let brickWidth = 54; //Larguar do bloco
let brickHeight = 18; //Altura do bloco
let brickPaddind = 12; //Espaçamento entre blocos
let topOffset = 40;
let leftOffset = 33;
let score = 0;

//Array de blocos
let bricks = []
for (let col = 0; col < collumCount; col++) {
    bricks[col] = [];
    for (let row = 0; row < rowCount; row++) {
        bricks[col][row] = { x: 0, y: 0, status: 1 };
    }
}

//Detectando movimento do mouse
document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

//Desenhando a plataforma
function drawPaddle() {
    ctx.beginPath();
    ctx.roundRect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight, 30);
    ctx.fillStyle = '#333';
    ctx.fill();
    ctx.closePath();
}

//Desenhando a bolinha
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#333';
    ctx.fill();
    ctx.closePath();
}

//Desenhando os blocos
function drawBricks() {
    for (let col = 0; col < collumCount; col++) {
        for (let row = 0; row < rowCount; row++) {
            if (bricks[col][row].status === 1) {
                let brickX = (col * (brickWidth + brickPaddind)) + leftOffset;
                let brickY = (row * (brickHeight + brickPaddind)) + topOffset;
                bricks[col][row].x = brickX;
                bricks[col][row].y = brickY;
                ctx.beginPath();
                ctx.roundRect(brickX, brickY, brickWidth, brickHeight, 30);
                ctx.fillStyle = '#333';
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

//Desenhar e mostrar a pontuação
function trackScore() {
    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = '#333';
    ctx.fillText('Score: ' + score, 8, 24);
}

//Verifica se a bola tocou no bloco
function hitDetection() {
    for (let col = 0; col < collumCount; col++) {
        for (let row = 0; row < rowCount; row++) {
            let br = bricks[col][row];
            if (br.status === 1) {
                if (x > br.x && x < br.x + brickWidth && y > br.y && y < br.y + brickHeight) {
                    dy = -dy
                    br.status = 0;
                    score++;
                    //Verifica se venceu (Destruiu todos os blocos)
                    if (score === rowCount * collumCount) {
                        alert('Você Venceu!');
                        document.location.reload();
                    }
                }
            }
        }
    }
}

//Função principal
function init() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    trackScore();
    drawBricks();
    drawBall();
    drawPaddle();
    hitDetection();

    //Detecção das paredes esquerda e direita
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }

    //Detecção do topo
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        //Detecção se a bola toca na plataforma
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy
        } else {
            //Se a bola não tocar na plataforma e cair no chão
            alert('Fim de Jogo')
            document.location.reload();
        }
    }

    //Detecção do chão
    if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
        dy = -dy;
    }

    //Mover bola
    x += dx;
    y += dy;
}

setInterval(init, 10);