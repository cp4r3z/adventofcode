/**
 * https://adventofcode.com/2018/day/4
 */

const fs = require('fs');

const input = 'input.txt';
const file = fs.readFileSync(input, 'utf8');
const lines = file.split('\n');
const sortedEntries = lines
    .map(entryObject)
    .sort(sortByTime);

const minutesAsleep = entriesToMinutes(sortedEntries);

const sleepiestGuard = getSleepiestGuard(minutesAsleep);
console.log(`Sleepiest Guard: ${sleepiestGuard.guardId}`);

const sleepiestMinute = getSleepiestMinute(sleepiestGuard.guardId, minutesAsleep);
console.log(`Sleepiest Minute: ${sleepiestMinute.minute}`);

// Answer
console.log(`Answer: ${parseInt(sleepiestGuard.guardId,10)*parseInt(sleepiestMinute.minute,10)}`);

//sortedEntries.forEach(line => console.log(`${line.time.timestamp} ${line.event}`));

function entryObject(entry) {
    const timestamp = entry.substring(1, 17);
    const year = timestamp.substring(0, 4);
    const month = timestamp.substring(5, 7);
    const day = timestamp.substring(8, 10);
    const hour = timestamp.substring(11, 13);
    const minute = timestamp.substring(14, 16);

    const event = entry.substring(19);
    //console.log(event);

    return {
        time: {
            timestamp,
            decimal: parseInt(year + month + day + hour + minute, 10),
            year: parseInt(year, 10),
            month: parseInt(month, 10),
            day: parseInt(day, 10),
            hour: parseInt(hour, 10),
            minute: parseInt(minute, 10)
        },
        event,
    };
}

// Sort by time
function sortByTime(A, B) {
    return A.time.decimal - B.time.decimal;
}

// Assign Guard
function assignGuard(currentValue, index, array) {
    // Guard #10 begins shift
    // falls asleep
    // wakes up
    let guardId = null;
    const reGuard = /^Guard #(\d+)/g;
    let i = index;
    while (guardId === null) {
        const str = array[i].event;
        const result = reGuard.exec(str);
        if (result !== null) {
            guardId = result[1];
        }
        else i--;
    }
    currentValue.guardId = guardId;
    return currentValue;
    // var found = paragraph.match(regex);
    //var regex1 = RegExp('foo*','g');

    // while ((array1 = regex1.exec(str1)) !== null) {
    //   console.log(`Found ${array1[0]}. Next starts at ${regex1.lastIndex}.`);
    // expected output: "Found foo. Next starts at 9."
    // expected output: "Found foo. Next starts at 19."
}

function entriesToMinutes(_sortedEntries) {
    const reGuard = /Guard #(\d+)/;
    const reSleepStart = /falls/;
    const reSleepEnd = /wakes/;

    let minutesArray = [];
    let guardId = null;
    let timeStart = null;
    for (let entry of _sortedEntries) {
        let result = null;
        result = reGuard.exec(entry.event);
        if (result !== null) {
            guardId = result[1];
        }
        else {
            let result1 = null;
            result1 = reSleepStart.exec(entry.event);
            if (result1 !== null) {
                timeStart = entry.time;
            }
            else {
                //result = reSleepEnd.exec(entry.event); // why does this only work once?
                if (true) {
                    const timeEnd = entry.time;
                    for (let decimal = timeStart.decimal; decimal < timeEnd.decimal; decimal++) {
                        minutesArray.push({
                            guardId,
                            decimal,
                            //minute: parseInt(decimal.toString().substring(decimal.toString().length - 2), 10)
                            minute: decimal.toString().substring(decimal.toString().length - 2)
                        });
                    }
                }
            }
        }
    }
    return minutesArray;
}

function getSleepiestGuard(_minutesArray) {
    //const guardSleepCount = _minutesArray.reduce(countMinutesGuardsSleep);
    let guardSleepCount = [];
    _minutesArray.forEach(countMinutesGuardsSleep);

    let sleepiestGuard = { guardId: null, sleep: null };

    for (let guardId in guardSleepCount) {
        if (guardSleepCount[guardId] > sleepiestGuard.sleep) {
            sleepiestGuard = { guardId: guardId, sleep: guardSleepCount[guardId] };
        }
    }

    function countMinutesGuardsSleep(curMinute) {
        if (curMinute.guardId in guardSleepCount) {
            guardSleepCount[curMinute.guardId]++;
        }
        else {
            guardSleepCount[curMinute.guardId] = 1;
        }
    }
    return sleepiestGuard;
}

function getSleepiestMinute(_guardId, _minutesArray) {
    const guardMinutesArray = _minutesArray.filter(cur => cur.guardId == _guardId);

    let minutesOfMinutes = [];
    guardMinutesArray.forEach(countMinutesSleep);

    let sleepiestMinute = { minute: null, minutes: null };

    for (let minute in minutesOfMinutes) {
        if (minutesOfMinutes[minute] > sleepiestMinute.minutes) {
            sleepiestMinute = { minute: minute, minutes: minutesOfMinutes[minute] };
        }
    }

    function countMinutesSleep(curMinute) {
        if (curMinute.minute in minutesOfMinutes) {
            minutesOfMinutes[curMinute.minute]++;
        }
        else {
            minutesOfMinutes[curMinute.minute] = 1;
        }
    }
    return sleepiestMinute;
}
