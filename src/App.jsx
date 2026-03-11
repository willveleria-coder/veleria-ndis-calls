import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://byunfekhyjnbwcfriigw.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5dW5mZWtoeWpuYndjZnJpaWd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMTc5ODksImV4cCI6MjA4ODc5Mzk4OX0.gS9-h6zviXLv1tPdNw8jeu_Re2Vap9oCmqrcilSeUoQ"
);

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

const COLS = [
  { label: "#",               flex: "0 0 36px" },
  { label: "Date",            flex: "0 0 120px" },
  { label: "Business Name",   flex: "1 1 0" },
  { label: "Contact Name",    flex: "1 1 0" },
  { label: "Phone",           flex: "0 0 130px" },
  { label: "Email",           flex: "1 1 0" },
  { label: "State",           flex: "0 0 80px" },
  { label: "Reg. Type",       flex: "1 1 0" },
  { label: "Call Status",     flex: "0 0 150px" },
  { label: "Interested?",     flex: "0 0 90px" },
  { label: "Follow Up",       flex: "0 0 130px" },
  { label: "Notes",           flex: "1 1 0" },
  { label: "",                flex: "0 0 36px" },
];

const VeleriaLogo = () => (
  <img src="/logo.png" alt="Veleria" style={{ width: "48px", height: "48px", objectFit: "contain", borderRadius: "12px" }} />
);

export default function App() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load all rows from Supabase
  useEffect(() => {
    const fetchRows = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("cold_calls")
        .select("*")
        .order("id", { ascending: true });
      if (!error && data) setRows(data.map(r => ({
        id: r.id,
        date: r.date || "",
        businessName: r.business_name || "",
        contactName: r.contact_name || "",
        phone: r.phone || "",
        email: r.email || "",
        state: r.state || "",
        registrationType: r.registration_type || "",
        callStatus: r.call_status || "Not Called",
        interested: r.interested || "",
        followUpDate: r.follow_up_date || "",
        notes: r.notes || "",
      })));
      setLoading(false);
    };
    fetchRows();
  }, []);

  // Update a single field on a row
  const update = async (id, field, value) => {
    // Update locally immediately for snappy UI
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
    // Map camelCase to snake_case for Supabase
    const fieldMap = {
      date: "date", businessName: "business_name", contactName: "contact_name",
      phone: "phone", email: "email", state: "state",
      registrationType: "registration_type", callStatus: "call_status",
      interested: "interested", followUpDate: "follow_up_date", notes: "notes",
    };
    await supabase.from("cold_calls").update({ [fieldMap[field]]: value }).eq("id", id);
  };

  const addRow = async () => {
    setSaving(true);
    const { data, error } = await supabase
      .from("cold_calls")
      .insert([{ call_status: "Not Called" }])
      .select()
      .single();
    if (!error && data) {
      setRows(prev => [...prev, {
        id: data.id, date: "", businessName: "", contactName: "",
        phone: "", email: "", state: "", registrationType: "",
        callStatus: "Not Called", interested: "", followUpDate: "", notes: "",
      }]);
    }
    setSaving(false);
  };

  const removeRow = async (id) => {
    setRows(prev => prev.filter(r => r.id !== id));
    await supabase.from("cold_calls").delete().eq("id", id);
  };

  const exportCSV = () => {
    const headers = ["#","Date","Business Name","Contact Name","Phone","Email","State","Registration Type","Call Status","Interested?","Follow Up Date","Notes"];
    const csvRows = [headers.join(","), ...rows.map(r =>
      [r.id,r.date,`"${r.businessName}"`,`"${r.contactName}"`,r.phone,r.email,r.state,`"${r.registrationType}"`,r.callStatus,r.interested,r.followUpDate,`"${r.notes}"`].join(",")
    )];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "veleria-ndis-cold-calls.csv";
    a.click();
  };

  const filtered = rows.filter(r =>
    !search ||
    r.businessName.toLowerCase().includes(search.toLowerCase()) ||
    r.contactName.toLowerCase().includes(search.toLowerCase()) ||
    r.state.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: rows.length,
    called: rows.filter(r => r.callStatus !== "Not Called").length,
    interested: rows.filter(r => ["Interested","Demo Booked"].includes(r.callStatus)).length,
    sold: rows.filter(r => r.callStatus === "Sold ✅").length,
  };

  const base = {
    fontSize: "12px", padding: "5px 8px", border: "1.5px solid #e2dcf8",
    borderRadius: "8px", outline: "none", width: "100%", background: "#faf9ff",
    color: "#3d3060", fontFamily: "inherit", boxSizing: "border-box",
  };

  const rowStyle = (idx) => ({
    display: "flex", alignItems: "center", gap: "6px",
    padding: "6px 12px",
    background: idx % 2 === 0 ? "#ffffff" : "#faf8ff",
    borderBottom: "1px solid #f0ebff",
    transition: "background 0.15s",
  });

  const headCell = (flex) => ({
    flex, fontSize: "10px", fontWeight: 700, color: "white",
    letterSpacing: "0.8px", textTransform: "uppercase", whiteSpace: "nowrap",
    overflow: "hidden", minWidth: 0,
  });

  const cell = (flex) => ({ flex, minWidth: 0, overflow: "hidden" });

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#f0edff 0%,#e8f6fd 50%,#f5f0ff 100%)", fontFamily: "'Inter','Segoe UI',sans-serif", padding: "24px 16px", overflowX: "hidden", boxSizing: "border-box", width: "100%" }}>
      <style>{`
        @keyframes glow {
          0%,100% { filter: drop-shadow(0 0 6px rgba(167,139,250,0.6)) drop-shadow(0 0 12px rgba(103,232,249,0.3)); }
          50% { filter: drop-shadow(0 0 14px rgba(167,139,250,0.95)) drop-shadow(0 0 28px rgba(103,232,249,0.65)); }
        }
        @keyframes textglow {
          0%,100% { text-shadow: 0 0 8px rgba(167,139,250,0.5),0 0 16px rgba(103,232,249,0.3); }
          50% { text-shadow: 0 0 18px rgba(167,139,250,0.95),0 0 36px rgba(103,232,249,0.65); }
        }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ animation: "glow 3s ease-in-out infinite" }}><VeleriaLogo /></div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
            <h1 style={{ margin: 0, fontSize: "22px", fontWeight: 800, color: "#a78bfa", animation: "textglow 3s ease-in-out infinite", letterSpacing: "-0.3px" }}>Veleria</h1>
            <p style={{ margin: 0, fontSize: "10px", color: "#b8aee0", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase" }}>NDIS Cold Calling Sheet</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          {saving && <span style={{ fontSize: "11px", color: "#a78bfa", fontWeight: 600 }}>Saving...</span>}
          <div style={{ fontSize: "11px", color: "#a094c8", background: "white", border: "1.5px solid #e2dcf8", borderRadius: "20px", padding: "5px 14px", fontWeight: 600 }}>
            {new Date().toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px", marginBottom: "20px" }}>
        {[
          { label: "Total Leads",  value: stats.total,     icon: "📋", grad: "linear-gradient(135deg,#ede9fe,#ddd6fe)", border: "#c4b5fd", num: "#7c3aed" },
          { label: "Calls Made",   value: stats.called,    icon: "📞", grad: "linear-gradient(135deg,#e0f2fe,#bae6fd)", border: "#7dd3fc", num: "#0284c7" },
          { label: "Interested",   value: stats.interested,icon: "🔥", grad: "linear-gradient(135deg,#fae8ff,#f0abfc)", border: "#e879f9", num: "#a21caf" },
          { label: "Sold 💰",      value: stats.sold,      icon: "✅", grad: "linear-gradient(135deg,#dcfce7,#bbf7d0)", border: "#6ee7b7", num: "#059669" },
        ].map((s, i) => (
          <div key={i} style={{ background: s.grad, border: `1.5px solid ${s.border}`, borderRadius: "18px", padding: "16px 18px", boxShadow: "0 2px 12px rgba(124,58,237,0.07)" }}>
            <div style={{ fontSize: "18px", marginBottom: "4px" }}>{s.icon}</div>
            <div style={{ fontSize: "26px", fontWeight: 800, color: s.num, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: "10px", color: "#6b7280", fontWeight: 600, marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "14px", flexWrap: "wrap" }}>
        <input
          placeholder="🔍  Search business, contact, state..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ ...base, flex: 1, minWidth: "200px", padding: "10px 16px", fontSize: "13px", borderRadius: "12px" }}
        />
        <button onClick={addRow} disabled={saving} style={{ padding: "10px 20px", fontSize: "13px", fontWeight: 700, color: "white", background: "linear-gradient(135deg,#7c3aed,#a855f7)", border: "none", borderRadius: "12px", cursor: "pointer", boxShadow: "0 4px 14px rgba(124,58,237,0.3)", opacity: saving ? 0.7 : 1 }}>
          + Add Row
        </button>
        <button onClick={exportCSV} style={{ padding: "10px 20px", fontSize: "13px", fontWeight: 700, color: "white", background: "linear-gradient(135deg,#0ea5e9,#06b6d4)", border: "none", borderRadius: "12px", cursor: "pointer", boxShadow: "0 4px 14px rgba(6,182,212,0.3)" }}>
          ⬇ Export CSV
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#a78bfa", fontSize: "14px", fontWeight: 600 }}>Loading your calls...</div>
      ) : (
        <div style={{ background: "white", borderRadius: "20px", border: "1.5px solid #e2dcf8", boxShadow: "0 4px 30px rgba(124,58,237,0.08)", overflow: "hidden" }}>
          <div style={{ display: "flex", gap: "6px", padding: "12px 12px", background: "linear-gradient(135deg,#7c3aed 0%,#a855f7 50%,#06b6d4 100%)", alignItems: "center" }}>
            {COLS.map((c, i) => <div key={i} style={headCell(c.flex)}>{c.label}</div>)}
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#b8aee0", fontSize: "13px" }}>No rows yet — hit + Add Row to get started</div>
          ) : filtered.map((row, idx) => (
            <div key={row.id} style={rowStyle(idx)}
              onMouseEnter={e => e.currentTarget.style.background = "#f5f0ff"}
              onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? "#ffffff" : "#faf8ff"}
            >
              <div style={{ ...cell(COLS[0].flex), color: "#c4b5fd", fontWeight: 700, fontSize: "12px" }}>{idx + 1}</div>
              <div style={cell(COLS[1].flex)}><input type="date" value={row.date} onChange={e => update(row.id,"date",e.target.value)} style={base} /></div>
              <div style={cell(COLS[2].flex)}><input placeholder="Business name" value={row.businessName} onChange={e => update(row.id,"businessName",e.target.value)} style={base} /></div>
              <div style={cell(COLS[3].flex)}><input placeholder="Contact name" value={row.contactName} onChange={e => update(row.id,"contactName",e.target.value)} style={base} /></div>
              <div style={cell(COLS[4].flex)}><input placeholder="04xx xxx xxx" value={row.phone} onChange={e => update(row.id,"phone",e.target.value)} style={base} /></div>
              <div style={cell(COLS[5].flex)}><input placeholder="email@" value={row.email} onChange={e => update(row.id,"email",e.target.value)} style={base} /></div>
              <div style={cell(COLS[6].flex)}>
                <select value={row.state} onChange={e => update(row.id,"state",e.target.value)} style={base}>
                  {STATE_OPTIONS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div style={cell(COLS[7].flex)}>
                <select value={row.registrationType} onChange={e => update(row.id,"registrationType",e.target.value)} style={base}>
                  {REG_OPTIONS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div style={cell(COLS[8].flex)}>
                <select value={row.callStatus} onChange={e => update(row.id,"callStatus",e.target.value)}
                  style={{ ...base, background: statusStyle[row.callStatus]?.bg || "#faf9ff", color: statusStyle[row.callStatus]?.color || "#3d3060", fontWeight: 600, border: `1.5px solid ${statusStyle[row.callStatus]?.border || "#e2dcf8"}` }}>
                  {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div style={cell(COLS[9].flex)}>
                <select value={row.interested} onChange={e => update(row.id,"interested",e.target.value)} style={base}>
                  {INTERESTED_OPTIONS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div style={cell(COLS[10].flex)}><input type="date" value={row.followUpDate} onChange={e => update(row.id,"followUpDate",e.target.value)} style={base} /></div>
              <div style={cell(COLS[11].flex)}><input placeholder="Notes..." value={row.notes} onChange={e => update(row.id,"notes",e.target.value)} style={base} /></div>
              <div style={cell(COLS[12].flex)}>
                <button onClick={() => removeRow(row.id)} style={{ background: "#fdecea", border: "none", color: "#e74c3c", borderRadius: "8px", width: "26px", height: "26px", cursor: "pointer", fontSize: "16px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: "18px" }}>
        <p style={{ margin: 0, fontSize: "11px", color: "#b8aee0", fontWeight: 600, letterSpacing: "1px" }}>VELERIA · NDIS CRM · {new Date().getFullYear()}</p>
      </div>
    </div>
  );
}