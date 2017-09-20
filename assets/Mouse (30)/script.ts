class MouseBehavior extends Sup.Behavior {
  position = this.actor.getLocalPosition();
  camera = Sup.Actor;  
  timer = 60;
  cordToWalk: Sup.Math.Vector2;
  makeWalk: boolean;
  
  awake() {
    Game.mouse = this;
    Sup.log( Sup.Input.getScreenSize());
    this.makeWalk = false;
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
      Sup.log("      -----     ");      
      Sup.log("X: ",Math.floor(this.cordToWalk.x / 10));
      Sup.log("Y: ",Math.floor(this.cordToWalk.y / 10)); 
      this.makeWalk = true;
    }
    
    //TODO Continue walk to reach coods
    if(this.makeWalk){
      let pX = Math.floor(this.cordToWalk.x);
      let cX = Math.floor(Game.player.actor.getPosition().toVector2().multiplyScalar(10).x);
      if(pX != cX) {
        if(pX < cX) 
          Game.player.actor.moveX(-0.1);       
        if(pX > cX) 
          Game.player.actor.moveX(0.1);
      Sup.log("@@      -----     @@");      
      Sup.log("X1: ",pX);              
      Sup.log("X2: ",cX);              
        // this.makeWalk = true;
      } else {
        this.makeWalk = false;
      }
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
