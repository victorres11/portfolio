// Real play concepts transcribed from NFL/college play diagrams.
// Coordinates are normalized:
//   x: -0.5 (left sideline) to 0.5 (right sideline)
//   y: 0 (line of scrimmage), negative = upfield, positive = backfield
// Routes are arrays of [x, y] waypoints; the player's position is auto-prepended.

const OL = [
  { x: -0.08, y: 0, type: 'x' },
  { x: -0.04, y: 0, type: 'x' },
  { x: 0, y: 0, type: 'x' },
  { x: 0.04, y: 0, type: 'x' },
  { x: 0.08, y: 0, type: 'x' },
];

export const PLAYBOOK = [
  // ---- Cowboys: Spray Basic ----
  {
    name: 'Spray Basic',
    players: [
      ...OL,
      { x: 0.02, y: 0.12, type: 'o' }, // QB shotgun
      { x: -0.45, y: 0.02, type: 'o', route: [[-0.48, -0.06]] },                     // F — Short
      { x: -0.22, y: 0.01, type: 'o', route: [[-0.1, -0.14], [0.32, -0.22]] },       // X — Shallow cross
      { x: -0.13, y: 0, type: 'o', route: [[-0.14, -0.38], [0.12, -0.38]] },         // Y — Spray Basic
      { x: 0.05, y: 0.14, type: 'o', route: [[0.03, 0.02], [0.14, -0.16]] },         // H — Check Sit
      { x: 0.5, y: 0, type: 'o', route: [[0.48, -0.32], [0.26, -0.72]] },            // Z — Stem Post
    ],
  },

  // ---- Mizzou: Expansion Hitch ----
  {
    name: 'Expansion Hitch',
    players: [
      ...OL,
      { x: 0.08, y: 0.13, type: 'o' }, // QB shotgun
      { x: -0.42, y: 0.02, type: 'o', route: [[-0.48, -0.2], [-0.36, -0.38]] },      // X — Expansion Hitch
      { x: -0.18, y: 0.03, type: 'o', route: [[-0.2, -0.55], [-0.12, -0.48]] },      // F — Slot Fade Curl
      { x: -0.02, y: 0.03, type: 'o', route: [[0.0, -0.32]] },                       // Z — Sit OTB
      { x: 0.22, y: 0, type: 'o', route: [[0.24, -0.26], [0.4, -0.4]] },             // Y — Swirl
      { x: 0.12, y: 0.14, type: 'o', route: [[0.28, 0.04], [0.48, 0.0]] },           // H — Chip Swing
    ],
  },

  // ---- Packers: High Cross ----
  {
    name: 'High Cross',
    players: [
      ...OL,
      { x: 0, y: 0.05, type: 'o' }, // QB under center
      { x: -0.2, y: 0, type: 'o', route: [[-0.08, -0.38], [-0.38, -0.52]] },         // Y — High Cross (deep cross left)
      { x: 0.22, y: 0, type: 'o', route: [[0.1, -0.22], [-0.05, -0.48]] },           // X — Shallow Sting
      { x: 0.5, y: 0.02, type: 'o', route: [[0.5, -0.82]] },                         // Z — Go route
      { x: -0.08, y: 0.15, type: 'o', route: [[-0.22, 0.04], [-0.4, -0.02]] },       // F — Check Flat
      { x: 0.08, y: 0.15, type: 'o', route: [[0.22, 0.06], [0.45, -0.02]] },         // H — Tear Swing
    ],
  },

  // ---- USC: Burst to Mesh ----
  {
    name: 'Burst to Mesh',
    players: [
      ...OL,
      { x: 0, y: 0.12, type: 'o' }, // QB shotgun
      { x: -0.35, y: 0, type: 'o', route: [[-0.4, -0.68]] },                         // X — Rail (vertical)
      { x: -0.15, y: 0, type: 'o', route: [[-0.06, -0.22], [-0.34, -0.28]] },        // Y — Burst to Mesh
      { x: 0.4, y: 0, type: 'o', route: [[0.35, -0.42], [0.18, -0.72]] },            // Z — Post (alert)
      { x: 0.08, y: 0.12, type: 'o', route: [[0.16, -0.04], [0.35, -0.12]] },        // H — Shallow Sit
      { x: -0.05, y: 0.12, type: 'o', route: [[0.0, -0.06], [0.0, -0.32]] },         // F — OTB
    ],
  },

  // ---- Washington State: Mesh / Dagger ----
  {
    name: 'Mesh Dagger',
    players: [
      ...OL,
      { x: 0, y: 0.1, type: 'o' }, // QB shotgun
      { x: -0.4, y: 0, type: 'o', route: [[-0.35, -0.42], [0.1, -0.38]] },           // X — Dagger (deep dig)
      { x: -0.15, y: 0.01, type: 'o', route: [[-0.2, -0.52]] },                      // H — Seam
      { x: -0.05, y: 0, type: 'o', route: [[0.12, -0.08], [0.35, -0.1]] },           // Y — Mesh cross right
      { x: 0.45, y: 0, type: 'o', route: [[0.18, -0.08], [-0.1, -0.12]] },           // Z — Mesh cross left
      { x: 0.08, y: 0.12, type: 'o', route: [[0.25, 0.04], [0.42, -0.04]] },         // RB — Check Rail
    ],
  },

  // ---- Seahawks: Cross / Post ----
  {
    name: 'Cross Post',
    players: [
      ...OL,
      { x: 0, y: 0.08, type: 'o' }, // QB shotgun
      { x: -0.4, y: 0, type: 'o', route: [[-0.32, -0.32], [0.12, -0.52]] },          // X — Deep Cross
      { x: 0.45, y: 0, type: 'o', route: [[0.4, -0.28], [0.2, -0.68]] },             // Z — Post
      { x: 0.18, y: 0, type: 'o', route: [[0.1, -0.22], [0.38, -0.58]] },            // Y — Insert Corner
      { x: -0.12, y: 0.08, type: 'o', route: [[-0.02, 0.04]] },                      // F — Blast (short)
      { x: 0, y: 0.18, type: 'o', route: [[0.0, 0.06], [-0.06, -0.1]] },             // H — Release up
    ],
  },

  // ---- UNC: Snag / Corner ----
  {
    name: 'Snag Corner',
    players: [
      ...OL,
      { x: 0.03, y: 0.12, type: 'o' }, // QB shotgun
      { x: -0.32, y: 0.01, type: 'o', route: [[-0.48, -0.02]] },                     // X — Flat
      { x: -0.15, y: 0, type: 'o', route: [[-0.1, -0.36], [-0.35, -0.68]] },         // Y — Tube Corner
      { x: -0.08, y: 0.02, type: 'o', route: [[-0.12, -0.2]] },                      // F — Snag (sit)
      { x: 0.45, y: 0, type: 'o', route: [[0.42, -0.42], [0.45, -0.32]] },           // Z — Comeback
      { x: 0.1, y: 0.12, type: 'o', route: [[0.06, 0.02]] },                         // H — Spray (short)
    ],
  },

  // ---- Screen & Go ----
  {
    name: 'Screen and Go',
    players: [
      ...OL,
      { x: 0, y: 0.12, type: 'o' },  // QB shotgun
      { x: -0.4, y: 0.01, type: 'o', route: [[-0.35, 0.04], [-0.45, -0.7]] },            // X — Screen & Go (fake back, go deep)
      { x: 0.1, y: 0, type: 'o', route: [[0.05, -0.18], [-0.25, -0.35]] },               // H — Cross (deep cross left)
      { x: 0.22, y: 0, type: 'o', route: [[0.18, -0.42], [0.1, -0.72]] },                // Y — Post
      { x: 0.48, y: 0, type: 'o' },                                                       // Z — (blocker/clear)
      { x: 0.1, y: 0.13, type: 'o', route: [[0.28, 0.08], [0.48, 0.05]] },               // RB — Swing right
    ],
  },

  // ---- Y-Stick / Expansion ----
  {
    name: 'Y-Stick',
    players: [
      ...OL,
      { x: 0, y: 0.12, type: 'o' },  // QB shotgun
      { x: -0.42, y: 0.02, type: 'o', route: [[-0.48, -0.18], [-0.38, -0.32]] },         // X — Expansion Hitch
      { x: -0.22, y: 0.01, type: 'o', route: [[-0.25, -0.72]] },                         // H — Slot Fade
      { x: -0.05, y: 0.01, type: 'o', route: [[-0.05, -0.2], [-0.2, -0.22]] },           // Y — Y-Stick (up and sits, option left)
      { x: 0.48, y: 0.02, type: 'o', route: [[0.35, -0.22]] },                           // Z — Slant
      { x: 0.1, y: 0.13, type: 'o', route: [[0.3, 0.05], [0.48, 0.02]] },                // RB — Bubble right
    ],
  },

  // ---- Max Protection: Post / Wheel ----
  {
    name: 'Post Wheel',
    players: [
      ...OL,
      { x: 0.1, y: 0.12, type: 'o' },  // QB shotgun (offset right)
      { x: -0.18, y: 0, type: 'o' },                                                      // Y — TE (max protect, no route)
      { x: -0.05, y: 0.14, type: 'o' },                                                   // RB — (max protect, no route)
      { x: 0.22, y: 0.01, type: 'o', route: [[0.18, -0.22], [0.05, -0.52]] },            // H — Bury (up then curves inside)
      { x: 0.35, y: 0, type: 'o', route: [[0.32, -0.32], [0.15, -0.82]] },               // X — Post (deep)
      { x: 0.5, y: 0, type: 'o', route: [[0.48, -0.18], [0.48, -0.82]] },                // Z — Wheel (flat then vertical)
    ],
  },

  // ---- LSU: Post / Dover ----
  {
    name: 'Post Dover',
    players: [
      ...OL,
      { x: 0, y: 0.12, type: 'o' },  // QB shotgun
      { x: -0.35, y: 0.01, type: 'o', route: [[-0.28, -0.32], [-0.12, -0.68]] },         // X — Deep cross (alert)
      { x: 0.08, y: 0.02, type: 'o', route: [[0.05, -0.22]] },                           // Y — Check Sit
      { x: 0.2, y: 0.01, type: 'o', route: [[0.22, -0.05], [0.48, -0.1]] },              // F — Chip Flat
      { x: 0.42, y: 0.01, type: 'o', route: [[0.38, -0.32], [0.2, -0.72]] },             // Z — Post
      { x: 0.05, y: 0.14, type: 'o' },                                                    // RB — (blocking, no route)
    ],
  },

  // ---- Bender / Seam / Jet ----
  {
    name: 'Bender Seam',
    players: [
      ...OL,
      { x: 0.35, y: 0.08, type: 'o' },  // QB (offset right)
      { x: -0.35, y: 0.01, type: 'o', route: [[-0.42, -0.35], [-0.5, -0.65]] },          // X — MOR (deep fade left)
      { x: -0.12, y: 0.01, type: 'o', route: [[-0.08, -0.35], [-0.05, -0.7]] },          // H — Seam (straight up)
      { x: -0.02, y: 0, type: 'o', route: [[-0.2, 0.01], [-0.42, 0.02]] },               // Y — Switch (flat left)
      { x: 0.05, y: 0.08, type: 'o', route: [[0.15, -0.22], [0.35, -0.55]] },            // Q2 — Bender (up and right)
      { x: 0.45, y: 0.08, type: 'o', route: [[0.15, 0.04], [-0.15, 0.02]] },             // RB — Jet motion (left)
    ],
  },
];
