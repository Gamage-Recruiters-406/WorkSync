// Native fetch is available globally in Node.js 18+


export const sendLeaveStatusEmail = async (recipientEmail, recipientName, status) => {


    try {
        const senderName = process.env.EMAIL_SENDER_NAME;
        const senderEmail = process.env.EMAIL_SENDER_ADDRESS;
        const apiKey = process.env.BREVO_API_KEY_1;
        const apiUrl = process.env.BREVO_API_URL;

        if (!apiKey || !senderEmail) {
            console.error("Missing Email Configuration: API Key or Sender Email not found in .env");
            return;
        }

        const subject = `Leave Request Update: ${status.charAt(0).toUpperCase() + status.slice(1)}`;

        // Professional HTML Template
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
                    .header { background-color: #4CAF50; color: white; padding: 10px; text-align: center; border-radius: 5px 5px 0 0; }
                    .content { padding: 20px; }
                    .footer { margin-top: 20px; font-size: 0.8em; text-align: center; color: #777; }
                    .status { font-weight: bold; color: ${status === 'approved' ? '#4CAF50' : '#F44336'}; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>Leave Request Update</h2>
                    </div>
                    <div class="content">
                        <p>Dear ${recipientName},</p>
                        <p>Your leave request has been <span class="status">${status.toUpperCase()}</span>.</p>
                        <p>Please log in to your portal to view more details.</p>
                        <br>
                        <p>Best regards,</p>
                        <p><strong>WorkSync HR Team</strong></p>
                    </div>
                    <div class="footer">
                        <p>This is an automated message. Please do not reply to this email.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const payload = {
            sender: {
                name: senderName,
                email: senderEmail
            },
            to: [
                {
                    email: recipientEmail,
                    name: recipientName
                }
            ],
            subject: subject,
            htmlContent: htmlContent
        };

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "accept": "application/json",
                "api-key": apiKey,
                "content-type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            console.log(`Email sent successfully to ${recipientEmail}`);
        } else {
            const errorData = await response.json();
            console.error("Failed to send email:", errorData);
        }

    } catch (error) {
        console.error("Error sending email:", error);
    }
};