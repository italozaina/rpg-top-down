namespace Fade {

  let fadeSpriteRndr: Sup.SpriteRenderer;
  let fadeDirection = null;
  let tween: Sup.Tween;

  export enum Direction { In, Out };
  
  export function isFading() { return fadeSpriteRndr != null; }

  export function start(direction: Direction, callback?: Function, options={ duration: 300 }) {
    let [ startOpacity, endOpacity ] = direction === Direction.In ? [ 1, 0 ] : [ 0, 1 ];

    if (fadeSpriteRndr != null) {
      if (fadeDirection == direction) return;
      
      startOpacity = fadeSpriteRndr.getOpacity();
    } else {
      fadeSpriteRndr = new Sup.SpriteRenderer(new Sup.Actor("Black Screen", Sup.getActor("Camera")), "Misc/Fade/Black Screen");
      fadeSpriteRndr.setOpacity(startOpacity).actor.setLocalZ(-0.1).setLocalScale(10);
    }
    
    fadeDirection = direction;

    if (tween != null) tween.stop();
    tween = new Sup.Tween(fadeSpriteRndr.actor, { opacity: startOpacity })
      .to({ opacity: endOpacity }, options.duration).easing(TWEEN.Easing.Cubic.In)
      .onUpdate((object) => { fadeSpriteRndr.setOpacity(object.opacity); })
      .onComplete(() => { end(); if (callback != null) callback() })
      .start();
  }

  function end() {
    fadeSpriteRndr.actor.destroy();
    fadeSpriteRndr = null;
    fadeDirection = null;
    tween = null;
  }
}