(function () {
    'use strict';

    const API_BASE = '';

    // Cached list data for export
    var lastEmails = [];
    var lastSms = [];
    var lastWhatsapp = [];

    // --- Tabs ---
    const tabs = document.querySelectorAll('.tab');
    const panels = document.querySelectorAll('.tab-panel');

    tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            const targetId = 'panel-' + tab.getAttribute('data-tab');
            tabs.forEach(function (t) {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            panels.forEach(function (p) {
                p.classList.remove('active');
                p.hidden = true;
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            var panel = document.getElementById(targetId);
            if (panel) {
                panel.classList.add('active');
                panel.hidden = false;
            }
        });
    });

    // --- Load lists ---
    function loadEmails() {
        fetch(API_BASE + '/api/emails')
            .then(function (r) { return r.json(); })
            .then(function (data) {
                var tbody = document.getElementById('emails-tbody');
                var empty = document.getElementById('emails-empty');
                tbody.innerHTML = '';
                if (!Array.isArray(data) || data.length === 0) {
                    empty.style.display = 'block';
                    empty.textContent = !Array.isArray(data) ? 'Failed to load emails.' : 'No emails sent yet.';
                    lastEmails = Array.isArray(data) ? data : [];
                    return;
                }
                empty.style.display = 'none';
                lastEmails = data;
                data.forEach(function (row) {
                    var tr = document.createElement('tr');
                    var msg = row.messageSent != null ? row.messageSent : '';
                    tr.innerHTML = '<td>' + row.serialNumber + '</td><td>' + escapeHtml(row.emailTo) + '</td><td>' + escapeHtml(msg) + '</td><td>' + formatTimestamp(row.sentAt) + '</td>';
                    tbody.appendChild(tr);
                });
            })
            .catch(function () {
                document.getElementById('emails-empty').textContent = 'Failed to load emails.';
                document.getElementById('emails-empty').style.display = 'block';
            });
    }

    function loadSms() {
        fetch(API_BASE + '/api/sms')
            .then(function (r) { return r.json(); })
            .then(function (data) {
                var tbody = document.getElementById('sms-tbody');
                var empty = document.getElementById('sms-empty');
                tbody.innerHTML = '';
                if (!Array.isArray(data) || data.length === 0) {
                    empty.style.display = 'block';
                    lastSms = Array.isArray(data) ? data : [];
                    return;
                }
                empty.style.display = 'none';
                lastSms = data;
                data.forEach(function (row) {
                    var tr = document.createElement('tr');
                    tr.innerHTML = '<td>' + row.serialNumber + '</td><td>' + escapeHtml(row.mobileNumber) + '</td><td>' + escapeHtml(row.messageSent) + '</td><td>' + formatTimestamp(row.sentAt) + '</td>';
                    tbody.appendChild(tr);
                });
            })
            .catch(function () {
                document.getElementById('sms-empty').textContent = 'Failed to load SMS.';
                document.getElementById('sms-empty').style.display = 'block';
            });
    }

    function loadWhatsApp() {
        fetch(API_BASE + '/api/whatsapp')
            .then(function (r) { return r.json(); })
            .then(function (data) {
                var tbody = document.getElementById('whatsapp-tbody');
                var empty = document.getElementById('whatsapp-empty');
                tbody.innerHTML = '';
                if (!Array.isArray(data) || data.length === 0) {
                    empty.style.display = 'block';
                    lastWhatsapp = Array.isArray(data) ? data : [];
                    return;
                }
                empty.style.display = 'none';
                lastWhatsapp = data;
                data.forEach(function (row) {
                    var tr = document.createElement('tr');
                    tr.innerHTML = '<td>' + row.serialNumber + '</td><td>' + escapeHtml(row.mobileNumber) + '</td><td>' + escapeHtml(row.messageSent) + '</td><td>' + formatTimestamp(row.sentAt) + '</td>';
                    tbody.appendChild(tr);
                });
            })
            .catch(function () {
                document.getElementById('whatsapp-empty').textContent = 'Failed to load WhatsApp messages.';
                document.getElementById('whatsapp-empty').style.display = 'block';
            });
    }

    function refreshAllLists() {
        loadEmails();
        loadSms();
        loadWhatsApp();
    }

    function escapeHtml(text) {
        if (text == null) return '';
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function formatTimestamp(iso) {
        if (!iso) return '';
        try {
            var d = new Date(iso);
            return d.toLocaleString();
        } catch (e) {
            return iso;
        }
    }

    function showError(msg) {
        alert(msg || 'Something went wrong.');
    }

    function parseErrorResponse(r) {
        return r.json().catch(function () { return {}; }).then(function (j) {
            return j.message || j.error || ('Request failed: ' + r.status);
        });
    }

    // --- Multi-channel Compose ---
    var composeEmailGroup = document.getElementById('compose-email');
    var composeSmsWaGroup = document.getElementById('compose-sms-wa');
    var composeSubmitBtn = document.getElementById('compose-submit-btn');

    function getComposeChannel() {
        var r = document.querySelector('input[name="channel"]:checked');
        return r ? r.value : 'email';
    }

    function updateComposeForm() {
        var ch = getComposeChannel();
        if (ch === 'email') {
            composeEmailGroup.removeAttribute('hidden');
            composeSmsWaGroup.hidden = true;
            composeSubmitBtn.textContent = 'Send Email';
        } else {
            composeEmailGroup.hidden = true;
            composeSmsWaGroup.removeAttribute('hidden');
            composeSubmitBtn.textContent = ch === 'sms' ? 'Send SMS' : 'Send WhatsApp';
        }
    }

    document.querySelectorAll('input[name="channel"]').forEach(function (radio) {
        radio.addEventListener('change', updateComposeForm);
    });
    updateComposeForm();

    document.getElementById('form-compose').addEventListener('submit', function (e) {
        e.preventDefault();
        var ch = getComposeChannel();
        if (ch === 'email') {
            var emailTo = document.getElementById('compose-email-to').value.trim();
            var emailMessage = document.getElementById('compose-email-message').value.trim();
            if (!emailTo) { showError('Please enter an email address.'); return; }
            fetch(API_BASE + '/api/emails', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emailTo: emailTo, messageSent: emailMessage })
            })
                .then(function (r) {
                    if (r.ok) return r.json();
                    return parseErrorResponse(r).then(function (msg) { throw new Error(msg); });
                })
                .then(function () {
                    document.getElementById('compose-email-to').value = '';
                    document.getElementById('compose-email-message').value = '';
                    loadEmails();
                })
                .catch(function (err) { showError(err.message || 'Failed to send email.'); });
        } else {
            var mobileRaw = document.getElementById('compose-mobile').value.trim();
            var message = document.getElementById('compose-message').value.trim();
            if (!mobileRaw || !message) { showError('Please enter mobile number and message.'); return; }
            var mobileDigits = mobileRaw.replace(/\D/g, '');
            if (mobileDigits.length !== 10) {
                showError('Mobile number must be exactly 10 digits (not ' + mobileDigits.length + ').');
                return;
            }
            var url = ch === 'sms' ? API_BASE + '/api/sms' : API_BASE + '/api/whatsapp';
            fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobileNumber: mobileDigits, messageSent: message })
            })
                .then(function (r) {
                    if (r.ok) return r.json();
                    return parseErrorResponse(r).then(function (msg) { throw new Error(msg); });
                })
                .then(function () {
                    document.getElementById('compose-mobile').value = '';
                    document.getElementById('compose-message').value = '';
                    if (ch === 'sms') loadSms(); else loadWhatsApp();
                })
                .catch(function (err) { showError(err.message || 'Failed to send.'); });
        }
    });

    // --- Export CSV / JSON ---
    function escapeCsvCell(val) {
        if (val == null) return '""';
        var s = String(val);
        if (/[",\r\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
        return '"' + s + '"';
    }

    function toCsv(data) {
        if (!data || data.length === 0) return '';
        var keys = Object.keys(data[0]);
        var header = keys.map(escapeCsvCell).join(',');
        var rows = data.map(function (row) {
            return keys.map(function (k) { return escapeCsvCell(row[k]); }).join(',');
        });
        return header + '\r\n' + rows.join('\r\n');
    }

    function downloadBlob(blob, filename) {
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();
        URL.revokeObjectURL(a.href);
    }

    function exportList(which, format) {
        var data = which === 'emails' ? lastEmails : (which === 'sms' ? lastSms : lastWhatsapp);
        var name = which === 'emails' ? 'emails' : (which === 'sms' ? 'sms' : 'whatsapp');
        if (!Array.isArray(data) || data.length === 0) {
            showError('No data to export. Load the list first.');
            return;
        }
        var filename = name + '-export.' + (format === 'csv' ? 'csv' : 'json');
        if (format === 'csv') {
            var csv = toCsv(data);
            downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8' }), filename);
        } else {
            var json = JSON.stringify(data, null, 2);
            downloadBlob(new Blob([json], { type: 'application/json' }), filename);
        }
    }

    document.querySelectorAll('.btn-export').forEach(function (btn) {
        btn.addEventListener('click', function () {
            exportList(btn.getAttribute('data-export'), btn.getAttribute('data-format'));
        });
    });

    // Initial load
    refreshAllLists();
})();
