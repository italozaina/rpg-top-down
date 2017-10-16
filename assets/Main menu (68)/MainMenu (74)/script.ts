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
  options: Menu[];
  selector: Sup.Actor;
  mainActor: Sup.Actor;
  optionsActor: Sup.Actor;
  optionsOpened: boolean;
  fullScreen: boolean;
  awake() {    
    this.mainActor = Sup.getActor("Main_frame");
    this.optionsActor = Sup.getActor("Options_frame");
    this.fullScreen = false;
    this.optionsOpened = this.optionsActor.getVisible();
    this.choices = [new Menu("Start",true,false),
                    new Menu("Load",false,true),
                    new Menu("Options",false,false),
                    new Menu("Exit",false,false)];
    
    this.options = [new Menu("Full screen",true,false),
                    new Menu("Fps",false,true),                    
                    new Menu("Back",false,false)];    
    
    this.choices.forEach((choice, index) => {
      choice.actorName = "Main_Menu_"+index;
      let actor = new Sup.Actor(choice.actorName);
      actor.setParent(this.mainActor);
      new Sup.TextRenderer(actor);
      actor.textRenderer.setFont("Fonts/Menu");
      actor.textRenderer.setText(choice.text);
      if(choice.disabled){
        actor.textRenderer.setColor(0.5,0.5,0.5);
      }
      actor.setLocalX(0);
      actor.setLocalY(1.5 + (index * -0.9));
      actor.setLocalZ(3);
    });
    
    this.options.forEach((choice, index) => {
      choice.actorName = "Options_Menu_"+index;
      let actor = new Sup.Actor(choice.actorName);
      actor.setParent(this.optionsActor);
      new Sup.TextRenderer(actor);
      actor.textRenderer.setFont("Fonts/Menu");
      actor.textRenderer.setText(choice.text);
      actor.textRenderer.setSize(24);
      if(choice.disabled){
        actor.textRenderer.setColor(0.5,0.5,0.5);
      }
      actor.setLocalX(0);
      actor.setLocalY(1 + (index * -0.9));
      actor.setLocalZ(3);
    });    
    
    this.selector = Sup.getActor("Selector");
    
    Sup.Input.exitFullscreen();
    
    Fade.start(Fade.Direction.In);
  }

  update() {
    this.optionsOpened = this.optionsActor.getVisible();
    if(Sup.Input.wasKeyJustPressed("RETURN") || Sup.Input.wasKeyJustPressed("SPACE")
       || Sup.Input.wasKeyJustPressed("X")){
      this.action();
    }
    
    if(Sup.Input.wasKeyJustPressed("DOWN")){      
      if(!this.optionsOpened){
        this.changeChoice("D", this.choices, this.mainActor); 
      } else {
        this.changeChoice("D", this.options, this.optionsActor);
      }     
    }
    
    if(Sup.Input.wasKeyJustPressed("UP")){
      if(!this.optionsOpened){
        this.changeChoice("U", this.choices, this.mainActor);
      } else {
        this.changeChoice("U", this.options, this.optionsActor);
      }
    }
    
    // Mouse control
    let ray = new Sup.Math.Ray();
    ray.setOrigin(0, 1, 2);
    ray.setDirection(0, 0, 1);
    ray.setFromCamera(Sup.getActor("Camera").camera, Sup.Input.getMousePosition());
    let interactions = ray.intersectActors([]);
    if(this.optionsOpened){
      interactions = ray.intersectActors(this.optionsActor.getChildren());
    } else {
      interactions = ray.intersectActors(this.mainActor.getChildren());
    }
    

    for (let interaction of interactions) {
      if(this.optionsOpened){
        this.changeChoiceByMouse(this.options, interaction.actor);
      } else {
        this.changeChoiceByMouse(this.choices, interaction.actor);
      }
      if(Sup.Input.wasMouseButtonJustReleased(0)){
        this.action();
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
    this.selector.setLocalX(actor.getLocalX());
    this.selector.setLocalY(actor.getLocalY() + selected.getLocalY() - 0.05);
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
        this.selector.setLocalX(actor.getParent().getLocalX());
        this.selector.setLocalY(actor.getParent().getLocalY() + actor.getLocalY() - 0.05);
        Sup.Audio.playSound("Misc/Sound/Menu");
      }      
  }
  
  action(){
      // Start the game
      if(this.choices[0].active && !this.optionsOpened){
        Game.init();
        Game.loadMap("Map1");
      }
      
      // Open options
      if(this.choices[2].active && !this.optionsOpened){
        this.optionsActor.setVisible(true);
        let selected = this.optionsActor.getChildren()[0];
        this.selector.setLocalX(this.optionsActor.getLocalX());
        this.selector.setLocalY(this.optionsActor.getLocalY() + selected.getLocalY() - 0.05);
      }
      
      // Close the game
      if(this.choices[3].active && !this.optionsOpened){
        Sup.exit();
      }

      // Fullscreen mode
      if(this.options[0].active && this.optionsOpened){
        if(this.fullScreen){
          Sup.Input.exitFullscreen();
          this.fullScreen = false;
        } else {
          Sup.Input.goFullscreen();
          this.fullScreen = true;
        }        
      }      
      
      // Go back to Main Menu
      if(this.options[2].active && this.optionsOpened){
        this.optionsActor.setVisible(false);
        let selected = this.mainActor.getChildren()[2];
        this.selector.setLocalX(this.mainActor.getLocalX());
        this.selector.setLocalY(this.mainActor.getLocalY() + selected.getLocalY() - 0.05);
      }    
  }
}
Sup.registerBehavior(MainMenuBehavior);
