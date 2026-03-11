import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://byunfekhyjnbwcfriigw.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5dW5mZWtoeWpuYndjZnJpaWd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMTc5ODksImV4cCI6MjA4ODc5Mzk4OX0.gS9-h6zviXLv1tPdNw8jeu_Re2Vap9oCmqrcilSeUoQ"
);

const PASSCODE = "4994";
const STATUS_OPTIONS = ["Not Called","No Answer","Called Back Later","Spoke To Someone","Not Interested","Interested","Demo Booked","Sold ✅"];
const INTERESTED_OPTIONS = ["","Yes","No","Maybe"];
const STATE_OPTIONS = ["","NSW","VIC","QLD","SA","WA","TAS","NT","ACT"];
const REG_OPTIONS = ["","Daily Personal Activities","Group / Shared Living","Community Participation","Support Coordination","Therapeutic Supports","Behaviour Support","Other"];

const statusStyle = {
  "Not Called":        { bg: "#f1f0ff", color: "#9b8fd4", border: "#c4b8f5" },
  "No Answer":         { bg: "#fef9e7", color: "#b8940a", border: "#f5d76e" },
  "Called Back Later": { bg: "#e8f4fd", color: "#2980b9", border: "#7ec8e3" },
  "Spoke To Someone":  { bg: "#eaf0fb", color: "#3a5bbf", border: "#7b9ee8" },
  "Not Interested":    { bg: "#fdecea", color: "#c0392b", border: "#f1948a" },
  "Interested":        { bg: "#eaf7f2", color: "#1a8a5a", border: "#58d68d" },
  "Demo Booked":       { bg: "#f0eaff", color: "#7d3fc8", border: "#bb8fce" },
  "Sold ✅":           { bg: "#e9faf0", color: "#1a7a45", border: "#27ae60" },
};

const VeleriaLogo = () => (
  <img src="/logo.png" alt="Veleria" style={{ width: "48px", height: "48px", objectFit: "contain", borderRadius: "12px" }} />
);

// ─── Login Page ───────────────────────────────────────────────
function LoginPage({ onSuccess }) {
  const [code, setCode] = useState([]);
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePress = (n) => {
    if (success) return;
    if (n === "⌫") {
      setCode(prev => prev.slice(0, -1));
      setError(false);
      return;
    }
    if (code.length >= 4) return;
    const next = [...code, String(n)];
    setCode(next);
    setError(false);
    if (next.length === 4) {
      if (next.join("") === PASSCODE) {
        setSuccess(true);
        setTimeout(() => onSuccess(), 800);
      } else {
        setShake(true);
        setError(true);
        setTimeout(() => { setShake(false); setCode([]); }, 700);
      }
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#f0edff 0%,#e8f6fd 50%,#f5f0ff 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter','Segoe UI',sans-serif", padding: "20px", boxSizing: "border-box" }}>
      <style>{`
        @keyframes glow { 0%,100%{filter:drop-shadow(0 0 6px rgba(167,139,250,0.6)) drop-shadow(0 0 12px rgba(103,232,249,0.3))} 50%{filter:drop-shadow(0 0 14px rgba(167,139,250,0.95)) drop-shadow(0 0 28px rgba(103,232,249,0.65))} }
        @keyframes textglow { 0%,100%{text-shadow:0 0 8px rgba(167,139,250,0.5),0 0 16px rgba(103,232,249,0.3)} 50%{text-shadow:0 0 18px rgba(167,139,250,0.95),0 0 36px rgba(103,232,249,0.65)} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-8px)} 80%{transform:translateX(8px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .numkey:active { transform: scale(0.93); background: linear-gradient(135deg,#ede9fe,#dbeafe) !important; }
      `}</style>

      <div style={{ width: "100%", maxWidth: "340px", animation: "fadeUp 0.4s ease" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "32px", gap: "10px" }}>
          <div style={{ animation: "glow 3s ease-in-out infinite" }}><VeleriaLogo /></div>
          <h1 style={{ margin: 0, fontSize: "26px", fontWeight: 800, color: "#a78bfa", animation: "textglow 3s ease-in-out infinite" }}>Veleria</h1>
          <p style={{ margin: 0, fontSize: "10px", color: "#b8aee0", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase" }}>NDIS Cold Calling Sheet</p>
        </div>

        <div style={{ background: "white", borderRadius: "24px", border: "1.5px solid #e2dcf8", boxShadow: "0 8px 40px rgba(124,58,237,0.1)", padding: "28px 24px" }}>
          <h2 style={{ margin: "0 0 4px", fontSize: "17px", fontWeight: 700, color: "#3d3060", textAlign: "center" }}>Enter Passcode</h2>
          <p style={{ margin: "0 0 24px", fontSize: "12px", color: "#b8aee0", textAlign: "center" }}>Tap your 4-digit code</p>

          {/* Dot indicators */}
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginBottom: "24px", animation: shake ? "shake 0.6s ease" : "none" }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{
                width: "18px", height: "18px", borderRadius: "50%",
                background: error ? "#f1948a" : success ? "#58d68d" : i < code.length ? "linear-gradient(135deg,#a78bfa,#67e8f9)" : "transparent",
                border: `2px solid ${error ? "#f1948a" : success ? "#58d68d" : i < code.length ? "#a78bfa" : "#d8d0f7"}`,
                transition: "all 0.2s",
                boxShadow: i < code.length && !error ? "0 0 8px rgba(167,139,250,0.5)" : "none",
              }} />
            ))}
          </div>

          {error && <p style={{ textAlign: "center", color: "#c0392b", fontSize: "12px", fontWeight: 600, margin: "-8px 0 16px" }}>❌ Wrong passcode</p>}
          {success && <p style={{ textAlign: "center", color: "#1a8a5a", fontSize: "12px", fontWeight: 600, margin: "-8px 0 16px" }}>✅ Welcome back!</p>}

          {/* Numpad — no keyboard, pure tap */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "10px" }}>
            {[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map((n, i) => (
              <button key={i} className={n !== "" ? "numkey" : ""} onPointerDown={e => { e.preventDefault(); if (n !== "") handlePress(n); }}
                style={{
                  height: "58px", fontSize: "20px", fontWeight: 700,
                  background: n === "" ? "transparent" : "linear-gradient(135deg,#f5f0ff,#e8f6fd)",
                  border: n === "" ? "none" : "1.5px solid #e2dcf8",
                  borderRadius: "16px", cursor: n === "" ? "default" : "pointer",
                  color: n === "⌫" ? "#a78bfa" : "#7c3aed",
                  fontFamily: "inherit", transition: "transform 0.1s",
                  WebkitTapHighlightColor: "transparent", userSelect: "none",
                  touchAction: "manipulation",
                }}>
                {n}
              </button>
            ))}
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: "18px", fontSize: "11px", color: "#b8aee0", fontWeight: 600, letterSpacing: "1px" }}>
          VELERIA · NDIS CRM · {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}

// ─── Mobile Row Card ──────────────────────────────────────────
function MobileCard({ row, update, removeRow }) {
  const s = statusStyle[row.callStatus] || {};
  const base = { fontSize: "13px", padding: "8px 10px", border: "1.5px solid #e2dcf8", borderRadius: "10px", outline: "none", width: "100%", background: "#faf9ff", color: "#3d3060", fontFamily: "inherit", boxSizing: "border-box" };
  return (
    <div style={{ background: "white", borderRadius: "16px", border: "1.5px solid #e2dcf8", padding: "16px", marginBottom: "10px", boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: "#c4b5fd" }}>#{row.id}</span>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <span style={{ fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "20px", background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>{row.callStatus}</span>
          <button onClick={() => removeRow(row.id)} style={{ background: "#fdecea", border: "none", color: "#e74c3c", borderRadius: "8px", width: "26px", height: "26px", cursor: "pointer", fontSize: "14px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>×</button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        <div style={{ gridColumn: "1/-1" }}><label style={{ fontSize: "10px", color: "#b8aee0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Business Name</label><input placeholder="Business name" value={row.businessName} onChange={e => update(row.id,"businessName",e.target.value)} style={{ ...base, marginTop: "3px" }} /></div>
        <div><label style={{ fontSize: "10px", color: "#b8aee0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Contact</label><input placeholder="Contact name" value={row.contactName} onChange={e => update(row.id,"contactName",e.target.value)} style={{ ...base, marginTop: "3px" }} /></div>
        <div><label style={{ fontSize: "10px", color: "#b8aee0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Phone</label><input placeholder="04xx xxx xxx" value={row.phone} onChange={e => update(row.id,"phone",e.target.value)} style={{ ...base, marginTop: "3px" }} /></div>
        <div style={{ gridColumn: "1/-1" }}><label style={{ fontSize: "10px", color: "#b8aee0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Email</label><input placeholder="email@" value={row.email} onChange={e => update(row.id,"email",e.target.value)} style={{ ...base, marginTop: "3px" }} /></div>
        <div><label style={{ fontSize: "10px", color: "#b8aee0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>State</label><select value={row.state} onChange={e => update(row.id,"state",e.target.value)} style={{ ...base, marginTop: "3px" }}>{STATE_OPTIONS.map(s => <option key={s}>{s}</option>)}</select></div>
        <div><label style={{ fontSize: "10px", color: "#b8aee0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Interested?</label><select value={row.interested} onChange={e => update(row.id,"interested",e.target.value)} style={{ ...base, marginTop: "3px" }}>{INTERESTED_OPTIONS.map(s => <option key={s}>{s}</option>)}</select></div>
        <div style={{ gridColumn: "1/-1" }}><label style={{ fontSize: "10px", color: "#b8aee0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Call Status</label><select value={row.callStatus} onChange={e => update(row.id,"callStatus",e.target.value)} style={{ ...base, marginTop: "3px", background: s.bg, color: s.color, border: `1.5px solid ${s.border}`, fontWeight: 600 }}>{STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}</select></div>
        <div><label style={{ fontSize: "10px", color: "#b8aee0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Date</label><input type="date" value={row.date} onChange={e => update(row.id,"date",e.target.value)} style={{ ...base, marginTop: "3px" }} /></div>
        <div><label style={{ fontSize: "10px", color: "#b8aee0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Follow Up</label><input type="date" value={row.followUpDate} onChange={e => update(row.id,"followUpDate",e.target.value)} style={{ ...base, marginTop: "3px" }} /></div>
        <div style={{ gridColumn: "1/-1" }}><label style={{ fontSize: "10px", color: "#b8aee0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Notes</label><input placeholder="Notes..." value={row.notes} onChange={e => update(row.id,"notes",e.target.value)} style={{ ...base, marginTop: "3px" }} /></div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────
export default function App() {
  const [authed, setAuthed] = useState(false);
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  useEffect(() => {
    if (!authed) return;
    const fetchRows = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("cold_calls").select("*").order("id", { ascending: true });
      if (!error && data) setRows(data.map(r => ({ id: r.id, date: r.date||"", businessName: r.business_name||"", contactName: r.contact_name||"", phone: r.phone||"", email: r.email||"", state: r.state||"", registrationType: r.registration_type||"", callStatus: r.call_status||"Not Called", interested: r.interested||"", followUpDate: r.follow_up_date||"", notes: r.notes||"" })));
      setLoading(false);
    };
    fetchRows();
  }, [authed]);

  const update = async (id, field, value) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
    const fm = { date:"date", businessName:"business_name", contactName:"contact_name", phone:"phone", email:"email", state:"state", registrationType:"registration_type", callStatus:"call_status", interested:"interested", followUpDate:"follow_up_date", notes:"notes" };
    await supabase.from("cold_calls").update({ [fm[field]]: value }).eq("id", id);
  };

  const addRow = async () => {
    setSaving(true);
    const { data, error } = await supabase.from("cold_calls").insert([{ call_status: "Not Called" }]).select().single();
    if (!error && data) setRows(prev => [...prev, { id: data.id, date:"", businessName:"", contactName:"", phone:"", email:"", state:"", registrationType:"", callStatus:"Not Called", interested:"", followUpDate:"", notes:"" }]);
    setSaving(false);
  };

  const removeRow = async (id) => {
    setRows(prev => prev.filter(r => r.id !== id));
    await supabase.from("cold_calls").delete().eq("id", id);
  };

  const exportCSV = () => {
    const headers = ["#","Date","Business Name","Contact Name","Phone","Email","State","Registration Type","Call Status","Interested?","Follow Up Date","Notes"];
    const csvRows = [headers.join(","), ...rows.map(r => [r.id,r.date,`"${r.businessName}"`,`"${r.contactName}"`,r.phone,r.email,r.state,`"${r.registrationType}"`,r.callStatus,r.interested,r.followUpDate,`"${r.notes}"`].join(","))];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "veleria-ndis-cold-calls.csv"; a.click();
  };

  if (!authed) return <LoginPage onSuccess={() => setAuthed(true)} />;

  const filtered = rows.filter(r => !search || r.businessName.toLowerCase().includes(search.toLowerCase()) || r.contactName.toLowerCase().includes(search.toLowerCase()) || r.state.toLowerCase().includes(search.toLowerCase()));
  const stats = { total: rows.length, called: rows.filter(r => r.callStatus !== "Not Called").length, interested: rows.filter(r => ["Interested","Demo Booked"].includes(r.callStatus)).length, sold: rows.filter(r => r.callStatus === "Sold ✅").length };

  const base = { fontSize: "12px", padding: "5px 8px", border: "1.5px solid #e2dcf8", borderRadius: "8px", outline: "none", width: "100%", background: "#faf9ff", color: "#3d3060", fontFamily: "inherit", boxSizing: "border-box" };

  const COLS = [
    { label: "#",             flex: "0 0 32px" },
    { label: "Date",          flex: "0 0 110px" },
    { label: "Business Name", flex: "1.2 1 0" },
    { label: "Contact",       flex: "1 1 0" },
    { label: "Phone",         flex: "0 0 120px" },
    { label: "Email",         flex: "1 1 0" },
    { label: "State",         flex: "0 0 72px" },
    { label: "Reg. Type",     flex: "1 1 0" },
    { label: "Status",        flex: "0 0 140px" },
    { label: "Interested?",   flex: "0 0 85px" },
    { label: "Follow Up",     flex: "0 0 120px" },
    { label: "Notes",         flex: "1 1 0" },
    { label: "",              flex: "0 0 32px" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#f0edff 0%,#e8f6fd 50%,#f5f0ff 100%)", fontFamily: "'Inter','Segoe UI',sans-serif", padding: isMobile ? "16px 12px" : "24px 16px", overflowX: "hidden", boxSizing: "border-box", width: "100%" }}>
      <style>{`
        @keyframes glow { 0%,100%{filter:drop-shadow(0 0 6px rgba(167,139,250,0.6)) drop-shadow(0 0 12px rgba(103,232,249,0.3))} 50%{filter:drop-shadow(0 0 14px rgba(167,139,250,0.95)) drop-shadow(0 0 28px rgba(103,232,249,0.65))} }
        @keyframes textglow { 0%,100%{text-shadow:0 0 8px rgba(167,139,250,0.5),0 0 16px rgba(103,232,249,0.3)} 50%{text-shadow:0 0 18px rgba(167,139,250,0.95),0 0 36px rgba(103,232,249,0.65)} }
        input, select, button { -webkit-text-size-adjust: 100%; font-size: 16px !important; }
        @media (min-width: 768px) { input, select { font-size: 12px !important; } }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ animation: "glow 3s ease-in-out infinite" }}><VeleriaLogo /></div>
          <div>
            <h1 style={{ margin: 0, fontSize: isMobile ? "20px" : "22px", fontWeight: 800, color: "#a78bfa", animation: "textglow 3s ease-in-out infinite" }}>Veleria</h1>
            <p style={{ margin: 0, fontSize: "9px", color: "#b8aee0", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase" }}>NDIS Cold Calling Sheet</p>
          </div>
        </div>
        <button onClick={() => setAuthed(false)} style={{ fontSize: "11px", color: "#c4b5fd", background: "white", border: "1.5px solid #e2dcf8", borderRadius: "20px", padding: "6px 12px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
          Lock 🔒
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: isMobile ? "8px" : "12px", marginBottom: "16px" }}>
        {[
          { label: "Leads",     value: stats.total,      icon: "📋", grad: "linear-gradient(135deg,#ede9fe,#ddd6fe)", border: "#c4b5fd", num: "#7c3aed" },
          { label: "Called",    value: stats.called,     icon: "📞", grad: "linear-gradient(135deg,#e0f2fe,#bae6fd)", border: "#7dd3fc", num: "#0284c7" },
          { label: "Hot 🔥",    value: stats.interested, icon: "🔥", grad: "linear-gradient(135deg,#fae8ff,#f0abfc)", border: "#e879f9", num: "#a21caf" },
          { label: "Sold 💰",   value: stats.sold,       icon: "✅", grad: "linear-gradient(135deg,#dcfce7,#bbf7d0)", border: "#6ee7b7", num: "#059669" },
        ].map((s, i) => (
          <div key={i} style={{ background: s.grad, border: `1.5px solid ${s.border}`, borderRadius: "14px", padding: isMobile ? "10px 10px" : "16px 18px", boxShadow: "0 2px 12px rgba(124,58,237,0.07)" }}>
            <div style={{ fontSize: isMobile ? "14px" : "18px", marginBottom: "2px" }}>{s.icon}</div>
            <div style={{ fontSize: isMobile ? "20px" : "26px", fontWeight: 800, color: s.num, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: isMobile ? "9px" : "10px", color: "#6b7280", fontWeight: 600, marginTop: "3px", textTransform: "uppercase", letterSpacing: "0.4px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap" }}>
        <input placeholder="🔍  Search..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...base, flex: 1, minWidth: "140px", padding: "10px 14px", fontSize: "14px !important", borderRadius: "12px" }} />
        <button onClick={addRow} disabled={saving} style={{ padding: "10px 16px", fontSize: "13px", fontWeight: 700, color: "white", background: "linear-gradient(135deg,#7c3aed,#a855f7)", border: "none", borderRadius: "12px", cursor: "pointer", boxShadow: "0 4px 14px rgba(124,58,237,0.3)", touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}>+ Add</button>
        <button onClick={exportCSV} style={{ padding: "10px 16px", fontSize: "13px", fontWeight: 700, color: "white", background: "linear-gradient(135deg,#0ea5e9,#06b6d4)", border: "none", borderRadius: "12px", cursor: "pointer", boxShadow: "0 4px 14px rgba(6,182,212,0.3)", touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}>⬇ CSV</button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#a78bfa", fontSize: "14px", fontWeight: 600 }}>Loading...</div>
      ) : isMobile ? (
        // Mobile card view
        <div>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#b8aee0", fontSize: "13px" }}>No rows yet — tap + Add to start</div>
          ) : filtered.map(row => <MobileCard key={row.id} row={row} update={update} removeRow={removeRow} />)}
        </div>
      ) : (
        // Desktop table view
        <div style={{ background: "white", borderRadius: "20px", border: "1.5px solid #e2dcf8", boxShadow: "0 4px 30px rgba(124,58,237,0.08)", overflow: "hidden" }}>
          <div style={{ display: "flex", gap: "6px", padding: "11px 10px", background: "linear-gradient(135deg,#7c3aed 0%,#a855f7 50%,#06b6d4 100%)", alignItems: "center" }}>
            {COLS.map((c, i) => <div key={i} style={{ flex: c.flex, fontSize: "10px", fontWeight: 700, color: "white", letterSpacing: "0.7px", textTransform: "uppercase", whiteSpace: "nowrap", overflow: "hidden", minWidth: 0 }}>{c.label}</div>)}
          </div>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#b8aee0", fontSize: "13px" }}>No rows yet — hit + Add to get started</div>
          ) : filtered.map((row, idx) => (
            <div key={row.id} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "5px 10px", background: idx % 2 === 0 ? "#fff" : "#faf8ff", borderBottom: "1px solid #f0ebff", transition: "background 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f5f0ff"}
              onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? "#fff" : "#faf8ff"}
            >
              <div style={{ flex: COLS[0].flex, color: "#c4b5fd", fontWeight: 700, fontSize: "11px", minWidth: 0 }}>{idx+1}</div>
              <div style={{ flex: COLS[1].flex, minWidth: 0 }}><input type="date" value={row.date} onChange={e => update(row.id,"date",e.target.value)} style={base} /></div>
              <div style={{ flex: COLS[2].flex, minWidth: 0 }}><input placeholder="Business name" value={row.businessName} onChange={e => update(row.id,"businessName",e.target.value)} style={base} /></div>
              <div style={{ flex: COLS[3].flex, minWidth: 0 }}><input placeholder="Contact" value={row.contactName} onChange={e => update(row.id,"contactName",e.target.value)} style={base} /></div>
              <div style={{ flex: COLS[4].flex, minWidth: 0 }}><input placeholder="04xx xxx xxx" value={row.phone} onChange={e => update(row.id,"phone",e.target.value)} style={base} /></div>
              <div style={{ flex: COLS[5].flex, minWidth: 0 }}><input placeholder="email@" value={row.email} onChange={e => update(row.id,"email",e.target.value)} style={base} /></div>
              <div style={{ flex: COLS[6].flex, minWidth: 0 }}><select value={row.state} onChange={e => update(row.id,"state",e.target.value)} style={base}>{STATE_OPTIONS.map(s => <option key={s}>{s}</option>)}</select></div>
              <div style={{ flex: COLS[7].flex, minWidth: 0 }}><select value={row.registrationType} onChange={e => update(row.id,"registrationType",e.target.value)} style={base}>{REG_OPTIONS.map(s => <option key={s}>{s}</option>)}</select></div>
              <div style={{ flex: COLS[8].flex, minWidth: 0 }}><select value={row.callStatus} onChange={e => update(row.id,"callStatus",e.target.value)} style={{ ...base, background: statusStyle[row.callStatus]?.bg||"#faf9ff", color: statusStyle[row.callStatus]?.color||"#3d3060", fontWeight: 600, border: `1.5px solid ${statusStyle[row.callStatus]?.border||"#e2dcf8"}` }}>{STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}</select></div>
              <div style={{ flex: COLS[9].flex, minWidth: 0 }}><select value={row.interested} onChange={e => update(row.id,"interested",e.target.value)} style={base}>{INTERESTED_OPTIONS.map(s => <option key={s}>{s}</option>)}</select></div>
              <div style={{ flex: COLS[10].flex, minWidth: 0 }}><input type="date" value={row.followUpDate} onChange={e => update(row.id,"followUpDate",e.target.value)} style={base} /></div>
              <div style={{ flex: COLS[11].flex, minWidth: 0 }}><input placeholder="Notes..." value={row.notes} onChange={e => update(row.id,"notes",e.target.value)} style={base} /></div>
              <div style={{ flex: COLS[12].flex, minWidth: 0 }}><button onClick={() => removeRow(row.id)} style={{ background: "#fdecea", border: "none", color: "#e74c3c", borderRadius: "8px", width: "26px", height: "26px", cursor: "pointer", fontSize: "14px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button></div>
            </div>
          ))}
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: "16px" }}>
        <p style={{ margin: 0, fontSize: "11px", color: "#b8aee0", fontWeight: 600, letterSpacing: "1px" }}>VELERIA · NDIS CRM · {new Date().getFullYear()}</p>
      </div>
    </div>
  );
}