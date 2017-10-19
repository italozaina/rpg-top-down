class DialogBehavior extends Sup.Behavior {
  
  private speaker = "";
  private text = "This is a test.";
  private textProgress = 0;
  private isGameObj = false;
  // portraitRenderer: Sup.SpriteRenderer;
  textRenderer: Sup.TextRenderer;
  
  awake() {
    Game.dialogBehavior = this;
    
    // this.portraitRenderer = this.actor.getChild("Portrait").spriteRenderer;
    this.textRenderer = this.actor.getChild("Text").textRenderer;
  }
  
  show(speaker: string, text: string) {
    Game.player.frameInteraction = true;
    this.actor.setVisible(true);
    
    this.speaker = speaker;
    // this.portraitRenderer.setSprite(`Characters/${speaker}/Portrait`);

    this.textRenderer.setText(`${speaker.toUpperCase()}:`);
    this.text = text;
    this.textProgress = 0;
  }
  
  showWonGameObj(text: string) {
    Game.player.frameInteraction = true;
    this.actor.setVisible(true);
    this.text = text;
    this.textProgress = 0;
    this.isGameObj = true;
  }  
  
  hide() {
    Game.player.frameInteraction = false;
    this.actor.setVisible(false);
    this.isGameObj = false;
  }

  update() {
    if (! this.actor.getVisible()) return;
    
    if(this.isGameObj){
      if (this.textProgress < this.text.length) {
        this.textProgress++;
        this.textRenderer.setText(`${this.text.slice(0, this.textProgress)}`);
      }      
    } else {
      if (this.textProgress < this.text.length) {
        this.textProgress++;
        this.textRenderer.setText(`${this.speaker.toUpperCase()}: ${this.text.slice(0, this.textProgress)}`);
      }      
    }

  }
    
}
Sup.registerBehavior(DialogBehavior);
