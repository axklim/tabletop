/* Design 03 — CHAMFER deep study.
   Rectangular table 1500x750mm with angular trapezoidal cutout.
   Multiple views: plan, iso, side elevation, edge cross-section, sub-variants.
*/

const DEFS = (
  <defs>
    <pattern id="hatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(35)">
      <line x1="0" y1="0" x2="0" y2="6" stroke="var(--ink-soft)" strokeWidth="0.6" opacity="0.55" />
    </pattern>
    <pattern id="hatch-dense" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="4" stroke="var(--ink-soft)" strokeWidth="0.7" opacity="0.7" />
    </pattern>
    <pattern id="end-grain" patternUnits="userSpaceOnUse" width="10" height="10">
      <circle cx="3" cy="3" r="1.4" fill="none" stroke="var(--ink-faint)" strokeWidth="0.5" />
      <circle cx="7" cy="7" r="0.8" fill="none" stroke="var(--ink-faint)" strokeWidth="0.5" />
    </pattern>
  </defs>
);

function Annotation({ x, y, dx, dy, label, anchor = "start" }) {
  return (
    <g className="annotation">
      <line x1={x} y1={y} x2={x + dx} y2={y + dy} className="ink-soft" strokeDasharray="2 2" />
      <circle cx={x} cy={y} r="2" className="accent-fill" />
      <text x={x + dx + (anchor === "end" ? -4 : 4)} y={y + dy + 3} textAnchor={anchor} className="handwritten">
        {label}
      </text>
    </g>
  );
}

function Dim({ x1, x2, y, label, vertical = false }) {
  if (vertical) {
    return (
      <g className="annotation">
        <line x1={y} y1={x1} x2={y} y2={x2} className="ink-soft" />
        <line x1={y - 4} y1={x1} x2={y + 4} y2={x1} className="ink-soft" />
        <line x1={y - 4} y1={x2} x2={y + 4} y2={x2} className="ink-soft" />
        <text x={y - 8} y={(x1 + x2) / 2} textAnchor="end" className="label" transform={`rotate(-90 ${y - 8} ${(x1 + x2) / 2})`}>
          {label}
        </text>
      </g>
    );
  }
  return (
    <g className="annotation">
      <line x1={x1} y1={y} x2={x2} y2={y} className="ink-soft" />
      <line x1={x1} y1={y - 4} x2={x1} y2={y + 4} className="ink-soft" />
      <line x1={x2} y1={y - 4} x2={x2} y2={y + 4} className="ink-soft" />
      <text x={(x1 + x2) / 2} y={y - 6} textAnchor="middle" className="label">{label}</text>
    </g>
  );
}

/* ============================================================
   HERO — large iso view
   ============================================================ */
function HeroIso() {
  return (
    <svg viewBox="0 0 800 460" preserveAspectRatio="xMidYMid meet">
      {DEFS}
      <path d="M 80 320 L 720 320 L 760 290 L 120 290 Z" className="ink-faint" />
      {/* top */}
      <path
        d="M 120 290
           L 760 290
           L 760 320
           L 600 332
           L 540 380
           L 380 380
           L 320 332
           L 120 320 Z"
        className="ink fill-paper"
      />
      {/* cutout outline highlight */}
      <path
        d="M 320 332 L 380 380 L 540 380 L 600 332"
        className="accent"
        strokeWidth="2.4"
        fill="none"
      />
      {/* edge thickness */}
      <path
        d="M 120 320 L 320 332 L 320 344 L 120 332 Z
           M 600 332 L 760 320 L 760 332 L 600 344 Z
           M 380 380 L 540 380 L 540 392 L 380 392 Z"
        fill="url(#hatch)"
        className="ink"
      />
      {/* bevel face thickness */}
      <path
        d="M 320 332 L 380 380 L 380 392 L 320 344 Z
           M 600 332 L 540 380 L 540 392 L 600 344 Z"
        fill="url(#hatch-dense)"
        className="ink"
      />
      {/* legs */}
      <line x1="180" y1="332" x2="180" y2="430" className="ink" />
      <line x1="188" y1="332" x2="188" y2="430" className="ink" />
      <line x1="700" y1="332" x2="700" y2="430" className="ink" />
      <line x1="708" y1="332" x2="708" y2="430" className="ink" />
      <line x1="174" y1="430" x2="194" y2="430" className="ink" />
      <line x1="694" y1="430" x2="714" y2="430" className="ink" />
      <line x1="60" y1="436" x2="760" y2="436" className="ink-faint" />

      <Annotation x={460} y={380} dx={0} dy={50} label="120 mm flat" anchor="middle" />
      <Annotation x={350} y={358} dx={-90} dy={-30} label="56° bevel" anchor="end" />
      <Annotation x={760} y={300} dx={-60} dy={-30} label="solid white oak · 30mm" anchor="end" />
      <Annotation x={188} y={400} dx={-60} dy={20} label="trestle leg" anchor="end" />
      <text x={60} y={40} className="handwritten" style={{ fontSize: 28, fill: "var(--ink)" }}>
        Hero · iso 3-quarter
      </text>
    </svg>
  );
}

/* ============================================================
   PLAN VIEW with full dims
   ============================================================ */
function PlanView() {
  // 1500x750 → mapped 60..660 wide, 80..380 tall (600x300)
  // Outer rectangle has 4 rounded corners (R = 24px ≈ 60mm)
  // Cutout has 4 smaller rounded corners (r = 8px ≈ 20mm)
  const R = 24; // outer corner radius
  const r = 8;  // inner cutout corner radius
  // Outer rect corners: (60,80) TL, (660,80) TR, (660,380) BR, (60,380) BL
  // Cutout key points (sharp): A(240,380) B(288,320) C(432,320) D(480,380)
  // Bevel direction unit vectors:
  //   A→B: (48,-60), len=76.84 → u=(0.625,-0.781)
  //   B→C: (1,0)
  //   C→D: (48,60), len=76.84 → u=(0.625,0.781)
  //   bottom edge: along (-1,0) going from D back toward A or BL toward A
  // For each cutout vertex, replace the sharp corner with an arc tangent to the two adjacent edges.
  // To keep this simple & visually correct, use small arcs with the bottom-edge tangent as straight,
  // and the bevel as straight, with a fillet of radius r between them.

  // Helper: compute fillet endpoints for vertex P between incoming dir d1 (from prev to P)
  // and outgoing dir d2 (from P to next). The arc starts at P - d1*r along d1 axis from P backward (i.e. P moved back along -d1 by r),
  // ends at P + d2*r along d2 forward.
  // Actually for a simple fillet between two straight lines meeting at P: pull each line back by r in
  // the direction away from P, and connect with an arc of radius r (sweep depends on turn direction).

  const norm = (v) => { const l = Math.hypot(v[0], v[1]); return [v[0]/l, v[1]/l]; };
  const sub = (a, b) => [a[0]-b[0], a[1]-b[1]];
  const add = (a, b) => [a[0]+b[0], a[1]+b[1]];
  const mul = (a, k) => [a[0]*k, a[1]*k];
  const dot = (a, b) => a[0]*b[0] + a[1]*b[1];

  const A = [240, 380], B = [288, 320], C = [432, 320], D = [480, 380];

  // Edge directions (unit vectors) AT each vertex pointing AWAY from the vertex along each adjacent edge:
  // At A: toward BL (-1,0) and toward B (norm(B-A))
  // At B: toward A (norm(A-B)) and toward C (1,0)
  // At C: toward B (-1,0) and toward D (norm(D-C))
  // At D: toward C (norm(C-D)) and toward BR (1,0)
  const dAB = norm(sub(B, A));   // A→B
  const dBA = mul(dAB, -1);
  const dCD = norm(sub(D, C));   // C→D
  const dDC = mul(dCD, -1);

  // Per-corner half-angle: cos(θ) = dot(e1, e2) where e1,e2 are unit vectors from vertex along each edge.
  // Pull-back distance = r / tan(θ/2) = r * sqrt((1+cosθ)/(1-cosθ))
  function pullBack(e1, e2, rad) {
    const c = Math.max(-0.9999, Math.min(0.9999, dot(e1, e2)));
    // half-angle t: cos(2t)=c → tan(t) = sqrt((1-c)/(1+c))
    const tHalf = Math.sqrt((1 - c) / (1 + c));
    return rad / tHalf;
  }

  const pA = pullBack([-1, 0], dAB, r);   // A: edges go to BL and to B
  const pB = pullBack(dBA, [1, 0], r);    // B: edges go to A and to C
  const pC = pullBack([-1, 0], dCD, r);   // C: edges go to B and to D
  const pD = pullBack(dDC, [1, 0], r);    // D: edges go to C and to BR

  // Pull-back points: from vertex along each adjacent edge by the computed distance
  const A_in  = add(A, mul([-1, 0], pA));     // along bottom edge toward BL
  const A_out = add(A, mul(dAB, pA));         // along bevel toward B
  const B_in  = add(B, mul(dBA, pB));         // along bevel toward A
  const B_out = add(B, mul([1, 0], pB));      // along flat top toward C
  const C_in  = add(C, mul([-1, 0], pC));     // along flat top toward B
  const C_out = add(C, mul(dCD, pC));         // along bevel toward D
  const D_in  = add(D, mul(dDC, pD));         // along bevel toward C
  const D_out = add(D, mul([1, 0], pD));      // along bottom edge toward BR

  // Sweep flag: at A the outline turns from bottom-edge into bevel going up-and-right.
  // Going counter-clockwise around the inside of the cutout (the cutout is a notch UP into the rect),
  // but our path is the OUTLINE of the wood (concave at the cutout). Try sweep=0 for concave fillets at A and D
  // and sweep=1 (convex) for B and C? Actually at A the wood turns inward (right-then-up bevel) — that's a left turn for the boundary going clockwise around the wood. Let's use sweep=0 for all four; if it looks wrong we'll flip.
  // Empirically: for a path going (BL → A_in → arc → A_out → B_in → arc → B_out → C_in → arc → C_out → D_in → arc → D_out → BR)
  // At A the path turns left (going right, then up-right). Left turn = counter-clockwise = sweep-flag 0 for SVG with y-down? In SVG y-down, sweep=1 is clockwise. A left turn in y-down is counterclockwise → sweep=0.
  // At B the path turns right (going up-right then right). Right turn → sweep=1.
  // At C right turn (going right then down-right) → sweep=1.
  // At D left turn (going down-right then right) → sweep=0.

  const fmt = (p) => `${p[0].toFixed(2)} ${p[1].toFixed(2)}`;

  // Outer rect with rounded corners path (R), going clockwise starting from TL after corner:
  // M (60+R, 80) L (660-R, 80) A R R 0 0 1 (660, 80+R) L (660, 380-R) A R R 0 0 1 (660-R, 380)
  // L D_out → arc D → D_in → L C_out → arc C → C_in → L B_out → arc B → B_in → L A_out → arc A → A_in
  // L (60+R, 380) A R R 0 0 1 (60, 380-R) L (60, 80+R) A R R 0 0 1 (60+R, 80) Z
  const path = [
    `M ${60+R} 80`,
    `L ${660-R} 80`,
    `A ${R} ${R} 0 0 1 660 ${80+R}`,
    `L 660 ${380-R}`,
    `A ${R} ${R} 0 0 1 ${660-R} 380`,
    `L ${fmt(D_out)}`,
    `A ${r} ${r} 0 0 1 ${fmt(D_in)}`,   // D: convex corner of wood
    `L ${fmt(C_out)}`,
    `A ${r} ${r} 0 0 0 ${fmt(C_in)}`,   // C: concave
    `L ${fmt(B_out)}`,
    `A ${r} ${r} 0 0 0 ${fmt(B_in)}`,   // B: concave
    `L ${fmt(A_out)}`,
    `A ${r} ${r} 0 0 1 ${fmt(A_in)}`,   // A: convex
    `L ${60+R} 380`,
    `A ${R} ${R} 0 0 1 60 ${380-R}`,
    `L 60 ${80+R}`,
    `A ${R} ${R} 0 0 1 ${60+R} 80`,
    `Z`,
  ].join(' ');

  // Cutout highlight: same boundary as wood path but traversed A→B→C→D (reversed),
  // so sweep flags are inverted from the wood path's D→C→B→A traversal.
  const cutoutHighlight = [
    `M ${fmt(A_in)}`,
    `A ${r} ${r} 0 0 0 ${fmt(A_out)}`,
    `L ${fmt(B_in)}`,
    `A ${r} ${r} 0 0 1 ${fmt(B_out)}`,
    `L ${fmt(C_in)}`,
    `A ${r} ${r} 0 0 1 ${fmt(C_out)}`,
    `L ${fmt(D_in)}`,
    `A ${r} ${r} 0 0 0 ${fmt(D_out)}`,
  ].join(' ');

  return (
    <svg viewBox="0 0 720 460" preserveAspectRatio="xMidYMid meet">
      {DEFS}
      <path d={path} className="ink fill-paper" />
      {/* center line */}
      <line x1="360" y1="80" x2="360" y2="380" className="ink-faint" strokeDasharray="3 3" />
      {/* cutout highlight */}
      <path d={cutoutHighlight} className="accent" strokeWidth="2.4" fill="none" />
      {/* dim lines */}
      <Dim x1={60} x2={660} y={64} label="1500 mm" />
      <Dim x1={80} x2={380} y={48} vertical label="750 mm" />
      <Dim x1={288} x2={432} y={310} label="120 flat" />
      <Dim x1={240} x2={480} y={400} label="240 mouth" />
      <Dim x1={320} x2={380} y={344} vertical label="60 deep" />

      {/* angle indicator */}
      <path d="M 240 380 A 18 18 0 0 1 252 358" className="ink-soft" fill="none" />
      <text x="262" y="378" className="label">56°</text>

      {/* hand zones */}
      <g className="annotation" opacity="0.85">
        <ellipse cx="200" cy="350" rx="48" ry="22" className="ink-faint" strokeDasharray="2 3" fill="none" />
        <text x="200" y="354" textAnchor="middle" className="label">L FOREARM</text>
        <ellipse cx="520" cy="350" rx="48" ry="22" className="ink-faint" strokeDasharray="2 3" fill="none" />
        <text x="520" y="354" textAnchor="middle" className="label">R FOREARM</text>
        <rect x="280" y="240" width="160" height="40" className="ink-faint" strokeDasharray="2 3" fill="none" />
        <text x="360" y="264" textAnchor="middle" className="label">KEYBOARD ZONE</text>
      </g>

      <text x="360" y="420" textAnchor="middle" className="label">FRONT EDGE · USER →</text>
      <text x="360" y="100" textAnchor="middle" className="label">BACK · WALL</text>
      <text x={60} y={40} className="handwritten" style={{ fontSize: 28, fill: "var(--ink)" }}>
        Plan view · top down
      </text>
    </svg>
  );
}

/* ============================================================
   SIDE ELEVATION
   ============================================================ */
function SideElevation() {
  return (
    <svg viewBox="0 0 600 380" preserveAspectRatio="xMidYMid meet">
      {DEFS}
      {/* tabletop slab seen from side */}
      <rect x="80" y="120" width="440" height="30" className="ink fill-paper" />
      <rect x="80" y="120" width="440" height="30" fill="url(#hatch)" />
      {/* legs */}
      <line x1="130" y1="150" x2="130" y2="320" className="ink" />
      <line x1="138" y1="150" x2="138" y2="320" className="ink" />
      <line x1="462" y1="150" x2="462" y2="320" className="ink" />
      <line x1="470" y1="150" x2="470" y2="320" className="ink" />
      <line x1="124" y1="320" x2="144" y2="320" className="ink" />
      <line x1="456" y1="320" x2="476" y2="320" className="ink" />
      {/* floor */}
      <line x1="40" y1="324" x2="560" y2="324" className="ink-faint" />
      {/* cross-hatch table */}
      {/* user silhouette suggestion — head & forearm */}
      <g className="ink-soft" opacity="0.55">
        <circle cx="300" cy="50" r="14" />
        <path d="M 300 64 L 300 110 L 270 130 L 300 130 L 330 130 L 300 110 Z" />
        <path d="M 270 130 Q 260 138 270 148 L 360 148" />
      </g>

      <Dim x1={150} x2={324} y={108} vertical label="720 mm" />
      <Dim x1={80} x2={520} y={102} label="1500" />
      <Annotation x={520} y={135} dx={30} dy={-10} label="t = 30 mm" />
      <Annotation x={300} y={148} dx={-130} dy={20} label="forearm clears bevel" anchor="end" />

      <text x={40} y={36} className="handwritten" style={{ fontSize: 28, fill: "var(--ink)" }}>
        Side elevation
      </text>
    </svg>
  );
}

/* ============================================================
   EDGE CROSS-SECTION DETAIL
   ============================================================ */
function EdgeDetail() {
  return (
    <svg viewBox="0 0 600 380" preserveAspectRatio="xMidYMid meet">
      {DEFS}
      {/* zoom marker */}
      <text x={40} y={36} className="handwritten" style={{ fontSize: 28, fill: "var(--ink)" }}>
        Edge · cross-section A–A
      </text>
      <text x={580} y={40} textAnchor="end" className="label">SCALE 2:1</text>

      {/* big slab in cross-section */}
      <path
        d="M 80 140
           L 380 140
           L 460 220
           L 460 280
           L 80 280 Z"
        className="ink fill-paper"
      />
      <path
        d="M 80 140 L 380 140 L 460 220 L 460 280 L 80 280 Z"
        fill="url(#end-grain)"
      />
      {/* top edge break */}
      <path d="M 80 140 L 380 140" className="ink" strokeWidth="1.8" />
      {/* bevel face */}
      <path d="M 380 140 L 460 220" className="accent" strokeWidth="2.4" />
      {/* small radius break at top of bevel */}
      <path d="M 376 140 Q 384 142 386 148" className="ink" />
      {/* tiny break at bottom */}
      <path d="M 458 224 Q 464 226 464 232" className="ink" />

      {/* dims */}
      <Dim x1={80} x2={460} y={130} label="380 mm (½ flat + bevel run)" />
      <Dim x1={140} x2={280} y={310} vertical label="" />
      <Dim x1={140} x2={280} y={300} label="t = 30" />

      {/* angle dim at A */}
      <path d="M 380 158 A 18 18 0 0 1 392 152" className="ink-soft" fill="none" />
      <text x="402" y="156" className="label">56°</text>

      {/* radius callout */}
      <Annotation x={381} y={144} dx={-60} dy={-40} label="r 0.5 (eased)" anchor="end" />
      <Annotation x={420} y={180} dx={-100} dy={-50} label="bevel face · sanded fine" anchor="end" />
      <Annotation x={460} y={250} dx={40} dy={20} label="under edge" />

      {/* section indicator (mini plan) */}
      <g transform="translate(440 60)">
        <rect width="120" height="40" className="ink-soft fill-paper" />
        <path d="M 30 40 L 50 20 L 90 20 L 110 40" className="accent" strokeWidth="1.5" fill="none" />
        <line x1="60" y1="0" x2="60" y2="50" className="accent" strokeDasharray="3 2" />
        <text x="60" y="-4" textAnchor="middle" className="label">A</text>
        <text x="60" y="62" textAnchor="middle" className="label">A</text>
      </g>
    </svg>
  );
}

/* ============================================================
   SUB-VARIANTS — bevel angle exploration
   ============================================================ */
function BevelVariant({ angle, flat, label, depth }) {
  // simple plan inset showing the cutout shape only
  // fixed canvas 240x140; cutout drawn against bottom edge
  const cx = 120;
  const halfFlat = flat / 2;
  const tan = Math.tan((angle * Math.PI) / 180);
  const run = depth / tan; // horizontal offset for bevel
  const left = cx - halfFlat - run;
  const right = cx + halfFlat + run;
  const flatLeft = cx - halfFlat;
  const flatRight = cx + halfFlat;
  return (
    <svg viewBox="0 0 240 140" preserveAspectRatio="xMidYMid meet">
      <path
        d={`M 20 30 L 220 30 L 220 120 L ${right} 120 L ${flatRight} ${120 - depth} L ${flatLeft} ${120 - depth} L ${left} 120 L 20 120 Z`}
        className="ink fill-paper"
      />
      <path
        d={`M ${left} 120 L ${flatLeft} ${120 - depth} L ${flatRight} ${120 - depth} L ${right} 120`}
        className="accent"
        strokeWidth="2"
        fill="none"
      />
      <text x="120" y="22" textAnchor="middle" className="label-accent label" style={{ fontWeight: 600 }}>
        {label}
      </text>
    </svg>
  );
}

function SubVariants() {
  return (
    <div className="subvariants">
      <div className="subv">
        <BevelVariant angle={45} flat={80} depth={28} label="45° · TIGHT" />
        <div className="subv-cap">A · 45° · 80mm flat</div>
        <div className="subv-note">aggressive · most surface lost</div>
      </div>
      <div className="subv">
        <BevelVariant angle={56} flat={120} depth={28} label="56° · CHOSEN" highlight />
        <div className="subv-cap accent-text">B · 56° · 120mm flat</div>
        <div className="subv-note">balanced · default spec</div>
      </div>
      <div className="subv">
        <BevelVariant angle={68} flat={160} depth={28} label="68° · GENTLE" />
        <div className="subv-cap">C · 68° · 160mm flat</div>
        <div className="subv-note">forgiving · less ergo effect</div>
      </div>
    </div>
  );
}

window.HeroIso = HeroIso;
window.PlanView = PlanView;
window.SideElevation = SideElevation;
window.EdgeDetail = EdgeDetail;
window.SubVariants = SubVariants;
