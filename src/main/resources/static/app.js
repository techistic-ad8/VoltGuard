// VoltGuard Application State
let meters = [];
let readings = [];
let workOrders = [];
let energyChart = null;

// DOM Elements
const elTotalMeters = document.getElementById('stat-total-meters');
const elTamperedMeters = document.getElementById('stat-tampered-meters');
const elAvgVoltage = document.getElementById('stat-avg-voltage');
const elActiveOrders = document.getElementById('stat-active-orders');
const elActiveOrdersCount = document.getElementById('count-active-orders');
const elWorkOrdersBadge = document.getElementById('work-orders-badge');

const elMetersTable = document.getElementById('meters-table-body');
const elTelemetryTable = document.getElementById('telemetry-table-body');
const elWorkOrdersContainer = document.getElementById('work-orders-container');
const elSimMeterSelect = document.getElementById('sim-meter-id');
const elSearchMeters = document.getElementById('search-meters');

const formSimulator = document.getElementById('simulator-form');
const btnSimulateTamper = document.getElementById('btn-simulate-tamper');
const elSimToast = document.getElementById('sim-toast');
const btnRefresh = document.getElementById('btn-refresh');

// Assign Modal Elements
const assignModal = document.getElementById('assign-modal');
const formAssign = document.getElementById('assign-form');
const elModalWorkOrderId = document.getElementById('modal-work-order-id');
const elCloseModal = document.getElementById('close-modal');

// API Base URL
const API_BASE = '/api';

// Initialize App
window.addEventListener('DOMContentLoaded', () => {
    // Initial fetch
    refreshDashboard();
    
    // Poll every 5 seconds
    setInterval(refreshDashboard, 5000);

    // Event Listeners
    btnRefresh.addEventListener('click', refreshDashboard);
    formSimulator.addEventListener('submit', handleSimulatePing);
    btnSimulateTamper.addEventListener('click', setTamperingPresets);
    elSearchMeters.addEventListener('input', filterMetersTable);
    
    // Modal Listeners
    elCloseModal.addEventListener('click', closeAssignModal);
    formAssign.addEventListener('submit', handleAssignEngineer);
    
    // Close modal if clicking outside content
    window.addEventListener('click', (e) => {
        if (e.target === assignModal) closeAssignModal();
    });

    // Initialize Chart
    initChart();
});

// Fetch all data from backend
async function refreshDashboard() {
    try {
        const [metersData, readingsData, workOrdersData] = await Promise.all([
            fetch(`${API_BASE}/meters`).then(r => r.json()),
            fetch(`${API_BASE}/readings`).then(r => r.json()),
            fetch(`${API_BASE}/work-orders`).then(r => r.json())
        ]);

        meters = metersData;
        readings = readingsData;
        workOrders = workOrdersData;

        updateStats();
        updateMetersDropdown();
        renderMetersTable();
        renderTelemetryTable();
        renderWorkOrders();
        updateChart();
        
        // Initialize lucide icons if loaded
        if (window.lucide) {
            window.lucide.createIcons();
        }
    } catch (err) {
        console.error('Error fetching dashboard data:', err);
    }
}

// Calculate Stats and update cards
function updateStats() {
    // Total meters
    elTotalMeters.innerText = meters.length;

    // Tampered meters
    const tampered = meters.filter(m => m.status === 'FLAGGED_TAMPERED').length;
    elTamperedMeters.innerText = tampered;

    // Average Voltage
    if (readings.length > 0) {
        const sumVoltage = readings.reduce((sum, r) => sum + r.voltage, 0);
        const avg = (sumVoltage / readings.length).toFixed(1);
        elAvgVoltage.innerText = `${avg} V`;
    } else {
        elAvgVoltage.innerText = '230.0 V';
    }

    // Active Work Orders (status is not RESOLVED)
    const activeWO = workOrders.filter(w => w.status !== 'RESOLVED');
    elActiveOrders.innerText = activeWO.length;
    elActiveOrdersCount.innerText = `${activeWO.length} Open`;
    
    if (activeWO.length > 0) {
        elWorkOrdersBadge.innerText = activeWO.length;
        elWorkOrdersBadge.style.display = 'inline-block';
    } else {
        elWorkOrdersBadge.style.display = 'none';
    }
}

// Populate the simulator meter dropdown
function updateMetersDropdown() {
    const currentVal = elSimMeterSelect.value;
    
    // Save selections
    elSimMeterSelect.innerHTML = '<option value="" disabled selected>Select a meter...</option>';
    
    meters.forEach(m => {
        const option = document.createElement('option');
        option.value = m.meterId;
        option.textContent = `${m.meterId} (${m.status})`;
        elSimMeterSelect.appendChild(option);
    });

    // Restore selected value if still exists
    if (currentVal && meters.some(m => m.meterId === currentVal)) {
        elSimMeterSelect.value = currentVal;
    }
}

// Render Meters Inventory Table
function renderMetersTable() {
    const query = elSearchMeters.value.toLowerCase().trim();
    const filteredMeters = meters.filter(m => 
        m.meterId.toLowerCase().includes(query) || 
        m.status.toLowerCase().includes(query)
    );

    if (filteredMeters.length === 0) {
        elMetersTable.innerHTML = `
            <tr>
                <td colspan="4" class="table-loading">No matching meters found.</td>
            </tr>
        `;
        return;
    }

    elMetersTable.innerHTML = filteredMeters.map(m => {
        const statusClass = m.status === 'FLAGGED_TAMPERED' ? 'tampered' : 'active';
        return `
            <tr>
                <td style="font-weight: 600; color: var(--color-primary);">${m.meterId}</td>
                <td><span class="status-badge ${statusClass}">${m.status}</span></td>
                <td>${m.baselineKwh.toFixed(3)} kWh</td>
                <td>
                    <button class="btn btn-secondary btn-sm" onclick="selectMeterForSim('${m.meterId}')">
                        <i data-lucide="sliders" style="width:12px; height:12px; margin-right:4px;"></i> Simulate
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Filter meters on search
function filterMetersTable() {
    renderMetersTable();
    if (window.lucide) window.lucide.createIcons();
}

// Helper to select a meter in the simulator
window.selectMeterForSim = function(meterId) {
    elSimMeterSelect.value = meterId;
    // Highlight the form section
    document.getElementById('simulator-form').scrollIntoView({ behavior: 'smooth' });
};

// Render Telemetry logs (most recent first)
function renderTelemetryTable() {
    if (readings.length === 0) {
        elTelemetryTable.innerHTML = `
            <tr>
                <td colspan="7" class="table-loading">Awaiting telemetry broadcast...</td>
            </tr>
        `;
        return;
    }

    // Sort by timestamp desc or id desc (assuming auto-increment list has newest last)
    const sortedReadings = [...readings].reverse().slice(0, 15);

    elTelemetryTable.innerHTML = sortedReadings.map(r => {
        const delta = Math.abs(r.phaseCurrent - r.neutralCurrent);
        const isAnomalous = delta > 2.0;
        const deltaClass = isAnomalous ? 'delta-tag alert' : 'delta-tag normal';
        const formattedDate = new Date(r.timestamp).toLocaleTimeString();

        return `
            <tr>
                <td><strong>${r.meterId}</strong></td>
                <td class="text-muted">${formattedDate}</td>
                <td>${r.activeEnergy.toFixed(3)}</td>
                <td>${r.voltage.toFixed(1)} V</td>
                <td>${r.phaseCurrent.toFixed(2)} A</td>
                <td>${r.neutralCurrent.toFixed(2)} A</td>
                <td><span class="${deltaClass}">${delta.toFixed(2)} A</span></td>
            </tr>
        `;
    }).join('');
}

// Render Work Orders Section
function renderWorkOrders() {
    const activeWO = workOrders.filter(w => w.status !== 'RESOLVED');

    if (activeWO.length === 0) {
        elWorkOrdersContainer.innerHTML = `
            <div class="empty-state">
                <i data-lucide="shield-check" class="empty-icon text-success"></i>
                <p style="color: var(--color-success)">All clear! No active tampering alerts.</p>
            </div>
        `;
        return;
    }

    // Sort by newest first
    const sortedWO = [...activeWO].reverse();

    elWorkOrdersContainer.innerHTML = sortedWO.map(w => {
        const dateStr = new Date(w.createdAt).toLocaleString();
        const statusClass = w.status.toLowerCase();
        
        return `
            <div class="work-order-card alert">
                <div class="wo-header">
                    <div>
                        <div class="wo-title">Tampering Ticket #${w.id}</div>
                        <div class="wo-time">${dateStr}</div>
                    </div>
                    <span class="status-badge ${statusClass}">${w.status}</span>
                </div>
                
                <div class="wo-details">
                    <div class="wo-detail-item">
                        <span class="wo-detail-label">Meter Badge</span>
                        <span class="wo-detail-val">${w.meterId}</span>
                    </div>
                    <div class="wo-detail-item">
                        <span class="wo-detail-label">Substation</span>
                        <span class="wo-detail-val">${w.substation}</span>
                    </div>
                    <div class="wo-detail-item" style="grid-column: span 2;">
                        <span class="wo-detail-label">Assigned Operator</span>
                        <span class="wo-detail-val" style="color: var(--color-primary)">${w.assignedEngineer}</span>
                    </div>
                </div>

                <div class="wo-actions">
                    <button class="btn btn-warning" onclick="openAssignModal(${w.id})">
                        <i data-lucide="user-plus"></i> Assign
                    </button>
                    <button class="btn btn-success" onclick="resolveWorkOrder(${w.id})">
                        <i data-lucide="check"></i> Resolve
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Preset tampering inputs for quick demo
function setTamperingPresets() {
    if (!elSimMeterSelect.value) {
        // pick first meter if none selected
        if (meters.length > 0) elSimMeterSelect.value = meters[0].meterId;
        else return;
    }
    
    document.getElementById('sim-voltage').value = '228.4';
    document.getElementById('sim-energy').value = '1.85';
    document.getElementById('sim-phase').value = '0.45';   // Low current due to bypass
    document.getElementById('sim-neutral').value = '4.80'; // Full neutral current
    
    showToast('Tamper presets loaded: current disparity > 2.0A!', 'var(--color-warning)');
}

// Submit simulated ping to endpoint
async function handleSimulatePing(e) {
    e.preventDefault();
    
    const meterId = elSimMeterSelect.value;
    const voltage = parseFloat(document.getElementById('sim-voltage').value);
    const activeEnergy = parseFloat(document.getElementById('sim-energy').value);
    const phaseCurrent = parseFloat(document.getElementById('sim-phase').value);
    const neutralCurrent = parseFloat(document.getElementById('sim-neutral').value);

    if (!meterId) {
        alert('Please select a meter first.');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/meters/ping`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ meterId, activeEnergy, voltage, phaseCurrent, neutralCurrent })
        });

        if (response.ok) {
            showToast('Ping broadcasted successfully!');
            refreshDashboard();
            
            // Increment simulated active energy slightly for the next ping
            document.getElementById('sim-energy').value = (activeEnergy + 0.12).toFixed(2);
        } else {
            console.error('Failed to submit ping');
            showToast('Error broadcasting ping', 'var(--color-alert)');
        }
    } catch (err) {
        console.error('Network error during simulator submit:', err);
    }
}

// Open Assign Modal
window.openAssignModal = function(id) {
    elModalWorkOrderId.value = id;
    assignModal.classList.remove('hidden');
};

// Close Assign Modal
function closeAssignModal() {
    assignModal.classList.add('hidden');
    formAssign.reset();
}

// Handle Dispatch/Assign form submit
async function handleAssignEngineer(e) {
    e.preventDefault();
    const id = elModalWorkOrderId.value;
    const name = document.getElementById('engineer-name').value;

    try {
        const response = await fetch(`${API_BASE}/work-orders/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ assignedEngineer: name, status: 'OPEN' })
        });

        if (response.ok) {
            closeAssignModal();
            showToast('Substation team dispatched!');
            refreshDashboard();
        } else {
            alert('Failed to assign engineer.');
        }
    } catch (err) {
        console.error('Error assigning engineer:', err);
    }
}

// Handle Work Order Resolution
window.resolveWorkOrder = async function(id) {
    try {
        const response = await fetch(`${API_BASE}/work-orders/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'RESOLVED' })
        });

        if (response.ok) {
            showToast('Work order ticket resolved and closed!');
            refreshDashboard();
        } else {
            alert('Failed to resolve work order.');
        }
    } catch (err) {
        console.error('Error resolving work order:', err);
    }
};

// Show a temporary alert toast on the simulator
function showToast(message, color = 'var(--color-success)') {
    elSimToast.innerText = message;
    elSimToast.style.borderColor = color;
    elSimToast.style.color = color;
    elSimToast.style.backgroundColor = color.replace(')', ', 0.15)');
    elSimToast.classList.remove('hidden');
    
    setTimeout(() => {
        elSimToast.classList.add('hidden');
    }, 3500);
}

// Chart.js Configuration
function initChart() {
    const ctx = document.getElementById('energy-chart').getContext('2d');
    
    energyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [], // Timestamps
            datasets: [
                {
                    label: 'Telemetry Active Energy (kWh)',
                    data: [],
                    borderColor: '#00e5ff',
                    backgroundColor: 'rgba(0, 229, 255, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3
                },
                {
                    label: 'Current Disparity (Ip vs In - A)',
                    data: [],
                    borderColor: '#ff3366',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#94a3b8',
                        font: { family: 'Plus Jakarta Sans', size: 11 }
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#94a3b8', font: { size: 10 } }
                },
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#94a3b8', font: { size: 10 } }
                }
            }
        }
    });
}

// Update the chart data
function updateChart() {
    if (!energyChart) return;
    
    // Get last 8 readings
    const lastReadings = [...readings].slice(-8);
    
    const labels = lastReadings.map(r => new Date(r.timestamp).toLocaleTimeString());
    const energyData = lastReadings.map(r => r.activeEnergy);
    const deltaData = lastReadings.map(r => Math.abs(r.phaseCurrent - r.neutralCurrent));
    
    energyChart.data.labels = labels;
    energyChart.data.datasets[0].data = energyData;
    energyChart.data.datasets[1].data = deltaData;
    energyChart.update();
}
