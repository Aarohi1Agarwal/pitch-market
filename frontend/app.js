const PRODUCTS = [
    {id: 1, slug: "foodoil-iq", name: "FoodOil IQ", team: "Team Alpha", initialInvestment: 2400},
    {id: 2, slug: "ecobottle", name: "EcoBottle", team: "Green Labs", initialInvestment: 1800},
    {id: 3, slug: "smart-hostel", name: "Smart Hostel", team: "DormTech", initialInvestment: 1200},
    {id: 4, slug: "farmsense", name: "FarmSense", team: "AgriVision", initialInvestment: 900},
    {id: 5, slug: "meditrack", name: "MediTrack", team: "HealthX", initialInvestment: 2100},
    {id: 6, slug: "studyai", name: "StudyAI", team: "EduNova", initialInvestment: 1500}
];

const STORAGE_KEY = "pitchmarket-state-v1";

function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
        return {
            balance: 10000,
            investments: {}
        };
    }

    try {
        return JSON.parse(saved);
    } catch {
        return {
            balance: 10000,
            investments: {}
        };
    }
}

function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function formatCurrency(value) {
    return "₹" + Number(value).toLocaleString("en-IN");
}

function formatCompactCurrency(value) {
    if (value >= 1000000) {
        return "₹" + (value / 1000000).toFixed(1) + "M";
    }

    if (value >= 1000) {
        return "₹" + (value / 1000).toFixed(1) + "K";
    }

    return formatCurrency(value);
}

function getProductInvestment(product) {
    const state = loadState();
    return product.initialInvestment + Number(state.investments[product.id] || 0);
}

function getProductChange(product) {
    return ((getProductInvestment(product) - product.initialInvestment) / product.initialInvestment) * 100;
}

function updateBalanceElements() {
    const state = loadState();

    document.querySelectorAll("#userBalance, .userBalance").forEach((element) => {
        element.textContent = formatCurrency(state.balance);
    });
}

function showToast(message) {
    const toast = document.getElementById("toast");

    if (!toast) {
        return;
    }

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(window.pitchMarketToastTimer);

    window.pitchMarketToastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2600);
}

function renderMarket(filter = "all") {
    const grid = document.getElementById("productsGrid");

    if (!grid) {
        return;
    }

    let products = [...PRODUCTS];

    products.forEach((product) => {
        product.totalInvestment = getProductInvestment(product);
        product.change = getProductChange(product);
    });

    if (filter === "gainers") {
        products.sort((a, b) => b.change - a.change);
    }

    if (filter === "funded") {
        products.sort((a, b) => b.totalInvestment - a.totalInvestment);
    }

    grid.innerHTML = products.map((product) => {
        const trendClass = product.change >= 0 ? "up" : "down";
        const trendSymbol = product.change >= 0 ? "↑" : "↓";

        return `
            <article class="product-card">
                <div class="product-top">
                    <div class="product-logo">${product.name.charAt(0)}</div>
                    <span class="trend ${trendClass}">
                        ${trendSymbol} ${Math.abs(product.change).toFixed(1)}%
                    </span>
                </div>

                <div>
                    <h4 class="product-name">${product.name}</h4>
                    <p class="team-name">${product.team}</p>
                </div>

                <div class="price-row">
                    <div>
                        <span class="price-label">CURRENT PRICE</span>
                        <strong class="current-price">₹100</strong>
                    </div>

                    <div class="investment-info">
                        <span>TOTAL INVESTMENT</span>
                        <strong>${formatCurrency(product.totalInvestment)}</strong>
                    </div>
                </div>

                <div class="product-bottom">
                    <a class="invest-button" href="products/${product.slug}.html">
                        VIEW PITCH
                    </a>
                </div>
            </article>
        `;
    }).join("");

    const title = document.getElementById("marketTitle");

    if (title) {
        title.textContent =
            filter === "gainers" ? "Top Gainers" :
            filter === "funded" ? "Most Funded" :
            "All Ideas";
    }
}

function renderSummary() {
    const totalProducts = document.getElementById("totalProducts");
    const marketVolume = document.getElementById("marketVolume");
    const topMover = document.getElementById("topMover");

    if (!totalProducts || !marketVolume || !topMover) {
        return;
    }

    const totalVolume = PRODUCTS.reduce(
        (sum, product) => sum + getProductInvestment(product),
        0
    );

    const bestChange = Math.max(...PRODUCTS.map(getProductChange));

    totalProducts.textContent = PRODUCTS.length;
    marketVolume.textContent = formatCompactCurrency(totalVolume);
    topMover.textContent = `${bestChange >= 0 ? "+" : ""}${bestChange.toFixed(1)}%`;
}

function renderLeaderboard() {
    const leaderboard = document.getElementById("leaderboard");

    if (!leaderboard) {
        return;
    }

    const sorted = [...PRODUCTS]
        .map((product) => ({
            ...product,
            totalInvestment: getProductInvestment(product),
            change: getProductChange(product)
        }))
        .sort((a, b) => b.totalInvestment - a.totalInvestment);

    leaderboard.innerHTML = sorted.map((product, index) => `
        <div class="leaderboard-row">
            <span class="rank">#${index + 1}</span>

            <div class="leader-name">
                <strong>${product.name}</strong>
                <span>${product.team}</span>
            </div>

            <strong class="leader-price">
                ${formatCurrency(product.totalInvestment)}
            </strong>

            <span class="leader-change ${product.change >= 0 ? "up" : "down"}">
                ${product.change >= 0 ? "+" : ""}${product.change.toFixed(1)}%
            </span>
        </div>
    `).join("");
}

function renderPortfolio() {
    const list = document.getElementById("portfolioList");
    const value = document.getElementById("portfolioValue");

    if (!list || !value) {
        return;
    }

    const state = loadState();

    const entries = Object.entries(state.investments)
        .filter(([, amount]) => Number(amount) > 0);

    if (entries.length === 0) {
        value.textContent = "₹0";

        list.innerHTML = `
            <div class="portfolio-empty">
                <div class="empty-icon">+</div>
                <strong>No investments yet</strong>
                <p>Open any pitch to build your portfolio.</p>
            </div>
        `;

        return;
    }

    let total = 0;

    list.innerHTML = entries.map(([productId, amount]) => {
        const product = PRODUCTS.find((item) => item.id === Number(productId));

        if (!product) {
            return "";
        }

        total += Number(amount);

        return `
            <a class="leaderboard-row portfolio-row" href="products/${product.slug}.html">
                <div class="product-logo small">${product.name.charAt(0)}</div>

                <div class="leader-name">
                    <strong>${product.name}</strong>
                    <span>Invested ${formatCurrency(amount)} · Voting Power</span>
                </div>

                <strong class="leader-price">${formatCurrency(amount)}</strong>

                <span class="leader-change up">
                    +${getProductChange(product).toFixed(1)}%
                </span>
            </a>
        `;
    }).join("");

    value.textContent = formatCurrency(total);
}

function initMarketPage() {
    if (!document.getElementById("productsGrid")) {
        return;
    }

    updateBalanceElements();
    renderSummary();
    renderMarket();
    renderLeaderboard();
    renderPortfolio();

    document.querySelectorAll(".filter-button").forEach((button) => {
        button.addEventListener("click", () => {
            document.querySelectorAll(".filter-button").forEach((item) => {
                item.classList.remove("active");
            });

            button.classList.add("active");
            renderMarket(button.dataset.filter);
        });
    });
}

function initProductPage() {
    if (!window.PITCHMARKET_PRODUCT_ID) {
        return;
    }

    const product = PRODUCTS.find(
        (item) => item.id === Number(window.PITCHMARKET_PRODUCT_ID)
    );

    if (!product) {
        return;
    }

    const amountInput = document.getElementById("investmentAmount");
    const confirmButton = document.getElementById("confirmInvestment");

    function refreshProductStats() {
        const totalInvestment = document.getElementById("totalInvestment");
        const productChange = document.getElementById("productChange");

        if (totalInvestment) {
            totalInvestment.textContent =
                formatCurrency(getProductInvestment(product));
        }

        if (productChange) {
            const change = getProductChange(product);

            productChange.textContent =
                `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;

            productChange.className = change >= 0 ? "up" : "down";
        }

        updateBalanceElements();
    }

    document.querySelectorAll(".quick-amounts button").forEach((button) => {
        button.addEventListener("click", () => {
            amountInput.value = button.dataset.amount;
            amountInput.focus();
        });
    });

    confirmButton.addEventListener("click", () => {
        const amount = Number(amountInput.value);
        const state = loadState();

        if (!amount || amount < 100) {
            showToast("Minimum investment is ₹100.");
            return;
        }

        if (amount > state.balance) {
            showToast("Insufficient balance.");
            return;
        }

        state.balance -= amount;
        state.investments[product.id] =
            Number(state.investments[product.id] || 0) + amount;

        saveState(state);

        amountInput.value = "";
        refreshProductStats();

        showToast(
            `${formatCurrency(amount)} invested in ${product.name}.`
        );
    });

    refreshProductStats();
}

document.addEventListener("DOMContentLoaded", () => {
    initMarketPage();
    initProductPage();
});
