// <====== Section of constants ======>
const gameField = document.querySelector('.gameField');

const gameBlocks = [];
for (let i = 1; i <= 16; i++) {
  let div = document.createElement('div');
  gameField.append(div);
  if (i !== 16) {
    div.textContent = `${i}`;
    div.className = 'gameBlock';
  } else {
    div.textContent = '';
    div.className = 'gameBlock emptyBlock';
  }
  div.dataset.value = i;
  gameBlocks.push(div);
}

const restartBtn = document.querySelector('#restartBtn');
const movesCounter = document.querySelector('#movesCounter');
const fieldCover = document.querySelector('#cover');

const emojiList = ['🥳', '🔥', '🎆', '🎉', '🏆'];

const allCoordinates = [];
for (let y = 0; y <= 3; y++) {
  for (let x = 0; x <= 3; x++) {
    allCoordinates.push([x * 100, y * 100]);
  }
}

const activeStatePropsObj = {
  '100 / 0': 'left',
  '-100 / 0': 'right',
  '0 / 100': 'up',
  '0 / -100': 'down',
};
// <====== Section of constants ======>

// <====== Section of functions ======>
function activeBlocksCheck(blocks, propsObj) {
  // Currrent coordinates of empty block
  let emptyXY = blocks[15].style.transform
    .match(/\d+(?=%)/gi)
    .map((el) => Number(el));

  blocks.forEach((el) => {
    let currentXY = el.style.transform
      .match(/\d+(?=%)/gi)
      .map((item) => Number(item));

    let mark = `${currentXY[0] - emptyXY[0]} / ${currentXY[1] - emptyXY[1]}`;

    if (propsObj[mark] !== undefined) {
      el.dataset.allowedDirection = propsObj[mark];
      el.classList.add('active');
    } else {
      el.dataset.allowedDirection = 'none';
      el.classList.remove('active');
    }
  });
}

function unsolvableCheck(blocks) {
  let valueChain = [];
  blocks.forEach(
    (el) => (valueChain[el.dataset.position - 1] = Number(el.textContent))
  );

  let sumOfNi = 0;
  for (let i = 0; i < valueChain.length - 1; i++) {
    let tempArr = valueChain.slice(i + 1, -1);
    sumOfNi += tempArr.reduce(
      (sum, current) => (current < valueChain[i] ? sum + 1 : sum),
      0
    );
  }

  let estimationN = sumOfNi + 4; // if it's odd - it's unsolvable!

  // To avoid unsolvable state we swap any two blocks
  if (estimationN % 2 !== 0) {
    [blocks[0].style.transform, blocks[1].style.transform] = [
      blocks[1].style.transform,
      blocks[0].style.transform,
    ];
    [blocks[0].dataset.position, blocks[1].dataset.position] = [
      blocks[1].dataset.position,
      blocks[0].dataset.position,
    ];
  }
}

function winCheck(blocks, allEmojis) {
  let isWin = blocks.reduce(
    (result, el) => result && el.dataset.position === el.dataset.value,
    true
  );

  if (isWin) {
    blocks.forEach((el) => el.classList.remove('active'));
    let emoji = allEmojis[Math.round(Math.random() * (allEmojis.length - 1))];
    fieldCover.textContent = `${emoji} WIN ${emoji}`;
    fieldCover.style.cssText = 'opacity: 1; z-index: +1;';
  }
}

function gameInitialization(blocks, counter, cover) {
  counter.textContent = 0;
  cover.style.cssText = 'opacity: 0; z-index: -1;';

  // Random shuffle
  let randomNumbers = new Set();
  while (randomNumbers.size < 15) {
    randomNumbers.add(Math.round(Math.random() * 14));
  }
  let randomNumArray = [...randomNumbers, 15]; // for fixed position of empty block

  for (let i = 0; i < randomNumArray.length; i++) {
    // Placement of random game blocks to ordered X and Y coordinates
    blocks[
      randomNumArray[i]
    ].style.transform = `translate3d(${allCoordinates[i][0]}%, ${allCoordinates[i][1]}%, 0)`;
    // Set values of relative position
    blocks[randomNumArray[i]].dataset.position = i + 1;
  }
}
// <====== Section of functions ======>

// <====== Main code ======>
gameInitialization(gameBlocks, movesCounter, fieldCover);
unsolvableCheck(gameBlocks);
activeBlocksCheck(gameBlocks, activeStatePropsObj);
winCheck(gameBlocks, emojiList);
// <====== Main code ======>

// <====== User interaction events ===>
restartBtn.onclick = () => {
  winEmoji = emojiList[Math.round(Math.random() * 4)];
  gameInitialization(gameBlocks, movesCounter, fieldCover);
  unsolvableCheck(gameBlocks);
  activeBlocksCheck(gameBlocks, activeStatePropsObj);
  winCheck(gameBlocks, emojiList);
};

gameField.addEventListener('click', (event) => {
  let node = event.target.closest('.active');
  if (node) {
    [node.style.transform, gameBlocks[15].style.transform] = [
      gameBlocks[15].style.transform,
      node.style.transform,
    ];
    [node.dataset.position, gameBlocks[15].dataset.position] = [
      gameBlocks[15].dataset.position,
      node.dataset.position,
    ];

    ++movesCounter.textContent;
    activeBlocksCheck(gameBlocks, activeStatePropsObj);
    winCheck(gameBlocks, emojiList);
  }
});

window.addEventListener('keydown', (event) => {
  let direction = event.key.toLowerCase().split('arrow')[1];

  let [node] = gameBlocks.filter((el) =>
    el.dataset.allowedDirection === direction ? el : false
  );

  if (node) {
    [node.style.transform, gameBlocks[15].style.transform] = [
      gameBlocks[15].style.transform,
      node.style.transform,
    ];
    [node.dataset.position, gameBlocks[15].dataset.position] = [
      gameBlocks[15].dataset.position,
      node.dataset.position,
    ];

    ++movesCounter.textContent;
    activeBlocksCheck(gameBlocks, activeStatePropsObj);
    winCheck(gameBlocks, emojiList);
  }
});
// <====== User interaction events ===>
