class CharBehavior extends Sup.Behavior {
  player: Sup.Actor;
  direction: string = "D";
  typesOfWeapons: string[] = ["ShootArrow","Slash","CastMagic","Spike"]; // Slash, CastMagic, Spike
  typeWeapon: number = 0;
  idle: boolean = true;
  walk: boolean = false;
  die: boolean;
  atack: boolean;  
  
  awake() {
    this.player = this.actor;
    this.atack = false;
  }

  update() {
    if(Sup.Input.isKeyDown("DOWN")){
      this.direction = "D";
      this.idle = false;
      this.walk = true;
    } else if(Sup.Input.isKeyDown("UP")){
      this.direction = "U";
      this.idle = false;
      this.walk = true;
    } else if(Sup.Input.isKeyDown("LEFT")){
      this.direction = "L";
      this.idle = false;
      this.walk = true;
    } else if(Sup.Input.isKeyDown("RIGHT")){
      this.direction = "R";
      this.idle = false;
      this.walk = true;
    }
    
    if(Sup.Input.isKeyDown("X")){
      this.atack = true;
    }

    if(Sup.Input.isKeyDown("D")){
      this.die = true;
    }    
    
    if(Sup.Input.wasKeyJustPressed("C")){
      if(this.typeWeapon != 3)
        this.typeWeapon++;
      else this.typeWeapon = 0;
    }    
    
    if(Sup.Input.wasKeyJustReleased("DOWN") 
        || Sup.Input.wasKeyJustReleased("UP")
        || Sup.Input.wasKeyJustReleased("LEFT")
        || Sup.Input.wasKeyJustReleased("RIGHT")
        || Sup.Input.wasKeyJustReleased("X")
        || Sup.Input.wasKeyJustReleased("C")
        || Sup.Input.wasKeyJustReleased("D")){
      this.idle = true;
      this.walk = false;
      this.atack = false;
      this.die = false;
    }
    
    if(this.idle && !this.atack && !this.die){
      for(let child of this.player.getChildren()){
        child.spriteRenderer.setAnimation("Idle"+this.direction);
      }
    } 
    
    if(this.walk){
      for(let child of this.player.getChildren()){
        child.spriteRenderer.setAnimation("Walk"+this.direction);
      }
    }
    
    if(this.atack){
      for(let child of this.player.getChildren()){
        child.spriteRenderer.setAnimation(this.typesOfWeapons[this.typeWeapon]+this.direction);
      }     
    }

    if(this.die){
      for(let child of this.player.getChildren()){
        child.spriteRenderer.setAnimation("Die");
      }     
    }    
  }
}
Sup.registerBehavior(CharBehavior);
