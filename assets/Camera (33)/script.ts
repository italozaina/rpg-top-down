class CameraBehavior extends Sup.Behavior {
  
  position = new Sup.Math.Vector2();
  cameraWidth: number;
  cameraHeight: number;
  
  // timer = 60;
  
  awake() {
    this.cameraHeight = this.actor.camera.getOrthographicScale();
    this.cameraWidth = this.cameraHeight * this.actor.camera.getWidthToHeightRatio();    
  }

  update() {
    this.position.copy(Game.player.position);
    this.position.x = Sup.Math.clamp(this.position.x, this.cameraWidth / 2, Game.mapWidth - this.cameraWidth / 2);
    this.position.y = Sup.Math.clamp(this.position.y, this.cameraHeight / 2, Game.mapHeight - this.cameraHeight / 2);
    
    this.actor.setLocalPosition(this.position);    
    
    // if(this.timer === 0){
    //   this.timer = 60;
    //   // Sup.log(this.position);
    // }
    // this.timer--;    
  }
}
Sup.registerBehavior(CameraBehavior);
