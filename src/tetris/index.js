
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


    const blocks = type => (
        {
            1: [[0, 0], [0, -1], [0, 1], [1, 0]],
            2: [[0, 0]],
            3: [[0, 0]],
            4: [[0, 0]],
            5: [[0, 0]]
        })

    const altercolor = async (el, i) => new Promise((res) =>
    {
        return setTimeout(() =>
        {
            el.setAttribute('fill', 'red')
            res(el)

        }, (1000000) / (100 * ((i / (35 - i)))))
    })

    const drop = async (el, i) => await altercolor(el, i)

    const go = (i) => 
    {
        let currentPosition = [i, 6]
        const el = document.getElementById(`${i}-${currentPosition[1]}`)

        if (i === 1) return
        drop(el, i)
        return go(i - 1)
    }

    go(35)

}

export { renders }