class NpcBehavior extends Sup.Behavior {
  npc: Sup.Actor;
  direction: string = "L";
  typesOfWeapons: string[] = ["ShootArrow","Slash","CastMagic","Spike"];
  typeWeapon: number = 0;
  idle: boolean = true;
  walk: boolean = false;
  die: boolean;
  atack: boolean;
  timer: number;
  
  position: Sup.Math.Vector2;  
  
  awake() {
    this.npc = this.actor;
    this.atack = false;
    this.position = this.actor.getLocalPosition().toVector2();
    this.timer = 60;
  }

  update() {
    Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, Sup.ArcadePhysics2D.getAllBodies());

    this.position = this.actor.getLocalPosition().toVector2();
   
    let velocity = this.actor.arcadeBody2D.getVelocity();    

    velocity.set(0, 0);
    
    if(this.direction == "D" && this.walk){
      velocity.y = -0.02;
    }
    if(this.direction == "U" && this.walk){
      velocity.y = 0.02;
    } 
    if(this.direction == "L" && this.walk){
      velocity.x = -0.02;
    }
    if(this.direction == "R" && this.walk){
      velocity.x = 0.02;
    }
    
    if(this.npc.arcadeBody2D.getTouches().left || this.npc.arcadeBody2D.getTouches().right
      || this.npc.arcadeBody2D.getTouches().bottom || this.npc.arcadeBody2D.getTouches().top){            
      this.idle = true;
      this.walk = false;
    } else {
      this.idle = false;
      this.walk = true;        
    }
    if(this.timer === 0){
      this.timer = 60;
      let directions = ["L","U","D","R"];
      directions.splice(directions.indexOf(this.direction),1);
      let rand = Math.floor(Math.random() * 3);
      if(this.walk)
      this.direction = directions[rand];
    }
    this.timer--;
//     if(Sup.Input.isKeyDown("X")){
//       this.atack = true;
//     }

//     if(Sup.Input.isKeyDown("D")){
//       this.die = true;
//     }    
    
//     if(Sup.Input.wasKeyJustPressed("C")){
//       if(this.typeWeapon != 3)
//         this.typeWeapon++;
//       else this.typeWeapon = 0;
//     }    

    
    // if(Sup.Input.wasKeyJustReleased("DOWN") 
    //     || Sup.Input.wasKeyJustReleased("UP")
    //     || Sup.Input.wasKeyJustReleased("LEFT")
    //     || Sup.Input.wasKeyJustReleased("RIGHT")
    //     || Sup.Input.wasKeyJustReleased("X")
    //     || Sup.Input.wasKeyJustReleased("C")
    //     || Sup.Input.wasKeyJustReleased("D")){
    //   this.idle = true;
    //   this.walk = false;
    //   this.atack = false;
    //   this.die = false;
    // }
    
    this.actor.arcadeBody2D.setVelocity(velocity);
    
    if(this.idle && !this.atack && !this.die){
      for(let child of this.npc.getChildren()){
        child.spriteRenderer.setAnimation("Idle"+this.direction);
      }
    } 
    
    if(this.walk){
      for(let child of this.npc.getChildren()){
        child.spriteRenderer.setAnimation("Walk"+this.direction);
      }
    } 
    
    if(this.atack){
      for(let child of this.npc.getChildren()){
        child.spriteRenderer.setAnimation(this.typesOfWeapons[this.typeWeapon]+this.direction);
      }     
    }

    if(this.die){
      for(let child of this.npc.getChildren()){
        child.spriteRenderer.setAnimation("Die");
      }     
    }    
  }
}
Sup.registerBehavior(NpcBehavior);
