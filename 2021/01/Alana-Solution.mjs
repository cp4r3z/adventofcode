
import { multiLine } from '../../common/parser.mjs';

// Parse Input
let inputFilePath = new URL('./input.txt', import.meta.url);
const arrInput = multiLine.toIntArray(inputFilePath);
var BlueStocking=0 ;
const Teddybear = 1 ;
for (let index = 0; index < arrInput.length; index++) {
    const Santa=arrInput[index-1];
    const Elf = arrInput[index];
    const Reindeer=Elf>Santa; 
    //console.log(Reindeer);
    if(Reindeer) {
        BlueStocking = BlueStocking+Teddybear ;
        console.log("increased") ;
    }else{
        console.log("decreased") ;
    }
} 
console.log (BlueStocking) ;