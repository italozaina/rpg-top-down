class GameMenuBehavior extends Sup.Behavior {
  choices: Menu[];
  menu: Sup.Actor;
  
  awake() {
    this.menu = Sup.getActor("Menu");
    this.choices = [new Menu("Items",false,false),
                    new Menu("Skills",false,true),
                    new Menu("Equipment",false,true),
                    new Menu("Status",false,false),
                    new Menu("Save",false,false),
                    new Menu("Exit",true,false)];
    
    this.choices.forEach((choice, index) => {
      choice.actorName = "Game_Menu_"+index;
      let actor = new Sup.Actor(choice.actorName);
      actor.setParent(this.menu);
      new Sup.TextRenderer(actor);
      actor.textRenderer.setFont("Fonts/Dialog");
      actor.textRenderer.setText(choice.text);
      actor.textRenderer.setSize(48);
      if(choice.disabled){
        actor.textRenderer.setColor(0.5,0.5,0.5);
      }
      actor.setLocalX(0);
      actor.setLocalY(3.5 + (index * -0.7));
      actor.setLocalZ(1);
    });
  }

  update() {

  }
}
Sup.registerBehavior(GameMenuBehavior);
