const { useState, useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "grid": true,
  "annotations": true,
  "mode": "day",
  "accent": "#c2553a"
}/*EDITMODE-END*/;

const HeroIso = window.HeroIso;
const PlanView = window.PlanView;
const SideElevation = window.SideElevation;
const EdgeDetail = window.EdgeDetail;
const SubVariants = window.SubVariants;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    document.body.dataset.grid = tweaks.grid ? "on" : "off";
    document.body.dataset.annotations = tweaks.annotations ? "on" : "off";
    document.body.dataset.mode = tweaks.mode;
    document.documentElement.style.setProperty("--accent", tweaks.accent);
  }, [tweaks]);

  return (
    <div className="page">
      <header className="masthead">
        <div>
          <h1>03 · chamfer</h1>
          <div className="subtitle">DESIGN STUDY · ANGULAR TRAPEZOID CUT-OUT · 1500 × 750 MM</div>
        </div>
        <div className="meta">
          <div>v0.3 · profile detail</div>
          <div>plan · iso · section · variants</div>
          <div>material: solid white oak · 30mm</div>
        </div>
      </header>

      <p className="intro">
        Rectangular tabletop with rounded outer corners (R 60 mm) and a <span className="accent">trapezoidal cut-out</span> at
        the front edge with smaller rounded inner corners (r 20 mm). Two straight bevels meeting a flat — softened just enough to remove sharp edges from forearms and hips.
      </p>

      <section className="study">
        <div className="study-block plan-only">
          <div className="block-tag">PLAN</div>
          <div className="card-svg-wrap"><PlanView /></div>
        </div>

        <div className="study-block spec-block">
          <div className="block-tag">SPEC</div>
          <div className="spec">
            <div className="spec-row"><b>OVERALL</b><span>1500 × 750 mm</span></div>
            <div className="spec-row"><b>OUTER CORNERS</b><span>R 60 mm · 4×</span></div>
            <div className="spec-row"><b>CUT-OUT WIDTH</b><span>240 mm at edge · 120 mm flat</span></div>
            <div className="spec-row"><b>CUT-OUT DEPTH</b><span>60 mm</span></div>
            <div className="spec-row"><b>CUT-OUT CORNERS</b><span>r 20 mm · 4×</span></div>
            <div className="spec-row"><b>BEVEL ANGLE</b><span>56° from edge</span></div>
            <div className="spec-row"><b>EDGE BREAK</b><span>0.5 mm eased · sanded #220</span></div>
            <div className="spec-row"><b>MATERIAL</b><span>white oak · rift-sawn · oil &amp; wax</span></div>
          </div>
        </div>
      </section>

      <div className="footer-note">
        <span>NEXT · CNC test piece in MDF · forearm-pressure trial · finish samples</span>
        <span>v0.3 · sketch · {new Date().toISOString().slice(0, 10)}</span>
      </div>

      <TweaksPanel title="Tweaks" defaultPosition={{ right: 24, bottom: 24 }}>
        <TweakSection title="Display">
          <TweakToggle label="Show grid" value={tweaks.grid} onChange={(v) => setTweak("grid", v)} />
          <TweakToggle label="Show annotations" value={tweaks.annotations} onChange={(v) => setTweak("annotations", v)} />
          <TweakRadio
            label="Lighting"
            value={tweaks.mode}
            options={[
              { value: "day", label: "Day" },
              { value: "night", label: "Night" },
            ]}
            onChange={(v) => setTweak("mode", v)}
          />
        </TweakSection>
        <TweakSection title="Style">
          <TweakColor label="Accent" value={tweaks.accent} onChange={(v) => setTweak("accent", v)} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
