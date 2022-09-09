var storeaws = (key,cardlist)=>{
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({"key" : key, "cardlist": cardlist});
    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };
    fetch("https://n00k71fhw9.execute-api.eu-west-2.amazonaws.com/sending", requestOptions)
    .then((response) => {
    if(response.ok) {
        return response.json();
    } else {
        throw new Error('Server response wasn\'t OK');
    }
    })
    .then((data) => {
    return data.statusCode;
    });
};

var retrieveaws = async (key)=>{
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({"key": key});
    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };
    var carddata = fetch("https://k5dsw8pttj.execute-api.eu-west-2.amazonaws.com/retrieving", requestOptions)
    .then(response => response.json())
    .then(data => {return data.body})
    .catch(function(error) {
    console.log(error)
    });
    return await carddata;
};

var myCardsRaw = await retrieveaws("Default: Replace this with the right URL");

var myCards = JSON.parse(myCardsRaw)

var cardIndex = 0;

var front = document.getElementById("front");
var back = document.getElementById("back");
var approve = document.getElementById("approve");
var input_url = document.getElementById("url");
var retrieve_url = document.getElementById("retrieve");

front.innerHTML = myCards.Item.cards[cardIndex].term;
back.innerHTML = myCards.Item.cards[cardIndex].definition;

var approval = (input_url, cardIndex) => {
    myCards.Item.cards[cardIndex].usable = true;
    storeaws(input_url.value, myCards)
}

approve.addEventListener('click', () => { approval(input_url, cardIndex)});

next.addEventListener('click', () => {
    var counter = 0;
    var fail = 0;
    cardIndex = (cardIndex + 1) % myCards.Item.cards.length;
    while (myCards.Item.cards[cardIndex].usable == true) {
        cardIndex = (cardIndex + 1) % myCards.Item.cards.length;
        counter = counter + 1;
        if (counter/2 > myCards.Item.cards.length){
            fail = 1;
            break;
        }
    }
    front.innerHTML = myCards.Item.cards[cardIndex].term;
    back.innerHTML = myCards.Item.cards[cardIndex].definition;
    if (fail === 1) {
        front.innerHTML = "All Approved"
        back.innerHTML = ""
    }
    back.style.visibility = "visible";
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, front]);
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, back]);
});

prev.addEventListener('click', () => {
    var counter = 0;
    var fail = 0;
    if (cardIndex > 0) cardIndex = (cardIndex - 1);
    else if (cardIndex == 0) cardIndex = myCards.Item.cards.length-1;
    while (myCards.Item.cards[cardIndex].usable == true) {
        if (cardIndex > 0) cardIndex = (cardIndex - 1);
        else if (cardIndex == 0) cardIndex = myCards.Item.cards.length-1;
        counter = counter + 1;
        if (counter/2 > myCards.Item.cards.length){
            fail = 1;
            break;
        }
    }
    front.innerHTML = myCards.Item.cards[cardIndex].term;
    back.innerHTML = myCards.Item.cards[cardIndex].definition;
    if (fail === 1) {
        front.innerHTML = "All Approved"
        back.innerHTML = ""
    }
    back.style.visibility = "visible";
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, front]);
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, back]);
});

retrieve_url.addEventListener("click", () => { praws(input_url.value); }, false)


var praws = async (url) => {

    myCardsRaw = await retrieveaws(url);
    myCards = JSON.parse(myCardsRaw)
    cardIndex = 0;

    front.innerHTML = myCards.Item.cards[cardIndex].term;
    back.innerHTML = myCards.Item.cards[cardIndex].definition;

}
