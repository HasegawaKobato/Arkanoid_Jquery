
var fixedSpeed = 3;

var nowBallY = 0, nowBallX = 0;
var verticalSpeed = -2, horizontalSpeed = 3;
var ballR2 = 0;
var nowBoardX = 0,boardWidth = 0;
var tileWidth = 0, tileHeight = 0;
var isBallIn_HR = false, isBallIn_VT = false;
var theTile;

var score = 0, stage = 1, isPlaying = true, isGameOver = false, combo = 0, isFireball = false, isDying = false, 
    clearTileInfo = true, canShoot = false, isShoot = false, displayAchivement = false, achivementStop = false,
    hideAchivement = false, pause = 0, nullRebound = 0, shootItemCount = 0 ,achivementCount = 0,
    isDisplayningAchi = false;

var fireballTimer = 0, rebound = 0, reboundTimer = 0, previosTileTop = 0, clearTileTimer = 0, shootTimer = 0,
    achivementDe = 1, achivementStopTimer = 0;

var achivementList = [];

$(document).ready(function() {
    alert("!");
    $(function(){
        //球體移動規則
        var intervalFunction = setInterval(function(){
            ballR2 = +$(".ball").css('width').substring(0, $(".ball").css('width').search('px'));
            nowBoardX = +$(".board").css("left").substring(0,$('.board').css("left").search('px'));
            nowBoardY = +$(".board").css("top").substring(0, $(".board").css("top").search('px'));
            nowBallX = +$(".ball").css('left').substring(0, $(".ball").css('left').search('px'));
            nowBallY = +$(".ball").css('top').substring(0, $(".ball").css('top').search('px'));
            boardWidth = +$(".board").css("width").substring(0,$('.board').css("width").search('px'));
            boardHeight = +$(".board").css("height").substring(0,$('.board').css("height").search('px'));
    
            if (isPlaying) {
                fixedSpeed += 0.0002;                
                verticalSpeed *= (fixedSpeed / (fixedSpeed - 0.0002));
                horizontalSpeed *= (fixedSpeed / (fixedSpeed - 0.0002));
            }
            //反彈
            if (isPlaying) {
                nowBallX += horizontalSpeed;
                nowBallY += verticalSpeed;
                $(".ball").css({
                    "top": nowBallY + 'px',
                    "left": nowBallX + 'px'
                });
                if (nowBallX + ballR2 > +$(".game").css("width").substring(0, $(".game").css("width").search('px')) || nowBallX < 0) {
                    horizontalSpeed *= -1;
                    rebound ++;
                }
                if (nowBallY + ballR2 > +$(".game").css("height").substring(0, $(".game").css("height").search('px')) || nowBallY < 0) {
                    verticalSpeed *= -1;
                    rebound ++;
                    nullRebound ++;
                }
            }
    
            //接球
            if (nowBallY + ballR2  > nowBoardY && nowBallY < nowBoardY + boardHeight &&
            nowBallX + ballR2 > nowBoardX && nowBallX < nowBoardX + boardWidth) {
                horizontalSpeed = ((nowBallX + ballR2 / 2) - (nowBoardX + boardWidth / 2)) / (boardWidth / 2);
                verticalSpeed = Math.sqrt(Math.abs(Math.pow(fixedSpeed,2) - Math.pow(horizontalSpeed, 2)));
                verticalSpeed = -Math.abs(verticalSpeed);
                combo = 0;
                
            }
    
            //★★★★★★★★★★★★★★遊戲結束★★★★★★★★★★★★★★★
            if (nowBallY + ballR2 > +$(".game").css("height").substring(0, $(".game").css("height").search('px'))) {
                GameOver();
            }     
            
            clearTileTimer += 10;
            //打磚塊
            $(".tile").each(function(tiles) {
                tileWidth = +$(this).css("width").substring(0,$(this).css("width").search('px'));
                tileHeight = +$(this).css("height").substring(0,$(this).css("height").search('px'));
    
                //判斷球與各個磚塊的方位
                if ((nowBallX + ballR2 <= +$(this).css("left").substring(0, $(this).css("left").search('px'))) ||
                (nowBallX >= tileWidth + +$(this).css("left").substring(0, $(this).css("left").search('px')))) {
                    isBallIn_HR = true;
                } else if ((nowBallX + ballR2 > +$(this).css("left").substring(0, $(this).css("left").search('px'))) ||
                (nowBallX < tileWidth + +$(this).css("left").substring(0, $(this).css("left").search('px')))) {                   
                    isBallIn_HR = false;
                }
                
                if ((nowBallY + ballR2 <= +$(this).css("top").substring(0, $(this).css("top").search('px'))) ||
                nowBallY >= +$(this).css("top").substring(0, $(this).css("top").search('px')) + tileHeight) {
                    isBallIn_VT = true;
                } else if ((nowBallY + ballR2 > +$(this).css("top").substring(0, $(this).css("top").search('px'))) ||
                nowBallY  < +$(this).css("top").substring(0, $(this).css("top").search('px')) + tileHeight) {
                    isBallIn_VT = false;
                }
    
                theTile = $(this);
                //球體碰撞偵測
                if ((nowBallX + ballR2 > +$(this).css("left").substring(0, $(this).css("left").search('px')) - Math.abs(horizontalSpeed)) &&
                (nowBallX < tileWidth + Math.abs(horizontalSpeed) + +$(this).css("left").substring(0, $(this).css("left").search('px'))) &&
                ((nowBallY + ballR2 > +$(this).css("top").substring(0, $(this).css("top").search('px')) - Math.abs(verticalSpeed)) &&
                nowBallY  < +$(this).css("top").substring(0, $(this).css("top").search('px')) + tileHeight + Math.abs(verticalSpeed))) {
    
                    if (!isFireball) {
                        if (isBallIn_VT) {
                            if ((previosTileTop != +$(this).css("top").substring(0, $(this).css("top").search('px')) - Math.abs(verticalSpeed)) && clearTileInfo) {
                                verticalSpeed *= -1;
                                previosTileTop = +$(this).css("top").substring(0, $(this).css("top").search('px')) - Math.abs(verticalSpeed);
                                clearTileTimer = 0;
                                clearTileInfo = false;
                            }
                        } else {
                            if (isBallIn_HR) {                            
                                horizontalSpeed *= -1;
                            }
                        }
                    }
                    RandomToCreateItem();
    
                    nullRebound = 0;
                    combo ++;
                    score += combo * 10;
                    $(this).remove();
                }
    
                $('.bullet').each(function() {
                    bulletX = +$(this).css('left').substring(0, $(this).css("left").search('px'));
                    bulletY = +$(this).css('top').substring(0, $(this).css("top").search('px'));
                    bulletWidht = +$(this).css('width').substring(0, $(this).css("width").search('px'));
                    bulletHeight = +$(this).css('height').substring(0, $(this).css("height").search('px'));
    
                    if (bulletY < +theTile.css('top').substring(0, theTile.css("top").search('px')) + tileHeight - verticalSpeed &&
                    bulletY + bulletHeight > +theTile.css('top').substring(0, theTile.css("top").search('px')) &&
                    bulletX + bulletWidht > +theTile.css('left').substring(0, theTile.css("left").search('px')) &&
                    bulletX < +theTile.css('left').substring(0, theTile.css("left").search('px')) + tileWidth - horizontalSpeed) {
    
                        RandomToCreateItem();
    
                        $(this).remove();
                        theTile.remove();
                        score += 10;
                    }
                });
    
            });
    
            if (clearTileTimer >= 50) {
                clearTileInfo = true;
            }
    
            //子彈
            $('.bullet').each(function() {
                bulletY = +$(this).css('top').substring(0, $(this).css("top").search('px'));
                if (isPlaying) {
                    $(this).css({
                        "top" : bulletY - 5 + "px"
                    });
                }
                if (bulletY < 0) {
                    $(this).remove();
                }
            });
    
            //射擊槍
            $('.leftGun').css({
                "top" : (nowBoardY - 20) + "px",
                "left" : nowBoardX + "px"
            });
    
            $('.rightGun').css({
                "top" : (nowBoardY - 20) + "px",
                "left" : (nowBoardX + boardWidth) + "px"
            });
    
            //道具墜落
            $('.item').each(function(){
                var itemTop = +$(this).css('top').substring(0, $(this).css("top").search('px')); 
                var itemLeft = +$(this).css('left').substring(0, $(this).css("left").search('px')); 
                var itemHeight = +$(this).css('height').substring(0, $(this).css("height").search('px'));
                var itemWidth = +$(this).css('width').substring(0, $(this).css("width").search('px'));
    
                if (isPlaying) {
                    $(this).css({
                        "top" : itemTop + 1 + "px"
                    });
                }
    
                if ((itemTop + itemHeight > nowBoardY && itemTop < nowBoardY + boardHeight &&
                itemLeft + itemWidth > nowBoardX && itemLeft < nowBoardX + boardWidth)) {
                    switch (+$(this).css('z-index')) {
                        case 770:
                            DecreaseBoardWidth();
                            break;
                        case 771:
                            IncreaseBoardWidth();
                            break;
                        case 772:
                            DecreaseBallSize();
                            break;
                        case 773:
                            IncreaseBallSize();
                            break;
                        case 774:
                            FireballOn();
                            break;
                        case 775:
                            Die();
                            break;
                        case 776:
                            IncreaseBallSpeed();
                            break;
                        case 777:
                            DecreaseBallSpeed();
                            break;
                        case 778:
                            ShootGun();
                            break;
                        default:
                            alert('Oops! Something error! Please refresh the page.');
                            break;
                    }
                    $(this).remove();
                }
                if ((itemTop + itemHeight > +$(".game").css("height").substring(0, $(".game").css("height").search('px')))){
                    $(this).remove();
                }
    
            });
            
            //道具效果計數器&動畫
            if (isPlaying) {
                if (isFireball) {
                    fireballTimer += 10;
                    if (fireballTimer >= 3000) {
                        FireballOff();
                        isFireball = false;
                        fireballTimer = 0;
                    }
                }
            }
    
            if (isDying) {
                $('.board').css({
                    "top" : nowBoardY + 2 + "px",
                    "opacity" : +$(".board").css("opacity") - 0.1
                });
                if ($('.board').css("opacity") == 0) {
                    isDying = false;
                    GameOver();
                }
            }
    
            if (isShoot) {
                shootTimer += 10;
                if (shootTimer >= 300) {
                    shootTimer = 0;
                    isShoot = false;
                }
            }
    
            if (!canShoot) {
                $('.leftGun').css({
                    "display" : "none"
                });
    
                $('.rightGun').css({
                    "display" : "none"
                });
            }
    
            if (isPlaying) {
    
                if (displayAchivement) {
                    achivementDe += 10;
                }
    
                if (hideAchivement) {
                    achivementDe -= 10;
                }
    
                if (achivementStop) {
                    achivementStopTimer += 10;
                    if (achivementStopTimer >= 3000) {
                        achivementStop = false;
                        displayAchivement = false;
                        hideAchivement = true;
                    }
                }
            }
    
            //生成下一關
            if ($('.tile').length == 0) {
    
                $('.bullet').each(function() {
                    $(this).remove();
                });
                canShoot = false;
                shootTimer = 0;
                isShoot = false;
    
                $('.leftGun').css({
                    "display" : "none"
                });
    
                $('.rightGun').css({
                    "display" : "none"
                });
    
                CreateStage();
    
                stage ++;
            }
    
            //例外處理
            reboundTimer += 10;
            if (reboundTimer >= 300) {
                if (rebound > 10) {                    
                    if (nowBallY < 0) {
                        $('.ball').css({
                            "top" : + ballR2 + "px"
                        });
                    } else {
                        if (nowBallX > 0) {
                            $('.ball').css({
                                "left" : + +$(".game").css("width").substring(0, $(".game").css("width").search('px')) - ballR2 + "px"
                            });
                        } else {
                            $('.ball').css({
                                "left" : + 5 + "px"
                            });
                        }
                    }
                }
                reboundTimer = 0;
                rebound = 0;
            }
    
            if (Math.abs(verticalSpeed) <= 0) {
                verticalSpeed = 0.5;
            }
            
            if (Math.abs(horizontalSpeed) <= 0) {
                horizontalSpeed = 1;
            }
    
            //訊息顯示
            $('.displayScore').text('Score: ' + score);
            $('.displayStage').text('Stage: ' + stage);
    
            //成就動畫
            if (displayAchivement) {
                if (achivementDe < 705) {
                    $('.achivement').css({
                        "width" : + achivementDe + "px"
                    });
                } else {
                    $('.achivement').css({
                        "width" : + 705 + "px"
                    });
                    achivementStop = true;
                    achivementDe = 705;
                    displayAchivement = false;
                }
            }
    
            if (hideAchivement) {
                if (achivementDe > 0) {
                    $('.achivement').css({
                        "width" : + achivementDe + "px"
                    });
                } else {
                    $('.achivement').css({
                        "width" : + 0 + "px"
                    });
                    $('.achivement').text('');
                    achivementStop = false;
                    hideAchivement = false;
                    isDisplayningAchi = false;
                }
            }
    
            //成就判斷
            if (stage >= 2) {
                if (!isDisplayningAchi) {
                    if (!achivementList[0]) {
                        CallAchivement(0, '新手上路', '達到第2關');
                    }
                }
            }
    
            if (pause >= 10) {
                if (!isDisplayningAchi) {
                    if (!achivementList[1]) {
                        CallAchivement(1, '就你問題最多', '暫停10次');
                    }
                }
            }
    
            if (fixedSpeed >= 7) {
                if (!isDisplayningAchi) {
                    if (!achivementList[2]) {
                        CallAchivement(2, '快！還要再更快！', '球速超快');
                    }
                }
            }
    
            if (fixedSpeed <= 1.5) {
                if (!isDisplayningAchi) {
                    if (!achivementList[3]) {
                        CallAchivement(3, '沒有挑戰性', '球速超慢');
                    }
                }
            }
    
            if (stage >= 10) {
                if (!isDisplayningAchi) {
                    if (!achivementList[4]) {
                        CallAchivement(4, '我很持久', '達到第10關');
                    }
                }
            }
    
            if (combo >= 7) {
                if (!isDisplayningAchi) {
                    if (!achivementList[5]) {
                        CallAchivement(5, '你就別下來了', '達到7 combo');
                    }
                }
            }
    
            if (+$(".ball").css("width").substring(0,$('.ball').css("width").search('px')) <= 5) {
                if (!isDisplayningAchi) {
                    if (!achivementList[6]) {
                        CallAchivement(6, '球呢？', '球體直徑小於5px');
                    }
                }
            }
    
            if (+$(".ball").css("width").substring(0,$('.ball').css("width").search('px')) >= 50) {
                if (!isDisplayningAchi) {
                    if (!achivementList[7]) {
                        CallAchivement(7, '整個球檯都是我的伸展台', '球體直徑大於50px');
                    }
                }
            }
    
            if (+$(".board").css("width").substring(0,$('.board').css("width").search('px')) <= 20) {
                if (!isDisplayningAchi) {
                    if (!achivementList[8]) {
                        CallAchivement(8, '我頂不住了', '操縱板寬度小於20px');
                    }
                }
            }
    
            if (stage >= 25) {
                if (!isDisplayningAchi) {
                    if (!achivementList[9]) {
                        CallAchivement(9, '永無止境', '達到第25關');
                    }
                }
            }
    
            if (score >= 5000) {
                if (!isDisplayningAchi) {
                    if (!achivementList[10]) {
                        CallAchivement(10, '打磚塊高手', '達到5000分');
                    }
                }
            }
    
            if (score >= 10000) {
                if (!isDisplayningAchi) {
                    if (!achivementList[11]) {
                        CallAchivement(11, '出神入化', '達到10000分');
                    }
                }
            }
    
            if (nullRebound >= 5) {
                if (!isDisplayningAchi) {
                    if (!achivementList[12]) {
                        CallAchivement(12, '我就是打不到啊', '連續5次瞄準失敗');
                    }
                }
            }
    
            if (nullRebound >= 10) {
                if (!isDisplayningAchi) {
                    if (!achivementList[13]) {
                        CallAchivement(13, '這遊戲真難玩', '連續10次瞄準失敗');
                    }
                }
            }
    
            if (shootItemCount >= 10) {
                if (!isDisplayningAchi) {
                    if (!achivementList[14]) {
                        CallAchivement(14, '我是神射手', '吃到射擊道具10次');
                    }
                }
            }
    
            //成就條
            $('.achiSlideED').css({
                "width" : + (705 * (achivementCount / 15)) + "px"
            });
    
        },10);
    
        DisplayBestScore ();
    
        //操控盤
        $('.game').mousemove(function(position) {
            if (isPlaying && !isGameOver) {
                $('.board').css({
                    "left": + position.pageX - +$('.board').css("width").substring(0,$('.board').css("width").search('px')) * 0.5 + "px"
                });
            }
        });
    
        //事件
        $("html").keydown(function(keycode) {            
            if ((!isGameOver) && (keycode.key == ' ')) {
                if (isPlaying) {
                    $('.pause').css({
                        "display" : "block"
                    });
                    pause ++;
                } else {
                    $('.pause').css({
                        "display" : "none"
                    });
                }
                isPlaying = isPlaying == true? false : true;
            }
        });      
    
        $('html').mousedown(function(mouse) {
            if (mouse.button == 0) {
                if (!isGameOver && isPlaying) {
                    if (canShoot && !isShoot) {
                        $('<div class="bullet" style="top: ' + (nowBoardY - 20) + 'px; left: ' + nowBoardX + 'px;"></div>').appendTo('.game');
                        $('<div class="bullet" style="top: ' + (nowBoardY - 20) + 'px; left: ' + (nowBoardX + boardWidth) + 'px;"></div>').appendTo('.game');
                        isShoot = true;
                    }
                }
            }
        });
    
        function CallAchivement(id, achiTitle, achiContent) {
            isDisplayningAchi = true;
            achivementCount++;
            $('.achivement').empty();
            $('<span style="color: #00F; font-weight: 1000;">' + achiTitle + '</span><span>：' + achiContent + '</span>').appendTo('.achivement');
            $('<li>' + achiTitle + '</li>').appendTo('.achiListArray');
            achivementDe = 0;
            achivementStopTimer = 0;
            displayAchivement = true;
            achivementList[id] = true;
        }
    
        function RandomToCreateItem() {
            if (Math.round(Math.random() * $('.tile').length) < Math.floor($('.tile').length * 0.25)) {
                var knockTop = +$(theTile).css('top').substring(0, $(theTile).css("top").search('px'));
                var knockLeft = +$(theTile).css('left').substring(0, $(theTile).css("left").search('px'));
                CreateItem(knockTop, knockLeft, Math.floor(Math.random() * 9));
            }
        }
    
        
        function GameOver() {
            clearInterval(intervalFunction);
            $('.gameover').slideDown('slow');
            if ((localStorage.getItem("BestScore") != null && score >= localStorage.getItem("BestScore")) ||
                localStorage.getItem("BestScore") == null) {
    
                localStorage.setItem("BestScore", score);
            }
            isGameOver = true;
        }
    
    
        function CreateStage() {
            
            var stageStyle = Math.floor(Math.random() * 5);
    
            if (stageStyle == 0) {
                $('<div class="tile" style="top:20px; left: 10px"></div>'+
                '<div class="tile" style="top:20px; left: 80px"></div>'+
                '<div class="tile" style="top:20px; left: 150px"></div>'+
                '<div class="tile" style="top:20px; left: 220px"></div>'+
                '<div class="tile" style="top:20px; left: 290px"></div>'+
                '<div class="tile" style="top:20px; left: 360px"></div>'+
                '<div class="tile" style="top:20px; left: 430px"></div>'+
                '<div class="tile" style="top:60px; left: 35px"></div>'+
                '<div class="tile" style="top:60px; left: 105px"></div>'+
                '<div class="tile" style="top:60px; left: 175px"></div>'+
                '<div class="tile" style="top:60px; left: 245px"></div>'+
                '<div class="tile" style="top:60px; left: 315px"></div>'+
                '<div class="tile" style="top:60px; left: 385px"></div>'+
                '<div class="tile" style="top:100px; left: 10px"></div>'+
                '<div class="tile" style="top:100px; left: 80px"></div>'+
                '<div class="tile" style="top:100px; left: 150px"></div>'+
                '<div class="tile" style="top:100px; left: 220px"></div>'+
                '<div class="tile" style="top:100px; left: 290px"></div>'+
                '<div class="tile" style="top:100px; left: 360px"></div>'+
                '<div class="tile" style="top:100px; left: 430px"></div>').appendTo('.game');
            } else if (stageStyle == 1) {
                $('<div class="tile" style="background: #777;border: 2px solid #444; top:5px; left: 3px"></div>    '+
                '<div class="tile" style="background: #777;border: 2px solid #444; top:5px; left: 58px"></div>   '+
                '<div class="tile" style="background: #777;border: 2px solid #444; top:5px; left: 113px"></div>  '+
                '<div class="tile" style="background: #777;border: 2px solid #444; top:5px; left: 168px"></div>  '+
                '<div class="tile" style="background: #777;border: 2px solid #444; top:5px; left: 223px"></div>  '+
                '<div class="tile" style="background: #777;border: 2px solid #444; top:5px; left: 278px"></div>  '+
                '<div class="tile" style="background: #777;border: 2px solid #444; top:5px; left: 333px"></div>  '+
                '<div class="tile" style="background: #777;border: 2px solid #444; top:5px; left: 388px"></div>  '+
                '<div class="tile" style="background: #777;border: 2px solid #444; top:5px; left: 443px"></div>  '+
                '<div class="tile" style="background: #777;border: 2px solid #444; top:30px; left: 30px"></div>  '+
                '<div class="tile" style="background: #777;border: 2px solid #444; top:30px; left: 85px"></div>  '+
                '<div class="tile" style="background: #777;border: 2px solid #444; top:30px; left: 140px"></div> '+
                '<div class="tile" style="background: #777;border: 2px solid #444; top:30px; left: 195px"></div> '+
                '<div class="tile" style="background: #777;border: 2px solid #444; top:30px; left: 250px"></div> '+
                '<div class="tile" style="background: #777;border: 2px solid #444; top:30px; left: 305px"></div> '+
                '<div class="tile" style="background: #777;border: 2px solid #444; top:30px; left: 360px"></div> '+
                '<div class="tile" style="background: #777;border: 2px solid #444; top:30px; left: 415px"></div> '+
                '<div class="tile" style="background: #777;border: 2px solid #444; top:55px; left: 3px"></div>   '+
                '<div class="tile" style="background: #777;border: 2px solid #444; top:55px; left: 58px"></div>  '+
                '<div class="tile" style="background: #777;border: 2px solid #444; top:55px; left: 113px"></div> '+
                '<div class="tile" style="background: #777;border: 2px solid #444; top:55px; left: 168px"></div> '+
                '<div class="tile" style="background: #777;border: 2px solid #444; top:55px; left: 223px"></div> '+
                '<div class="tile" style="background: #777;border: 2px solid #444; top:55px; left: 278px"></div> '+
                '<div class="tile" style="background: #777;border: 2px solid #444; top:55px; left: 333px"></div> '+
                '<div class="tile" style="background: #777;border: 2px solid #444; top:55px; left: 388px"></div> '+
                '<div class="tile" style="background: #777;border: 2px solid #444; top:55px; left: 443px"></div> '+
                '<div class="tile" style="background: #777;border: 2px solid #444; top:80px; left: 30px"></div>  '+
                '<div class="tile" style="background: #777;border: 2px solid #444; top:80px; left: 85px"></div>  '+
                '<div class="tile" style="background: #777;border: 2px solid #444; top:80px; left: 140px"></div> '+
                '<div class="tile" style="background: #777;border: 2px solid #444; top:80px; left: 195px"></div> '+
                '<div class="tile" style="background: #777;border: 2px solid #444; top:80px; left: 250px"></div> '+
                '<div class="tile" style="background: #777;border: 2px solid #444; top:80px; left: 305px"></div> '+
                '<div class="tile" style="background: #777;border: 2px solid #444; top:80px; left: 360px"></div> '+
                '<div class="tile" style="background: #777;border: 2px solid #444; top:80px; left: 415px"></div> '+
                '<div class="tile" style="background: #777;border: 2px solid #444; top:105px; left: 3px"></div>  '+
                '<div class="tile" style="background: #777;border: 2px solid #444; top:105px; left: 58px"></div> '+
                '<div class="tile" style="background: #777;border: 2px solid #444; top:105px; left: 113px"></div>'+
                '<div class="tile" style="background: #777;border: 2px solid #444; top:105px; left: 168px"></div>'+
                '<div class="tile" style="background: #777;border: 2px solid #444; top:105px; left: 223px"></div>'+
                '<div class="tile" style="background: #777;border: 2px solid #444; top:105px; left: 278px"></div>'+
                '<div class="tile" style="background: #777;border: 2px solid #444; top:105px; left: 333px"></div>'+
                '<div class="tile" style="background: #777;border: 2px solid #444; top:105px; left: 388px"></div>'+
                '<div class="tile" style="background: #777;border: 2px solid #444; top:105px; left: 443px"></div>').appendTo('.game');
            } else if (stageStyle == 2) {
                $('<div class="tile" style="background: #A14835; top:5px; left: 3px"></div>    '+
                '<div class="tile" style="background: #A14835; top:5px; left: 58px"></div>   '+
                '<div class="tile" style="background: #A14835; top:5px; left: 113px"></div>  '+
                '<div class="tile" style="background: #A14835; top:5px; left: 168px"></div>  '+
                '<div class="tile" style="background: #A14835; top:5px; left: 223px"></div>  '+
                '<div class="tile" style="background: #A14835; top:5px; left: 278px"></div>  '+
                '<div class="tile" style="background: #A14835; top:5px; left: 333px"></div>  '+
                '<div class="tile" style="background: #A14835; top:5px; left: 388px"></div>  '+
                '<div class="tile" style="background: #A14835; top:5px; left: 443px"></div>  '+
                '<div class="tile" style="background: #A14835; top:30px; left: 30px"></div>  '+
                '<div class="tile" style="background: #A14835; top:30px; left: 85px"></div>  '+
                '<div class="tile" style="background: #A14835; top:30px; left: 140px"></div> '+
                '<div class="tile" style="background: #A14835; top:30px; left: 195px"></div> '+
                '<div class="tile" style="background: #A14835; top:30px; left: 250px"></div> '+
                '<div class="tile" style="background: #A14835; top:30px; left: 305px"></div> '+
                '<div class="tile" style="background: #A14835; top:30px; left: 360px"></div> '+
                '<div class="tile" style="background: #A14835; top:30px; left: 415px"></div> '+
                '<div class="tile" style="background: #A14835; top:30px; left: 30px"></div>  '+
                '<div class="tile" style="background: #A14835; top:30px; left: 85px"></div>  '+
                '<div class="tile" style="background: #A14835; top:30px; left: 360px"></div> '+
                '<div class="tile" style="background: #A14835; top:30px; left: 415px"></div> '+
                '<div class="tile" style="background: #A14835; top:55px; left: 3px"></div>   '+
                '<div class="tile" style="background: #A14835; top:55px; left: 58px"></div>  '+
                '<div class="tile" style="background: #A14835; top:55px; left: 388px"></div> '+
                '<div class="tile" style="background: #A14835; top:55px; left: 443px"></div> '+
                '<div class="tile" style="background: #A14835; top:80px; left: 30px"></div>  '+
                '<div class="tile" style="background: #A14835; top:80px; left: 85px"></div>  '+
                '<div class="tile" style="background: #A14835; top:80px; left: 360px"></div> '+
                '<div class="tile" style="background: #A14835; top:80px; left: 415px"></div> '+
                '<div class="tile" style="background: #A14835; top:105px; left: 3px"></div>  '+
                '<div class="tile" style="background: #A14835; top:105px; left: 58px"></div> '+
                '<div class="tile" style="background: #A14835; top:105px; left: 388px"></div>'+
                '<div class="tile" style="background: #A14835; top:105px; left: 443px"></div>').appendTo('.game');
            } else if (stageStyle == 3) {
                $('<div class="tile" style="top:5px; left: 58px"></div>   '+
                '<div class="tile" style="top:5px; left: 113px"></div>  '+
                '<div class="tile" style="top:5px; left: 168px"></div>  '+
                '<div class="tile" style="top:5px; left: 278px"></div>  '+
                '<div class="tile" style="top:5px; left: 333px"></div>  '+
                '<div class="tile" style="top:5px; left: 388px"></div>  '+
                '<div class="tile" style="top:30px; left: 58px"></div>  '+
                '<div class="tile" style="top:30px; left: 168px"></div> '+
                '<div class="tile" style="top:30px; left: 278px"></div> '+
                '<div class="tile" style="top:30px; left: 388px"></div> '+
                '<div class="tile" style="top:55px; left: 58px"></div>  '+
                '<div class="tile" style="top:55px; left: 113px"></div> '+
                '<div class="tile" style="top:55px; left: 168px"></div> '+
                '<div class="tile" style="top:55px; left: 388px"></div> '+
                '<div class="tile" style="top:80px; left: 58px"></div>  '+
                '<div class="tile" style="top:80px; left: 168px"></div> '+
                '<div class="tile" style="top:80px; left: 388px"></div> '+
                '<div class="tile" style="top:105px; left: 58px"></div> '+
                '<div class="tile" style="top:105px; left: 113px"></div>'+
                '<div class="tile" style="top:105px; left: 168px"></div>'+
                '<div class="tile" style="top:105px; left: 388px"></div>').appendTo('.game');
            } else {
                $('<div class="tile" style="background: #FF1E5E; top:5px; left: 168px"></div>  '+
                '<div class="tile" style="background: #FF1E5E; top:5px; left: 278px"></div>  '+
                '<div class="tile" style="background: #FF1E5E; top:30px; left: 113px"></div> '+
                '<div class="tile" style="background: #FF1E5E; top:30px; left: 168px"></div> '+
                '<div class="tile" style="background: #FF1E5E; top:30px; left: 223px"></div> '+
                '<div class="tile" style="background: #FF1E5E; top:30px; left: 278px"></div> '+
                '<div class="tile" style="background: #FF1E5E; top:30px; left: 333px"></div> '+
                '<div class="tile" style="background: #FF1E5E; top:55px; left: 113px"></div> '+
                '<div class="tile" style="background: #FF1E5E; top:55px; left: 168px"></div> '+
                '<div class="tile" style="background: #FF1E5E; top:55px; left: 223px"></div> '+
                '<div class="tile" style="background: #FF1E5E; top:55px; left: 278px"></div> '+
                '<div class="tile" style="background: #FF1E5E; top:55px; left: 333px"></div> '+
                '<div class="tile" style="background: #FF1E5E; top:80px; left: 168px"></div> '+
                '<div class="tile" style="background: #FF1E5E; top:80px; left: 223px"></div> '+
                '<div class="tile" style="background: #FF1E5E; top:80px; left: 278px"></div> '+
                '<div class="tile" style="background: #FF1E5E; top:105px; left: 223px"></div>').appendTo('.game');
            }
        }
    
        function CreateItem(knockTop, knockLeft, itemID) {
            
            switch (itemID) {
                case 0:
                    var item = $('<div class="item" style="z-index: 770; top:' + knockTop + 'px; left: ' + knockLeft + 
                    'px;"><div class="inItem" style="width:40px; height: 10px; background:#F00;"></div></div>').appendTo('.game');
                    break;
                case 1:
                    var item = $('<div class="item" style="z-index: 771; top:' + knockTop + 'px; left: ' + knockLeft + 
                    'px;"><div class="inItem" style="width:50px; height: 10px; background:#00F;"></div></div>').appendTo('.game');
                    break;
                case 2:
                    var item = $('<div class="item" style="z-index: 772; background: radial-gradient(circle at 65% 15%, ' + 
                    'white 1px, gray 3%, rgb(14, 14, 14) 60%, gray 100%); width:15px; height:15px;border-radius: 50%; top:' + 
                    knockTop + 'px; left: ' + knockLeft + 'px;"></div>').appendTo('.game');
                    break;
                case 3:
                    var item = $('<div class="item" style="z-index: 773; background: radial-gradient(circle at 65% 15%, white 1px, ' + 
                    'rgb(0, 255, 0) 3%, green 60%, rgb(0, 255, 0) 100%); width:35px; height:35px; border-radius: 50%; top:' + 
                    knockTop + 'px; left: ' + knockLeft + 'px;"></div>').appendTo('.game');
                    break;
                case 4:
                    var item = $('<div class="item" style="z-index: 774; background: radial-gradient(circle at 65% 15%, white 1px, rgb(255, 128, 0) 3%, ' + 
                    'rgb(255, 0, 0) 60%, rgb(255, 128, 0) 100%); width:25px; height:25px; border-radius: 50%; top:' + 
                    knockTop + 'px; left: ' + knockLeft + 'px;"></div>').appendTo('.game');
                    break;
                case 5:
                    var item = $('<div class="item" style="z-index: 775; width:30px; height:30px; top:' + knockTop + 'px; left: ' + knockLeft + 'px;">' + 
                    '<div class="inItem" style="background: #222; top: 12px; transform: rotate(45deg); width:30px; height:5px;">' + 
                    '<div class="inItem" style="background: #222; top: 0px; transform: rotate(90deg); width:30px; height:5px;">' +
                    '</div></div></div>').appendTo('.game');
                    break;
                case 6:
                    var item = $('<div class="item" style="color: #00F;font-weight: 1000; z-index: 776; width:20px; height:20px; top:' + 
                    knockTop + 'px; left: ' + knockLeft + 'px; background: aqua; border-radius:50%"></div>').appendTo('.game');
                    $('<span style="position: absolute; margin: -2px 0 0 3px;">+</span>').appendTo(item);
                    break;
                case 7:
                    var item = $('<div class="item" style="color: #F00;font-weight: 1000; z-index: 777; width:20px; height:20px; top:' + 
                    knockTop + 'px; left: ' + knockLeft + 'px; background: pink; border-radius:50%"></div>').appendTo('.game');
                    $('<span style="position: absolute; margin: -2px 0 0 6px;">-</span>').appendTo(item);
                    break;
                case 8:
                    var item = $('<div class="item" style="z-index: 778; background: radial-gradient(circle at 50% 50%, white 1px, rgb(255, 128, 0) 20%, ' + 
                    'rgb(255, 0, 0) 100%, rgb(255, 128, 0) 80%); width:25px; height:25px; border-radius: 50%; top:' + 
                    knockTop + 'px; left: ' + knockLeft + 'px;"><div style="display: block; position: absolute; width: 5px;' +
                    'height: 20px; border-radius: 50%; background: #AB0000; margin: 2px 0 0 10px"></div></div>').appendTo('.game');
                    break;
                default:
                    alert('Oops! Something error! Please refresh the page.');
                    break;
            }
        }
    
        //▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼道具效果
        function DecreaseBoardWidth() {
            if (+$(".board").css("width").substring(0,$('.board').css("width").search('px')) > 20) {
                $('.board').css({
                    "width" : +$(".board").css("width").substring(0,$('.board').css("width").search('px')) - 20 + "px"
                });
            }
            score += 30;
        }
    
        function IncreaseBoardWidth() {
            if (+$(".board").css("width").substring(0,$('.board').css("width").search('px')) < 500) {
                $('.board').css({
                    "width" : +$(".board").css("width").substring(0,$('.board').css("width").search('px')) + 20 + "px"
                });
            }
            score += 50;
        }
        
        function DecreaseBallSize() {
            if (+$(".ball").css("width").substring(0,$('.ball').css("width").search('px')) > 5) {
                $('.ball').css({
                    "width" : +$(".ball").css("width").substring(0,$('.ball').css("width").search('px')) - 5 + "px",
                    "height" : +$(".ball").css("height").substring(0,$('.ball').css("height").search('px')) - 5 + "px"
                });
            }
            fixedSpeed += 0.1;
            score += 30;
        }
    
        function IncreaseBallSize() {
            if (+$(".ball").css("width").substring(0,$('.ball').css("width").search('px')) < 50) {
                $('.ball').css({
                    "width" : +$(".ball").css("width").substring(0,$('.ball').css("width").search('px')) + 5 + "px",
                    "height" : +$(".ball").css("height").substring(0,$('.ball').css("height").search('px')) + 5 + "px"
                });
            }
            if (fixedSpeed > 1) {
                fixedSpeed -= 0.05;
            }
            score += 50;
        }
    
        function FireballOn() {
            $('.ball').css({
                "background" : "radial-gradient(circle at 65% 15%, white 1px, rgb(255, 128, 0) 3%, rgb(255, 0, 0) 60%, rgb(255, 128, 0) 100%)"
            });
            fireballTimer = 0;
            isFireball = true;
            score += 20;
        }
    
        function Die() {
            isDying = true;
        }
    
        function IncreaseBallSpeed() {
            fixedSpeed ++;
            verticalSpeed *= (fixedSpeed / (fixedSpeed - 1));
            horizontalSpeed *= (fixedSpeed / (fixedSpeed - 1));
            score += 50;
        }
    
        function DecreaseBallSpeed() {
            if (fixedSpeed > 1.5) {
                fixedSpeed --;
                verticalSpeed *= (fixedSpeed / (fixedSpeed + 1));
                horizontalSpeed *= (fixedSpeed / (fixedSpeed + 1));
            }
            score += 30;
        }
    
        function ShootGun() {
            canShoot = true;
    
            $('.leftGun').css({
                "display" : "block"
            });
    
            $('.rightGun').css({
                "display" : "block"
            });
            score += 50;
            shootItemCount ++;
        }
    
    
        //★★★被動Function★★★
        function FireballOff() {
            $('.ball').css({
                "background" : "radial-gradient(circle at 65% 15%, white 1px, aqua 3%, darkblue 60%, aqua 100%)"
            });
        }
    
        function DisplayBestScore() {
            if (localStorage.getItem("BestScore") != null) {            
                $('.displayBestScore').text('Best Score: ' + localStorage.getItem("BestScore"));
            } else {
                $('.displayBestScore').text('Best Score: 0');
            }
        }
    
    });
})


