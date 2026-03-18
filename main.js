const CONTRACT_ADDRESS="0xF0E832459C47c9D506e71C9866C6B571a2B96F6D"

const ABI=[{"inputs":[{"internalType":"uint256","name":"_serviceId","type":"uint256"}],"name":"buyService","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_orderId","type":"uint256"}],"name":"completeOrder","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"uint256","name":"_priceInWei","type":"uint256"},{"internalType":"uint256","name":"_duration","type":"uint256"}],"name":"createService","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"serviceCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"services","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"address payable","name":"seller","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"uint256","name":"duration","type":"uint256"},{"internalType":"bool","name":"active","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"orders","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"serviceId","type":"uint256"},{"internalType":"address","name":"buyer","type":"address"},{"internalType":"address payable","name":"seller","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"enum FreelanceHub.OrderStatus","name":"status","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_orderId","type":"uint256"},{"internalType":"bool","name":"_accept","type":"bool"}],"name":"respondToOrder","outputs":[],"stateMutability":"nonpayable","type":"function"}]

let web3
let contract
let account

function shortAddr(a){
    return a.slice(0,6)+"..."+a.slice(-4)
}

function escapeHtml(text){
    const div=document.createElement("div")
    div.innerText=text
    return div.innerHTML
}

async function connectWallet(){
    if(!window.ethereum){
        alert("Installe MetaMask")
        return
    }

    const accounts=await ethereum.request({method:"eth_requestAccounts"})
    web3=new Web3(window.ethereum)
    account=accounts[0]
    contract=new web3.eth.Contract(ABI,CONTRACT_ADDRESS)

    document.getElementById("wallet-address").innerText=shortAddr(account)
    document.getElementById("connect-btn").style.display="none"
    document.getElementById("create-btn").disabled=false

    // Recharge la page automatiquement si on change de compte dans MetaMask !
    window.ethereum.on('accountsChanged', function () {
        window.location.reload();
    });

    await loadServices()
    await loadOrders()
    await loadBuyerOrders()
}

async function createService(){
    const name = document.getElementById("svc-name").value.trim()
    const price = document.getElementById("svc-price").value
    const duration = parseInt(document.getElementById("svc-duration").value)

    if(!name || !price || Number(price) <= 0 || !duration || duration <= 0){
        alert("Champs invalides")
        return
    }

    const priceWei = web3.utils.toWei(price.toString(),"ether")

    try{
        await contract.methods.createService(name, priceWei, duration).send({from:account})
        alert("Service créé")
        loadServices()
    }catch(err){
        console.error(err)
        alert("Transaction refusée ou erreur")
    }
}

async function loadServices(){
    const container=document.getElementById("services-list")
    container.innerHTML="Chargement..."
    const count=await contract.methods.serviceCount().call()
    container.innerHTML=""

    for(let i=1;i<=count;i++){
        const svc=await contract.methods.services(i).call()
        if(!svc.active) continue

        const card=document.createElement("div")
        card.className="card"
        const price=web3.utils.fromWei(svc.price,"ether")

        card.innerHTML=`
            <h4>${escapeHtml(svc.name)}</h4>
            <p>${price} ETH</p>
            <p>Durée ${svc.duration} jours</p>
            <button onclick="buyService(${svc.id},'${svc.price}')">Acheter</button>
        `
        container.appendChild(card)
    }
}

async function buyService(id,price){
    try {
        await contract.methods.buyService(id).send({ from:account, value:price })
        alert("Commande envoyée")
        loadOrders()
        loadBuyerOrders()
    } catch(err) {
        console.error("Erreur d'achat:", err)
    }
}

async function fetchAllOrders(filter){
    let results=[]
    let i=1
    
    while(true){
        try{
            let order=await contract.methods.orders(i).call()
            
            // CORRECTION ICI : Si l'ID est 0, c'est que la commande n'existe pas. On arrête la boucle.
            if(order.id === "0" || order.seller === "0x0000000000000000000000000000000000000000"){
                break;
            }

            if(filter(order)) results.push(order)
            i++
        }catch(err){
            break
        }
    }
    return results
}

async function loadOrders(){
    const container=document.getElementById("orders-list")
    // On vérifie que les adresses correspondent et que le statut est "0" (Pending)
    const orders=await fetchAllOrders(o=>o.seller.toLowerCase()===account.toLowerCase() && parseInt(o.status)===0)

    container.innerHTML=""
    if(orders.length === 0) container.innerHTML = "<p>Aucune commande à accepter.</p>"

    orders.forEach(o=>{
        const div=document.createElement("div")
        div.className="card" // J'utilise ta classe card pour que ce soit plus joli
        div.innerHTML=`
            Commande #${o.id} (${web3.utils.fromWei(o.amount,"ether")} ETH)
            <br><br>
            <button style="background: green;" onclick="respondToOrder(${o.id},true)">Accepter</button>
            <button style="background: red;" onclick="respondToOrder(${o.id},false)">Refuser</button>
        `
        container.appendChild(div)
    })
}

async function loadBuyerOrders(){
    const container=document.getElementById("complete-list")
    // Statut 1 = Accepted
    const orders=await fetchAllOrders(o=>o.buyer.toLowerCase()===account.toLowerCase() && parseInt(o.status)===1)

    container.innerHTML=""
    if(orders.length === 0) container.innerHTML = "<p>Aucune commande en cours.</p>"

    orders.forEach(o=>{
        const div=document.createElement("div")
        div.className="card"
        div.innerHTML=`
            Commande #${o.id}
            <br><br>
            <button onclick="completeOrder(${o.id})">Valider livraison</button>
        `
        container.appendChild(div)
    })
}

async function respondToOrder(id,accept){
    try {
        await contract.methods.respondToOrder(id,accept).send({from:account})
        loadOrders()
    } catch(err) {
        console.error(err)
    }
}

async function completeOrder(id){
    try {
        await contract.methods.completeOrder(id).send({from:account})
        loadBuyerOrders()
    } catch(err) {
        console.error(err)
    }
}