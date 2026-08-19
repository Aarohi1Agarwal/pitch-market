// ========================================
// PITCHMARKET FRONTEND
// ========================================


// ----------------------------------------
// TEMPORARY DEMO DATA
// ----------------------------------------
// This will later come from Flask API.

let products = [
    {
        id: 1,
        name: "FoodOil IQ",
        team: "Team Alpha",
        price: 124,
        startingPrice: 100,
        investment: 2400,
        change: 18.4
    },

    {
        id: 2,
        name: "EcoBottle",
        team: "Green Labs",
        price: 108,
        startingPrice: 100,
        investment: 1800,
        change: 8.0
    },

    {
        id: 3,
        name: "Smart Hostel",
        team: "DormTech",
        price: 103,
        startingPrice: 100,
        investment: 1200,
        change: 3.0
    },

    {
        id: 4,
        name: "FarmSense",
        team: "AgriVision",
        price: 96,
        startingPrice: 100,
        investment: 900,
        change: -4.0
    },

    {
        id: 5,
        name: "MediTrack",
        team: "HealthX",
        price: 116,
        startingPrice: 100,
        investment: 2100,
        change: 16.0
    },

    {
        id: 6,
        name: "StudyAI",
        team: "EduNova",
        price: 111,
        startingPrice: 100,
        investment: 1500,
        change: 11.0
    }
];


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
// RENDER PRODUCTS
// ========================================

function renderProducts() {

    productsGrid.innerHTML = "";


    products.forEach(product => {

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


        card.className = "product-card";


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
                        TOTAL INVESTED
                    </span>

                    <strong>
                        ${formatCurrency(product.investment)}
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
                sum + product.investment,
            0
        );


    const topMover =
        Math.max(
            ...products.map(
                product => product.change
            )
        );


    marketVolumeElement.textContent =
        formatCompactCurrency(totalVolume);


    topMoverElement.textContent =
        `+${topMover.toFixed(1)}%`;

}


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
// LEADERBOARD
// ========================================

function renderLeaderboard() {

    const sortedProducts =
        [...products].sort(
            (a, b) =>
                b.price - a.price
        );


    leaderboard.innerHTML = "";


    sortedProducts.forEach(
        (product, index) => {

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
                    ${formatCurrency(product.price)}
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


        // Validation

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


        // Deduct balance

        userBalance -= amount;


        // Update product

        selectedProduct.investment += amount;


        selectedProduct.price =
            selectedProduct.startingPrice +
            (
                selectedProduct.investment / 100
            );


        selectedProduct.change =
            (
                (
                    selectedProduct.price -
                    selectedProduct.startingPrice
                ) /
                selectedProduct.startingPrice
            ) * 100;


        // Update portfolio

        const existingInvestment =
            portfolio.find(
                item =>
                    item.productId ===
                    selectedProduct.id
            );


        if (existingInvestment) {

            existingInvestment.amount += amount;

        } else {

            portfolio.push({

                productId:
                    selectedProduct.id,

                productName:
                    selectedProduct.name,

                amount: amount

            });

        }


        updateBalance();

        renderProducts();

        renderLeaderboard();

        updateMarketSummary();

        renderPortfolio();


        closeInvestModal();


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


    let total =
        0;


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


        const currentValue =
            item.amount *
            (
                product.price /
                product.startingPrice
            );


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

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".filter-button"
                    )
                    .forEach(btn =>
                        btn.classList.remove(
                            "active"
                        )
                    );


                button.classList.add(
                    "active"
                );

            }
        );

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