/*
@title: aBeachDay
@author: Rikhav
@snapshot: beach1.png
*/
const width = 125;
const height = 125;

setDocDimensions(width, height);

const finalLines = [];

function drawSand() {
  const numDots = bt.randIntInRange(300,450);
  const sandDots = [];
  for (let i = 0; i < numDots; i++) {
    const x = bt.randIntInRange(0, width); 
    const y = bt.randIntInRange(0, height * 0.6); 
    sandDots.push([[x, y]]);
  }
  return sandDots;
}

function drawUniqueLines() {
  const uniqueLines = [];
  const numLines = bt.randIntInRange(6, 9); 
  const linesInMiddleRange = 2; 

  for (let i = 0; i < linesInMiddleRange; i++) {
    const line = [];
    const yStart = bt.randIntInRange(height * 0.3, height * 0.5); 
    const waveAmplitude = bt.randInRange(2, 5); 
    const waveFrequency = bt.randInRange(15, 25); 

    for (let x = 0; x <= width; x += 5) {
      const y =
        yStart +
        Math.sin((x / waveFrequency) * Math.PI) * waveAmplitude +
        bt.randInRange(-1, 1); 
      line.push([x, y]);
    }

    if (i === linesInMiddleRange - 1) {
      for (let j = 0; j < line.length; j++) {
        line[j][1] += height * 0.05; 
      }
    }

    uniqueLines.push(line);
  }

  for (let i = 0; i < numLines - linesInMiddleRange; i++) {
    const line = [];
    const yStart = bt.randIntInRange(0, height * 0.3); 
    const waveAmplitude = bt.randInRange(2, 5); 
    const waveFrequency = bt.randInRange(15, 25); 

    for (let x = 0; x <= width; x += 5) {
      const y =
        yStart +
        Math.sin((x / waveFrequency) * Math.PI) * waveAmplitude +
        bt.randInRange(-1, 1);
      line.push([x, y]);
    }
    uniqueLines.push(line);
  }

  return uniqueLines;
}

function addFilledSandDots() {
  const dots = [];
  const numDots = bt.randIntInRange(80, 140);
  const radius = 0.5; 
  for (let i = 0; i < numDots; i++) {
    const centerX = bt.randIntInRange(width, 0);
    const centerY = bt.randIntInRange(height * 0.5, height);
    const circle = [];

    for (let r = radius; r > 0; r -= 0.5) {
      const ring = [];
      for (let angle = 0; angle < 360; angle += 10) {
        const rad = (angle * Math.PI) / 180; 
        const x = centerX + r * Math.cos(rad);
        const y = centerY + r * Math.sin(rad);
        ring.push([x, y]);
      }
      circle.push(ring);
    }

    dots.push(...circle);
  }

  return dots;
}

function drawStarfish(centerX, centerY, armLength, armThickness) {
  const starfish = [];
  const center = [centerX, centerY];
  for (let i = 0; i < 5; i++) {
    const angle = (i * 2 * Math.PI) / 5;

    const tipX = centerX + Math.cos(angle) * armLength;
    const tipY = centerY + Math.sin(angle) * armLength;

    const baseLeftX = centerX + Math.cos(angle - 0.4) * armThickness;
    const baseLeftY = centerY + Math.sin(angle - 0.4) * armThickness;

    const baseRightX = centerX + Math.cos(angle + 0.4) * armThickness;
    const baseRightY = centerY + Math.sin(angle + 0.4) * armThickness;

    starfish.push([
      center,
      [baseLeftX, baseLeftY],
      [tipX, tipY],
      [baseRightX, baseRightY],
      center,
    ]);
  }
  return bt.merge(starfish);
}

function drawSeashell(centerX, centerY, size) {
  const seashell = [];
  const curve = [];

  for (let angle = 0; angle <= 180; angle += 10) {
    const rad = (angle * Math.PI) / 180;
    const x = centerX + Math.cos(rad) * size;
    const y = centerY + Math.sin(rad) * size;
    curve.push([x, y]);
  }

  curve.push([centerX - size, centerY]);
  curve.push([centerX + size, centerY]);

  const designLines = [];
  for (let angle = 90; angle <= 270; angle += 15) {
    const rad = (angle * Math.PI) / 180;
    const endX = centerX + Math.sin(rad) * size;
    const endY = centerY - Math.cos(rad) * size; 
    designLines.push([[centerX, centerY], [endX, endY]]);
  }

  seashell.push(curve, ...designLines);
  return seashell;
}

const sand = drawSand();
bt.join(finalLines, sand);

const uniqueLines = drawUniqueLines();
bt.join(finalLines, uniqueLines);

const filledDots = addFilledSandDots();
bt.join(finalLines, filledDots);

const starfishX = bt.randIntInRange(width * 0.2, width * 0.8);
const starfishY = bt.randIntInRange(height * 0.5, height * 0.9);
const starfish = drawStarfish(starfishX, starfishY, 25, 10);
bt.join(finalLines, starfish);

const seashellX = bt.randIntInRange(width * 0.2, width * 0.8);
const seashellY = bt.randIntInRange(height * 0.5, height * 0.8);
const seashell = drawSeashell(seashellX, seashellY, 15);
bt.join(finalLines, seashell);

bt.iteratePoints(finalLines, pt => {
  let [x, y] = pt;
  y += bt.noise([x * 0.1, y * 0.1]) * 0.5; 
  return [x, y];
});

drawLines(finalLines);
