class GameMenuBehavior extends Sup.Behavior {
  choices: Menu[];
  menu: Sup.Actor;
  arrow: Sup.Actor;
  
  awake() {
    this.menu = Sup.getActor("Menu");
    this.arrow = this.menu.getChild("Arrow");
    this.choices = [new Menu("Items",false,false),
                    new Menu("Skills",false,true),
                    new Menu("Equipment",false,true),
                    new Menu("Status",false,false),
                    new Menu("Save",false,true),
                    new Menu("Load",false,true),
                    new Menu("Exit",true,false)];
    
    this.choices.forEach((choice, index) => {
      choice.actorName = "Game_Menu_"+index;
      let actor = new Sup.Actor(choice.actorName);
      actor.setParent(this.menu);
      new Sup.TextRenderer(actor);
      actor.textRenderer.setFont("Fonts/Menu");
      actor.textRenderer.setText(choice.text);
      actor.textRenderer.setAlignment("left");
      if(choice.disabled){
        actor.textRenderer.setColor(0.5,0.5,0.5);
      }
      actor.setLocalX(-1.5);
      actor.setLocalY(3.5 + (index * -0.7));
      actor.setLocalZ(1);
    });
    
    let selected: Sup.Actor;
    this.choices.forEach((choice, index) => {
      if(choice.active) selected = this.menu.getChild(choice.actorName);
    });
    this.arrow.setLocalY(selected.getLocalY() - 0.05);
  }

  update() {
    if(this.menu.getVisible()){
      if(Sup.Input.wasKeyJustPressed("DOWN")){   
          this.changeChoice("D", this.choices, this.menu); 
      }

      if(Sup.Input.wasKeyJustPressed("UP")){   
          this.changeChoice("U", this.choices, this.menu); 
      }

      if(Sup.Input.wasKeyJustPressed("RETURN") || Sup.Input.wasKeyJustPressed("SPACE")
         || Sup.Input.wasKeyJustPressed("X")){
        this.action();
      }

      // Mouse control
      let ray = new Sup.Math.Ray();
      ray.setOrigin(0, 1, 2);
      ray.setDirection(0, 0, 1);
      ray.setFromCamera(Sup.getActor("Camera").camera, Sup.Input.getMousePosition());
      let interactions = ray.intersectActors([]);

      interactions = ray.intersectActors(this.menu.getChildren());


      for (let interaction of interactions) {
        if(interaction.actor.getName() != "Arrow"){
          this.changeChoiceByMouse(this.choices, interaction.actor);
          if(Sup.Input.wasMouseButtonJustReleased(0)){
            this.action();        
          }
        }
      }      
    }    
  }
  
  changeChoice(direction: string, menuArray: Menu[], actor: Sup.Actor){
    if(direction == "D"){
      for(let i = 0; i < menuArray.length; i++){
          if(menuArray[i].active){
            if(i != menuArray.length-1) {
              for(let j = i+1; j < menuArray.length; j++){
                  if(!menuArray[j].disabled){
                    menuArray[j].active = true;
                    break;
                  }
              }              
            } else {
              menuArray[0].active = true;
            }
            menuArray[i].active = false;
            break;
          }
      }
    } else {
      for(let i = menuArray.length-1; i >=0 ; i--){
          if(menuArray[i].active){
            if(i != 0) {
              for(let j = i-1; j >= 0; j--){ // i = 3
                  if(!menuArray[j].disabled){
                    menuArray[j].active = true;
                    break;
                  }
              }              
            } else {
              menuArray[menuArray.length-1].active = true;
            }
            menuArray[i].active = false;
            break;
          }
      }
    }
    
    let selected: Sup.Actor;
    menuArray.forEach((choice, index) => {
      if(choice.active) selected = actor.getChild(choice.actorName);
    });
    // this.arrow.setLocalX(actor.getLocalX());
    this.arrow.setLocalY(selected.getLocalY() - 0.05);
    Sup.Audio.playSound("Misc/Sound/Menu");
  } 
  
  changeChoiceByMouse(menuArray: Menu[], actor: Sup.Actor){
      let option: Menu;
      for(let i = 0; i < menuArray.length; i++){
        if(menuArray[i].actorName == actor.getName()){
          option = menuArray[i];
        }
      }
      if(!option.active && !option.disabled){
        menuArray.forEach((choice, index) => {
          choice.active = false;
        });
        option.active = true;
        // this.selector.setLocalX(actor.getParent().getLocalX());
        this.arrow.setLocalY(actor.getLocalY() - 0.05);
        Sup.Audio.playSound("Misc/Sound/Menu");
      }      
  }  
  
  action(){      
      // TODO Back to main menu
      if(this.choices[6].active){
        Sup.loadScene("Main menu/Prefab");
      }

      // TODO Open items management
      if(this.choices[0].active){        
        Sup.Audio.playSound("Misc/Sound/Menu_fail");
      }
    
      // TODO Open Status view
      if(this.choices[3].active){        
        Sup.Audio.playSound("Misc/Sound/Menu_fail");
      }    
  }  
}
Sup.registerBehavior(GameMenuBehavior);
