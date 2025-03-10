// Arrays for small circles and the chain of collected circles
let smallCircles = [];
let chain = [];
let chainColor;

//CHANGES: set up octave (sounds array)
let toneOsc;
let freqs = [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // main circle
  chain.push({
    x: width / 2, 
    y: height / 2, 
    r: 30
  });
  
  chainColor = color(100, 100, 255);
  
  // create a random number of small circles between 10 and 15
  let numSmall = floor(random(10, 16));
  for (let i = 0; i < numSmall; i++) {
    smallCircles.push({
      x: random(width),
      y: random(height),
      col: color(random(255), random(255), random(255)),
      picked: false,
      r: 20
    });
  }
  
  // CHANGES: set up an oscillator for playing tones on collection
  toneOsc = new p5.Oscillator();
  toneOsc.setType('sine');
  toneOsc.amp(0);
  toneOsc.start();
}

function draw() {
  background(255);
  
  // main circle to follow the mouse
  chain[0].x = mouseX;
  chain[0].y = mouseY;

  // check collisions with small circles
  for (let sc of smallCircles) {
    if (!sc.picked) {
      fill(sc.col);
      ellipse(sc.x, sc.y, sc.r * 2);
      
      let d = dist(chain[0].x, chain[0].y, sc.x, sc.y);
      if (d < 60) {
        sc.picked = true;
        chainColor = sc.col;
        chain.push({
          x: sc.x,
          y: sc.y,
          r: sc.r
        }); // add collected circle to the chain
        
        // CHANGES: play a random tone when a circle is collected
        playRandomTone();
      }
    }
  }
  
  // lerps
  for (let i = 1; i < chain.length; i++) {
    let leader = chain[i - 1];
    let follower = chain[i];
    follower.x = lerp(follower.x, leader.x, 0.1);
    follower.y = lerp(follower.y, leader.y, 0.1);
  }
  
  // draw chain
  fill(chainColor);
  for (let c of chain) {
    ellipse(c.x, c.y, c.r * 2);
  }
}

//CHANGES: new function for random sound
function playRandomTone() {
  let freq = random(freqs);
  toneOsc.freq(freq);
  toneOsc.amp(1, 0.05);
  setTimeout(() => {
    toneOsc.amp(0, 0.5);
  }, 500);
}

function mousePressed() {
  getAudioContext().resume(); //unblocks sound on live website
  
  // remove all collected circles from the chain except the main circle
  chain.splice(1);

  // loop over small circles
  for (let sc of smallCircles) {
    // re-randomize circles that have been picked
    if (sc.picked) {
      sc.x = random(width);
      sc.y = random(height);
      sc.col = color(random(255), random(255), random(255));
      sc.picked = false;  // allow it to be collected again
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
