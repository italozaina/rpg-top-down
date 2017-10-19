class FirstItemFoundBehavior extends WonGameObjDialogBehavior {
  
  texts = [
    "\n        Got 1 " + ItemsAndEquips.items[0].getName()
  ];  
  
}
Sup.registerBehavior(FirstItemFoundBehavior);
