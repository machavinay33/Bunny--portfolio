import { useEffect, useMemo, useState } from "react";

const silhouette = "M732,309 L723,302 L676,345 L672,323 L666,311 L655,300 L338,616 L323,620 L317,626 L314,634 L318,641 L333,656 L365,675 L392,684 L425,689 L458,688 L486,682 L528,664 L562,639 L535,610 L718,434 L738,410 L749,380 L750,353 L742,325 Z M565,642 L565,908 L911,907 L911,823 L886,825 L855,837 L835,855 L828,865 L819,820 L796,765 L770,727 L737,694 L704,671 L656,651 L614,643 Z M529,816 L528,815 L524,815 L523,816 L516,816 L515,817 L510,817 L509,818 L506,818 L505,819 L503,819 L502,820 L494,822 L487,826 L485,826 L483,828 L480,829 L478,831 L468,837 L449,856 L449,857 L446,860 L445,863 L439,871 L435,879 L435,881 L434,882 L434,884 L432,888 L432,891 L431,892 L431,896 L430,897 L430,908 L529,908 Z";

function Mark({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 1254 1254" aria-hidden="true"><circle className="bunny-ring" cx="624" cy="619" r="504.5" /><path className="bunny-silhouette" d={silhouette} /></svg>;
}

export default function BunnySignature() {
  const [hasVisited, setHasVisited] = useState(false);
  const [phase, setPhase] = useState<"intro" | "arrived" | "dissolve" | "complete">("intro");
  const particles = useMemo(() => Array.from({ length: 46 }, (_, i) => {
    const angle = (i / 46) * Math.PI * 2 + 0.2;
    const radius = 8 + (i % 7) * 3.4;
    return { id: i, x: Math.cos(angle) * radius * 1.1 - 10, y: Math.sin(angle) * radius * 1.4 - 30, tx: ((i * 17) % 20) - 10, ty: ((i * 29) % 20) - 10, size: 1.5 + (i % 4) * .45, delay: 1.55 + (i % 6) * .025 };
  }), []);

  useEffect(() => {
    const visited = window.localStorage.getItem("bunny-signature-seen") === "1";
    setHasVisited(visited);
    if (visited) { setPhase("complete"); return; }
    const timers = [
      window.setTimeout(() => setPhase("arrived"), 1550),
      window.setTimeout(() => setPhase("dissolve"), 1750),
      window.setTimeout(() => { setPhase("complete"); window.localStorage.setItem("bunny-signature-seen", "1"); }, 3250),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, []);

  const instant = hasVisited || phase === "complete";
  return <div className={`bunny-stage ${instant ? "is-complete" : ""}`} aria-label="Bunny logo signature animation">
    {!instant && <div className={`rabbit-rig ${phase === "arrived" ? "arrived" : ""} ${phase === "dissolve" ? "dissolving" : ""}`}>
      <svg viewBox="0 0 1254 1254"><line className="bunny-leg" x1="700" y1="900" x2="655" y2="1040" /><line className="bunny-leg bunny-back" x1="760" y1="905" x2="815" y2="1040" /><g className="bunny-ear"><path fill="currentColor" d="M732,309 L723,302 L676,345 L672,323 L666,311 L655,300 L338,616 L323,620 L317,626 L314,634 L318,641 L333,656 L365,675 L392,684 L425,689 L458,688 L486,682 L528,664 L562,639 L535,610 L718,434 L738,410 L749,380 L750,353 L742,325 Z" /></g><path fill="currentColor" d="M565,642 L565,908 L911,907 L911,823 L886,825 L855,837 L835,855 L828,865 L819,820 L796,765 L770,727 L737,694 L704,671 L656,651 L614,643 Z" /><path fill="currentColor" d="M529,816 L529,908 L430,908 L431,896 L432,888 L439,871 L449,856 L468,837 L487,826 L510,817 Z" /></svg>
    </div>}
    {!instant && <div className="bunny-particles">{particles.map(p => <i key={p.id} style={{ "--x0": `${p.x}px`, "--y0": `${p.y}px`, "--xt": `${p.tx}px`, "--yt": `${p.ty}px`, "--s": `${p.size}px`, "--d": `${p.delay}s` } as React.CSSProperties} />)}</div>}
    <div className="bunny-mark reveal"><Mark /></div>
    <div className="bunny-wordmark reveal">{["B", "U", "N", "N", "Y"].map((letter, i) => <span key={`${letter}-${i}`} style={{ animationDelay: `${2.55 + i * .1}s` }}>{letter}</span>)}</div>
    <div className="bunny-tagline reveal">BUILD&nbsp;•&nbsp;CREATE&nbsp;•&nbsp;INSPIRE</div>
  </div>;
}
