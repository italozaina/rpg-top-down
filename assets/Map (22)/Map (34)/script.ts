class MapBehavior extends Sup.Behavior {
  tileMap: Sup.TileMap;
  
  awake() {
    this.tileMap = this.actor.tileMapRenderer.getTileMap();    
    Sup.log(this.tileMap.getHeight());
    Game.mapWidth = this.tileMap.getWidth();
    Game.mapHeight = this.tileMap.getHeight(); 
    let tileMapAsset = Sup.get("Map/Map1/Map", Sup.TileMap);
    let options: TileMapOptions = { tileMapAsset, tileSetPropertyName: "solid" };
    new Sup.ArcadePhysics2D.Body(this.actor, Sup.ArcadePhysics2D.BodyType.TileMap, options);    
  }

  update() {
    
  }
}
Sup.registerBehavior(MapBehavior);
