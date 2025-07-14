import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function App() {
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [fixedExpenses, setFixedExpenses] = useState(6500);

  // Fetch and parse data
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

  const row = data.find(r =>
    selectedDate && r.dateObj.toDateString() === selectedDate.toDateString()
  );

  const toNum = v => (v && !isNaN(v) ? parseFloat(v) : 0);
  const fmtC = v => `$${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const pctStr = (n, total) => (total ? `${((n / total) * 100).toFixed(1)}%` : "-");

  if (!row) {
    return (
      <div style={{ maxWidth: 700, margin: "40px auto", textAlign: "center" }}>
        <DatePicker
          selected={selectedDate}
          onChange={setSelectedDate}
          placeholderText="Select Week Ending Sunday"
          dateFormat="dd MMM yyyy"
          calendarStartDay={1}
          filterDate={d => d.getDay() === 0}
        />
        <p>Please select a Sunday date above.</p>
      </div>
    );
  }

  // Covers
  const totalCovers = toNum(row["Total Covers"]);
  const satCovers = toNum(row["Number of covers on Saturday evening"]);
  const walkIns = toNum(row["Walk ins"]);
  const noShows = toNum(row["No Shows"]);
  const coverGain = totalCovers - satCovers;

  // Revenue
  const revBeer = toNum(row["Revenue Beer & Cider"]);
  const revFood = toNum(row["Revenue Food"]);
  const revNon = toNum(row["Revenue NonAlcoholic"]);
  const revSpirits = toNum(row["Revenue Spirits & Cocktails"]);
  const revWine = toNum(row["Revenue Wine"]);
  const revBeverage = revBeer + revNon + revSpirits + revWine;
  const revTotal = revFood + revBeverage;

  // Spend per head
  const spendPerHead = totalCovers ? (revTotal * 1.1) / totalCovers : 0;
  const spendPerFood = totalCovers ? (revFood * 1.1) / totalCovers : 0;
  const spendPerBeverage = totalCovers ? (revBeverage * 1.1) / totalCovers : 0;

  // Purchases
  const purBeer = toNum(row["Purchases Beverage  Beer"]);
  const purFood = toNum(row["Purchases Food"]);
  const purNon = toNum(row["Purchases Beverage NonAlcoholic"]);
  const purSpirits = toNum(row["Purchases Beverage Spirit"]);
  const purWine = toNum(row["Purchases Beverage Wine"]);
  const purCoffee = toNum(row["Purchases Beverage COFFEE"]);
  const purBeverage = purBeer + purNon + purSpirits + purWine + purCoffee;
  const purTotal = purFood + purBeverage;

  // COGS %
  const cogsFood = revFood ? purFood / revFood : 0;
  const cogsBeer = revBeer ? purBeer / revBeer : 0;
  const cogsNon = revNon ? purNon / revNon : 0;
  const cogsSpirits = revSpirits ? purSpirits / revSpirits : 0;
  const cogsWineVal = revWine ? purWine / revWine : 0;
  const cogsBeverage = revBeverage ? purBeverage / revBeverage : 0;
  const totalCogs = revTotal ? purTotal / revTotal : 0;

  // Wages BOH
  const BOHNorm = toNum(row["Wages BOH Normal"]);
  const BOHOT = toNum(row["Wages BOH OT"]);
  const BOHHours = toNum(row["Wages BOH Hours"]);
  const BOHAdd = toNum(row["Wages BOH Additional costs"]);
  const BOHOTacc = toNum(row["BOH Accumulated OT Keoghan"])
    + toNum(row["BOH Accumulated OT Matteo"])
    + toNum(row["BOH Accumulated OT Shodip"])
    + toNum(row["BOH Accumulated OT William"])
    + toNum(row["BOH Accumulated OT Chana"])
    + toNum(row["BOH Accumulated OT Ethan"])
    + toNum(row["BOH Accumulated OT Catherine"]);
  const BOHTotal = BOHNorm + BOHOT + BOHAdd + BOHOTacc;
  const BOHHoursInc = BOHHours + BOHAdd / 30;

  // Wages FOH
  const FOHNorm = toNum(row["Wages FOH Normal"]);
  const FOHOT = toNum(row["Wages FOH OT"]);
  const FOHHours = toNum(row["Wages FOH Hours"]);
  const FOHAdd = toNum(row["Wages FOH Additional costs"]);
  const FOHOTacc = toNum(row["FOH Accumulated OT Liam"]) + toNum(row["FOH Accumulated OT Katya"]);
  const FOHTotal = FOHNorm + FOHOT + FOHAdd + FOHOTacc;
  const FOHHoursInc = FOHHours + FOHAdd / 30;

  const wagesTotal = BOHTotal + FOHTotal;
  const breakeven = purTotal + wagesTotal + fixedExpenses;
  const netPosition = revTotal - breakeven;

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", fontFamily: "Arial, sans-serif", lineHeight: 1.4 }}>
      <label>
        Fixed Expenses:{" "}
        <input
          type="number"
          value={fixedExpenses}
          onChange={e => setFixedExpenses(parseFloat(e.target.value) || 0)}
          style={{ width: "120px", marginBottom: "20px" }}
        />
      </label>

      <DatePicker
        selected={selectedDate}
        onChange={setSelectedDate}
        placeholderText="Select Week Ending Sunday"
        dateFormat="dd MMM yyyy"
        calendarStartDay={1}
        filterDate={d => d.getDay() === 0}
        style={{ display: "block", margin: "20px auto" }}
      />

      {/* Covers */}
      <h2>Covers</h2>
      <p>Total Covers: {totalCovers}</p>
      <p>Sat evening covers: {satCovers}</p>
      <p>Cover gain: {coverGain}</p>
      <p>Walk ins: {walkIns}</p>
      <p>No Shows: {noShows}</p>
      <p>Spend/head: {fmtC(spendPerHead)}</p>
      <p>Spend/head Food: {fmtC(spendPerFood)}</p>
      <p>Spend/head Beverage: {fmtC(spendPerBeverage)}</p>

      {/* Purchases */}
      <h2>Purchases</h2>
      <p>Food: {fmtC(purFood)}</p>
      <p>Beer: {fmtC(purBeer)}</p>
      <p>Non-Alc: {fmtC(purNon)}</p>
      <p>Spirits: {fmtC(purSpirits)}</p>
      <p>Wine: {fmtC(purWine)}</p>
      <p>Coffee: {fmtC(purCoffee)}</p>
      <p>Beverage Total: {fmtC(purBeverage)}</p>
      <p>Total Purchases: {fmtC(purTotal)}</p>

      {/* Wages BOH */}
      <h2>Wages BOH</h2>
      <p>OT: {fmtC(BOHOT)}</p>
      <p>Hours inc cash: {BOHHoursInc.toFixed(1)}</p>
      <p>Additional costs: {fmtC(BOHAdd)}</p>
      <p>Accumulated OT: {fmtC(BOHOTacc)}</p>
      <p>Total BOH: {fmtC(BOHTotal)}</p>
      <p>BOH %: {pctStr(BOHTotal, revTotal)}</p>

      {/* Wages FOH */}
      <h2>Wages FOH</h2>
      <p>OT: {fmtC(FOHOT)}</p>
      <p>Hours inc cash: {FOHHoursInc.toFixed(1)}</p>
      <p>Additional costs: {fmtC(FOHAdd)}</p>
      <p>Accumulated OT: {fmtC(FOHOTacc)}</p>
      <p>Total FOH: {fmtC(FOHTotal)}</p>
      <p>FOH %: {pctStr(FOHTotal, revTotal)}</p>

      {/* Accumulated OT */}
      <h2>Accumulated OT</h2>
      <p>FOH OT Accumulated: {fmtC(FOHOTacc)}</p>
      <p>BOH OT Accumulated: {fmtC(BOHOTacc)}</p>
      <p>Total OT: {fmtC(FOHOTacc + BOHOTacc)}</p>

      {/* COGS */}
      <h2>COGS (%)</h2>
      <p>Food: {pctStr(purFood, revFood)}</p>
      <p>Beer & Cider: {pctStr(purBeer, revBeer)}</p>
      <p>Non-Alc: {pctStr(purNon, revNon)}</p>
      <p>Spirits: {pctStr(purSpirits, revSpirits)}</p>
      <p>Wine: {pctStr(purWine, revWine)}</p>
      <p>Total Bev: {pctStr(purBeverage, revBeverage)}</p>
      <p>Total COGS: {pctStr(purTotal, revTotal)}</p>

      {/* Company Health */}
      <h2>Company Health</h2>
      <p>Breakeven point: {fmtC(breakeven)}</p>
      <p>Rough net position: {fmtC(netPosition)}</p>
      <p>Profit %: {pctStr(netPosition, revTotal)}</p>
    </div>
  );
}
