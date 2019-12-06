module.exports = {
    run(noun, verb, arrInput) {
        let intCodes = [...arrInput];
        //intCodes[1] = noun; // noun
        //intCodes[2] = verb;  // verb

        let pos = 0;
        let posOpCode = intCodes[pos];

        while (posOpCode !== 99 && pos <= intCodes.length) {
            //const intList = intCodes.slice(pos, pos + 4);
            const intList = intCodes.slice(pos, pos + 5);
            let posIncrement = 4;
            switch (intList[0]) {
                case 1:
                    // Addition
                    intCodes[intList[3]] = intCodes[intList[1]] + intCodes[intList[2]];
                    break;
                case 2:
                    // Multiplication
                    intCodes[intList[3]] = intCodes[intList[1]] * intCodes[intList[2]];
                    break;
                case 3:
                    // Save to Position
                    intCodes[intList[1]] = noun; //input
                    posIncrement = 2;
                    break;
                case 4:
                    console.log(intCodes[intList[1]]); // output
                    posIncrement = 2;
                    break;
                default:
                    const codeAndMode = parseParameter(intList[0]);
                    const p1 = codeAndMode.p1Mode == 1 ? intList[1] : intCodes[intList[1]];
                    const p2 = codeAndMode.p2Mode == 1 ? intList[2] : intCodes[intList[2]];
                    const p3 = codeAndMode.p3Mode == 1 ? intList[3] : intCodes[intList[3]];

                    // TODO: DRY - Consolidate this with the above statement
                    switch (codeAndMode.opcode) {
                        case 1:
                            // Addition
                            intCodes[intList[3]] = p1 + p2;
                            break;
                        case 2:
                            // Multiplication
                            intCodes[intList[3]] = p1 * p2;
                            break;
                        case 3:
                            // Save to Position
                            intCodes[intList[1]] = noun; // input
                            posIncrement = 2;
                            break;
                        case 4:
                            console.log(intList[1]); // output
                            posIncrement = 2;
                            break;
                        default:
                            console.error('opcode2: unknown opcode: ' + opcode);
                    }
            }
            pos = pos + posIncrement;
            posOpCode = intCodes[pos];
        }
        return intCodes[0];
    }
};

function parseParameter(param) {
    /**
     * ABCDE
     * 1002
     *
     * DE - two-digit opcode,      02 == opcode 2
     * C - mode of 1st parameter,  0 == position mode
     * B - mode of 2nd parameter,  1 == immediate mode
     * A - mode of 3rd parameter,  0 == position mode,
     *                                  omitted due to being a leading zero
     */

    const im = Array.from(String(param), Number).reverse();
    if (im.length == 4) im.push(0);
    if (im.length == 3) {
        im.push(0);
        im.push(0);
    }
    const opcode = parseInt([im[1], im[0]].join(''),10);
    const C = im[2]; // mode of 1st parameter
    const B = im[3]; // mode of 2nd parameter
    const A = im[4]; // mode of 3rd parameter
    return {
        opcode,
        p1Mode:C,
        p2Mode:B,
        p3Mode:A,
    }
}