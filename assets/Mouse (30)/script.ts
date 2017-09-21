class MouseBehavior extends Sup.Behavior {
  position = this.actor.getLocalPosition();
  camera = Sup.Actor;  
  timer = 60;
  cordToWalk: Sup.Math.Vector2;
  makeWalkX: boolean;
  makeWalkY: boolean;
  
  awake() {
    Game.mouse = this;
    Sup.log( Sup.Input.getScreenSize());
    this.makeWalkX = false;
    this.makeWalkY = false;
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
    
    this.actor.setLocalPosition(Math.floor(position.x/10),Math.floor(position.y/10));    
    
    //TODO Click to walk
    if(Sup.Input.isMouseButtonDown(0)){
      this.cordToWalk = this.position.toVector2().multiplyScalar(10);
      // Sup.log("      -----     ");      
      // Sup.log("X: ",Math.floor(this.cordToWalk.x / 10));
      // Sup.log("Y: ",Math.floor(this.cordToWalk.y / 10));
      let pX = Math.floor(this.cordToWalk.x / 10);
      let cX = Math.floor(Game.player.actor.getPosition().toVector2().multiplyScalar(10).x);
      let pY = Math.floor(this.cordToWalk.y / 10);
      let cY = Math.floor(Game.player.actor.getPosition().toVector2().multiplyScalar(10).y);        
      this.makeWalkX = true;
      this.makeWalkY = true;
      
      //TODO set Direction to look
      if(cX > cY){
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
    
    //TODO Continue walk to reach coods
    if(this.makeWalkX){
      let pX = Math.floor(this.cordToWalk.x / 10) * 10;
      let cX = Math.floor(Game.player.actor.getPosition().toVector2().multiplyScalar(10).x);      
      if(pX == cX) {
        this.makeWalkX = false;
        Game.player.actor.arcadeBody2D.setVelocityX(0); 
      } 
        if(pX < cX) 
          Game.player.actor.arcadeBody2D.setVelocityX(-0.05);       
        if(pX > cX) 
          Game.player.actor.arcadeBody2D.setVelocityX(0.05);
    }
    
    if(this.makeWalkY){
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
    }
    
    // if(this.timer === 0){
    //   this.timer = 60;      
    //   // let posicao = this.position.toVector2().multiplyScalar(10);
    //   // Sup.log("      -----     ");
    //   // Sup.log("X: ",Math.floor(posicao.x / 10));
    //   // Sup.log("Y: ",Math.floor(posicao.y / 10));
    //   // Sup.log("Player: ",Game.player.actor.getLocalPosition().toVector2());
    //   // let distance = this.actor.getLocalPosition().distanceTo(Game.player.actor.getLocalPosition());
    //   // Sup.log(Math.floor(distance));
    // }
    // this.timer--;
  }
}
Sup.registerBehavior(MouseBehavior);
