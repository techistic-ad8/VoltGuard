'use client';

import { useState, useEffect } from 'react';
import {
  ShieldAlert,
  LayoutDashboard,
  Cpu,
  Activity,
  Wrench,
  Database,
  RefreshCw,
  AlertTriangle,
  Zap,
  Sliders,
  Flame,
  RadioTower,
  ShieldCheck,
  TrendingUp,
  Search,
  UserPlus,
  Check,
  X
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Meter {
  id: number;
  meterId: string;
  status: string;
  baselineKwh: number;
}

interface MeterReading {
  id: number;
  meterId: string;
  timestamp: string;
  activeEnergy: number;
  voltage: number;
  phaseCurrent: number;
  neutralCurrent: number;
}

interface WorkOrder {
  id: number;
  meterId: string;
  substation: string;
  assignedEngineer: string;
  status: string;
  createdAt: string;
}

const API_BASE = 'http://localhost:8085/api';

export default function Dashboard() {
  const [meters, setMeters] = useState<Meter[]>([]);
  const [readings, setReadings] = useState<MeterReading[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [clock, setClock] = useState('');

  // Simulator Form State
  const [selectedMeterId, setSelectedMeterId] = useState('');
  const [simVoltage, setSimVoltage] = useState('230.0');
  const [simEnergy, setSimEnergy] = useState('5.24');
  const [simPhase, setSimPhase] = useState('5.0');
  const [simNeutral, setSimNeutral] = useState('5.0');

  // Modal State
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedWoId, setSelectedWoId] = useState<number | null>(null);
  const [selectedEngineer, setSelectedEngineer] = useState('Engineer Sarah Chen');

  // Toast Notifications State
  const [toasts, setToasts] = useState<{ id: number; msg: string; type: 'success' | 'error' | 'amber' }[]>([]);

  const addToast = (msg: string, type: 'success' | 'error' | 'amber' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  };

  // Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setClock(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Data
  const fetchData = async () => {
    try {
      const [mRes, rRes, wRes] = await Promise.all([
        fetch(`${API_BASE}/meters`).then(res => res.json()),
        fetch(`${API_BASE}/readings`).then(res => res.json()),
        fetch(`${API_BASE}/work-orders`).then(res => res.json())
      ]);
      setMeters(mRes);
      setReadings(rRes);
      setWorkOrders(wRes);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle Preset Tamper
  const loadTamperPreset = () => {
    if (!selectedMeterId && meters.length > 0) {
      setSelectedMeterId(meters[0].meterId);
    }
    setSimVoltage('228.4');
    setSimEnergy('1.85');
    setSimPhase('0.45');
    setSimNeutral('4.80');
    addToast('Tamper presets loaded (Disparity > 2A)', 'amber');
  };

  // Submit Ping
  const handleBroadcastPing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMeterId) {
      addToast('Please select a meter badge ID', 'error');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/meters/ping`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meterId: selectedMeterId,
          activeEnergy: parseFloat(simEnergy),
          voltage: parseFloat(simVoltage),
          phaseCurrent: parseFloat(simPhase),
          neutralCurrent: parseFloat(simNeutral)
        })
      });

      if (res.ok) {
        addToast('Ping broadcasted successfully!', 'success');
        setSimEnergy((parseFloat(simEnergy) + 0.12).toFixed(2));
        fetchData();
      } else {
        addToast('Server error while broadcasting ping', 'error');
      }
    } catch (err) {
      addToast('Cannot connect to backend server', 'error');
    }
  };

  // Open Assign Modal
  const openAssign = (id: number) => {
    setSelectedWoId(id);
    setAssignModalOpen(true);
  };

  // Assign Engineer
  const handleAssignEngineer = async () => {
    if (!selectedWoId) return;
    try {
      const res = await fetch(`${API_BASE}/work-orders/${selectedWoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedEngineer: selectedEngineer, status: 'OPEN' })
      });
      if (res.ok) {
        setAssignModalOpen(false);
        addToast(`${selectedEngineer} dispatched!`, 'success');
        fetchData();
      } else {
        addToast('Failed to assign engineer', 'error');
      }
    } catch (err) {
      addToast('Network error', 'error');
    }
  };

  // Resolve Work Order
  const handleResolveWo = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/work-orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'RESOLVED' })
      });
      if (res.ok) {
        addToast('Work order ticket resolved!', 'success');
        fetchData();
      } else {
        addToast('Failed to resolve ticket', 'error');
      }
    } catch (err) {
      addToast('Network error', 'error');
    }
  };

  // Derived Values
  const tamperedCount = meters.filter(m => m.status === 'FLAGGED_TAMPERED').length;
  const activeWorkOrders = workOrders.filter(w => w.status !== 'RESOLVED');
  const avgVoltage = readings.length > 0
    ? (readings.reduce((sum, r) => sum + r.voltage, 0) / readings.length).toFixed(1)
    : '230.0';

  const filteredMeters = meters.filter(m =>
    m.meterId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Chart Data (High Contrast Light Theme)
  const recentReadings = [...readings].slice(-10);
  const chartData = {
    labels: recentReadings.map(r => new Date(r.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Phase Current (Ip)',
        data: recentReadings.map(r => r.phaseCurrent),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37,99,235,0.06)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 3
      },
      {
        label: 'Neutral Current (In)',
        data: recentReadings.map(r => r.neutralCurrent),
        borderColor: '#7c3aed',
        backgroundColor: 'transparent',
        fill: false,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 3
      },
      {
        label: '|Δ| Disparity (A)',
        data: recentReadings.map(r => Math.abs(r.phaseCurrent - r.neutralCurrent)),
        borderColor: '#dc2626',
        backgroundColor: 'rgba(220,38,38,0.06)',
        fill: true,
        tension: 0.1,
        borderWidth: 2,
        borderDash: [5, 4],
        pointRadius: 3
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#334155',
          font: { family: 'Plus Jakarta Sans', size: 11, weight: 600 as const },
          boxWidth: 12
        }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        titleColor: '#ffffff',
        bodyColor: '#94a3b8',
        padding: 12
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(15,23,42,0.06)' },
        ticks: { color: '#64748b', font: { family: 'monospace', size: 10 } }
      },
      y: {
        grid: { color: 'rgba(15,23,42,0.06)' },
        ticks: { color: '#64748b', font: { family: 'monospace', size: 10 } }
      }
    }
  };

  return (
    <div className="shell">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">
            <ShieldAlert />
          </div>
          <div>
            <div className="brand-name"><span>Volt</span>Guard</div>
            <div className="brand-sub">Govt Power Security</div>
          </div>
        </div>

        <div className="sidebar-section-label">Navigation</div>

        <a
          className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <LayoutDashboard />
          Overview
        </a>
        <a
          className={`nav-item ${activeTab === 'meters' ? 'active' : ''}`}
          onClick={() => setActiveTab('meters')}
        >
          <Cpu />
          Meter Inventory
        </a>
        <a
          className={`nav-item ${activeTab === 'telemetry' ? 'active' : ''}`}
          onClick={() => setActiveTab('telemetry')}
        >
          <Activity />
          Live Telemetry
        </a>
        <a
          className={`nav-item ${activeTab === 'work-orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('work-orders')}
        >
          <Wrench />
          Work Orders
          {activeWorkOrders.length > 0 && (
            <span className="nav-badge">{activeWorkOrders.length}</span>
          )}
        </a>

        <div className="sidebar-divider" />
        <div className="sidebar-section-label">System</div>

        <a className="nav-item" href="http://localhost:8085/h2-console" target="_blank" rel="noreferrer">
          <Database />
          H2 Console
        </a>

        <div className="sidebar-footer">
          <div className="system-online">
            <div className="pulse-ring" />
            Substation Online
          </div>
          <div className="server-info">Division 392263 · H2 DB</div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main">
        {/* TOPBAR */}
        <header className="topbar">
          <div className="topbar-title">
            <h2>State Power Distribution Corporation</h2>
            <p>Substation Division 392263 · Anti-Tampering & Grid Surveillance Portal</p>
          </div>
          <div className="topbar-right">
            <div className="topbar-time">{clock}</div>
            <button className="btn btn-ghost" onClick={fetchData}>
              <RefreshCw />
              Refresh
            </button>
            <div className="user-chip">
              <div className="avatar">AD</div>
              Admin Operator
            </div>
          </div>
        </header>

        {/* CONTENT BODY */}
        <div className="content">
          {/* KPI METRICS GRID */}
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-top">
                <div className="kpi-icon blue">
                  <Cpu />
                </div>
                <div className="kpi-trend up">ACTIVE</div>
              </div>
              <div>
                <div className="kpi-value">{meters.length}</div>
                <div className="kpi-label">Total Monitored Meters</div>
              </div>
            </div>

            <div className="kpi-card danger-card">
              <div className="kpi-top">
                <div className="kpi-icon red">
                  <AlertTriangle />
                </div>
                <div className="kpi-trend down">CRITICAL</div>
              </div>
              <div>
                <div className="kpi-value" style={{ color: 'var(--gov-alert)' }}>{tamperedCount}</div>
                <div className="kpi-label">Tampered / Flagged Meters</div>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-top">
                <div className="kpi-icon green">
                  <Zap />
                </div>
                <div className="kpi-trend up">STABLE</div>
              </div>
              <div>
                <div className="kpi-value">{avgVoltage} V</div>
                <div className="kpi-label">Average Grid Voltage</div>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-top">
                <div className="kpi-icon purple">
                  <Wrench />
                </div>
              </div>
              <div>
                <div className="kpi-value">{activeWorkOrders.length}</div>
                <div className="kpi-label">Active Work Orders</div>
              </div>
            </div>
          </div>

          {/* DASHBOARD GRID */}
          <div className="dashboard-grid">
            {/* LEFT COLUMN */}
            <div className="col-left">
              {/* SIMULATOR PANEL */}
              <div className="panel">
                <div className="panel-header">
                  <div className="panel-title">
                    <Sliders style={{ color: 'var(--gov-amber)' }} />
                    <h3>Telemetry Simulator</h3>
                  </div>
                  <button className="btn btn-amber btn-sm" onClick={loadTamperPreset}>
                    <Flame /> Auto-Tamper
                  </button>
                </div>
                <div className="panel-body">
                  <form onSubmit={handleBroadcastPing}>
                    <div className="sim-grid">
                      <div className="form-field" style={{ gridColumn: 'span 2' }}>
                        <label className="form-label">Meter Badge ID</label>
                        <select
                          className="form-input"
                          value={selectedMeterId}
                          onChange={e => setSelectedMeterId(e.target.value)}
                          required
                        >
                          <option value="" disabled>Select a meter...</option>
                          {meters.map(m => (
                            <option key={m.id} value={m.meterId}>
                              {m.meterId} ({m.status})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-field">
                        <label className="form-label">Voltage (V)</label>
                        <input
                          className="form-input"
                          type="number"
                          step="0.1"
                          value={simVoltage}
                          onChange={e => setSimVoltage(e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-field">
                        <label className="form-label">Energy (kWh)</label>
                        <input
                          className="form-input"
                          type="number"
                          step="0.01"
                          value={simEnergy}
                          onChange={e => setSimEnergy(e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-field">
                        <label className="form-label">Phase Current Ip (A)</label>
                        <input
                          className="form-input"
                          type="number"
                          step="0.01"
                          value={simPhase}
                          onChange={e => setSimPhase(e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-field">
                        <label className="form-label">Neutral Current In (A)</label>
                        <input
                          className="form-input"
                          type="number"
                          step="0.01"
                          value={simNeutral}
                          onChange={e => setSimNeutral(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="sim-actions" style={{ marginTop: '14px' }}>
                      <button type="submit" className="btn btn-primary btn-full">
                        <RadioTower /> Broadcast Ping
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* WORK ORDERS PANEL */}
              <div className="panel">
                <div className="panel-header">
                  <div className="panel-title">
                    <Wrench style={{ color: 'var(--gov-alert)' }} />
                    <h3>Active Work Orders</h3>
                  </div>
                  <span className="tag red">{activeWorkOrders.length} Open</span>
                </div>
                <div className="panel-body" style={{ paddingTop: 0 }}>
                  <div className="wo-list">
                    {activeWorkOrders.length === 0 ? (
                      <div className="empty-wo">
                        <ShieldCheck />
                        <p>All clear — no active tampering alerts.</p>
                      </div>
                    ) : (
                      [...activeWorkOrders].reverse().map(wo => (
                        <div key={wo.id} className="wo-card">
                          <div className="wo-row">
                            <div>
                              <div className="wo-id">Ticket #{wo.id}</div>
                              <div className="wo-time">{new Date(wo.createdAt).toLocaleString()}</div>
                            </div>
                            <span className={`badge-status ${wo.status.toLowerCase()}`}>{wo.status}</span>
                          </div>
                          <div className="wo-meta">
                            <div className="wo-meta-item">
                              <label>Meter</label>
                              <span className="mono">{wo.meterId}</span>
                            </div>
                            <div className="wo-meta-item">
                              <label>Substation</label>
                              <span>{wo.substation}</span>
                            </div>
                            <div className="wo-meta-item full">
                              <label>Assigned Operator</label>
                              <span className="wo-engineer">{wo.assignedEngineer}</span>
                            </div>
                          </div>
                          <div className="wo-actions-row">
                            <button className="btn btn-amber btn-sm" onClick={() => openAssign(wo.id)}>
                              <UserPlus style={{ width: 12, height: 12 }} /> Assign
                            </button>
                            <button className="btn btn-success btn-sm" onClick={() => handleResolveWo(wo.id)}>
                              <Check style={{ width: 12, height: 12 }} /> Resolve
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="col-right">
              {/* CHART PANEL */}
              <div className="panel">
                <div className="panel-header">
                  <div className="panel-title">
                    <TrendingUp style={{ color: 'var(--gov-blue)' }} />
                    <h3>Current Disparity Analysis</h3>
                  </div>
                  <span className="tag blue">Recent 10 Pings</span>
                </div>
                <div className="panel-body">
                  <div className="chart-wrap">
                    <Line data={chartData} options={chartOptions} />
                  </div>
                </div>
              </div>

              {/* METERS TABLE */}
              <div className="panel">
                <div className="panel-header">
                  <div className="panel-title">
                    <Cpu style={{ color: 'var(--gov-purple)' }} />
                    <h3>Meter Inventory</h3>
                  </div>
                  <div className="search-wrap">
                    <Search className="search-icon" />
                    <input
                      className="form-input"
                      style={{ width: '200px', paddingLeft: '30px' }}
                      placeholder="Search badge ID..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Badge ID</th>
                        <th>Status</th>
                        <th>Daily Baseline</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMeters.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="table-placeholder">No matching meters found.</td>
                        </tr>
                      ) : (
                        filteredMeters.map(m => (
                          <tr key={m.id}>
                            <td className="mono" style={{ fontWeight: 700, color: 'var(--gov-blue)' }}>{m.meterId}</td>
                            <td>
                              <span className={`badge-status ${m.status === 'FLAGGED_TAMPERED' ? 'tampered' : 'active'}`}>
                                {m.status}
                              </span>
                            </td>
                            <td className="mono">{m.baselineKwh.toFixed(3)} kWh</td>
                            <td>
                              <button
                                className="btn btn-ghost btn-sm"
                                onClick={() => setSelectedMeterId(m.meterId)}
                              >
                                Simulate
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* TELEMETRY TABLE */}
              <div className="panel">
                <div className="panel-header">
                  <div className="panel-title">
                    <Activity style={{ color: 'var(--gov-success)' }} />
                    <h3>Live Telemetry Feed</h3>
                  </div>
                  <span className="tag green">{readings.length} entries</span>
                </div>
                <div className="table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Meter</th>
                        <th>Timestamp</th>
                        <th>Energy (kWh)</th>
                        <th>Voltage</th>
                        <th>Ip (A)</th>
                        <th>In (A)</th>
                        <th>|Δ| Current</th>
                      </tr>
                    </thead>
                    <tbody>
                      {readings.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="table-placeholder">Awaiting telemetry broadcast...</td>
                        </tr>
                      ) : (
                        [...readings].reverse().slice(0, 15).map(r => {
                          const delta = Math.abs(r.phaseCurrent - r.neutralCurrent);
                          return (
                            <tr key={r.id}>
                              <td className="mono"><strong>{r.meterId}</strong></td>
                              <td className="mono" style={{ color: 'var(--text-muted)' }}>
                                {new Date(r.timestamp).toLocaleTimeString()}
                              </td>
                              <td className="mono">{r.activeEnergy.toFixed(3)}</td>
                              <td className="mono">{r.voltage.toFixed(1)} V</td>
                              <td className="mono">{r.phaseCurrent.toFixed(2)}</td>
                              <td className="mono">{r.neutralCurrent.toFixed(2)}</td>
                              <td>
                                <span className={delta > 2 ? 'delta-bad' : 'delta-ok'}>
                                  {delta.toFixed(2)} A {delta > 2 ? '⚠' : ''}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ASSIGN ENGINEER MODAL */}
      {assignModalOpen && (
        <div className="modal-overlay" onClick={() => setAssignModalOpen(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Assign Substation Engineer</h3>
              <button className="modal-close" onClick={() => setAssignModalOpen(false)}>&times;</button>
            </div>
            <div className="form-field" style={{ marginBottom: '16px' }}>
              <label className="form-label">Select Engineer</label>
              <select
                className="form-input"
                value={selectedEngineer}
                onChange={e => setSelectedEngineer(e.target.value)}
              >
                <option value="Engineer Sarah Chen">Engineer Sarah Chen (Grid Specialist)</option>
                <option value="Engineer Marcus Singh">Engineer Marcus Singh (Substation Lead)</option>
                <option value="Engineer Dev Patel">Engineer Dev Patel (Hardware Bypass Tech)</option>
                <option value="Engineer Elena Rostova">Engineer Elena Rostova (Field Inspector)</option>
              </select>
            </div>
            <button className="btn btn-primary btn-full" onClick={handleAssignEngineer}>
              <Check /> Assign & Dispatch
            </button>
          </div>
        </div>
      )}

      {/* TOAST CONTAINER */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>
            {t.type === 'error' ? <X /> : <Check />}
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
