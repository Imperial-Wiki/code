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
}

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
}

let select_f = function() { 
    front.innerHTML = myCards.Item.cards[this].term;
    back.innerHTML = myCards.Item.cards[this].definition;
    back.style.visibility = "hidden";
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, front]);
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, back]);
    cardIndex = this;
}

var myCardsRaw = await retrieveaws(window.location.href);

var myCards = JSON.parse(myCardsRaw)

var newCard;
var front = document.getElementById("front");
var back = document.getElementById("back");
var flip = document.getElementById("flip");
var submit = document.querySelectorAll("input[value = Submit]")[0];
var next = document.getElementById("next");
var prev = document.getElementById("prev");
var preview = document.getElementById("preview");
var formFront, formBack;
var toc = document.getElementById("toc");

var cardIndex = 0;

front.innerHTML = myCards.Item.cards[cardIndex].term;
back.innerHTML = myCards.Item.cards[cardIndex].definition;
back.style.visibility = "hidden";

if (typeof myCards.Item.cards !== "undefined") {
    for (let i = 0; i < myCards.Item.cards.length; i++) {
        if (myCards.Item.cards[i].usable) {
            let tocIterator = document.createElement("div")
            let tocButton = document.createElement("button")
            tocButton.innerHTML = myCards.Item.cards[i].term;
            tocButton.addEventListener('click', select_f.bind(i) );
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, tocButton]);
            tocIterator.appendChild(tocButton)
            toc.appendChild(tocIterator)
        }
    }
}

flip.addEventListener('click', () => {
    if (back.style.visibility === "hidden") {
    back.style.visibility = "visible";
    } else {
    front.style.visibility = "visible";
    back.style.visibility = "hidden";
    }
});

function clearForm() {
    document.getElementById("newTerm").value = "";
    document.getElementById("newDef").value = "";
    document.getElementById("cardForm").reset();
};

function updatePlaceholder() {
    document.getElementById("newTerm").placeholder =
    "...another front?";
    document.getElementById("newDef").placeholder =
    "...and another back?";
};

submit.addEventListener('click', (formFront, formBack) => {
    formFront = document.getElementById("newTerm");
    formBack = document.getElementById("newDef");
    if (
    formFront.value !== formBack.value &&
    formFront.value != "" &&
    formBack.value != ""
    ) {
    var newCard = {
      "usable" : false,
      "term" : "",
      "definition" : ""
    };
    newCard.term = formFront.value;
    newCard.definition = formBack.value;
    myCards.Item.cards.push(newCard);
    clearForm();
    updatePlaceholder();
    storeaws(window.location.href, myCards)
    } else if (formFront.value == formBack.value) {
    alert('Different text must be used for front and back.');
    } else if (
    (formFront.value == null || formFront.value == "", formBack.value == null ||
    formBack.value == "", formFront.value == null ||
    formBack.value == null ||
    formFront.value == "" ||
    formBack.value == "")
    ) {
    alert("Fill out both sides of the card.");
    }
    document.getElementById("newTerm").focus();
});

next.addEventListener('click', () => {
    cardIndex = (cardIndex + 1) % myCards.Item.cards.length;
    while (myCards.Item.cards[cardIndex].usable == false) {
    cardIndex = (cardIndex + 1) % myCards.Item.cards.length;
    }
    front.innerHTML = myCards.Item.cards[cardIndex].term;
    back.innerHTML = myCards.Item.cards[cardIndex].definition;
    back.style.visibility = "hidden";
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, front]);
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, back]);
});

prev.addEventListener('click', () => {
    if (cardIndex > 0) cardIndex = (cardIndex - 1);
    else if (cardIndex == 0) cardIndex = myCards.Item.cards.length-1;
    while (myCards.Item.cards[cardIndex].usable == false) {
    if (cardIndex > 0) cardIndex = (cardIndex - 1);
    else if (cardIndex == 0) cardIndex = myCards.Item.cards.length-1;
    }
    front.innerHTML = myCards.Item.cards[cardIndex].term;
    back.innerHTML = myCards.Item.cards[cardIndex].definition;
    back.style.visibility = "hidden";
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, front]);
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, back]);
});


preview.addEventListener('click', () => {
    formFront = document.getElementById("newTerm");
    formBack = document.getElementById("newDef");
    front.innerHTML = formFront.value;
    back.innerHTML = formBack.value;
    back.style.visibility = "visible";
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, front]);
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, back]);
});
