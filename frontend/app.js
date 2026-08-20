// ========================================
// PITCHMARKET FRONTEND
// ========================================


// ========================================
// DEMO PRODUCT DATA
// ========================================

let products = [
    {
        id: 1,
        name: "FoodOil IQ",
        team: "Team Alpha",
        price: 100,
        startingPrice: 100,
        initialInvestment: 2400,
        totalInvestment: 2400,
        change: 0
    },

    {
        id: 2,
        name: "EcoBottle",
        team: "Green Labs",
        price: 100,
        startingPrice: 100,
        initialInvestment: 1800,
        totalInvestment: 1800,
        change: 0
    },

    {
        id: 3,
        name: "Smart Hostel",
        team: "DormTech",
        price: 100,
        startingPrice: 100,
        initialInvestment: 1200,
        totalInvestment: 1200,
        change: 0
    },

    {
        id: 4,
        name: "FarmSense",
        team: "AgriVision",
        price: 100,
        startingPrice: 100,
        initialInvestment: 900,
        totalInvestment: 900,
        change: 0
    },

    {
        id: 5,
        name: "MediTrack",
        team: "HealthX",
        price: 100,
        startingPrice: 100,
        initialInvestment: 2100,
        totalInvestment: 2100,
        change: 0
    },

    {
        id: 6,
        name: "StudyAI",
        team: "EduNova",
        price: 100,
        startingPrice: 100,
        initialInvestment: 1500,
        totalInvestment: 1500,
        change: 0
    }
];


// ========================================
// USER DATA
// ========================================

let userBalance = 10000;

let selectedProduct = null;

let portfolio = [];


// ========================================
// DOM ELEMENTS
// ========================================

const productsGrid =
    document.getElementById("productsGrid");

const leaderboard =
    document.getElementById("leaderboard");

const userBalanceElement =
    document.getElementById("userBalance");

const totalProductsElement =
    document.getElementById("totalProducts");

const marketVolumeElement =
    document.getElementById("marketVolume");

const topMoverElement =
    document.getElementById("topMover");

const investModal =
    document.getElementById("investModal");

const closeModal =
    document.getElementById("closeModal");

const modalProductName =
    document.getElementById("modalProductName");

const modalProductPrice =
    document.getElementById("modalProductPrice");

const investmentAmount =
    document.getElementById("investmentAmount");

const confirmInvestment =
    document.getElementById("confirmInvestment");

const portfolioElement =
    document.getElementById("portfolio");

const portfolioValue =
    document.getElementById("portfolioValue");

const toast =
    document.getElementById("toast");


// ========================================
// FORMAT CURRENCY
// ========================================

function formatCurrency(value) {

    return "₹" + Number(value).toLocaleString("en-IN");

}


// ========================================
// FORMAT COMPACT CURRENCY
// ========================================

function formatCompactCurrency(value) {

    if (value >= 1000000) {

        return (
            "₹" +
            (value / 1000000).toFixed(1) +
            "M"
        );

    }

    if (value >= 1000) {

        return (
            "₹" +
            (value / 1000).toFixed(1) +
            "K"
        );

    }

    return formatCurrency(value);

}


// ========================================
// CALCULATE PRODUCT CHANGE
// ========================================
//
// Investment is voting power.
// Price does NOT change.
//
// Example:
//
// Initial investment = ₹1800
// New total investment = ₹2300
//
// Change = +27.8%
//
// ========================================

function calculateProductChange(product) {

    if (product.initialInvestment <= 0) {

        return 0;

    }

    return (
        (
            product.totalInvestment -
            product.initialInvestment
        ) /
        product.initialInvestment
    ) * 100;

}


// ========================================
// RENDER PRODUCTS
// ========================================

function renderProducts(data = products) {

    productsGrid.innerHTML = "";


    data.forEach(product => {

        // Keep change updated
        product.change =
            calculateProductChange(product);


        const trendClass =
            product.change >= 0
                ? "up"
                : "down";


        const trendSymbol =
            product.change >= 0
                ? "↑"
                : "↓";


        const card =
            document.createElement("article");


        card.className =
            "product-card";


        card.innerHTML = `

            <div class="product-top">

                <div class="product-logo">
                    ${product.name.charAt(0)}
                </div>

                <span class="trend ${trendClass}">
                    ${trendSymbol}
                    ${Math.abs(product.change).toFixed(1)}%
                </span>

            </div>


            <div>

                <h4 class="product-name">
                    ${product.name}
                </h4>

                <p class="team-name">
                    ${product.team}
                </p>

            </div>


            <div class="price-row">

                <div>

                    <span class="price-label">
                        CURRENT PRICE
                    </span>

                    <strong class="current-price">
                        ${formatCurrency(product.price)}
                    </strong>

                </div>


                <div class="investment-info">

                    <span>
                        TOTAL INVESTMENT
                    </span>

                    <strong>
                        ${formatCurrency(product.totalInvestment)}
                    </strong>

                </div>

            </div>


            <div class="product-bottom">

                <button
                    class="invest-button"
                    onclick="openInvestModal(${product.id})"
                >
                    INVEST IN IDEA
                </button>

            </div>

        `;


        productsGrid.appendChild(card);

    });


    totalProductsElement.textContent =
        products.length;

}


// ========================================
// MARKET SUMMARY
// ========================================

function updateMarketSummary() {

    const totalVolume =
        products.reduce(
            (sum, product) =>
                sum + product.totalInvestment,
            0
        );


    const topMover =
        Math.max(
            ...products.map(
                product =>
                    calculateProductChange(product)
            )
        );


    marketVolumeElement.textContent =
        formatCompactCurrency(totalVolume);


    topMoverElement.textContent =
        `${topMover >= 0 ? "+" : ""}${topMover.toFixed(1)}%`;

}


// ========================================
// LEADERBOARD
// ========================================
//
// IMPORTANT:
// Leaderboard is sorted by TOTAL INVESTMENT.
// Investment = voting power.
//
// ========================================

function renderLeaderboard() {

    const sortedProducts =
        [...products].sort(
            (a, b) =>
                b.totalInvestment -
                a.totalInvestment
        );


    leaderboard.innerHTML = "";


    sortedProducts.forEach(
        (product, index) => {

            product.change =
                calculateProductChange(product);


            const row =
                document.createElement("div");


            row.className =
                "leaderboard-row";


            const changeClass =
                product.change >= 0
                    ? "up"
                    : "down";


            row.innerHTML = `

                <span class="rank">
                    #${index + 1}
                </span>


                <div class="leader-name">

                    <strong>
                        ${product.name}
                    </strong>

                    <span>
                        ${product.team}
                    </span>

                </div>


                <strong class="leader-price">
                    ${formatCurrency(product.totalInvestment)}
                </strong>


                <span class="leader-change ${changeClass}">
                    ${product.change >= 0 ? "+" : ""}
                    ${product.change.toFixed(1)}%
                </span>

            `;


            leaderboard.appendChild(row);

        }
    );

}


// ========================================
// INVEST MODAL
// ========================================

function openInvestModal(productId) {

    selectedProduct =
        products.find(
            product =>
                product.id === productId
        );


    if (!selectedProduct) {

        return;

    }


    modalProductName.textContent =
        selectedProduct.name;


    modalProductPrice.textContent =
        formatCurrency(
            selectedProduct.price
        );


    investmentAmount.value = "";


    investModal.classList.add("show");


    setTimeout(() => {

        investmentAmount.focus();

    }, 100);

}


// ========================================
// CLOSE INVEST MODAL
// ========================================

function closeInvestModal() {

    investModal.classList.remove("show");

    selectedProduct = null;

}


closeModal.addEventListener(
    "click",
    closeInvestModal
);


investModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            investModal
        ) {

            closeInvestModal();

        }

    }
);


// ========================================
// QUICK INVESTMENT BUTTONS
// ========================================

document
    .querySelectorAll(".quick-amounts button")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                investmentAmount.value =
                    button.dataset.amount;

            }
        );

    });


// ========================================
// MAKE INVESTMENT
// ========================================
//
// Investment does ONLY ONE thing:
//
// 1. Deduct money from user
// 2. Add money to product's voting total
// 3. Update user's portfolio
// 4. Re-rank leaderboard
//
// PRICE NEVER CHANGES.
//
// ========================================

confirmInvestment.addEventListener(
    "click",
    () => {

        if (!selectedProduct) {

            return;

        }


        const amount =
            Number(
                investmentAmount.value
            );


        // --------------------------------
        // VALIDATION
        // --------------------------------

        if (!amount || amount < 100) {

            showToast(
                "Minimum investment is ₹100"
            );

            return;

        }


        if (amount > userBalance) {

            showToast(
                "Insufficient balance"
            );

            return;

        }


        // --------------------------------
        // DEDUCT USER BALANCE
        // --------------------------------

        userBalance -= amount;


        // --------------------------------
        // ADD INVESTMENT / VOTES
        // --------------------------------

        selectedProduct.totalInvestment +=
            amount;


        // --------------------------------
        // PRICE DOES NOT CHANGE
        // --------------------------------

        selectedProduct.price =
            selectedProduct.startingPrice;


        // --------------------------------
        // UPDATE CHANGE %
        // --------------------------------

        selectedProduct.change =
            calculateProductChange(
                selectedProduct
            );


        // --------------------------------
        // UPDATE PORTFOLIO
        // --------------------------------

        const existingInvestment =
            portfolio.find(
                item =>
                    item.productId ===
                    selectedProduct.id
            );


        if (existingInvestment) {

            existingInvestment.amount +=
                amount;

        } else {

            portfolio.push({

                productId:
                    selectedProduct.id,

                productName:
                    selectedProduct.name,

                amount:
                    amount

            });

        }


        // --------------------------------
        // REFRESH EVERYTHING
        // --------------------------------

        updateBalance();

        renderProducts();

        renderLeaderboard();

        updateMarketSummary();

        renderPortfolio();


        // --------------------------------
        // CLOSE MODAL
        // --------------------------------

        closeInvestModal();


        // --------------------------------
        // SUCCESS MESSAGE
        // --------------------------------

        showToast(
            `₹${amount.toLocaleString("en-IN")} invested in ${selectedProduct.name}`
        );

    }
);


// ========================================
// BALANCE
// ========================================

function updateBalance() {

    userBalanceElement.textContent =
        formatCurrency(userBalance);

}


// ========================================
// PORTFOLIO
// ========================================
//
// Since investment is voting,
// portfolio value = amount invested.
//
// No price multiplication.
//
// ========================================

function renderPortfolio() {

    if (portfolio.length === 0) {

        portfolioElement.innerHTML = `

            <div class="empty-icon">
                +
            </div>

            <strong>
                No investments yet
            </strong>

            <p>
                Invest in an idea to build your portfolio.
            </p>

        `;


        portfolioValue.textContent =
            "₹0";


        return;

    }


    portfolioElement.innerHTML = "";


    let total = 0;


    portfolio.forEach(item => {

        const product =
            products.find(
                p =>
                    p.id ===
                    item.productId
            );


        if (!product) {

            return;

        }


        // Investment itself is the value.
        const currentValue =
            item.amount;


        total += currentValue;


        const row =
            document.createElement("div");


        row.className =
            "leaderboard-row";


        row.innerHTML = `

            <div class="product-logo">
                ${product.name.charAt(0)}
            </div>


            <div class="leader-name">

                <strong>
                    ${product.name}
                </strong>

                <span>
                    Invested ${formatCurrency(item.amount)}
                    · Voting Power
                </span>

            </div>


            <strong class="leader-price">
                ${formatCurrency(currentValue)}
            </strong>


            <span class="leader-change">
                ${product.change >= 0 ? "+" : ""}
                ${product.change.toFixed(1)}%
            </span>

        `;


        portfolioElement.appendChild(row);

    });


    portfolioValue.textContent =
        formatCurrency(total);

}


// ========================================
// TOAST
// ========================================

function showToast(message) {

    toast.textContent =
        message;


    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}


// ========================================
// FILTER BUTTONS
// ========================================

document
    .querySelectorAll(".filter-button")
    .forEach(button => {

        button.addEventListener("click", () => {

            // Remove active from all buttons
            document
                .querySelectorAll(".filter-button")
                .forEach(btn => {
                    btn.classList.remove("active");
                });

            // Make clicked button active
            button.classList.add("active");

            const filter =
                button.textContent.trim();

            // ALL
            if (filter === "All") {

                renderProducts(products);

            }

            // TOP GAINERS
            else if (filter === "Top Gainers") {

                const sortedProducts =
                    [...products].sort(
                        (a, b) =>
                            b.change - a.change
                    );

                renderProducts(sortedProducts);

            }

            // MOST FUNDED
            else if (filter === "Most Funded") {

                const sortedProducts =
                    [...products].sort(
                        (a, b) =>
                            b.totalInvestment -
                            a.totalInvestment
                    );

                renderProducts(sortedProducts);

            }

        });

    });


// ========================================
// INITIAL RENDER
// ========================================

function initializeApp() {

    updateBalance();

    renderProducts();

    renderLeaderboard();

    updateMarketSummary();

    renderPortfolio();

}


initializeApp();