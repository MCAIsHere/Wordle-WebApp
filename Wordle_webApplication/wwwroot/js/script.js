window.onload = function (){
    const today_date = new Date().toISOString().slice(0, 10);
    var header_word = document.getElementById("Show_the_word");
    var Real_word;
    var Words;
    var position = 0;
    var attempt = 0;
    var word_constructed = "";
    var square_id;

    // --------------------------------------------------- SELECTING THE WORD -------------------------------------
    var httpObj = new XMLHttpRequest();
    httpObj.open('GET', '/js/Words.json', true);
    httpObj.onload = function() {
        if (httpObj.status === 200) {
            Words = JSON.parse(this.responseText)["Words"];

            // ------------------------------------------------- ENCRYPTION USING AES ----------------------------
            const key = CryptoJS.enc.Utf8.parse("Encrypt Wordle  ");
            const iv = CryptoJS.enc.Utf8.parse("StaticInitVector");

            const encrypted = CryptoJS.AES.encrypt(today_date, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });

            const hexseed = encrypted.ciphertext.toString(CryptoJS.enc.Hex)
            const seed_nr = parseInt(hexseed.slice(0,10),16) % 1391;

            Real_word = Words[seed_nr];

            Pre_Write();
        }
    };
    httpObj.send();

    // -------------------------------------------- CREATE BOARD -------------------------------------------------
    let board = document.getElementById("board")
    for (let i = 1; i <= 30; i++){
        let square = document.createElement("div")
        square.id = `t${i}`
        board.appendChild(square);
    }

    // -------------------------------------------- CREATE KEYBOARD ----------------------------------------------
    const letters_and_stuff = ["Q","W","E","R","T","Y","U","I","O","P","BACKSPACE",
                                "A","S","D","F","G","H","J","K","L","ENTER",
                                "Z","X","C","V","B","N","M"];
    let keybord = document.getElementById("keyboard")
    for (let i = 0; i < letters_and_stuff.length; i++){
        let square = document.createElement("div")
        square.id = letters_and_stuff[i];
        if (letters_and_stuff[i] === "BACKSPACE") square.innerText = "Backspace";
        else if (letters_and_stuff[i] === "ENTER") square.innerText = "Enter";
        else square.innerText = letters_and_stuff[i];
        keybord.appendChild(square);
    }

    // ----------------------------------------------- IF A KEY IS CLICKED -------------------------------------
    const keydownHandler = function (event) {
        clicky(event.key.toUpperCase());
    };
    const clickHandler = function (event){
        clicky(event.target.innerText.toUpperCase());
    };
    document.addEventListener("keydown", keydownHandler);
    document.addEventListener("click", clickHandler);

    function clicky(letter) {
        if (/^[A-Z]$/.test(letter) && position !== 5) {
            square_id = "t" + (attempt*5 + position+1)
            word_constructed += letter
            document.getElementById(square_id).innerText = letter;

            position++;
        }
        if (letter === "BACKSPACE" && position > 0) {
            square_id = "t" + (attempt*5 + position)
            word_constructed = word_constructed.slice(0, -1);
            document.getElementById(square_id).innerText = "";

            position--;
        }
        if (letter === "ENTER") {
            if (position !== 5) {
                header_word.innerText = "Not enough letters.";
                header_word.style.opacity = "1";
                delay(3000).then(() => header_word.style.opacity = "0");
            }else if (!Words.includes(word_constructed)){
                header_word.innerText = "Not included in list.";
                header_word.style.opacity = "1";
                delay(3000).then(() => header_word.style.opacity = "0");
            } else {
                if (document.querySelector('input[name="__RequestVerificationToken"]') !== null) {
                    fetch('/Home/addWord', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'RequestVerificationToken': document.querySelector('input[name="__RequestVerificationToken"]').value
                        },
                        body: JSON.stringify(word_constructed)
                    })
                    .then(response => {
                        if (response.ok) {
                            console.log("Word sent successfully");
                        } else {
                            console.error("Failed to send word");
                        }
                    });
                }

                let guessed = 0;
                for (let aux = 0; aux < 5; aux++){
                    square_id = "t" + (attempt*5 + aux+1)
                    let key = word_constructed[aux];

                    if (Real_word[aux] === key){
                        guessed++;
                        document.getElementById(square_id).classList.add("green");
                        delay(900).then(() => {
                            const keyEl = document.getElementById(key);
                            if (keyEl) keyEl.style.backgroundColor = "#6aaa64"
                        });
                    }else if (Real_word[aux] !== key && Real_word.includes(key)){
                        document.getElementById(square_id).classList.add("yellow");
                        delay(900).then(() => {
                            const keyEl = document.getElementById(key);
                            if (keyEl && keyEl.style.backgroundColor !== "#6aaa64"){
                                keyEl.style.backgroundColor = "#c9b458"
                            }
                        });
                    }else{
                        document.getElementById(square_id).classList.add("gray");
                        delay(900).then(() => {
                            const keyEl = document.getElementById(key);
                            keyEl.style.backgroundColor = "#787c7e"
                        });
                    }
                }
                if (guessed !== 5 && attempt !== 5){
                    word_constructed = ""
                    position = 0;
                    attempt++;
                }else if (guessed === 5){
                    header_word.innerText = "Good job!"
                    delay(900).then(() => header_word.style.opacity = "1");
                    document.removeEventListener("keydown", keydownHandler);
                    document.removeEventListener("click", clickHandler);
                }else if (attempt === 5){
                    header_word.innerText = Real_word
                    delay(900).then(() => header_word.style.opacity = "1");
                    document.removeEventListener("keydown", keydownHandler);
                    document.removeEventListener("click", clickHandler);
                }
            }
        }
    }


    // -------------------------------------------------------- WRITE THE OLD WORDS ------------------------------------

    function Pre_Write() {
        if (Words_already_used !== null) {
            let guessed = 0;
            for (var i = 0; i < Words_already_used.length; i++) {
                for (var j = 1; j <= 5; j++) {
                    square_id = "t" + (i * 5 + j)
                    let key = Words_already_used[i][j - 1];
                    document.getElementById(square_id).innerText = key;

                    if (Real_word[j - 1] === key) {
                        guessed++;
                        document.getElementById(square_id).classList.add("green");
                        delay(900).then(() => {
                            const keyEl = document.getElementById(key);
                            if (keyEl) keyEl.style.backgroundColor = "#6aaa64"
                        });
                    } else if (Real_word[j - 1] !== key && Real_word.includes(key)) {
                        document.getElementById(square_id).classList.add("yellow");
                        delay(900).then(() => {
                            const keyEl = document.getElementById(key);
                            if (keyEl && keyEl.style.backgroundColor !== "#6aaa64") {
                                keyEl.style.backgroundColor = "#c9b458"
                            }
                        });
                    } else {
                        document.getElementById(square_id).classList.add("gray");
                        delay(900).then(() => {
                            const keyEl = document.getElementById(key);
                            keyEl.style.backgroundColor = "#787c7e"
                        });
                    }            
                }
                if (guessed === 5) {
                    header_word.innerText = "Good job!"
                    delay(900).then(() => header_word.style.opacity = "1");
                    document.removeEventListener("keydown", keydownHandler);
                    document.removeEventListener("click", clickHandler);
                } else if (attempt === 5) {
                    header_word.innerText = Real_word
                    delay(900).then(() => header_word.style.opacity = "1");
                    document.removeEventListener("keydown", keydownHandler);
                    document.removeEventListener("click", clickHandler);
                }
                attempt++;
                guessed = 0;
            }
        }
    }

    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }
}