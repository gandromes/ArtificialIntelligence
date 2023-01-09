// Get json response
const translateFileName = "lang.json";

async function getFile(fileName) {
    let response = (await fetch(fileName));
    return await response.json();  
}

// Change Language
let allLang = ['ru', 'en'];
let select = document.querySelector(".change-lang");

select.addEventListener('change', changeURLtoLanguage)
changeLanguage();

function changeURLtoLanguage() {
  let lang = select.value;
  location.href = window.location.pathname + "#" + lang;
  location.reload();
}

function changeLanguage() {
  try {
    let hash = window.location.hash;
    hash = hash.slice(1);
    if (!allLang.includes(hash)) {
      throw new ReferenceError("Youre hash is't include to all lang pack ;(");
    }
    select.value = hash;
    getFile(translateFileName).then(translateObject => {
      for (key in translateObject) {
        let item = document.querySelector("#" + key + "-lng");
        if (item) item.innerHTML = translateObject[key][hash];
      }
    });  
  } catch (error) {
    location.href = window.location.pathname + "#en";
    location.reload();
  }
}

// Neuron

const w = [], a = 0.03;
const Xn = 20, Yn = 10, N = 3, P = 2, L = 0.5, R = 1;
let buf = [], Ts = [], Results = [];
const inaccuracyElement = document.querySelector(".inaccuracy-neuron");
const inaccuracyElementText = inaccuracyElement.innerText;

Start.onclick = () => begin(3);
// Show.onclick = () => process(inaccuracyElement, inaccuracyElementText);
Teach.onclick = () => teach(1000, 0.000001);
Restart.onclick = () => restart();

function init(n) {
  for (let i = 0; i < n; i++) {
    w[i] = Math.random();
  }
}

function neuron(x, w) {
  let Y = 0;
  for (let i = 0; i < w.length; i++) {
    Y += x[i] * w[i];
  }
  return (1 / (1 + Math.exp(-a*Y)));
}

function teach(e = 1, n = 0.001) {
  process(inaccuracyElement, inaccuracyElementText);
  while (e > 0) {
    for (let i = 0; i < Ts.length; i++) {
      let b = Ts[i][2] - neuron([Ts[i][0], Ts[i][1], 1], w);
      for (let j = 0; j < N - 1; j++) {
        for (let l = 0; l <= 1; l++) {
          w[j] += n * b * Ts[j][l];
        }
        w[N-1] += n * b * 1; 
      }
    }
    e--;
  }
  process(inaccuracyElement, inaccuracyElementText);
}

function cArr(x, y) {
  for (let i = 0; i < x; i++) {
    for (let j = 0; j < y; j++) {
      buf.push([j, i, (i <= Xn / P ? L : R)]); 
    }
  }
}

function shuffle(b) {
  for (let i = b.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  
  for (let a = 0; a < buf.length; a++) {
    Ts[a] = b[a];
  }
}

function answer(o) {
  const left = Math.abs(L - o), right = Math.abs(R - o);
  if (left < right) return false;
  return true;
}

function mark(out, x, y) {
  const Table = document.querySelectorAll('.row')[y].children[x-1].classList;
  if (out == false) {
    Table.toggle('__blue');
  } else { 
    Table.toggle('__green'); 
  }
  return out;
}

function process(apdateElement, ElementText) {
  let i = 0;
  for (let y = 1; y <= Yn;  y++) {
    for (let x = 1; x <= Xn; x++) {
      Results[i++] = mark(answer(neuron([x, y, 1], w)), x, y);
    }
  }
  const inaccurancy = calculateInaccuracy(Results);
  apdateElement.innerHTML = ElementText + inaccurancy + "%";
}

function restart() {
  w.length = 0;
  Ts.length = 0;
  buf.length = 0;
  inaccuracyElement.innerHTML = inaccuracyElementText;
  for (let x = 1; x < Xn; x++) {
    for (let y = 1; y <= Yn; y++) {
      const Table = document.querySelectorAll('.row')[y].children[x];
      Table.removeAttribute('class');
      Table.setAttribute('class', 'row-cell');
    }
  }
  return;
}

function begin(n) {
  init(n);
  cArr(Xn, Yn);
  shuffle(buf);
  process(inaccuracyElement, inaccuracyElementText);
}

function calculateInaccuracy(resultsArray) {
  let count_left = 0, count_right = 0;
  let x = 0, n = 20;
  for (let y = 0; y < Yn; y++) {
    let l_max = n - 11, r_min = n - 10;
    while (l_max != x) {
      if (resultsArray[l_max]) {
        count_left += 1;
      } else break;
      l_max -= 1;
    }
    while (r_min <= n) {
      if (resultsArray[r_min]) {
        count_right += n - r_min;
        break;
      }
      r_min += 1;
    }
    x = n;
    n += 20;
  }

  if ((100 - count_right) > count_left) {
    return Math.round((200 - (count_right + count_left)) / (Xn * Yn) * 100 * 100) / 100; 
  }
  return Math.round((((count_left + (100 - count_right)) / (Xn * Yn)) * 100) * 100) / 100;
}

function writeBound() {
  for (let i = 1; i <= Yn; i++) {
    mark(false, 10, i);
    mark(true, 11, i);
  }
}

writeBound()