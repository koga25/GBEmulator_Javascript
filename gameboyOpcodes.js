function addRegister(registerA, registerB, cycles) { };
function adcRegister(registerA, registerB, cycles) { };
function subRegister(registerA, registerB, cycles) { };
function sbcRegister(registerA, registerB, cycles) { };
function andOperation(registerB, cycles) { };
function orOperation(registerB, cycles) { };
function xorOperation(registerB, cycles) { };
function cpRegister(registerB, cycles) { };
function incRegister(registerA, cycles) { };
function incRegisterToMemory(memoryLocation, cycles) { };
function decRegister(registerA, cycles) { };
function decRegisterToMemory(memoryLocation, cycles) { };
function addRegister16Bit(registerA, registerB, cycles) { };
function swap(registerA, cycles) { };
function swapToMemory(memoryLocation, cycles) { };
function rlcRegister(registerA, cycles) { };
function rlcRegisterToMemory(memoryLocation, cycles) { };
function RLCA(cycles) { };
function rlRegister(registerA, cycles) { };
function rlRegisterToMemory(memoryLocation, cycles) { };
function RLA(cycles) { };
function rrcRegister(registerA, cycles) { };
function rrcRegisterToMemory(memoryLocation, cycles) { };
function RRCA(cycles) { };
function rrRegister(registerA, cycles) { };
function rrRegisterToMemory(memoryLocation, cycles) { };
function RRA(cycles) { };
function SLA(registerA, cycles) { };
function SLAToMemory(memoryLocation, cycles) { };
function SRA(registerA, cycles) { };
function SRAToMemory(memoryLocation, cycles) { };
function SRL(registerA, cycles) { };
function SRLToMemory(memoryLocation, cycles) { };
function BIT(registerA, bit, cycles) { };
function SET(registerA, bit, cycles) { };
function SETToMemory(memoryLocation, bit, cycles) { };
function RES(registerA, bit, cycles) { };
function RESToMemory(memoryLocation, bit, cycles) { };
function NZCondition() { };
function ZCondition() { };
function NCCondition() { };
function CCondition() { };
function JP(condition, cycles) { };
function JR(condition, cycles) { };
function CALL(condition, cycles) { };
function RET(condition, cycles) { };
function RETI(cycles) { };
function PUSH(highByte, lowByte) { };
function PUSHAF() { };
function POP(highByte, lowByte) { };
function POPAF() { };

function emulateCycle() {
    opcode[0] = memory[pc[0]];
    //console.log(pc[0], opcode[0]);
    //console.log(opcode[0]);
    switch (opcode & 0xFF) {
        case 0x10:
            //implement stop
            pc[0]++;
            break;
        case 0x00:
            clockTiming(4);
            break;
        case 0x06:
            pc[0]++;
            //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
            clockTiming(4);
            BC[0] = readMemory(pc[0]);
            clockTiming(4);
            break;
        case 0x0E:
            pc[0]++;
            //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
            clockTiming(4);
            BC[1] = readMemory(pc[0]);
            clockTiming(4);
            break;
        case 0x16:
            pc[0]++;
            //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
            clockTiming(4);
            DE[0] = readMemory(pc[0]);
            clockTiming(4);
            break;
        case 0x1E:
            pc[0]++;
            DE[1] = readMemory(pc[0]);
            clockTiming(8);
            break;
        case 0x26:
            pc[0]++;
            //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
            clockTiming(4);
            HL[0] = readMemory(pc[0]);
            clockTiming(4);
            break;
        case 0x2E:
            pc[0]++;
            //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
            clockTiming(4);
            HL[1] = readMemory(pc[0]);
            clockTiming(4);
            break;
        case 0x7F:
            AF[0] = AF[0];
            clockTiming(4);
            break;
        case 0x78:
            AF[0] = BC[0];
            clockTiming(4);
            break;
        case 0x79:
            AF[0] = BC[1];
            clockTiming(4);
            break;
        case 0x7A:
            AF[0] = DE[0];
            clockTiming(4);
            break;
        case 0x7B:
            AF[0] = DE[1];
            clockTiming(4);
            break;
        case 0x7C:
            AF[0] = HL[0];
            clockTiming(4);
            break;
        case 0x7D:
            AF[0] = HL[1];
            clockTiming(4);
            break;
        case 0x7E:
            {
                //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
                clockTiming(4);
                let memoryLocation = HL[0] << 8 | HL[0];
                AF[0] = readMemory(memoryLocation);
                clockTiming(4);
                break;
            }
        case 0x40:
            BC[0] = BC[0];
            clockTiming(4);
            break;
        case 0x41:
            BC[0] = BC[0];
            clockTiming(4);
            break;
        case 0x42:
            BC[0] = DE[0];
            clockTiming(4);
            break;
        case 0x43:
            BC[0] = DE[1];
            clockTiming(4);
            break;
        case 0x44:
            BC[0] = HL[0];
            clockTiming(4);
            break;
        case 0x45:
            BC[0] = HL[1];
            clockTiming(4);
            break;
        case 0x46:
            {
                //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
                clockTiming(4);
                let memoryLocation = HL[0] << 8 | HL[0];
                BC[0] = readMemory(memoryLocation);
                clockTiming(4);
                break;
            }
        case 0x48:
            BC[1] = BC[0];
            clockTiming(4);
            break;
        case 0x49:
            BC[1] = BC[1];
            clockTiming(4);
            break;
        case 0x4A:
            BC[1] = DE[0];
            clockTiming(4);
            break;
        case 0x4B:
            BC[1] = DE[1];
            clockTiming(4);
            break;
        case 0x4C:
            BC[1] = HL[0];
            clockTiming(4);
            break;
        case 0x4D:
            BC[0] = HL[1];
            clockTiming(4);
            break;
        case 0x4E:
            {
                //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
                clockTiming(4);
                let memoryLocation = HL[0] << 8 | HL[0];
                BC[0] = readMemory(memoryLocation);
                clockTiming(4);
                break;
            }
            
        case 0x50:
            DE[0] = BC[0];
            clockTiming(4);
            break;
        case 0x51:
            DE[0] = BC[1];
            clockTiming(4);
            break;
        case 0x52:
            DE[0] = DE[0];
            clockTiming(4);
            break;
        case 0x53:
            DE[0] = DE[1];
            clockTiming(4);
            break;
        case 0x54:
            DE[0] = HL[0];
            clockTiming(4);
            break;
        case 0x55:
            DE[0] = HL[1];
            clockTiming(4);
            break;
        case 0x56:
            {
                //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
                clockTiming(4);
                let memoryLocation = HL[0] << 8 | HL[0];
                DE[0] = readMemory(memoryLocation);
                clockTiming(4);
                break;
            }
        case 0x58:
            DE[1] = BC[0];
            clockTiming(4);
            break;
        case 0x59:
            DE[1] = BC[1];
            clockTiming(4);
            break;
        case 0x5A:
            DE[1] = DE[0];
            clockTiming(4);
            break;
        case 0x5B:
            DE[1] = DE[1];
            clockTiming(4);
            break;
        case 0x5C:
            DE[1] = HL[0];
            clockTiming(4);
            break;
        case 0x5D:
            DE[1] = HL[1];
            clockTiming(4);
            break;
        case 0x5E:
            {
                //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
                clockTiming(4);
                let memoryLocation = HL[0] << 8 | HL[0];
                DE[1] = readMemory(memoryLocation);
                clockTiming(4);
                break;
            }
        case 0x60:
            HL[0] = BC[0];
            clockTiming(4);
            break;
        case 0x61:
            HL[0] = BC[1];
            clockTiming(4);
            break;
        case 0x62:
            HL[0] = DE[0];
            clockTiming(4);
            break;
        case 0x63:
            HL[0] = DE[1];
            clockTiming(4);
            break;
        case 0x64:
            HL[0] = HL[0];
            clockTiming(4);
            break;
        case 0x65:
            HL[0] = HL[1];
            clockTiming(4);
            break;
        case 0x66:
            {
                //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
                clockTiming(4);
                let memoryLocation = HL[0] << 8 | HL[0];
                HL[0] = readMemory(memoryLocation);
                clockTiming(4);
                break;
            }
        case 0x68:
            HL[1] = BC[0];
            clockTiming(4);
            break;
        case 0x69:
            HL[1] = BC[1];
            clockTiming(4);
            break;
        case 0x6A:
            HL[1] = DE[0];
            clockTiming(4);
            break;
        case 0x6B:
            HL[1] = DE[1];
            clockTiming(4);
            break;
        case 0x6C:
            HL[1] = HL[0];
            clockTiming(4);
            break;
        case 0x6D:
            HL[1] = HL[1];
            clockTiming(4);
        case 0x6E:
            {
                //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
                clockTiming(4);
                let memoryLocation = HL[0] << 8 | HL[0];
                HL[1] = readMemory(memoryLocation);
                clockTiming(4);
                break;
            }
        case 0x70:
            {
                let memoryLocation = HL[0] << 8 | HL[0];
                writeInMemory(memoryLocation, BC[0]);
                clockTiming(8);
                break;
            }
        case 0x71:
            {
                let memoryLocation = HL[0] << 8 | HL[0];
                writeInMemory(memoryLocation, BC[1]);
                clockTiming(8);
                break;
            }
        case 0x72:
            {
                let memoryLocation = HL[0] << 8 | HL[0];
                writeInMemory(memoryLocation, DE[0]);
                clockTiming(8);
                break;
            }
        case 0x73:
            {
                let memoryLocation = HL[0] << 8 | HL[0];
                writeInMemory(memoryLocation, DE[1]);
                clockTiming(8);
                break;
            }
        case 0x74:
            {
                let memoryLocation = HL[0] << 8 | HL[0];
                writeInMemory(memoryLocation, HL[0]);
                clockTiming(8);
                break;
            }
        case 0x75:
            {
                let memoryLocation = HL[0] << 8 | HL[0];
                writeInMemory(memoryLocation, HL[1]);
                clockTiming(8);
                break;
            }
        case 0x36:
            {
                pc[0]++;
                //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
                clockTiming(4);
                let memoryLocation = HL[0] << 8 | HL[0];
                writeInMemory(memoryLocation, readMemory(pc[0]));
                clockTiming(8);
                break;
            }
        case 0x0A:
            {
                //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
                clockTiming(4);
                let memoryLocation = BC[0] << 8 | BC[1];
                AF[0] = readMemory(memoryLocation);
                clockTiming(4);
                break;
            }
        case 0x1A:
            {
                //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
                clockTiming(4);
                let memoryLocation = DE[0] << 8 | DE[1];
                AF[0] = readMemory(memoryLocation);
                clockTiming(4);
                break;
            }
        case 0xFA:
            {
                pc[0]++;
                //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
                clockTiming(4);
                let LowerNibble = new Uint8Array([readMemory(pc[0])]);
                pc[0]++;
                clockTiming(4);
                let HighNibble = new Uint8Array([readMemory(pc[0])]);
                let memoryLocation = new Uint16Array([(HighNibble[0] << 8)]);
                memoryLocation[0] |= LowerNibble[0];
                AF[0] = readMemory(memoryLocation[0]);;
                clockTiming(8);
                break;
            }
        case 0x3E:
            pc[0]++;
            //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
            clockTiming(4);
            AF[0] = readMemory(pc[0]);
            clockTiming(4);
            break;
        case 0x47:
            BC[0] = AF[0];
            clockTiming(4);
            break;
        case 0x4F:
            BC[1] = AF[0];
            clockTiming(4);
            break;
        case 0x57:
            DE[0] = AF[0];
            clockTiming(4);
            break;
        case 0x5F:
            DE[1] = AF[0];
            clockTiming(4);
            break;
        case 0x67:
            HL[0] = AF[0];
            clockTiming(4);
            break;
        case 0x6F:
            HL[1] = AF[0];
            clockTiming(4);
            break;
        case 0x02:
            {
                let memoryLocation = BC[0] << 8 | BC[1];
                writeInMemory(memoryLocation, AF[0]);
                clockTiming(8);
                break;
            }
        case 0x12:
            {
                let memoryLocation = DE[0] << 8 | DE[1];
                writeInMemory(memoryLocation, AF[0]);
                clockTiming(8);
            }
            break;
        case 0x77:
            {
                let memoryLocation = AF[0] << 8 | AF[1];
                writeInMemory(memoryLocation, AF[0]);
                clockTiming(8);
                break;
            }
            
        case 0xEA:
            {
                pc[0]++;
                //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
                clockTiming(4);
                let LowerNibble = new Uint8Array([readMemory(pc[0])]);
                pc[0]++;
                clockTiming(4);
                let HighNibble = new Uint8Array([readMemory(pc[0])]);
                let memoryLocation = new Uint16Array([(HighNibble[0] << 8)]);
                memoryLocation[0] |= LowerNibble[0];
                writeInMemory(memoryLocation[0], AF[0]);
                clockTiming(8);
                break;
            }
        case 0xF2:
            {
                let memoryLocation = new Uint16Array([0xFF00 + BC[1]]);
                //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
                clockTiming(4);
                AF[0] = readMemory(memoryLocation[0]);
                clockTiming(4);
                break;
            }
        case 0xE2:
            {
                let memoryLocation = new Uint16Array([0xFF00 + BC[0]]);
                writeInMemory(memoryLocation[0], AF[0]);
                clockTiming(8);
                break;
            }
        case 0x3A:
            {
                //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
                clockTiming(4);
                let memoryLocation = HL[0] << 8 | HL[1];
                AF[0] = readMemory(memoryLocation);
                HL[1]--;
                if (HL[1] === 0xFF) {
                    HL[0]--;
                }
                //HL.HL--;
                clockTiming(4);
                break;
            }
        case 0x32:
            {
                let memoryLocation = HL[0] << 8 | HL[1];
                writeInMemory(memoryLocation, AF[0]);
                HL[1]--;
                if (HL[1] === 0xFF) {
                    HL[0]--;
                }
                //HL.HL--;
                clockTiming(8);
                break;
            }
        case 0x2A:
            {
                //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
                clockTiming(4);
                let memoryLocation = HL[0] << 8 | HL[1];
                AF[0] = readMemory(memoryLocation);
                HL[1]++;
                if (HL[1] === 0) {
                    HL[0]++;
                }
                clockTiming(4);
                break;
            }
            
        case 0x22:
            {
                let memoryLocation = HL[0] << 8 | HL[1];
                writeInMemory(memoryLocation, AF[0]);
                HL[1]++;
                if (HL[1] === 0) {
                    HL[0]++;
                }
                clockTiming(8);
                break;
            }
        case 0xE0:
            {
                pc[0]++;
                //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
                clockTiming(4);
                let memoryLocation = new Uint16Array([0xFF00 + readMemory(pc[0])]);
                writeInMemory(memoryLocation[0], AF[0]);
                clockTiming(8);
                break;
            }
        case 0xF0:
            {
                pc[0]++;
                let memoryLocation = new Uint16Array([0xFF00 + memory[pc[0]]]);
                //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
                clockTiming(4);
                AF[0] = readMemory(memoryLocation[0]);
                clockTiming(8);
                break;
            }
        case 0x01:
            pc[0]++;
            //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
            clockTiming(4);
            BC[1] = readMemory(pc[0]);
            pc[0]++;
            clockTiming(4);
            BC[0] = readMemory(pc[0]);
            clockTiming(4);
            break;
        case 0x11:
            pc[0]++;
            //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
            clockTiming(4);
            DE[1] = readMemory(pc[0]);
            pc[0]++;
            clockTiming(4);
            DE[0] = readMemory(pc[0]);
            clockTiming(4);
            break;
        case 0x21:
            pc[0]++;
            //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
            clockTiming(4);
            HL[1] = readMemory(pc[0]);
            pc[0]++;
            clockTiming(4);
            HL[0] = readMemory(pc[0]);
            clockTiming(4);
            break;
        case 0x31:
            {
                pc[0]++;
                //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
                clockTiming(4);
                let LowerNibble = new Uint8Array([readMemory(pc[0])]);
                pc[0]++;
                clockTiming(4);
                let HighNibble = new Uint8Array([readMemory(pc[0])]);
                let memoryLocation = new Uint16Array([(HighNibble[0] << 8)]);
                memoryLocation[0] |= LowerNibble[0];
                sp[0] = memoryLocation[0];
                clockTiming(4);
                break;
            }
        case 0xF9:
            sp[0] = HL[1];
            sp[0] |= (HL[0] << 8);
            clockTiming(8);
            break;
        case 0xF8:
            {
                //reseting flags
                AF[1] = 0;
                //getting immediate signed data in the form of signed char
                pc[0]++;
                //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
                clockTiming(4);
                let e8value = new Int8Array([readMemory(pc[0])]);
                //the test for the CFLAG needs to use 8 total bits, in the signed form the seventh bit is thrown out as a sign value so if you have a signed
                //value of 0xFF it will be -127 instead of 255.
                let unsigned_e8value = new Uint8Array([e8value[0]]);
                //getting the value of 3...0 bits in SP;
                let HFlagCheck = sp[0] & 0xF;
                //getting the value of 7...0 bits in SP;
                let CFlagCheck = sp[0] & 0xFF;
                //checking if theres overflow from bit 3 (H flag)
                if ((HFlagCheck + (e8value[0] & 0xF)) > 0xF) {
                    AF[1] |= 0b00100000;
                }
                // checking if theres overflow from bit 7
                if ((CFlagCheck + unsigned_e8value[0]) > 0xFF) {
                    AF[1] |= 0b00010000;
                }
                let result = new Uint16Array([sp[0] + e8value[0]]);
                HL[1] = (result[0] & 0x0F);
                HL[0] = ((result[0] & 0xF0) >> 8);
                clockTiming(8);
                break;
            }
        case 0x08:
            {
                pc[0]++;
                //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
                clockTiming(4);
                let LowerNibble = new Uint8Array([readMemory(pc[0])]);
                pc[0]++;
                clockTiming(4);
                let HighNibble = new Uint8Array([readMemory(pc[0])]);
                let memoryLocation = new Uint16Array([(HighNibble[0] << 8)]);
                memoryLocation[0] |= LowerNibble[0];
                writeInMemory(memoryLocation[0], sp[0] & 0xFF);
                writeInMemory(memoryLocation[0] + 1, (sp[0] >> 8));
                clockTiming(12);
                break;
            }
        case 0xF5:
            PUSHAF();
            break;
        case 0xC5:
            PUSH(BC[0], BC[1]);
            break;
        case 0xD5:
            PUSH(DE[0], DE[1]);
            break;
        case 0xE5:
            PUSH(HL[0], HL[1]);
            break;
        case 0xF1:
            POPAF();
            break;
        case 0xC1:
            {
                let popResult = POP(BC[0], BC[1]);
                BC[0] = (popResult >> 8) & 0xFF;
                BC[1] = popResult & 0xFF;
                break;
            }
        case 0xD1:
            {
                let popResult = POP(DE[0], DE[1]);
                DE[0] = (popResult >> 8) & 0xFF;
                DE[1] = popResult & 0xFF;
                break;
            }
        case 0xE1:
            {
                let popResult = POP(HL[0], HL[1]);
                HL[0] = (popResult >> 8) & 0xFF;
                HL[1] = popResult & 0xFF;
                break;
            }
        case 0x87:
            AF[0] = addRegister(AF[0], AF[0], 4);
            break;
        case 0x80:
            AF[0] = addRegister(AF[0], BC[0], 4);
            break;
        case 0x81:
            AF[0] = addRegister(AF[0], BC[1], 4);
            break;
        case 0x82:
            AF[0] = addRegister(AF[0], DE[0], 4);
            break;
        case 0x83:
            AF[0] = addRegister(AF[0], DE[1], 4);
            break;
        case 0x84:
            AF[0] = addRegister(AF[0], HL[0], 4);
            break;
        case 0x85:
            AF[0] = addRegister(AF[0], HL[1], 4);
            break;
        case 0x86:
            {
                //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
                clockTiming(4);
                let memoryLocation = HL[0] >> 8 | HL[1];
                let readValue = new Uint8Array([readMemory(memoryLocation)]);
                AF[0] = addRegister(AF[0], readValue[0], 4);
                break;
            }
        case 0xC6:
            {
                pc[0]++;
                //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
                clockTiming(4);
                let readValue = new Uint8Array([readMemory(pc[0])]);
                AF[0] = addRegister(AF[0], readValue[0], 4);
                break;
            }
        case 0x8F:
            AF[0] = adcRegister(AF[0], AF[0], 4);
            break;
        case 0x88:
            AF[0] = adcRegister(AF[0], BC[0], 4);
            break;
        case 0x89:
            AF[0] = adcRegister(AF[0], BC[1], 4);
            break;
        case 0x8A:
            AF[0] = adcRegister(AF[0], DE[0], 4);
            break;
        case 0x8B:
            AF[0] = adcRegister(AF[0], DE[1], 4);
            break;
        case 0x8C:
            AF[0] = adcRegister(AF[0], HL[0], 4);
            break;
        case 0x8D:
            AF[0] = adcRegister(AF[0], HL[1], 4);
            break;
        case 0x8E:
            {
                //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
                clockTiming(4);
                let memoryLocation = HL[0] << 8 | HL[1]
                let readValue = new Uint8Array([readMemory(memoryLocation)]);
                AF[0] = adcRegister(AF[0], readValue[0], 4);
                break;
            }
        case 0xCE:
            {
                pc[0]++;
                //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
                clockTiming(4);
                let readValue = new Uint8Array([readMemory(pc[0])]);
                AF[0] = adcRegister(AF[0], readValue[0], 4);
                break;
            }
        case 0x97:
            AF[0] = subRegister(AF[0], AF[0], 4);
            break;
        case 0x90:
            AF[0] = subRegister(AF[0], BC[0], 4);
            break;
        case 0x91:
            AF[0] = subRegister(AF[0], BC[1], 4);
            break;
        case 0x92:
            AF[0] = subRegister(AF[0], DE[0], 4);
            break;
        case 0x93:
            AF[0] = subRegister(AF[0], DE[1], 4);
            break;
        case 0x94:
            AF[0] = subRegister(AF[0], HL[0], 4);
            break;
        case 0x95:
            AF[0] = subRegister(AF[0], HL[1], 4);
            break;
        case 0x96:
            {
                //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
                clockTiming(4);
                let memoryLocation = HL[0] << 8 | HL[1];
                let readValue = new Uint8Array([readMemory(memoryLocation)]);
                AF[0] = subRegister(AF[0], readValue[0], 4);
                break;
            }
        case 0xD6:
            {
                pc[0]++;
                //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
                clockTiming(4);
                let readValue = new Uint8Array([readMemory(pc[0])]);
                AF[0] = subRegister(AF[0], readValue[0], 4);
                break;
            }
        case 0x9F:
            AF[0] = sbcRegister(AF[0], AF[0], 4);
            break;
        case 0x98:
            AF[0] = sbcRegister(AF[0], BC[0], 4);
            break;
        case 0x99:
            AF[0] = sbcRegister(AF[0], BC[1], 4);
            break;
        case 0x9A:
            AF[0] = sbcRegister(AF[0], DE[0], 4);
            break;
        case 0x9B:
            AF[0] = sbcRegister(AF[0], DE[1], 4);
            break;
        case 0x9C:
            AF[0] = sbcRegister(AF[0], HL[0], 4);
            break;
        case 0x9D:
            AF[0] = sbcRegister(AF[0], HL[1], 4);
            break;
        case 0x9E:
            {
                //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
                clockTiming(4);
                let memoryLocation = HL[0] << 8 | HL[1];
                let readValue = new Uint8Array([readMemory(memoryLocation)]);
                AF[0] = sbcRegister(AF[0], readValue[0], 4);
                break;
            }
        case 0xDE:
            {
                pc[0]++;
                //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
                clockTiming(4);
                let readValue = new Uint8Array([readMemory(pc[0])]);
                AF[0] = sbcRegister(AF[0], readValue[0], 4);
                break;
            }
        case 0xA7:
            andOperation(AF[0], 4);
            break;
        case 0xA0:
            andOperation(BC[0], 4);
            break;
        case 0xA1:
            andOperation(BC[1], 4);
            break;
        case 0xA2:
            andOperation(DE[0], 4);
            break;
        case 0xA3:
            andOperation(DE[1], 4);
            break;
        case 0xA4:
            andOperation(HL[0], 4);
            break;
        case 0xA5:
            andOperation(HL[1], 4);
            break;
        case 0xA6:
            {
                //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
                clockTiming(4);
                let memoryLocation = HL[0] << 8 | HL[1];
                let readValue = new Uint8Array([readMemory(memoryLocation)]);
                andOperation(readValue[0], 4);
                break;
            }
        case 0xE6:
            {
                pc[0]++;
                //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
                clockTiming(4);
                let readValue = new Uint8Array([readMemory(pc[0])]);
                andOperation(readValue[0], 4);
                break;
            }
        case 0xB7:
            orOperation(AF[0], 4);
            break;
        case 0xB0:
            orOperation(BC[0], 4);
            break;
        case 0xB1:
            orOperation(BC[1], 4);
            break;
        case 0xB2:
            orOperation(DE[0], 4);
            break;
        case 0xB3:
            orOperation(DE[1], 4);
            break;
        case 0xB4:
            orOperation(HL[0], 4);
            break;
        case 0xB5:
            orOperation(HL[1], 4);
            break;
        case 0xB6:
            {
                //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
                clockTiming(4);
                let memoryLocation = HL[0] << 8 | HL[0];
                let readValue = new Uint8Array([readMemory(memoryLocation)]);
                orOperation(readValue[0], 4);
                break;
            }
        case 0xF6:
            {
                pc[0]++;
                //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
                clockTiming(4);
                let readValue = new Uint8Array([readMemory(pc[0])]);
                orOperation(readValue[0], 4);
                break;
            }
        case 0xAF:
            xorOperation(AF[0], 4);
            break;
        case 0xA8:
            xorOperation(BC[0], 4);
            break;
        case 0xA9:
            xorOperation(BC[1], 4);
            break;
        case 0xAA:
            xorOperation(DE[0], 4);
            break;
        case 0xAB:
            xorOperation(DE[1], 4);
            break;
        case 0xAC:
            xorOperation(HL[0], 4);
            break;
        case 0xAD:
            xorOperation(HL[1], 4);
            break;
        case 0xAE:
            {
                //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
                clockTiming(4);
                let memoryLocation = HL[0] << 8 | HL[1];
                let readValue = new Uint8Array([readMemory(memoryLocation)]);
                xorOperation(readValue[0], 4);
                break;
            }
        case 0xEE:
            {
                pc[0]++;
                //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
                clockTiming(4);
                let readValue = new Uint8Array([readMemory(pc[0])]);
                xorOperation(readValue[0], 4);
                break;
            }
        case 0xBF:
            cpRegister(AF[0], 4);
            break;
        case 0xB8:
            cpRegister(BC[0], 4);
            break;
        case 0xB9:
            cpRegister(BC[1], 4);
            break;
        case 0xBA:
            cpRegister(DE[0], 4);
            break;
        case 0xBB:
            cpRegister(DE[1], 4);
            break;
        case 0xBC:
            cpRegister(HL[0], 4);
            break;
        case 0xBD:
            cpRegister(HL[1], 4);
            break;
        case 0xBE:
            {
                //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
                clockTiming(4);
                let memoryLocation = HL[0] >> 8 | HL[1];
                let readValue = readMemory(memoryLocation);
                cpRegister(readValue, 4);
                break;
            }
        case 0xFE:
            {
                pc[0]++;
                //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
                clockTiming(4);
                let readValue = readMemory(pc[0]);
                cpRegister(readValue, 4);
                break;
            }
        case 0x3C:
            AF[0] = incRegister(AF[0], 4);
            break;
        case 0x04:
            BC[0] = incRegister(BC[0], 4);
            break;
        case 0x0C:
            BC[1] = incRegister(BC[1], 4);
            break;
        case 0x14:
            DE[0] = incRegister(DE[0], 4);
            break;
        case 0x1C:
            DE[1] = incRegister(DE[1], 4);
            break;
        case 0x24:
            HL[0] = incRegister(HL[0], 4);
            break;
        case 0x2C:
            HL[1] = incRegister(HL[1], 4);
            break;
        case 0x34:
            {
                let memoryLocation = HL[0] >> 8 | HL[1];
                incRegisterToMemory(memoryLocation, 12);
            }
            break;
        case 0x3D:
            AF[0] = decRegister(AF[0], 4);
            break;
        case 0x05:
            BC[0] = decRegister(BC[0], 4);
            break;
        case 0x0D:
            BC[1] = decRegister(BC[1], 4);
            break;
        case 0x15:
            DE[0] = decRegister(DE[0], 4);
            break;
        case 0x1D:
            DE[1] = decRegister(DE[1], 4);
            break;
        case 0x25:
            HL[0] = decRegister(HL[0], 4);
            break;
        case 0x2D:
            HL[1] = decRegister(HL[1], 4);
            break;
        case 0x35:
            {
                let memoryLocation = HL[0] >> 8 | HL[1];
                decRegisterToMemory(memoryLocation, 12);
            }
            break;
        case 0x09:
            {
                let registerValue = BC[0] << 8 | BC[1];
                let memoryLocation = HL[0] << 8 | HL[1];
                addRegister16Bit(memoryLocation, registerValue, 8);
                break;
            }
        case 0x19:
            {
                let registerValue = DE[0] << 8 | DE[1];
                let memoryLocation = HL[0] << 8 | HL[1];
                addRegister16Bit(memoryLocation, registerValue, 8);
                break;
            }
        case 0x29:
            {
                let registerValue = HL[0] << 8 | HL[1];
                let memoryLocation = HL[0] << 8 | HL[1];
                addRegister16Bit(memoryLocation, registerValue, 8);
                break;
            }
        case 0x39:
            {
                let memoryLocation = HL[0] << 8 | HL[1];
                addRegister16Bit(memoryLocation, sp[0], 8);
                break;
            }
        case 0xE8:
            {
                //resetting Flags;
                AF[1] = 0;
                pc[0]++;
                //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
                clockTiming(4);
                let e8value = new int8Array([readMemory(pc[0])]);
                //the test for the CFLAG needs to use 8 total bits, in the signed form the seventh bit is thrown out as a sign value so if you have a signed
                //value of 0xFF it will be -127 instead of 255.
                let unsigned_e8value = new Uint8Array([e8value[0]]);
                //getting bit values 3...0;
                let HFlagCheck = sp[0] & 0xF;
                //getting bit values 7...0;
                let CFlagCheck = sp[0] & 0xFF;
                //set flag H if it overflows from bit 3;
                if ((HFlagCheck + (e8value[0] & 0xF)) > 0xF) {
                    AF[1] |= 0b00100000;
                }
                //set flag C if it overflows from bit 7;
                if ((CFlagCheck + unsigned_e8value[0]) > 0xFF) {
                    AF[1] |= 0b00010000;
                }
                sp[0] += e8value[0];
                clockTiming(12);
                break;
            }
        case 0x03:
            BC[1]++;
            if (BC[1] === 0) {
                BC[0]++;
            }
            clockTiming(8);
            break;
        case 0x13:
            DE[1]++;
            if (DE[1] === 0) {
                DE[0]++;
            }
            clockTiming(8);
            break;
        case 0x23:
            HL[1]++;
            if (HL[1] === 0) {
                HL[0]++;
            }
            clockTiming(8);
            break;
        case 0x33:
            sp[0]++;
            clockTiming(8);
            break;
        case 0x0B:
            BC[1]--;
            if (BC[1] === 0xFF) {
                BC[0]--;
            }
            clockTiming(8);
            break;
        case 0x1B:
            DE[1]--;
            if (DE[1] === 0xFF) {
                DE[0]--;
            }
            clockTiming(8);
            break;
        case 0x2B:
            HL[1]--;
            if (HL[1] === 0xFF) {
                HL[0]--;
            }
            clockTiming(8);
            break;
        case 0x3B:
            sp[0]--;
            clockTiming(8);
            break;
        case 0x27:
            //converting register A to BCD
            if (!testBit(AF[1], 6)) {
                if (testBit(AF[1], 4) || (AF[0] > 0x99)) {
                    AF[0] += 0x60;
                    AF[1] = SET(AF[1], 4, 0);
                }
                if (testBit(AF[1], 5) || ((AF[0] & 0x0F) > 0x09)) {
                    AF[0] += 0x06;
                }
            }
            else {
                if (testBit(AF[1], 4)) {
                    AF[0] -= 0x60;
                }
                if (testBit(AF[1], 5)) {
                    AF[0] -= 0x06;
                }
            }
            if (AF[0] === 0) {
                AF[1] = SET(AF[1], 7, 0);
            }
            else {
                AF[1] = RES(AF[1], 7, 0);
            }
            AF[1] = RES(AF[1], 5, 0);
            clockTiming(4);
            break;
        case 0x2F:
            //set the N and H flag
            AF[1] |= 0b01100000;
            //complement A
            AF[0] = ~AF[0];
            clockTiming(4);
            break;
        case 0x3F:
            //reset the N and H flag
            AF[1] &= 0b10010000;
            //complement C flag
            //if C flag is set
            if (testBit(AF[1], 4)) {
                AF[1] &= 0b11100000;
            }
            //if C flag isn't set
            else {
                AF[1] |= 0b00010000;
            }
            clockTiming(4);
            break;
        case 0x37:
            //reset N and H flag
            AF[1] &= 0b10010000;
            //set C flag
            AF[1] |= 0b00010000;
            clockTiming(4);
            break;
        case 0x07:
            RLCA(4);
            break;
        case 0x17:
            RLA(4);
            break;
        case 0x0F:
            RRCA(4);
            break;
        case 0x1F:
            RRA(4);
            break;
        case 0xC3:
            //cycle is 12 for all jumps when non matching and 16 when matching, so we will send 12 and if it passes we will send 4 inside the function
            JP(true, 12);
            break;
        case 0xC2:
            JP(NZCondition(), 12);
            break;
        case 0xCA:
            JP(ZCondition(), 12);
            break;
        case 0xD2:
            JP(NCCondition(), 12);
            break;
        case 0xDA:
            JP(CCondition(), 12);
            break;
        case 0xE9:
            pc[0] = HL[1] + (HL[0] << 8) - 1;
            clockTiming(4);
            break;
        case 0x18:
            //same logic with JP, but with 4 cycles less
            JR(true, 8);
            break;
        case 0x20:
            JR(NZCondition(), 8);
            break;
        case 0x28:
            JR(ZCondition(), 8);
            break;
        case 0x30:
            JR(NCCondition(), 8);
            break;
        case 0x38:
            JR(CCondition(), 8);
            break;
        case 0xCD:
            //12 with call function and 12 with jp function
            CALL(true, 12);
            break;
        case 0xC4:
            CALL(NZCondition(), 12);
            break;
        case 0xCC:
            CALL(ZCondition(), 12);
            break;
        case 0xD4:
            CALL(NCCondition(), 12);
            break;
        case 0xDC:
            CALL(CCondition(), 12);
            break;
        case 0xC9:
            //logic of cycle equal to JP but with 4 outside and 12 inside
            RET(true, 4);
            break;
        case 0xC0:
            //logic of cycle equal to JP but with 8 outside and 12 inside
            RET(NZCondition(), 8);
            break;
        case 0xC8:
            RET(ZCondition(), 8);
            break;
        case 0xD0:
            RET(NCCondition(), 8);
            break;
        case 0xD8:
            RET(CCondition(), 8);
            break;
        case 0xD9:
            RETI(16);
            break;
        case 0xF3:
            masterInterrupt = false;
            clockTiming(4);
            break;
        case 0xFB:
            delayMasterInterrupt = true;
            clockTiming(4);
            break;
        case 0xC7:
            {
                pc[0]++;
                let highByte = new Uint8Array([(pc[0] >> 8)]);
                let lowByte = new Uint8Array([(pc[0] & 0xFF)]);
                PUSH(highByte[0], lowByte[0]);
                //when the instruction is finished, pc will overflow and be set to the right position, 0.
                pc[0] = 0xFFFF;
                break;
            }
        case 0xCF:
            {
                pc[0]++;
                let highByte = new Uint8Array([(pc[0] >> 8)]);
                let lowByte = new Uint8Array([(pc[0] & 0xFF)]);
                PUSH(highByte[0], lowByte[0]);
                //same logic of instruction 0xC7 but it doesnt overflow.
                pc[0] = 0x07;
                break;
            }
        case 0xD7:
            {
                pc[0]++;
                let highByte = new Uint8Array([(pc[0] >> 8)]);
                let lowByte = new Uint8Array([(pc[0] & 0xFF)]);
                PUSH(highByte[0], lowByte[0]);
                //same logic of instruction 0xC7 but it doesnt overflow.
                pc[0] = 0xF;
                break;
            }
        case 0xDF:
            {
                pc[0]++;
                let highByte = new Uint8Array([(pc[0] >> 8)]);
                let lowByte = new Uint8Array([(pc[0] & 0xFF)]);
                PUSH(highByte[0], lowByte[0]);
                //same logic of instruction 0xC7 but it doesnt overflow.
                pc[0] = 0x17;
                break;
            }
        case 0xE7:
            {
                pc[0]++;
                let highByte = new Uint8Array([(pc[0] >> 8)]);
                let lowByte = new Uint8Array([(pc[0] & 0xFF)]);
                PUSH(highByte[0], lowByte[0]);
                //same logic of instruction 0xC7 but it doesnt overflow.
                pc[0] = 0x19;
                break;
            }
        case 0xEF:
            {
                pc[0]++;
                let highByte = new Uint8Array([(pc[0] >> 8)]);
                let lowByte = new Uint8Array([(pc[0] & 0xFF)]);
                PUSH(highByte[0], lowByte[0]);
                //same logic of instruction 0xC7 but it doesnt overflow.
                pc[0] = 0x27;
                break;
            }
        case 0xF7:
            {
                pc[0]++;
                let highByte = new Uint8Array([(pc[0] >> 8)]);
                let lowByte = new Uint8Array([(pc[0] & 0xFF)]);
                PUSH(highByte[0], lowByte[0]);
                //same logic of instruction 0xC7 but it doesnt overflow.
                pc[0] = 0x2F;
                break;
            }
        case 0xFF:
            {
                pc[0]++;
                let highByte = new Uint8Array([(pc[0] >> 8)]);
                let lowByte = new Uint8Array([(pc[0] & 0xFF)]);
                PUSH(highByte[0], lowByte[0]);
                //same logic of instruction 0xC7 but it doesnt overflow.
                pc[0] = 0x37;
                break;
            }
        case 0x76:
            halt = true;
            doHalt();
            break;
        case 0xCB:
            pc[0]++;
            opcode = memory[pc[0]];
            clockTiming(4);
            switch (opcode) {
                case 0x37:
                    AF[0] = swap(AF[0], 8);
                    break;
                case 0x30:
                    BC[0] = swap(BC[0], 8);
                    break;
                case 0x31:
                    BC[1] = swap(BC[1], 8);
                    break;
                case 0x32:
                    DE[0] = swap(DE[0], 8);
                    break;
                case 0x33:
                    DE[1] = swap(DE[1], 8);
                    break;
                case 0x34:
                    HL[0] = swap(HL[0], 8);
                    break;
                case 0x35:
                    HL[1] = swap(HL[1], 8);
                    break;
                case 0x36:
                    {
                        let memoryLocation = HL[0] << 8 | HL[1];
                        swapToMemory(memoryLocation, 16);
                        break;
                    }
                case 0x07:
                    AF[0] = rlcRegister(AF[0], 8);
                    break;
                case 0x00:
                    BC[0] = rlcRegister(BC[0], 8);
                    break;
                case 0x01:
                    BC[1] = rlcRegister(BC[1], 8);
                    break;
                case 0x02:
                    DE[0] = rlcRegister(DE[0], 8);
                    break;
                case 0x03:
                    DE[1] = rlcRegister(DE[1], 8);
                    break;
                case 0x04:
                    HL[0] = rlcRegister(HL[0], 8);
                    break;
                case 0x05:
                    HL[1] = rlcRegister(HL[1], 8);
                    break;
                case 0x06:
                    {
                        let memoryLocation = HL[0] << 8 | HL[1];
                        rlcRegisterToMemory(memoryLocation, 16);
                        break;
                    }
                case 0x17:
                    AF[0] = rlRegister(AF[0], 8);
                    break;
                case 0x10:
                    BC[0] = rlRegister(BC[0], 8);
                    break;
                case 0x11:
                    BC[1] = rlRegister(BC[1], 8);
                    break;
                case 0x12:
                    DE[0] = rlRegister(DE[0], 8);
                    break;
                case 0x13:
                    DE[1] = rlRegister(DE[1], 8);
                    break;
                case 0x14:
                    HL[0] = rlRegister(HL[0], 8);
                    break;
                case 0x15:
                    HL[1] = rlRegister(HL[1], 8);
                    break;
                case 0x16:
                    {
                        let memoryLocation = HL[0] << 8 | HL[1];
                        rlRegisterToMemory(memoryLocation, 16);
                        break;
                    }
                case 0x0F:
                    AF[0] = rrcRegister(AF[0], 8);
                    break;
                case 0x08:
                    BC[0] = rrcRegister(BC[0], 8);
                    break;
                case 0x09:
                    BC[1] = rrcRegister(BC[1], 8);
                    break;
                case 0x0A:
                    DE[0] = rrcRegister(DE[0], 8);
                    break;
                case 0x0B:
                    DE[1] = rrcRegister(DE[1], 8);
                    break;
                case 0x0C:
                    HL[0] = rrcRegister(HL[0], 8);
                    break;
                case 0x0D:
                    HL[1] = rrcRegister(HL[1], 8);
                    break;
                case 0x0E:
                    {
                        let memoryLocation = HL[0] << 8 | HL[1];
                        rrcRegisterToMemory(memoryLocation, 16);
                        break;
                    }
                case 0x1F:
                    AF[0] = rrRegister(AF[0], 8);
                    break;
                case 0x18:
                    BC[0] = rrRegister(BC[0], 8);
                    break;
                case 0x19:
                    BC[0] = rrRegister(BC[1], 8);
                    break;
                case 0x1A:
                    DE[0] = rrRegister(DE[0], 8);
                    break;
                case 0x1B:
                    DE[0] = rrRegister(DE[1], 8);
                    break;
                case 0x1C:
                    HL[0] = rrRegister(HL[0], 8);
                    break;
                case 0x1D:
                    HL[0] = rrRegister(HL[1], 8);
                    break;
                case 0x1E:
                    {
                        let memoryLocation = HL[0] << 8 | HL[1];
                        rrRegisterToMemory(memoryLocation, 16);
                        break;
                    }
                case 0x27:
                    AF[0] = SLA(AF[0], 8);
                    break;
                case 0x20:
                    BC[0] = SLA(BC[0], 8);
                    break;
                case 0x21:
                    BC[1] = SLA(BC[1], 8);
                    break;
                case 0x22:
                    DE[0] =  SLA(DE[0], 8);
                    break;
                case 0x23:
                    DE[1] = SLA(DE[1], 8);
                    break;
                case 0x24:
                    HL[0] = SLA(HL[0], 8);
                    break;
                case 0x25:
                    Hl[1] = SLA(HL[1], 8);
                    break;
                case 0x26:
                    {
                        let memoryLocation = HL[0] << 8 | HL[1];
                        SLAToMemory(memoryLocation, 16);
                        break;
                    }
                case 0x2F:
                    AF[0] = SRA(AF[0], 8);
                    break;
                case 0x28:
                    BC[0] = SRA(BC[0], 8);
                    break;
                case 0x29:
                    BC[1] = SRA(BC[1], 8);
                    break;
                case 0x2A:
                    DE[0] = SRA(DE[0], 8);
                    break;
                case 0x2B:
                    DE[1] = SRA(DE[1], 8);
                    break;
                case 0x2C:
                    HL[0] = SRA(HL[0], 8);
                    break;
                case 0x2D:
                    HL[1] = SRA(HL[1], 8);
                    break;
                case 0x2E:
                    {
                        let memoryLocation = HL[0] << 8 | HL[1];
                        SRAToMemory(memoryLocation, 16);
                        break;
                    }
                case 0x3F:
                    AF[0] = SRL(AF[0], 8);
                    break;
                case 0x38:
                    BC[0] = SRL(BC[0], 8);
                    break;
                case 0x39:
                    BC[1] = SRL(BC[1], 8);
                    break;
                case 0x3A:
                    DE[0] = SRL(DE[0], 8);
                    break;
                case 0x3B:
                    DE[1] = SRL(DE[1], 8);
                    break;
                case 0x3C:
                    HL[0] = SRL(HL[0], 8);
                    break;
                case 0x3D:
                    HL[1] = SRL(HL[1], 8);
                    break;
                case 0x3E:
                    {
                        let memoryLocation = HL[0] << 8 | HL[1];
                        SRLToMemory(memoryLocation, 16);
                        break;
                    }
                case 0x47:
                    BIT(AF[0], 0, 8);
                    break;
                case 0x40:
                    BIT(BC[0], 0, 8);
                    break;
                case 0x41:
                    BIT(BC[1], 0, 8);
                    break;
                case 0x42:
                    BIT(DE[0], 0, 8);
                    break;
                case 0x43:
                    BIT(DE[1], 0, 8);
                    break;
                case 0x44:
                    BIT(HL[0], 0, 8);
                    break;
                case 0x45:
                    BIT(HL[1], 0, 8);
                    break;
                case 0x46:
                    {
                        //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
                        clockTiming(4);
                        let memoryLocation = HL[0] << 8 | HL[1];
                        let readValue = Uint8Array([readMemory(memoryLocation)]);
                        BIT(readValue[0], 0, 12);
                        break;
                    }
                case 0x4F:
                    BIT(AF[0], 1, 8);
                    break;
                case 0x48:
                    BIT(BC[0], 1, 8);
                    break;
                case 0x49:
                    BIT(BC[1], 1, 8);
                    break;
                case 0x4A:
                    BIT(DE[0], 1, 8);
                    break;
                case 0x4B:
                    BIT(DE[1], 1, 8);
                    break;
                case 0x4C:
                    BIT(HL[0], 1, 8);
                    break;
                case 0x4D:
                    BIT(HL[1], 1, 8);
                    break;
                case 0x4E:
                    {
                        //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
                        clockTiming(4);
                        let memoryLocation = HL[0] << 8 | HL[1];
                        let readValue = Uint8Array([readMemory(memoryLocation)]);
                        BIT(readValue[0], 1, 12);
                        break;
                    }
                case 0x57:
                    BIT(AF[0], 2, 8);
                    break;
                case 0x50:
                    BIT(BC[0], 2, 8);
                    break;
                case 0x51:
                    BIT(BC[1], 2, 8);
                    break;
                case 0x52:
                    BIT(DE[0], 2, 8);
                    break;
                case 0x53:
                    BIT(DE[1], 2, 8);
                    break;
                case 0x54:
                    BIT(HL[0], 2, 8);
                    break;
                case 0x55:
                    BIT(HL[1], 2, 8);
                    break;
                case 0x56:
                    {
                        //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
                        clockTiming(4);
                        let memoryLocation = HL[0] << 8 | HL[1];
                        let readValue = Uint8Array([readMemory(memoryLocation)]);
                        BIT(readValue[0], 2, 12);
                        break;
                    }
                case 0x5F:
                    BIT(AF[0], 3, 8);
                    break;
                case 0x58:
                    BIT(BC[0], 3, 8);
                    break;
                case 0x59:
                    BIT(BC[1], 3, 8);
                    break;
                case 0x5A:
                    BIT(DE[0], 3, 8);
                    break;
                case 0x5B:
                    BIT(DE[1], 3, 8);
                    break;
                case 0x5C:
                    BIT(HL[0], 3, 8);
                    break;
                case 0x5D:
                    BIT(HL[1], 3, 8);
                    break;
                case 0x5E:
                    {
                        //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
                        clockTiming(4);
                        let memoryLocation = HL[0] << 8 | HL[1];
                        let readValue = Uint8Array([readMemory(memoryLocation)]);
                        BIT(readValue[0], 3, 12);
                        break;
                    }
                case 0x67:
                    BIT(AF[0], 4, 8);
                    break;
                case 0x60:
                    BIT(BC[0], 4, 8);
                    break;
                case 0x61:
                    BIT(BC[1], 4, 8);
                    break;
                case 0x62:
                    BIT(DE[0], 4, 8);
                    break;
                case 0x63:
                    BIT(DE[1], 4, 8);
                    break;
                case 0x64:
                    BIT(HL[0], 4, 8);
                    break;
                case 0x65:
                    BIT(HL[1], 4, 8);
                    break;
                case 0x66:
                    {
                        //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
                        clockTiming(4);
                        let memoryLocation = HL[0] << 8 | HL[1];
                        let readValue = Uint8Array([readMemory(memoryLocation)]);
                        BIT(readValue[0], 4, 12);
                        break;
                    }
                case 0x6F:
                    BIT(AF[0], 5, 8);
                    break;
                case 0x68:
                    BIT(BC[0], 5, 8);
                    break;
                case 0x69:
                    BIT(BC[1], 5, 8);
                    break;
                case 0x6A:
                    BIT(DE[0], 5, 8);
                    break;
                case 0x6B:
                    BIT(DE[1], 5, 8);
                    break;
                case 0x6C:
                    BIT(HL[0], 5, 8);
                    break;
                case 0x6D:
                    BIT(HL[1], 5, 8);
                    break;
                case 0x6E:
                    {
                        //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
                        clockTiming(4);
                        let memoryLocation = HL[0] << 8 | HL[1];
                        let readValue = Uint8Array([readMemory(memoryLocation)]);
                        BIT(readValue[0], 6, 12);
                        break;
                    }
                case 0x77:
                    BIT(AF[0], 6, 8);
                    break;
                case 0x70:
                    BIT(BC[0], 6, 8);
                    break;
                case 0x71:
                    BIT(BC[1], 6, 8);
                    break;
                case 0x72:
                    BIT(DE[0], 6, 8);
                    break;
                case 0x73:
                    BIT(DE[1], 6, 8);
                    break;
                case 0x74:
                    BIT(HL[0], 6, 8);
                    break;
                case 0x75:
                    BIT(HL[1], 6, 8);
                    break;
                case 0x76:
                    {
                        //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
                        clockTiming(4);
                        let memoryLocation = HL[0] << 8 | HL[1];
                        let readValue = Uint8Array([readMemory(memoryLocation)]);
                        BIT(readValue[0], 6, 12);
                        break;
                    }
                case 0x7F:
                    BIT(AF[0], 7, 8);
                    break;
                case 0x78:
                    BIT(BC[0], 7, 8);
                    break;
                case 0x79:
                    BIT(BC[1], 7, 8);
                    break;
                case 0x7A:
                    BIT(DE[0], 7, 8);
                    break;
                case 0x7B:
                    BIT(DE[1], 7, 8);
                    break;
                case 0x7C:
                    BIT(HL[0], 7, 8);
                    break;
                case 0x7D:
                    BIT(HL[1], 7, 8);
                    break;
                case 0x7E:
                    {
                        //increasing timer before we read because if it reads from an timer sensitive portion of the memory it can cause problems otherwise
                        clockTiming(4);
                        let memoryLocation = HL[0] << 8 | HL[1];
                        let readValue = Uint8Array([readMemory(memoryLocation)]);
                        BIT(readValue[0], 8, 12);
                        break;
                    }
                case 0xC7:
                    AF[0] = SET(AF[0], 0, 8);
                    break;
                case 0xC0:
                    BC[0] = SET(BC[0], 0, 8);
                    break;
                case 0xC1:
                    BC[1] = SET(BC[1], 0, 8);
                    break;
                case 0xC2:
                    DE[0] = SET(DE[0], 0, 8);
                    break;
                case 0xC3:
                    DE[1] = SET(DE[1], 0, 8);
                    break;
                case 0xC4:
                    HL[0] = SET(HL[0], 0, 8);
                    break;
                case 0xC5:
                    HL[1] = SET(HL[1], 0, 8);
                    break;
                case 0xC6:
                    {
                        let memoryLocation = HL[0] << 8 | HL[1];
                        SETToMemory(memoryLocation, 0, 16);
                        break;
                    }   
                case 0xCF:
                    AF[0] = SET(AF[0], 1, 8);
                    break;
                case 0xC8:
                    BC[0] = SET(BC[0], 1, 8);
                    break;
                case 0xC9:
                    BC[1] = SET(BC[1], 1, 8);
                    break;
                case 0xCA:
                    DE[0] = SET(DE[0], 1, 8);
                    break;
                case 0xCB:
                    DE[1] = SET(DE[1], 1, 8);
                    break;
                case 0xCC:
                    HL[0] = SET(HL[0], 1, 8);
                    break;
                case 0xCD:
                    HL[1] = SET(HL[1], 1, 8);
                    break;
                case 0xCE:
                    {
                        let memoryLocation = HL[0] << 8 | HL[1];
                        SETToMemory(memoryLocation, 1, 16);
                        break;
                    }   
                case 0xD7:
                    AF[0] = SET(AF[0], 2, 8);
                    break;
                case 0xD0:
                    BC[0] = SET(BC[0], 2, 8);
                    break;
                case 0xD1:
                    BC[1] = SET(BC[1], 2, 8);
                    break;
                case 0xD2:
                    DE[0] = SET(DE[0], 2, 8);
                    break;
                case 0xD3:
                    DE[1] = SET(DE[1], 2, 8);
                    break;
                case 0xD4:
                    HL[0] = SET(HL[0], 2, 8);
                    break;
                case 0xD5:
                    HL[1] = SET(HL[1], 2, 8);
                    break;
                case 0xD6:
                    {
                        let memoryLocation = HL[0] << 8 | HL[1];
                        SETToMemory(memoryLocation, 2, 16);
                        break;
                    }   
                case 0xDF:
                    AF[0] = SET(AF[0], 3, 8);
                    break;
                case 0xD8:
                    BC[0] = SET(BC[0], 3, 8);
                    break;
                case 0xD9:
                    BC[1] = SET(BC[1], 3, 8);
                    break;
                case 0xDA:
                    DE[0] = SET(DE[0], 3, 8);
                    break;
                case 0xDB:
                    DE[1] = SET(DE[1], 3, 8);
                    break;
                case 0xDC:
                    HL[0] = SET(HL[0], 3, 8);
                    break;
                case 0xDD:
                    HL[1] = SET(HL[1], 3, 8);
                    break;
                case 0xDE:
                    {
                        let memoryLocation = HL[0] << 8 | HL[1];
                        SETToMemory(memoryLocation, 3, 16);
                        break;
                    }   
                case 0xE7:
                    AF[0] = SET(AF[0], 4, 8);
                    break;
                case 0xE0:
                    BC[0] = SET(BC[0], 4, 8);
                    break;
                case 0xE1:
                    BC[1] = SET(BC[1], 4, 8);
                    break;
                case 0xE2:
                    DE[0] = SET(DE[0], 4, 8);
                    break;
                case 0xE3:
                    DE[1] = SET(DE[1], 4, 8);
                    break;
                case 0xE4:
                    HL[0] = SET(HL[0], 4, 8);
                    break;
                case 0xE5:
                    HL[1] = SET(HL[1], 4, 8);
                    break;
                case 0xE6:
                    {
                        let memoryLocation = HL[0] << 8 | HL[1];
                        SETToMemory(memoryLocation, 4, 16);
                        break;
                    } 
                case 0xEF:
                    AF[0] = SET(AF[0], 5, 8);
                    break;
                case 0xE8:
                    BC[0] = SET(BC[0], 5, 8);
                    break;
                case 0xE9:
                    BC[1] = SET(BC[1], 5, 8);
                    break;
                case 0xEA:
                    DE[0] = SET(DE[0], 5, 8);
                    break;
                case 0xEB:
                    DE[1] = SET(DE[1], 5, 8);
                    break;
                case 0xEC:
                    HL[0] = SET(HL[0], 5, 8);
                    break;
                case 0xED:
                    HL[0] = SET(HL[1], 5, 8);
                    break;
                case 0xEE:
                    {
                        let memoryLocation = HL[0] << 8 | HL[1];
                        SETToMemory(memoryLocation, 5, 16);
                        break;
                    } 
                case 0xF7:
                    AF[0] = SET(AF[0], 6, 8);
                    break;
                case 0xF0:
                    BC[0] = SET(BC[0], 6, 8);
                    break;
                case 0xF1:
                    BC[1] = SET(BC[1], 6, 8);
                    break;
                case 0xF2:
                    DE[0] = SET(DE[0], 6, 8);
                    break;
                case 0xF3:
                    DE[1] = SET(DE[1], 6, 8);
                    break;
                case 0xF4:
                    HL[0] = SET(HL[0], 6, 8);
                    break;
                case 0xF5:
                    HL[1] = SET(HL[1], 6, 8);
                    break;
                case 0xF6:
                    {
                        let memoryLocation = HL[0] << 8 | HL[1];
                        SETToMemory(memoryLocation, 6, 16);
                        break;
                    } 
                case 0xFF:
                    AF[0] = SET(AF[0], 7, 8);
                    break;
                case 0xF8:
                    BC[0] = SET(BC[0], 7, 8);
                    break;
                case 0xF9:
                    BC[1] = SET(BC[1], 7, 8);
                    break;
                case 0xFA:
                    DE[0] = SET(DE[0], 7, 8);
                    break;
                case 0xFB:
                    DE[1] = SET(DE[1], 7, 8);
                    break;
                case 0xFC:
                    HL[0] = SET(HL[0], 7, 8);
                    break;
                case 0xFD:
                    HL[0] = SET(HL[1], 7, 8);
                    break;
                case 0xFE:
                    {
                        let memoryLocation = HL[0] << 8 | HL[1];
                        SETToMemory(memoryLocation, 7, 16);
                        break;
                    } 
                case 0x87:
                    AF[0] = RES(AF[0], 0, 8);
                    break;
                case 0x80:
                    BC[0] = RES(BC[0], 0, 8);
                    break;
                case 0x81:
                    BC[1] = RES(BC[1], 0, 8);
                    break;
                case 0x82:
                    DE[0] = RES(DE[0], 0, 8);
                    break;
                case 0x83:
                    DE[1] = RES(DE[1], 0, 8);
                    break;
                case 0x84:
                    HL[0] = RES(HL[0], 0, 8);
                    break;
                case 0x85:
                    HL[1] = RES(HL[1], 0, 8);
                    break;
                case 0x86:
                    {
                        let memoryLocation = HL[0] << 8 | HL[1];
                        RESToMemory(memoryLocation, 0, 16);
                        break;
                    }
                case 0x8F:
                    AF[0] = RES(AF[0], 1, 8);
                    break;
                case 0x88:
                    BC[0] = RES(BC[0], 1, 8);
                    break;
                case 0x89:
                    BC[1] = RES(BC[1], 1, 8);
                    break;
                case 0x8A:
                    DE[0] = RES(DE[0], 1, 8);
                    break;
                case 0x8B:
                    DE[1] = RES(DE[1], 1, 8);
                    break;
                case 0x8C:
                    HL[0] = RES(HL[0], 1, 8);
                    break;
                case 0x8D:
                    HL[1] = RES(HL[1], 1, 8);
                    break;
                case 0x8E:
                    {
                        let memoryLocation = HL[0] << 8 | HL[1];
                        RESToMemory(memoryLocation, 1, 16);
                        break;
                    }
                case 0x97:
                    AF[0] = RES(AF[0], 2, 8);
                    break;
                case 0x90:
                    BC[0] = RES(BC[0], 2, 8);
                    break;
                case 0x91:
                    BC[1] = RES(BC[1], 2, 8);
                    break;
                case 0x92:
                    DE[0] = RES(DE[0], 2, 8);
                    break;
                case 0x93:
                    DE[1] = RES(DE[1], 2, 8);
                    break;
                case 0x94:
                    HL[0] = RES(HL[0], 2, 8);
                    break;
                case 0x95:
                    HL[1] = RES(HL[1], 2, 8);
                    break;
                case 0x96:
                    {
                        let memoryLocation = HL[0] << 8 | HL[1];
                        RESToMemory(memoryLocation, 2, 16);
                        break;
                    }
                case 0x9F:
                    AF[0] = RES(AF[0], 3, 8);
                    break;
                case 0x98:
                    BC[0] = RES(BC[0], 3, 8);
                    break;
                case 0x99:
                    BC[1] = RES(BC[1], 3, 8);
                    break;
                case 0x9A:
                    DE[0] = RES(DE[0], 3, 8);
                    break;
                case 0x9B:
                    DE[1] = RES(DE[1], 3, 8);
                    break;
                case 0x9C:
                    HL[0] = RES(HL[0], 3, 8);
                    break;
                case 0x9D:
                    HL[1] = RES(HL[1], 3, 8);
                    break;
                case 0x9E:
                    {
                        let memoryLocation = HL[0] << 8 | HL[1];
                        RESToMemory(memoryLocation, 3, 16);
                        break;
                    }
                case 0xA7:
                    AF[0] = RES(AF[0], 4, 8);
                    break;
                case 0xA0:
                    BC[0] = RES(BC[0], 4, 8);
                    break;
                case 0xA1:
                    BC[1] = RES(BC[1], 4, 8);
                    break;
                case 0xA2:
                    DE[0] = RES(DE[0], 4, 8);
                    break;
                case 0xA3:
                    DE[1] = RES(DE[1], 4, 8);
                    break;
                case 0xA4:
                    HL[0] = RES(HL[0], 4, 8);
                    break;
                case 0xA5:
                    HL[1] = RES(HL[1], 4, 8);
                    break;
                case 0xA6:
                    {
                        let memoryLocation = HL[0] << 8 | HL[1];
                        RESToMemory(memoryLocation, 4, 16);
                        break;
                    }
                case 0xAF:
                    AF[0] = RES(AF[0], 5, 8);
                    break;
                case 0xA8:
                    BC[0] = RES(BC[0], 5, 8);
                    break;
                case 0xA9:
                    BC[1] = RES(BC[1], 5, 8);
                    break;
                case 0xAA:
                    DE[0] = RES(DE[0], 5, 8);
                    break;
                case 0xAB:
                    DE[1] = RES(DE[1], 5, 8);
                    break;
                case 0xAC:
                    HL[0] = RES(HL[0], 5, 8);
                    break;
                case 0xAD:
                    HL[1] = RES(HL[1], 5, 8);
                    break;
                case 0xAE:
                    {
                        let memoryLocation = HL[0] << 8 | HL[1];
                        RESToMemory(memoryLocation, 5, 16);
                        break;
                    }
                case 0xB7:
                    AF[0] = RES(AF[0], 6, 8);
                    break;
                case 0xB0:
                    BC[0] = RES(BC[0], 6, 8);
                    break;
                case 0xB1:
                    BC[1] = RES(BC[1], 6, 8);
                    break;
                case 0xB2:
                    DE[0] = RES(DE[0], 6, 8);
                    break;
                case 0xB3:
                    DE[1] = RES(DE[1], 6, 8);
                    break;
                case 0xB4:
                    HL[0] = RES(HL[0], 6, 8);
                    break;
                case 0xB5:
                    HL[1] = RES(HL[1], 6, 8);
                    break;
                case 0xB6:
                    {
                        let memoryLocation = HL[0] << 8 | HL[1];
                        RESToMemory(memoryLocation, 6, 16);
                        break;
                    }
                case 0xBF:
                    AF[0] = RES(AF[0], 7, 8);
                    break;
                case 0xB8:
                    BC[0] = RES(BC[0], 7, 8);
                    break;
                case 0xB9:
                    BC[1] = RES(BC[1], 7, 8);
                    break;
                case 0xBA:
                    DE[0] = RES(DE[0], 7, 8);
                    break;
                case 0xBB:
                    DE[1] = RES(DE[1], 7, 8);
                    break;
                case 0xBC:
                    HL[0] = RES(HL[0], 7, 8);
                    break;
                case 0xBD:
                    HL[1] = RES(HL[1], 7, 8);
                    break;
                case 0xBE:
                    {
                        let memoryLocation = HL[0] << 8 | HL[1];
                        RESToMemory(memoryLocation, 7, 16);
                        break;
                    }
                default:
                    printf("opcode [%X] not found, romBank[%X], ramBank[%X], pc[%X], sp[%X]\n", opcode, romBankNumber, ramBankNumber, pc, sp);
                    break;
            }
            break;
        default:
            printf("opcode [%X] not found, romBank[%X], ramBank[%X], pc[%X], sp[%X]\n", opcode, romBankNumber, ramBankNumber, pc, sp);
            break;
    }

    //increasing program counter;
    pc[0]++;
}

function addRegister(registerA, registerB, cycles) {
    let registerCopy = new Uint8Array([registerA]);
    clockTiming(cycles);
    AF[1] = 0;
    //getting immediate data in the form of unsigned char
    let e8value = registerB;
    //getting the value of 3...0 bits in SP;
    let HFlagCheck = registerA & 0xF;
    //getting the value of 7...0 bits in SP;
    let CFlagCheck = registerA & 0xFF;

    registerCopy[0] += e8value;
    //setting Z flag if result is 0
    if (registerCopy[0] === 0) {
        AF[1] = SET(AF[1], 7, 0);
    }
    //checking if theres overflow from bit 3 (H flag)
    if ((HFlagCheck + (e8value & 0xF)) > 0xF) {
        AF[1] = SET(AF[1], 5, 0);
    }

    // checking if theres overflow from bit 7
    if ((CFlagCheck + e8value) > 0xFF) {
        AF[1] = SET(AF[1], 4, 0);
    }
    return registerCopy[0];
}

function adcRegister(registerA, registerB, cycles) {
    let registerCopy = new Uint8Array([registerA]);
    clockTiming(cycles);
    AF[1] = RES(AF[1], 6, 0);
    //getting immediate data in the form of signed char
    let e8value = registerB;
    //getting the value of 3...0 bits in SP;
    let HFlagCheck = registerA & 0x0F;
    //getting the value of 7...0 bits in SP;
    let CFlagCheck = registerA & 0xFF;
    //adding to register before checking if theres overflow because we have to add the previous carry to the value;
    let carryBit = 0;
    if (testBit(AF[1], 4)) {
        carryBit = 1;
    }
    registerCopy[0] += (e8value + carryBit);
    //if the result is 0, set Z flag
    if (registerCopy[0] === 0) {
        AF[1] = SET(AF[1], 7, 0);
    }
    else {
        AF[1] = RES(AF[1], 7, 0);
    }

    //checking if theres overflow from bit 3 (H flag)
    if ((HFlagCheck + ((e8value & 0xF) + carryBit)) > 0xF) {
        AF[1] = SET(AF[1], 5, 0);
    }
    else {
        AF[1] = RES(AF[1], 5, 0);
    }

    // checking if theres overflow from bit 7
    if ((CFlagCheck + (e8value + carryBit)) > 0xFF) {
        AF[1] = SET(AF[1], 4, 0);
    }
    else {
        AF[1] = RES(AF[1], 4, 0);
    }

    return registerA;
}

function subRegister(registerA, registerB, cycles) {
    let registerCopy = new Uint8Array([registerA]);
    clockTiming(cycles);
    AF[1] = 0;
    AF[1] = SET(AF[1], 6, 0);
    //getting immediate data in the form of signed char
    let e8value = registerB;
    //getting the value of 3...0 bits in SP;
    let HFlagCheck = registerA & 0xF;
    //getting the value of 7...0 bits in SP;
    let CFlagCheck = registerA & 0xFF;

    registerCopy[0] -= e8value;
    //if the result is 0, set Z flag
    if (registerCopy[0] === 0) {
        AF[1] = SET(AF[1], 7, 0);
    }

    if (HFlagCheck < (e8value & 0xF)) {
        AF[1] = SET(AF[1], 5, 0);
    }

    if (CFlagCheck < e8value) {
        AF[1] = SET(AF[1], 4, 0);
    }
    return registerCopy[0];
}

function sbcRegister(registerA, registerB, cycles) {
    let registerCopy = new Uint8Array([registerA]);
    clockTiming(cycles);
    AF[1] = SET(AF[1], 6, 0);
    //getting immediate data in the form of signed char
    let e8value = registerB;
    //getting the value of 3...0 bits in SP;
    let HFlagCheck = registerA & 0xF;
    //getting the value of 7...0 bits in SP;
    let CFlagCheck = registerA & 0xFF;
    let carryBit = 0;
    if (testBit(AF[1], 4)) {
        carryBit = 1;
    }

    registerCopy[0] -= (e8value + carryBit);
    //if the result is 0, set the Z flag
    if (registerCopy[0] === 0) {
        AF[1] = SET(AF[1], 7, 0);
    }
    else {
        AF[1] = RES(AF[1], 7, 0);
    }

    if (HFlagCheck < ((e8value & 0xF) + carryBit)) {
        AF[1] = SET(AF[1], 5, 0);
    }
    else {
        AF[1] = RES(AF[1], 5, 0);
    }

    if (CFlagCheck < (e8value + carryBit)) {
        AF[1] = SET(AF[1], 4, 0);
    }
    else {
        AF[1] = RES(AF[1], 4, 0);
    }

    return registerCopy[0];
}

//AND operation of register A with other 8bit values, puts the result in register A
function andOperation(registerB, cycles) {
    clockTiming(cycles);
    //resetting flags
    AF[1] = 0;
    //setting the H flag
    AF[1] = SET(AF[1], 5, 0);
    AF[0] &= registerB;

    //if the result is zero, set the Z flag
    if (AF[0] === 0) {
        AF[1] |= 0b10000000;
    }
}

//OR operation of register A with other 8bit values, puts the result in register A
function orOperation(registerB, cycles) {
    clockTiming(cycles);
    //resetting flags
    AF[1] = 0;


    AF[0] |= registerB;

    //if the result is zero, set the Z flag
    if (AF[0] === 0) {
        AF[1] = SET(AF[1], 7, 0);
    }
}

//XOR operation of register A with other 8bit values, puts the result in register A
function xorOperation(registerB, cycles) {
    clockTiming(cycles);
    //resetting flags
    AF[1] = 0;
    AF[0] = (registerB ^ AF[0]);

    //if the result is zero, set the Z flag
    if (AF[0] === 0) {
        AF[1] = SET(AF[1], 7, 0);
    }
}

//compare A with n.  This is basically an A - n subtraction instruction but the results are thrown away
function cpRegister(registerB, cycles) {
    clockTiming(cycles);
    AF[1] = 0;
    //setting N flag
    AF[1] |= 0b01000000;
    //getting immediate data in the form of signed char
    let e8value = registerB;
    //getting the value of 3...0 bits in A;
    let HFlagCheck = AF[0] & 0xF;
    //getting the value of 7...0 bits in A;
    let CFlagCheck = AF[0] & 0xFF;

    //if the value are equal, set Z flag
    if (AF[0] === registerB) {
        AF[1] |= 0b10000000;
    }

    if (HFlagCheck < (e8value & 0xF)) {
        AF[1] |= 0b00100000;
    }

    if (CFlagCheck < e8value) {
        AF[1] |= 0b00010000;
    }
}

function incRegister(registerA, cycles) {
    let registerCopy = new Uint8Array([registerA]);
    clockTiming(cycles);
    //resetting N, Z and H flags
    AF[1] &= 0b00010000;

    //check if the lower nibble is 0b1111 to see if it will carry from bit 3. if it carries, set flag H;
    if ((registerA & 0xF) === 0xF) {
        AF[1] |= 0b00100000;
    }

    //increments register
    registerCopy[0]++;
    //if it overflows, set flag Z;
    if (registerCopy[0] === 0) {
        AF[1] |= 0b10000000;
    }
    return registerCopy[0];
}

function incRegisterToMemory(memoryLocation, cycles){
    clockTiming(cycles);
    //resetting N, Z and H flags
    AF[1] &= 0b00010000;
    registerA = readMemory(memoryLocation);
    //check if the lower nibble is 0b1111 to see if it will carry from bit 3. if it carries, set flag H;
    if ((registerA & 0xF) === 0xF) {
        AF[1] |= 0b00100000;
    }

    //increments register
    registerA += 1;
    //if it overflows, set flag Z;
    if (registerA === 0) {
        AF[1] |= 0b10000000;
    }
    writeInMemory(memoryLocation, registerA);
}

function decRegister(registerA, cycles) {
    let registerCopy = new Uint8Array([registerA]);
    clockTiming(cycles);
    //setting N flag
    AF[1] |= 0b01000000;

    //check if the lower nibble is 0b0000 to see if it will borrow from bit 4. if it carries, set flag H;
    if ((registerA & 0xF) === 0) {
        AF[1] |= 0b00100000;
    }
    //if it doesnt carry, reset flag
    else {
        AF[1] &= 0b11010000;
    }
    //decrements register
    registerCopy[0]--;
    //if the result is 0, set flag Z
    if (registerCopy[0] === 0) {
        AF[1] |= 0b10000000;
    }
    else {
        AF[1] &= 0b01110000;
    }
    return registerCopy[0];
}

function decRegisterToMemory(memoryLocation, cycles) {
    clockTiming(cycles);
    //setting N flag
    AF[1] |= 0b01000000;

    registerA = readMemory(memoryLocation);
    //check if the lower nibble is 0b0000 to see if it will borrow from bit 4. if it carries, set flag H;
    if ((registerA & 0xF) === 0) {
        AF[1] |= 0b00100000;
    }
    //if it doesnt carry, reset flag
    else {
        AF[1] &= 0b11010000;
    }
    //decrements register
    registerA -= 1;
    //if the result is 0, set flag Z
    if (registerA === 0) {
        AF[1] |= 0b10000000;
    }
    else {
        AF[1] &= 0b01110000;
    }
    writeInMemory(memoryLocation, registerA);
}

function addRegister16Bit(registerA, registerB, cycles) {
    let registerCopy = new Uint8Array([registerA]);
    clockTiming(cycles);
    //resetting N flag
    AF[1] &= 0b10110000;

    let e16value = registerB;

    //getting the value of bits 11...0;
    let HFlagCheck = registerA & 0xFFF;
    //getting the value of bits 15...0;
    let CFlagCheck = registerA & 0xFFFF;

    //set H flag if bit 11 overflows
    if ((HFlagCheck + (e16value & 0xFFF)) > 0xFFF) {
        AF[1] |= 0b00100000;
    }
    else {
        AF[1] &= 0b11010000;
    }

    //set C flag if bit 15 overflows
    if ((CFlagCheck + e16value) > 0xFFFF) {
        AF[1] |= 0b00010000;
    }
    else {
        AF[1] &= 0b11100000;
    }

    registerCopy[0] += registerB;
    HL[0] = (registerCopy[0] >> 8) & 0xF;
    HL[1] = registerCopy[0] & 0xF;
}

function swap(registerA, cycles) {
    clockTiming(cycles);
    AF[1] = 0;
    if (registerA === 0) {
        //set Z flag
        AF[1] |= 0b10000000;
    }
    else {
        //swap lower nibble with upper nibble
        registerA = ((registerA & 0x0F) << 4) | ((registerA & 0xF0) >> 4);
        return registerA;
    }
}

function swapToMemory(memoryLocation, cycles) {
    clockTiming(cycles);
    AF[1] = 0;

    let registerA = readMemory(memoryLocation);

    if (registerA === 0) {
        //set Z flag
        AF[1] |= 0b10000000;
    }
    else {
        //swap lower nibble with upper nibble
        registerA = ((registerA & 0x0F) << 4) | ((registerA & 0xF0) >> 4);
    }
    writeInMemory(memoryLocation, registerA);
}

function rlcRegister(registerA, cycles) {
    clockTiming(cycles);
    //storing the seventh bit of registerA
    let seventhBit = (registerA & 0b10000000);
    //copying the seventh bit of registerA to carry flag
    AF[1] = ((seventhBit >> 3) | (AF[1] & 0b11100000));
    //rotating registerA to the left
    registerA <<= 1;
    //setting bit 0 to the previous seventh bit
    registerA |= (seventhBit >> 7);

    //resetting N and H and Z flags
    AF[1] &= 0b00010000;
    //if result of rotation is 0, set Z flag
    if (registerA === 0) {
        AF[1] |= 0b10000000;
    }
    return registerA;
}

function rlcRegisterToMemory(memoryLocation, cycles) {
    clockTiming(cycles);

    let registerA = readMemory(memoryLocation);

    //storing the seventh bit of registerA
    let seventhBit = (registerA & 0b10000000);
    //copying the seventh bit of registerA to carry flag
    AF[1] = ((seventhBit >> 3) | (AF[1] & 0b11100000));
    //rotating registerA to the left
    registerA <<= 1;
    //setting bit 0 to the previous seventh bit
    registerA |= (seventhBit >> 7);

    //resetting N and H and Z flags
    AF[1] &= 0b00010000;
    //if result of rotation is 0, set Z flag
    if (registerA === 0) {
        AF[1] |= 0b10000000;
    }

    writeInMemory(memoryLocation, registerA);
}

function RLCA(cycles)
{
    clockTiming(cycles);
    //storing the seventh bit of registerA
    let seventhBit = (AF[0] & 0b10000000);
    //copying the seventh bit of registerA to carry flag
    AF[1] = ((seventhBit >> 3) | (AF[1] & 0b11100000));
    //rotating registerA to the left
    AF[0] <<= 1;
    //setting bit 0 to the previous seventh bit
    AF[0] |= (seventhBit >> 7);
    //resetting N and H and Z flags
    AF[1] &= 0b00010000;
}

function rlRegister(registerA, cycles) {
    clockTiming(cycles);
    //storing the carry flag
    let CFlag = (AF[1] & 0b00010000);
    //copying the seventh bit of registerA to carry flag
    AF[1] = (((registerA & 0b10000000) >> 3) | (AF[1] & 0b11100000));
    //rotating registerA to the left
    registerA <<= 1;
    //setting bit 0 to previous carry flag
    registerA |= (CFlag >> 4);

    //resetting N and H flags
    AF[1] &= 0b00010000;
    //if result of rotation is 0, set Z flag
    if (registerA === 0) {
        AF[1] |= 0b10000000;
    }
    return registerA;
}

function rlRegisterToMemory(memoryLocation, cycles) {
    clockTiming(cycles);

    registerA = readMemory(memoryLocation);

    //storing the carry flag
    CFlag = (AF[1] & 0b00010000);
    //copying the seventh bit of registerA to carry flag
    AF[1] = (((registerA & 0b10000000) >> 3) | (AF[1] & 0b11100000));
    //rotating registerA to the left
    registerA <<= 1;
    //setting bit 0 to previous carry flag
    registerA |= (CFlag >> 4);

    //resetting N and H flags
    AF[1] &= 0b00010000;
    //if result of rotation is 0, set Z flag
    if (registerA === 0) {
        AF[1] |= 0b10000000;
    }

    writeInMemory(memoryLocation, registerA);
}

function RLA(cycles) {
    clockTiming(cycles);
    //storing the carry flag
    let CFlag = (AF[1] & 0b00010000);
    //copying the seventh bit of registerA to carry flag
    AF[1] = (((AF[0] & 0b10000000) >> 3) | (AF[1] & 0b11100000));
    //rotating registerA to the left
    AF[0] <<= 1;
    //setting bit 0 to previous carry flag
    AF[0] |= (CFlag >> 4);

    //resetting N and H and Z flags
    AF[1] &= 0b00010000;
}

function rrcRegister(registerA, cycles) {
    clockTiming(cycles);
    //storing the zeroth bit of registerA
    let zerothBit = (registerA & 0b00000001);
    //copying the zeroth bit of registerA to carry flag
    AF[0] = ((zerothBit << 4) | (AF[1] & 0b11100000));
    //rotating registerA to the right
    registerA >>= 1;
    //setting bit 7 to the previous zeroth bit
    registerA |= (zerothBit << 7);

    //resetting N and H flags
    AF[1] &= 0b00010000;
    //if result of rotation is 0, set Z flag
    if (registerA === 0) {
        AF[1] |= 0b10000000;
    }

    return registerA;
}

function rrcRegisterToMemory(memoryLocation, cycles) {
    clockTiming(cycles);

    let registerA = readMemory(memoryLocation);

    //storing the zeroth bit of registerA
    let zerothBit = (registerA & 0b00000001);
    //copying the zeroth bit of registerA to carry flag
    AF[1] = ((zerothBit << 4) | (AF[1] & 0b11100000));
    //rotating registerA to the right
    registerA >>= 1;
    //setting bit 7 to the previous zeroth bit
    registerA |= (zerothBit << 7);

    //resetting N and H flags
    AF[1] &= 0b00010000;
    //if result of rotation is 0, set Z flag
    if (registerA === 0) {
        AF[1] |= 0b10000000;
    }

    writeInMemory(memoryLocation, registerA);
}

function RRCA(cycles) {
    clockTiming(cycles);
    //storing the zeroth bit of registerA
    let zerothBit = (AF[0] & 0b00000001);
    //copying the zeroth bit of registerA to carry flag
    AF[1] = ((zerothBit << 4) | (AF[1] & 0b11100000));
    //rotating registerA to the right
    AF[0] >>= 1;
    //setting bit 7 to the previous zeroth bit
    AF[0] |= (zerothBit << 7);

    //resetting N and H and Zflags
    AF[1] &= 0b00010000;
}

function rrRegister(registerA, cycles) {
    clockTiming(cycles);
    //storing the carry flag
    let CFlag = (AF[1] & 0b00010000);
    //copying the zeroth bit of registerA to carry flag
    AF[1] = (((registerA & 0b00000001) << 4) | (AF[1] & 0b11100000));
    //rotating registerA to the right
    registerA >>= 1;
    //setting bit 7 to the previous carry flag
    registerA |= (CFlag << 3);

    //resetting N and H and Z flags
    AF[1] &= 0b00010000;
    //if result of rotation is 0, set Z flag
    if (registerA === 0) {
        AF[1] |= 0b10000000;
    }
    return registerA;
}

function rrRegisterToMemory(memoryLocation, cycles) {
    clockTiming(cycles);

    let registerA = readMemory(memoryLocation);

    //storing the carry flag
    let CFlag = (AF[1] & 0b00010000);
    //copying the zeroth bit of registerA to carry flag
    AF[1] = (((registerA & 0b00000001) << 4) | (AF[1] & 0b11100000));
    //rotating registerA to the right
    registerA >>= 1;
    //setting bit 7 to the previous carry flag
    registerA |= (CFlag << 3);

    //resetting N and H and Z flags
    AF[1] &= 0b00010000;
    //if result of rotation is 0, set Z flag
    if (registerA === 0) {
        AF[1] |= 0b10000000;
    }

    writeInMemory(memoryLocation, registerA);
}

function RRA(cycles) {
    clockTiming(cycles);
    //storing the carry flag
    let CFlag = (AF[1] & 0b00010000);
    //copying the zeroth bit of registerA to carry flag
    AF[1] = (((AF.A & 0b00000001) << 4) | (AF[1] & 0b11100000));
    //rotating registerA to the right
    AF[0] >>= 1;
    //setting bit 7 to the previous carry flag
    AF[0] |= (CFlag << 3);
    //resetting N and H and Zflags
    AF[1] &= 0b00010000;
}

function SLA(registerA, cycles) {
    clockTiming(cycles);
    //copying the seventh bit of registerA to carry flag
    AF[1] = (((registerA & 0b10000000) >> 3) | (AF[1] & 0b11100000));
    //resetting N and H and Z flags
    AF[1] &= 0b00010000;

    //shifting bits to the left
    registerA <<= 1;

    //if result of rotation is 0, set Z flag
    if (registerA === 0) {
        AF[1] |= 0b10000000;
    }
    return registerA;
}

function SLAToMemory(memoryLocation, cycles) {
    clockTiming(cycles);

    let registerA = readMemory(memoryLocation);

    //copying the seventh bit of registerA to carry flag
    AF[1] = (((registerA & 0b10000000) >> 3) | (AF[1] & 0b11100000));
    //resetting N and H and Z flags
    AF[1] &= 0b00010000;

    //shifting bits to the left
    registerA <<= 1;

    //if result of rotation is 0, set Z flag
    if (registerA === 0) {
        AF[1] |= 0b10000000;
    }

    writeInMemory(memoryLocation, registerA);
}

function SRA(registerA, cycles) {
    clockTiming(cycles);
    //copying the zeroth bit of registerA to carry flag
    AF[1] = (((registerA & 0b00000001) << 4) | (AF[1] & 0b11100000));

    //resetting N and H and Z flags
    AF[1] &= 0b00010000;

    registerA >>= 1;

    //copying the old MSB to the MSB position
    registerA |= ((registerA & 0b01000000) << 1);

    if (registerA === 0) {
        AF[1] |= 0b10000000;
    }
    return SRA;
}

function SRAToMemory(memoryLocation, cycles) {
    clockTiming(cycles);

    let registerA = readMemory(memoryLocation);

    //copying the zeroth bit of registerA to carry flag
    AF[1] = (((registerA & 0b00000001) << 4) | (AF[1] & 0b11100000));

    //resetting N and H and Z flags
    AF[1] &= 0b00010000;

    registerA >>= 1;

    //copying the old MSB to the MSB position
    registerA |= ((registerA & 0b01000000) << 1);

    if (registerA === 0) {
        AF[1] |= 0b10000000;
    }

    writeInMemory(memoryLocation, registerA);
}

function SRL(registerA, cycles) {
    clockTiming(cycles);
    //copying the zeroth bit of registerA to carry flag
    AF[1] = (((registerA & 0b00000001) << 4) | (AF[1] & 0b11100000));
    //resetting N and H and Z flags
    AF[1] &= 0b00010000;
    registerA >>= 1;
    if (registerA === 0) {
        AF[1] |= 0b10000000;
    }
    return registerA;
}

function SRLToMemory(memoryLocation, cycles) {
    let registerA = readMemory(memoryLocation);

    clockTiming(cycles);
    //copying the zeroth bit of registerA to carry flag
    AF[1] = (((registerA & 0b00000001) << 4) | (AF.F & 0b11100000));
    //resetting N and H and Z flags
    AF[1] &= 0b00010000;
    registerA >>= 1;
    if (registerA === 0) {
        AF[1] |= 0b10000000;
    }

    writeInMemory(memoryLocation, registerA);
}

function BIT(registerA, bit, cycles) {
    clockTiming(cycles);
    //getting the value of b, b is the position of the bit that needs to be tested, b = 0 - 7;

    //if the value of bit is 0, set Z flag
    if (!testBit(registerA, bit)) {
        AF[1] |= 0b10000000;
    }
    else {
        AF[1] &= 0b01110000;
    }

    //reset N flag and set H flag
    AF[1] &= 0b10110000;

    AF[1] |= 0b00100000;
}

function SET(registerA, bit, cycles) {
    clockTiming(cycles);
    //getting the value of b, b is the position of the bit that needs to be set, b = 0 - 7;

    registerA |= ((0b00000001) << bit);
    return registerA;
}

function SETToMemory(memoryLocation, bit, cycles) {
    clockTiming(cycles);
    //getting the value of b, b is the position of the bit that needs to be set, b = 0 - 7;

    let registerA = readMemory(memoryLocation);

    registerA |= ((0b00000001) << bit);

    writeInMemory(memoryLocation, registerA);
}

function RES(registerA, bit, cycles) {
    clockTiming(cycles);
    //getting the value of b, b is the position of the bit that needs to be reset, b = 0 - 7;

    registerA &= ~(1 << bit);
    return registerA;
}

function RESToMemory(memoryLocation, bit, cycles) {
    clockTiming(cycles);
    //getting the value of b, b is the position of the bit that needs to be reset, b = 0 - 7;

    let registerA = readMemory(memoryLocation);

    registerA &= ~(1 << bit);

    writeInMemory(memoryLocation, registerA);
}

function NZCondition() {

    if ((AF[1] & 0b10000000) === 0) {
        return true;
    }
    return false;
}

function ZCondition() {
    if ((AF[1] & 0b10000000) !== 0) {
        return true;
    }
    return false;
}

function NCCondition() {
    if ((AF[1] & 0b00010000) === 0) {
        return true;
    }
    return false;
}

function CCondition() {
    if ((AF[1] & 0b00010000) !== 0) {
        return true;
    }
    return false;
}

function JP(condition, cycles) {
    clockTiming(cycles);
    if (condition) {
        clockTiming(4);
        pc[0]++;
        let LowNibble = new Uint8Array([readMemory(pc[0])]);
        pc[0]++;
        let HighNibble = new Uint8Array([readMemory(pc[0])]);
        //printf("Going to adress %01hX%01hX, from adress %02hX \n", HighNibble, LowNibble, pc-2);
        pc[0] = ((LowNibble[0] & 0xFF) | (HighNibble[0] << 8)) & 0xFFFF;
        //decreasing pc counter because after the execution it will automatically increase and when the code jumps we cant increase.
        pc[0]--;
    }
    else {
        pc[0] += 2;
    }
}

function JR(condition, cycles) {
    clockTiming(cycles);
    //after debugging it seems that we need to increase pc before
    pc[0]++;
    if (condition) {
        clockTiming(4);
        let n = new Int8Array([memory[pc[0]]]);
        pc[0] += n[0];
        //don't need to decrease pc because its a relative jump;
    }
}

function CALL(condition, cycles) {
    clockTiming(cycles);
    if (condition) {
        //getting addres of next instruction
        sp[0]--;
        memory[sp[0]] = (((pc[0] + 3) >> 8) & 0xFF);
        sp[0]--;
        memory[sp[0]] = ((pc[0] + 3) & 0xFF);
        JP(true, 8);
    }
    else {
        pc[0] += 2;
    }
}

function RET(condition, cycles) {
    clockTiming(cycles);
    if (condition) {
        clockTiming(12);
        let LowNibble = new Uint8Array([readMemory(sp[0])]);
        sp[0]++;
        let HighNibble = new Uint8Array([readMemory(sp[0])]);
        sp[0]++;
        //printf("returning to adress %01hX%01hX, from adress %02hX\n", HighNibble, LowNibble, pc);
        pc[0] = (HighNibble[0] << 8);
        pc[0] |= (LowNibble[0] & 0xFF);
        //pc = ((LowNibble & 0xFF) | (HighNibble << 8)) & 0xFFFF;
        //decreasing pc because we already are in the next instruction
        pc[0]--;
    }
}

function RETI(cycles) {
    clockTiming(cycles);
    let LowNibble = new Uint8Array([readMemory(sp[0])]);
    sp[0]++;
    let HighNibble = new Uint8Array([readMemory(sp[0])]);
    sp[0]++;
    pc[0] = ((LowNibble[0] & 0xFF) | (HighNibble[1] << 8)) & 0xFFFF;
    //decreasing pc because we already are in the next instruction
    pc[0]--;
    masterInterrupt = true;
}

function PUSH(highByte, lowByte) {
    sp[0]--;
    writeInMemory(sp[0], highByte);
    sp[0]--;
    writeInMemory(sp[0], lowByte);
    clockTiming(16);
}

function PUSHAF() {
    sp[0]--;
    writeInMemory(sp[0], AF[0]);
    let flagByte = (AF[1] & 0b11110000);
    sp[0]--;
    writeInMemory(sp[0], flagByte);
    clockTiming(16);
}

function POP(highByte, lowByte) {
    let firstPop = new Uint8Array([readMemory(sp[0])]);
    sp[0]++;
    let secondPop = new Uint8Array([readMemory(sp[0])]);
    sp[0]++;
    clockTiming(12);
    let result = new Uint16Array([firstPop[0] | secondPop[0] << 8]);
    return result[0];
}

function POPAF() {
    let firstPop = readMemory(sp[0]);
    AF[1] = firstPop;
    AF[1] &= 0b11110000;
    sp[0]++;
    let secondPop = readMemory(sp[0]);
    AF[0] = secondPop;
    sp[0]++;
    clockTiming(12);
}
