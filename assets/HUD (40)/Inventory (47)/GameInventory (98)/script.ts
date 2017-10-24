class GameInventoryBehavior extends Sup.Behavior {
  arrow: Sup.Actor;  
  arrow2: Sup.Actor;  
  inventory: Sup.Actor;
  opened: boolean;
  listActive: boolean;
  load: boolean;
  choices: Menu[];
  private descProgress = 0;
  private description = "";
  descriptionTextRender: Sup.TextRenderer;
  
  awake() {
    Game.inventory = this;
    this.opened = false;
    this.load = false;
    this.inventory = Sup.getActor("Inventory");
    this.descriptionTextRender = Sup.getActor("Description").textRenderer;
    this.listActive = false;
    this.arrow = Sup.getActor("Arrow_list");
    this.arrow2 = Sup.getActor("Arrow_Buttons");
    
    this.choices = [new Menu("Use/Move/Drop",true,false),
                    new Menu("Organize",false,false),
                    new Menu("Back",false,false)];
        
    this.choices.forEach((choice, index) => {      
      choice.actorName = this.inventory.getChild("Buttons").getChild("Button"+(index+1)).getName();
    });
    
    this.descriptionTextRender.setText("");
  }
  
  update() {
    if(this.load){
      this.createGaps();
      this.loadGameObjectsByPage(0);
      this.load = false; 
      this.changeArrow();
    }  
    
    if(this.inventory.getVisible()){
      if(Sup.Input.wasKeyJustPressed("DOWN") && this.listActive){   
          this.changeChoice("D", Game.gameObjects, this.inventory.getChild("List")); 
      }

      if(Sup.Input.wasKeyJustPressed("UP") && this.listActive){   
          this.changeChoice("U", Game.gameObjects, this.inventory.getChild("List")); 
      }    
      
      if(Sup.Input.wasKeyJustPressed("RIGHT") && !this.listActive){   
          this.changeChoiceHorizontal("R", this.choices, this.inventory.getChild("Buttons")); 
      }

      if(Sup.Input.wasKeyJustPressed("LEFT") && !this.listActive){   
          this.changeChoiceHorizontal("L", this.choices, this.inventory.getChild("Buttons")); 
      } 
      
      if(Sup.Input.wasKeyJustPressed("RETURN") || Sup.Input.wasKeyJustPressed("SPACE")
         || Sup.Input.wasKeyJustPressed("X")){
        this.action();
      } 
      
      if(Sup.Input.wasKeyJustPressed("Z") && Game.inventory.listActive){
        this.descriptionTextRender.setText("");
        this.listActive = false;
        this.changeArrow();
      }  
      
      // Mouse control
      let ray = new Sup.Math.Ray();
      ray.setOrigin(0, 1, 2);
      ray.setDirection(0, 0, 1);
      ray.setFromCamera(Sup.getActor("Camera").camera, Sup.Input.getMousePosition());
      let interactions = ray.intersectActors(this.inventory.getChild("Buttons").getChildren());

      for (let interaction of interactions) {        
        if(interaction.actor.getName() != "Arrow_Buttons"){
          this.changeChoiceByMouse(this.choices, interaction.actor);
          if(interaction.actor.getName() != "Button1"){
            this.descriptionTextRender.setText("");
            this.listActive = false;
            this.changeArrow();
          }
          if(Sup.Input.wasMouseButtonJustReleased(0)){                        
            this.action();        
          }
        }
      }      
    }
    
    this.showDesc();
  }
  
  createGaps(){
    Game.gameObjects.forEach((gameObj, index)=>{
      if(index == 0) gameObj.active = true
      else gameObj.active = false;
    });
    for(let i = 0; i < 15; i++){
      let actorName = "Inventory_Gap_"+i;
      let actor = new Sup.Actor(actorName);
      actor.setParent(this.inventory.getChild("List"));
      new Sup.TextRenderer(actor);
      actor.textRenderer.setFont("Fonts/Menu");      
      let quantityActor = new Sup.Actor(actorName+"_Quantity");
      quantityActor.setParent(actor);
      new Sup.TextRenderer(quantityActor);
      quantityActor.textRenderer.setFont("Fonts/Menu");
      quantityActor.setLocalX(10);      
      actor.textRenderer.setAlignment("left");
      actor.setLocalX(0.5);
      actor.setLocalY(-0.3 + (i * -0.7));
      actor.setLocalZ(1);      
    }    
  }
  
  loadGameObjectsByPage(page: number){
    for(let i = 0; i < 15; i++){
      this.inventory.getChild("List").getChild("Inventory_Gap_" + i).textRenderer.setText("");
      this.inventory.getChild("List").getChild("Inventory_Gap_" + i + "_Quantity").textRenderer.setText("");       
      if(Game.gameObjects[page * 15 + i].gameObject != null){
        this.inventory.getChild("List").getChild("Inventory_Gap_" + i)
          .textRenderer.setText(Game.gameObjects[page * 15 + i].gameObject.getName());    
        this.inventory.getChild("List").getChild("Inventory_Gap_" + i + "_Quantity")
          .textRenderer.setText(": " +Game.gameObjects[page * 15 + i].quantity);
      }
    }    
  }  
  
  changeChoice(direction: string, menuArray: {gameObject: GameObject, quantity: number, active: boolean, disabled: boolean}[], actor: Sup.Actor){
    if(direction == "D"){
      for(let i = 0; i < menuArray.length; i++){          
          if(menuArray[i].active){            
            if(i != menuArray.length-1) {
              for(let j = i+1; j < menuArray.length; j++){
                  if(!menuArray[j].disabled){
                    menuArray[j].active = true;
                    if(j % 15 == 0 || j == 0) this.loadGameObjectsByPage(j / 15);
                    break;
                  }
              }              
            } else {              
              menuArray[0].active = true;
              this.loadGameObjectsByPage(0 / 15);
            }
            menuArray[i].active = false;
            break;
          }
      }
    } else {
      for(let i = menuArray.length-1; i >=0 ; i--){
          if(menuArray[i].active){
            if(i != 0) {
              for(let j = i-1; j >= 0; j--){
                  if(!menuArray[j].disabled){
                    menuArray[j].active = true;
                    if(j % 15 == 14) this.loadGameObjectsByPage((j + 1) / 15 - 1);
                    break;
                  }
              }              
            } else {
              menuArray[menuArray.length-1].active = true;
              this.loadGameObjectsByPage(menuArray.length / 15 - 1);
            }
            menuArray[i].active = false;
            break;
          }
      }
    }
    
    let selected: Sup.Actor;
    menuArray.forEach((choice, index) => {
      if(choice.active) {
        selected = this.inventory.getChild("List").getChildren()[index%15+1];
        this.descriptionTextRender.setText("");
        this.description = this.getDescription(choice.gameObject);
        this.descProgress = 0;                
      }           
    });
    // this.arrow.setLocalX(actor.getLocalX());
    this.arrow.setLocalY(selected.getLocalY() - 0.05);    
    Sup.Audio.playSound("Misc/Sound/Menu");
  }
  
  changeChoiceHorizontal(direction: string, menuArray: Menu[], actor: Sup.Actor){
    if(direction == "R"){
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
    this.arrow2.setLocalX(selected.getLocalX());
    // this.arrow.setLocalY(selected.getLocalY() - 0.05);
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
        this.arrow2.setLocalX(actor.getLocalX());
        // this.arrow.setLocalY(actor.getLocalY() - 0.05);
        Sup.Audio.playSound("Misc/Sound/Menu");
      }      
  }  
  
  changeArrow(){
    if(this.listActive){
      this.arrow.setVisible(true);
      this.arrow2.setVisible(false);
    } else {
      this.arrow.setVisible(false);
      this.arrow2.setVisible(true);
    }
  }
  
  action(){
      // TODO Open items management
      if(this.choices[0].active){
        this.listActive = true;
        this.changeArrow();
        this.description = this.getDescription(Game.gameObjects[0].gameObject);
        this.descProgress = 0;
        // Sup.Audio.playSound("Misc/Sound/Menu_fail");
      }
    
      // TODO Organize items
      if(this.choices[1].active){        
        Sup.Audio.playSound("Misc/Sound/Menu_fail");
      }
    
      if(this.choices[2].active){        
        Game.player.toggleInventory();
        this.descriptionTextRender.setText("");
        Sup.setTimeout(1,() =>{
          Game.player.toggleMenu();
        });                
      }    
  }
  
  getDescription(gameObject: GameObject){
    if(gameObject != null){
      if(gameObject.getEquip()){
        return Game.TextData.Equip_Desc_[gameObject.getId() - 1];
      } else {
        return Game.TextData.Item_Desc_[gameObject.getId() - 1];
      }      
    } else {
      return "";
    }
  }
  
  showDesc(){
    if(this.inventory.getVisible()){
      if (this.descProgress < this.description.length) {
        this.descProgress++;
        this.descriptionTextRender.setText(`${this.description.slice(0, this.descProgress)}`);
      }      
    }
  }
}
Sup.registerBehavior(GameInventoryBehavior);
