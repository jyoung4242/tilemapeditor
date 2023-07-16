const FILE_HEADER = `
/***********************************************************************  
  GENERATED MAP FILE FOR SQUELETO FROM LEVEL EDITOR                       
  THIS WILL INCLUDE THE MAP CLASS AND THE TILEMAP CLASS FOR EACH LEVEL    
  FEEL FREE TO MODIFY AS NEEDED                                  
  IN YOUR SQEUELETO PROJECT DIRECTORY, THIS GOES IN THE /MAP DIRECTORY         
***********************************************************************/  
`;

const FILE_IMPORTS = `
// import needed Squeleto modules
import { Assets } from "@peasy-lib/peasy-assets";
import { GameObject } from "../../_Squeleto/GameObject";
import { TileMap, TileMapConfig, Tile } from "../../_Squeleto/LevelEditor";
import { GameMap, MapConfig } from "../../_Squeleto/MapManager";
`;

export class squeletoTileMapGenerator {
  filename: string;
  fileString: string;
  mapName: string;
  maps: Array<any>;
  tileset: Array<any>;
  mapdims: { w: number; h: number };
  rows: number;
  cols: number;
  tilesize: number;

  constructor(filename: string, mapclass: string, mapdims: { w: number; h: number }, rows: number, cols: number, tilesize: number) {
    this.filename = filename;
    this.maps = [];
    this.tileset = [];
    this.fileString = "";
    this.mapName = mapclass;
    this.mapdims = mapdims;
    this.rows = rows;
    this.cols = cols;
    this.tilesize = tilesize;
  }

  loadMapData(maps: Array<any>) {
    this.maps = [...maps];
  }

  loadTileSet(tileset: Array<any>) {
    this.tileset = [...tileset];
  }

  writeFile(): number {
    if (this.maps.length == 0) return -1;
    if (this.tileset.length == 0) return -2;
    /**
     * create big Filestring of file data based on data loaded
     */
    this.fileString = "";
    this.fileString = this.fileString.concat(FILE_HEADER);
    this.fileString = this.fileString.concat(FILE_IMPORTS);

    // create map class
    this.fileString = this.fileString.concat(`
    export class ${this.mapName} extends GameMap{
      static who: GameObject;
      constructor(assets: any, level: TileMap) {
        let config: MapConfig = {
          name: ${this.mapName},
          width: ${this.mapdims.w},
          height: ${this.mapdims.h},
          `);

    //outline levels
    const layers = `  layers:[`;
    const numLayers = this.maps.length;
    let layerstring = "";
    for (let index = 0; index < this.maps.length; index++) {
      const map = this.maps[index];
      layerstring = layerstring.concat(`level[${index}].tileMapImage.src,`);
    }
    layerstring = layerstring.concat(`],
    `);
    this.fileString = this.fileString.concat(layers, layerstring);

    //outline walls
    let wallstring = "  walls:[...";
    for (let index = 0; index < this.maps.length; index++) {
      const map = this.maps[index];
      wallstring = wallstring.concat(`level[${index}].walls,`);
    }
    wallstring = wallstring.concat(`],
    `);
    this.fileString = this.fileString.concat(wallstring);
    this.fileString = this.fileString.concat(`    triggers:[],
  };  
    super(config);
    }
    
    static async create(assets:any){  
      let levelArray = <any>[]; 
  `);

    // outline Create method

    this.maps.forEach((map: any, index: number) => {
      let levelString = "";
      levelString = levelString.concat(`
      
      const level${index} = await level${index}TileMap.create(assets);
      levelArray.push(level${index});
      `);
      this.fileString = this.fileString.concat(levelString);
    });
    this.fileString = this.fileString.concat(`return new ${this.mapName}(assets, levelArray);
      }
    }
    
    `);

    /*******things going wrong here */
    // make tilemap classes
    let levelclassString = "";
    this.maps.forEach((map, index) => {
      levelclassString = "";
      levelclassString = levelclassString.concat(`class level${index}TileMap extends TileMap{
      
      constructor(config: TileMapConfig, assets: any) {

        super(config);

      `);
      this.fileString = this.fileString.concat(levelclassString);
      levelclassString = "";

      this.tileset.forEach((tile, i) => {
        let tilestring = `let TileT${i} = new Tile({src: assets, tileWidth:${tile.width}, tileHeight:${tile.width}, offsetX:${tile.offsetX},offsetY:${tile.offsetY} });
        `;
        levelclassString = levelclassString.concat(tilestring);
      });

      this.fileString = this.fileString.concat(levelclassString);

      //tile assignments
      this.fileString = this.fileString.concat(`
      let assignmentMap = new Map<string, { tile: Tile; wall: boolean }>();`);
      levelclassString = "";
      this.tileset.forEach((tile, i) => {
        let tilestring = getStringWithIncrementingAsciiChar(i);
        levelclassString = levelclassString.concat(tilestring);
      });
      this.fileString = this.fileString.concat(levelclassString);
      this.fileString = this.fileString.concat(`
      this.setTileMapConfig(assignmentMap);
  }
  
  `);
      // TileMap create method
      this.fileString = this.fileString.concat(`static async create(assets: any) {
    let map = [`);

      /*
      For each row/column, create the text array which is an array of strings,
      each element is the rows, and the length of the strings is the columns */
      let asciimap: Array<string> = [];
      for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
        let rowstring = "";
        rowstring = rowstring.padStart(this.cols, " ");
        asciimap.push(rowstring);
      }
      console.log(asciimap);
      /*
      For each entry in the this.maps[index], navigate to that asciimap array index, and 
      replace the char at the appropriate spot in the string */
      console.log(this.maps[index]);

      Object.entries(this.maps[index]).forEach(map => {
        let [key, entry] = map;
        let asciirow = parseInt(key.split("-")[1]);
        let asciicol = parseInt(key.split("-")[0]);
        console.log(key, asciirow, asciicol, entry);
        let swappedChar = parseInt(entry as string) + 0x30;
        asciimap[asciirow] = replaceCharacterByIndex(asciimap[asciirow], asciicol, swappedChar);
      });
      console.log(asciimap);

      //for each row write the updated asciimap to the filestring
      for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
        this.fileString = this.fileString.concat(`"${asciimap[rowIndex]}",\n`);
      }
      this.fileString = this.fileString.concat(`];

      let config: TileMapConfig = {
        template: map,
        tileSize: ${this.tilesize},
        rows: ${this.rows},
        cols: ${this.cols},
      };

      const mymap = new level${index}TileMap(config, assets);
    await mymap.initialize();
    return mymap;
  }
}

      `);
    });

    let blob: Blob = new Blob([this.fileString], { type: "text/plain" });
    const anchor = document.createElement("a");
    anchor.setAttribute("href", URL.createObjectURL(blob));
    anchor.setAttribute("download", this.filename);
    anchor.click();
    anchor.remove();
    return 0;
  }
}

function replaceCharacterByIndex(inputString: string, index: number, newCharacter: number): string {
  if (index < 0 || index >= inputString.length) {
    // Check if the index is out of bounds
    return inputString;
  }

  // Convert the string to an array of characters
  const stringArray = inputString.split("");

  // Replace the character at the given index
  stringArray[index] = String.fromCharCode(newCharacter);

  // Convert the array back to a string and return it
  return stringArray.join("");
}

function getStringWithIncrementingAsciiChar(index: number) {
  return `assignmentMap.set("` + String.fromCharCode(48 + index) + `", { tile: TileT${index}, wall: false })\n`;
}
