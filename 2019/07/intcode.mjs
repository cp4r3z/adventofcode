module.exports = function (state) {
    /**
     * state: {
     *      intCodes, // Mandatory
     *      position,
     *      phase
     * }
     */

    let intCodes = [...state.intCodes];
    let position = state.position || 0;
    let phase = state.phase || false;

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
            };
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
        };
    }

    function run(inputPhase, inputSignal) {
        let output = false;
        let halt = false;
        do {
            let posIncrement = 4;
            const intList = intCodes.slice(position, position + 5);
            const codeAndMode = parseParameter(intList[0]);
            const p1 = codeAndMode.p1Mode == 1 ? intList[1] : intCodes[intList[1]];
            const p2 = codeAndMode.p2Mode == 1 ? intList[2] : intCodes[intList[2]];
            //const p3 = codeAndMode.p3Mode == 1 ? intList[3] : intCodes[intList[3]];
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
                    if (phase === false) {
                        phase = inputPhase;
                        intCodes[intList[1]] = inputPhase;
                    } else {
                        intCodes[intList[1]] = inputSignal;
                    }
                    posIncrement = 2;
                    break;
                case 4:
                    // Output
                    output = p1;
                    posIncrement = 2;
                    break;
                case 5:
                    // Jump if True
                    if (p1 !== 0) {
                        position = p2;
                        jumped = true;
                    }
                    posIncrement = 3;
                    break;
                case 6:
                    // Jump if False
                    if (p1 === 0) {
                        position = p2;
                        jumped = true;
                    }
                    posIncrement = 3;
                    break;
                case 7:
                    // Less Than
                    intCodes[intList[3]] = p1 < p2 ? 1 : 0;
                    break;
                case 8:
                    // Equals
                    intCodes[intList[3]] = p1 === p2 ? 1 : 0;
                    break;
                case 99:
                    halt = true;
                    posIncrement = 1;
                    break;
                default:
                    console.error(`Error: Unknown opcode: ${codeAndMode.opcode}`);
            }

            if (!jumped) position = position + posIncrement;
        } while (intCodes[position] !== 99 && position <= intCodes.length && output === false && !halt);

        return output;
    }

    function getState() {
        return { intCodes, position, phase };
    }

    // Reveal the following
    return { run, getState };
};