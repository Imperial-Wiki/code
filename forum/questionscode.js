var storeaws = (key,questAns)=>{
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({"key" : key, "questAns": questAns});
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    fetch("https://6zo6l0oww9.execute-api.eu-west-2.amazonaws.com/sendingq", requestOptions)
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
    var qdata = fetch("https://zoakfspzkb.execute-api.eu-west-2.amazonaws.com/retrievingq", requestOptions)
    .then(response => response.json())
    .then(data => {return data.body})
    .catch(function(error) {
        console.log(error)
    });
    return await qdata;
};

async function digestmessage(message) {
    const msgUint8 = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-384", msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    return await hashHex;
}

let vote = function() {
    let type;
    let num;
    let d_remove = false;
    let u_remove = false;
    let index;
    if (this.charAt(0) === "u") { 
        num = this.slice(6);
        if(!myQs.Item.questAns[qIndex].answers[num].u_hashes.includes(hash)) {
            if (myQs.Item.questAns[qIndex].answers[num].d_hashes.includes(hash)) {
                type = 2
                d_remove = true;
                index = myQs.Item.questAns[qIndex].answers[num].d_hashes.indexOf(hash)
            }
            else {
                type = 1
            }
        }
    }
    else if (this.charAt(0) === "d") { 
        num = this.slice(8);
        if(!myQs.Item.questAns[qIndex].answers[num].d_hashes.includes(hash)) {
            if (myQs.Item.questAns[qIndex].answers[num].u_hashes.includes(hash)) {
                type = -2
                u_remove = true;
                index = myQs.Item.questAns[qIndex].answers[num].u_hashes.indexOf(hash)
            }
            else {
                type = -1
            }
        }
    }
    if (typeof type !== "undefined" && typeof num !== "undefined") {
        myQs.Item.questAns[qIndex].answers[num].votes = myQs.Item.questAns[qIndex].answers[num].votes + type
        if (type > 0) {
            if (d_remove) {
                myQs.Item.questAns[qIndex].answers[num].d_hashes.splice(index, 1);
            }
            myQs.Item.questAns[qIndex].answers[num].u_hashes.push(hash)
        }
        else if (type < 0) {
            if (u_remove) {
                myQs.Item.questAns[qIndex].answers[num].u_hashes.splice(index, 1);
            }
            myQs.Item.questAns[qIndex].answers[num].d_hashes.push(hash)
        }
      	storeaws(window.location.href, myQs);
     	let voteCounters = document.getElementsByClassName("votescounter");
      	voteCounters[num].innerHTML = myQs.Item.questAns[qIndex].answers[num].votes;
    }
}


var myQsRaw = await retrieveaws(window.location.href);

var myQs = JSON.parse(myQsRaw)

var newAns;
var front = document.getElementById("front");
var submit_ans = document.querySelectorAll("input[value = Submit]")[0];
var submit_qns = document.getElementById("submitQ");
var next = document.getElementById("next");
var prev = document.getElementById("prev");
var preview = document.getElementById("preview");
var answersContainer = document.getElementById("answers");
var submitContainer = document.getElementById("newAContainer")
var QsubmitContainer = document.getElementById("newQContainer")
var formFront;
var QformFront;
let buttonUpName = "upvote"
let buttonDownName = "downvote"
let previewContainer = document.getElementById("previewcontainer");
let previewDiv = document.getElementById("previewdiv");
let QpreviewContainer = document.getElementById("Qpreviewcontainer");
let QpreviewDiv = document.getElementById("Qpreviewdiv");
var Qpreview = document.getElementById("previewQ");

var qIndex = 0;

var hash = await digestmessage(WIKI.$store.get("user/email"))

if (typeof myQs.Item.questAns[qIndex] !== "undefined") {
    front.innerHTML = myQs.Item.questAns[qIndex].question;
    if (!myQs.Item.questAns[qIndex].s_hashes.includes(hash)) {
        answersContainer.style.visibility = "hidden";
        previewDiv.style.visibility = "hidden";
    } else {
        for (let i = 0; i < myQs.Item.questAns[qIndex].answers.length; i++) {
            let answerIterator = document.createElement("div")
            let answerContent = document.createElement("p")
            let answerVotes = document.createElement("span")
            let upvoteButton = document.createElement("button")
            let downvoteButton = document.createElement("button")
            upvoteButton.innerHTML = "Upvote"
            downvoteButton.innerHTML = "Downvote"
            upvoteButton.classList.add("upvotebutton")
            downvoteButton.classList.add("downvotebutton")
            answerVotes.classList.add("votescounter")
            upvoteButton.id = buttonUpName.concat(i.toString())
            downvoteButton.id = buttonDownName.concat(i.toString())
            answerContent.innerHTML = myQs.Item.questAns[qIndex].answers[i].answer
            answerVotes.innerHTML = myQs.Item.questAns[qIndex].answers[i].votes
            upvoteButton.addEventListener('click', vote.bind(upvoteButton.id) );  
            downvoteButton.addEventListener('click', vote.bind(downvoteButton.id) );
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, answerContent]);           
            answerIterator.appendChild(answerContent)
            answerIterator.appendChild(upvoteButton)
            answerIterator.appendChild(answerVotes)
            answerIterator.appendChild(downvoteButton)
            answersContainer.appendChild(answerIterator)
        }
    }
}

function clearForm() {
    document.getElementById("newAnswer").value = "";
    document.getElementById("cardForm").reset();
};

submit_qns.addEventListener('click', (QformFront) => {
    QformFront = document.getElementById("newQ");
    if (
        QformFront.value != ""
    ) {
        var newQ = {
            "question": "",
            "s_hashes": [],
            "answers": [
            ]
        };
        newQ.question = QformFront.value;
        newQ.s_hashes.push(hash)
        myQs.Item.questAns.push(newQ);
        document.getElementById("newQ").value = "";
        document.getElementById("QcardForm").reset();
        storeaws(window.location.href, myQs)
    }
     else  {
        alert("Write a Question.");
    }
});

submit_ans.addEventListener('click', (formFront) => {
    formFront = document.getElementById("newAnswer");
    if (
        formFront.value != ""
    ) {
        var newAns = {
            "votes" : 0,
            "answer" : "",
            "d_hashes" : [],
            "u_hashes" : []
        };
        newAns.answer = formFront.value;
        myQs.Item.questAns[qIndex].answers.push(newAns);
        if (!myQs.Item.questAns[qIndex].s_hashes.includes(hash)) {
            myQs.Item.questAns[qIndex].s_hashes.push(hash);
        }
      	answersContainer.style.visibility = "visible";
        answersContainer.innerHTML = ""
        for (let i = 0; i < myQs.Item.questAns[qIndex].answers.length; i++) {
            let answerIterator = document.createElement("div")
            let answerContent = document.createElement("p")
            let answerVotes = document.createElement("span")
            let upvoteButton = document.createElement("button")
            let downvoteButton = document.createElement("button")
            upvoteButton.innerHTML = "Upvote"
            downvoteButton.innerHTML = "Downvote"
          	upvoteButton.classList.add("upvotebutton")
          	downvoteButton.classList.add("downvotebutton")
          	answerVotes.classList.add("votescounter")
            upvoteButton.id = buttonUpName.concat(i.toString())
            downvoteButton.id = buttonDownName.concat(i.toString())
            answerContent.innerHTML = myQs.Item.questAns[qIndex].answers[i].answer
            answerVotes.innerHTML = myQs.Item.questAns[qIndex].answers[i].votes
            upvoteButton.addEventListener('click', vote.bind(upvoteButton.id) );  
            downvoteButton.addEventListener('click', vote.bind(downvoteButton.id) );
          	MathJax.Hub.Queue(["Typeset", MathJax.Hub, answerContent]);           
            answerIterator.appendChild(answerContent)
            answerIterator.appendChild(upvoteButton)
            answerIterator.appendChild(answerVotes)
            answerIterator.appendChild(downvoteButton)
            answersContainer.appendChild(answerIterator)
        }
        clearForm()
        storeaws(window.location.href, myQs)
    }
     else  {
        alert("Write an Answer.");
    }
});

next.addEventListener('click', () => {
    qIndex = (qIndex + 1) % myQs.Item.questAns.length;
    submitContainer.style.visibility = "visible"
    front.innerHTML = myQs.Item.questAns[qIndex].question;
  	MathJax.Hub.Queue(["Typeset", MathJax.Hub, front]);
  	if (!myQs.Item.questAns[qIndex].s_hashes.includes(hash)) {
        answersContainer.style.visibility = "hidden";
        previewDiv.style.visibility = "hidden";
    }
    answersContainer.innerHTML = ""
    for (let i = 0; i < myQs.Item.questAns[qIndex].answers.length; i++) {
        let answerIterator = document.createElement("div")
        let answerContent = document.createElement("p")
        let answerVotes = document.createElement("span")
        let upvoteButton = document.createElement("button")
        let downvoteButton = document.createElement("button")
        upvoteButton.innerHTML = "Upvote"
        downvoteButton.innerHTML = "Downvote"
        upvoteButton.classList.add("upvotebutton")
        downvoteButton.classList.add("downvotebutton")
        answerVotes.classList.add("votescounter")
        upvoteButton.id = buttonUpName.concat(i.toString())
        downvoteButton.id = buttonDownName.concat(i.toString())
        answerContent.innerHTML = myQs.Item.questAns[qIndex].answers[i].answer
        answerVotes.innerHTML = myQs.Item.questAns[qIndex].answers[i].votes
        upvoteButton.addEventListener('click', vote.bind(upvoteButton.id) );  
        downvoteButton.addEventListener('click', vote.bind(downvoteButton.id) );
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, answerContent]);           
        answerIterator.appendChild(answerContent)
        answerIterator.appendChild(upvoteButton)
        answerIterator.appendChild(answerVotes)
        answerIterator.appendChild(downvoteButton)
        answersContainer.appendChild(answerIterator)
    }
});

prev.addEventListener('click', () => {
    if (qIndex > 0) qIndex = (qIndex - 1);
    else if (qIndex == 0) qIndex = myQs.Item.questAns.length-1;
    submitContainer.style.visibility = "visible"
    front.innerHTML = myQs.Item.questAns[qIndex].question;
  	MathJax.Hub.Queue(["Typeset", MathJax.Hub, front]);
    if (!myQs.Item.questAns[qIndex].s_hashes.includes(hash)) {
        answersContainer.style.visibility = "hidden";
        previewDiv.style.visibility = "hidden";
    }
    answersContainer.innerHTML = ""
    for (let i = 0; i < myQs.Item.questAns[qIndex].answers.length; i++) {
        let answerIterator = document.createElement("div")
        let answerContent = document.createElement("p")
        let answerVotes = document.createElement("span")
        let upvoteButton = document.createElement("button")
        let downvoteButton = document.createElement("button")
        upvoteButton.innerHTML = "Upvote"
        downvoteButton.innerHTML = "Downvote"
        upvoteButton.classList.add("upvotebutton")
        downvoteButton.classList.add("downvotebutton")
        answerVotes.classList.add("votescounter")
        upvoteButton.id = buttonUpName.concat(i.toString())
        downvoteButton.id = buttonDownName.concat(i.toString())
        answerContent.innerHTML = myQs.Item.questAns[qIndex].answers[i].answer
        answerVotes.innerHTML = myQs.Item.questAns[qIndex].answers[i].votes
        upvoteButton.addEventListener('click', vote.bind(upvoteButton.id) );  
        downvoteButton.addEventListener('click', vote.bind(downvoteButton.id) );
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, answerContent]);           
        answerIterator.appendChild(answerContent)
        answerIterator.appendChild(upvoteButton)
        answerIterator.appendChild(answerVotes)
        answerIterator.appendChild(downvoteButton)
        answersContainer.appendChild(answerIterator)
    }
});


preview.addEventListener('click', () => {
    previewContainer.innerHTML = document.getElementById("newAnswer").value;
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, previewContainer]);
    previewDiv.style.visibility = "visible"
});

Qpreview.addEventListener('click', () => {
    QpreviewContainer.innerHTML = document.getElementById("newQ").value;
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, previewContainer]);
    QpreviewDiv.style.visibility = "visible"
});
