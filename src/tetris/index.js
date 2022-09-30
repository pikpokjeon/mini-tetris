import { Popo } from "popo-dom"
import {tetronomi, initData} from "./initData.js"

const SVG = Popo.element( 'svg' )

const svgRoot = SVG( 'svg' )
const rect = SVG( 'rect' )
const group = SVG('g')


const genSize = ( w = 350, d ) =>
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

const Store = (initData,initSubs) => {
    let innnerState = Object.assign({}, initData)
    let innerSubs = {}
    if(initSubs) innerSubs = initSubs

    const Publish = (topic, obj) => {
        for (const [k, v] of Object.entries(obj)) {
            Reflect.set(innnerState[topic], k, v)
        }
        Ack(topic)
    }
    const Use = topic => Object.assign({}, innnerState[topic])

    const Subscribe = ( topic, sub ) =>
    {
        if ( !innerSubs[topic] ) innerSubs[topic] = []
        innerSubs[topic].push( sub )
        Ack(topic)
    }

    const Ack = topic => innerSubs[topic].forEach(sub => sub({state:innnerState[topic], store:Store(innnerState,innerSubs)}))
    console.log(innnerState,innerSubs)

    return { Publish, Use , Subscribe}
}

const renders = () =>
{
    
    const logging = ( {state, store} ) =>
    {
        console.log( state,store )
    }

    const store = Store( {...initData} )
    store.Subscribe('currentBlock',logging)
    const root = document.getElementById('tetris')
    const SIZE = {
        H: 900,
        W: 385,
        BLOCK: 35,
    }
    const current = [35, 6]
    const d = Array(46).fill(35).map((e, i) => e * i)
    const size = genSize(385, d)

    // const background = () 

    const rectGroup = group()

    for (let k = 35; k > -1; k--) {
        for (let i = 0; i <= 11; i++) {
            rectGroup.appendChild(rect( { id: `${k}-${i}`, height: [SIZE.BLOCK], width: [SIZE.BLOCK], fill: 'grey', x: size.x(i), y: size.y(d[k]) }) )
        }

    }
    // group.appendChild(g)
    // svg.appendChild(group)
    const svgTree = svgRoot({ height: [SIZE.H], width: [SIZE.W], style: 'overflow:visible' },[group([rectGroup])])
    root.appendChild(svgTree)

    addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowUp':
                rotate(store)
                setBlockToDrop({ store })
                console.log('up')
                break
            case 'ArrowLeft':
                console.log('left')
                moveToSide(store, -1)
                render(store)
                break

            case 'ArrowRight':
                console.log('right')
                moveToSide(store, 1)
                render(store)

                break

            case 'ArrowDown':
                console.log('down')
                break

        }
    })

// TODO : 로직 변경 해야함 28.9.2022

    const rotate = (store) => {
        const { block } = store.Use('currentBlock')
        const cur = tetronomi[block]
        const newP = []
        if (cur) {
            cur.forEach(([y, x]) => {
                const [nY, nX] = [x * -1, y]
                newP.push([nY, nX])
            })
        }
        // tetronomi[block] = newP
        store.Publish('currentBlock', { shape: newP })
        console.log(shape)
        return newP
    }

    const moveToSide = (store, i) => {
        const { block, h } = store.Use('currentBlock')
        const cur = tetronomi[block]
        const newP = []
        if (cur) {
            cur.forEach(([y, x]) => {
                const [nY, nX] = [y, x + i]
                newP.push([nY, nX])
            })
        }
        // tetronomi[block] = newP
        store.Publish('currentBlock', { shape: newP,h: h + i  })
        // store.Publish('currentBlock', { h: h + i })

        return newP
    }

    const initBlockColor = async ({ el, v, i, store }) => new Promise(res => {

        return setTimeout(() => {
            if (v > 1) {
                el.setAttribute('fill', 'gray')
                res({ i, isDropped: false })
            }
            if (v <= 1) {
                const { block } = store.Use('currentBlock')
                store.Publish('currentBlock', { block: block + 1,cur: tetronomi[block] ,v: 35, h: 6 })
                // store.Publish('currentBlock', { cur: tetronomi[block] })
                // store.Publish('currentBlock', { v: 35 })
                // store.Publish('currentBlock', { h: 6 })
                setBlockToDrop({ store })
            }
        }, 270)
    })

    const setBlockColor = async (el, v, i, store) => new Promise(res => {
        return setTimeout(() => {
            el.setAttribute('fill', 'red')
            res({ el, v, i, store })
        }, 100000 / (10 * (35 / (35 - v))))
    })


    const drop = ({ v, h, y, x, i, store, rotate }) => {
        const [mY, mX] = [v + y, h + x]
        const el = document.getElementById(`${mY}-${mX}`)
        setBlockColor(el, v, i, store).then(initBlockColor)
        if (v === 1) return true
        store.Publish('currentBlock', { v: v - 1 })
        return drop({ v: v - 1, h, y, x, i, store, rotate })
    }

    const nemo = (y, x) => {
        const el = document.getElementById(`${y}-${x}`)
        return ({
            turn: isOn=> isOn ? el.setAttribute('fill', 'red') : 
            el.setAttribute('fill', 'gray')
        })
    }


    const setBlockToDrop = ({ store, rotate }) => {
        let { v, h, block, cur } = store.Use('currentBlock')
        const blockQue = [tetronomi[0], tetronomi[1]]
        cur.forEach(b => {
            drop({ v, h, y: b[0], x: b[1], i: block, store, rotate })
        })

    }
    const { block } = store.Use('currentBlock')
    store.Publish('currentBlock', { shape: tetronomi[block] })
    const clock = (store,time) => new Promise(res=>{
        let { v, h, block, shape } = store.Use('currentBlock')

        if(time < 1) {
            store.Publish('currentBlock',{cur:tetronomi[block+1],block:block + 1})
            clock(store,35)
            return 
        }else{
           
        return setTimeout(() => {
            console.log(time)
            store.Publish( 'currentBlock', {v: time - 1} )
            if ( h > 8 )
            {
                store.Publish('currentBlock', {shape: tetronomi[Math.floor(Math.random())] })
            }
            render( store, false)
            shape.forEach(([y,x])=>{
                nemo(v+y,h+x).turn(false)
            })
            clock(store,time-1)

        }, 100)
    }
        
    } )
    // TODO : 로직 변경 해야함 28.9.2022
    
    const render = async (store, rotate) => {
        let { v, h, block, shape } = store.Use('currentBlock')
        // setBlockToDrop({store,rotate })
        // return render({i:i+1})
        let {  flag } = store.Use('currentBlock')
            shape.forEach(([y,x])=>{
                nemo(v+y,h+x).turn(true)
            })
    }
    render(store, false)
    clock(store,35)

}

export { renders }