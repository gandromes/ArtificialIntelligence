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
    getFile(translateFileName).then((translateObject) => {
      for (key in translateObject) {
        if (noChangeArr.includes(key)) continue
        let item = document.querySelector('#' + key + '-lng')
        if (item) item.innerHTML = translateObject[key][hash]
      }
    })
  } catch (error) {
    location.href = window.location.pathname + '#en'
    location.reload()
  }
}

// Neuron var
const w = [],
  a = 0.03,
  Xn = 20,
  Yn = 10,
  N = 3,
  P = 2,
  L = 0.5,
  R = 1
let buf = [],
  Ts = [],
  Results = []

const inaccuracyNeuronElement = document.querySelector('.inaccuracy-neuron')
const inaccuracyNeuronElementText = inaccuracyNeuronElement.innerText

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
  colors = [
    '__blue',
    '__red',
    '__green',
    '__yellow',
  ]

let Ass = [],
  ress = [],
  wW = [],
  Resultss = [],
  Tss = []

const inaccuracyPerceptronElement = document.querySelector(
  '.inaccuracy-preceptron'
)
const inaccuracyPerceptronElementText = inaccuracyNeuronElement.innerText

// Neuron hendlers
Start.onclick = () => begin(3)
Teach.onclick = () => teach(1000, 0.000001)
Restart.onclick = () => restart()

// Perceptron hendlers
StartPerceptron.onclick = () => beginPerceptron()
TeachPerceptron.onclick = () => teachPreceptron(1, 0.08)
RestartPerceptron.onclick = () =>
  processPerceptron(inaccuracyNeuronElement, inaccuracyNeuronElementText) // restartPerceptron()

// Perceptron

function beginPerceptron() {
  initPerceptron()
  cArrPerceptron(Xn, Yn)
  shuffle(Tss)
  processPerceptron()
}

function initPerceptron() {
  for (let i = 0; i < Ll; i++) {
    wW.push(new Array(Aa).fill(0))
  }
}

function cArrPerceptron(x, y) {
  for (let i = 0; i < x; i++) {
    for (let j = 0; j < y; j++) {
      Tss.push([i, j])
    }
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
      s += wW[i][j] * Ass[j]
    }
    if (s >= x[0]) ress[i] = x[0]
    else ress[i] = 0
  }
  return ress
}

function teachPreceptron(m = 1, d = 0.1) {
  processPerceptron()
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
  processPerceptron()
}

function processPerceptron() {
  let i = 0
  for (let y = 1; y <= Yn; y++) {
    for (let x = 1; x <= Xn; x++) {
      Resultss[i++] = mark(
        document.querySelector('.perceptronDemo'),
        perceptron([x, y], wW),
        x,
        y
      )
    }
  }
}

function restartPerceptron(table) {
  wW.length = 0
  Tss.length = 0
  Ass = []
  ress = []
  wW = []
  Resultss = []
  // inaccuracyNeuronElement.innerHTML = inaccuracyNeuronElementText
  const Table = table.querySelectorAll('.row')
  for (let x = 0; x <= Xn; x++) {
    for (let y = 1; y <= Yn; y++) {
      Table[y].children[x].removeAttribute('class')
      Table[y].children[x].setAttribute('class', 'row-cell')
    }
  }
  return
}

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
  process(inaccuracyNeuronElement, inaccuracyNeuronElementText)
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
  process(inaccuracyNeuronElement, inaccuracyNeuronElementText)
}

function cArr(x, y) {
  for (let i = 0; i < x; i++) {
    for (let j = 0; j < y; j++) {
      Ts.push([j, i, i <= Xn / P ? L : R])
    }
  }
}

function answer(o) {
  const left = Math.abs(L - o),
    right = Math.abs(R - o)
  if (left < right) return false
  return true
}

function mark(table, out, x, y) {
  const Table = table.querySelectorAll('.row')[y].children[x - 1].classList
  switch (table.className.split(' ').at(-1)) {
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
      break
  }
  return out
}

function process(apdateElement, ElementText) {
  let i = 0
  for (let y = 1; y <= Yn; y++) {
    for (let x = 1; x <= Xn; x++) {
      Results[i++] = mark(
        document.querySelector('.neuronDemo'),
        answer(neuron([x, y, 1], w)),
        x,
        y
      )
    }
  }
  const inaccurancy = calculateInaccuracy(Results)
  apdateElement.innerHTML = ElementText + inaccurancy + '%'
}

function restart() {
  w.length = 0
  Ts.length = 0
  const Table = document.querySelectorAll('.row')
  inaccuracyNeuronElement.innerHTML = inaccuracyNeuronElementText
  for (let x = 0; x < Xn; x++) {
    for (let y = 1; y <= Yn; y++) {
      Table[y].children[x].removeAttribute('class')
      Table[y].children[x].setAttribute('class', 'row-cell')
    }
  }
  writeBound()
  return
}

function begin(n) {
  writeBound()
  init(n)
  cArr(Xn, Yn)
  shuffle(Ts)
  process(inaccuracyNeuronElement, inaccuracyNeuronElementText)
}

function calculateInaccuracy(resultsArray) {
  let count_left = 0,
    count_right = 0
  let x = 0,
    n = 20
  for (let y = 0; y < Yn; y++) {
    let l_max = n - 11,
      r_min = n - 10
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
    n += 20
  }

  if (100 - count_right > count_left) {
    return (
      Math.round(((200 - (count_right + count_left)) / (Xn * Yn)) * 100 * 100) /
      100
    )
  }
  return (
    Math.round(((count_left + (100 - count_right)) / (Xn * Yn)) * 100 * 100) /
    100
  )
}

function writeBound() {
  for (let i = 1; i <= Yn; i++) {
    mark(document.querySelector('.neuronDemo'), false, 10, i)
    mark(document.querySelector('.neuronDemo'), true, 11, i)
  }
}
writeBound()

// General func

function shuffle(b) {
  for (let i = b.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))
    ;[b[i], b[j]] = [b[j], b[i]]
  }
}
