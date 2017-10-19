class WonGameObjDialogBehavior extends InteractableBehavior {
  
  texts: string[];
  amount: number;
  isItem: boolean;
  trigger: number;
  id: number;

  currentText = null;

  awake(){
    super.awake();
    this.texts = [
      "\n        Got " + this.amount + " " + this.getGameObject().getName()
    ];        
  }

  interact() {
    if (Game.player.activeInteractable == null) {
      this.currentText = 0;
      Game.player.activeInteractable = this;
    }
    
    if (this.currentText < this.texts.length && Events.parts[this.trigger]) {
      Game.dialogBehavior.showWonGameObj(this.texts[this.currentText]);
      this.currentText++;
    } else {      
      if(Events.parts[this.trigger]){
        //add gameObj
        this.addInventory();
        Sup.log(Game.gameObjects);         
      }
      //close trigger
      Events.parts[this.trigger] = false;      
      Game.dialogBehavior.hide();
      Game.player.activeInteractable = null;
    }
  }

  getGameObject(){
    if(this.isItem){
      for (let item of ItemsAndEquips.items) {
        if (item.getId() == this.id) {
          return item;
        }          
      }      
    } else {
      for (let equip of ItemsAndEquips.equips) {
        if (equip.getId() == this.id) {
          return equip;
        }          
      }      
    }
  }

  addInventory(){
    for(let i = 0; i < Game.gameObjects.length; i ++){
      if(Game.gameObjects[i] == null){
        Game.gameObjects[i] = {
          gameObject: this.getGameObject(), 
          quantity: this.amount
        };        
        break;
      }
    }
  }
}

Sup.registerBehavior(WonGameObjDialogBehavior);