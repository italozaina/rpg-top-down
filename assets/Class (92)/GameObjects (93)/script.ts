class GameObject {
  private id: number;
  private name: string;
  private use: boolean;
  private stack: boolean;
  private sell: boolean;
  private equip: boolean;
  private drop: boolean;
  
  constructor(id: number, name: string, use: boolean, stack: boolean, sell: boolean, equip: boolean, drop: boolean){
    this.id = id;
    this.name = name;
    this.use = use;
    this.stack = stack;
    this.sell = sell;
    this.equip = equip;
    this.drop = drop;
  }
  
  public getId(){
    return this.id;
  }
  
  public setId(id: number){
    this.id = id;
  }
  
  public getName(){
    return this.name;
  }
  
  public setName(name: string){
    this.name = name;
  }
  
  public getUse(){
    return this.use;
  }
  
  public setUse(active: boolean){
    this.use = active;
  }
  
  public getStack(){
    return this.stack;
  }
  
  public setStack(active: boolean){
    this.stack = active;
  }
  
  public getSell(){
    return this.sell;
  }
  
  public setSell(active: boolean){
    this.sell = active;
  }  
  
  public getEquip(){
    return this.equip;
  }
  
  public setEquip(active: boolean){
    this.equip = active;
  }
  
  public getDrop(){
    return this.drop;
  }
  
  public setDrop(active: boolean){
    this.drop = active;
  }  
}

namespace ItemsAndEquips {
  export let items: GameObject[];
  export let equips: GameObject[];
}

ItemsAndEquips.items = [
  new GameObject(1,"Small Health Potion", true, true, true, false, true),
  new GameObject(2,"Medium Health Potion", true, true, true, false, true),
  new GameObject(3,"Large Health Potion", true, true, true, false, true),
  new GameObject(4,"Small Mana Potion", true, true, true, false, true),
  new GameObject(5,"Medium Mana Potion", true, true, true, false, true),
  new GameObject(6,"Large Mana Potion", true, true, true, false, true),
  new GameObject(7,"Mystic Light Rune", false, false, false, false, false),
  new GameObject(8,"Mystic Dark Rune", false, false, false, false, false),
];

ItemsAndEquips.equips = [
  new GameObject(1,"Dagger", false, false, true, true, true),
  new GameObject(2,"Spear", false, false, true, true, true),
  new GameObject(3,"Arc and Arrows", false, false, true, true, true),
  new GameObject(4,"Leather Armor", false, false, true, true, true),
  new GameObject(5,"Leather Legs", false, false, true, true, true),
];