//
//  TutolialLayer.js
//  Territory
//
//  Created by Fumitoshi Ogata on 5/30/14.
//  Copyright (c) 2014 http://oggata.github.io All rights reserved.
//

var TutolialLayer = cc.Layer.extend({

    ctor:function () {
        this._super();
        //this.storage  = storage;
    },

    init:function () {

        var bRet = false;
        if (this._super()) {
            //bgm
            //playSystemBGM();
            changeLoadingImage();

            //back
            var story = cc.Sprite.create(s_story_001);
            story.setAnchorPoint(0,0);
            story.setPosition(0,210);
            this.addChild(story);

            //story
            this.storyNo = 1;
            this.infoText = cc.LabelTTF.create("test","Arial",15);
            this.infoText.setAnchorPoint(0,0);
            this.infoText.setPosition(50,80);
            this.addChild(this.infoText);
            this.changeText(this.storyNo);

            //new game
            this.nextButton = new ButtonItem("NEXT",200,40,this.onNextStory,this);
            this.nextButton.setPosition(320/2,60);
            this.addChild(this.nextButton);

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
    },

    onNextStory : function(){
        this.storyNo++;
        this.changeText(this.storyNo);
        if(this.storyNo == 14){
            onBackCallback();
        }
    },

    changeText: function(num){
        var rtn = "";
        if(num == 1){
            rtn += "[1/6]\n";
            rtn += "\n";
            rtn += "西暦30xx年、\n";
            rtn += "核戦争によって人類は滅亡した。\n";
            rtn += "残されたのは荒廃した土地..\n";
            rtn += "\n";            
        }else if(num == 2){
            rtn += "[2/6]\n";
            rtn += "\n";
            rtn += "その土地には\n";
            rtn += "悪の宇宙人が住みつき、\n";
            rtn += "再びこの場所に生命が育まれるのは\n";
            rtn += "不可能と思われた\n";
        }else if(num == 3){
            rtn += "[3/6]\n";
            rtn += "\n";
            rtn += "ところが、長い時を経て、\n";
            rtn += "新緑の持つ生命が息を吹き返した。\n";   
            rtn += "新しい生命をこの土地に育む為に、\n";
            rtn += "荒廃した土地を取り戻せ。\n";        
        }else if(num == 4){
            rtn += "[4/6]\n";
            rtn += "\n";
            rtn += "唯一の方法は、集団で戦うこと。\n";
            rtn += "\n";
            rtn += "\n";
            rtn += "\n";
        }else if(num == 5){
            rtn += "[5/6]\n";
            rtn += "\n";
            rtn += "荒廃した土地を緑に変えることで\n";
            rtn += "得られる「エネルギー」を吸収し、\n";
            rtn += "緑の人を増やして宇宙人を討伐せよ\n";
            rtn += "\n";
        }else if(num == 6){
            rtn += "[6/6]\n";
            rtn += "\n";
            rtn += "再び緑豊かに緑の息吹が\n";
            rtn += "生き返るその日まで...\n";
            rtn += "\n";
            rtn += "\n";
        }else if(num == 7){
            rtn += "[操作説明 1/7]\n";
            rtn += "\n";
            rtn += "画面をタップすると\n";
            rtn += "緑の人が移動します。\n";
            rtn += "荒廃した土地の上にいる場合\n";
            rtn += "一定時間で緑を取り戻します。\n";
        }else if(num == 8){
            rtn += "[操作説明 2/7]\n";
            rtn += "\n";
            rtn += "緑を取り戻したときに\n";
            rtn += "大地のエネルギーが生成され、\n";
            rtn += "これを取得すると\n";
            rtn += "左下の瓶に溜まります\n";
        }else if(num == 9){
            rtn += "[操作説明 3/7]\n";
            rtn += "\n";
            rtn += "瓶に蓄えられた\n";
            rtn += "大地のエネルギーは\n";
            rtn += "ボタンを押すことで\n";
            rtn += "緑の人を生み出すことができます\n";
        }else if(num == 10){
            rtn += "[操作説明 4/7]\n";
            rtn += "\n";
            rtn += "緑の人が増えれば増えるほど\n";
            rtn += "土地を取り戻す力や\n";
            rtn += "宇宙人を攻撃する力が\n";
            rtn += "増加します\n";
        }else if(num == 11){
            rtn += "[操作説明 5/7]\n";
            rtn += "\n";
            rtn += "アイテムの土地を\n";
            rtn += "占領することで\n";
            rtn += "特殊な力を得ることも\n";
            rtn += "できます\n";
        }else if(num == 12){
            rtn += "[操作説明 6/7]\n";
            rtn += "\n";
            rtn += "一度、占領した土地は\n";
            rtn += "宇宙人が再び取り戻そうと\n";
            rtn += "してくるので\n";
            rtn += "適度に倒しながら進めて下さい\n";
        }else if(num == 13){
            rtn += "[操作説明 7/7]\n";
            rtn += "\n";
            rtn += "おしまい\n";
            rtn += "\n";
            rtn += "\n";
        }
        this.infoText.setString(rtn);
    }
});

TutolialLayer.scene = function () {
    var scene = cc.Scene.create();
    var layer = TutolialLayer.create();
    scene.addChild(layer);
    return scene;
};

TutolialLayer.create = function () {
    var sg = new TutolialLayer();
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};
