class MouseBehavior extends Sup.Behavior {
  position = this.actor.getLocalPosition();
  camera = Sup.Actor;  
  timer = 60;
  cordToWalk: Sup.Math.Vector2;
  makeWalkX: boolean;
  makeWalkY: boolean;
  pressedMouseX: number;
  
  awake() {
    Game.mouse = this;
    this.makeWalkX = false;
    this.makeWalkY = false;
    this.actor.setVisible(false);
  }

  update() {
    var mousePosition = Sup.Input.getMousePosition();
    var screenSize = Sup.Input.getScreenSize();
    mousePosition.x *= Sup.getActor("Camera").camera.getOrthographicScale() / 2 * screenSize.x / screenSize.y;
    mousePosition.y *= Sup.getActor("Camera").camera.getOrthographicScale() / 2;
    
    //Offset camera correction
    mousePosition.x += Sup.getActor("Camera").getX();
    mousePosition.y += Sup.getActor("Camera").getY();
        
    this.position.x = mousePosition.x;
    this.position.y = mousePosition.y;
    let position = this.position.toVector2().multiplyScalar(10);
    
    // this.actor.setLocalPosition(Math.floor(position.x/10),Math.floor(position.y/10));
    let ray = new Sup.Math.Ray();
    ray.setOrigin(0, 1, 2);
    ray.setDirection(0, 0, 1);
    ray.setFromCamera(Sup.getActor("Camera").camera, Sup.Input.getMousePosition());
    let interactions = ray.intersectActors(Sup.getAllActors());    
    let walk = true;
    let dialog = false;    
    for (let interaction of interactions) {
      if(interaction.actor.getName() == "Body" ){          
        walk = false;
        dialog = true;
      }      
    }        

    if (Game.player.activeInteractable != null) {
      if (Sup.Input.wasMouseButtonJustReleased(0)) Game.player.activeInteractable.interact();
      return;
    }    
    if(Sup.Input.wasMouseButtonJustPressed(0) && !Game.player.frameInteraction){
      this.pressedMouseX = Math.floor(position.x / 10);        
    }
    
    //TODO Open menu slide over the char
    if(Sup.Input.wasMouseButtonJustReleased(0) && !Game.player.frameInteraction){
      if(this.pressedMouseX < Game.player.position.x && Game.player.position.x < Math.floor(position.x / 10)){
        Sup.log("Opened Game Menu");
        walk = false;
        Game.player.openMenu();
      }
      if(walk){
        this.walk(position);
      }
      if(dialog){
        let closestInteractable: InteractableBehavior;
        let closestDistance = Infinity;
        for (let interactable of Game.interactables) {
          let distance = Game.player.position.distanceTo(interactable.actor.getLocalPosition().toVector2());
          if (distance < closestDistance) {
            closestDistance = distance;
            closestInteractable = interactable;
          }
        }

        if (closestDistance < 1.51) closestInteractable.interact();        
      }
    }
    
    //TODO Continue walk to reach coods
    if(this.makeWalkX && !Game.player.frameInteraction){
      let pX = Math.floor(this.cordToWalk.x / 10) * 10;
      let cX = Math.floor(Game.player.actor.getPosition().toVector2().multiplyScalar(10).x);
      if(pX == cX) {
        this.makeWalkX = false;    
        
        //This fix float error
        let pos = Game.player.actor.getPosition();
        pos.x = cX / 10; 
        Game.player.actor.arcadeBody2D.warpPosition(pos);
        
        Game.player.actor.arcadeBody2D.setVelocityX(0);
      } 
        if(pX < cX) 
          Game.player.actor.arcadeBody2D.setVelocityX(-0.05);       
        if(pX > cX) 
          Game.player.actor.arcadeBody2D.setVelocityX(0.05);
    }
    
    if(this.makeWalkY && !Game.player.frameInteraction){
      let pY = Math.floor(this.cordToWalk.y / 10) * 10;
      let cY = Math.floor(Game.player.actor.getPosition().toVector2().multiplyScalar(10).y);       
      if(pY == cY) {
        this.makeWalkY = false;            
        Game.player.actor.arcadeBody2D.setVelocityY(0);     
      } 
        if(pY < cY) 
          Game.player.actor.arcadeBody2D.setVelocityY(-0.05);       
        if(pY > cY) 
          Game.player.actor.arcadeBody2D.setVelocityY(0.05);
    }      
    
    //TODO stop animation
    if(!this.makeWalkX && !this.makeWalkY){
      Game.player.idle = true;
      Game.player.walk = false;      
      this.actor.setVisible(false);      
    }
    
    // if(this.timer === 0){
      // this.timer = 60;      
    //   // let posicao = this.position.toVector2().multiplyScalar(10);
    //   // Sup.log("      -----     ");
    //   // Sup.log("X: ",Math.floor(posicao.x / 10));
    //   // Sup.log("Y: ",Math.floor(posicao.y / 10));
      // Sup.log("Player: ",Game.player.actor.getLocalPosition().toVector2());
    //   // let distance = this.actor.getLocalPosition().distanceTo(Game.player.actor.getLocalPosition());
    //   // Sup.log(Math.floor(distance));
    // }
    // this.timer--;
  }
  
  walk(position){
    this.actor.setVisible(true);
    this.actor.setLocalPosition(Math.floor(position.x/10),Math.floor(position.y/10)); 
    this.cordToWalk = this.position.toVector2().multiplyScalar(10);
    // Sup.log("      -----     ");                  
    // Sup.log("X: ",Math.floor(this.cordToWalk.x / 10));
    // Sup.log("Y: ",Math.floor(this.cordToWalk.y / 10));
    let pX = Math.floor(this.cordToWalk.x / 10);
    let cX = Math.floor(Game.player.actor.getPosition().toVector2().x);
    let pY = Math.floor(this.cordToWalk.y / 10);
    let cY = Math.floor(Game.player.actor.getPosition().toVector2().y);        
    this.makeWalkX = true;
    this.makeWalkY = true;
    let distX = 0;
    let distY = 0;
    if(cX > 0){
      distX = Math.abs(cX - pX);
    } else {
      distX = Math.abs(pX - cX);
    }
    if(cY > 0){
      distY = Math.abs(cY - pY);
    } else {
      distY = Math.abs(pY - cY);
    }      
    // Sup.log(cX +" "+ pX+"\nDistX :"+distX+"\nDistY :"+distY);
    //TODO set Direction to look
    if(distX > distY){
      if(pX < cX){
        //LEFT
        Game.player.direction = "L";
      } else {
        //RIGTH
        Game.player.direction = "R";
      }
    } else {
      if(pY < cY){
        //DOWN
        Game.player.direction = "D";
      } else {
        //UP
        Game.player.direction = "U";
      }        
    }
    //TODO start animation walk
    Game.player.idle = false;
    Game.player.walk = true;    
  }
}
Sup.registerBehavior(MouseBehavior);
