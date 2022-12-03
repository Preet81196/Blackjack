window.oncontextmenu = (e)=>{e.preventDefault()}
window.onload = initLoad;

function initLoad(){
    let gameData = {
        deck:shuffleDeck(),
        playerHand:[[]],
        dealerHand:[],
        turn:0,
        playerScore:0,
        dealerScore:0
    }
    loadEvents(gameData);
    document.querySelector("#dealerScore").innerHTML = "Dealer Score: "+gameData.dealerScore;
    document.querySelector("#playerScore").innerHTML = "Player Score: "+gameData.playerScore;
}
function random(min,max){
    return Math.floor(Math.random()*(max-min+1))+min;
}
function loadEvents(gameData){
    document.querySelector("#newround").onclick = ()=>{newRoundClick(gameData)}
    document.querySelector("#restart").onclick = ()=>{restart(gameData)}
    document.querySelector("#hitme").onclick = ()=>{hitMe(gameData)}
    document.querySelector("#stand").onclick = ()=>{stand(gameData)}
    document.querySelector("#split").onclick = ()=>{split(gameData)}
    document.querySelector("#deal").onclick = ()=>{
        let score = document.querySelectorAll(".score");
        for(let i = 0; i < score.length; i++){
            score[i].style.animation = "fadeIn linear 0.2s";
            score[i].style.display = "flex";
        }
        let buttonHolder1 = document.querySelector("#buttonHolder1");
        let buttonHolder0 = document.querySelector("#buttonHolder0");
        buttonHolder0.style.animation = "fadeOut linear 0.2s";
        buttonHolder0.onanimationend = ()=>{
            buttonHolder0.style.display = "none";
            buttonHolder1.style.animation = "fadeIn linear 0.2s";
            buttonHolder1.style.display = "flex";
            initDeal(gameData);
        }
    }
    let instructions = document.querySelector(".instructions");
    document.querySelector("#howtoback").onclick = ()=>{
        instructions.style.animation = "fadeOut ease-in-out 0.2s";
        instructions.onanimationend = ()=>{
            instructions.style.animation = "none";
            instructions.style.display = "none";
            instructions.onanimationend = null;
        }
    }
    document.querySelector("#howto").onclick = ()=>{
        instructions.style.animation = "fadeIn ease-in-out 0.2s";
        instructions.style.display = "block";
        instructions.onanimationend = ()=>{
            instructions.style.animation = "none";
            instructions.onanimationend = null;
        }
    }
}
function newRoundClick(gameData){
    if(gameData.playerHand.length > 1) document.querySelector("#playerTotal2").style.display = "none";
    let mask = document.querySelector(".mask");
    mask.style.animation = "fadeOut linear 0.2s";
    mask.onanimationend = ()=>{
        mask.style.display = "none";
        mask.onanimationend = "";
        if(gameData.playerHand.length === 1) restart(gameData);
        else{
            gameData.turn = 0;
            let totals = [0,0];
            for(let j = 0; j < gameData.playerHand.length; j++){
                for(let i = 0; i < gameData.playerHand[j].length; i++){
                    if(gameData.playerHand[j][i].value > 11) totals[j] += 10;
                    else totals[j] += gameData.playerHand[j][i].value;
                }
                if(totals[j] > 21){
                    for(let i = 0; i < gameData.playerHand[j].length; i++){
                        if(gameData.playerHand[j][i].value === 11){
                            totals[j] -= 10;
                            if(totals[j] <= 21) break;
                        }
                    }
                }
            }

            let dealerTotal = 0;
            for(let i = 0; i < gameData.dealerHand.length; i++){
                if(gameData.dealerHand[i].value > 11) dealerTotal += 10;
                else dealerTotal += gameData.dealerHand[i].value;
            }
            if(dealerTotal > 21){
                for(let j = 0; j < gameData.dealerHand.length; j++){
                    if(gameData.dealerHand[j].value === 11){
                        dealerTotal -= 10;
                        if(dealerTotal <= 21) break;
                    }
                }
            }

            if(dealerTotal > 21 || ((dealerTotal < totals[0] && totals[0] <= 21) || (dealerTotal < totals[1] && totals[1] <= 21))) restart(gameData);
            else{
                if(totals[1] > 21) gameData.playerHand.pop();
                else{
                    gameData.playerHand[0] = gameData.playerHand[1];
                    gameData.playerHand.pop();

                    let playerHand1 = document.querySelector("#playerHand1");
                    while(playerHand1.children.length > 0) playerHand1.removeChild(playerHand1.lastChild);
                    for(let i = 0; i < gameData.playerHand[0].length; i++){
                        let newCard = gameData.playerHand[0][i];
                        let newCardElem = document.createElement("div");
                        newCardElem.className = "card";
                
                        let allType = ["C","D","H","S"];
                        let allValue = ["A","J","Q","K"];
                        let type = allType[newCard.type];
                        let value;
                
                        if(newCard.value > 10) value = allValue[newCard.value-11];
                        else value = JSON.stringify(newCard.value);
                        newCardElem.style.backgroundImage = "url(cards/png/"+value+type+".png)";
                        playerHand1.appendChild(newCardElem);
                        newCardElem.style.visibility = "visible";
                    }
                }
            
                let playerHand2 = document.querySelector("#playerHand2");
                playerHand2.style.animation = "fadeOut linear 0.2s";
                playerHand2.onanimationend = ()=>{
                    playerHand2.style.animation = "none";
                    playerHand2.style.display = "none";
                    playerHand2.onanimationend = null;
                    while(playerHand2.children.length > 0) playerHand2.removeChild(playerHand2.lastChild);
                }
            }
        }
    }
}
function shuffleDeck(){
    let deck = [], startDeck = [];
    for(let i = 0; i < 4; i++){
        for(let j = 2; j < 15; j++){
            startDeck.push({type:i,value:j});
        }
    }
    for(let i = 0; i < 52; i++){
        let index = random(0,(51-i));
        deck.push(startDeck[index]);
        startDeck.splice(index,1);
    }
    return deck;
}
function initDeal(gameData){
    document.querySelector("#dealerScore").innerHTML = "Dealer Score: "+gameData.dealerScore;
    document.querySelector("#playerScore").innerHTML = "Player Score: "+gameData.playerScore;
    let playerHand = document.querySelector("#playerHand1");
    let dealerHand = document.querySelector("#dealerHand");
    
    for(let i = 0; i < 4; i++){
        let newCard = gameData.deck.shift();
        let newCardElem = document.createElement("div");
        newCardElem.className = "card";

        let allType = ["C","D","H","S"];
        let allValue = ["A","J","Q","K"];
        let type = allType[newCard.type];
        let value;

        if(newCard.value > 10) value = allValue[newCard.value-11];
        else value = JSON.stringify(newCard.value);
        if(i === 1) newCardElem.style.backgroundImage = "url(cards/png/gray_back.png)";
        else newCardElem.style.backgroundImage = "url(cards/png/"+value+type+".png)";
        if(i % 2 === 0){
            gameData.playerHand[0].push(newCard);
            playerHand.appendChild(newCardElem);
            setTimeout(()=>{
                newCardElem.style.visibility = "visible";
                newCardElem.style.animation = "cardInFar linear 0.2s";
            },i*200);
        }
        else{
            gameData.dealerHand.push(newCard);
            dealerHand.appendChild(newCardElem);
            setTimeout(()=>{
                newCardElem.style.visibility = "visible";
                newCardElem.style.animation = "cardInShort linear 0.2s";
            },i*200);
        }
    }

    let playerTotal = 0;
    for(let i = 0; i < gameData.playerHand[0].length; i++){
        if(gameData.playerHand[0][i].value > 11) playerTotal += 10;
        else playerTotal += gameData.playerHand[0][i].value;
    }
    if(playerTotal > 21){
        for(let j = 0; j < gameData.playerHand[0].length; j++){
            if(gameData.playerHand[0][j].value === 11){
                playerTotal -= 10;
                if(playerTotal <= 21) break;
            }
        }
    }
    document.querySelector(".dealerTotal").style.display = "none";
    document.querySelector("#playerTotal1").innerHTML = playerTotal;
    let value1 = gameData.playerHand[0][0].value;
    let value2 = gameData.playerHand[0][1].value;
    if(value1 > 10 && value1 != 11) value1 = 10;
    if(value2 > 10 && value1 != 11) value2 = 10;
    if(value1 === value2 && document.querySelector("#playerHand2").style.display != "block"){
        let split = document.querySelector("#split");
        split.style.animation = "fadeIn linear 0.2s";
        split.style.display = "flex";
        split.onanimationend = null;
    }
}
function hitMe(gameData){
    let split = document.querySelector("#split");
    if(split.style.display === "flex"){
        split.style.animation = "fadeOut linear 0.2s";
        split.onanimationend = ()=>{
            split.style.animation = "none";
            split.style.display = "none";
            split.onanimationend = null;
        }
    }

    let playerHand = document.querySelector("#playerHand"+(gameData.turn+1));
    let newCard = gameData.deck.shift();
    let newCardElem = document.createElement("div");
    newCardElem.className = "card";

    let allType = ["C","D","H","S"];
    let allValue = ["A","J","Q","K"];
    let type = allType[newCard.type];
    let value;

    if(newCard.value > 10) value = allValue[newCard.value-11];
    else value = JSON.stringify(newCard.value);
    newCardElem.style.backgroundImage = "url(cards/png/"+value+type+".png)";
    gameData.playerHand[gameData.turn].push(newCard);
    playerHand.appendChild(newCardElem);
    newCardElem.style.visibility = "visible";
    newCardElem.style.animation = "cardInFar linear 0.2s";

    let total = 0;
    for(let i = 0; i < gameData.playerHand[gameData.turn].length; i++){
        if(gameData.playerHand[gameData.turn][i].value > 11) total += 10;
        else total += gameData.playerHand[gameData.turn][i].value;
    }
    if(total > 21){
        for(let j = 0; j < gameData.playerHand[gameData.turn].length; j++){
            if(gameData.playerHand[gameData.turn][j].value === 11){
                total -= 10;
                if(total <= 21) break;
            }
        }
    }
    document.querySelector("#playerTotal"+(gameData.turn+1)).innerHTML = total;
    if(total > 21){
        if(gameData.playerHand.length > 1){
            document.querySelector("#newround").onclick = ()=>{
                let mask = document.querySelector(".mask");
                mask.style.animation = "fadeOut linear 0.2s";
                mask.onanimationend = ()=>{
                    document.querySelector("#newround").onclick = ()=>{newRoundClick(gameData)}
                    mask.style.animation = "none";
                    mask.style.display = "none";
                    mask.onanimationend = "";
                }

                let currentHand = JSON.parse(JSON.stringify(gameData.playerHand[gameData.turn]));
                gameData.playerHand = [currentHand];
                document.querySelector("#playerTotal2").style.display = "none";
                gameData.turn = 0;
               
                let playerHand2 = document.querySelector("#playerHand2");
                playerHand2.style.animation = "fadeOut linear 0.2s";
                playerHand2.onanimationend = ()=>{
                    playerHand2.style.animation = "none";
                    playerHand2.style.display = "none";
                    playerHand2.onanimationend = null;
                    while(playerHand2.children.length > 0) playerHand2.removeChild(playerHand2.lastChild);
                }
    
                let playerHand1 = document.querySelector("#playerHand1");
                while(playerHand1.children.length > 0) playerHand1.removeChild(playerHand1.lastChild);
                for(let i = 0; i < currentHand.length; i++){
                    let newCard = currentHand[i];
                    let newCardElem = document.createElement("div");
                    newCardElem.className = "card";
        
                    let allType = ["C","D","H","S"];
                    let allValue = ["A","J","Q","K"];
                    let type = allType[newCard.type];
                    let value;
        
                    if(newCard.value > 10) value = allValue[newCard.value-11];
                    else value = JSON.stringify(newCard.value);
                    newCardElem.style.backgroundImage = "url(cards/png/"+value+type+".png)";
        
                    playerHand1.appendChild(newCardElem);
                    newCardElem.style.visibility = "visible";
                }
    
                let total = 0;
                for(let i = 0; i < gameData.playerHand[0].length; i++){
                    if(gameData.playerHand[0][i].value > 11) total += 10;
                    else total += gameData.playerHand[0][i].value;
                }
                if(total > 21){
                    for(let j = 0; j < gameData.playerHand[0].length; j++){
                        if(gameData.playerHand[0][j].value === 11){
                            total -= 10;
                            if(total <= 21) break;
                        }
                    }
                }
                document.querySelector("#playerTotal1").innerHTML = total;
            }
            roundOver(0,2);


            
        }
        else{
            let dealerHand = document.querySelector("#dealerHand");
            dealerHand.children[0].style.animation = "rotate linear 0.1s";
            dealerHand.children[0].onanimationend = ()=>{
                let flipCardType = allType[gameData.dealerHand[0].type];
                let flipCardValue;
                if(gameData.dealerHand[0].value > 10) flipCardValue = allValue[gameData.dealerHand[0].value-11];
                else flipCardValue = JSON.stringify(gameData.dealerHand[0].value);
                dealerHand.children[0].style.backgroundImage = "url(cards/png/"+flipCardValue+flipCardType+".png)";
                dealerHand.children[0].style.animation = "rotateBack linear 0.1s";
                dealerHand.children[0].onanimationend = "";
            }
            
            let dealerTotal = 0;
            for(let i = 0; i < gameData.dealerHand.length; i++){
                if(gameData.dealerHand[i].value > 11) dealerTotal += 10;
                else dealerTotal += gameData.dealerHand[i].value;
            }
            if(dealerTotal > 21){
                for(let j = 0; j < gameData.dealerHand.length; j++){
                    if(gameData.dealerHand[j].value === 11){
                        dealerTotal -= 10;
                        if(dealerTotal <= 21) break;
                    }
                }
            }
            gameData.dealerScore += dealerTotal; 
            document.querySelector("#dealerScore").innerHTML = "Dealer Score: "+gameData.dealerScore;
            document.querySelector(".dealerTotal").innerHTML = dealerTotal;
            document.querySelector(".dealerTotal").style.display = "flex";
            roundOver(0,gameData.playerHand.length);
        }
    }
    if(gameData.playerHand.length > 1){
        if(gameData.turn) gameData.turn = 0;
        else gameData.turn = 1;
    }
}
function stand(gameData){
    function dealerDraw(playerTotal,dealerTotal){
        let dealerHand = document.querySelector("#dealerHand");
        let newCard = gameData.deck.shift();
        let newCardElem = document.createElement("div");
        newCardElem.className = "card";

        let allType = ["C","D","H","S"];
        let allValue = ["A","J","Q","K"];
        let type = allType[newCard.type];
        let value;

        if(newCard.value > 10) value = allValue[newCard.value-11];
        else value = JSON.stringify(newCard.value);
        newCardElem.style.backgroundImage = "url(cards/png/"+value+type+".png)";
        gameData.dealerHand.push(newCard);
        dealerHand.appendChild(newCardElem);
        newCardElem.style.visibility = "visible";
        newCardElem.style.animation = "cardInFar linear 0.2s";

        setTimeout(()=>{
            if(newCard.value > 11) dealerTotal += 10;
            else dealerTotal += newCard.value;
            if(dealerTotal < 17) dealerDraw(playerTotal,dealerTotal);
            else{
                if(dealerTotal <= 21){
                    if(playerTotal === dealerTotal){
                        roundOver(2,gameData.playerHand.length);
                        gameData.playerScore += playerTotal;
                        gameData.dealerScore += dealerTotal;
                        document.querySelector("#dealerScore").innerHTML = "Dealer Score: "+gameData.dealerScore;
                        document.querySelector("#playerScore").innerHTML = "Player Score: "+gameData.playerScore;
                    }
                    else if(playerTotal > dealerTotal){
                        roundOver(1,gameData.playerHand.length);
                        gameData.playerScore += playerTotal;
                        document.querySelector("#playerScore").innerHTML = "Player Score: "+gameData.playerScore;
                    }
                    else{
                        roundOver(0,gameData.playerHand.length);
                        gameData.dealerScore += dealerTotal;
                        document.querySelector("#dealerScore").innerHTML = "Dealer Score: "+gameData.dealerScore;
                    }
                }
                else{
                    for(let j = 0; j < gameData.dealerHand.length; j++){
                        if(gameData.dealerHand[j].value === 11){
                            dealerTotal -= 10;
                            if(dealerTotal <= 21) break;
                        }
                    }
                    if(dealerTotal > 21){
                        gameData.playerScore += playerTotal;
                        document.querySelector("#playerScore").innerHTML = "Player Score: "+gameData.playerScore;
                        roundOver(1,gameData.playerHand.length);
                    }
                    else{
                        if(playerTotal === dealerTotal){
                            gameData.playerScore += playerTotal;
                            gameData.dealerScore += dealerTotal;
                            document.querySelector("#dealerScore").innerHTML = "Dealer Score: "+gameData.dealerScore;
                            document.querySelector("#playerScore").innerHTML = "Player Score: "+gameData.playerScore;
                            roundOver(2,gameData.playerHand.length);
                        }
                        else if(playerTotal > dealerTotal){
                            gameData.playerScore += playerTotal;
                            document.querySelector("#playerScore").innerHTML = "Player Score: "+gameData.playerScore;
                            roundOver(1,gameData.playerHand.length);
                        }
                        else{
                            gameData.dealerScore += dealerTotal;
                        document.querySelector("#dealerScore").innerHTML = "Dealer Score: "+gameData.dealerScore;
                            roundOver(0,gameData.playerHand.length);
                        }
                    }
                }
            }
            document.querySelector(".dealerTotal").innerHTML = dealerTotal;
        },300);        
    }
    let allType = ["C","D","H","S"];
    let allValue = ["A","J","Q","K"];
    let dealerHand = document.querySelector("#dealerHand");
    dealerHand.children[0].style.animation = "rotate linear 0.1s";
    dealerHand.children[0].onanimationend = ()=>{
        let flipCardType = allType[gameData.dealerHand[0].type];
        let flipCardValue;
        if(gameData.dealerHand[0].value > 10) flipCardValue = allValue[gameData.dealerHand[0].value-11];
        else flipCardValue = JSON.stringify(gameData.dealerHand[0].value);
        dealerHand.children[0].style.backgroundImage = "url(cards/png/"+flipCardValue+flipCardType+".png)";
        dealerHand.children[0].style.animation = "rotateBack linear 0.1s";
        dealerHand.children[0].onanimationend = "";
    }

    let totals = [0,0];
    for(let j = 0; j < gameData.playerHand.length; j++){
        for(let i = 0; i < gameData.playerHand[j].length; i++){
            if(gameData.playerHand[j][i].value > 11) totals[j] += 10;
            else totals[j] += gameData.playerHand[j][i].value;
        }
        if(totals[j] > 21){
            for(let i = 0; i < gameData.playerHand[j].length; i++){
                if(gameData.playerHand[j][i].value === 11){
                    totals[j] -= 10;
                    if(totals[j] <= 21) break;
                }
            }
        }
    }

    let dealerTotal = 0;
    for(let i = 0; i < gameData.dealerHand.length; i++){
        if(gameData.dealerHand[i].value > 11) dealerTotal += 10;
        else dealerTotal += gameData.dealerHand[i].value;
    }
    if(dealerTotal > 21){
        for(let j = 0; j < gameData.dealerHand.length; j++){
            if(gameData.dealerHand[j].value === 11){
                dealerTotal -= 10;
                if(dealerTotal <= 21) break;
            }
        }
    }

    document.querySelector("#playerTotal1").innerHTML = totals[0];
    document.querySelector("#playerTotal2").innerHTML = totals[1];
    document.querySelector(".dealerTotal").innerHTML = dealerTotal;
    document.querySelector(".dealerTotal").style.display = "flex";

    if(dealerTotal > 21){
        roundOver(1,gameData.playerHand.length);
        gameData.playerScore += Math.max(...totals);
        document.querySelector("#playerScore").innerHTML = "Player Score: "+gameData.playerScore;
    }
    else if(dealerTotal >= 17){
        if(totals[0] > dealerTotal || totals[1] > dealerTotal){
            roundOver(1,gameData.playerHand.length);
            gameData.playerScore += Math.max(...totals);
            document.querySelector("#playerScore").innerHTML = "Player Score: "+gameData.playerScore;
        }
        else if(totals[0] < dealerTotal && totals[1] < dealerTotal){
            roundOver(0,gameData.playerHand.length);
            gameData.dealerScore += dealerTotal;
            document.querySelector("#dealerScore").innerHTML = "Dealer Score: "+gameData.dealerScore;
        }
        else{
            gameData.playerScore += Math.max(...totals);
            gameData.dealerScore += dealerTotal;
            document.querySelector("#dealerScore").innerHTML = "Dealer Score: "+gameData.dealerScore;
            document.querySelector("#playerScore").innerHTML = "Player Score: "+gameData.playerScore;
            roundOver(2,gameData.playerHand.length);
        }
    }
    else dealerDraw(Math.max(...totals),dealerTotal);
}
function roundOver(whoWon,playerNum){
    let newround = document.querySelector("#newround");
    if(playerNum === 2) newround.innerHTML = "OK";
    else newround.innerHTML = "New Round";

    let roundOverHead = document.querySelector(".roundOverHead");
    switch(whoWon){
        default:break;
        case 0:roundOverHead.innerHTML = "You Lost!";break;
        case 1:roundOverHead.innerHTML = "You Won!";break;
        case 2:roundOverHead.innerHTML = "Push!";break;
    }
    let mask = document.querySelector(".mask");
    mask.style.animation = "fadeIn linear 0.2s";
    mask.style.display = "block";
}
function restart(gameData){
    if(gameData.playerHand.length > 1){
        document.querySelector("#playerTotal2").style.display = "none";
        document.querySelector(".dealerTotal").style.display = "none";
        gameData.playerHand.pop();
    }
    let playerHand2 = document.querySelector("#playerHand2");
    if(playerHand2.style.display === "flex"){
        playerHand2.style.animation = "fadeOut linear 0.2s";
        playerHand2.onanimationend = ()=>{
            playerHand2.style.animation = "none";
            playerHand2.style.display = "none";
            playerHand2.onanimationend = null;
            while(playerHand2.children.length > 0) playerHand2.removeChild(playerHand2.lastChild);
        }
    }
    let split = document.querySelector("#split");
    if(split.style.display === "flex"){
        split.style.animation = "fadeOut linear 0.2s";
        split.onanimationend = ()=>{
            split.style.animation = "none";
            split.style.display = "none";
            split.onanimationend = null;
        }
    }
        
    function restartBoard(gameData){
        if(gameData.playerHand[0].length === 0 && gameData.dealerHand.length === 0){
            gameData = {
                deck:shuffleDeck(),
                playerHand:[[]],
                dealerHand:[],
                turn:0,
                playerScore:0,
                dealerScore:0,
            }
            initDeal(gameData);
            loadEvents(gameData);
        }
    }
    let playerHand = document.querySelector("#playerHand1");
    let dealerHand = document.querySelector("#dealerHand");
    for(let i = 0; i < gameData.playerHand[0].length; i++){
        playerHand.children[i].style.animation = "cardAway linear 0.2s";
        playerHand.children[i].onanimationend = ()=>{
            playerHand.removeChild(playerHand.firstChild);
            gameData.playerHand[0].shift();
            restartBoard(gameData);
        }
    }
    for(let i = 0; i < gameData.dealerHand.length; i++){
        dealerHand.children[i].style.animation = "cardAway linear 0.2s";
        dealerHand.children[i].onanimationend = ()=>{
            dealerHand.removeChild(dealerHand.firstChild);
            gameData.dealerHand.shift();
            restartBoard(gameData);
        }
    }
}
function split(gameData){
    gameData.playerHand.push([]);
    let split = document.querySelector("#split");
    split.style.animation = "fadeOut linear 0.2s";
    split.onanimationend = ()=>{
        split.style.animation = "none";
        split.style.display = "none";
        split.onanimationend = null;

        let playerHand1 = document.querySelector("#playerHand1");
        let playerHand2 = document.querySelector("#playerHand2");
        playerHand2.style.animation = "fadeIn linear 0.2s";
        playerHand2.style.display = "flex";

        playerHand2.appendChild(playerHand1.lastChild);
        gameData.playerHand[1].push(gameData.playerHand[0].pop());
       
        for(let i = 0; i < 2; i++){
            let hands = [playerHand1,playerHand2]
            let newCard = gameData.deck.shift();
            let newCardElem = document.createElement("div");
            newCardElem.className = "card";

            let allType = ["C","D","H","S"];
            let allValue = ["A","J","Q","K"];
            let type = allType[newCard.type];
            let value;

            if(newCard.value > 10) value = allValue[newCard.value-11];
            else value = JSON.stringify(newCard.value);
            newCardElem.style.backgroundImage = "url(cards/png/"+value+type+".png)";

            gameData.playerHand[i].push(newCard);
            hands[i].appendChild(newCardElem);
            setTimeout(()=>{
                newCardElem.style.visibility = "visible";
                newCardElem.style.animation = "cardInFar linear 0.2s";
            },200);
        }


        let totals = [0,0];
        for(let j = 0; j < gameData.playerHand.length; j++){
            for(let i = 0; i < gameData.playerHand[j].length; i++){
                if(gameData.playerHand[j][i].value > 11) totals[j] += 10;
                else totals[j] += gameData.playerHand[j][i].value;
            }
            if(totals[j] > 21){
                for(let i = 0; i < gameData.playerHand[j].length; i++){
                    if(gameData.playerHand[j][i].value === 11){
                        totals[j] -= 10;
                        if(totals[j] <= 21) break;
                    }
                }
            }
        }
        document.querySelector("#playerTotal2").style.display = "flex";
        document.querySelector("#playerTotal2").innerHTML = totals[1];
        document.querySelector("#playerTotal1").innerHTML = totals[0];
    }
}