import { useState, useEffect } from "react";

const batches = [
  {
    id: 1,
    name: "Chassis hinges",
    date: "Jan 12",
    daysHeld: 42,
    value: 820000,
    tariffRate: 0.25,
  },
  {
    id: 2,
    name: "Body brackets",
    date: "Jan 28",
    daysHeld: 26,
    value: 640000,
    tariffRate: 0.25,
  },
  {
    id: 3,
    name: "Forged components",
    date: "Feb 3",
    daysHeld: 20,
    value: 540000,
    tariffRate: 0.25,
  },
  {
    id: 4,
    name: "Propulsion parts",
    date: "Feb 14",
    daysHeld: 9,
    value: 400000,
    tariffRate: 0.25,
  },
];

const CURRENT_CASH = 1140000;
const DAILY_BURN = 17419;
const RECEIVABLE_AMOUNT = 340000;
const RECEIVABLE_DAYS = 14;

function fmt(n) {
  if (n >= 1000000) return "$" + (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return "$" + Math.round(n / 1000) + "K";
  return "$" + Math.round(n);
}

function Badge({ status }) {
  const map = {
    green: {
      label: "Release now",
      bg: "#ECFDF5",
      color: "#065F46",
      border: "#6EE7B7",
    },
    amber: {
      label: "Hold 14 days",
      bg: "#FFFBEB",
      color: "#92400E",
      border: "#FCD34D",
    },
    red: {
      label: "Hold — wait",
      bg: "#FEF2F2",
      color: "#991B1B",
      border: "#FCA5A5",
    },
  };
  const s = map[status];
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.03em",
        padding: "3px 9px",
        borderRadius: 20,
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
      }}
    >
      {s.label}
    </span>
  );
}

function getStatus(runwayAfter) {
  if (runwayAfter > 45) return "green";
  if (runwayAfter >= 30) return "amber";
  return "red";
}

export default function FTZDashboard() {
  const [releasePct, setReleasePct] = useState(100);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimated(true), 100);
  }, []);

  const totalInventory = batches.reduce((s, b) => s + b.value, 0);
  const releaseValue = totalInventory * (releasePct / 100);
  const tariffDue = Math.round(releaseValue * 0.25);
  const cashAfter = CURRENT_CASH - tariffDue;
  const runwayAfter = Math.round(cashAfter / DAILY_BURN);
  const baseRunway = Math.round(CURRENT_CASH / DAILY_BURN);
  const overallStatus = getStatus(runwayAfter);

  const recMap = {
    green: {
      label: "Safe to release",
      desc: `Runway stays at ${runwayAfter} days after tariff payment. Proceed.`,
      color: "#065F46",
      bg: "#ECFDF5",
      bar: "#10B981",
    },
    amber: {
      label: "Hold recommended",
      desc: `GM receivable of ${fmt(
        RECEIVABLE_AMOUNT
      )} clears in ${RECEIVABLE_DAYS} days. Release after that to protect runway.`,
      color: "#92400E",
      bg: "#FFFBEB",
      bar: "#F59E0B",
    },
    red: {
      label: "Do not release",
      desc: `Runway drops to ${runwayAfter} days — below safe threshold. Hold until cash position improves.`,
      color: "#991B1B",
      bg: "#FEF2F2",
      bar: "#EF4444",
    },
  };
  const rec = recMap[overallStatus];

  const metrics = [
    {
      label: "Inventory in FTZ",
      value: fmt(releaseValue),
      sub: "Components held",
    },
    {
      label: "Tariff if released today",
      value: fmt(tariffDue),
      sub: "At 25% China rate",
    },
    {
      label: "Cash runway after",
      value: `${runwayAfter} days`,
      sub: `Down from ${baseRunway} days`,
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F7F6F3",
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
        padding: "32px 24px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .row-hover:hover { background: #F9F8F6 !important; }
        input[type=range] { -webkit-appearance: none; width: 100%; height: 4px; border-radius: 4px; background: #E5E3DC; outline: none; cursor: pointer; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; background: #1A1A1A; cursor: pointer; border: 2px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.2); }
        .fade-in { opacity: 0; transform: translateY(8px); transition: opacity 0.4s ease, transform 0.4s ease; }
        .fade-in.show { opacity: 1; transform: translateY(0); }
      `}</style>

      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        {/* Header */}
        <div
          className={`fade-in ${animated ? "show" : ""}`}
          style={{ marginBottom: 32, transitionDelay: "0ms" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  color: "#999",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                Fennworth Capital
              </div>
              <h1
                style={{
                  fontSize: 24,
                  fontWeight: 600,
                  color: "#1A1A1A",
                  letterSpacing: "-0.02em",
                }}
              >
                FTZ Release Intelligence
              </h1>
              <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>
                Lucerne International — Auburn Hills, MI
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "#999", marginBottom: 4 }}>
                Last updated
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#1A1A1A",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                Apr 14, 2026
              </div>
            </div>
          </div>
          <div style={{ marginTop: 16, height: 1, background: "#E8E6DF" }} />
        </div>

        {/* Metric cards */}
        <div
          className={`fade-in ${animated ? "show" : ""}`}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0,1fr))",
            gap: 12,
            marginBottom: 16,
            transitionDelay: "80ms",
          }}
        >
          {metrics.map((m, i) => (
            <div
              key={i}
              style={{
                background: "#fff",
                border: "1px solid #E8E6DF",
                borderRadius: 10,
                padding: "16px 18px",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: "#999",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  marginBottom: 8,
                }}
              >
                {m.label}
              </div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 600,
                  color: "#1A1A1A",
                  letterSpacing: "-0.02em",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                {m.value}
              </div>
              <div style={{ fontSize: 12, color: "#AAA", marginTop: 4 }}>
                {m.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Slider */}
        <div
          className={`fade-in ${animated ? "show" : ""}`}
          style={{
            background: "#fff",
            border: "1px solid #E8E6DF",
            borderRadius: 10,
            padding: "18px 20px",
            marginBottom: 12,
            transitionDelay: "140ms",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 500, color: "#555" }}>
              Simulate release amount
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#1A1A1A",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              {releasePct}% — {fmt(releaseValue)}
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={releasePct}
            onChange={(e) => setReleasePct(Number(e.target.value))}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 11,
              color: "#BBB",
              marginTop: 6,
            }}
          >
            <span>Hold all</span>
            <span>Release all</span>
          </div>
        </div>

        {/* Recommendation */}
        <div
          className={`fade-in ${animated ? "show" : ""}`}
          style={{
            background: rec.bg,
            border: `1px solid ${rec.bar}40`,
            borderRadius: 10,
            padding: "14px 18px",
            marginBottom: 16,
            transitionDelay: "180ms",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: rec.bar,
                flexShrink: 0,
              }}
            />
            <div style={{ fontSize: 13, fontWeight: 600, color: rec.color }}>
              {rec.label}
            </div>
          </div>
          <div
            style={{
              fontSize: 13,
              color: rec.color,
              opacity: 0.85,
              marginTop: 6,
              lineHeight: 1.5,
              paddingLeft: 18,
            }}
          >
            {rec.desc}
          </div>
        </div>

        {/* Batch table */}
        <div
          className={`fade-in ${animated ? "show" : ""}`}
          style={{
            background: "#fff",
            border: "1px solid #E8E6DF",
            borderRadius: 10,
            overflow: "hidden",
            transitionDelay: "220ms",
          }}
        >
          <div
            style={{ padding: "14px 20px", borderBottom: "1px solid #F0EDE6" }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#555",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
              }}
            >
              Inventory breakdown by batch
            </div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#FAFAF8" }}>
                {["Batch", "Value", "Days held", "Tariff due", "Status"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        fontSize: 11,
                        fontWeight: 500,
                        color: "#999",
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                        padding: "10px 20px",
                        textAlign: "left",
                        borderBottom: "1px solid #F0EDE6",
                      }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {batches.map((b, i) => {
                const batchRelease = b.value * (releasePct / 100);
                const batchTariff = Math.round(batchRelease * b.tariffRate);
                const cashAfterThis = CURRENT_CASH - batchTariff;
                const runwayThis = Math.round(cashAfterThis / DAILY_BURN);
                const s = getStatus(runwayThis);
                return (
                  <tr
                    key={b.id}
                    className="row-hover"
                    style={{
                      borderBottom:
                        i < batches.length - 1 ? "1px solid #F5F3EF" : "none",
                      transition: "background 0.15s",
                    }}
                  >
                    <td style={{ padding: "12px 20px" }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: "#1A1A1A",
                        }}
                      >
                        {b.name}
                      </div>
                      <div
                        style={{ fontSize: 11, color: "#AAA", marginTop: 2 }}
                      >
                        {b.date}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "12px 20px",
                        fontSize: 13,
                        fontFamily: "'DM Mono', monospace",
                        color: "#333",
                      }}
                    >
                      {fmt(b.value)}
                    </td>
                    <td
                      style={{
                        padding: "12px 20px",
                        fontSize: 13,
                        color: "#555",
                      }}
                    >
                      {b.daysHeld} days
                    </td>
                    <td
                      style={{
                        padding: "12px 20px",
                        fontSize: 13,
                        fontFamily: "'DM Mono', monospace",
                        color: "#333",
                      }}
                    >
                      {fmt(batchTariff)}
                    </td>
                    <td style={{ padding: "12px 20px" }}>
                      <Badge status={s} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Receivable notice */}
        <div
          className={`fade-in ${animated ? "show" : ""}`}
          style={{
            marginTop: 12,
            padding: "12px 16px",
            background: "#F0F9FF",
            border: "1px solid #BAE6FD",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            gap: 10,
            transitionDelay: "280ms",
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#0284C7",
              flexShrink: 0,
            }}
          />
          <div style={{ fontSize: 12, color: "#0369A1" }}>
            <strong>Incoming:</strong> GM receivable of {fmt(RECEIVABLE_AMOUNT)}{" "}
            expected in {RECEIVABLE_DAYS} days — will restore runway to{" "}
            {Math.round(
              (CURRENT_CASH + RECEIVABLE_AMOUNT - tariffDue) / DAILY_BURN
            )}{" "}
            days post-release.
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: 24,
            fontSize: 11,
            color: "#CCC",
            textAlign: "center",
          }}
        >
          Fennworth Capital — FTZ Financial Intelligence —
          fennworthcapital@gmail.com
        </div>
      </div>
    </div>
  );
}
