import React, { useEffect, useState } from "react";
const Card = ({ children }) => (
  <div style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "12px", marginBottom: "16px" }}>
    {children}
  </div>
);

const CardContent = ({ children }) => (
  <div style={{ fontWeight: "600" }}>{children}</div>
);

const Input = ({ ...props }) => (
  <input
    style={{
      padding: "8px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      width: "100%",
      marginBottom: "16px"
    }}
    {...props}
  />
);

export default function App() {
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    fetch("https://api.sheetbest.com/sheets/a20677c9-107f-4bbe-956e-ec91727d4dae")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  const filteredData = data.find((entry) => entry["Week Ending Date"] === selectedDate);

  const formatCurrency = (value) =>
    value && !isNaN(value) ? `$${parseFloat(value).toFixed(2)}` : "-";
  const formatPercent = (value) =>
    value && !isNaN(value) ? `${(parseFloat(value) * 100).toFixed(1)}%` : "-";

  const parseNumber = (value) => (value && !isNaN(value) ? parseFloat(value) : 0);

  const revenueFood = parseNumber(filteredData?.["Revenue  Food"]);
  const revenueBeer = parseNumber(filteredData?.["Revenue  Beer & Cider"]);
  const revenueNonAlc = parseNumber(filteredData?.["Revenue  NonAlcoholic"]);
  const revenueSpirits = parseNumber(filteredData?.["Revenue  Spirits & Cocktails"]);
  const revenueWine = parseNumber(filteredData?.["Revenue  Wine"]);
  const revenueBeverage = revenueBeer + revenueNonAlc + revenueSpirits + revenueWine;
  const revenueTotal = revenueFood + revenueBeverage;

  const purchasesFood = parseNumber(filteredData?.["Purchases  Food"]);
  const purchasesBeer = parseNumber(filteredData?.["Purchases  Beverage  Beer"]);
  const purchasesNonAlc = parseNumber(filteredData?.["Purchases  Beverage  NonAlcoholic"]);
  const purchasesSpirits = parseNumber(filteredData?.["Purchases  Beverage  Spirit"]);
  const purchasesWine = parseNumber(filteredData?.["Purchases  Beverage  Wine"]);
  const purchasesCoffee = parseNumber(filteredData?.["Purchases  Beverage  COFFEE"]);
  const purchasesBeverage = purchasesBeer + purchasesNonAlc + purchasesSpirits + purchasesWine + purchasesCoffee;
  const purchasesTotal = purchasesBeverage + purchasesFood;

  const totalCovers = parseNumber(filteredData?.["Total Covers"]);
  const satCovers = parseNumber(filteredData?.["Number of covers on Saturday evening"]);
  const walkIns = parseNumber(filteredData?.["Walk ins"]);
  const noShows = parseNumber(filteredData?.["No Shows"]);

  const spendPerHead = totalCovers ? (revenueTotal * 1.1) / totalCovers : 0;
  const spendPerFood = totalCovers ? (revenueFood * 1.1) / totalCovers : 0;
  const spendPerBeverage = totalCovers ? (revenueBeverage * 1.1) / totalCovers : 0;

  const wagesBOHNormal = parseNumber(filteredData?.["Wages  BOH  Normal"]);
  const wagesBOHOT = parseNumber(filteredData?.["Wages  BOH  OT"]);
  const wagesBOHAdd = parseNumber(filteredData?.["Wages  BOH  Additional costs"]);
  const wagesBOHOTAccum = parseNumber(filteredData?.["Wages  BOH  Accumulated OT"]);
  const wagesBOHTotal = wagesBOHNormal + wagesBOHOT + wagesBOHAdd + wagesBOHOTAccum;
  const wagesBOHPercent = revenueTotal ? wagesBOHTotal / revenueTotal : 0;

  const wagesFOHNormal = parseNumber(filteredData?.["Wages  FOH  Normal"]);
  const wagesFOHOT = parseNumber(filteredData?.["Wages  FOH  OT"]);
  const wagesFOHAdd = parseNumber(filteredData?.["Wages  FOH  Additional costs"]);
  const wagesFOHOTAccum = parseNumber(filteredData?.["Wages  FOH  Accumulated OT"]);
  const wagesFOHTotal = wagesFOHNormal + wagesFOHOT + wagesFOHAdd + wagesFOHOTAccum;
  const wagesFOHPercent = revenueTotal ? wagesFOHTotal / revenueTotal : 0;

  const wagesTotal = wagesFOHTotal + wagesBOHTotal;
  const wagePercent = revenueTotal ? wagesTotal / revenueTotal : 0;

  const weeklyFixed = 6500;
  const breakeven = wagesTotal + weeklyFixed + purchasesTotal;
  const netPosition = revenueTotal - breakeven;
  const profitPercent = revenueTotal ? netPosition / revenueTotal : 0;

  return (
    <div className="p-4 space-y-4">
      <select
  value={selectedDate}
  onChange={(e) => setSelectedDate(e.target.value)}
  style={{ padding: "8px", fontSize: "1rem", width: "100%", borderRadius: "4px", marginBottom: "16px" }}
>
  <option value="">Select Week Ending Date</option>
  {data
    .map(row => row["Week Ending Date"])
    .filter((d, i, arr) => arr.indexOf(d) === i)  // remove duplicates
    .sort()
    .map((date) => (
      <option key={date} value={date}>
        {date}
      </option>
    ))}
</select>


      {filteredData ? (
        <>
          <Card><CardContent className="p-4 font-semibold">Covers
            <div>Total Covers: {totalCovers}</div>
            <div>Saturday Covers: {satCovers}</div>
            <div>Walk ins: {walkIns}</div>
            <div>No Shows: {noShows}</div>
            <div>Spend/head: {formatCurrency(spendPerHead)}</div>
            <div>Food/head: {formatCurrency(spendPerFood)}</div>
            <div>Beverage/head: {formatCurrency(spendPerBeverage)}</div>
          </CardContent></Card>

          <Card><CardContent className="p-4 font-semibold">Revenue
            <div>Food: {formatCurrency(revenueFood)}</div>
            <div>Beer & Cider: {formatCurrency(revenueBeer)}</div>
            <div>Non-Alcoholic: {formatCurrency(revenueNonAlc)}</div>
            <div>Spirits & Cocktails: {formatCurrency(revenueSpirits)}</div>
            <div>Wine: {formatCurrency(revenueWine)}</div>
            <div>Beverage Total: {formatCurrency(revenueBeverage)}</div>
            <div>Total: {formatCurrency(revenueTotal)}</div>
          </CardContent></Card>

          <Card><CardContent className="p-4 font-semibold">Purchases
            <div>Food: {formatCurrency(purchasesFood)}</div>
            <div>Beer: {formatCurrency(purchasesBeer)}</div>
            <div>Non-Alcoholic: {formatCurrency(purchasesNonAlc)}</div>
            <div>Spirits: {formatCurrency(purchasesSpirits)}</div>
            <div>Wine: {formatCurrency(purchasesWine)}</div>
            <div>Coffee: {formatCurrency(purchasesCoffee)}</div>
            <div>Beverage Total: {formatCurrency(purchasesBeverage)}</div>
            <div>Total: {formatCurrency(purchasesTotal)}</div>
          </CardContent></Card>

          <Card><CardContent className="p-4 font-semibold">Wages
            <div>BOH Total: {formatCurrency(wagesBOHTotal)}</div>
            <div>BOH %: {formatPercent(wagesBOHPercent)}</div>
            <div>FOH Total: {formatCurrency(wagesFOHTotal)}</div>
            <div>FOH %: {formatPercent(wagesFOHPercent)}</div>
            <div>Total: {formatCurrency(wagesTotal)}</div>
            <div>Wage %: {formatPercent(wagePercent)}</div>
          </CardContent></Card>

          <Card><CardContent className="p-4 font-semibold">Company Health
            <div>Breakeven: {formatCurrency(breakeven)}</div>
            <div>Net Position: {formatCurrency(netPosition)}</div>
            <div>Profit %: {formatPercent(profitPercent)}</div>
          </CardContent></Card>
        </>
      ) : (
        <p>No data found for selected date.</p>
      )}
    </div>
  );
}