const sc = require('./scalableCollection.mjs');

module.exports = function (state) {
    /**
    /**
     * state: {
     *      intCodes, // Mandatory
     *      position,
     *      phase
     * }
     */

    let intCodes = sc(state.intCodes);
    let position = state.position || 0;
    let phase = state.phase || false;
    let baseShift = 0;
    let intList;

    function parseParameter(param) {
        /**
         * ABCDE
         *  1002
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

    function parseMode(mode, intListIndex) {
        switch (mode) {
            case 0:
                // Position
                return intCodes.get(intList[intListIndex]);
            case 1:
                // Immediate
                return intList[intListIndex];
            case 2:
                // Relative
                return intCodes.get(intList[intListIndex] + baseShift);
            default:
                console.error(`Error: Unknown mode: ${mode} @ ${intListIndex}`);
                return false;
        }
    }

    function run(inputPhase, inputSignal) {
        let output = false;
        let halt = false;
        do {
            let posIncrement = 4;
            intList = intCodes.sliceToArray(position, position + 5);
            const codeAndMode = parseParameter(intList[0]);

            let p1 = parseMode(codeAndMode.p1Mode, 1);
            let p2 = parseMode(codeAndMode.p2Mode, 2);
            let p3 = parseMode(codeAndMode.p3Mode, 3);

            let jumped = false;
            let intCodeIndex;

            switch (codeAndMode.opcode) {
                case 1:
                    // Addition
                    intCodeIndex = intList[3] + (codeAndMode.p3Mode == 2 ? baseShift : 0);
                    intCodes.set(intCodeIndex, p1 + p2);
                    break;
                case 2:
                    // Multiplication
                    intCodeIndex = intList[3] + (codeAndMode.p3Mode == 2 ? baseShift : 0);
                    intCodes.set(intCodeIndex, p1 * p2);
                    break;
                case 3:
                    // Input (Store at Position)
                    intCodeIndex = intList[1] + (codeAndMode.p1Mode == 2 ? baseShift : 0);
                    if (phase === false) {
                        phase = inputPhase;
                        intCodes.set(intCodeIndex, inputPhase);
                    } else {
                        intCodes.set(intCodeIndex, inputSignal);
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
                    intCodeIndex = intList[3] + (codeAndMode.p3Mode == 2 ? baseShift : 0);
                    intCodes.set(intCodeIndex, p1 < p2 ? 1 : 0);
                    break;
                case 8:
                    // Equals
                    intCodeIndex = intList[3] + (codeAndMode.p3Mode == 2 ? baseShift : 0);
                    intCodes.set(intCodeIndex, p1 === p2 ? 1 : 0);
                    break;
                case 9:
                    /**
                    * Opcode 9 adjusts the relative base by the value of its only parameter.
                    * The relative base increases (or decreases, if the value is negative) by the value of the parameter
                    */
                    baseShift += p1;
                    posIncrement = 2;
                    break;
                case 99:
                    halt = true;
                    posIncrement = 1;
                    break;
                default:
                    console.error(`Error: Unknown opcode: ${codeAndMode.opcode}`);
            }

            if (!jumped) position = position + posIncrement;
        } while (intCodes.get(position) !== 99 && output === false && !halt);

        return output;
    }

    function getState() {
        return { intCodes: intCodes.dump(), position, phase };
    }

    // Reveal the following
    return { run, getState };
};