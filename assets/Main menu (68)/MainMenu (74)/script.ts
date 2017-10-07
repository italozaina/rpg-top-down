class Menu {
  text: string;
  active: boolean;
  disabled: boolean;
  actorName: string;
  
  constructor(text: string, active: boolean, disabled: boolean) {
      this.text = text;
      this.active = active;
      this.disabled = disabled;
  }  
}

class MainMenuBehavior extends Sup.Behavior {
  choices: Menu[];
  selector: Sup.Actor;
  awake() {
    this.choices = [new Menu("Start",true,false),
                    new Menu("Load",false,true),
                    new Menu("Options",false,false),
                    new Menu("Exit",false,false)];
    
    this.choices.forEach((choice, index) => {
      choice.actorName = "Menu_Option_"+index;
      let actor = new Sup.Actor(choice.actorName);
      new Sup.TextRenderer(actor);
      actor.textRenderer.setFont("Fonts/Menu");
      actor.textRenderer.setText(choice.text);
      if(choice.disabled){
        actor.textRenderer.setColor(0.5,0.5,0.5);
      }
      actor.setLocalX(0);
      actor.setLocalY(-3.5 + (index * -0.9));
      actor.setLocalZ(3);
    });
    
    this.selector = Sup.getActor("Selector");
  }

  update() {
    if(Sup.Input.wasKeyJustPressed("RETURN") || Sup.Input.wasKeyJustPressed("SPACE")){
      if(this.choices[0].active){
        Sup.loadScene("HUD/Prefab");
        Game.loadMap("Map1");        
      }
      if(this.choices[3].active){
        Sup.loadScene("HUD/Prefab");
        Game.loadMap("Map1");        
      }
    }
    
    if(Sup.Input.wasKeyJustPressed("DOWN")){
      // this.selector.setLocalY(this.selector.getLocalY()-0.9);
      this.changeChoice("D");
      Sup.log(this.choices);
    }
    
    if(Sup.Input.wasKeyJustPressed("UP")){
      // this.selector.setLocalY(this.selector.getLocalY()+0.9);
    }
  }
  
  changeChoice(direction: string){    
    if(direction == "D"){
      for(let i = 0; i < this.choices.length; i++){
          if(this.choices[i].active){
            if(i != this.choices.length-1) {
              for(let j = i+1; i < this.choices.length; j++){
                  if(!this.choices[j].disabled){
                    this.choices[j].active = true;
                    break;
                  }
              }              
            } else {
              this.choices[0].active = true;
            }
            this.choices[i].active = false;
            break;
          }
      }      
    } else {
      
    }
    
    let selected: Sup.Actor;
    this.choices.forEach((choice, index) => {
      if(choice.active) selected = Sup.getActor(choice.actorName);
    });
    this.selector.setLocalY(selected.getLocalY() - 0.05);
  }
}
Sup.registerBehavior(MainMenuBehavior);
