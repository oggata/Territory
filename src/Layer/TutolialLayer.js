//
//  TutolialLayer.js
//  Territory
//
//  Created by Fumitoshi Ogata on 5/30/14.
//  Copyright (c) 2014 http://oggata.github.io All rights reserved.
//

var TutolialLayer = cc.Layer.extend({

    ctor:function (storage) {
        this._super();
        this.storage  = storage;
    },

    init:function () {

        var bRet = false;
        if (this._super()) {

            //ローディング画像を変更
            var loaderScene = new cc.LoaderScene();
            loaderScene.init();
            loaderScene._logoTexture.src = "res/loading.png";
            loaderScene._logoTexture.width  = 100;
            loaderScene._logoTexture.height = 100;
            cc.LoaderScene._instance = loaderScene;
            this.infoTextPosX = 10;
            this.infoTextPosY = -400;

            //bgm
            playSystemBGM();

            var rtn = "";
            rtn += "\n";
            rtn += "\n";
            rtn += "ALL STAGE CLEAR !!\n";
            rtn += "CONGRATULATIONS\n";
            rtn += "\n";
            rtn += "\n";
            rtn += "STAFF ROLE";
            rtn += "\n";
            rtn += "\n";
            rtn += "\n";
            rtn += "\n";
            rtn += "\n";
            rtn += "GAME CHARACTER DESIGN\n";
            rtn += "ひみつ(Urochi)\n";
            rtn += "http://uros.web.fc2.com\n";
            rtn += "\n";
            rtn += "\n";
            rtn += "MUSIC & SOUND\n";
            rtn += "魔王魂\n";
            rtn += "http://maoudamashii.jokersounds.com\n";
            rtn += "\n";
            rtn += "\n";
            rtn += "PHOTO\n";
            rtn += "ゆんフリー写真素材集\n";
            rtn += "http://www.yunphoto.net\n";
            rtn += "\n";
            rtn += "\n";
            rtn += "\n";
            rtn += "DIRECTOR & PROGRAMMER\n";
            rtn += "OGGATA\n";
            rtn += "http://oggata.github.io/\n";
            rtn += "\n";
            rtn += "\n";
            rtn += "\n";

            this.infoText = cc.LabelTTF.create(rtn,"Arial",15);
            this.infoText.setAnchorPoint(0,0);
            this.infoText.setPosition(this.infoTextPosX,this.infoTextPosY);
            this.addChild(this.infoText);
 
            //ホームボタン
            var homeButton = cc.MenuItemImage.create(
                s_home_button,
                s_home_button_on,
                onBackCallback,
                this
            );
            homeButton.setAnchorPoint(0,0);
            homeButton.setPosition(250,410);

            //set header
            this.menu = cc.Menu.create(
                homeButton
            );
            this.addChild(this.menu);
            this.menu.setPosition(0,0);

            bRet = true;
        }

        return bRet;
    }
});

ResultLayer.create = function (storage) {
    var sg = new ResultLayer(storage);
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};
