const { useState, useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "grid": true,
  "annotations": true,
  "mode": "day",
  "accent": "#c2553a",
  "view": "both"
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    document.body.dataset.grid = tweaks.grid ? "on" : "off";
    document.body.dataset.annotations = tweaks.annotations ? "on" : "off";
    document.body.dataset.mode = tweaks.mode;
    document.body.dataset.view = tweaks.view;
    document.documentElement.style.setProperty("--accent", tweaks.accent);
  }, [tweaks]);

  const cards = [
    {
      num: "01",
      title: "Crescent",
      tagline: "smooth concave arc · the classic",
      Plan: window.PlanCrescent,
      Iso: window.IsoCrescent,
      notes: {
        Width: "320 mm",
        Depth: "70 mm",
        Profile: "single radius · R200",
        Edge: "1.5 mm round-over",
        Pros: "supports both forearms · symmetric",
        Cons: "fixed center-only zone",
      },
    },
    {
      num: "02",
      title: "Shallow",
      tagline: "wide gentle arc · low commitment",
      Plan: window.PlanShallow,
      Iso: window.IsoShallow,
      notes: {
        Width: "640 mm",
        Depth: "40 mm",
        Profile: "broad radius · R1100",
        Edge: "1.5 mm round-over",
        Pros: "less surface lost · accommodating",
        Cons: "less ergonomic effect",
      },
    },
    {
      num: "03",
      title: "Chamfer",
      tagline: "angular trapezoid · machinist look",
      Plan: window.PlanChamfer,
      Iso: window.IsoChamfer,
      notes: {
        Width: "320 mm",
        Depth: "60 mm",
        Profile: "two 56° bevels + flat",
        Edge: "crisp · 0.5 mm break",
        Pros: "easy to machine · graphic",
        Cons: "hard corners on forearms",
      },
    },
    {
      num: "04",
      title: "Kidney",
      tagline: "asymmetric · biased to mouse hand",
      Plan: window.PlanKidney,
      Iso: window.IsoKidney,
      notes: {
        Width: "440 mm",
        Depth: "80 / 40 mm",
        Profile: "compound curve · R260+R180",
        Edge: "1.5 mm round-over",
        Pros: "more room for mouse-hand range",
        Cons: "handed · L vs R version needed",
      },
    },
    {
      num: "05",
      title: "Waterfall",
      tagline: "scoop + rolled forearm lip",
      Plan: window.PlanWaterfall,
      Iso: window.IsoWaterfall,
      notes: {
        Width: "320 mm",
        Depth: "70 mm",
        Profile: "R200 plan · R18 edge roll",
        Edge: "rolled · 18mm radius",
        Pros: "soft on forearms · no hard edge",
        Cons: "thicker stock required",
      },
    },
  ];

  return (
    <div className="page">
      <header className="masthead">
        <div>
          <h1>ergonomic edge cut-outs</h1>
          <div className="subtitle">RECTANGULAR TABLETOP · 1500 × 750 MM · 5 PROFILE STUDIES</div>
        </div>
        <div className="meta">
          <div>v0.2 · profile study</div>
          <div>plan + iso views</div>
          <div>aesthetic: minimal scandi</div>
        </div>
      </header>

      <p className="intro">
        Same rectangular table — five different shapes for the <span className="accent">front-edge cut-out</span>.
        Each card shows a top-down plan with dimensions and an iso 3-quarter view of the resulting edge.
        Toggle plan/iso/both via Tweaks to focus.
      </p>

      <div className="grid-cards">
        {cards.map(({ num, title, tagline, Plan, Iso, notes }) => (
          <div className="card" key={num} data-screen-label={`${num} ${title}`}>
            <div className="card-head">
              <span className="card-num">{num}</span>
              <span className="card-title">{title}</span>
            </div>
            <div className="card-tagline">{tagline}</div>
            <div className="card-views">
              <div className="card-view" data-kind="plan">
                <div className="card-svg-wrap">
                  <Plan />
                </div>
              </div>
              <div className="card-view" data-kind="iso">
                <div className="card-svg-wrap">
                  <Iso />
                </div>
              </div>
            </div>
            <div className="card-notes">
              {Object.entries(notes).map(([k, v]) => (
                <div key={k}>
                  <b>{k.toUpperCase()}</b> · {v}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="footer-note">
        <span>NEXT · pick a profile · CNC test piece · forearm-pressure test</span>
        <span>v0.2 · sketch · {new Date().toISOString().slice(0, 10)}</span>
      </div>

      <TweaksPanel title="Tweaks" defaultPosition={{ right: 24, bottom: 24 }}>
        <TweakSection title="Views">
          <TweakRadio
            label="Show"
            value={tweaks.view}
            options={[
              { value: "plan", label: "Plan" },
              { value: "iso", label: "Iso" },
              { value: "both", label: "Both" },
            ]}
            onChange={(v) => setTweak("view", v)}
          />
        </TweakSection>
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
