// Curated portfolio demonstrations. All plays, coach profiles, and pitcher values are illustrative.
(() => {
    const panel = document.getElementById('desk-panel');
    if (!panel) return;
    const tabs = [...document.querySelectorAll('[data-desk]')];
    const groups = [
        { id: 'openers', label: 'OPENERS', calls: ['Doubles · Inside zone', 'Trips · Stick', 'Deuce · Split zone', 'Doubles · Smash'] },
        { id: 'short', label: '3RD & SHORT', calls: ['Bunch · Mesh', 'Tight · Duo', 'Trips · Spacing', 'Deuce · Power'] },
        { id: 'red', label: 'RED ZONE', calls: ['Bunch · Snag', 'Trips · Sprint out', 'Tight · Play action', 'Doubles · Fade / out'] },
        { id: 'goal', label: 'GOAL LINE', calls: ['Heavy · Power', 'Tight · Boot', 'Bunch · Pick', 'Heavy · Inside zone'] }
    ];
    let situation = 'all';
    let activeCall = 0;
    let coach = 0;
    let workload = false;
    let fatigueAdjustment = 14;
    let directoryQuery = '';
    let directorySide = 'all';
    let directoryView = 'career';
    const shortlist = new Set();
    // Fictional sample records demonstrate Avenue 1's public product capabilities.
    const coaches = [
        {
            name: 'Alex Morgan', initials: 'AM', role: 'Offensive coordinator', side: 'offense',
            school: 'North Valley', focus: 'Quarterbacks', specialty: 'Offense · QB development',
            career: [
                { years: '2023–26', school: 'North Valley', role: 'Offensive coordinator / QBs' },
                { years: '2020–22', school: 'Lakeview', role: 'Quarterbacks coach' },
                { years: '2017–19', school: 'Western Plains', role: 'Offensive graduate assistant' }
            ],
            philosophy: 'Build the system around what the quarterback sees well. Teach the decision before adding the adjustment.',
            evidence: ['Quarterback teaching progression', 'Situational game-plan structure', 'Staff collaboration and development'],
            connections: [
                { name: 'Cameron Reed', relation: 'Shared staff', context: 'North Valley · 2023–26', target: 2 },
                { name: 'Taylor Brooks', relation: 'Coaching influence', context: 'Lakeview · 2020–22' }
            ]
        },
        {
            name: 'Jordan Ellis', initials: 'JE', role: 'Defensive backs coach', side: 'defense',
            school: 'Lakeview', focus: 'Secondary', specialty: 'Defense · Coverage development',
            career: [
                { years: '2024–26', school: 'Lakeview', role: 'Defensive backs coach' },
                { years: '2021–23', school: 'Coastal State', role: 'Cornerbacks coach' },
                { years: '2018–20', school: 'Pine Ridge', role: 'Defensive analyst' }
            ],
            philosophy: 'Make coverage communication repeatable. Give players a shared language, then build the technique that lets them play fast.',
            evidence: ['Coverage communication system', 'Individual development plans', 'Opponent tendency preparation'],
            connections: [
                { name: 'Casey Bennett', relation: 'Shared staff', context: 'Coastal State · 2021–23' },
                { name: 'Riley Hayes', relation: 'Coaching influence', context: 'Pine Ridge · 2018–20' }
            ]
        },
        {
            name: 'Cameron Reed', initials: 'CR', role: 'Wide receivers coach', side: 'offense',
            school: 'North Valley', focus: 'Receivers', specialty: 'Offense · Receiver development',
            career: [
                { years: '2023–26', school: 'North Valley', role: 'Wide receivers coach' },
                { years: '2020–22', school: 'Eastern Hills', role: 'Offensive quality control' },
                { years: '2017–19', school: 'Summit College', role: 'Graduate assistant / receivers' }
            ],
            philosophy: 'Start with leverage and spacing. Build consistent route detail through deliberate reps and specific, actionable feedback.',
            evidence: ['Route-development curriculum', 'Receiver evaluation framework', 'Practice-to-game feedback process'],
            connections: [
                { name: 'Alex Morgan', relation: 'Shared staff', context: 'North Valley · 2023–26', target: 0 },
                { name: 'Drew Parker', relation: 'Coaching influence', context: 'Eastern Hills · 2020–22' }
            ]
        }
    ];
    const routes = [
        'M 30 94 L 30 25 L 76 25', 'M 72 94 L 72 48 L 112 48',
        'M 200 94 L 200 28 L 163 28', 'M 165 94 L 165 64 L 130 64'
    ];
    function diagram(stage = 2) {
        return `<svg viewBox="0 0 230 150" role="img" aria-label="Illustrative passing play, ${['formation', 'routes', 'reads'][stage]}">
            <defs><marker id="route-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10" fill="none" stroke="context-stroke" stroke-width="1.5"/></marker></defs>
            ${[25,55,85,115,145].map(y => `<path class="field-line" d="M 12 ${y} H 218" stroke="#ced1c0" stroke-width=".6"/>`).join('')}
            <path class="line-of-scrimmage" d="M 12 94 H 218" stroke="#a4ab97" stroke-dasharray="3 3" stroke-width=".7"/>
            ${stage > 0 ? routes.map(d => `<path class="route" d="${d}" fill="none" stroke="#864a42" stroke-width="1.8" marker-end="url(#route-arrow)"/>`).join('') : ''}
            ${[30,72,94,104,114,124,134,165,200].map(x=>`<circle cx="${x}" cy="94" r="4" fill="#fbfaf3" stroke="#5b684e" stroke-width="1.2"/>`).join('')}
            <circle cx="114" cy="116" r="4" fill="#fbfaf3" stroke="#5b684e" stroke-width="1.2"/><circle cx="131" cy="130" r="4" fill="#fbfaf3" stroke="#5b684e" stroke-width="1.2"/>
            ${stage > 1 ? '<text x="113" y="40" fill="#9a6e34" font-size="11" font-family="Georgia">1</text><text x="78" y="20" fill="#9a6e34" font-size="11" font-family="Georgia">2</text>' : ''}
        </svg>`;
    }
    const footer = n => `<div class="paper-footer"><span>VT / THE COACHING TOOLKIT</span><span>${n}</span></div>`;
    function renderCalls() {
        panel.innerHTML = `<div class="book-spread">
            <div class="book-left"><div class="paper-meta"><span>01 / GAME PLANNING</span><span>VTSS</span></div><h2>Your next call.<br><em>Already ready.</em></h2><p class="paper-copy">A sample football call sheet. Pick a situation and explore a set of fictional playcalls.</p><p class="paper-label">Try a game situation</p><div class="situation-options" aria-label="Filter call sheet by situation">${[['all','All calls'],['short','3rd & short'],['red','Red zone'],['goal','Goal line']].map(([id,label])=>`<button data-situation="${id}" aria-pressed="${situation===id}">${label}</button>`).join('')}</div><div class="selected-play">${diagram()}<div class="diagram-caption"><span>ILLUSTRATIVE PLAY DIAGRAM</span><span>↗</span></div></div>${footer('01')}</div>
            <div class="book-right"><div class="sheet-header"><h3>CALL SHEET</h3><span>OFFENSIVE CALL SHEET<br>ILLUSTRATIVE PREVIEW</span></div><div class="sheet-subtitle"><span>PERSONNEL / FORMATION / CALL</span><span>GAME DAY</span></div><div class="call-groups">${groups.map((g,gi)=>`<div class="call-group ${situation !== 'all' && situation !== g.id ? 'muted' : ''} ${situation===g.id?'is-active':''}" data-group="${g.id}"><h4>${g.label}<span>${String(gi+1).padStart(2,'0')}</span></h4>${g.calls.map((call,i)=>`<button class="play-call" data-call="${gi*4+i}" aria-pressed="${activeCall===gi*4+i}"><b>${String(gi*4+i+1).padStart(2,'0')}</b><span>${call}</span></button>`).join('')}</div>`).join('')}</div><p class="sheet-note">Less searching. More calling.</p><div class="sheet-bottom" id="call-selection" role="status">SELECTED: ${groups[Math.floor(activeCall/4)].calls[activeCall%4]}</div>${footer('02')}</div></div>`;
        panel.querySelectorAll('[data-situation]').forEach(button=>button.addEventListener('click',()=>{
            situation=button.dataset.situation;
            panel.querySelectorAll('[data-situation]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
            panel.querySelectorAll('[data-group]').forEach(group=>{
                group.classList.toggle('muted',situation!=='all'&&group.dataset.group!==situation);
                group.classList.toggle('is-active',group.dataset.group===situation);
            });
            panel.querySelector('#call-selection').textContent=situation==='all'?'SHOWING ALL 16 SAMPLE CALLS':`HIGHLIGHTED: ${groups.find(g=>g.id===situation).label} / 4 SAMPLE CALLS`;
        }));
        panel.querySelectorAll('[data-call]').forEach(button=>button.addEventListener('click',()=>{
            activeCall=Number(button.dataset.call);
            panel.querySelectorAll('[data-call]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
            panel.querySelector('#call-selection').textContent=`SELECTED: ${groups[Math.floor(activeCall/4)].calls[activeCall%4]}`;
        }));
    }
    function directoryResults() {
        const query = directoryQuery.trim().toLowerCase();
        return coaches.map((record, id) => ({ ...record, id })).filter(record =>
            (directorySide === 'all' || record.side === directorySide) &&
            `${record.name} ${record.role} ${record.school} ${record.focus}`.toLowerCase().includes(query));
    }

    function directoryList() {
        const results = directoryResults();
        return results.length ? results.map(record => `
            <button class="avenue-result" data-coach="${record.id}" aria-pressed="${coach === record.id}">
                <span class="avenue-result-top"><strong>${record.name}</strong><span aria-hidden="true">↗</span></span>
                <span>${record.role}</span><small>${record.school}</small>
            </button>`).join('') : '<p class="avenue-empty">No sample profiles match.<button type="button" id="avenue-clear">Clear filters</button></p>';
    }

    function dossierSection() {
        const record = coaches[coach];
        if (directoryView === 'network') {
            return `<div class="avenue-network"><p class="avenue-section-label">RELATIONSHIPS, WITH CONTEXT</p>
                <div class="avenue-network-root">${record.name}<small>${record.school}</small></div>
                <div class="avenue-connections">${record.connections.map(connection => `
                    <div class="avenue-connection"><span>${connection.relation}</span>
                        ${connection.target === undefined ? `<strong>${connection.name}</strong>` : `<button data-connection="${connection.target}">${connection.name} ↗</button>`}
                        <small>${connection.context}</small></div>`).join('')}</div>
                <p class="avenue-context">Trace shared staffs and coaching influences to understand the connections behind a career.</p></div>`;
        }
        if (directoryView === 'philosophy') {
            return `<div class="avenue-philosophy"><p class="avenue-section-label">HOW THIS COACH TEACHES</p>
                <blockquote>“${record.philosophy}”</blockquote>
                <p class="avenue-section-label">AREAS TO EXPLORE</p>
                <ul>${record.evidence.map(item => `<li>${item}</li>`).join('')}</ul></div>`;
        }
        return `<div class="avenue-career"><p class="avenue-section-label">THE PATH TO HERE</p>
            <ol class="avenue-timeline">${record.career.map((stop, index) => `<li>
                <span class="avenue-years">${stop.years}</span><div><strong>${stop.school}</strong>
                <p>${stop.role}</p>${index === 0 ? '<small>Most recent role</small>' : ''}</div></li>`).join('')}</ol>
            <p class="avenue-context">Career progression, beyond the current job title.</p></div>`;
    }

    function profile() {
        const record = coaches[coach];
        return `<div class="avenue-profile-heading"><span class="avenue-avatar" aria-hidden="true">${record.initials}</span>
            <div><p class="avenue-section-label">COACH PROFILE / SAMPLE</p><h3>${record.name}</h3><p>${record.role} · ${record.school}</p></div></div>
            <div class="avenue-profile-actions"><span>${record.specialty}</span><button id="avenue-save" aria-pressed="${shortlist.has(coach)}">${shortlist.has(coach) ? '✓ Shortlisted' : '+ Shortlist'}</button></div>
            <div class="avenue-profile-stats"><span><strong>${record.career.length}</strong>Career stops</span><span><strong>${record.connections.length}</strong>Connections</span><span><strong>${record.focus}</strong>Coaching focus</span></div>
            <div class="avenue-dossier-tabs" role="tablist" aria-label="Coach dossier sections">${[['career', 'Career'], ['network', 'Network'], ['philosophy', 'Philosophy']].map(([id, label]) => `<button id="dossier-tab-${id}" role="tab" data-dossier="${id}" aria-controls="avenue-dossier-content" aria-selected="${directoryView === id}" tabindex="${directoryView === id ? 0 : -1}">${label}</button>`).join('')}</div>
            <div id="avenue-dossier-content" role="tabpanel" aria-labelledby="dossier-tab-${directoryView}" tabindex="0">${dossierSection()}</div>`;
    }

    function bindConnections() {
        panel.querySelectorAll('[data-connection]').forEach(button => button.addEventListener('click', () => {
            coach = Number(button.dataset.connection);
            // A connected profile should remain visible in the discovery list.
            directoryQuery = '';
            directorySide = 'all';
            panel.querySelector('#avenue-search').value = '';
            panel.querySelectorAll('[data-side]').forEach(option => option.setAttribute('aria-pressed', String(option.dataset.side === 'all')));
            refreshDirectoryList();
            refreshProfile();
            panel.querySelector('[data-dossier="network"]').focus();
        }));
    }

    function refreshProfile() {
        panel.querySelector('.avenue-profile').innerHTML = profile();
        panel.querySelector('#avenue-save').addEventListener('click', event => {
            if (shortlist.has(coach)) shortlist.delete(coach); else shortlist.add(coach);
            event.currentTarget.setAttribute('aria-pressed', String(shortlist.has(coach)));
            event.currentTarget.textContent = shortlist.has(coach) ? '✓ Shortlisted' : '+ Shortlist';
            panel.querySelector('#avenue-saved-count').textContent = `Shortlist · ${shortlist.size}`;
        });
        const dossierTabs = [...panel.querySelectorAll('[data-dossier]')];
        function showSection(id, focus) {
            directoryView = id;
            dossierTabs.forEach(tab => {
                const selected = tab.dataset.dossier === id;
                tab.setAttribute('aria-selected', String(selected));
                tab.tabIndex = selected ? 0 : -1;
                if (selected && focus) tab.focus();
            });
            const section = panel.querySelector('#avenue-dossier-content');
            section.setAttribute('aria-labelledby', `dossier-tab-${id}`);
            section.innerHTML = dossierSection();
            bindConnections();
        }
        dossierTabs.forEach((tab, index) => {
            tab.addEventListener('click', () => showSection(tab.dataset.dossier, false));
            tab.addEventListener('keydown', event => {
                const next = { ArrowRight: (index + 1) % 3, ArrowLeft: (index + 2) % 3, Home: 0, End: 2 }[event.key];
                if (next === undefined) return;
                event.preventDefault();
                event.stopPropagation();
                showSection(dossierTabs[next].dataset.dossier, true);
            });
        });
        bindConnections();
    }

    function refreshDirectoryList() {
        const results = directoryResults();
        if (results.length && !results.some(record => record.id === coach)) coach = results[0].id;
        panel.querySelector('.avenue-results').innerHTML = directoryList();
        panel.querySelector('#avenue-result-count').textContent = `${directoryResults().length} sample profiles`;
        panel.querySelectorAll('[data-coach]').forEach(button => button.addEventListener('click', () => {
            coach = Number(button.dataset.coach);
            panel.querySelectorAll('[data-coach]').forEach(option => option.setAttribute('aria-pressed', String(option === button)));
            refreshProfile();
        }));
        if (results.length) refreshProfile();
        else panel.querySelector('.avenue-profile').innerHTML = '<div class="avenue-dossier-empty"><span>NO MATCHING SAMPLE PROFILES</span><h3>A different starting point.</h3><p>Try another name, role, or school, or clear the filters to explore all three profiles.</p></div>';
        panel.querySelector('#avenue-clear')?.addEventListener('click', () => {
            directoryQuery = '';
            directorySide = 'all';
            panel.querySelector('#avenue-search').value = '';
            panel.querySelectorAll('[data-side]').forEach(option => option.setAttribute('aria-pressed', String(option.dataset.side === 'all')));
            refreshDirectoryList();
            panel.querySelector('#avenue-search').focus();
        });
    }

    function renderDirectory() {
        panel.innerHTML = `<div class="avenue-preview">
            <div class="avenue-masthead"><div class="avenue-wordmark" aria-label="Avenue 1">Avenue <em>1</em></div><span>COACHING INTELLIGENCE</span><a href="https://avenue-1.com/" target="_blank" rel="noopener noreferrer">Visit Avenue 1 ↗</a></div>
            <div class="avenue-titlebar"><span>The full picture behind a coaching career.</span><span id="avenue-saved-count" role="status">Shortlist · ${shortlist.size}</span></div>
            <div class="avenue-layout">
                <div class="avenue-discovery"><p class="avenue-section-label">FIND YOUR NEXT COACH</p><label class="avenue-search-label" for="avenue-search">Search sample profiles</label><input id="avenue-search" type="search" placeholder="Name, role, or school" autocomplete="off">
                    <div class="avenue-filters" aria-label="Filter sample coaches by side of ball">${[['all', 'All'], ['offense', 'Offense'], ['defense', 'Defense']].map(([id, label]) => `<button data-side="${id}" aria-pressed="${directorySide === id}">${label}</button>`).join('')}</div>
                    <p id="avenue-result-count" role="status">${directoryResults().length} sample profiles</p><div class="avenue-results">${directoryList()}</div>
                    <p class="avenue-list-note">Discover the person.<br>Explore the path.<br>Connect the dots.</p>
                </div>
                <div class="avenue-profile" role="region" aria-label="Selected coach dossier"></div>
            </div>
            <div class="avenue-preview-footer"><span>INTERACTIVE PRODUCT PREVIEW</span><span>Fictional people, programs, and career details.</span></div>
        </div>`;
        panel.querySelector('#avenue-search').value = directoryQuery;
        panel.querySelector('#avenue-search').addEventListener('input', event => {
            directoryQuery = event.target.value;
            refreshDirectoryList();
        });
        panel.querySelectorAll('[data-side]').forEach(button => button.addEventListener('click', () => {
            directorySide = button.dataset.side;
            panel.querySelectorAll('[data-side]').forEach(option => option.setAttribute('aria-pressed', String(option === button)));
            refreshDirectoryList();
        }));
        refreshDirectoryList();
    }
    // Curated example values, not model outputs or a workload-to-fatigue formula.
    // Tenths avoid floating point ties when ordering the illustrative projections.
    const pitchers = [
        { name: 'Pitcher A', role: 'Elite closer · RHP', baseline: 26, tax: 14, pitches: 48, load: 'Pitched on consecutive days' },
        { name: 'Pitcher B', role: 'Rested setup arm · LHP', baseline: 33, tax: 0, pitches: 0, load: 'Rested for two days' },
        { name: 'Pitcher C', role: 'Middle reliever · RHP', baseline: 36, tax: 3, pitches: 24, load: 'One recent appearance' }
    ];

    function appliedTax(pitcher) {
        if (!workload) return 0;
        return pitcher.name === 'Pitcher A' ? fatigueAdjustment : pitcher.tax;
    }

    function bullpenRanking() {
        const ranked = [...pitchers].sort((a, b) =>
            (a.baseline + appliedTax(a)) - (b.baseline + appliedTax(b)));
        return ranked.map((pitcher, index) => {
            const tax = appliedTax(pitcher);
            const total = (pitcher.baseline + tax) / 10;
            return `<li data-pitcher="${pitcher.name}" class="pitcher-card ${index === 0 ? 'pitcher-lead' : ''}">
                <div class="pitcher-top"><span class="pitcher-rank">0${index + 1}</span>
                    <div><h4>${pitcher.name}</h4><p>${pitcher.role}</p></div>
                    <strong class="pitcher-score">${total.toFixed(1)}<small>RUNS / 9</small></strong>
                </div>
                <div class="pitcher-bar" aria-hidden="true"><span style="width:${pitcher.baseline * 2}%"></span><i style="width:${tax * 2}%"></i></div>
                <div class="pitcher-math"><span>${(pitcher.baseline / 10).toFixed(1)} base + ${(tax / 10).toFixed(1)} fatigue</span><span>${workload ? pitcher.pitches : 0} pitches / past 2 days</span></div>
                <div class="pitcher-bottom"><p class="pitcher-load">${workload ? pitcher.load : 'Rested scenario'}</p>${workload ? `<span class="pitcher-movement">${pitchers.indexOf(pitcher) === index ? 'Rank unchanged' : `${pitchers.indexOf(pitcher) > index ? '↑' : '↓'} From #${pitchers.indexOf(pitcher) + 1} to #${index + 1}`}</span>` : ''}</div>
            </li>`;
        }).join('');
    }

    function bullpenInsight() {
        if (!workload) return 'Pitcher A is the best arm when fresh: 2.6 runs / 9 versus B’s 3.3. Now account for two days of heavy use.';
        const adjusted = (26 + fatigueAdjustment) / 10;
        if (fatigueAdjustment === 7) return 'A and B are tied at 3.3 runs / 9. A’s +0.7 fatigue penalty exactly cancels the baseline advantage.';
        if (fatigueAdjustment < 7) return `A still leads at ${adjusted.toFixed(1)} runs / 9. The fatigue penalty is smaller than A’s 0.7-run baseline advantage over B.`;
        return `B moves ahead at 3.3 runs / 9. A’s +${(fatigueAdjustment / 10).toFixed(1)} fatigue penalty raises the projection to ${adjusted.toFixed(1)} — ${(adjusted - 3.3).toFixed(1)} higher than the rested alternative.`;
    }

    function refreshBullpen() {
        panel.querySelector('.bullpen-ranking').classList.add('is-adjusting');
        panel.querySelector('.bullpen-ranking').innerHTML = bullpenRanking();
        panel.querySelector('.bullpen-insight').textContent = bullpenInsight();
        const slider = panel.querySelector('#fatigue-adjustment');
        slider.disabled = !workload;
        slider.value = workload ? fatigueAdjustment : 0;
        const displayed = workload ? fatigueAdjustment : 0;
        slider.setAttribute('aria-valuetext', `Plus ${(displayed / 10).toFixed(1)} projected runs allowed per nine innings`);
        panel.querySelector('#fatigue-value').textContent = `+${(displayed / 10).toFixed(1)}`;
        panel.querySelector('#fatigue-hint').textContent = workload
            ? 'Change A’s penalty. Other pitchers stay fixed. At +0.7, A and B tie.'
            : 'Choose Recent workload to adjust A’s fatigue penalty.';
    }

    function renderBullpen() {
        panel.innerHTML = `<div class="book-spread bullpen-spread">
            <div class="book-left">
                <div class="paper-meta"><span>03 / BASEBALL ANALYTICS</span><span>VTSS</span></div>
                <h2>Who’s ready<br><em>when it rings?</em></h2>
                <p class="paper-copy">The Arm Tax puts fatigue in run-value terms, bringing recent workload into the bullpen decision.</p>
                <p class="paper-label">Compare two scenarios</p>
                <div class="situation-options bullpen-options" aria-label="Bullpen workload scenario">
                    <button data-workload="fresh" aria-pressed="${!workload}">Fresh arms</button>
                    <button data-workload="recent" aria-pressed="${workload}">Recent workload</button>
                </div>
                <div class="fatigue-control">
                    <div class="fatigue-label"><label for="fatigue-adjustment">Pitcher A · fatigue penalty</label><output id="fatigue-value" for="fatigue-adjustment">+${((workload ? fatigueAdjustment : 0) / 10).toFixed(1)}</output></div>
                    <input id="fatigue-adjustment" type="range" min="0" max="18" step="1" value="${workload ? fatigueAdjustment : 0}" ${workload ? '' : 'disabled'} aria-describedby="fatigue-hint" aria-valuetext="Plus ${((workload ? fatigueAdjustment : 0) / 10).toFixed(1)} projected runs allowed per nine innings">
                    <div class="fatigue-scale" aria-hidden="true"><span>+0.0</span><span>RUNS / 9</span><span>+1.8</span></div>
                    <p id="fatigue-hint">${workload ? 'Change A’s penalty. Other pitchers stay fixed. At +0.7, A and B tie.' : 'Choose Recent workload to adjust A’s fatigue penalty.'}</p>
                </div>
                <div class="bullpen-insight" role="status">${bullpenInsight()}</div>
                <a class="feature-link bullpen-project-link" href="https://share.victorres.xyz/arm-tax-7y25" target="_blank" rel="noopener noreferrer">About The Arm Tax ↗</a>
                <p class="sample-label">Fictional pitchers and illustrative values. This explains the idea; these are not actual model outputs.</p>
                ${footer('05')}
            </div>
            <div class="book-right">
                <div class="sheet-header"><h3>THE ARM TAX</h3><span>BULLPEN BOARD<br>ILLUSTRATIVE PREVIEW</span></div>
                <div class="sheet-subtitle"><span>PROJECTED RUNS ALLOWED / 9 INNINGS</span><span>LOWER IS BETTER</span></div>
                <ol class="bullpen-ranking" aria-label="Pitchers ranked by illustrative projected runs allowed">${bullpenRanking()}</ol>
                <div class="bullpen-key"><span><i></i>Baseline</span><span><i></i>Fatigue adjustment</span></div>
                <p class="sheet-note">The best arm on paper. Or tonight?</p>
                <div class="sheet-bottom">SAMPLE SCENARIOS · NOT A LIVE RECOMMENDATION</div>
                ${footer('06')}
            </div>
        </div>`;
        panel.querySelectorAll('[data-workload]').forEach(button => {
            button.addEventListener('click', () => {
                workload = button.dataset.workload === 'recent';
                panel.querySelectorAll('[data-workload]').forEach(option => {
                    option.setAttribute('aria-pressed', String(option === button));
                });
                refreshBullpen();
            });
        });
        panel.querySelector('#fatigue-adjustment').addEventListener('input', event => {
            fatigueAdjustment = Number(event.target.value);
            refreshBullpen();
        });
    }
    function activate(id,focus=false) {
        tabs.forEach(t=>{const selected=t.dataset.desk===id;t.setAttribute('aria-selected',String(selected));t.tabIndex=selected?0:-1;if(selected&&focus)t.focus();});
        panel.setAttribute('aria-labelledby',`tab-${id}`);
        ({calls:renderCalls,directory:renderDirectory,bullpen:renderBullpen})[id]();
    }
    tabs.forEach((tab,index)=>{
        tab.addEventListener('click',()=>activate(tab.dataset.desk));
        tab.addEventListener('keydown',event=>{
            let next=index;
            if(event.key==='ArrowRight')next=(index+1)%tabs.length;
            else if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;
            else if(event.key==='Home')next=0;
            else if(event.key==='End')next=tabs.length-1;
            else return;
            event.preventDefault();activate(tabs[next].dataset.desk,true);
        });
    });
    document.querySelectorAll('[data-open-desk]').forEach(button=>button.addEventListener('click',()=>{
        activate(button.dataset.openDesk,true);
        document.querySelector('.workbench').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center'});
    }));
    activate('calls');
})();
