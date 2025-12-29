document.addEventListener('DOMContentLoaded', () => {
    // Navigation Logic
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');

    navItems.forEach(navItem => {
        navItem.addEventListener('click', () => {
            navItems.forEach(item => item.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));

            navItem.classList.add('active');
            const targetSectionId = navItem.getAttribute('data-section');
            document.getElementById(targetSectionId).classList.add('active');
        });
    });

    // Commission Rates for Binance Futures
    const TAKER_FEE_RATE = 0.0005; // 0.050%
    const MAKER_FEE_RATE = 0.0002; // 0.020%

    // Calculator Section Logic
    const calculateBtn = document.getElementById('calculateBtn');
    const investmentInputCalc = document.getElementById('investment');
    const leverageInputCalc = document.getElementById('leverage');
    const orderTypeSelectCalc = document.getElementById('orderTypeCalc');
    const entryPriceInputCalc = document.getElementById('entryPriceCalc');
    const stopLossInputCalc = document.getElementById('stopLossCalc');
    const takeProfitInputCalc = document.getElementById('takeProfitCalc');
    const stopLossResultDiv = document.getElementById('stopLossResult');
    const takeProfitResultDiv = document.getElementById('takeProfitResult');
    const commissionTakerTakerDiv = document.getElementById('commissionTakerTaker');
    const commissionMakerMakerDiv = document.getElementById('commissionMakerMaker');
    const commissionTakerMakerDiv = document.getElementById('commissionTakerMaker');

    calculateBtn.addEventListener('click', () => {
        const investment = parseFloat(investmentInputCalc.value);
        const leverage = parseFloat(leverageInputCalc.value);
        const orderType = orderTypeSelectCalc.value;
        const entryPrice = parseFloat(entryPriceInputCalc.value);
        const stopLossPrice = parseFloat(stopLossInputCalc.value);
        const takeProfitPrice = parseFloat(takeProfitInputCalc.value);

        if (isNaN(investment) || isNaN(leverage) || isNaN(entryPrice) || isNaN(stopLossPrice) || isNaN(takeProfitPrice)) {
            alert('Please enter valid numbers for all price fields in the calculator.');
            return;
        }

        const effectivePositionSize = investment * leverage;
        const quantity = entryPrice !== 0 ? effectivePositionSize / entryPrice : 0;

        let stopLossProfitLoss = 0;
        let takeProfitProfitLoss = 0;

        if (orderType === 'long') {
            stopLossProfitLoss = (quantity * stopLossPrice) - effectivePositionSize;
            takeProfitProfitLoss = (quantity * takeProfitPrice) - effectivePositionSize;
        } else if (orderType === 'short') {
            stopLossProfitLoss = effectivePositionSize - (quantity * stopLossPrice);
            takeProfitProfitLoss = effectivePositionSize - (quantity * takeProfitPrice);
        }

        const commissionTakerTaker = (effectivePositionSize * TAKER_FEE_RATE) + (effectivePositionSize * TAKER_FEE_RATE);
        const commissionMakerMaker = (effectivePositionSize * MAKER_FEE_RATE) + (effectivePositionSize * MAKER_FEE_RATE);
        const commissionTakerMaker = (effectivePositionSize * TAKER_FEE_RATE) + (effectivePositionSize * MAKER_FEE_RATE);

        stopLossResultDiv.textContent = `Potential Loss (at Stop Loss): $${stopLossProfitLoss.toFixed(2)}`;
        takeProfitResultDiv.textContent = `Potential Profit (at Take Profit): $${takeProfitProfitLoss.toFixed(2)}`;
        commissionTakerTakerDiv.textContent = `Estimated Commission (Taker/Taker): $${commissionTakerTaker.toFixed(4)}`;
        commissionMakerMakerDiv.textContent = `Estimated Commission (Maker/Maker): $${commissionMakerMaker.toFixed(4)}`;
        commissionTakerMakerDiv.textContent = `Estimated Commission (Taker/Maker): $${commissionTakerMaker.toFixed(4)}`;
    });

    // NEW: Fund Calculator Section Logic
    const calculateFundBtn = document.getElementById('calculateFundBtn');
    const riskAcceptedInput = document.getElementById('riskAccepted');
    const stopLossPercentageInput = document.getElementById('stopLossPercentage');
    const leverageFundCalcInput = document.getElementById('leverageFundCalc');
    const fundPercentageResultDiv = document.getElementById('fundPercentageResult');

    calculateFundBtn.addEventListener('click', () => {
        const riskAccepted = parseFloat(riskAcceptedInput.value); // Percentage, e.g., 1 for 1%
        const stopLossPercentage = parseFloat(stopLossPercentageInput.value); // Percentage, e.g., 1.5 for 1.5%
        const leverage = parseFloat(leverageFundCalcInput.value);

        // Clear previous results
        fundPercentageResultDiv.textContent = '';

        if (isNaN(riskAccepted) || isNaN(stopLossPercentage) || isNaN(leverage)) {
            alert('Please enter valid numbers for Accepted Risk, Stop Loss Percentage, and Leverage.');
            return;
        }

        if (stopLossPercentage <= 0) {
            alert('Stop Loss Percentage must be greater than 0.');
            return;
        }

        if (leverage <= 0) {
            alert('Leverage must be greater than 0.');
            return;
        }

        // Formula: %fund = (% risk you accept) / (% stop loss x leverage) x 100
        const fundPercentage = (riskAccepted / (stopLossPercentage * leverage)) * 100;

        if (isNaN(fundPercentage) || !isFinite(fundPercentage)) {
            fundPercentageResultDiv.textContent = 'Calculation Error: Check your input values.';
        } else {
            fundPercentageResultDiv.textContent = `Fund Allocation: ${fundPercentage.toFixed(4)}%`;
        }
    });

    // REMOVED: Record Closed Trade Section Logic (and related Telegram API calls)
});