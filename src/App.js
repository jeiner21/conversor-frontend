import React, { useState, useEffect } from 'react';
import Select from 'react-select';

function App() {
  const [origen, setOrigen] = useState('');
  const [destiny, setDestiny] = useState('');
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [money, setMoney] = useState([]);

  useEffect(() => {
    const cargarMonedas = async () => {
      const res = await fetch('https://conversor-backend-slpd.onrender.com/convert/money');
      const data = await res.json();
      setMoney(data);
    };
    cargarMonedas();
  }, []);

  const opciones = money.map(mon => ({ value: mon, label: mon }));

  const convert = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('https://conversor-backend-slpd.onrender.com/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          moneyOrigen: origen,
          moneyFinal: destiny,
          amount: parseFloat(amount)
        })
      });
      if (!res.ok) throw new Error('Error en el backend');
      const data = await res.json();
      setResult(data.result);
    } catch (err) {
      setError('No se pudo convertir, verifica las monedas');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Conversor de Monedas</h2>
      <form onSubmit={convert}>
        <div style={{ marginBottom: '1rem' }}>
          <Select
            options={opciones}
            value={opciones.find(o => o.value === origen)}
            onChange={(selected) => setOrigen(selected.value)}
            placeholder="Moneda Origen"
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <Select
            options={opciones}
            value={opciones.find(o => o.value === destiny)}
            onChange={(selected) => setDestiny(selected.value)}
            placeholder="Moneda Destino"
          />
        </div>

        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          placeholder="Cantidad"
          style={{ marginRight: '1rem' }}
        />
        <button type="submit">Convertir</button>
      </form>

      {result !== null && (
        <p><strong>Resultado:</strong> {result}</p>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default App;
