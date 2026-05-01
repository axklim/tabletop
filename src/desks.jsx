/* Five rectangular-table wireframes.
   Each shows the SAME rectangle (1500×750mm) with a different front-edge cut-out.
   We render two views per card: PLAN (top-down) + ISO (3-quarter).
*/

const DEFS = (
  <defs>
    <pattern id="hatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(35)">
      <line x1="0" y1="0" x2="0" y2="6" stroke="var(--ink-soft)" strokeWidth="0.6" opacity="0.55" />
    </pattern>
    <pattern id="hatch-light" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(35)">
      <line x1="0" y1="0" x2="0" y2="8" stroke="var(--ink-faint)" strokeWidth="0.5" />
    </pattern>
  </defs>
);

/* shared: render a centered ruler under plan view */
function PlanRuler({ x1, x2, y, label }) {
  return (
    <g className="annotation">
      <line x1={x1} y1={y} x2={x2} y2={y} className="ink-soft" />
      <line x1={x1} y1={y - 4} x2={x1} y2={y + 4} className="ink-soft" />
      <line x1={x2} y1={y - 4} x2={x2} y2={y + 4} className="ink-soft" />
      <text x={(x1 + x2) / 2} y={y + 16} textAnchor="middle" className="label">
        {label}
      </text>
    </g>
  );
}

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

/* PLAN VIEW WRAPPER — rectangle 1500x750 mapped into 520x260 px window.
   x: 40..560 (520 wide)
   y: 40..300 (260 tall)
   front edge = bottom (y=300)
   back edge  = top (y=40)
*/
function PlanFrame({ children, cutoutPath, title }) {
  return (
    <svg viewBox="0 0 600 360" preserveAspectRatio="xMidYMid meet">
      {DEFS}
      {/* tabletop rectangle minus cutout */}
      <path d={cutoutPath} className="ink fill-paper" />
      {/* back-edge label tick */}
      <line x1="40" y1="40" x2="40" y2="32" className="ink-soft" />
      <line x1="560" y1="40" x2="560" y2="32" className="ink-soft" />
      <text x="300" y="26" textAnchor="middle" className="label">BACK EDGE · WALL</text>
      <text x="300" y="350" textAnchor="middle" className="label">FRONT EDGE · USER →</text>
      {children}
      <PlanRuler x1={40} x2={560} y={320} label="1500 mm" />
      <g className="annotation">
        <line x1={20} y1={40} x2={20} y2={300} className="ink-soft" />
        <line x1={16} y1={40} x2={24} y2={40} className="ink-soft" />
        <line x1={16} y1={300} x2={24} y2={300} className="ink-soft" />
        <text x={12} y={170} textAnchor="middle" className="label" transform="rotate(-90 12 170)">750 mm</text>
      </g>
      <text x={580} y={48} textAnchor="end" className="label">{title}</text>
    </svg>
  );
}

/* ISO VIEW WRAPPER — same rectangle in 3-quarter view, with thickness + legs */
function IsoFrame({ topPath, frontEdgePath, title }) {
  return (
    <svg viewBox="0 0 600 360" preserveAspectRatio="xMidYMid meet">
      {DEFS}
      {/* shadow */}
      <path
        d="M 80 250 L 520 250 L 560 220 L 120 220 Z"
        className="ink-faint"
      />
      {/* top surface (caller supplies the cutout-shaped path) */}
      <path d={topPath} className="ink fill-paper" />
      {/* front-edge thickness (callers supply because cutout shape varies) */}
      <path d={frontEdgePath} fill="url(#hatch)" className="ink" />
      {/* legs (4) — trestle-style */}
      <line x1="150" y1="252" x2="150" y2="340" className="ink" />
      <line x1="158" y1="252" x2="158" y2="340" className="ink" />
      <line x1="540" y1="248" x2="540" y2="340" className="ink" />
      <line x1="548" y1="248" x2="548" y2="340" className="ink" />
      <line x1="146" y1="340" x2="162" y2="340" className="ink" />
      <line x1="536" y1="340" x2="552" y2="340" className="ink" />
      {/* floor line */}
      <line x1="60" y1="345" x2="560" y2="345" className="ink-faint" />
      <text x={580} y={48} textAnchor="end" className="label">{title}</text>
    </svg>
  );
}

/* ============================================================
   1. CRESCENT — smooth concave arc
   ============================================================ */
function PlanCrescent() {
  // rectangle 40..560 x 40..300, with crescent on bottom edge
  const path = `
    M 40 40
    L 560 40
    L 560 300
    L 380 300
    Q 300 230 220 300
    L 40 300
    Z
  `;
  return (
    <PlanFrame cutoutPath={path} title="PLAN · 01 CRESCENT">
      {/* center-line */}
      <line x1="300" y1="40" x2="300" y2="300" className="ink-faint" strokeDasharray="3 3" />
      {/* cutout highlight */}
      <path d="M 220 300 Q 300 230 380 300" className="accent" strokeWidth="2.2" fill="none" />
      <Annotation x={300} y={244} dx={120} dy={-20} label="depth · 70mm" />
      <Annotation x={220} y={300} dx={-60} dy={30} label="width · 320mm" anchor="end" />
      <Annotation x={300} y={230} dx={-80} dy={-30} label="R = 200mm" anchor="end" />
    </PlanFrame>
  );
}
function IsoCrescent() {
  const top = `
    M 120 220
    L 560 220
    L 560 240
    Q 460 245 420 270
    Q 360 305 300 305
    Q 240 305 180 270
    Q 140 245 120 240
    Z
  `;
  const front = `
    M 120 240 Q 140 245 180 270 L 180 280 Q 140 255 120 250 Z
    M 420 270 Q 460 245 560 240 L 560 250 Q 460 255 420 280 Z
  `;
  return (
    <svg viewBox="0 0 600 360" preserveAspectRatio="xMidYMid meet">
      {DEFS}
      <path d="M 80 250 L 520 250 L 560 220 L 120 220 Z" className="ink-faint" />
      <path d={top} className="ink fill-paper" />
      <path
        d="M 180 270 Q 240 305 300 305 Q 360 305 420 270"
        className="accent"
        strokeWidth="2.2"
        fill="none"
      />
      <path d={front} fill="url(#hatch)" className="ink" />
      <line x1="150" y1="252" x2="150" y2="340" className="ink" />
      <line x1="158" y1="252" x2="158" y2="340" className="ink" />
      <line x1="540" y1="248" x2="540" y2="340" className="ink" />
      <line x1="548" y1="248" x2="548" y2="340" className="ink" />
      <line x1="146" y1="340" x2="162" y2="340" className="ink" />
      <line x1="536" y1="340" x2="552" y2="340" className="ink" />
      <line x1="60" y1="345" x2="560" y2="345" className="ink-faint" />
      <text x={580} y={48} textAnchor="end" className="label">ISO · 01 CRESCENT</text>
      <Annotation x={300} y={305} dx={-100} dy={-50} label="signature scoop" anchor="end" />
      <Annotation x={560} y={235} dx={20} dy={-25} label="t = 25mm" />
    </svg>
  );
}

/* ============================================================
   2. SHALLOW — wide, gentle arc (less invasive)
   ============================================================ */
function PlanShallow() {
  const path = `
    M 40 40
    L 560 40
    L 560 300
    L 460 300
    Q 300 260 140 300
    L 40 300
    Z
  `;
  return (
    <PlanFrame cutoutPath={path} title="PLAN · 02 SHALLOW">
      <line x1="300" y1="40" x2="300" y2="300" className="ink-faint" strokeDasharray="3 3" />
      <path d="M 140 300 Q 300 260 460 300" className="accent" strokeWidth="2.2" fill="none" />
      <Annotation x={300} y={269} dx={120} dy={-30} label="depth · 40mm" />
      <Annotation x={140} y={300} dx={-50} dy={30} label="width · 640mm" anchor="end" />
    </PlanFrame>
  );
}
function IsoShallow() {
  const top = `
    M 120 220
    L 560 220
    L 560 240
    Q 510 244 460 252
    Q 380 268 300 268
    Q 220 268 140 252
    Q 90 244 120 240
    Z
  `;
  const front = `
    M 120 240 Q 90 244 140 252 L 140 262 Q 90 254 120 250 Z
    M 460 252 Q 510 244 560 240 L 560 250 Q 510 254 460 262 Z
  `;
  return (
    <svg viewBox="0 0 600 360" preserveAspectRatio="xMidYMid meet">
      {DEFS}
      <path d="M 80 250 L 520 250 L 560 220 L 120 220 Z" className="ink-faint" />
      <path d={top} className="ink fill-paper" />
      <path d="M 140 252 Q 220 268 300 268 Q 380 268 460 252" className="accent" strokeWidth="2.2" fill="none" />
      <path d={front} fill="url(#hatch)" className="ink" />
      <line x1="150" y1="252" x2="150" y2="340" className="ink" />
      <line x1="158" y1="252" x2="158" y2="340" className="ink" />
      <line x1="540" y1="248" x2="540" y2="340" className="ink" />
      <line x1="548" y1="248" x2="548" y2="340" className="ink" />
      <line x1="146" y1="340" x2="162" y2="340" className="ink" />
      <line x1="536" y1="340" x2="552" y2="340" className="ink" />
      <line x1="60" y1="345" x2="560" y2="345" className="ink-faint" />
      <text x={580} y={48} textAnchor="end" className="label">ISO · 02 SHALLOW</text>
      <Annotation x={300} y={268} dx={-90} dy={-50} label="gentle arc" anchor="end" />
    </svg>
  );
}

/* ============================================================
   3. CHAMFER — angular trapezoid cutout
   ============================================================ */
function PlanChamfer() {
  const path = `
    M 40 40
    L 560 40
    L 560 300
    L 400 300
    L 360 240
    L 240 240
    L 200 300
    L 40 300
    Z
  `;
  return (
    <PlanFrame cutoutPath={path} title="PLAN · 03 CHAMFER">
      <line x1="300" y1="40" x2="300" y2="300" className="ink-faint" strokeDasharray="3 3" />
      <path d="M 200 300 L 240 240 L 360 240 L 400 300" className="accent" strokeWidth="2.2" fill="none" />
      <Annotation x={300} y={240} dx={140} dy={-30} label="depth · 60mm" />
      <Annotation x={240} y={240} dx={-90} dy={-30} label="120mm flat" anchor="end" />
      <Annotation x={200} y={300} dx={-50} dy={30} label="bevel · 56°" anchor="end" />
    </PlanFrame>
  );
}
function IsoChamfer() {
  const top = `
    M 120 220
    L 560 220
    L 560 240
    L 440 248
    L 400 280
    L 280 280
    L 240 248
    L 120 240
    Z
  `;
  const front = `
    M 120 240 L 240 248 L 240 258 L 120 250 Z
    M 440 248 L 560 240 L 560 250 L 440 258 Z
  `;
  return (
    <svg viewBox="0 0 600 360" preserveAspectRatio="xMidYMid meet">
      {DEFS}
      <path d="M 80 250 L 520 250 L 560 220 L 120 220 Z" className="ink-faint" />
      <path d={top} className="ink fill-paper" />
      <path d="M 240 248 L 280 280 L 400 280 L 440 248" className="accent" strokeWidth="2.2" fill="none" />
      <path d={front} fill="url(#hatch)" className="ink" />
      <line x1="150" y1="252" x2="150" y2="340" className="ink" />
      <line x1="158" y1="252" x2="158" y2="340" className="ink" />
      <line x1="540" y1="248" x2="540" y2="340" className="ink" />
      <line x1="548" y1="248" x2="548" y2="340" className="ink" />
      <line x1="146" y1="340" x2="162" y2="340" className="ink" />
      <line x1="536" y1="340" x2="552" y2="340" className="ink" />
      <line x1="60" y1="345" x2="560" y2="345" className="ink-faint" />
      <text x={580} y={48} textAnchor="end" className="label">ISO · 03 CHAMFER</text>
      <Annotation x={340} y={280} dx={120} dy={20} label="straight bevels" />
    </svg>
  );
}

/* ============================================================
   4. KIDNEY — asymmetric, biased to dominant hand
   ============================================================ */
function PlanKidney() {
  // wider scoop on right (mouse hand), shallower on left
  const path = `
    M 40 40
    L 560 40
    L 560 300
    L 420 300
    Q 360 220 300 240
    Q 240 260 200 300
    L 40 300
    Z
  `;
  return (
    <PlanFrame cutoutPath={path} title="PLAN · 04 KIDNEY">
      <line x1="300" y1="40" x2="300" y2="300" className="ink-faint" strokeDasharray="3 3" />
      <path d="M 200 300 Q 240 260 300 240 Q 360 220 420 300" className="accent" strokeWidth="2.2" fill="none" />
      <Annotation x={360} y={220} dx={120} dy={-20} label="deep side · 80mm" />
      <Annotation x={240} y={260} dx={-110} dy={20} label="shallow · 40mm" anchor="end" />
      <Annotation x={300} y={240} dx={0} dy={-30} label="biased · R-hand" />
    </PlanFrame>
  );
}
function IsoKidney() {
  const top = `
    M 120 220
    L 560 220
    L 560 240
    Q 470 244 420 270
    Q 360 290 300 280
    Q 240 270 200 280
    Q 160 290 120 240
    Z
  `;
  return (
    <svg viewBox="0 0 600 360" preserveAspectRatio="xMidYMid meet">
      {DEFS}
      <path d="M 80 250 L 520 250 L 560 220 L 120 220 Z" className="ink-faint" />
      <path d={top} className="ink fill-paper" />
      <path d="M 160 290 Q 200 280 240 270 Q 300 280 360 290 Q 400 280 420 270" className="accent" strokeWidth="2.2" fill="none" />
      <path d="M 120 240 Q 160 290 200 280 L 200 290 Q 160 300 120 250 Z M 420 270 Q 470 244 560 240 L 560 250 Q 470 254 420 280 Z" fill="url(#hatch)" className="ink" />
      <line x1="150" y1="252" x2="150" y2="340" className="ink" />
      <line x1="158" y1="252" x2="158" y2="340" className="ink" />
      <line x1="540" y1="248" x2="540" y2="340" className="ink" />
      <line x1="548" y1="248" x2="548" y2="340" className="ink" />
      <line x1="146" y1="340" x2="162" y2="340" className="ink" />
      <line x1="536" y1="340" x2="552" y2="340" className="ink" />
      <line x1="60" y1="345" x2="560" y2="345" className="ink-faint" />
      <text x={580} y={48} textAnchor="end" className="label">ISO · 04 KIDNEY</text>
      <Annotation x={400} y={285} dx={80} dy={20} label="mouse-hand bias" />
    </svg>
  );
}

/* ============================================================
   5. WATERFALL — soft scoop with rolled forearm rest
   ============================================================ */
function PlanWaterfall() {
  // crescent + rounded thicker front lip drawn as a second offset curve
  const path = `
    M 40 40
    L 560 40
    L 560 300
    L 380 300
    Q 300 230 220 300
    L 40 300
    Z
  `;
  return (
    <PlanFrame cutoutPath={path} title="PLAN · 05 WATERFALL">
      <line x1="300" y1="40" x2="300" y2="300" className="ink-faint" strokeDasharray="3 3" />
      {/* outer + inner curve to suggest rolled lip */}
      <path d="M 220 300 Q 300 230 380 300" className="accent" strokeWidth="2.2" fill="none" />
      <path d="M 215 300 Q 300 222 385 300" className="ink-faint" />
      <path d="M 210 300 Q 300 215 390 300" className="ink-faint" />
      <Annotation x={300} y={230} dx={120} dy={-25} label="depth · 70mm" />
      <Annotation x={300} y={222} dx={-100} dy={-30} label="rolled lip · r=18mm" anchor="end" />
    </PlanFrame>
  );
}
function IsoWaterfall() {
  const top = `
    M 120 220
    L 560 220
    L 560 240
    Q 460 245 420 270
    Q 360 305 300 305
    Q 240 305 180 270
    Q 140 245 120 240
    Z
  `;
  return (
    <svg viewBox="0 0 600 360" preserveAspectRatio="xMidYMid meet">
      {DEFS}
      <path d="M 80 250 L 520 250 L 560 220 L 120 220 Z" className="ink-faint" />
      <path d={top} className="ink fill-paper" />
      {/* rolled-lip stack */}
      <path d="M 180 270 Q 240 305 300 305 Q 360 305 420 270" className="accent" strokeWidth="2.4" fill="none" />
      <path d="M 184 274 Q 240 309 300 309 Q 360 309 416 274" className="ink-soft" />
      <path d="M 188 278 Q 240 313 300 313 Q 360 313 412 278" className="ink-faint" />
      <path d="M 120 240 Q 140 245 180 270 L 180 285 Q 140 260 120 255 Z M 420 270 Q 460 245 560 240 L 560 255 Q 460 260 420 285 Z" fill="url(#hatch)" className="ink" />
      <line x1="150" y1="252" x2="150" y2="340" className="ink" />
      <line x1="158" y1="252" x2="158" y2="340" className="ink" />
      <line x1="540" y1="248" x2="540" y2="340" className="ink" />
      <line x1="548" y1="248" x2="548" y2="340" className="ink" />
      <line x1="146" y1="340" x2="162" y2="340" className="ink" />
      <line x1="536" y1="340" x2="552" y2="340" className="ink" />
      <line x1="60" y1="345" x2="560" y2="345" className="ink-faint" />
      <text x={580} y={48} textAnchor="end" className="label">ISO · 05 WATERFALL</text>
      <Annotation x={300} y={313} dx={-90} dy={20} label="forearm rolls over edge" anchor="end" />
    </svg>
  );
}

window.PlanCrescent = PlanCrescent;
window.IsoCrescent = IsoCrescent;
window.PlanShallow = PlanShallow;
window.IsoShallow = IsoShallow;
window.PlanChamfer = PlanChamfer;
window.IsoChamfer = IsoChamfer;
window.PlanKidney = PlanKidney;
window.IsoKidney = IsoKidney;
window.PlanWaterfall = PlanWaterfall;
window.IsoWaterfall = IsoWaterfall;
