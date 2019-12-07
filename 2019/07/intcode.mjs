module.exports = {
    run(phaseSetting, inputSignal, arrInput) {
        let intCodes = [...arrInput];
        let pos = 0;
        let phaseSet = false;

        do {
            let posIncrement = 4;
            const intList = intCodes.slice(pos, pos + 5);
            const codeAndMode = parseParameter(intList[0]);
            const p1 = codeAndMode.p1Mode == 1 ? intList[1] : intCodes[intList[1]];
            const p2 = codeAndMode.p2Mode == 1 ? intList[2] : intCodes[intList[2]];
            const p3 = codeAndMode.p3Mode == 1 ? intList[3] : intCodes[intList[3]]; // Not needed?
            let jumped = false;

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
                    // Input (Store at Position)
                    if (!phaseSet){
                        intCodes[intList[1]] = phaseSetting;
                        phaseSet = true;        
                    } else {
                        intCodes[intList[1]] = inputSignal;
                    }
                    posIncrement = 2;
                    break;
                case 4:
                    // Output
                    //console.log(p1);
                    return p1;
                    //posIncrement = 2;
                    //break;
                case 5:
                    // Jump if True
                    if (p1 !== 0) {
                        pos = p2;
                        jumped = true;
                    }
                    posIncrement = 3;
                    break;
                case 6:
                    // Jump if False
                    if (p1 === 0) {
                        pos = p2;
                        jumped = true;
                    }
                    posIncrement = 3;
                case 7:
                    // Less Than
                    intCodes[intList[3]] = p1 < p2 ? 1 : 0;
                    break;
                case 8:
                    // Equals
                    intCodes[intList[3]] = p1 === p2 ? 1 : 0;
                    break;
                default:
                    console.error(`Error: Unknown opcode: ${codeAndMode.opcode}`);
            }

            if (!jumped) pos = pos + posIncrement;
        } while (intCodes[pos] !== 99 && pos <= intCodes.length);
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
    if (im.length <= 2) {
        return {
            opcode: param,
            p1Mode: 0, p2Mode: 0, p3Mode: 0
        }
    }
    while (im.length < 5) im.push(0);
    const opcode = parseInt([im[1], im[0]].join(''), 10);
    const C = im[2]; // mode of 1st parameter
    const B = im[3]; // mode of 2nd parameter
    const A = im[4]; // mode of 3rd parameter
    return {
        opcode,
        p1Mode: C,
        p2Mode: B,
        p3Mode: A,
    }
}