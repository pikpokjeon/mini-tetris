  
//  tetronomieos piecies
const tetronomi =
{
    0: [[0, 0], [0, -1], [0, -2], [0, 1], [0, 2]],  
    1: [[0, 0], [0, -1], [0, 1], [1, -1]], 
    // 2: [[0, 0], [0, 1], [1, 1], [1, 0]],
    // 4: [[0, 0]],
    // 5: [[0, 0]]
}

// initial stoage for setting
const initData = {
    'currentBlock': {
        v: 35,
        h: 6,
        block: 0,
        shape: [],
        flag: true,
        position: {
            center: [],
            edge: { // x, y
                left: [],
                right: [],
                bottom: [],
            },
            gap: {
                left: {
                    left: [],
                    bottom: [],
                },
                right: {
                    right: [],
                    bottom: []
                },
                center: {
                    bottom: []
                },
            },
        },
        status: {
            type: 0,
            spin: -1,
            parts: [], //id
            index: [],
            color: -1,
        }
    },
    'play': {
        status: {
            level: -1,
            isDropped: false,
            readyDrop: true,
            isSpin: {
                spinToMove: {
                    direction: -1.
                }
            },
            round: -1,
            hit: -1,
            line: {
                stacked: -1,
                toRemove: -1,
                left: -1,
                toGetStacked: -1,
            },
        }
    }
}

export {tetronomi,initData}