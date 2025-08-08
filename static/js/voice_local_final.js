(function () {
    let recognitionLocal = null;
    let recognizing = false;

    const voiceButton = document.getElementById("voice-button");
    const voiceStatus = document.getElementById("voice-status");
    const voiceIcon = document.getElementById("voice-icon");

    // Verifica suporte ao reconhecimento de voz
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        console.warn("Reconhecimento de voz não suportado.");
        if (voiceStatus) voiceStatus.textContent = "Voz não suportada";
        if (voiceButton) voiceButton.disabled = true;
        return;
    }

    recognitionLocal = new SpeechRecognition();
    recognitionLocal.lang = "pt-BR";
    recognitionLocal.continuous = false;
    recognitionLocal.interimResults = false;

    function toggleVoiceRecording() {
        if (recognizing) {
            recognitionLocal.stop();
            return;
        }

        if (!recognitionLocal) return;

        recognitionLocal.start();
    }

    recognitionLocal.onstart = () => {
        recognizing = true;
        if (voiceStatus) voiceStatus.textContent = "Ouvindo...";
        if (voiceButton) voiceButton.classList.add("recording");
        if (voiceIcon) voiceIcon.classList.replace("fa-microphone", "fa-wave-square");
    };

    recognitionLocal.onend = () => {
        recognizing = false;
        if (voiceStatus) voiceStatus.textContent = "Clique para falar";
        if (voiceButton) voiceButton.classList.remove("recording");
        if (voiceIcon) voiceIcon.classList.replace("fa-wave-square", "fa-microphone");
    };

    recognitionLocal.onerror = (event) => {
        console.error("Erro no reconhecimento de voz:", event.error);
        if (voiceStatus) voiceStatus.textContent = "Erro: " + event.error;
        recognizing = false;
        if (voiceButton) voiceButton.classList.remove("recording");
        if (voiceIcon) voiceIcon.classList.replace("fa-wave-square", "fa-microphone");
    };

    recognitionLocal.onresult = (event) => {
        const transcript = event.results[0][0].transcript.trim();
        console.log("🎤 Comando reconhecido:", transcript);

        if (voiceStatus) voiceStatus.textContent = `🔎 “${transcript}”`;
        sendVoiceCommand(transcript);
    };

    function sendVoiceCommand(command) {
        fetch("/api/voice", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ command }),
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("Resposta da API de voz:", data);
            if (data.success) {
                if (voiceStatus) voiceStatus.textContent = "✅ Comando executado";
            } else {
                if (voiceStatus) voiceStatus.textContent = "⚠️ Comando não reconhecido";
            }
        })
        .catch((err) => {
            console.error("Erro ao enviar comando de voz:", err);
            if (voiceStatus) voiceStatus.textContent = "❌ Erro na requisição";
        });
    }

    // Expõe a função globalmente para ser chamada pelo botão
    window.toggleVoiceRecording = toggleVoiceRecording;
})();