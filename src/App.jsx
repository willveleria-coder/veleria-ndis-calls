import { useState } from "react";

const defaultRows = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  date: "", time: "", businessName: "", contactName: "",
  phone: "", email: "", state: "", registrationType: "",
  callStatus: "Not Called", interested: "", followUpDate: "", notes: "",
}));

const loadRows = () => {
  try {
    const saved = localStorage.getItem("veleria-calls");
    return saved ? JSON.parse(saved) : defaultRows;
  } catch { return defaultRows; }
};

const STATUS_OPTIONS = ["Not Called", "No Answer", "Called Back Later", "Spoke To Someone", "Not Interested", "Interested", "Demo Booked", "Sold ✅"];
const INTERESTED_OPTIONS = ["", "Yes", "No", "Maybe"];
const STATE_OPTIONS = ["", "NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT"];
const REG_OPTIONS = ["", "Daily Personal Activities", "Group / Shared Living", "Community Participation", "Support Coordination", "Therapeutic Supports", "Behaviour Support", "Other"];

const statusStyle = {
  "Not Called":        { bg: "#f1f0ff", color: "#9b8fd4", dot: "#c4b8f5" },
  "No Answer":         { bg: "#fef9e7", color: "#b8940a", dot: "#f5d76e" },
  "Called Back Later": { bg: "#e8f4fd", color: "#2980b9", dot: "#7ec8e3" },
  "Spoke To Someone":  { bg: "#eaf0fb", color: "#3a5bbf", dot: "#7b9ee8" },
  "Not Interested":    { bg: "#fdecea", color: "#c0392b", dot: "#f1948a" },
  "Interested":        { bg: "#eaf7f2", color: "#1a8a5a", dot: "#58d68d" },
  "Demo Booked":       { bg: "#f0eaff", color: "#7d3fc8", dot: "#bb8fce" },
  "Sold ✅":           { bg: "#e9faf0", color: "#1a7a45", dot: "#27ae60" },
};

const VeleriaLogo = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <defs>
      <linearGradient id="lg1" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#a78bfa"/>
        <stop offset="100%" stopColor="#67e8f9"/>
      </linearGradient>
    </defs>
    <rect width="44" height="44" rx="14" fill="url(#lg1)"/>
    <text x="22" y="30" textAnchor="middle" fontSize="22" fontWeight="800" fill="white" fontFamily="Georgia, serif">V</text>
  </svg>
);

export default function App() {
  const [rows, setRows] = useState(loadRows);
  const [search, setSearch] = useState("");

  const saveRows = (updated) => {
    try { localStorage.setItem("veleria-calls", JSON.stringify(updated)); } catch {}
    setRows(updated);
  };

  const update = (id, field, value) => saveRows(rows.map(r => r.id === id ? { ...r, [field]: value } : r));

  const addRow = () => {
    const newId = rows.length > 0 ? Math.max(...rows.map(r => r.id)) + 1 : 1;
    saveRows([...rows, { id: newId, date: "", time: "", businessName: "", contactName: "", phone: "", email: "", state: "", registrationType: "", callStatus: "Not Called", interested: "", followUpDate: "", notes: "" }]);
  };

  const removeRow = (id) => saveRows(rows.filter(r => r.id !== id));

  const exportCSV = () => {
    const headers = ["#","Date","Time","Business Name","Contact Name","Phone","Email","State","Registration Type","Call Status","Interested?","Follow Up Date","Notes"];
    const csvRows = [headers.join(","), ...rows.map(r =>
      [r.id,r.date,r.time,`"${r.businessName}"`,`"${r.contactName}"`,r.phone,r.email,r.state,`"${r.registrationType}"`,r.callStatus,r.interested,r.followUpDate,`"${r.notes}"`].join(",")
    )];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "veleria-ndis-cold-calls.csv";
    a.click();
  };

  const filtered = rows.filter(r =>
    !search || r.businessName.toLowerCase().includes(search.toLowerCase()) ||
    r.contactName.toLowerCase().includes(search.toLowerCase()) ||
    r.state.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: rows.length,
    called: rows.filter(r => r.callStatus !== "Not Called").length,
    interested: rows.filter(r => ["Interested","Demo Booked"].includes(r.callStatus)).length,
    sold: rows.filter(r => r.callStatus === "Sold ✅").length,
  };

  const inp = {
    fontSize: "12px", padding: "6px 10px", border: "1.5px solid #e2dcf8",
    borderRadius: "10px", outline: "none", width: "100%", background: "#faf9ff",
    color: "#3d3060", fontFamily: "inherit",
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0edff 0%, #e8f6fd 50%, #f5f0ff 100%)", fontFamily: "'Inter', 'Segoe UI', sans-serif", padding: "28px 20px" }}>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <VeleriaLogo />
          <div>
            <h1 style={{ margin: 0, fontSize: "22px", fontWeight: 800, background: "linear-gradient(135deg, #7c3aed, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.5px" }}>Veleria</h1>
            <p style={{ margin: 0, fontSize: "11px", color: "#9b8fd4", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase" }}>NDIS Cold Calling Sheet</p>
          </div>
        </div>
        <div style={{ fontSize: "11px", color: "#a094c8", background: "white", border: "1.5px solid #e2dcf8", borderRadius: "20px", padding: "5px 14px", fontWeight: 600 }}>
          {new Date().toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "22px" }}>
        {[
          { label: "Total Leads", value: stats.total, icon: "📋", grad: "linear-gradient(135deg, #ede9fe, #ddd6fe)", border: "#c4b5fd", num: "#7c3aed" },
          { label: "Calls Made", value: stats.called, icon: "📞", grad: "linear-gradient(135deg, #e0f2fe, #bae6fd)", border: "#7dd3fc", num: "#0284c7" },
          { label: "Interested", value: stats.interested, icon: "🔥", grad: "linear-gradient(135deg, #fae8ff, #f0abfc)", border: "#e879f9", num: "#a21caf" },
          { label: "Sold 💰", value: stats.sold, icon: "✅", grad: "linear-gradient(135deg, #dcfce7, #bbf7d0)", border: "#6ee7b7", num: "#059669" },
        ].map((s, i) => (
          <div key={i} style={{ background: s.grad, border: `1.5px solid ${s.border}`, borderRadius: "18px", padding: "18px 20px", boxShadow: "0 2px 12px rgba(124,58,237,0.07)" }}>
            <div style={{ fontSize: "20px", marginBottom: "6px" }}>{s.icon}</div>
            <div style={{ fontSize: "28px", fontWeight: 800, color: s.num, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: "11px", color: "#6b7280", fontWeight: 600, marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap", alignItems: "center" }}>
        <input
          placeholder="🔍   Search business, contact, state..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ ...inp, flex: 1, minWidth: "220px", padding: "10px 16px", fontSize: "13px", borderRadius: "14px", border: "1.5px solid #d8d0f7" }}
        />
        <button onClick={addRow} style={{ padding: "10px 20px", fontSize: "13px", fontWeight: 700, color: "white", background: "linear-gradient(135deg, #7c3aed, #a855f7)", border: "none", borderRadius: "14px", cursor: "pointer", boxShadow: "0 4px 14px rgba(124,58,237,0.3)" }}>
          + Add Row
        </button>
        <button onClick={exportCSV} style={{ padding: "10px 20px", fontSize: "13px", fontWeight: 700, color: "white", background: "linear-gradient(135deg, #0ea5e9, #06b6d4)", border: "none", borderRadius: "14px", cursor: "pointer", boxShadow: "0 4px 14px rgba(6,182,212,0.3)" }}>
          ⬇ Export CSV
        </button>
      </div>

      <div style={{ background: "white", borderRadius: "20px", border: "1.5px solid #e2dcf8", boxShadow: "0 4px 30px rgba(124,58,237,0.08)", overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "1420px", fontSize: "12px" }}>
          <thead>
            <tr style={{ background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #06b6d4 100%)" }}>
              {["#","Date","Time","Business Name","Contact Name","Phone","Email","State","Registration Type","Call Status","Interested?","Follow Up","Notes",""].map((h, i) => (
                <th key={i} style={{ padding: "14px 12px", textAlign: "left", color: "white", fontWeight: 700, fontSize: "11px", letterSpacing: "0.8px", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, idx) => (
              <tr key={row.id} style={{ background: idx % 2 === 0 ? "#ffffff" : "#faf8ff", borderBottom: "1px solid #f0ebff" }}
                onMouseEnter={e => e.currentTarget.style.background = "#f5f0ff"}
                onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? "#ffffff" : "#faf8ff"}
              >
                <td style={{ padding: "10px 12px", color: "#c4b5fd", fontWeight: 700 }}>{row.id}</td>
                <td style={{ padding: "6px 8px" }}><input type="date" value={row.date} onChange={e => update(row.id,"date",e.target.value)} style={inp} /></td>
                <td style={{ padding: "6px 8px" }}><input type="time" value={row.time} onChange={e => update(row.id,"time",e.target.value)} style={{...inp, minWidth:"90px"}} /></td>
                <td style={{ padding: "6px 8px" }}><input placeholder="Business name" value={row.businessName} onChange={e => update(row.id,"businessName",e.target.value)} style={{...inp, minWidth:"160px"}} /></td>
                <td style={{ padding: "6px 8px" }}><input placeholder="Contact name" value={row.contactName} onChange={e => update(row.id,"contactName",e.target.value)} style={{...inp, minWidth:"130px"}} /></td>
                <td style={{ padding: "6px 8px" }}><input placeholder="04xx xxx xxx" value={row.phone} onChange={e => update(row.id,"phone",e.target.value)} style={{...inp, minWidth:"120px"}} /></td>
                <td style={{ padding: "6px 8px" }}><input placeholder="email@" value={row.email} onChange={e => update(row.id,"email",e.target.value)} style={{...inp, minWidth:"150px"}} /></td>
                <td style={{ padding: "6px 8px" }}>
                  <select value={row.state} onChange={e => update(row.id,"state",e.target.value)} style={{...inp, minWidth:"68px"}}>
                    {STATE_OPTIONS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td style={{ padding: "6px 8px" }}>
                  <select value={row.registrationType} onChange={e => update(row.id,"registrationType",e.target.value)} style={{...inp, minWidth:"160px"}}>
                    {REG_OPTIONS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td style={{ padding: "6px 8px" }}>
                  <select value={row.callStatus} onChange={e => update(row.id,"callStatus",e.target.value)}
                    style={{...inp, minWidth:"145px", background: statusStyle[row.callStatus]?.bg || "#faf9ff", color: statusStyle[row.callStatus]?.color || "#3d3060", fontWeight: 600, border: `1.5px solid ${statusStyle[row.callStatus]?.dot || "#e2dcf8"}`}}>
                    {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td style={{ padding: "6px 8px" }}>
                  <select value={row.interested} onChange={e => update(row.id,"interested",e.target.value)} style={{...inp, minWidth:"80px"}}>
                    {INTERESTED_OPTIONS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td style={{ padding: "6px 8px" }}><input type="date" value={row.followUpDate} onChange={e => update(row.id,"followUpDate",e.target.value)} style={inp} /></td>
                <td style={{ padding: "6px 8px" }}><input placeholder="Notes..." value={row.notes} onChange={e => update(row.id,"notes",e.target.value)} style={{...inp, minWidth:"180px"}} /></td>
                <td style={{ padding: "6px 10px" }}>
                  <button onClick={() => removeRow(row.id)} style={{ background: "#fdecea", border: "none", color: "#e74c3c", borderRadius: "8px", width: "26px", height: "26px", cursor: "pointer", fontSize: "16px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <p style={{ margin: 0, fontSize: "11px", color: "#b8aee0", fontWeight: 600, letterSpacing: "1px" }}>VELERIA · NDIS CRM · {new Date().getFullYear()}</p>
      </div>
    </div>
  );
}