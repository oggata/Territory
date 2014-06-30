//
//  EnemyBody.js
//  Territory
//
//  Created by Fumitoshi Ogata on 5/30/14.
//  Copyright (c) 2014 http://oggata.github.io All rights reserved.
//
var EnemyBody = cc.Node.extend({
    ctor:function (game,code,enemy) {
        this._super();
        this.game     = game;
        this.storage  = this.game.storage;
        this.enemy    = enemy;
        this.code     = code;
        this.initializeParam(code);
        this.initSprite();
        if(CONFIG.DEBUG_FLAG == 1){
            this.cube = cc.LayerColor.create(cc.c4b(0,255,0,255),5,5);
            this.addChild(this.cube,999);
        }
    },

    initializeParam:function(code){
        this.direction       = "front";
        this.imagePath       = s_enemy_snake_body_m;
        this.imgWidth        = 111;
        this.imgHeight       = 78;
        //歩行方向
        this.beforeX         = this.getPosition().x;
        this.beforeY         = this.getPosition().y;
        this.directionCnt    = 0;
    },

    update:function() {
        //何もない場合
        if(this.enemy.type == "none"){
        }

        //ヘビのときの動き
        if(this.enemy.type == "snake"){
            var track = this.enemy.trackSnakes[this.code];
            if(track.getPosition().x > this.getPosition().x){
                this.setPosition(this.getPosition().x + this.enemy.walkSpeed * 2,this.getPosition().y);
            }
            if(track.getPosition().x < this.getPosition().x){
                this.setPosition(this.getPosition().x - this.enemy.walkSpeed * 2,this.getPosition().y);
            }
            if(track.getPosition().y > this.getPosition().y){
                this.setPosition(this.getPosition().x,this.getPosition().y + this.enemy.walkSpeed * 2);
            }
            if(track.getPosition().y < this.getPosition().y){
                this.setPosition(this.getPosition().x,this.getPosition().y - this.enemy.walkSpeed * 2);
            }
        }

        //クラゲのときの動き
        if(this.enemy.type == "jellyfish"){
            var track = this.enemy.trackJellyFishes[this.code].rollingCube;
            this.setPosition(
                track.getPosition().x + this.enemy.getPosition().x,
                track.getPosition().y + this.enemy.getPosition().y
            );
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