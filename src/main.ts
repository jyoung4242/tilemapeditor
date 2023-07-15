import "./style.css";
import { v4 as uuidv4 } from "uuid";
import { UI } from "@peasy-lib/peasy-ui";
import { Assets } from "@peasy-lib/peasy-assets";
import { Input } from "@peasy-lib/peasy-input";
import { AsepriteParser } from "aseprite-parser";
import { squeletoTileMapGenerator } from "./components/writingSqueletoFile";

const model = {
  zoomLevel: 1,
  mapObject: {
    "0-0": "9",
    "0-1": "3",
    "0-2": "10",
    "0-3": "10",
    "0-4": "11",
    "0-5": "9",
    "0-6": "9",
    "0-7": "9",
    "0-8": "9",
    "0-9": "9",
    "1-0": "9",
    "1-1": "17",
    "1-2": "14",
    "1-3": "14",
    "1-4": "2",
    "1-5": "10",
    "1-6": "10",
    "1-7": "10",
    "1-8": "10",
    "1-9": "11",
    "2-0": "9",
    "2-1": "17",
    "2-2": "14",
    "2-3": "14",
    "2-4": "14",
    "2-5": "14",
    "2-6": "14",
    "2-7": "14",
    "2-8": "14",
    "2-9": "1",
    "3-0": "9",
    "3-1": "4",
    "3-2": "8",
    "3-3": "8",
    "3-4": "8",
    "3-5": "8",
    "3-6": "16",
    "3-7": "14",
    "3-8": "14",
    "3-9": "1",
    "4-0": "9",
    " 4-1": "9",
    "4-2": "9",
    "4-3": "9",
    "4-4": "9",
    "4-5": "9",
    "4-6": "17",
    "4-7": "14",
    "4-8": "14",
    "4-9": "1",
    "5-0": "9",
    "5-1": "9",
    "5-2": "9",
    "5-3": "9",
    "5-4": "9",
    "5-5": "9",
    "5-6": "17",
    "5-7": "14",
    "5-8": "14",
    "5-9": "1",
    "6-0": "9",
    "6-1": "5",
    "6-2": "13",
    "6-3": "21",
    "6-4": "9",
    "6-5": "9",
    "6-6": "17",
    "6-7": "14",
    "6-8": "14",
    "6-9": "1",
    "7-0": "9",
    "7-1": "6",
    "7-2": "14",
    "7-3": "22",
    "7-4": "9",
    "7-5": "9",
    "7-6": "4",
    "7-7": "8",
    "7-8": "8",
    "7-9": "12",
    "8-0": "9",
    "8-1": "7",
    "8-2": "15",
    "8-3": "23",
    "8-4": "9",
    "8-5": "9",
    "8-6": "9",
    "8-7": "9",
    "8-8": "9",
    "8-9": "9",
    "9-0": "9",
    "9-1": "9",
    "9-2": "9",
    "9-3": "9",
    "9-4": "9",
    "9-5": "9",
    "9-6": "9",
    "9-7": "9",
    "9-8": "9",
    "9-9": "9",
  },
  selectedTile: undefined,
  tiles: <any>[],
  tileset: <any>undefined,
  isTileSetLoaded: false,
  levelWidthInput: undefined,
  levelHeightInput: undefined,
  TilesetWidthNumTilesInput: undefined,
  TileSetContainer: undefined,
  get getNumTilesWide() {
    if (this.TilesetWidthNumTilesInput) return parseInt((this.TilesetWidthNumTilesInput as HTMLInputElement).value);
  },
  TilesetHeightNumTilesInput: undefined,
  TileWidthInput: undefined,
  TileHeightInput: undefined,
  get getTileWidth() {
    let containerWidth;
    let containerHeight;
    let boxdims;
    if (this.TileSetContainer) boxdims = (this.TileSetContainer as HTMLElement).getBoundingClientRect();
    if (this.TileSetContainer) containerWidth = boxdims?.width;
    if (this.TileSetContainer) containerHeight = boxdims?.height;

    let numTilesW;
    if (this.TilesetWidthNumTilesInput) {
      numTilesW = parseInt((this.TilesetWidthNumTilesInput as HTMLInputElement).value);
    }

    if (containerWidth && numTilesW) return Math.floor((containerWidth - 45) / numTilesW);
  },

  loadfile: undefined,
  editorCanvas: undefined,
  gridCanvas: undefined,
  loadTileset: (_e: any, model: any) => {
    if (model.isTileSetLoaded) return;
    if (model.loadfile) {
      model.loadfile.click();
    }
  },
  loadASE: async (_e: any, model: any) => {
    if (model.loadfile.files.length == 0) return;
    if (model.loadfile.files.length > 1) return;
    const myAseprite = new AsepriteParser(model.loadfile.files[0]);

    await myAseprite.initialize();

    const tempFrames = await myAseprite.getSpriteSheet({
      rows: parseInt(model.TilesetWidthNumTilesInput.value),
      cols: parseInt(model.TilesetHeightNumTilesInput.value),
      frames: "all",
    });

    if (myAseprite.frames) {
      model.tileset = new Image();
      (model.tileset as HTMLImageElement).width = (tempFrames as HTMLImageElement).width;
      (model.tileset as HTMLImageElement).width = (tempFrames as HTMLImageElement).height;
      (model.tileset as HTMLImageElement).src = (tempFrames as HTMLImageElement).src;
      for (let y = 0; y < parseInt(model.TilesetHeightNumTilesInput.value); y++) {
        for (let x = 0; x < parseInt(model.TilesetWidthNumTilesInput.value); x++) {
          const tempcnv = document.createElement("canvas");
          const tempctx = tempcnv.getContext("2d");
          tempcnv.width = parseInt(model.TileWidthInput.value);
          tempcnv.height = parseInt(model.TileHeightInput.value);
          tempctx?.drawImage(
            tempFrames,
            x * parseInt(model.TileWidthInput.value),
            y * parseInt(model.TileHeightInput.value),
            parseInt(model.TileWidthInput.value),
            parseInt(model.TileHeightInput.value),
            0,
            0,
            parseInt(model.TileWidthInput.value),
            parseInt(model.TileHeightInput.value)
          );
          const tempImage = tempcnv.toDataURL();
          const storeImage = new Image();
          storeImage.src = tempImage;
          model.tiles.push({ id: uuidv4(), image: tempImage, color: "white", imageElement: storeImage });
        }
      }
      model.isTileSetLoaded = true;
    }
  },
  exportType: undefined,
  exportTileMap: (_e: any, m: any) => {
    if (m.exportType == undefined) return;
    if (!m.isTileSetLoaded) return;
    if (m.exportType == "image") {
      //get image from url
      if (model.editorCanvas) {
        let anchor = document.createElement("a");
        anchor.setAttribute("download", "map.png");
        let exportimage = (model.editorCanvas as HTMLCanvasElement).toDataURL("image/png").replace("image/png", "image/octet-stream"); // here is the most important part because if you dont replace you will get a DOM 18 exception.
        anchor.setAttribute("href", exportimage);
        anchor.click();
        anchor.remove();
      }
    } else if (m.exportType == "squeleto") {
      let genrator = new squeletoTileMapGenerator("myTileMap.ts");
      genrator.loadMapData([model.mapObject]);
      genrator.loadTileSet(model.tiles);
      genrator.writeFile();
    }
  },
  chgeCanvas: () => {
    updateCanvas();
  },
  selectTile: (_e: any, model: any, element: any, _at: any, object: any) => {
    object.$parent.$model.selectedTile;
    let index = (element as HTMLElement).getAttribute("data-index");
    clearTiles();
    model.tile.color = "red";
    object.$parent.$model.selectedTile = index;
    drawCanvas();
  },
  drawTile: (e: any, model: any) => {
    if (model.selectedTile == undefined) return;

    //get x,y location of click
    const postionOfCanvas = (model.editorCanvas as HTMLCanvasElement).getBoundingClientRect();
    const gridSizeX = parseInt((model.TileWidthInput as HTMLInputElement).value);
    const gridSizeY = parseInt((model.TileHeightInput as HTMLInputElement).value);
    const clickPositionX = e.clientX;
    const clickPositionY = e.clientY;
    const canvasAdjustedClickX = clickPositionX - postionOfCanvas.left;
    const canvasAdjustedClickY = clickPositionY - postionOfCanvas.top;

    //convert to tile location
    const TileXCoord = Math.floor(canvasAdjustedClickX / gridSizeX);
    const TileYCoord = Math.floor(canvasAdjustedClickY / gridSizeY);

    //write selected tile to the canvastile object
    model.mapObject[`${TileXCoord}-${TileYCoord}`] = model.selectedTile;

    //redraw canvas
    drawCanvas();
  },
};
const template = `
<div class="app"> 
<div class="admin">
    <div class="inputs">
        
        <div class="subtitle">Level Dims - in tiles</div>
        <div class="levelInputs">
            <div class="entryFlex">
                <label>Level Width</label>
                <input \${==>levelWidthInput} \${change@=>chgeCanvas} type="number" value="10"></input>
            </div>
            <div class="entryFlex">
                <label>Level Height</label>
                <input \${==>levelHeightInput} \${change@=>chgeCanvas} type="number" value="10"></input>
            </div>
            
        </div>
        
        <div class="subtitle">Tileset Dims  - in pixels</div>
        <div class="levelInputs">
            <div class="entryFlex">
                <label>Num Tiles Wide</label>
                <input \${==>TilesetWidthNumTilesInput}  type="number" value="8"></input>
            </div>
            <div class="entryFlex">
                <label>Num Tiles High</label>
                <input \${==>TilesetHeightNumTilesInput}  type="number" value="4"></input>
            </div>
        </div>
        <div class="subtitle">Tile Dims  - in pixels</div>
        <div class="levelInputs">
            <div class="entryFlex">
                <label>Tile Width</label>
                <input \${==>TileWidthInput}  type="number" value="64"></input> 
            </div>
            <div class="entryFlex">
                <label>Tile Height</label>
                <input \${==>TileHeightInput}  type="number" value="64"></input> 
            </div>
        </div>
    
    </div>
    <div \${==>TileSetContainer} class="tileset" >
        
        <div class="myButton" \${click@=>loadTileset}>LOAD TILESET</div>
        <input \${==>loadfile} class="loadTileset" type='file' \${click@=>loadTileset} \${change@=>loadASE} style="display:none"></input>
        <div class="tiles" style="">
            <div \${tile<=*tiles:id} \${click@=>selectTile} data-index="\${tile.$index}" class="tile" style="width: \${getTileWidth}px;border: 1px solid \${tile.color};background-image: url(\${tile.image})"></div>
        </div>
    </div>
    <div class="export">
        <label>Image</label>
        <input type="radio" name='exportytpe' \${'image'==>exportType} value='image'>
        <label>Squeleto Module</label>
        <input type="radio" name='exportytpe' \${'squeleto'==>exportType} value='squeleto'>
        
        <div class="myButton" \${click@=>exportTileMap} >EXPORT</div>
    </div>
</div>
<div class="editor">
    <canvas \${==>editorCanvas} class="canvas" style="z-index:1"></canvas>
    <canvas \${==>gridCanvas} class="canvas" style="z-index:2" \${click@=>drawTile}></canvas>
</div>


</div>
`;

await UI.create(document.body, model, template).attached;

/**
 * Initialization
 */

updateCanvas();

function updateCanvas() {
  if (model.editorCanvas && model.levelWidthInput && model.TileWidthInput && model.TilesetWidthNumTilesInput)
    (model.editorCanvas as HTMLCanvasElement).width =
      parseInt((model.levelWidthInput as HTMLInputElement).value) * parseInt((model.TileWidthInput as HTMLInputElement).value);
  if (model.editorCanvas && model.levelHeightInput && model.TileHeightInput)
    (model.editorCanvas as HTMLCanvasElement).height =
      parseInt((model.levelHeightInput as HTMLInputElement).value) * parseInt((model.TileHeightInput as HTMLInputElement).value);
  if (model.editorCanvas) {
    (model.editorCanvas as HTMLCanvasElement).style.width = `${(model.editorCanvas as HTMLCanvasElement).width}px`;
    (model.editorCanvas as HTMLCanvasElement).style.height = `${(model.editorCanvas as HTMLCanvasElement).height}px`;
  }
  if (model.gridCanvas && model.editorCanvas) {
    (model.gridCanvas as HTMLCanvasElement).width = (model.editorCanvas as HTMLCanvasElement).width;
    (model.gridCanvas as HTMLCanvasElement).height = (model.editorCanvas as HTMLCanvasElement).height;
    (model.gridCanvas as HTMLCanvasElement).style.width = `${(model.editorCanvas as HTMLCanvasElement).width}px`;
    (model.gridCanvas as HTMLCanvasElement).style.height = `${(model.editorCanvas as HTMLCanvasElement).height}px`;
  }
  drawGrid();
}

function getFrameNum(x: number, y: number, width: number): number {
  return y * width + x;
}

function clearTiles() {
  model.tiles.forEach((tile: { color: string }) => {
    tile.color = "white";
  });
}

function drawGrid() {
  let context;
  if (model.gridCanvas) context = (model.gridCanvas as HTMLCanvasElement).getContext("2d");
  let bw, bh, nx, ny;
  if (model.TileWidthInput && model.TileHeightInput && model.levelWidthInput && model.levelHeightInput) {
    bw = model.zoomLevel * parseInt((model.TileWidthInput as HTMLInputElement).value);
    bh = model.zoomLevel * parseInt((model.TileHeightInput as HTMLInputElement).value);
    nx = parseInt((model.levelWidthInput as HTMLInputElement).value);
    ny = parseInt((model.levelHeightInput as HTMLInputElement).value);
  }
  let p = 0;

  if (bh && bw && nx && ny) {
    for (var x = 0; x <= nx; x++) {
      context?.moveTo(x * bw, 0);
      context?.lineTo(x * bw, bh * ny);
    }

    for (var x = 0; x <= bh; x++) {
      context?.moveTo(0, x * bh);
      context?.lineTo(bw * nx, x * bh);
    }
    if (context) context.strokeStyle = "#bbbbbb";
    context?.stroke();
  }
}

function drawCanvas() {
  //iterate through mapobject and for each entry, draw the tile image at that location
  //loop through mapobject

  Object.entries(model.mapObject).forEach((tile, index) => {
    const [key, value] = tile;
    //get tileindex
    let tileIndexToDraw: number;
    if (typeof value == "string") tileIndexToDraw = parseInt(value);
    else if (typeof value == "number") tileIndexToDraw = value;
    else tileIndexToDraw = 0;

    //get image source
    const imageToDraw = model.tiles[tileIndexToDraw].imageElement;
    //get location of tile per coordinates
    const coordString = key;
    let drawX, drawY;
    if (model.TileWidthInput && model.TileHeightInput) {
      drawX = parseInt(coordString.split("-")[0]) * parseInt((model.TileWidthInput as HTMLInputElement).value);
      drawY = parseInt(coordString.split("-")[1]) * parseInt((model.TileHeightInput as HTMLInputElement).value);
    }

    let sizeX, sizeY;
    if (model.TileWidthInput) sizeX = parseInt((model.TileWidthInput as HTMLInputElement).value);
    if (model.TileHeightInput) sizeY = parseInt((model.TileHeightInput as HTMLInputElement).value);

    //do canvasdrawimage at location of tile
    let ctx;
    if (model.editorCanvas) ctx = (model.editorCanvas as HTMLCanvasElement).getContext("2d");
    if (ctx != undefined && sizeX != undefined && sizeY != undefined && drawX != undefined && drawY != undefined) {
      (ctx as CanvasRenderingContext2D).drawImage(imageToDraw, drawX, drawY, sizeX, sizeY);
    }
  });
  console.log(model.mapObject);
}
