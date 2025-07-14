import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    fetch("https://api.sheetbest.com/sheets/a20677c9-107f-4bbe-956e-ec91727d4dae")
      .then(res => res.json())
      .then(rows => {
        const parsed = rows.map(r => ({
          ...r,
          dateObj: new Date(r["Week Ending Date"])
        }));
        setData(parsed);
      });
  }, []);

  const filteredData = data.find(d =>
    selectedDate && d.dateObj.toDateString() === selectedDate.toDateString()
  );

  const formatCurrency = v => (v ? `$${parseFloat(v).toFixed(2)}` : "-");
  const formatPercent = v => (v ? `${(parseFloat(v) * 100).toFixed(1)}%` : "-");
  const parseNumber = v => (v && !isNaN(v) ? parseFloat(v) : 0);

  const totalCovers = parseNumber(filteredData?.["Total Covers"]);
  const satCovers = parseNumber(filteredData?.["Number of covers on Saturday evening"]);
  const walkIns = parseNumber(filteredData?.["Walk ins"]);
  const noShows = parseNumber(filteredData?.["No Shows"]);

  const revFood = parseNumber(filteredData?.["Revenue  Food"]);
  const revBeer = parseNumber(filteredData?.["Revenue  Beer & Cider"]);
  const revNonAlc = parseNumber(filteredData?.["Revenue  NonAlcoholic"]);
  const revSpirits = parseNumber(filteredData?.["Revenue  Spirits & Cocktails"]);
  const revWine = parseNumber(filteredData?.["Revenue  Wine"]);
  const revBeverage = revBeer + revNonAlc + revSpirits + revWine;
  const revTotal = revFood + revBeverage;

  const spendPerHead = totalCovers ? (revTotal * 1.1) / totalCovers : 0;
  const spendPerFood = totalCovers ? (revFood * 1.1) / totalCovers : 0;
  const spendPerBeverage = totalCovers ? (revBeverage * 1.1) / totalCovers : 0;

  return (
    <div style={{
      maxWidth: '500px',
      margin: '40px auto',
      textAlign: 'center'
    }}>
      <DatePicker
        selected={selectedDate}
        onChange={date => setSelectedDate(date)}
        placeholderText="Select Week Ending Sunday"
        dateFormat="dd MMM yyyy"
        calendarStartDay={1}
        filterDate={date => date.getDay() === 0}
      />

      {filteredData ? (
        <>
          <section>
            <h2>Covers</h2>
            <p>Total Covers: {totalCovers}</p>
            <p>Saturday Covers: {satCovers}</p>
            <p>Walk ins: {walkIns}</p>
            <p>No Shows: {noShows}</p>
            <p>Spend/head: {formatCurrency(spendPerHead)}</p>
            <p>Food/head: {formatCurrency(spendPerFood)}</p>
            <p>Beverage/head: {formatCurrency(spendPerBeverage)}</p>
          </section>

          <section style={{ marginTop: '20px' }}>
            <h2>Revenue</h2>
            <p>Food: {formatCurrency(revFood)}</p>
            <p>Beer & Cider: {formatCurrency(revBeer)}</p>
            <p>Non-Alcoholic: {formatCurrency(revNonAlc)}</p>
            <p>Spirits & Cocktails: {formatCurrency(revSpirits)}</p>
            <p>Wine: {formatCurrency(revWine)}</p>
            <p>Beverage Total: {formatCurrency(revBeverage)}</p>
            <p>Total Revenue: {formatCurrency(revTotal)}</p>
          </section>
        </>
      ) : (
        <p style={{ marginTop: '20px' }}>
          Please select a valid week‑ending date (Sunday) from the calendar.
        </p>
      )}
    </div>
  );
}
