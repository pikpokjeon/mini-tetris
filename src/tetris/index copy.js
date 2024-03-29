
const genSize = (w = 350, d) =>
{
    const [height, margin] = [0, 35]
    const unitX = 750 / 11
    const gap = unitX / d.length
    const [maxData, minData] = [Math.max(...Array.from(d)), (Math.min(...Array.from(d)))]
    const MAX = Math.max(maxData, Math.abs(minData))
    const SUM = (maxData + Math.abs(minData))
    const unitY = (height) / MAX
    return {
        x: i => Math.floor(35 * i) + 1,
        y: v => margin + ((1250 - v)) + 36,
        idx: x => Math.floor((x - (w / d.length)) / (unitX))
    }
}
const genElement = (type, attr, animate) =>
{

    type = document.createElementNS('http://www.w3.org/2000/svg', type)

    for (const [t, v] of Object.entries(attr))
    {
        type.setAttributeNS(null, t, v)
    }

    return type
}

const Store = (initData) =>
{
    let innnerState = Object.assign({}, initData)

    const Publish = (topic, obj) =>
    {
        for (const [k, v] of Object.entries(obj))
        {
            Reflect.set(innnerState[topic], k, v)
        }
    }
    const Use = topic => Object.assign({}, innnerState[topic])

    console.log(innnerState)

    return { Publish, Use }
}

const initData = {
    'currentBlock': {
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
            type: -1,
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


const renders = () =>
{
    const store = Store({ ...initData })
    console.log(store)
    const root = document.getElementById('tetris')
    const SIZE = {
        H: 1225,
        W: 385,
        BLOCK: 35,
    }
    const current = [35, 6]
    const d = Array(46).fill(35).map((e, i) => e * i)
    const svg = genElement('svg', { height: [SIZE.H], width: [SIZE.W], fill: 'black', style: 'overflow:visible' })
    const group = genElement('g', { height: [SIZE.H], width: [SIZE.W], fill: 'black', style: 'overflow:visible' })
    const size = genSize(385, d)

    // const background = () 

    let rect
    const g = genElement('g', { height: [SIZE.H], width: [SIZE.W], fill: 'black', style: 'overflow:visible' })

    for (let k = 35; k > -1; k--)
    {
        for (let i = 0; i <= 11; i++)
        {

            rect = genElement('rect', { id: `${k}-${i}`, height: [SIZE.BLOCK], width: [SIZE.BLOCK], fill: 'grey', x: size.x(i), y: size.y(d[k]) })
            g.appendChild(rect)
        }

    }
    group.appendChild(g)
    svg.appendChild(group)
    root.appendChild(svg)

    const blocks =
    {
        1: [[0, 0], [0, -1], [0, 1], [1, 0]],  //이거 떨어져서 바닥에 앉게 했는데 코드 저장을 안했어여
        2: [[4, 4], [4, -2], [4, 4], [4, 4]],  //이거 떨어져서 바닥에 앉게 했는데 코드 저장을 안했어여
        // 2: [[0, 0]],
        // 3: [[0, 0]],
        // 4: [[0, 0]],
        // 5: [[0, 0]]
    }

    const altercolor = async (el, i, v) => new Promise((res) => setTimeout(() =>
    {
        el.setAttribute('fill', 'red')
        return res({ v, i })
    }, (1000000) / (100 * ((35 / (35 - i)))))
    )

    const resetColor = (n) => ({ v, i }) => new Promise((res) =>
    {
        const newEl = document.getElementById(`${i + 1 > 35 ? 35 : i + 1}-${v}`)
        newEl.setAttribute('fill', 'grey')//아


    })


    const bridge = (n) => (param) => resetColor(n)(param)


    const drop = (el, i, v) => new Promise((res) => res(altercolor(el, i, v)))

    const go = (i, v) => 
    {
        const el = document.getElementById(`${i}-${v}`)
        if (i === 1) return

        drop(el, i, v).then(bridge(i === 1 ? 0 : 1)) //블럭위 y개수

        return go(i - 1, v)
    }

    blocks[1].forEach(([y, x]) => go(35 + y, 6 + x))
    blocks[2].forEach(([y, x]) => go(35 + y, 6 + x))

}

export { renders }