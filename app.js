async function loadOps() {
  const res = await fetch('/api/toolbox');
  const data = await res.json();

  const select = document.getElementById('operation');
  data.operations.forEach(op => {
    const option = document.createElement('option');
    option.value = op.key;
    option.textContent = op.label;
    select.appendChild(option);
  });
}

async function run() {
  const op = document.getElementById('operation').value;
  const payloadText = document.getElementById('payload').value;

  let payload = {};
  try { payload = JSON.parse(payloadText); } catch {}

  const res = await fetch('/api/toolbox', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ operation: op, payload })
  });

  const data = await res.json();
  document.getElementById('response').textContent = JSON.stringify(data, null, 2);
}

loadOps();