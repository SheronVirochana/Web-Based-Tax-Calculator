const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        const target = tab.dataset.target;
        if (target) {
            tabs.forEach((t) => t.classList.remove("active"));
            tab.classList.add("active");
            panels.forEach((p) => p.classList.remove("active"));
            document.getElementById(target).classList.add("active");
        }
    });
});


document.getElementById("resetAll").addEventListener("click", () => {
    document.querySelectorAll("form").forEach((f) => f.reset());
    document.querySelectorAll(".result-card").forEach((r) => (r.innerHTML = ""));
    document.querySelectorAll(".inline-error").forEach((e) => (e.textContent = ""));
});

const formatRs = (value) =>
    "Rs. " + Number(value).toLocaleString("en-LK", { minimumFractionDigits: 2 });


document.getElementById("withholdingForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const type = document.getElementById("withholdingType").value;
    const amount = parseFloat(document.getElementById("withholdingAmount").value);
    const resultEl = document.getElementById("withholdingResult");
    const errorEl = document.getElementById("withholdingError");

    errorEl.textContent = "";
    resultEl.innerHTML = "";

    if (!amount || amount <= 0) {
        errorEl.textContent = "Please enter a valid amount greater than 0.";
        return;
    }
    if (!type) {
        errorEl.textContent = "Please select a tax type.";
        return;
    }

    let rate = 0;
    if (type === "rent") rate = amount > 100000 ? 0.1 : 0;
    else if (type === "bank") rate = 0.05;
    else if (type === "dividend") rate = amount > 100000 ? 0.14 : 0;

    const tax = amount * rate;
    const net = amount - tax;

    resultEl.innerHTML = `
    <p>Applied Tax Rate: <strong>${(rate * 100).toFixed(2)}%</strong></p>
    <p>Tax Amount: <strong>${formatRs(tax)}</strong></p>
    <p>Net Amount After Tax: <strong>${formatRs(net)}</strong></p>
  `;
});

document.getElementById("withholdingClear").addEventListener("click", () => {
    document.getElementById("withholdingForm").reset();
    document.getElementById("withholdingResult").innerHTML = "";
    document.getElementById("withholdingError").textContent = "";
});


document.getElementById("payableForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const salary = parseFloat(document.getElementById("monthlySalary").value);
    const resultEl = document.getElementById("payableResult");
    const errorEl = document.getElementById("payableError");
    errorEl.textContent = "";
    resultEl.innerHTML = "";

    if (!salary || salary <= 0) {
        errorEl.textContent = "Please enter a valid salary greater than 0.";
        return;
    }

    const brackets = [
        { limit: 100000, rate: 0 },
        { limit: 141667, rate: 0.06 },
        { limit: 183333, rate: 0.12 },
        { limit: 225000, rate: 0.18 },
        { limit: 266667, rate: 0.24 },
        { limit: 308333, rate: 0.3 },
        { limit: Infinity, rate: 0.36 },
    ];

    let tax = 0;
    let prevLimit = 0;

    for (let i = 0; i < brackets.length; i++) {
        const { limit, rate } = brackets[i];
        if (salary > prevLimit) {
            const taxable = Math.min(salary, limit) - prevLimit;
            tax += taxable * rate;
            prevLimit = limit;
            if (salary <= limit) break;
        }
    }

    const net = salary - tax;
    resultEl.innerHTML = `
    <p>Gross Salary: <strong>${formatRs(salary)}</strong></p>
    <p>Total Tax: <strong>${formatRs(tax)}</strong></p>
    <p>Net Salary After Tax: <strong>${formatRs(net)}</strong></p>
  `;
});

document.getElementById("payableClear").addEventListener("click", () => {
    document.getElementById("payableForm").reset();
    document.getElementById("payableResult").innerHTML = "";
    document.getElementById("payableError").textContent = "";
});


document.getElementById("incomeForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const income = parseFloat(document.getElementById("annualIncome").value);
    const resultEl = document.getElementById("incomeResult");
    const errorEl = document.getElementById("incomeError");
    errorEl.textContent = "";
    resultEl.innerHTML = "";

    if (!income || income <= 0) {
        errorEl.textContent = "Please enter a valid annual income.";
        return;
    }

    const slabs = [
        { limit: 1200000, rate: 0 },
        { limit: 1700000, rate: 0.06 },
        { limit: 2200000, rate: 0.12 },
        { limit: 2700000, rate: 0.18 },
        { limit: 3200000, rate: 0.24 },
        { limit: 3700000, rate: 0.3 },
        { limit: Infinity, rate: 0.36 },
    ];

    let tax = 0;
    let prevLimit = 0;
    let breakdown = [];

    for (let i = 0; i < slabs.length; i++) {
        const { limit, rate } = slabs[i];
        if (income > prevLimit) {
            const taxable = Math.min(income, limit) - prevLimit;
            const slabTax = taxable * rate;
            tax += slabTax;
            if (rate > 0)
                breakdown.push(
                    `<tr><td>${formatRs(prevLimit + 1)} – ${limit === Infinity ? "Above" : formatRs(limit)}</td><td>${(
                        rate * 100
                    ).toFixed(0)}%</td><td>${formatRs(slabTax)}</td></tr>`
                );
            prevLimit = limit;
            if (income <= limit) break;
        }
    }

    const net = income - tax;

    resultEl.innerHTML = `
    <p>Gross Annual Income: <strong>${formatRs(income)}</strong></p>
    <table>
      <thead><tr><th>Range</th><th>Rate</th><th>Tax</th></tr></thead>
      <tbody>${breakdown.join("")}</tbody>
    </table>
    <p><strong>Total Tax:</strong> ${formatRs(tax)}</p>
    <p><strong>Net Income After Tax:</strong> ${formatRs(net)}</p>
  `;
});

document.getElementById("incomeClear").addEventListener("click", () => {
    document.getElementById("incomeForm").reset();
    document.getElementById("incomeResult").innerHTML = "";
    document.getElementById("incomeError").textContent = "";
});


document.getElementById("ssclForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const value = parseFloat(document.getElementById("ssclValue").value);
    const resultEl = document.getElementById("ssclResult");
    const errorEl = document.getElementById("ssclError");
    errorEl.textContent = "";
    resultEl.innerHTML = "";

    if (!value || value <= 0) {
        errorEl.textContent = "Please enter a valid value greater than 0.";
        return;
    }

    const saleTax = value * 0.025;
    const afterSaleTax = value + saleTax;
    const vat = afterSaleTax * 0.15;
    const sscl = saleTax + vat;

    resultEl.innerHTML = `
    <p>Sale Tax (2.5%): <strong>${formatRs(saleTax)}</strong></p>
    <p>After Sale Tax Value: <strong>${formatRs(afterSaleTax)}</strong></p>
    <p>VAT (15%): <strong>${formatRs(vat)}</strong></p>
    <p><strong>Final SSCL Tax: ${formatRs(sscl)}</strong></p>
  `;
});

document.getElementById("ssclClear").addEventListener("click", () => {
    document.getElementById("ssclForm").reset();
    document.getElementById("ssclResult").innerHTML = "";
    document.getElementById("ssclError").textContent = "";
});


document.getElementById("leasingForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const P = parseFloat(document.getElementById("loanPrincipal").value);
    const rate = parseFloat(document.getElementById("leasingInterest").value);
    const years = parseInt(document.getElementById("leasingYears").value);
    const resultEl = document.getElementById("leasingResult");
    resultEl.innerHTML = "";

    if (!P || !rate || !years || P <= 0 || rate <= 0 || years <= 0 || years > 5) {
        resultEl.innerHTML = `<p class="error">Invalid input values. Check all fields.</p>`;
        return;
    }

    const i = rate / 100 / 12;
    const n = years * 12;
    const EMI = (P * i) / (1 - 1 / Math.pow(1 + i, n));

    resultEl.innerHTML = `
    <p>Loan Amount: <strong>${formatRs(P)}</strong></p>
    <p>Interest Rate: <strong>${rate}%</strong></p>
    <p>Years: <strong>${years}</strong></p>
    <p><strong>Monthly Installment (EMI): ${formatRs(EMI)}</strong></p>
  `;
});

document.getElementById("leasingClear").addEventListener("click", () => {
    document.getElementById("leasingForm").reset();
    document.getElementById("leasingResult").innerHTML = "";
});


document.getElementById("reverseLeasingForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const EMI = parseFloat(document.getElementById("monthlyPayment").value);
    const rate = parseFloat(document.getElementById("reverseInterest").value);
    const years = parseInt(document.getElementById("reverseYears").value);
    const resultEl = document.getElementById("reverseLeasingResult");
    resultEl.innerHTML = "";

    if (!EMI || !rate || !years || EMI <= 0 || rate <= 0 || years <= 0 || years > 5) {
        resultEl.innerHTML = `<p class="error">Invalid input values.</p>`;
        return;
    }

    const i = rate / 100 / 12;
    const n = years * 12;
    const loan = EMI * (1 - 1 / Math.pow(1 + i, n)) / i;

    resultEl.innerHTML = `
    <p>Monthly Payment: <strong>${formatRs(EMI)}</strong></p>
    <p>Interest Rate: <strong>${rate}%</strong></p>
    <p>Years: <strong>${years}</strong></p>
    <p><strong>Maximum Loan Value: ${formatRs(loan)}</strong></p>
  `;
});

document.getElementById("reverseClear").addEventListener("click", () => {
    document.getElementById("reverseLeasingForm").reset();
    document.getElementById("reverseLeasingResult").innerHTML = "";
});


document.getElementById("comparePlans").addEventListener("click", (e) => {
    e.preventDefault();
    const P = parseFloat(document.getElementById("comparePrincipal").value);
    const rate = parseFloat(document.getElementById("compareInterest").value);
    const resultEl = document.getElementById("planCompareResult");
    resultEl.innerHTML = "";

    if (!P || !rate || P <= 0 || rate <= 0) {
        resultEl.innerHTML = `<p class="error">Please enter valid loan and interest rate.</p>`;
        return;
    }

    const i = rate / 100 / 12;
    const plans = [3, 4, 5];
    let rows = "";

    plans.forEach((years) => {
        const n = years * 12;
        const EMI = (P * i) / (1 - 1 / Math.pow(1 + i, n));
        rows += `<tr><td>${years} years</td><td>${formatRs(EMI)}</td></tr>`;
    });

    resultEl.innerHTML = `
    <table>
      <thead><tr><th>Plan Duration</th><th>Monthly Installment</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;
});

document.getElementById("compareClear").addEventListener("click", () => {
    document.getElementById("comparePrincipal").value = "";
    document.getElementById("compareInterest").value = "";
    document.getElementById("planCompareResult").innerHTML = "";
});
