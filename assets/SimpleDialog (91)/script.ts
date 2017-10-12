abstract class SimpleDialogBehavior extends InteractableBehavior {
  
  texts: string[][];
  currentText = null;

  interact() {
    if (Game.player.activeInteractable == null) {
      this.currentText = 0;
      Game.player.activeInteractable = this;
    }
    
    if (this.currentText < this.texts.length) {
      Game.dialogBehavior.show(this.texts[this.currentText][0], this.texts[this.currentText][1]);
      this.currentText++;
    } else {
      Game.dialogBehavior.hide();
      Game.player.activeInteractable = null;
    }
  }
}