namespace Game {
  export let player: PlayerBehavior;
  export let mouse: MouseBehavior;
  export let inventory: GameInventoryBehavior;
  export let mapWidth: number;
  export let mapHeight: number;  
  export let dialogBehavior: DialogBehavior;
  export let interactables: InteractableBehavior[];
  export let gameObjects: {gameObject: GameObject, quantity: number}[];
  
  let mapRoot: Sup.Actor;
  let currentMap = "Start";    

  export function init() {
    mapRoot = null;
    currentMap = "Start";
    Sup.loadScene("HUD/Prefab");
    gameObjects = [];
    for(let i = 0; i < 50; i++){
      gameObjects.push(null);
    }
    
    for(let i = 0; i < Events.parts.length; i++){
      Events.parts[i] = true;
    }    
    Sup.log(gameObjects);
  }  
  
  export function getTileMap(){
    return mapRoot.getChild("Map").tileMapRenderer.getTileMap();
  }
  
  export function loadMap(map: string) {
    if (mapRoot != null) mapRoot.destroy();
    
    // enemies = [];
    interactables = [];
    
    mapRoot = Sup.appendScene(`Maps/${map}/Prefab`)[0];
    let mapActor = mapRoot.getChild("Map");
    let tileMapAsset = Sup.get(`Maps/${map}/Map`, Sup.TileMap);
    let options: TileMapOptions = { tileMapAsset, tileSetPropertyName: "solid" };    
    new Sup.ArcadePhysics2D.Body(mapActor, Sup.ArcadePhysics2D.BodyType.TileMap, options);
    
    let spawnName = currentMap.split("/");    
    let spawn = mapRoot.getChild("Markers").getChild(`From ${spawnName[spawnName.length-1]}`).getLocalPosition().toVector2();
    Game.player.actor.arcadeBody2D.warpPosition(spawn);
    currentMap = map;
    
    mapWidth = tileMapAsset.getWidth();
    mapHeight = tileMapAsset.getHeight();
    
    let leftBorder = new Sup.Actor("Left Border", mapRoot);
    leftBorder.setLocalPosition(-0.5, mapHeight / 2);
    new Sup.ArcadePhysics2D.Body(leftBorder, Sup.ArcadePhysics2D.BodyType.Box, { width: 1, height: tileMapAsset.getHeight(), movable: false });
    
    let rightBorder = new Sup.Actor("Right Border", mapRoot);
    rightBorder.setLocalPosition(mapWidth + 0.5, mapHeight / 2);
    new Sup.ArcadePhysics2D.Body(rightBorder, Sup.ArcadePhysics2D.BodyType.Box, { width: 1, height: mapHeight, movable: false });
    
    let downBorder = new Sup.Actor("Down Border", mapRoot);
    downBorder.setLocalPosition(mapWidth / 2, -0.5);
    new Sup.ArcadePhysics2D.Body(downBorder, Sup.ArcadePhysics2D.BodyType.Box, { width: mapWidth, height: 1, movable: false });
    
    let upBorder = new Sup.Actor("Up Border", mapRoot);
    upBorder.setLocalPosition(mapWidth / 2, mapHeight + 0.5);
    new Sup.ArcadePhysics2D.Body(upBorder, Sup.ArcadePhysics2D.BodyType.Box, { width: mapWidth, height: 1, movable: false });
    
    Fade.start(Fade.Direction.In);
  }  
}

Sup.loadScene("Main menu/Prefab");
// Sup.loadScene("HUD/Prefab");
// Game.loadMap("Map1");