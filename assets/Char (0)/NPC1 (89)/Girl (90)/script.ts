class GirlBehavior extends SimpleDialogBehavior {
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

  texts = [
    [ "Girl", "Hi, it's me. Remember ?" ],
    [ "Boy", "Of course, see you later." ],
    [ "Girl", "Bye bye." ]
  ];

  lookToPlayer: boolean;

  awake() {
    this.npc = this.actor;
    this.atack = false;
    this.position = this.actor.getLocalPosition().toVector2();
    this.timer = 60;    
    Game.interactables.push(this); 
    this.lookToPlayer = true;
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
      if(this.lookToPlayer){
        switch(Game.player.direction){
          case "U":
            this.direction = "D";
            break;
          case "D":
            this.direction = "U";
            break;
          case "L":
            this.direction = "R";
            break;
          case "R":
            this.direction = "L";
            break;
        }
      }      
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
Sup.registerBehavior(GirlBehavior);