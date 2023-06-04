const translateFileName = 'lang.json'

async function getFile(fileName) {
    let response = await fetch(fileName)
    return await response.json()
}

// Change Language
let allLang = ['ru', 'en']
let select = document.querySelector('.change-lang')

select.addEventListener('change', changeURLtoLanguage)
changeLanguage()

function changeURLtoLanguage() {
    let lang = select.value
    location.href = window.location.pathname + '#' + lang
    location.reload()
}

//Change title
swithTopic()
window.addEventListener('resize', swithTopic)

function swithTopic() {
    const topic = document.querySelector('#topic-lng')
    const topic_min = document.querySelector('#topic_min-lng')
    if (this.window.innerWidth > 400) {
        topic.setAttribute('style', 'display: block')
        topic_min.setAttribute('style', 'display: none')
        return
    }
    topic.setAttribute('style', 'display: none')
    topic_min.setAttribute('style', 'display: block')
}

function changeLanguage(...noChangeArr) {
    try {
        let hash = window.location.hash
        hash = hash.slice(1)
        if (!allLang.includes(hash)) {
            throw new ReferenceError("Youre hash is't include to all lang pack ;(")
        }
        select.value = hash
        getFile(translateFileName).then(translateObject => {
            for (key in translateObject) {
                if (noChangeArr.includes(key)) continue
                let items = document.querySelectorAll('#' + key + '-lng')
                if (!items.length) continue
                for (let i = 0; i < items.length; i++) {
                    items[i].innerHTML = translateObject[key][hash]
                }
            }
            initCounterVariable()
        })
    } catch (error) {
        location.href = window.location.pathname + '#en'
        location.reload()
    }
}

function initCounterVariable() {
    startInaccuracyNeuronElement = inaccuracyNeuronElement()
    startInaccuracyNeuronElementText = inaccuracyNeuronElementText() + ' '
    startInaccuracyPElement = inaccuracyPElement()
    startInaccuracyPElementText = inaccuracyPElementText() + ' '
}

let startInaccuracyNeuronElement = inaccuracyNeuronElement()
let startInaccuracyNeuronElementText = inaccuracyNeuronElementText()

function inaccuracyNeuronElement() {
    return document.querySelector('.inaccuracy-neuron')
}
function inaccuracyNeuronElementText() {
    return inaccuracyNeuronElement().innerText
}

const colors = ['__blue', '__red', '__green', '__yellow']

// Neuron var
const a = 0.03,
    Xn = 20,
    Yn = 10,
    N = 3,
    P = 2,
    L = 0.5,
    R = 1,
    TableNeuron = document.querySelector('.neuronDemo')
let Ts = [],
    w = [],
    Results = []

const Start = document.querySelector('.Start'),
    Teach = document.querySelector('.Teach'),
    Again = document.querySelector('.Again')

writeBound(TableNeuron, Yn, Xn)

// Neuron hendlers
Start.onclick = () => begin(3)
Teach.onclick = () => teach(1000, 0.000001)
Again.onclick = () =>
    restart(
        TableNeuron,
        [startInaccuracyNeuronElement, startInaccuracyNeuronElementText],
        Ts,
        w,
        Results,
    ) && writeBound(TableNeuron, Yn, Xn)

// Neuron
function init(n) {
    for (let i = 0; i < n; i++) {
        w[i] = Math.random()
    }
}

function neuron(x, w) {
    let Y = 0
    for (let i = 0; i < w.length; i++) {
        Y += x[i] * w[i]
    }
    return 1 / (1 + Math.exp(-a * Y))
}

function teach(e = 1, n = 0.001) {
    const processSettingObject = {
        apdateElement: startInaccuracyNeuronElement,
        apdateElementText: startInaccuracyNeuronElementText,
        result: Results,
    }
    process(TableNeuron, 'neuron', true, processSettingObject)
    while (e > 0) {
        for (let i = 0; i < Ts.length; i++) {
            let b = Ts[i][2] - neuron([Ts[i][0], Ts[i][1], 1], w)
            for (let j = 0; j < N - 1; j++) {
                for (let l = 0; l <= 1; l++) {
                    w[j] += n * b * Ts[j][l]
                }
                w[N - 1] += n * b * 1
            }
        }
        e--
    }
    process(TableNeuron, 'neuron', null, {
        result: Results,
    })
}

function answer(o) {
    const left = Math.abs(L - o),
        right = Math.abs(R - o)
    if (left < right) return false
    return true
}

function mark(table, out, x, y) {
    const Table = table.querySelectorAll('.row')[y].children[x - 1].classList
    const tableClassList = table.classList
    switch (tableClassList[tableClassList.length - 1]) {
        case 'neuronDemo':
            if (out == false) {
                Table.toggle(colors[0])
            } else {
                Table.toggle(colors[2])
            }
            break
        case 'perceptronDemo':
            function condition(c1, c2) {
                if (out[x - 1] == x) {
                    Table.toggle(c1)
                } else {
                    Table.toggle(c2)
                }
            }
            if (x <= 10) {
                condition(colors[0], colors[1])
            } else {
                condition(colors[2], colors[3])
            }
            return !!out[x - 1]
    }
    return out
}

function begin(n) {
    writeBound(TableNeuron, Yn, Xn)
    init(n)
    cArr(Xn, Yn, Ts, 'neuron')
    shuffle(Ts)
    process(TableNeuron, 'neuron', true, {
        apdateElement: startInaccuracyNeuronElement,
        apdateElementText: startInaccuracyNeuronElementText,
        result: Results,
    })
}

// Perceptron var
const Nn = 9,
    Aa = 5,
    Ll = Xn,
    nN = 0.5,
    S = 200,
    limit = [5, 4],
    c = [
        [0, 1, 2, 3, 4, 3, 2, 4, 1],
        [1, 1, 1, 1, 1, 0, 0, 0, 0],
    ],
    TablePerceptron = document.querySelector('.perceptronDemo')

let Ass = [],
    ress = [],
    wW = [],
    Resultss = [],
    Tss = []

let startInaccuracyPElement = inaccuracyPElement()
let startInaccuracyPElementText = inaccuracyPElementText()

function inaccuracyPElement() {
    return document.querySelector('.inaccuracy-preceptron')
}
function inaccuracyPElementText() {
    return inaccuracyPElement().innerText
}

const StartPer = document.querySelector('.StartPerceptron'),
    TeachPer = document.querySelector('.TeachPerceptron'),
    AgainPer = document.querySelector('.AgainPerceptron')

writeBound(TablePerceptron, Yn, Xn)

// Perceptron hendlers
StartPer.onclick = () => beginPerceptron()
TeachPer.onclick = () => teachPerceptron(1, 0.02)
AgainPer.onclick = () =>
    restart(
        TablePerceptron,
        [startInaccuracyPElement, startInaccuracyPElementText],
        Tss,
        wW,
        Resultss,
        ress,
        Ass,
    ) && writeBound(TablePerceptron, Yn, Xn)

// Perceptron
function beginPerceptron() {
    writeBound(TablePerceptron, Yn, Xn)
    initPerceptron()
    cArr(Xn, Yn, Tss, 'perceptron')
    shuffle(Tss)
    process(TablePerceptron, 'perceptron', true, {
        apdateElement: startInaccuracyPElement,
        apdateElementText: startInaccuracyPElementText,
        result: Resultss,
    })
}

function initPerceptron() {
    for (let i = 0; i < Ll; i++) {
        wW.push(new Array(Aa).fill(0))
    }
}

function binary(x, y) {
    let s = '',
        B = [x.toString(2), y.toString(2)]
    for (let i = 0; i < B.length; i++) {
        for (let j = 0, n = limit[i] - B[i].length; j < n; j++) {
            s += '0'
        }
        s += B[i]
    }
    return s
}

function fillArrayXElements(x, y) {
    let X = [],
        string = binary(x, y)
    for (let i = 0; i < Nn; i++) {
        X[i] = parseInt(string[i])
    }
    return X
}

function perceptron(x, w) {
    Ass = new Array(Aa).fill(0)
    ress = new Array(Ll).fill(0)
    let input = fillArrayXElements(x[0], x[1])
    for (let i = 0; i < Nn; i++) {
        Ass[c[0][i]] += input[i] * c[1][i]
    }
    for (let i = 0; i < Ll; i++) {
        let s = 0
        for (let j = 0; j < Aa; j++) {
            s += w[i][j] * Ass[j]
        }
        if (s >= x[0]) ress[i] = x[0]
        else ress[i] = 0
    }
    return ress
}

function teachPerceptron(m = 1, d = 0.1) {
    const processSettingObject = {
        apdateElement: startInaccuracyPElement,
        apdateElementText: startInaccuracyPElementText,
        result: Resultss,
    }
    process(TablePerceptron, 'perceptron', true, processSettingObject, 'pinpoint')
    while (m > 0) {
        for (let i = 0; i < S; i++) {
            let x = Tss[i][0],
                y = Tss[i][1],
                per = perceptron([x, y], wW)
            for (let j = 0; j < Ll; j++) {
                if (j + 1 == x) {
                    let b = x - per[j]
                    for (let k = 0; k < Aa; k++) {
                        wW[j][k] += b * d * Ass[k]
                    }
                }
            }
        }
        m--
    }
    process(TablePerceptron, 'perceptron', true, processSettingObject, 'pinpoint')
}

// General func
function shuffle(b) {
    for (let i = b.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1))
        ;[b[i], b[j]] = [b[j], b[i]]
    }
}

function restart(table, inaccuracyArr, ...cleaningArr) {
    for (let i = 0; i < cleaningArr.length; i++) cleaningArr[i].length = 0
    const Table = table.querySelectorAll('.row')
    let [inaccurancyItem, inaccurancyItemText] = inaccuracyArr
    inaccurancyItem.innerHTML = inaccurancyItemText
    for (let x = 0; x < Xn; x++) {
        for (let y = 1; y <= Yn; y++) {
            Table[y].children[x].removeAttribute('class')
            Table[y].children[x].setAttribute('class', 'row-cell')
        }
    }
    return 1
}

function cArr(x, y, arr, answer) {
    for (let i = 0; i <= x; i++) {
        for (let j = 0; j < y; j++) {
            switch (answer) {
                case 'neuron':
                    arr.push([j, i, i <= Xn / P ? L : R])
                    break
                case 'perceptron':
                    arr.push([i, j])
                    break
                default:
                    return 1
            }
        }
    }
}

function process(Table, essence, update = null, updateArgs = {}, mode = null) {
    let i = 0
    for (let y = 1; y <= Yn; y++) {
        for (let x = 1; x <= Xn; x++) {
            let func
            switch (essence) {
                case 'neuron':
                    func = answer(neuron([x, y, 1], w))
                    break
                case 'perceptron':
                    func = perceptron([x, y], wW)
                    break
                default:
                    return 1
            }
            if (updateArgs?.result) updateArgs.result[i++] = mark(Table, func, x, y)
        }
    }
    if (update != null && typeof updateArgs == 'object' && updateArgs != null) {
        updateInaccurancy(
            updateArgs.apdateElement,
            updateArgs.apdateElementText,
            updateArgs.result,
            mode,
        )
    }
}

function updateInaccurancy(apdateElement, apdateElementText, result, mode) {
    const calculateResult = calculateInaccuracy(result, Xn, Yn, mode)
    apdateElement.innerHTML = apdateElementText + calculateResult + '%'
}

function calculateInaccuracy(resultsArray, Xn, Yn, mode) {
    let count_left = 0,
        count_right = 0
    let x = 0,
        n = Xn

    if (mode === 'pinpoint') {
        let side = false
        for (let i = 0; i < resultsArray.length; i++) {
            if (i % 10 === 0) {
                side = !side
            }
            if (!side) {
                resultsArray[i] && count_right++
                continue
            }
            resultsArray[i] && count_left++
        }
        return Math.round(100 - (count_left + count_right) / 2)
    }

    for (let y = 0; y < Yn; y++) {
        let l_max = n - (Yn + 1),
            r_min = n - Yn
        while (l_max != x) {
            if (resultsArray[l_max]) {
                count_left += 1
            } else break
            l_max -= 1
        }
        while (r_min <= n) {
            if (resultsArray[r_min]) {
                count_right += n - r_min
                break
            }
            r_min += 1
        }
        x = n
        n += Xn
    }

    if (100 - count_right > count_left) {
        return (
            Math.round(
                ((Xn * Yn - (count_right + count_left)) / (Xn * Yn)) * 100 * 100,
            ) / 100
        )
    }
    return (
        Math.round(((count_left + (100 - count_right)) / (Xn * Yn)) * 100 * 100) / 100
    )
}

function writeBound(Table, Y, X) {
    for (let i = 1; i <= Y; i++) {
        mark(Table, false, X / 2, i)
        mark(Table, true, X / 2 + 1, i)
    }
}
