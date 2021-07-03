
const COUNT = 81
const LIMIT = 11
let board = []
const isBorder = i => (i) % 4 === 0
const border = Array(LIMIT).fill('.')
let c = -1
let fix = -1
let ss = -1
let idx = -1
const line = (count) => Array(LIMIT).fill(count).map((arr, i) =>
{
    console.log(count, arr, i, c, fix, ss)

    if ((i + 1) % 4 === 0)
    {
        ss += 1
        return '.'
    }
    else
    {
        idx = i
        // return board?.count?.i ?? idx
        return i

    }

})
for (let i = 1; i < 12; i++)
{
    if (i === LIMIT) c -= i
    else c += i
    if (isBorder(i))
    {
        ss += 1

        board.push(border)
    }
    else board.push(line(c))

}



console.table(board)

const render = () =>
{
    const root = document.getElementById('sudoku')
    const createElement = tag => document.createElement(tag)
    const div = createElement('div')
    div.setAttribute('id', 'block')
    board.forEach((e) =>
    {
        const span = createElement('span')

        span.innerText = e
        div.appendChild(span)
        root.appendChild(div)

    })
}

// render()
// console.table(board)

export { render }