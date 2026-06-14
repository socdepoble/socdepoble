// src/lib/spriteSequences.js
// Biblioteca de seqüències per a Brasa Burst
// Cada seqüència és un array d'objectes { selector, className, delay, duration }
// selectors apunten a ids o data-part dins dels SVGs

const common = {
  spark: {
    selector: '[data-part="spark"], #sausage-sparks, #snail-sparks, #rat-spark',
    className: 'anim-spark',
    duration: 900
  },
  smoke: {
    selector: '[data-part="smoke"], #sausage-smoke',
    className: 'anim-smoke',
    duration: 1600
  },
  led: {
    selector: '[data-part="led"], #pixel-led, #boot-led',
    className: 'anim-led',
    duration: 1200
  },
  bits: {
    selector: '[data-part="bits"], #worm-bits',
    className: 'anim-bits',
    duration: 1400
  },
  tail: {
    selector: '[data-part="tail"], #pixel-tail',
    className: 'anim-tail',
    duration: 900
  },
  pendrive: {
    selector: '[data-part="pendrive"], #pixel-pendrive',
    className: 'anim-pendrive',
    duration: 900
  },
  pcbSpark: {
    selector: '[data-part="spark"], #rat-spark',
    className: 'anim-pcbSpark',
    duration: 700
  },
  wing: {
    selector: '[data-part="pigeon-left"], [data-part="pigeon-right"], #pigeon-left, #pigeon-right',
    className: 'anim-wing',
    duration: 900
  },
  ember: {
    selector: '[data-part="embers"], #embers',
    className: 'anim-ember',
    duration: 1600
  },
  clock: {
    selector: '[data-part="gnomon"], #sundial-gnomon',
    className: 'anim-clock',
    duration: 2200
  },
  cable: {
    selector: '[data-part="cable"], #snail-cable',
    className: 'anim-cable',
    duration: 2200
  }
};
const sequences = {
  // Llonganissa fusible
  sausage: {
    overload: [{
      ...common.spark,
      delay: 0
    }, {
      ...common.smoke,
      delay: 180
    }, {
      ...common.led,
      delay: 300
    }, {
      selector: '[data-part="text"], #sausage-smoke',
      className: 'anim-pop',
      delay: 600,
      duration: 1200
    }],
    playful: [{
      ...common.spark,
      delay: 0
    }, {
      ...common.led,
      delay: 120
    }],
    idle: [{
      ...common.led,
      delay: 0,
      duration: 2400
    }]
  },
  // Gallina amb router
  chicken: {
    listen: [{
      selector: '[data-part="headphones"], #chicken-headphones',
      className: 'anim-headphone',
      delay: 0,
      duration: 1200
    }, {
      ...common.led,
      delay: 200
    }],
    glitch: [{
      selector: '[data-part="router-light"], #chicken-router circle',
      className: 'anim-led',
      delay: 0,
      duration: 1200
    }, {
      selector: '[data-part="cable"], #chicken-cable',
      className: 'anim-cable',
      delay: 80,
      duration: 900
    }],
    idle: [{
      selector: '[data-part="headphones"], #chicken-headphones',
      className: 'anim-pulseSoft',
      delay: 0,
      duration: 2000
    }]
  },
  // Píxel mascota
  pixel: {
    chew: [{
      ...common.pendrive,
      delay: 0
    }, {
      ...common.tail,
      delay: 60
    }, {
      ...common.led,
      delay: 120
    }],
    mischief: [{
      selector: '[data-part="pendrive"], #pixel-pendrive',
      className: 'anim-pendrive',
      delay: 0
    }, {
      selector: '[data-part="text"], #pixel-text',
      className: 'anim-pop',
      delay: 200
    }],
    idle: [{
      ...common.led,
      delay: 0,
      duration: 1800
    }]
  },
  // Bota antena
  boot: {
    signal: [{
      ...common.led,
      delay: 0
    }, {
      selector: '[data-part="wifi"], #boot-wifi',
      className: 'anim-wifi',
      delay: 80,
      duration: 1600
    }],
    drop: [{
      selector: '[data-part="wifi"], #boot-wifi',
      className: 'anim-wifi',
      delay: 0
    }, {
      ...common.led,
      delay: 200
    }],
    idle: [{
      ...common.led,
      delay: 0,
      duration: 2400
    }]
  },
  // Caragol cablejat
  snail: {
    drag: [{
      ...common.cable,
      delay: 0
    }, {
      ...common.spark,
      delay: 200
    }],
    startled: [{
      ...common.spark,
      delay: 0
    }, {
      selector: '[data-part="text"], #snail-text',
      className: 'anim-pop',
      delay: 120
    }],
    idle: [{
      ...common.cable,
      delay: 0,
      duration: 3000
    }]
  },
  // Ratolí reparador
  rat: {
    solder: [{
      ...common.pcbSpark,
      delay: 0
    }, {
      selector: '[data-part="pcb"], #rat-pcb',
      className: 'anim-pulseSoft',
      delay: 80
    }],
    panic: [{
      ...common.pcbSpark,
      delay: 0
    }, {
      ...common.led,
      delay: 120
    }],
    idle: [{
      selector: '[data-part="body"], #rat-body',
      className: 'anim-pulseSoft',
      delay: 0
    }]
  },
  // Cuc de dades
  worm: {
    chew: [{
      selector: '[data-part="body"], #worm-body',
      className: 'anim-wormChew',
      delay: 0,
      duration: 1200
    }, {
      ...common.bits,
      delay: 120
    }],
    spit: [{
      ...common.bits,
      delay: 0
    }, {
      selector: '[data-part="text"], #worm-text',
      className: 'anim-pop',
      delay: 200
    }],
    idle: [{
      selector: '[data-part="body"], #worm-body',
      className: 'anim-wormChew',
      delay: 0
    }]
  },
  // Pols de cendra
  ember: {
    drift: [{
      ...common.ember,
      delay: 0
    }, {
      selector: '[data-part="text"], #embers-text',
      className: 'anim-pop',
      delay: 300
    }],
    flare: [{
      ...common.ember,
      delay: 0
    }, {
      ...common.led,
      delay: 120
    }]
  },
  // Coloms dron
  pigeon: {
    fly: [{
      ...common.wing,
      delay: 0
    }, {
      selector: '[data-part="arc"], #pigeon-arc',
      className: 'anim-pulseSoft',
      delay: 80
    }],
    scan: [{
      selector: '[data-part="cam-left"], #pigeon-left-cam',
      className: 'anim-led',
      delay: 0
    }, {
      selector: '[data-part="cam-right"], #pigeon-right-cam',
      className: 'anim-led',
      delay: 120
    }],
    idle: [{
      ...common.wing,
      delay: 0,
      duration: 1800
    }]
  },
  // Rellotge de sol cron
  sundial: {
    tick: [{
      ...common.clock,
      delay: 0
    }, {
      selector: '[data-part="text"], #sundial-text',
      className: 'anim-pop',
      delay: 200
    }],
    calm: [{
      selector: '[data-part="circle"], #sundial-circle',
      className: 'anim-pulseSoft',
      delay: 0
    }]
  }
};
export default sequences;