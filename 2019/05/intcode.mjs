module.exports = {
    run(noun, verb, arrInput) {
        let intCodes = [...arrInput];
        intCodes[1] = noun; // noun
        intCodes[2] = verb;  // verb

        let pos = 0;
        let posOpCode = intCodes[pos];

        while (posOpCode !== 99 && pos <= intCodes.length) {
            const intList = intCodes.slice(pos, pos + 4);
            switch (intList[0]) {
                case 1:
                    // Addition
                    intCodes[intList[3]] = intCodes[intList[1]] + intCodes[intList[2]];
                    break;
                case 2:
                    //Multiplication
                    intCodes[intList[3]] = intCodes[intList[1]] * intCodes[intList[2]];
                    break;
                case 3:

                    console.log('todo')
                    break;
                case 4:
                    console.log('todo')
                    break;
                default:
                    console.error("Unknown Command");
            }
            pos = pos + 4;
            posOpCode = intCodes[pos];
        }
        return intCodes[0];
    }

};
