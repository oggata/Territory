//
//  Enemy.js
//  Territory
//
//  Created by Fumitoshi Ogata on 5/30/14.
//  Copyright (c) 2014 http://oggata.github.io All rights reserved.

var Enemy = cc.Node.extend({
    ctor:function (game,code,depX,depY) {
        this._super();
        this.game    = game;
        this.storage = this.game.storage;
        this.depX    = depX;
        this.depY    = depY;
        //HPゲージ
        this.gauge = new Gauge(30,4,'red');
        this.gauge.setPosition(-20,20);
        this.addChild(this.gauge,100);
        //initialize
        this.initializeParam(code);
        this.initSprite();
        this.update();
    },

    loadEnemyJson : function() {
        var jsonFile = cc.FileUtils.getInstance().getStringFromFile(enemy_json);
        this.dict    = JSON.parse(jsonFile);
        return this.dict["enemies"];
    },

    initializeParam:function(code){
        var data             = this.loadEnemyJson();
        var jsonData         = data[code];
        this.hp              = jsonData["hp"];
        this.maxHp           = jsonData["hp"];
        this.attack          = jsonData["attack"];
        this.defence         = jsonData["defence"];
        this.imagePath       = jsonData["image"];
        this.imgWidth        = jsonData["image_width"];
        this.imgHeight       = jsonData["image_height"];
        this.walkSpeed       = jsonData["walk_speed"];
        this.type            = jsonData["type"];
        this.bullet          = jsonData["bullet"];
        this.walkRangeX      = jsonData["eye_sight"];
        this.walkRangeY      = jsonData["eye_sight"];
        this.eyeSight        = jsonData["eye_sight"];
        this.trackNum        = jsonData["track_num"];
        this.direction       = "front";
        this.damangeTexts    = new Array();
        this.isDamaged       = false;
        this.battleIntervalToPlayer     = 0;
        this.battleIntervalToColleague  = 0;
        this.walkDistination = new Array();
        this.waklDistSeqNum  = 0;

        //歩行方向
        this.beforeX         = this.getPosition().x;
        this.beforeY         = this.getPosition().y;
        this.directionCnt    = 0;
        //ダメージ表示
        this.flashCnt          = 0;
        this.isCharaVisible    = true;
        this.damageCnt         = 0;
        this.isDamageOn        = false;
        //弾丸発射用
        this.bulletLncTime     = 0;
        this.bulletLncMaxTime  = 30 * 2;

        this.cockroachTime      = 0;
        this.cockroachActiveFlg = 0;
        this.cockroachDistX     = 0;
        this.cockroachDistY     = 0

        //軌跡（ヘビ型)
        this.trackSnakeInterval = 0;
        this.trackSnakes = [];
        for(var i=0;i<this.trackNum;i++){
            var track = new Track(i,this,this.game);
            this.game.mapNode.addChild(track);
            this.trackSnakes.push(track);
        }

        //軌跡（クラゲ型)
        this.trackJellyFishes = new Array();
        for (var i=0 ; i < 18 ; i++){
            this.cube = new Cube(i,20,120);
            this.trackJellyFishes.push(this.cube);
            this.addChild(this.cube,999);
        }

        //キャラクターの胴体を作成する
        this.enemyBodies = [];
        var bodyCnt = 0;
        if(this.type == "snake"){
            bodyCnt = this.trackSnakes.length;
        }
        if(this.type == "jellyfish"){
            bodyCnt = 18;
        }
        for(var i=0;i<bodyCnt;i++){
            var eBody = new EnemyBody(this.game,i,this);
            this.game.mapNode.addChild(eBody);
            eBody.setPosition(
                this.depX,this.depY
            );
            this.enemyBodies.push(eBody);
        }
    },

    addFlashCnt:function(){
        this.flashCnt++;
        if(this.flashCnt>=3){
            this.flashCnt=0;
            if(this.isCharaVisible == true){
                this.isCharaVisible = false;
                this.sprite.setOpacity(255*0.2);
            }else{
                this.isCharaVisible = true;
                this.sprite.setOpacity(255*1);
            }
        }
    },

    update:function() {
        //body
        for(var i=0;i<this.enemyBodies.length;i++){
            this.enemyBodies[i].update();
            this.game.mapNode.reorderChild(
                this.enemyBodies[i],
                Math.floor(this.game.mapHeight - this.enemyBodies[i].getPosition().y)
            );
        }

        //cubes
        for(var i=0;i<this.trackJellyFishes.length;i++){
            this.trackJellyFishes[i].update();
        }

        //自身が通った座標の履歴
        this.trackSnakeInterval++;
        if(this.trackSnakeInterval >= 15){
            this.trackSnakeInterval=0;
            //add
            var track = new Track(1,this,this.game);
            this.game.mapNode.addChild(track);
            track.setPosition(
                this.getPosition().x,
                this.getPosition().y
            );
            this.trackSnakes.push(track);
            //remove
            this.game.mapNode.removeChild(this.trackSnakes[0]);
            this.trackSnakes.splice(0,1);
        }

        //bulletが有効の場合は弾を発射する
        if(this.bullet == "fire"){
            this.bulletLncTime++;
            if(this.bulletLncTime >= this.bulletLncMaxTime){
                this.bulletLncTime = 0;
                this.game.addEnemyBullet(this);
            }
        }

        //ダメージを受けた場合は、透過で点滅する
        if(this.isDamageOn == true){
            this.addFlashCnt();
            this.damageCnt++;
            if(this.damageCnt>=40){
                this.damageCnt = 0;
                this.isDamageOn = false;
                this.sprite.setOpacity(255*1);
            }
        }

        var distance = cc.pDistance(
            this.game.player.getPosition(),
            this.getPosition()
        );

        if(this.type == "cockroach"){
            this.cockroachTime++;
            if(this.cockroachTime >= 90){
                this.cockroachTime = 0;
                if(this.cockroachActiveFlg == 0){
                    this.cockroachActiveFlg = 1;
                    this.cockroachDistX = this.game.player.trackSnakes[3].getPosition().x;
                    this.cockroachDistY = this.game.player.trackSnakes[3].getPosition().y;
                }else{
                    this.cockroachActiveFlg = 0;
                }
            }
            if(this.cockroachActiveFlg == 1){
                var dX = this.cockroachDistX - this.getPosition().x;
                var dY = this.cockroachDistY - this.getPosition().y;
                var distX = Math.abs(dX);
                var distY = Math.abs(dY);
                var speedX = 8;
                var speedY = 8;
                if(distX < 8){speedX = distX;}
                if(distY < 8){speedY = distY;}
                if(dX>0){
                    this.setPosition(this.getPosition().x + speedX, this.getPosition().y);
                }
                if(dX<0){
                    this.setPosition(this.getPosition().x - speedX, this.getPosition().y);
                }
                if(dY>0){
                    this.setPosition(this.getPosition().x, this.getPosition().y + speedY);
                }
                if(dY<0){
                    this.setPosition(this.getPosition().x, this.getPosition().y - speedY);
                }
            }
        }else if(this.type == "snake" || this.type == "jellyfish"){
            /*
            var rCubePos = this.game.stageRollingCube.getMapPosition();
            this.setPosition(
                rCubePos[0],
                rCubePos[1]
            );
            */
            //playerが視界に入ったらプレイヤーを攻撃する
            if(distance <= 150){
                var dX = this.game.player.getPosition().x - this.getPosition().x;
                var dY = this.game.player.getPosition().y - this.getPosition().y;
                if(dX>0){
                    this.setPosition(this.getPosition().x + this.walkSpeed, this.getPosition().y);
                }
                if(dX<0){
                    this.setPosition(this.getPosition().x - this.walkSpeed, this.getPosition().y);
                }
                if(dY>0){
                    this.setPosition(this.getPosition().x, this.getPosition().y + this.walkSpeed);
                }
                if(dY<0){
                    this.setPosition(this.getPosition().x, this.getPosition().y - this.walkSpeed);
                }
            }else{
                //円の軌道で回りつづける
                var rCubePos = this.game.stageRollingCube.getMapPosition();
                var dX = rCubePos[0] - this.getPosition().x;
                var dY = rCubePos[1] - this.getPosition().y;
                if(dX>0){
                    this.setPosition(this.getPosition().x + this.walkSpeed, this.getPosition().y);
                }
                if(dX<0){
                    this.setPosition(this.getPosition().x - this.walkSpeed, this.getPosition().y);
                }
                if(dY>0){
                    this.setPosition(this.getPosition().x, this.getPosition().y + this.walkSpeed);
                }
                if(dY<0){
                    this.setPosition(this.getPosition().x, this.getPosition().y - this.walkSpeed);
                }
            }
        }else{
            if(distance <= this.eyeSight){
                var dX = this.game.player.getPosition().x - this.getPosition().x;
                var dY = this.game.player.getPosition().y - this.getPosition().y;
                if(dX>0){
                    this.setPosition(this.getPosition().x + this.walkSpeed, this.getPosition().y);
                }
                if(dX<0){
                    this.setPosition(this.getPosition().x - this.walkSpeed, this.getPosition().y);
                }
                if(dY>0){
                    this.setPosition(this.getPosition().x, this.getPosition().y + this.walkSpeed);
                }
                if(dY<0){
                    this.setPosition(this.getPosition().x, this.getPosition().y - this.walkSpeed);
                }

            }else{
                if(this.game.stage.enemyTargetChip == null){
                    //ターゲットのマップがない場合は、プレイヤーを目指して歩く
                    var dX = this.game.player.getPosition().x - this.getPosition().x;
                    var dY = this.game.player.getPosition().y - this.getPosition().y;
                    if(dX>0){
                        this.setPosition(this.getPosition().x + this.walkSpeed, this.getPosition().y);
                    }
                    if(dX<0){
                        this.setPosition(this.getPosition().x - this.walkSpeed, this.getPosition().y);
                    }
                    if(dY>0){
                        this.setPosition(this.getPosition().x, this.getPosition().y + this.walkSpeed);
                    }
                    if(dY<0){
                        this.setPosition(this.getPosition().x, this.getPosition().y - this.walkSpeed);
                    }
                }else{
                    //ターゲットのマップがある場合は、マップの位置を目指して歩く
                    var dX = this.getPosition().x - this.game.stage.enemyTargetChip.getPosition().x;
                    var dY = this.getPosition().y - this.game.stage.enemyTargetChip.getPosition().y;

                    if(dX>0){
                        this.setPosition(this.getPosition().x - this.walkSpeed, this.getPosition().y);
                    }
                    if(dX<0){
                        this.setPosition(this.getPosition().x + this.walkSpeed, this.getPosition().y);
                    }
                    if(dY>0){
                        this.setPosition(this.getPosition().x, this.getPosition().y - this.walkSpeed);
                    }
                    if(dY<0){
                        this.setPosition(this.getPosition().x, this.getPosition().y + this.walkSpeed);
                    }
                    if((dX==0)&&(dY==0)){
                        this.waklDistSeqNum+=1;
                        if(this.waklDistSeqNum>2){
                            this.waklDistSeqNum = 0;
                        }
                    } 
                }
            }
        }
        this.gauge.update(this.hp/this.maxHp);

        //HPが0になった場合は死ぬ
        if(this.hp == 0){
            this.remove();
            return false;
        }

        //ダメージを受けたら表示する漫画テキスト
        for(var i=0;i<this.damangeTexts.length;i++){
            if(this.damangeTexts[i].update() == false){
                //ここでRemoveしないと、spriteがどんどん増えていく
                this.removeChild(this.damangeTexts[i]);
                this.damangeTexts.splice(i, 1);
            }
        }

        //方向制御
        this.directionCnt++;
        if(this.directionCnt >= 5){
            this.directionCnt = 0;
            this.setDirection(this.beforeX,this.beforeY);
            this.beforeX = this.getPosition().x;
            this.beforeY = this.getPosition().y;
        }

        return true;
    },

    setDirection:function(DX,DY){
        //横の距離が大きいとき
        var diffX = Math.floor(this.getPosition().x - DX);
        var diffY = Math.floor(this.getPosition().y - DY);
        if(diffX > 0 && diffY > 0){
            this.walkRightUp();
        }
        if(diffX > 0 && diffY < 0){
            this.walkRightDown();
        }
        if(diffX < 0 && diffY > 0){
            this.walkLeftUp();
        }
        if(diffX < 0 && diffY < 0){
            this.walkLeftDown();
        }
    },

    remove:function() {
        this.removeChild(this.sprite);
        this.removeChild(this.gauge);
        /*
        //damage text
        for(var i=0;i<this.damangeTexts.length;i++){
            this.removeChild(this.damangeTexts[i]);
        }*/
    },

    getNearistColleague:function(){
        var colleague = null;
        for(var i=0;i<this.game.colleagues.length;i++){
            var distance = cc.pDistance(
                this.getPosition(),
                this.game.colleagues[i].getPosition()
            );
            if(distance <= 150){
                colleague = this.game.colleagues[i];
            }
        }
        return colleague;
    },

    damage:function(damagePoint) {
        playSE(s_se_attack);

        this.hp = this.hp - damagePoint;
        if(this.hp < 0){
            this.hp = 0;
        }
        
        this.damageText = new DamageText();
        this.addChild(this.damageText,5);
        this.damangeTexts.push(this.damageText);

        this.isDamageOn = true;
    },

    initSprite:function(){
        //足下の影
        this.shadow = cc.Sprite.create(s_shadow);
        this.shadow.setPosition(0,-20);
        this.shadow.setOpacity(255*0.4);
        this.addChild(this.shadow);

        var frameSeq = [];
        for (var i = 0; i < 3; i++) {
            var frame = cc.SpriteFrame.create(this.imagePath,cc.rect(this.imgWidth*i,this.imgHeight*0,this.imgWidth,this.imgHeight));
            frameSeq.push(frame);
        }
        this.wa = cc.Animation.create(frameSeq,0.2);
        this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
        this.sprite = cc.Sprite.create(this.imagePath,cc.rect(0,0,this.imgWidth,this.imgHeight));
        this.sprite.runAction(this.ra);
        this.addChild(this.sprite);

        //デバッグ
        if(CONFIG.DEBUG_FLAG==1){
            this.sigh = cc.LayerColor.create(cc.c4b(255,0,0,255),3,3);
            this.sigh.setPosition(0,0);
            this.addChild(this.sigh);
        }
    },

    walkLeftDown:function(){
        if(this.direction != "front"){
            this.direction = "front";
            this.sprite.stopAllActions();
            var frameSeq = [];
            for (var i = 0; i < 3; i++) {
                var frame = cc.SpriteFrame.create(this.imagePath,cc.rect(this.imgWidth*i,this.imgHeight*0,this.imgWidth,this.imgHeight));
                frameSeq.push(frame);
            }
            this.wa = cc.Animation.create(frameSeq,0.2);
            this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
            this.sprite.runAction(this.ra);
        }
    },

    walkRightDown:function(){
        if(this.direction != "left"){
            this.direction = "left";
            this.sprite.stopAllActions();
            var frameSeq = [];
            for (var i = 0; i < 3; i++) {
                var frame = cc.SpriteFrame.create(this.imagePath,cc.rect(this.imgWidth*i,this.imgHeight*1,this.imgWidth,this.imgHeight));
                frameSeq.push(frame);
            }
            this.wa = cc.Animation.create(frameSeq,0.2);
            this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
            this.sprite.runAction(this.ra);
        }
    },

    walkLeftUp:function(){
        if(this.direction != "right"){
            this.direction = "right";
            this.sprite.stopAllActions();
            var frameSeq = [];
            for (var i = 0; i < 3; i++) {
                var frame = cc.SpriteFrame.create(this.imagePath,cc.rect(this.imgWidth*i,this.imgHeight*2,this.imgWidth,this.imgHeight));
                frameSeq.push(frame);
            }
            this.wa = cc.Animation.create(frameSeq,0.2);
            this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
            this.sprite.runAction(this.ra);
        }
    },

    walkRightUp:function(){
        if(this.direction != "back"){
            this.direction = "back";
            this.sprite.stopAllActions();
            var frameSeq = [];
            for (var i = 0; i < 3; i++) {
                var frame = cc.SpriteFrame.create(this.imagePath,cc.rect(this.imgWidth*i,this.imgHeight*3,this.imgWidth,this.imgHeight));
                frameSeq.push(frame);
            }
            this.wa = cc.Animation.create(frameSeq,0.2);
            this.ra = cc.RepeatForever.create(cc.Animate.create(this.wa));
            this.sprite.runAction(this.ra);
        }
    },
});