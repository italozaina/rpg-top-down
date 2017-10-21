class GameInventoryBehavior extends Sup.Behavior {
  arrow: Sup.Actor;  
  inventory: Sup.Actor;
  opened: boolean;
  load: boolean;
  
  awake() {
    Game.inventory = this;
    this.opened = false;
    this.load = false;
    this.inventory = Sup.getActor("Inventory");  
  }

  start(){
    this.loadGameObjects();
  }
  
  update() {
    if(this.load){
      this.loadGameObjects();
      this.load = false;
    }
  }
  
  loadGameObjects(){
    for(let i = 0; i < 15; i++){
      let actorName = "Inventory_Gap_"+i;
      let actor = new Sup.Actor(actorName);
      actor.setParent(this.inventory.getChild("List"));
      new Sup.TextRenderer(actor);
      actor.textRenderer.setFont("Fonts/Menu");
      if(Game.gameObjects[i] != null){
        actor.textRenderer.setText(Game.gameObjects[i].gameObject.getName());
        let quantityActor = new Sup.Actor(actorName+"_Quantity");
        quantityActor.setParent(actor);
        new Sup.TextRenderer(quantityActor);
        quantityActor.textRenderer.setFont("Fonts/Menu");
        quantityActor.textRenderer.setText(": " +Game.gameObjects[i].quantity);
        quantityActor.setLocalX(10);
      }      
      actor.textRenderer.setAlignment("left");
      // if(choice.disabled){
      //   actor.textRenderer.setColor(0.5,0.5,0.5);
      // }
      actor.setLocalX(0.5);
      actor.setLocalY(-0.3 + (i * -0.7));
      actor.setLocalZ(1);      
    }    
  }
}
Sup.registerBehavior(GameInventoryBehavior);
