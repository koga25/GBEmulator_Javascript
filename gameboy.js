const enums = Object.freeze(
    {
        CLOCKSPEED: 4194304,
        FREQUENCY_00: 4096,
        FREQUENCY_01: 262144,
        FREQUENCY_10: 65536,
        FREQUENCY_11: 16384,
        //Timer counter(R/W), incremented by a clock frequency.
        TIMA: 0xFF05,
        //Timer modulo(R/W), When the TIMA overflows, this data will be loaded.
        TMA: 0xFF06,
        //Timer control (R/W), bit 2 stops(0) and starts(1) the timer, bit 1 and 0 controls the frequencies
        TMC: 0xFF07,
        //Divider register(R/W), incremented at a rate of 16384hz, writing anything at this location resets the register.
        DIV: 0xFF04,
        //LCDC Y-Coordinate (R), indicates the vertical line to which the present data is transfered to the LCD Driver, 0 <= LY <= 153
        LY: 0xFF44,
        //STAT LCDC Status (R/W), bits 6-3 controls interrupts, bit 2 is a coincidence flag (LYC != LY (0)) or (LYC == LY(1)) and bits 1 and 0 
        //tells which mode the LCD is on. HBlank (00) ----- VBLANK (01) ----- OAM SEARCH (10) ----- LCD DATA TRANSFER (11)
        STAT: 0xFF41,
        //Interrupt Enable (R/W), enable the interrupt especified by bit value.
        //BIT 0 - V-Blank  Interrupt Enable  (INT 40h)  (1=Enable).
        //BIT 1 - LCD STAT Interrupt Enable  (INT 48h)  (1=Enable).
        //BIT 2 - TIMER Interrupt Enable  (INT 50h)  (1=Enable).
        //BIT 3 - Serial Interrupt Enable  (INT 58h)  (1=Enable).
        //BIT 4 - Joypad Interrupt Enable  (INT 60h)  (1=Enable).
        IE: 0xFFFF,
        //Interrupt FLag (R/W), requests the interrupt especified by bit value.
        //BIT 0 - V-Blank  Interrupt Enable  (INT 40h)  (1=Enable).
        //BIT 1 - LCD STAT Interrupt Enable  (INT 48h)  (1=Enable).
        //BIT 2 - TIMER Interrupt Enable  (INT 50h)  (1=Enable).
        //BIT 3 - Serial Interrupt Enable  (INT 58h)  (1=Enable).
        //BIT 4 - Joypad Interrupt Enable  (INT 60h)  (1=Enable).
        IF: 0xFF0F,
        //LY Compare (R/W), the LYC compares itself with the LY. if the values are the same it causes the STAT to set the coincident flag
        LYC: 0xFF45,
        //LCD Control (R/W)
        LCDC: 0xFF40,
    });

//Registers and memory map
var AF = new Uint8Array(2); //register AF
var BC = new Uint8Array(2); //register BC
var DE = new Uint8Array(2); //register DE
var HL = new Uint8Array(2); //register HL
var pc = new Uint16Array(1); //Program Counter
var opcode = new Uint16Array(1); //Operation code
var sp = new Uint16Array(1); //Stack pointer
var memory = new Uint8Array(0xFFFF + 1); //64Kb

var cartridgeMemory = new Uint8Array(0x3FFF * 128); //2Mb of memory cartridge


//Video and timings

//scanlineCounter uses a 16 bit variable to represent 456 clocks, so when it becomes lower than 0 it will wrap to 456;
//everytime it wraps around we update the LY register ($ff44) by 1, the range of the LY register is 0-153;
var scanlineCounter;
//cpu does 4194304 cycles in a second and it renders in 60FPS.
const maxCycleBeforeRender = Object.freeze(Math.floor(enums.CLOCKSPEED / 60));
//how many cycles the cpu did in 1 milisecond
var cyclesBeforeLCDRender;
//the counter is found by the equation CLOCKSPEED/FREQUENCY, clockspeed is 4194304 and the frequency is set by the TMC Register (4096 in startup).
var timerCounter = Math.floor(enums.CLOCKSPEED / enums.FREQUENCY_00);
//we need to have an reference to the total timer chosen because of the Timer Obscure Behavior implementation.
var timerFrequencyChosen = Math.floor(enums.CLOCKSPEED / enums.FREQUENCY_00);
//the counter of divider register
var divCounter = Math.floor(enums.CLOCKSPEED / enums.FREQUENCY_00);
//the cycles the divider register was on until now
var dividerRegisterCycles = 0;


//160 * 144 is the window size, but we multiply it by 4 because the imageData for the canvas 2D receives the RGBA in 4 parts.
var pixelBuffer = new Uint8ClampedArray(WIDTH * HEIGHT * 4);
var colorPalletes = new Uint8ClampedArray([
    0xE0, 0xF8, 0xD0, 0xFF, 0x88, 0xC0, 0x70, 0xFF, 0x34, 0x68, 0x56, 0xFF,
    0x08, 0x18, 0x20, 0xFF, 0xE0, 0xF8, 0xD0, 0xFF, 0x88, 0xC0, 0x70, 0xFF,
    0x34, 0x68, 0x56, 0xFF, 0x08, 0x18, 0x20, 0xFF, 0xE0, 0xF8, 0xD0, 0xFF,
    0x88, 0xC0, 0x70, 0xFF, 0x34, 0x68, 0x56, 0xFF, 0x08, 0x18, 0x20, 0xFF
]);


//interrupts and joypad
var masterInterrupt = false; //Interrupt Master Enable Flag - IME
//when the cpu executes the enable interrupt instruction it will only take effect in the next instruction we need a delay to activate the IME
var delayMasterInterrupt = false;
var joypadKeys = new Uint8Array(1);
joypadKeys[0] = 0xFF;
var timerInterruptDelay = false;

//ram and MBC related parts
var isRamEnabled = false;
var MBC2Enabled = false;
var MBC1Enabled = false;

var MBC3Enabled = false;
//if this register goes from false to true, update the RTC registers (ram bank 0x8 through 0xC)
//ram bank 0x8 - RTC Seconds (0-59) (0x0-0x3B)
//ram bank 0x9 - RTC Minutes (0-59) (0x0-0x3B)
//ram bank 0xA - RTC Hours (0-23) (0x0-0x17)
//ram bank 0xB - RTC Lower 8bits of Day Counter (0x0-0xFF)
//ram bank 0xC - RTC Higher 8bits of Day Counter. Bits used: 
//                             Bit 0 (Most significant bit of Day Counter, bit 8)
//                             Bit 6 (Halt. 0 = Active, 1 = Stop Timer)
//                             Bit 7 (Day Counter Carry Bit. 1 = Counter Overflow)
var latchClockRegister = false;
var RTC_Increase = false;
var RTC_Seconds = new Uint8Array(1);
var RTC_Minutes = new Uint8Array(1);
var RTC_Hours = new Uint8Array(1);
var RTC_LowDay = new Uint8Array(1);
var RTC_HighDay = new Uint8Array(1);

//////////////////////////////////////////////////////////Timing Hacks//////////////////////////////////////////////////////////////////////////////////
//when the LCD overflows from 153 to 0 it stays in 153 for another clock and if LYC == 153 it requests an interrupt when LY is finally set to 0
var LCD_Line_Overflow = false;
//IF VBlank interrupt bit is only changed to '1' during one cycle (when the LCD controller goes from non - VBL mode to VBL mode).
//If the IF register bit is set to  '0' the same cycle it's going to '1', the interrupt isn't triggered (IF will remain '0').
var VBlank_Set_To_0 = false;


var ram = new Uint8Array(0x2000 * 16);
var ramBankNumber;
//if false: ROM Banking Mode (up to 8KByte RAM, 2MByte ROM).   if true: RAM Banking Mode (up to 32KByte RAM, 512KByte ROM).
var RomRamSELECT;
//the rom bank begins at 0x01 because rom bank 0 is the memory range 0x0000-0x3FFF of gameboy memory, 
var romBankNumber;
//if we overflow the value it will wrap around. The max value is found 
var maxRomBankNumber;
var maxRamBankNumber;

//HALT
var halt;

//graphics
var isRunning = false;

function initialize() { };
function loadGame() { };
function beginGame() { };
function getMBC() { };
function getMaxRomBankNumber() { };
function getMaxRamBankNumber() { };
function doInterrupts() { };
function emulateCycle() { };

console.hex = (d) => console.log((Object(d).buffer instanceof ArrayBuffer ? new Uint8Array(d.buffer) :
    typeof d === 'string' ? (new TextEncoder('utf-8')).encode(d) :
        new Uint8ClampedArray(d)).reduce((p, c, i, a) => p + (i % 16 === 0 ? i.toString(16).padStart(6, 0) + '  ' : ' ') +
            c.toString(16).padStart(2, 0) + (i === a.length - 1 || i % 16 === 15 ?
                ' '.repeat((15 - i % 16) * 3) + Array.from(a).splice(i - i % 16, 16).reduce((r, v) =>
                    r + (v > 31 && v < 127 || v > 159 ? String.fromCharCode(v) : '.'), '  ') + '\n' : ''), ''));




////////////////////////////////////////////////////////////////////////START OF THE PROGRAM//////////////////////////////////////////////////////////////////////////////////
loadGame();
window.setInterval(beginGame, 100);


function initialize() {
    pc[0] = 0x100; //start of the program counter
    scanlineCounter = 0x1c8
    scanlineCounter += 56;
    cyclesBeforeLCDRender = 0;
    RomRamSELECT = false;
    romBankNumber = 0x01;
    ramBankNumber = 0;
    halt = false;


    //initializing registers
    AF.set([0x01, 0xB0]);
    BC.set([0x00, 0x13]);
    DE.set([0x00, 0xD8]);
    HL.set([0x01, 0x4D]);
    memory[0xFF00] = 0xCF; //JOYPAD
    memory[enums.TIMA] = 0x00; //TIMA
    memory[enums.TMA] = 0x00; //TMA
    memory[enums.TMC] = 0xF8; //TAC
    memory[enums.DIV] = 0xAB;
    divCounter -= 0xCC;
    memory[0xFF10] = 0x80; //NR10
    memory[0xFF11] = 0xBF; //NR11
    memory[0xFF12] = 0xF3; //NR12
    memory[0xFF14] = 0xBF; //NR14
    memory[0xFF16] = 0x3F; //NR21
    memory[0xFF17] = 0x00; //NR22
    memory[0xFF19] = 0xBF; //NR24
    memory[0xFF1A] = 0x7F; //NR30
    memory[0xFF1B] = 0xFF; //NR31
    memory[0xFF1C] = 0x9F; //NR32
    memory[0xFF1E] = 0xBF; //NR33
    memory[0xFF20] = 0xFF; //NR41
    memory[0xFF21] = 0x00; //NR42
    memory[0xFF22] = 0x00; //NR43
    memory[0xFF23] = 0xBF; //NR30
    memory[0xFF24] = 0x77; //NR50
    memory[0xFF25] = 0xF3; //NR51
    memory[0xFF26] = 0xF1; //the value is different for GB and SGB; -> NR52
    memory[enums.LCDC] = 0x91; //LCDC
    memory[enums.STAT] = 0x85;
    memory[0xFF42] = 0x00; //SCY
    memory[0xFF43] = 0x00; //SCX
    memory[enums.LY] = 0x00;
    memory[0xFF45] = 0x00; //LYC
    memory[0xFF47] = 0xFC; //BGP
    memory[0xFF48] = 0xFF; //0BP0
    memory[0xFF49] = 0xFF; //0BP1
    memory[0xFF4A] = 0x00; //WY
    memory[0xFF4B] = 0x00; //WX
    memory[enums.IF] = 0xE1;
    memory[0xFFFF] = 0x00; //IE
    
    sp[0] = 0xFFFE;
}

function loadGame() {    
    if (!isRunning) {
        //getting the the element of the Input type named ("file-selector") created in the html portion of the code;
        const fileSelector = document.getElementById("file-selector");
        //if there was a change in the Input, then resolve it;
        fileSelector.addEventListener("change", (event) => {
            Promise.resolve().then(_ => {
                //get the list of the files that we received;
                const fileList = event.target.files;
                console.log(fileList);
                if (fileList !== null) {
                    //read the file if it isn't empty;
                    const reader = new FileReader();
                    reader.onload = function () {
                        //console.hex(reader.result);
                        //memory = reader.result;
                        //memory = new Uint8Array(reader.result, 0, 0x8000);
                        var game = new Uint8Array(reader.result, 0, 0x8000);
                        for (var i = 0; i < game.length; i++){
                            memory[i] = game[i];
                        }
                        initialize();
                        getMBC();
                        getMaxRomBankNumber();
                        getMaxRamBankNumber();
                        //console.hex(memory);
                    }
                    reader.readAsArrayBuffer(fileSelector.files[0]);
                    isRunning = true;
                    //initializing parts of the code;
                }
            });
        });
    }
}

function beginGame() {
    for (var x = 0; x < 500; x++) {
        if (isRunning) {
            if (cyclesBeforeLCDRender < (maxCycleBeforeRender)) {
                emulateCycle();
                doInterrupts();
                /*window.addEventListener("keydown", (event) => {
                    if (event.defaultPrevented) {
                        return;
                    }
    
                    switch (event.key) {
                        case "ArrowDown":
                            isRunning = false;
                            break;
                    }
                });*/
                //handleEvents();
            }
            else {
                updateGraphics();
                cyclesBeforeLCDRender = 0;
            }
        }
    }
    
}

function clockTiming(cycles) {
    if (cycles != 0) {
        setLCDSTAT();
        cyclesBeforeLCDRender += cycles;
        updateTimers(cycles);
        //if bit 2 is 1, the clocks are active and will change values
        if (testBit(memory[enums.LCDC], 7)) {
            let scanlineUnderflow = cycles - scanlineCounter;
            scanlineCounter -= cycles;
            if (scanlineCounter <= 0) {
                memory[enums.LY]++;
                scanlineCounter = 456;
                scanlineCounter -= scanlineUnderflow;

                if (memory[enums.LY] == 144) {
                    requestInterrupt(0);
                    //IMPLEMENT INTERRUPT
                }
                else if (memory[enums.LY] > 153) {

                    memory[enums.LY] = 0;
                }
                else if (memory[enums.LY] <= 143) {
                    drawScanLine();
                }

            }
        }
    }
}

function requestInterrupt(number) {
    return;
}

function drawScanLine() {
    if (testBit(memory[enums.LCDC], 0)) {
        renderTiles();
    }

    if (testBit(memory[enums.LCDC], 1)) {
        renderSprites();
    }
}

function renderTiles()
{
    if (!testBit(memory[enums.LCDC], 7)) {
        return;
    }
    let locationOfTileData = new Uint16Array([0]);
    let offset = new Uint8Array([0]);
    let unsign = true;
    //checking the position of memory the BG tile data is located, if testBit is true, BG = 0x8000-0x8FFF, else, 0x8800-0x97FF
    //this will determine where to search for the data of the tile number that needs to be displayed.

    if (testBit(memory[enums.LCDC], 4)) {
        locationOfTileData[0] = 0x8000;
    }
    else {
        offset[0] = 128;
        unsign = false;
        locationOfTileData[0] = 0x8800;
    }

    let locationOfTileNumberBG = new Uint16Array([0]);
    let locationOfTileNumberWindow = new Uint16Array([0]);
    let isWindowEnabled = false;
    let windowX = new Uint8Array([0]);
    let windowY = new Uint8Array([0]);
    //checking the position of memory the BG Tile Map Display is located, if testBit is true, BG = 9C00-9FFF, else, 9800-9BFF
    //this will determine where to search for the number of the tile that we will need to search.

    //if bit 5 is set, getting location of tile number of Windows.
    if (testBit(memory[enums.LCDC], 5)) {
        //This change is not documented in the PANDOCS or the other documents that is referenced online, ZELDA needs this to display the window.
        //if 0 <= wx < 7, wx = 7;
        if (memory[0xFF4B] < 7 && memory[0xFF4B] >= 0) {
            memory[0xFF4B] = 7;
        }
        windowX[0] = memory[0xFF4B] - 7;
        windowY[0] = memory[0xFF4A];
        isWindowEnabled = true;
        if (testBit(memory[enums.LCDC], 6)) {
            locationOfTileNumberWindow[0] = 0x9C00;
        }
        else {

            locationOfTileNumberWindow[0] = 0x9800;
        }
    }
    //else get location of tile number of Background

    if (testBit(memory[enums.LCDC], 3)) {
        locationOfTileNumberBG[0] = 0x9C00;
    }
    else {

        locationOfTileNumberBG[0] = 0x9800;
    }

    //the position of memory of the tile number XX is: 0x8XX0;
    let tileNumber = new Uint8Array([0]);
    let MSB = new Uint8Array([0]);//most significant bit
    let LSB = new Uint8Array([0]);//less significant bit
    let lineOfTile = new Uint8Array([0, 0]);
    let memoryPosition = new Uint16Array([0]);

    let ScrollY = new Uint8Array([memory[0xFF42]]);
    let ScrollX = new Uint8Array([memory[0xFF43]]);
    //in the BG map tile numbers every byte contains the number of the tile (position of tile in memory) to be displayed in a 32*32 grid, 
    //every tile hax 8*8 pixels, totaling 256*256 pixels that is drawn to the screen.
    //printf("%x", (0x9800) + (32 * y));
    for (let x = 0; x < 160; x++)
    {
        let xPos = new Uint8Array([0]);
        let yPos = new Uint8Array([0]);
        if (isWindowEnabled[0] && memory[enums.LY] >= windowY[0] && x >= windowX[0]) {
            xPos[0] = (((x - windowX[0]) / 8) & 0x1F);
            yPos[0] = memory[enums.LY] - windowY[0];
            if (unsign) {
                tileNumber = memory[((locationOfTileNumberWindow[0]) + xPos[0]) + ((yPos[0] / 8) * 32)];
            }
            else {
                tileNumber = ( memory[((locationOfTileNumberWindow[0]) + xPos[0]) + ((yPos[0] / 8) * 32)] >> 0);
            }
        }
        else {
            xPos = (((x + ScrollX) / 8) & 0x1F);
            yPos = ((memory[enums.LY] + ScrollY));
            if (unsign) {
                tileNumber[0] = memory[((locationOfTileNumberBG[0]) + xPos[0]) + ((yPos[0] / 8) * 32)];
            }
            else {
                //>>0 operator casts the variable to signed 32bit int, >>>0 operator casts to unsigned 32 bit int
                tileNumber[0] = (memory[((locationOfTileNumberBG[0]) + xPos[0]) + ((yPos[0] / 8) * 32)] >> 0);
            }
        }

        //printf("tileNumber: %X   lineOfTile[0]: ", tileNumber);

        //for every tile there is 16 bytes, for 2 bytes there is 8 pixels to be drawn. 
        //getting first byte of the line
        let tileLocation = new Uint16Array([locationOfTileData]);

        if (unsign) {
            tileLocation[0] += tileNumber[0] * 16;
        }
        else {
            tileNumber[0] += 128;
            tileLocation[0] += tileNumber[0] * 16;
        }
        //unsigned short bytePos = ((yPos % 8) * 2);
        let bytePos = new Uint8Array([(((yPos[0]) % 8) * 2)]);
        memoryPosition[0] = tileLocation[0] + (bytePos[0]);
        lineOfTile[0] = memory[memoryPosition[0]];
        //printf("%X", 0x8000 + (tileNumber * 10) + (2 * yPixel));
        //getting second byte of the line
        memoryPosition[0] = tileLocation[0] + 1 + (bytePos[0]);
        lineOfTile[1] = memory[memoryPosition];
        let pixelPosition = 0;
        if (isWindowEnabled[0] && x >= windowX[0] && memory[enums.LY] >= windowY[0]) {
            pixelPosition = ((((x - windowX[0]))) % 8);
        }
        else {
            pixelPosition = ((ScrollX[0] + x) % 8);
        }

        MSB[0] = (lineOfTile[1] & (0b10000000 >> pixelPosition));
        MSB[0] >>= (7 - pixelPosition);
        LSB[0] = (lineOfTile[0] & (0b10000000 >> pixelPosition));
        LSB[0] >>= (7 - pixelPosition);
        //ypos=2 && xpos = 2
        colorPallete(MSB[0], LSB[0], x, memory[enums.LY], false, 0);
        /*MSB = (lineOfTile[1] & (0b10000000 >> (x % 8)));
        MSB >>= (7 - (x%8));
        LSB = (lineOfTile[0] & (0b10000000 >> (x % 8)));
        LSB >>= (7 - (x % 8));
        colorPallete(MSB, LSB, x, memory[LY], false);*/
        /*for (int xPixel = 0; xPixel < 8; xPixel++)
        {
            MSB = (lineOfTile[1] & (0b10000000 >> xPixel));
            MSB >>= (7 - xPixel);
            LSB = (lineOfTile[0] & (0b10000000 >> xPixel));
            LSB >>= (7 - xPixel);
            colorPallete(MSB, LSB, x, memory[LY], false);
        }*/
        //printf("\n");
    }
}

function colorPallete(MSB, LSB, xPixel, yPixel, sprite, chosenPallete)
{
    let colorPalleteOffset;
    let pixelOffset;
    if (sprite) {

        switch (MSB) {
            case 0:
                switch (LSB) {
                    case 0:
                        //00 is transparent.
                        return;
                    case 1:
                        //blue-green color
                        //SDL_SetRenderDrawColor(renderer, 51, 97, 103, 255);
                        colorPalleteOffset = chosenPallete * 4 * 1;
                        pixelOffset = (((WIDTH * yPixel) + xPixel) * 4)
                        pixelBuffer[pixelOffset] = colorPalletes[colorPalleteOffset];
                        pixelBuffer[pixelOffset + 1] = colorPalletes[colorPalleteOffset + 1];
                        pixelBuffer[pixelOffset + 2] = colorPalletes[colorPalleteOffset + 2];
                        pixelBuffer[pixelOffset + 3] = colorPalletes[colorPalleteOffset + 3];
                        //SDL_SetRenderDrawColor(renderer, 136, 192, 112, 255);
                        break;
                }
                break;
            case 1:
                switch (LSB) {
                    case 0:
                        //light green color
                        //SDL_SetRenderDrawColor(renderer, 82, 142, 21, 255);
                        colorPalleteOffset = chosenPallete * 4 * 2;
                        pixelOffset = (((WIDTH * yPixel) + xPixel) * 4)
                        pixelBuffer[pixelOffset] = colorPalletes[colorPalleteOffset];
                        pixelBuffer[pixelOffset + 1] = colorPalletes[colorPalleteOffset + 1];
                        pixelBuffer[pixelOffset + 2] = colorPalletes[colorPalleteOffset + 2];
                        pixelBuffer[pixelOffset + 3] = colorPalletes[colorPalleteOffset + 3];
                        //SDL_SetRenderDrawColor(renderer, 52, 104, 86, 255);
                        break;
                    case 1:
                        //dark green color
                        //SDL_SetRenderDrawColor(renderer, 20, 48, 23, 255);
                        const colorPalleteOffset = chosenPallete * 4 * 3;
                        const pixelOffset = (((WIDTH * yPixel) + xPixel) * 4)
                        pixelBuffer[pixelOffset] = colorPalletes[colorPalleteOffset];
                        pixelBuffer[pixelOffset + 1] = colorPalletes[colorPalleteOffset + 1];
                        pixelBuffer[pixelOffset + 2] = colorPalletes[colorPalleteOffset + 2];
                        pixelBuffer[pixelOffset + 3] = colorPalletes[colorPalleteOffset + 3];
                        //SDL_SetRenderDrawColor(renderer, 8, 24, 32, 255);
                        break;
                }
                break;
        }
    }
    else {
        switch (MSB) {
            case 0:
                switch (LSB) {
                    case 0:
                        //white color
                        //SDL_SetRenderDrawColor(renderer, 255, 255, 255, 255);
                        colorPalleteOffset = 0;
                        pixelOffset = (((WIDTH * yPixel) + xPixel) * 4)
                        pixelBuffer[pixelOffset] = colorPalletes[0];
                        pixelBuffer[pixelOffset + 1] = colorPalletes[1];
                        pixelBuffer[pixelOffset + 2] = colorPalletes[2];
                        pixelBuffer[pixelOffset + 3] = colorPalletes[3];
                        //SDL_SetRenderDrawColor(renderer, 224, 248, 208, 255);
                        break;
                    case 1:
                        //blue-green color
                        //SDL_SetRenderDrawColor(renderer, 51, 97, 103, 255);
                        colorPalleteOffset = chosenPallete * 4 * 1;
                        pixelOffset = (((WIDTH * yPixel) + xPixel) * 4)
                        pixelBuffer[pixelOffset] = colorPalletes[colorPalleteOffset];
                        pixelBuffer[pixelOffset + 1] = colorPalletes[colorPalleteOffset + 1];
                        pixelBuffer[pixelOffset + 2] = colorPalletes[colorPalleteOffset + 2];
                        pixelBuffer[pixelOffset + 3] = colorPalletes[colorPalleteOffset + 3];
                        //SDL_SetRenderDrawColor(renderer, 136, 192, 112, 255);
                        break;
                }
                break;
            case 1:
                switch (LSB) {
                    case 0:
                        //light green color
                        //SDL_SetRenderDrawColor(renderer, 82, 142, 21, 255);
                        colorPalleteOffset = chosenPallete * 4 * 2;
                        pixelOffset = (((WIDTH * yPixel) + xPixel) * 4)
                        pixelBuffer[pixelOffset] = colorPalletes[colorPalleteOffset];
                        pixelBuffer[pixelOffset + 1] = colorPalletes[colorPalleteOffset + 1];
                        pixelBuffer[pixelOffset + 2] = colorPalletes[colorPalleteOffset + 2];
                        pixelBuffer[pixelOffset + 3] = colorPalletes[colorPalleteOffset + 3];
                        //SDL_SetRenderDrawColor(renderer, 52, 104, 86, 255);
                        break;
                    case 1:
                        //dark green color
                        //SDL_SetRenderDrawColor(renderer, 20, 48, 23, 255);
                        colorPalleteOffset = chosenPallete * 4 * 3;
                        pixelOffset = (((WIDTH * yPixel) + xPixel) * 4)
                        pixelBuffer[pixelOffset] = colorPalletes[colorPalleteOffset];
                        pixelBuffer[pixelOffset + 1] = colorPalletes[colorPalleteOffset + 1];
                        pixelBuffer[pixelOffset + 2] = colorPalletes[colorPalleteOffset + 2];
                        pixelBuffer[pixelOffset + 3] = colorPalletes[colorPalleteOffset + 3];
                        //SDL_SetRenderDrawColor(renderer, 8, 24, 32, 255);
                        break;
                }
                break;
        }
    }
    /*SDL_RenderDrawPoint(renderer, xPixel, yPixel);
    if (everytime)
    {
        SDL_RenderPresent(renderer);
    }*/
}

function setLCDSTAT() {
    if (!testBit(memory[enums.LCDC], 7)) {
        memory[enums.LY] = 0;
        scanlineCounter = 456;
        memory[enums.STAT] &= 0b11111100;
        return;
    }
    let currentMode = (memory[enums.STAT] & 0b00000011);
    let mode = 0;
    let reqInterrupt = false;
    if (memory[enums.LY] >= 144) {
        if (scanlineCounter >= 456) {

        }
        else {
            //setting mode
            mode = 1;
            //setting mode bits
            memory[enums.STAT] = SET(memory[enums.STAT], 0, 0);
            memory[enums.STAT] = RES(memory[enums.STAT], 1, 0);
            //check if bit 4 is active. If it is, request an LCD interrupt
            reqInterrupt = testBit(memory[enums.STAT], 4);
        }
    }
    else {
        if (scanlineCounter > 376) {
            if (scanlineCounter >= 456) {

            }
            else {
                mode = 2;
                memory[enums.STAT] = SET(memory[enums.STAT], 1, 0);
                memory[enums.STAT] = RES(memory[enums.STAT], 0, 0);
                reqInterrupt = testBit(memory[enums.STAT], 5);
            }
        }
        else if (scanlineCounter >= 204) {
            mode = 3;
            memory[enums.STAT] = SET(memory[enums.STAT], 1, 0);
            memory[enums.STAT] = SET(memory[enums.STAT], 0, 0);
        }
        else {
            mode = 0;
            memory[enums.STAT] = RES(memory[enums.STAT], 1, 0);
            memory[enums.STAT] = RES(memory[enums.STAT], 0, 0);
            reqInterrupt = testBit(memory[enums.STAT], 3);
        }


        //the mode interrupt in STAT is enabled and there was a transition of the mode selected. request an interrupt
        if (reqInterrupt && (mode != currentMode)) {
            requestInterrupt(1);
        }
    }
    if (memory[enums.LY] == memory[enums.LYC]) {
        if (scanlineCounter >= 456) {

        }
        else {
            SET(memory[enums.STAT], 2, 0);
            if (testBit(memory[enums.STAT], 6)) {
                requestInterrupt(1);
            }
        }
    }
    else {
        memory[enums.STAT] = RES(memory[enums.STAT], 2, 0);
    }
}

function updateTimers(cycles) {
    //updating divider register
    divCounter -= cycles;
    if (divCounter <= 0) {

        divCounter = (enums.CLOCKSPEED / enums.FREQUENCY_11) - divCounter;
        memory[enums.DIV]++;

        //RtcTimers increases in a rate of 32,768Hz, DIV increases in exactly half the time, so we can check if DIV increased 2 times after the last
        //increase of the RTC Timers and increase it. 
        if (MBC3Enabled) {
            increaseRtcTimers();
        }
    }

    //if bit 2 of register FF07 is 1, then the timer is enabled
    if (testBit(memory[enums.TMC], 2)) {
        //there's a delay on the timer interrupt of one cycle.
        if (timerInterruptDelay) {
            timerInterruptDelay = false;
            requestInterrupt(2);
            setClockFrequency();
            return;
        }
        timerCounter -= cycles;
        if (timerCounter <= 0) {
            let timerCounterUnderflow = timerCounter;
            updateTIMA();
            timerCounter -= timerCounterUnderflow;
        }
    }
}

function updateTIMA() {
    //setting clock frequency

    //updating timer
    if (memory[TIMA] == 255) {
        writeInMemory(TIMA, memory[TMA]);
        timerInterruptDelay = true;
        //requestInterrupt(2);
    }
    else {
        setClockFrequency();
        memory[TIMA]++;
    }
}

function setClockFrequency() {
    switch (memory[enums.TMC] & 0b00000011) {
        case 00:
            timerCounter = enums.CLOCKSPEED / enums.FREQUENCY_00;
            timerFrequencyChosen = enums.CLOCKSPEED / enums.FREQUENCY_00;
            break;
        case 01:
            timerCounter = enums.CLOCKSPEED / enums.FREQUENCY_01;
            timerFrequencyChosen = enums.CLOCKSPEED / enums.FREQUENCY_01;
            break;
        case 02:
            timerCounter = enums.CLOCKSPEED / enums.FREQUENCY_10;
            timerFrequencyChosen = enums.CLOCKSPEED / enums.FREQUENCY_10;
            break;
        case 03:
            timerCounter = enums.CLOCKSPEED / enums.FREQUENCY_11;
            timerFrequencyChosen = enums.CLOCKSPEED / enums.FREQUENCY_11;
            break;
    }
}

function writeInMemory(memoryLocation, data) {
    //this memory location is read only, we can write to specific memory locations to enable things of the MBC, but the values doesn't go through, 
    //it is intercepted and then interpreted by the MBC.
    if (memoryLocation < 0x8000) {
        if (memory[0x147] != 0) {
            if (memoryLocation <= 0x1FFF) {
                getRamEnable(data);
            }
            else if (memoryLocation <= 0x3FFF) {
                getRomBankNumber(data);
            }
            else if (memoryLocation <= 0x5FFF) {
                RomRamBankNumber(data);
            }
            else if (memoryLocation <= 0x7FFF) {
                RomRamModeSelect(data);
            }
        }
    }
    else if (memoryLocation >= 0xA000 && memoryLocation <= 0xBFFF) {
        if (isRamEnabled) {
            if (MBC1Enabled || MBC3Enabled) {
                /*if (ramBankNumber == 0 || !RomRamSELECT)
                {
                     cartridgeMemory[(memoryLocation - 0xA000)] = data;
                     memory[memoryLocation] = data;
                     return;
                }
                cartridgeMemory[(memoryLocation - 0xA000) + (ramBankNumber * 0x2000)] = data;*/
                if (maxRamBankNumber == 0) {
                    memory[memoryLocation] = data;
                    return;
                }
                else if (RomRamSELECT) {
                    ram[memoryLocation - 0xA000] = data;
                    return;
                }
                ram[(memoryLocation - 0xA000) + (ramBankNumber * 0x2000)] = data;

                //memory[memoryLocation] = data;
                //cartridgeMemory[(memoryLocation - 0xA000) + (ramBankNumber * 0xA000)] = data;
            }
            else if (MBC2Enabled) {
                let memoryData = (data & 0x0F);
                ram[(memoryLocation - 0xA000) + (ramBankNumber * 0x2000)] = data;
                //memory[memoryLocation] = memoryData;
            }
        }
    }
    else if ((memoryLocation >= 0xFEA0) && (memoryLocation <= 0xFEFF)) {
        //this memory location is not usable 
    }
    else if ((memoryLocation >= 0xE000) && (memoryLocation <= 0xFDFF)) {
        memory[memoryLocation] = data;
        memory[memoryLocation - 0x200] = data;
    }
    else if (memoryLocation == enums.DIV) {
        memory[enums.DIV] = 0;
        divCounter = (enums.CLOCKSPEED / enums.FREQUENCY_11);
        /*if (timerCounter <= timerFrequencyChosen/2)
        {
            updateTIMA();
        }
        else
        {
            setClockFrequency();
        }*/
    }
    else if (memoryLocation == enums.LY) {
        memory[memoryLocation] = 0;
    }
    else if (memoryLocation == enums.TMC) {
        let currentFrequency = memory[enums.TMC] & 0b00000111;
        memory[enums.TMC] = data;
        let newFrequency = memory[enums.TMC] & 0b00000111;
        if (!testBit(newFrequency, 2) && testBit(currentFrequency, 2)) {
            if (timerCounter <= timerFrequencyChosen / 2) {
                updateTIMA();
            }
            else {
                setClockFrequency();
            }
        }
        else if (((currentFrequency & 0x3) == 0x0) && ((newFrequency & 0x3) == 1) && testBit(newFrequency, 2)) {
            updateTIMA();
        }
        else if ((newFrequency & 0x3) != (currentFrequency & 0x3)) {
            setClockFrequency();
        }
    }
    //THIS BUGS OUT THE EMULATOR
    /*else if (memoryLocation == TIMA)
    {
        //IMPLEMENT 5.6. Timer Overflow Behaviour FROM ANTONIO DOCS
    }*/
    else if (memoryLocation == 0xFF68) {
        memory[memoryLocation]++;
    }
    else if (memoryLocation == 0xFF69) {
        //increment 0xFF68
        memory[0xFF68]++;
    }
    //bug on DMG models that triggers a STAT interrupt anytime the STAT register is written.
    else if (memoryLocation == enums.STAT) {
        memory[enums.STAT] = ((0b10000111 & memory[enums.STAT]) | (data & 0b01111000));
        requestInterrupt(1);
    }
    else if (memoryLocation == 0xFF46) {
        dmaTransfer(data);
    }
    else if (memoryLocation == 0xFF00) {
        if ((data & 0x30) != 0x30) {
            memory[0xFF00] |= 0xF;
        }
        memory[0xFF00] = ((data & 0b00110000) | (memory[0xFF00] & 0b11001111));
    }
    else if (memoryLocation == 0xFF0F) {
        memory[memoryLocation] = ((data & 0b00011111) | (0b11100000));
    }
    else if (memoryLocation == 0xFF47) {
        memory[memoryLocation] = data;
        assignPalleteHex(0, memoryLocation);
    }
    else if (memoryLocation == 0xFF48) {
        memory[memoryLocation] = data;
        assignPalleteHex(1, memoryLocation);
    }
    else if (memoryLocation == 0xFF49) {
        memory[memoryLocation] = data;
        assignPalleteHex(2, memoryLocation);
    }
    else {
        memory[memoryLocation] = data;
    }
}

function assignPalleteHex(whichPallete, memoryLocation) {
    for (i = 0; i < 4; i++) {
        if (((memory[memoryLocation] >> (2 * i)) & 0x03) == 0) {
            const offset = whichPallete * 4;
            colorPalletes[offset] = 0xE0;
            colorPalletes[offset + 1] = 0xF8;
            colorPalletes[offset + 2] = 0xD0;
            colorPalletes[offset + 3] = 0xFF;
        }
        else if (((memory[memoryLocation] >> (2 * i)) & 0x03) == 0x1) {
            const offset = whichPallete * 4;
            colorPalletes[offset] = 0x88;
            colorPalletes[offset + 1] = 0xC0;
            colorPalletes[offset + 2] = 0x07;
            colorPalletes[offset + 3] = 0xFF;
        }
        else if (((memory[memoryLocation] >> (2 * i)) & 0x03) == 0x2) {
            const offset = whichPallete * 4;
            colorPalletes[offset] = 0x34;
            colorPalletes[offset + 1] = 0x68;
            colorPalletes[offset + 2] = 0x56;
            colorPalletes[offset + 3] = 0xFF;
        }
        else if (((memory[memoryLocation] >> (2 * i)) & 0x03) == 0x3) {
            const offset = whichPallete * 4;
            colorPalletes[offset] = 0x08;
            colorPalletes[offset + 1] = 0x18;
            colorPalletes[offset + 2] = 0x20;
            colorPalletes[offset + 3] = 0xFF;
        }
    }
}

function readMemory(memoryLocation) {
    if (memoryLocation >= 0xA000 && memoryLocation <= 0xBFFF) {
        if (isRamEnabled) {
            if (MBC1Enabled) {
                if (maxRamBankNumber == 0) {
                    return memory[memoryLocation];
                }
                else if (RomRamSELECT) {
                    return ram[memoryLocation - 0xA000];
                }
                return ram[(memoryLocation - 0xA000) + (ramBankNumber * 0x2000)];
                /*if (ramBankNumber == 0 || !RomRamSELECT)
                {
                    return cartridgeMemory[memoryLocation];
                }
                return cartridgeMemory[(memoryLocation - 0xA000) + (ramBankNumber * 0x2000)];*/
            }
            else if (MBC2Enabled) {
                let data = (ram[(memoryLocation - 0xA000) + (ramBankNumber * 0x2000)] & 0x0F);
                //(memory[(memoryLocation - 0xA000) + (ramBankNumber * 0xA000)] & 0x0F);
                data |= 0xF0;
                return data;
            }
            else if (MBC3Enabled) {
                if (maxRamBankNumber == 0) {
                    return memory[memoryLocation];
                }

                if (ramBankNumber <= 0x7) {
                    return ram[(memoryLocation - 0xA000) + (ramBankNumber * 0x2000)];
                }
                else {
                    if (ramBankNumber == 0x8) {
                        return RTC_Seconds;
                    }
                    if (ramBankNumber == 0x9) {
                        return RTC_Minutes;
                    }
                    if (ramBankNumber == 0xA) {
                        return RTC_Hours;
                    }
                    if (ramBankNumber == 0xB) {
                        return RTC_LowDay;
                    }
                    if (ramBankNumber == 0xC) {
                        return (RTC_HighDay & 0x1);
                    }
                }
            }
        }
        else {
            return 0xFF;
        }
    }
    if (memoryLocation >= 0x4000 && memoryLocation <= 0x7FFF) {
        if (maxRomBankNumber >= 0x01) {
            return cartridgeMemory[(memoryLocation - 0x4000) + (romBankNumber * 0x4000)];
        }

        return memory[memoryLocation];
    }
    if (memoryLocation == 0xFF00) {
        //joypad();
        return memory[memoryLocation];
    }
    if (memoryLocation == 0xFF70 || memoryLocation == 0xFF4F || memoryLocation == 0xFF4D) {
        return 0xFF;
    }
    if (memoryLocation == enums.TMC) {
        let data = 0b11111000;
        data |= memory[enums.TMC];
        return data;
    }
    if (memoryLocation == 0xFF0F) {
        let data = 0b11100000;
        data |= memory[0xFF0F];
        return data;
    }
    if (memoryLocation == enums.STAT) {
        let data = memory[enums.STAT];
        if (!testBit(memory[enums.LCDC], 7)) {
            data &= 0b11111000;
        }
        return data;
    }
    if ((memoryLocation >= 0x8000 && memoryLocation <= 0x9FFF)) {
        if ((memory[enums.STAT] & 0x3) == 3) {
            return 0xFF;
        }
        else {
            return memory[memoryLocation];
        }
    }
    if ((memoryLocation >= 0xFE00 && memoryLocation <= 0xFE9F)) {
        if ((memory[enums.STAT] & 0x3) == 2 || (memory[enums.STAT] & 0x3) == 3) {
            return 0xFF;
        }
        else {
            return memory[memoryLocation];
        }
    }

    return memory[memoryLocation];

}

function testBit(data, bit) {
    let testChar = (data & (0b00000001 << bit));
    if (testChar !== 0) {
        return true;
    }
    return false;
}

function dmaTransfer(data) {
    //multiplying by 100
    let dataAdress = data << 8;
    clockTiming(4);
    for (x = 0; x < 0xA0; x++) {
        //every byte copied updates the timing by 4
        clockTiming(4);
        writeInMemory(0xFE00 + x, memory[dataAdress + x]);
        //interrupts can still happen in dmaTransfer
        doInterrupts();
    }
}

function doHalt() {
    //halt has 2 possible interactions with the IME, if it is true then HALT is executed normally, cpu will stop executing instructions until an
    //interrupt is enabled and requested. When that happens the adress next to the HALT instruction is pushed onto the stack and the CPU will jump
    //to the interrupt adress. The IF flag of the interrupt is reset.

    if (masterInterrupt) {
        //it needs to be set true because we will check for it in the interrupt function and if it is true it will take 4 more cycles to complete.
        halt = true;
        if ((memory[IE] & memory[IF] & 0x1F) == 0) {
            while ((memory[IE] & memory[IF] & 0x1F) == 0) {
                if (scanlineCounter >= 114 && divCounter >= 114) {
                    clockTiming(114);
                }
                else if (scanlineCounter >= 32 && divCounter >= 32) {
                    clockTiming(40);
                }
                else {
                    clockTiming(4);
                }
                //increasing clock cycle by 4 until an interrupt is made;
            }
        }
        else {
            clockTiming(4);
        }
    }
    //if IME is false, it tests for 2 possible interactions. 
    //(IE & IF & 0x1F) = 0, it waits for an interrupt but doesnt jump or resets the flag, it just continues to the next instruction.
    //(IE & IF & 0x1F) != 0 HALT bug, the cpu fails to increase pc when executing the next instruction so it will execute twice. IF flags aren't cleared
    else {
        if ((memory[IE] & memory[IF] & 0x1F) == 0) {
            halt = true;
            while ((memory[IE] & memory[IF] & 0x1F) == 0) {
                //increasing clock cycle by 4 until an interrupt is made;
                if (scanlineCounter >= 114 && divCounter >= 114) {
                    clockTiming(114);
                }
                else if (scanlineCounter >= 20 && divCounter >= 20) {
                    clockTiming(20);
                }
                else {
                    clockTiming(4);
                }
            }
            //it takes 4 clock cycles to exit HALT mode after an interrupt is made.
            clockTiming(4);
        }
        else {
            //gets the instrunction after the HALT.
            pc[0]++;
            //executes the instruction and increases pc by 1
            emulateCycle();
            //decreases by 2 because when HALT instrunction executes it will increment pc by 1.
            pc[0] -= 2;
        }
    }
    halt = false;
}

function getMBC() {
    if (memory[0x147] <= 0x3 && memory[0x147] != 0) {
        MBC1Enabled = true;
    }
    else if (memory[0x147] == 0x5 || memory[0x147] == 0x6) {
        MBC2Enabled = true;
    }
    else if (memory[0x147] >= 0xF && memory[0x147] <= 0x13) {
        MBC3Enabled = true;
    }

    return;
}

function getMaxRomBankNumber() {
    switch (memory[0x148]) {
        case 0x00:
            maxRomBankNumber = 0;
            break;
        case 0x01:
            maxRomBankNumber = 4;
            break;
        case 0x02:
            maxRomBankNumber = 8;
            break;
        case 0x03:
            maxRomBankNumber = 16;
            break;
        case 0x04:
            maxRomBankNumber = 32;
            break;
        case 0x05:
            maxRomBankNumber = 64;
            break;
        case 0x06:
            maxRomBankNumber = 128;
            break;
        case 0x07:
            maxRomBankNumber = 256;
            break;
        case 0x08:
            maxRomBankNumber = 512;
            break;
        case 0x52:
            maxRomBankNumber = 72;
            break;
        case 0x53:
            maxRomBankNumber = 80;
            break;
        case 0x54:
            maxRomBankNumber = 96;
            break;
        default:
            break;
    }
}

function getMaxRamBankNumber() {
    switch (memory[0x0149]) {
        case 00:
            maxRamBankNumber = 0;
            break;
        case 02:
            maxRamBankNumber = 1;
            break;
        case 03:
            maxRamBankNumber = 4;
            break;
        case 04:
            maxRamBankNumber = 16;
            break;
        case 05:
            maxRamBankNumber = 8;
            break;
    }
}

function getRamEnable(data) {
    if (MBC2Enabled) {
        if (testBit(data, 4)) {
            return;
        }
    }
    if ((data & 0x0F) == 0x0A) {
        isRamEnabled = true;
    }
    else {
        isRamEnabled = false;
    }
}

function getRomBankNumber(data) {
    //storing bits 6 and 7 of romBankNumber

    if (MBC2Enabled) {
        if (!testBit(data, 4)) {
            return;
        }
    }
    let oldBankNumber = romBankNumber;
    if (MBC3Enabled) {
        romBankNumber = (data & 0x7F);
        if (MBC3Enabled && romBankNumber == 0) {
            romBankNumber = 0x01;
        }
    }
    else {
        romBankNumber = (data & 0x1F);

        if ((romBankNumber & 0x1F) === 0) {
            romBankNumber |= 0x01;
        }
        if (romBankNumber > maxRomBankNumber) {
            romBankNumber = (romBankNumber % maxRomBankNumber);
        }
    }
    if (oldBankNumber !== romBankNumber) {
        memoryCopy(false, true, (0x4000 * romBankNumber), (0x4000 * oldBankNumber));
    }
}

function RomRamBankNumber(data) {
    if (MBC2Enabled) {
        return;
    }
    //select the ram bank and resets bit 5 and 6 of romBankNumber
    if (MBC1Enabled) {
        if (RomRamSELECT) {
            ramBankNumber = (data & 0x03);
        }
        else {

            let upperBits = ((data & 0x03) << 5);
            romBankNumber &= 0x1F;
            romBankNumber |= (upperBits);
            let currentRom = romBankNumber;
            if (maxRomBankNumber == 0) {
                romBankNumber = 0x01;
            }
            else if (romBankNumber > maxRomBankNumber) {
                romBankNumber = (romBankNumber % maxRomBankNumber);
            }
            /*if (currentRom == 0x0 || currentRom == 0x20 || currentRom == 0x40 || currentRom == 0x60)
            {
                romBankNumber |= 0x01;
            }*/
        }
    }
    else if (MBC3Enabled) {
        if (data <= 0x3) {
            ramBankNumber = (data & 0x03);
        }
        else if (data >= 0x8 && data <= 0x0C) {
            ramBankNumber = (data & 0x0F);
        }
    }
}

function RomRamModeSelect(data){
    if (MBC1Enabled) {
        if (testBit(data, 0)) {
            RomRamSELECT = true;
            romBankNumber &= 0x1F;
            if (romBankNumber == 0) {
                romBankNumber = 0x01;
            }
        }
        else {
            //romBankNumber &= (ramBankNumber << 5);
            RomRamSELECT = false;
            ramBankNumber = 0;
        }
    }
    else if (MBC3Enabled) {
        if (testBit(data, 0)) {
            if (latchClockRegister) {
                latchClockRegister = false;
            }
        }
        else {
            if (!latchClockRegister) {
                updateRtcRegisters();
            }
        }
    }
}

function memoryCopy(copyRam,copyRom, newOffset, oldOffset) {
    let tempValue = 0;
    if (copyRom) {
        for (i = 0; i <= 0x3FFF; i++)
        {
            //tempValue = memory[0x4000 + i];
            memory[0x4000 + i] = cartridgeMemory[newOffset + i];
            // cartridgeMemory[oldOffset + i] = tempValue;
        }
    }
    else if (copyRam) {
        for (i = 0; i <= 0x1FFF; i++)
        {
            //tempValue = memory[0xA000 + i];
            memory[0xA000 + i] = cartridgeMemory[oldOffset + i];
            //cartridgeMemory[oldOffset + i] = tempValue;
        }
    }
}

function increaseRtcTimers() {
    if (testBit(RTC_HighDay, 6)) {
        return;
    }
    else {
        if (RTC_Increase) {
            RTC_Seconds++;
            if (RTC_Seconds === 60) {
                RTC_Seconds = 0;
                RTC_Minutes++;
                if (RTC_Minutes === 60) {
                    RTC_Minutes = 0;
                    RTC_Hours++;
                    if (RTC_Hours === 24) {
                        RTC_Hours = 0;
                        RTC_LowDay++;
                        if (RTC_LowDay === 255) {
                            RTC_LowDay = 0;
                            if (testBit(RTC_HighDay, 0)) {
                                RTC_HighDay = RES(RTC_HighDay, 0, 0);
                                RTC_HighDay = SET(RTC_HighDay, 7, 0);
                            }
                            else {
                                RTC_HighDay = SET(RTC_HighDay, 0, 0);
                            }
                        }
                    }
                }
            }
            RTC_Increase = false;
        }
        else {
            RTC_Increase = true;
        }
    }

}

function updateRtcRegisters(){

}

function copyMemoryToRam() {
    for (i = 0; i < 0x2000; i++)
    {
        ram[i] = cartridgeMemory[0xA000 + i];
    }
}







