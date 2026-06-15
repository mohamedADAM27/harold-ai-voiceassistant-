async function sendMessage() {

    const userInput = document.getElementById("userInput").value;

    if (!userInput.trim()) {
        return;
    }

    try {

        const response = await fetch("/chat", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: userInput
            })
        });

        const data = await response.json();

        console.log("Backend Response:", data);

        if (data.response) {

            document.getElementById("response").innerText =
                data.response;

            speakResponse(data.response);

        } else if (data.error) {

            document.getElementById("response").innerText =
                "Error: " + data.error;

        } else {

            document.getElementById("response").innerText =
                "No response received from Gemini.";

        }

    } catch (error) {

        console.error("Fetch Error:", error);

        document.getElementById("response").innerText =
            "Failed to connect to server.";

    }
}


function startListening() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

        alert("Speech Recognition is not supported in this browser.");

        return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.interimResults = false;

    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onstart = function () {

        console.log("Listening...");

        document.getElementById("response").innerText =
            "Listening...";

    };

    recognition.onresult = function (event) {

        const transcript =
            event.results[0][0].transcript;

        console.log("Recognized:", transcript);

        document.getElementById("userInput").value =
            transcript;

        sendMessage();
    };

    recognition.onerror = function (event) {

        console.error(
            "Speech Recognition Error:",
            event.error
        );

        document.getElementById("response").innerText =
            "Microphone Error: " + event.error;
    };

    recognition.onend = function () {

        console.log("Speech recognition ended.");

    };
}


function speakResponse(text) {

    if (!text) {
        return;
    }

    window.speechSynthesis.cancel();

    const speech =
        new SpeechSynthesisUtterance(text);

    speech.lang = "en-US";

    speech.rate = 1;

    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
}