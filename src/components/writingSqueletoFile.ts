export class squeletoTileMapGenerator {
  filename: string;
  maps: Array<any>;
  tileset: Array<any>;

  constructor(filename: string) {
    this.filename = filename;
    this.maps = [];
    this.tileset = [];
  }

  loadMapData(maps: Array<any>) {
    this.maps = [...maps];
  }

  loadTileSet(tileset: Array<any>) {
    this.tileset = [...tileset];
  }

  writeFile() {}
}
