const CONTRACT_ADDRESS="0xbFa6F4fcc7119BbA0138f8BeD00d3205DfE40C2B"

const ABI=[
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_serviceId",
                "type": "uint256"
            }
        ],
        "name": "buyService",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_orderId",
                "type": "uint256"
            }
        ],
        "name": "completeOrder",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_priceInWei",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_duration",
                "type": "uint256"
            }
        ],
        "name": "createService",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_orderId",
                "type": "uint256"
            }
        ],
        "name": "deliverOrder",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "orderId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "serviceId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "buyer",
                "type": "address"
            }
        ],
        "name": "OrderPlaced",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "orderId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "enum FreelanceHub.OrderStatus",
                "name": "newStatus",
                "type": "uint8"
            }
        ],
        "name": "OrderStatusChanged",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_orderId",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "_accept",
                "type": "bool"
            }
        ],
        "name": "respondToOrder",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "seller",
                "type": "address"
            }
        ],
        "name": "ServiceCreated",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "orderCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "orders",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "serviceId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "buyer",
                "type": "address"
            },
            {
                "internalType": "address payable",
                "name": "seller",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "enum FreelanceHub.OrderStatus",
                "name": "status",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "serviceCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "services",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "address payable",
                "name": "seller",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "duration",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "active",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

let web3;
let contract;
let account;

window.addEventListener('load', async () => {
    if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) connectWallet();
    }
});

function shortAddr(a){ return a.slice(0,6)+"..."+a.slice(-4); }

function escapeHtml(text){
    const div=document.createElement("div"); div.innerText=text; return div.innerHTML;
}

async function updateBalance() {
    if (!account || !web3) return;
    
    try {
        const balanceWei = await web3.eth.getBalance(account);
        const balanceEth = parseFloat(web3.utils.fromWei(balanceWei, "ether")).toFixed(4);
        document.getElementById("wallet-balance").innerText = `${balanceEth} ETH (Ganache Local)`;
    } catch (err) {
        console.error("Erreur lors de la récupération du solde :", err);
    }
}

async function connectWallet(){
    if(!window.ethereum) return alert("Installez MetaMask");
    const accounts = await ethereum.request({method:"eth_requestAccounts"});
    web3 = new Web3(window.ethereum);
    account = accounts[0];
    contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

    document.getElementById("wallet-address").innerText = shortAddr(account);
    document.getElementById("connect-btn").style.display = "none";
    document.getElementById("create-btn").disabled = false;

    window.ethereum.on('accountsChanged', () => window.location.reload());

    await loadServices();
    await loadOrders();
    await loadBuyerOrders();
    await updateBalance();
    await loadHistory(); // <-- Affichage de l'historique au chargement
}

async function createService(){
    const name = document.getElementById("svc-name").value.trim();
    const price = document.getElementById("svc-price").value;
    const duration = parseInt(document.getElementById("svc-duration").value);

    if(!name || !price || Number(price) <= 0 || !duration || duration <= 0) return alert("Champs invalides");

    const priceWei = web3.utils.toWei(price.toString(),"ether");
    try {
        await contract.methods.createService(name, priceWei, duration).send({from:account});
        alert("Service publié");
        loadServices();
        updateBalance();
    } catch(err) { console.error(err); alert("Erreur lors de la création"); }
}

async function loadServices(){
    const container = document.getElementById("services-list");
    container.innerHTML = "<p>Chargement...</p>";
    
    try {
        const count = Number(await contract.methods.serviceCount().call());
        container.innerHTML = "";

        if (count === 0) {
            container.innerHTML = "<p>Aucun service disponible.</p>";
            return;
        }

        for(let i = 1; i <= count; i++){
            const svc = await contract.methods.services(i).call();
            if(!svc.active) continue;

            const card = document.createElement("div");
            card.className = "card";
            
            const idStr = svc.id.toString();
            const priceStr = svc.price.toString();
            const ethPrice = web3.utils.fromWei(priceStr, "ether");

            card.innerHTML = `
                <div class="card-content">
                    <h4>${escapeHtml(svc.name)}</h4>
                    <p class="price">Prix : <strong>${ethPrice} ETH</strong></p>
                    <p class="duration">Durée : <strong>${svc.duration} jours</strong></p>
                    <p class="seller">Vendeur : <span class="badge" title="${svc.seller}">${shortAddr(svc.seller)}</span></p>
                </div>
                <button class="btn-buy" onclick="buyService(${idStr},'${priceStr}')">Acheter ce service</button>
            `;
            container.appendChild(card);
        }
    } catch (err) {
        console.error("Erreur lors du chargement des services :", err);
        container.innerHTML = "<p style='color:red;'>Erreur d'affichage des services.</p>";
    }
}

async function buyService(id,price){
    try {
        await contract.methods.buyService(id).send({ from:account, value:price });
        alert("Commande passée avec succès");
        loadOrders(); 
        loadBuyerOrders();
        updateBalance();
        loadHistory(); // <-- Actualise l'historique
    } catch(err) { console.error(err); }
}

async function fetchAllOrders(filter){
    let results = [];
    let emptyCount = 0;
    for(let i = 1; i <= 100; i++){
        try {
            let order = await contract.methods.orders(i).call();
            if(order.id === "0" || order.seller === "0x0000000000000000000000000000000000000000"){
                emptyCount++;
                if(emptyCount >= 3) break;
                continue;
            }
            emptyCount = 0;
            if(filter(order)) results.push(order);
        } catch(err) {
            emptyCount++;
            if(emptyCount >= 3) break;
        }
    }
    return results;
}

// === VUE DU VENDEUR ===
async function loadOrders(){
    const container = document.getElementById("orders-list");
    const orders = await fetchAllOrders(o => 
        o.seller.toLowerCase() === account.toLowerCase() && 
        (parseInt(o.status) === 1 || parseInt(o.status) === 2 || parseInt(o.status) === 3)
    );

    container.innerHTML = orders.length === 0 ? "<p>Aucune commande à gérer.</p>" : "";

    orders.forEach(o => {
        const div = document.createElement("div"); div.className = "card";
        const ethAmount = web3.utils.fromWei(o.amount,"ether");
        const baseHTML = `<strong>Commande #${o.id}</strong> (${ethAmount} ETH)<br><br>`;

        if (parseInt(o.status) === 1) { // Pending
            div.innerHTML = baseHTML + `
                <button style="background: #28a745; color:white; border:none; padding:8px; border-radius:4px;" onclick="respondToOrder(${o.id},true)">Accepter</button>
                <button style="background: #dc3545; color:white; border:none; padding:8px; border-radius:4px; margin-left: 5px;" onclick="respondToOrder(${o.id},false)">Refuser</button>
            `;
        } else if (parseInt(o.status) === 2) { // Accepted
            div.innerHTML = baseHTML + `
                <span style="color: #007bff;">En cours de réalisation</span><br><br>
                <button style="background: #007bff; color:white; border:none; padding:8px; border-radius:4px;" onclick="deliverOrderCall(${o.id})">Valider comme terminé</button>
            `;
        } else if (parseInt(o.status) === 3) { // Delivered
            div.innerHTML = baseHTML + `
                <span style="color: #28a745;">✅ Travail livré</span><br>
                <small style="color: gray;">En attente de validation par l'acheteur.</small>
            `;
        }
        container.appendChild(div);
    });
}

// === VUE DE L'ACHETEUR ===
async function loadBuyerOrders(){
    const container = document.getElementById("complete-list");
    const orders = await fetchAllOrders(o => 
        o.buyer.toLowerCase() === account.toLowerCase() && 
        (parseInt(o.status) === 2 || parseInt(o.status) === 3)
    );

    container.innerHTML = orders.length === 0 ? "<p>Aucune commande en cours.</p>" : "";

    orders.forEach(o => {
        const div = document.createElement("div"); div.className = "card";
        const baseHTML = `<strong>Commande #${o.id}</strong><br><br>`;

        if (parseInt(o.status) === 2) { // Accepted
            div.innerHTML = baseHTML + `
                <span style="color: gray;">⏳ Le vendeur travaille sur votre commande.</span>
            `;
        } else if (parseInt(o.status) === 3) { // Delivered
            div.innerHTML = baseHTML + `
                <span style="color: #28a745;">Le vendeur a terminé le travail !</span><br><br>
                <button style="background: #ffc107; color:black; border:none; padding:8px; border-radius:4px;" onclick="completeOrder(${o.id})">Valider & Payer</button>
            `;
        }
        container.appendChild(div);
    });
}

// === HISTORIQUE DES TRANSACTIONS ===
async function loadHistory() {
    const container = document.getElementById("tx-history");
    if (!container) return; // Sécurité si le HTML n'est pas encore prêt

    container.innerHTML = "<p>Chargement...</p>";

    // Récupère toutes les commandes où l'utilisateur est impliqué
    const allOrders = await fetchAllOrders(o => 
        o.buyer.toLowerCase() === account.toLowerCase() || 
        o.seller.toLowerCase() === account.toLowerCase()
    );

    if (allOrders.length === 0) {
        container.innerHTML = "<p style='color: gray; font-size: 0.9rem;'>Aucune transaction.</p>";
        return;
    }

    allOrders.reverse(); // Les plus récentes en premier
    container.innerHTML = "";

    allOrders.forEach(o => {
        const isBuyer = o.buyer.toLowerCase() === account.toLowerCase();
        const status = parseInt(o.status);
        const ethAmount = web3.utils.fromWei(o.amount, "ether");
        
        if (status === 0) return; // Ignore les commandes annulées

        const div = document.createElement("div");
        div.className = "tx-item";

        if (isBuyer) {
            if (status >= 1 && status <= 3) {
                div.classList.add("pending");
                div.innerHTML = `
                    <div style="display: flex; justify-content: space-between;">
                        <span>Achat (#${o.id})</span>
                        <span class="tx-spent tx-amount">-${ethAmount} ETH</span>
                    </div>
                    <span style="color: #f5a623; font-size: 0.8rem;">⏳ En attente de validation</span>
                `;
            } else if (status === 4) { // Completed
                div.classList.add("completed");
                div.innerHTML = `
                    <div style="display: flex; justify-content: space-between;">
                        <span>Achat (#${o.id})</span>
                        <span class="tx-spent tx-amount">-${ethAmount} ETH</span>
                    </div>
                    <span style="color: var(--accent); font-size: 0.8rem;">✅ Validé & Payé</span>
                `;
            }
        } else {
            if (status >= 1 && status <= 3) {
                div.classList.add("pending");
                div.innerHTML = `
                    <div style="display: flex; justify-content: space-between;">
                        <span>Vente (#${o.id})</span>
                        <span class="tx-amount" style="color: gray;">+${ethAmount} ETH</span>
                    </div>
                    <span style="color: #f5a623; font-size: 0.8rem;">🔒 Fonds en séquestre</span>
                `;
            } else if (status === 4) { // Completed
                div.classList.add("earned");
                div.innerHTML = `
                    <div style="display: flex; justify-content: space-between;">
                        <span>Service terminé (#${o.id})</span>
                        <span class="tx-earned tx-amount">+${ethAmount} ETH</span>
                    </div>
                    <span style="color: #3b82f6; font-size: 0.8rem;">💰 Paiement reçu</span>
                `;
            }
        }
        container.appendChild(div);
    });
}

// === ACTIONS SUR LA BLOCKCHAIN ===
async function respondToOrder(id, accept){
    try { 
        await contract.methods.respondToOrder(id, accept).send({from:account}); 
        loadOrders(); 
        loadHistory(); 
    } 
    catch(err) { console.error(err); }
}

async function deliverOrderCall(id){
    try { 
        await contract.methods.deliverOrder(id).send({from:account}); 
        loadOrders(); 
        loadHistory(); 
    } 
    catch(err) { console.error(err); }
}

async function completeOrder(id){
    try { 
        await contract.methods.completeOrder(id).send({from:account}); 
        loadBuyerOrders(); 
        updateBalance(); 
        loadHistory(); 
    } 
    catch(err) { console.error(err); }
}

// === WIDGET MEILLEURS FREELANCES ===
const topFreelancers = [
    { name: "Alice", service: "UI/UX Design", rating: 4.9, img: "https://i.pravatar.cc/150?img=1" },
    { name: "Bob", service: "Smart Contract ERC20", rating: 4.7, img: "https://i.pravatar.cc/150?img=11" },
    { name: "Charlie", service: "Logo & Branding", rating: 5.0, img: "https://i.pravatar.cc/150?img=33" },
    { name: "Diana", service: "Audit DeFi", rating: 4.8, img: "https://i.pravatar.cc/150?img=4" },
    { name: "Eve", service: "Frontend Web3", rating: 4.6, img: "https://i.pravatar.cc/150?img=5" },
    { name: "Frank", service: "DApp Architecture", rating: 5.0, img: "https://i.pravatar.cc/150?img=6" },
    { name: "Grace", service: "Copywriting Web3", rating: 4.5, img: "https://i.pravatar.cc/150?img=9" },
    { name: "Henry", service: "3D NFT Collection", rating: 4.9, img: "https://i.pravatar.cc/150?img=8" },
    { name: "Ivy", service: "Community Management", rating: 4.4, img: "https://i.pravatar.cc/150?img=10" },
    { name: "Jack", service: "Tokenomics Design", rating: 4.8, img: "https://i.pravatar.cc/150?img=12" }
];

function loadTopFreelancers() {
    const container = document.getElementById("top-freelancers");
    if (!container) return;

    let htmlContent = "";

    // Fonction qui génère les 5 étoiles visuellement
    const getStars = (rating) => {
        let starsHtml = "";
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.round(rating)) {
                starsHtml += '<span class="star filled">★</span>'; // Étoile dorée
            } else {
                starsHtml += '<span class="star">★</span>'; // Étoile grisée
            }
        }
        return starsHtml;
    };

    // Nouveau design de la carte
    const createCard = (f) => `
        <div class="freelance-card">
            <img src="${f.img}" alt="${f.name}" class="freelance-avatar">
            <div class="freelance-info">
                <span class="freelance-name">${f.name}</span>
                <span class="freelance-service">${f.service}</span>
            </div>
            <div class="freelance-rating">
                <div class="stars">${getStars(f.rating)}</div>
                <span class="rating-number">${f.rating}/5</span>
            </div>
        </div>
    `;

    // On double la liste pour le défilement infini
    topFreelancers.forEach(f => htmlContent += createCard(f));
    topFreelancers.forEach(f => htmlContent += createCard(f)); 

    container.innerHTML = htmlContent;
}

window.addEventListener('DOMContentLoaded', loadTopFreelancers);

// On charge la liste dès que la page s'ouvre (pas besoin d'attendre MetaMask)
window.addEventListener('DOMContentLoaded', loadTopFreelancers);