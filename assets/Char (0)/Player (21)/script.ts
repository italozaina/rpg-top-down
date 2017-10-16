class PlayerBehavior extends Sup.Behavior {
  player: Sup.Actor;
  direction: string = "D";
  typesOfWeapons: string[] = ["ShootArrow","Slash","CastMagic","Spike"];
  typeWeapon: number = 0;
  idle: boolean = true;
  walk: boolean = false;
  die: boolean;
  atack: boolean;  
  frameInteraction: boolean;  
  
  position: Sup.Math.Vector2;
  
  activeInteractable: InteractableBehavior;
  
  awake() {
    Game.player = this;
    this.player = this.actor;
    this.atack = false;
    this.position = this.actor.getLocalPosition().toVector2();
    this.frameInteraction = false;
  }

  update() {
    const dialog = Sup.getActor("Dialog");
    const menu = Sup.getActor("Menu");
    const inventory = Sup.getActor("Inventory");
    
    Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, Sup.ArcadePhysics2D.getAllBodies());

    if (this.activeInteractable != null) {
      if (Sup.Input.wasKeyJustPressed("RETURN") || Sup.Input.wasKeyJustPressed("SPACE")
       || Sup.Input.wasKeyJustPressed("X")) this.activeInteractable.interact();
      return;
    }
    
    this.position = this.actor.getLocalPosition().toVector2();
   
    let velocity = this.actor.arcadeBody2D.getVelocity();    

    velocity.set(0, 0);
    
    if(Sup.Input.isKeyDown("DOWN") && !this.frameInteraction){
      this.direction = "D";
      this.idle = false;
      this.walk = true;      
      velocity.y = -0.05;
    } else if(Sup.Input.isKeyDown("UP") && !this.frameInteraction){
      this.direction = "U";
      this.idle = false;
      this.walk = true;      
      velocity.y = 0.05;
    } 
    if(Sup.Input.isKeyDown("LEFT") && !this.frameInteraction){
      this.direction = "L";
      this.idle = false;
      this.walk = true;
      velocity.x = -0.05;
    } else if(Sup.Input.isKeyDown("RIGHT") && !this.frameInteraction){
      this.direction = "R";
      this.idle = false;
      this.walk = true;
      velocity.x = 0.05;
    }       
    
    if(Sup.Input.isKeyDown("X") && !this.frameInteraction){
      this.atack = true;
    }

    if(Sup.Input.isKeyDown("D") && !this.frameInteraction){
      this.die = true;
    }    
    
    if(Sup.Input.wasKeyJustPressed("C") && !this.frameInteraction){
      if(this.typeWeapon != 3)
        this.typeWeapon++;
      else this.typeWeapon = 0;
    }    

    if(Sup.Input.wasKeyJustPressed("F") && !inventory.getVisible() && !menu.getVisible()){
      
      if(dialog.getVisible()){
        dialog.setVisible(false);
        this.frameInteraction = false;
      } else {
        dialog.setVisible(true); 
        this.frameInteraction = true;
      }      
    }    
    
    if(Sup.Input.wasKeyJustPressed("I") && !menu.getVisible() && !dialog.getVisible()){      
      if(inventory.getVisible()){
        inventory.setVisible(false);
        this.frameInteraction = false;
      } else {
        inventory.setVisible(true);
        this.frameInteraction = true;
      }      
    }
    
    if(Sup.Input.wasKeyJustPressed("Z") && !dialog.getVisible() && !inventory.getVisible()){      
      if(menu.getVisible()){
        menu.setVisible(false);
        this.frameInteraction = false;
      } else {
        menu.setVisible(true); 
        this.frameInteraction = true;
      }      
    }
    
    if((Sup.Input.wasKeyJustReleased("DOWN") 
        || Sup.Input.wasKeyJustReleased("UP")
        || Sup.Input.wasKeyJustReleased("LEFT")
        || Sup.Input.wasKeyJustReleased("RIGHT")
        || Sup.Input.wasKeyJustReleased("X")
        || Sup.Input.wasKeyJustReleased("C")
        || Sup.Input.wasKeyJustReleased("D")) && !this.frameInteraction){
      this.idle = true;
      this.walk = false;
      this.atack = false;
      this.die = false;
    }
    
    this.actor.arcadeBody2D.setVelocity(velocity);
     
    // Interactions
    if (Sup.Input.wasKeyJustPressed("RETURN") || Sup.Input.wasKeyJustPressed("SPACE")
       || Sup.Input.wasKeyJustPressed("X")) {
      let closestInteractable: InteractableBehavior;
      let closestDistance = Infinity;
      for (let interactable of Game.interactables) {
        let distance = this.position.distanceTo(interactable.actor.getLocalPosition().toVector2());
        if (distance < closestDistance) {
          closestDistance = distance;
          closestInteractable = interactable;
        }
      }
      
      if (closestDistance < 1.51) closestInteractable.interact();
    }     
    
    if(this.idle && !this.atack && !this.die){
      for(let child of this.player.getChildren()){
        child.spriteRenderer.setAnimation("Idle"+this.direction);
      }
    } 
    
    if(this.walk && !this.frameInteraction){
      for(let child of this.player.getChildren()){
        child.spriteRenderer.setAnimation("Walk"+this.direction);
      }
    } 
    
    if(this.atack && !this.frameInteraction){
      for(let child of this.player.getChildren()){
        child.spriteRenderer.setAnimation(this.typesOfWeapons[this.typeWeapon]+this.direction);
      }     
    }

    if(this.die && !this.frameInteraction){
      for(let child of this.player.getChildren()){
        child.spriteRenderer.setAnimation("Die");
      }     
    }     
  }
  
  openMenu(){
    const menu = Sup.getActor("Menu");
    if(menu.getVisible()){
      menu.setVisible(false);
      this.frameInteraction = false;
    } else {
      menu.setVisible(true); 
      this.frameInteraction = true;
    }    
  }
}
Sup.registerBehavior(PlayerBehavior);
