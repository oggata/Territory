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
            this.rtn = "";
            this.textDisplayTime = 0;
            this.textDisplayNum = 0;
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


            this.scheduleUpdate();
            this.setTouchEnabled(true);

            bRet = true;
        }
        return bRet;
    },

    update:function(dt){
        this.textDisplayTime++;
        if(this.textDisplayTime>=5){
            this.textDisplayTime = 0;
            this.textDisplayNum++;
        }
    
        var displayText = this.rtn.substring(0,this.textDisplayNum);
        this.infoText.setString(displayText);
    },

    onNextStory : function(){

        this.storyNo++;
        this.changeText(this.storyNo);
        if(this.storyNo == 14){
            onBackCallback();
        }
    },

    changeText: function(num){
        this.textDisplayTime=0;
        this.textDisplayNum =0;

        if(num == 1){
            this.rtn = "";
            this.rtn += "[1/6]\n";
            this.rtn += "\n";
            this.rtn += "西暦30xx年、\n";
            this.rtn += "核戦争によって人類は滅亡した。\n";
            this.rtn += "残されたのは荒廃した土地..\n";
            this.rtn += "\n";            
        }else if(num == 2){
            this.rtn = "";
            this.rtn += "[2/6]\n";
            this.rtn += "\n";
            this.rtn += "その土地には\n";
            this.rtn += "悪の宇宙人が住みつき、\n";
            this.rtn += "再びこの場所に生命が育まれるのは\n";
            this.rtn += "不可能と思われた\n";
        }else if(num == 3){
            this.rtn = "";
            this.rtn += "[3/6]\n";
            this.rtn += "\n";
            this.rtn += "ところが、長い時を経て、\n";
            this.rtn += "新緑の持つ生命が息を吹き返した。\n";   
            this.rtn += "新しい生命をこの土地に育む為に、\n";
            this.rtn += "荒廃した土地を取り戻せ。\n";        
        }else if(num == 4){
            this.rtn = "";
            this.rtn += "[4/6]\n";
            this.rtn += "\n";
            this.rtn += "唯一の方法は、集団で戦うこと。\n";
            this.rtn += "\n";
            this.rtn += "\n";
            this.rtn += "\n";
        }else if(num == 5){
            this.rtn = "";
            this.rtn += "[5/6]\n";
            this.rtn += "\n";
            this.rtn += "荒廃した土地を緑に変えることで\n";
            this.rtn += "得られる「大地エナジー」を吸収し、\n";
            this.rtn += "緑の人を増やして宇宙人を討伐せよ\n";
            this.rtn += "\n";
        }else if(num == 6){
            this.rtn = "";
            this.rtn += "[6/6]\n";
            this.rtn += "\n";
            this.rtn += "再び緑豊かに緑の息吹が\n";
            this.rtn += "生き返るその日まで...\n";
            this.rtn += "\n";
            this.rtn += "\n";
        }else if(num == 7){
            this.rtn = "";
            this.rtn += "[操作説明 1/7]\n";
            this.rtn += "\n";
            this.rtn += "画面をタップすると\n";
            this.rtn += "緑の人が移動します。\n";
            this.rtn += "荒廃した土地の上にいる場合\n";
            this.rtn += "一定時間で緑を「復元」します。\n";
        }else if(num == 8){
            this.rtn = "";
            this.rtn += "[操作説明 2/7]\n";
            this.rtn += "\n";
            this.rtn += "緑を取り戻したときに\n";
            this.rtn += "「大地エナジー」が生成され、\n";
            this.rtn += "これを取得すると\n";
            this.rtn += "左下の瓶に溜まります\n";
        }else if(num == 9){
            this.rtn = "";
            this.rtn += "[操作説明 3/7]\n";
            this.rtn += "\n";
            this.rtn += "瓶に蓄えられた\n";
            this.rtn += "大地のエネルギーは\n";
            this.rtn += "ボタンを押すことで\n";
            this.rtn += "緑の人を生み出すことができます\n";
        }else if(num == 10){
            this.rtn = "";
            this.rtn += "[操作説明 4/7]\n";
            this.rtn += "\n";
            this.rtn += "緑の人が増えれば増えるほど\n";
            this.rtn += "土地を取り戻す力や\n";
            this.rtn += "宇宙人を攻撃する力が\n";
            this.rtn += "増加します\n";
        }else if(num == 11){
            this.rtn = "";
            this.rtn += "[操作説明 5/7]\n";
            this.rtn += "\n";
            this.rtn += "アイテムの土地を\n";
            this.rtn += "占領することで\n";
            this.rtn += "特殊な力を得ることも\n";
            this.rtn += "できます\n";
        }else if(num == 12){
            this.rtn = "";
            this.rtn += "[操作説明 6/7]\n";
            this.rtn += "\n";
            this.rtn += "一度、占領した土地は\n";
            this.rtn += "宇宙人が再び取り戻そうと\n";
            this.rtn += "してくるので\n";
            this.rtn += "適度に倒しながら進めて下さい\n";
        }else if(num == 13){
            this.rtn = "";
            this.rtn += "[操作説明 7/7]\n";
            this.rtn += "\n";
            this.rtn += "おしまい\n";
            this.rtn += "\n";
            this.rtn += "\n";
        }

        rtn = rtn.substring(1,100);
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
