
const genSize = (w = 350, d) =>
{
    const [height, margin] = [250, 35]
    const unitX = 750 / 10
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


const renders = () =>
{
    const root = document.getElementById('tetris')
    const SIZE = {
        H: 1225,
        W: 385,
        BLOCK: 35,
    }
    const d = Array(46).fill(35).map((e, i) => e * i)
    const size = genSize(385, d)
    const svg = genElement('svg', { height: [SIZE.H], width: [SIZE.W], fill: 'black', style: 'overflow:visible' })
    const group = genElement('g', { height: [SIZE.H], width: [SIZE.W], fill: 'black', style: 'overflow:visible' })
    let rect
    const g = genElement('g', { height: [SIZE.H], width: [SIZE.W], fill: 'black', style: 'overflow:visible' })

    for (let k = 0; k < 35; k++)
    {
        for (let i = 0; i < 11; i++)
        {

            rect = genElement('rect', { height: [SIZE.BLOCK], width: [SIZE.BLOCK], fill: 'grey', x: size.x(i), y: size.y(d[k]) })
            g.appendChild(rect)
        }

    }
    group.appendChild(g)

    svg.appendChild(group)
    root.appendChild(svg)


}

export { renders }