//
//  Track.js
//  Territory
//
//  Created by Fumitoshi Ogata on 5/30/14.
//  Copyright (c) 2014 http://oggata.github.io All rights reserved.
//

var Track = cc.Node.extend({
    ctor:function (num,enemy,game) {
        this._super();
        this.charactor   = enemy;
        this.num         = num;
        this.game        = game;
        this.enemy       = enemy;
        if(CONFIG.DEBUG_FLAG == 1){
            this.rollingCube = cc.LayerColor.create(cc.c4b(0,255,0,255),5,5);
            this.addChild(this.rollingCube,999);
        }
        this.setPosition(
            this.enemy.depX,
            this.enemy.depY
        );
    }
});
