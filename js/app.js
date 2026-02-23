// Navigation
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.section');

    function showSection(sectionId) {
        sections.forEach(s => s.classList.remove('active'));
        navLinks.forEach(l => l.classList.remove('active'));

        const target = document.getElementById(sectionId);
        if (target) {
            target.classList.add('active');
            window.scrollTo(0, 0);
        }

        const activeLink = document.querySelector(`[data-section="${sectionId}"]`);
        if (activeLink) activeLink.classList.add('active');
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            showSection(section);
            history.pushState(null, '', `#${section}`);
        });
    });

    // Handle URL hash
    const hash = window.location.hash.slice(1);
    if (hash && document.getElementById(hash)) {
        showSection(hash);
    }

    window.addEventListener('popstate', () => {
        const hash = window.location.hash.slice(1);
        if (hash) showSection(hash);
        else showSection('overview');
    });

    // Initialize charts if Chart.js is loaded
    initCharts();
});

function initCharts() {
    // FoldBench Chart
    const fbCtx = document.getElementById('foldbenchChart');
    if (!fbCtx) return;

    // Simple bar chart using CSS (no Chart.js dependency)
    const fbData = [
        { name: 'IsoDDE', abag: 75.58, plig: 75.99, pprot: 74.19 },
        { name: 'AF3', abag: 47.90, plig: 64.90, pprot: 72.93 },
        { name: 'SeedFold', abag: 53.21, plig: 63.12, pprot: 74.03 },
        { name: 'Protenix-v1', abag: 50.12, plig: 62.79, pprot: 74.00 },
        { name: 'Chai-1', abag: 23.64, plig: 51.23, pprot: 68.53 },
    ];

    let fbHtml = '<div class="simple-chart">';
    fbData.forEach(d => {
        fbHtml += `
            <div class="chart-row">
                <span class="chart-label">${d.name}</span>
                <div class="chart-bars">
                    <div class="bar-group">
                        <div class="bar bar-blue" style="width: ${d.abag}%" title="Ab-Ag: ${d.abag}%">
                            <span class="bar-value">${d.abag}%</span>
                        </div>
                    </div>
                    <div class="bar-group">
                        <div class="bar bar-green" style="width: ${d.plig}%" title="Prot-Lig: ${d.plig}%">
                            <span class="bar-value">${d.plig}%</span>
                        </div>
                    </div>
                    <div class="bar-group">
                        <div class="bar bar-purple" style="width: ${d.pprot}%" title="Prot-Prot: ${d.pprot}%">
                            <span class="bar-value">${d.pprot}%</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    fbHtml += '<div class="chart-legend">';
    fbHtml += '<span class="legend-item"><span class="legend-color" style="background:#58a6ff"></span>Antibody-Antigen</span>';
    fbHtml += '<span class="legend-item"><span class="legend-color" style="background:#3fb950"></span>Protein-Ligand</span>';
    fbHtml += '<span class="legend-item"><span class="legend-color" style="background:#bc8cff"></span>Protein-Protein</span>';
    fbHtml += '</div></div>';

    fbCtx.parentElement.innerHTML = fbHtml;

    // Affinity Chart
    const afCtx = document.getElementById('affinityChart');
    if (!afCtx) return;

    const afData = [
        { name: 'IsoDDE', val: 0.85 },
        { name: 'FEP+', val: 0.78 },
        { name: 'ABFE', val: 0.75 },
        { name: 'Boltz-2', val: 0.66 },
        { name: 'OpenFE', val: 0.55 },
        { name: 'FMO', val: 0.40 },
    ];

    let afHtml = '<div class="simple-chart">';
    afData.forEach((d, i) => {
        const color = i === 0 ? '#3fb950' : (i <= 2 ? '#58a6ff' : '#8b949e');
        afHtml += `
            <div class="chart-row">
                <span class="chart-label">${d.name}</span>
                <div class="chart-bars">
                    <div class="bar-group">
                        <div class="bar" style="width: ${d.val * 100}%; background: ${color}" title="r = ${d.val}">
                            <span class="bar-value">r=${d.val}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    afHtml += '<div class="chart-legend"><span class="legend-item">FEP+4 Benchmark - Pearson Correlation</span></div></div>';

    afCtx.parentElement.innerHTML = afHtml;
}

// Add chart styles dynamically
const chartStyles = document.createElement('style');
chartStyles.textContent = `
    .simple-chart {
        padding: 16px 0;
    }
    .chart-row {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
    }
    .chart-label {
        width: 100px;
        font-size: 13px;
        font-weight: 500;
        color: #8b949e;
        flex-shrink: 0;
        text-align: right;
        padding-right: 12px;
    }
    .chart-bars {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 3px;
    }
    .bar-group {
        height: 22px;
    }
    .bar {
        height: 100%;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding-right: 8px;
        transition: width 0.5s ease;
        min-width: 60px;
    }
    .bar-blue { background: rgba(88, 166, 255, 0.7); }
    .bar-green { background: rgba(63, 185, 80, 0.7); }
    .bar-purple { background: rgba(188, 140, 255, 0.7); }
    .bar-value {
        font-size: 11px;
        font-weight: 600;
        color: white;
        font-family: 'JetBrains Mono', monospace;
    }
    .chart-legend {
        display: flex;
        gap: 20px;
        margin-top: 12px;
        padding-left: 112px;
    }
    .legend-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        color: #8b949e;
    }
    .legend-color {
        width: 12px;
        height: 12px;
        border-radius: 3px;
    }
`;
document.head.appendChild(chartStyles);
