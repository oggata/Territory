//
//  Cube.js
//  Territory
//
//  Created by Fumitoshi Ogata on 5/30/14.
//  Copyright (c) 2014 http://oggata.github.io All rights reserved.
//

var Cube3 = cc.Node.extend({
    ctor:function (num) {
        this._super();
        this.eyeSightRange = 170;
        if(CONFIG.DEBUG_FLAG == 1){
            this.alpha = 255 * 1;
        }else{
            this.alpha = 255 * 0;
        }
        this.cube = cc.LayerColor.create(cc.c4b(255,0,0,this.alpha),5,5);
        this.addChild(this.cube,999);
        this.cubeAngle   = num * 20;
        //出発地点の座標を取得する為に１度実行する
        this.update();
    },

    init:function () {
    },

    update:function() {
        //update rolling cube
        this.cubeAngle+=0.5;
        if(this.cubeAngle>=360){
            this.cubeAngle = 0;
        }
        var cubeRad = this.cubeAngle * Math.PI / 180;
        var cubeX = this.eyeSightRange * Math.cos(cubeRad) + 0;
        var cubeY = this.eyeSightRange * Math.sin(cubeRad) + 0;
        this.cube.setPosition(cubeX,cubeY);
    },

    getMapPosition:function() {
        return [
            this.cube.getPosition().x + this.getPosition().x,
            this.cube.getPosition().y + this.getPosition().y
        ];
    }
});
