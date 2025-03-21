import { NextResponse } from 'next/server';
import { createTransport } from 'nodemailer';

// Add detailed logging for email configuration
console.log('Email configuration:', {
    user: process.env.EMAIL_USER ? 'Set' : 'Not set',
    pass: process.env.EMAIL_APP_PASSWORD ? 'Set' : 'Not set'
});

// Create transporter with more detailed options
const transporter = createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    },
    debug: true, // Enable debug logging
    logger: true  // Enable built-in logger
});

// Verify transporter configuration
transporter.verify(function (error: any, success: any) {
    if (error) {
        console.error('Transporter verification error:', error);
    } else {
        console.log('Server is ready to take our messages');
    }
});

export async function POST(request: Request) {
    try {
        // Log the incoming request
        console.log('Received email request');

        const body = await request.json();
        console.log('Request body:', JSON.stringify(body, null, 2));

        const {
            houseId,
            issueCategory,
            issue,
            urgency,
            preferredDate,
            preferredTime,
            entryPermission,
            tenant_email,  // Tenant's email
            owner_email    // Owner's email
        } = body;

        const emailContent = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background-color: #f7f7f7; padding: 20px; border-radius: 5px; border-left: 4px solid #4a6fa5;">
                    <h1 style="color: #4a6fa5; margin-top: 0;">New Maintenance Request</h1>
                    <p style="margin-bottom: 20px;">A new maintenance request has been submitted for your property. Please review the details below:</p>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #dddddd; font-weight: bold; width: 40%;">Property ID:</td>
                            <td style="padding: 8px; border-bottom: 1px solid #dddddd;">${houseId}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #dddddd; font-weight: bold; background-color: #f2f2f2;">Issue Category:</td>
                            <td style="padding: 8px; border-bottom: 1px solid #dddddd; background-color: #f2f2f2;">${issueCategory}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #dddddd; font-weight: bold;">Description:</td>
                            <td style="padding: 8px; border-bottom: 1px solid #dddddd;">${issue}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #dddddd; font-weight: bold; background-color: #f2f2f2;">Urgency:</td>
                            <td style="padding: 8px; border-bottom: 1px solid #dddddd; background-color: #f2f2f2;">
                                <span style="color: ${urgency === 'High' ? '#e53935' : urgency === 'Medium' ? '#ff9800' : '#4caf50'}; font-weight: bold;">${urgency}</span>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #dddddd; font-weight: bold;">Preferred Date:</td>
                            <td style="padding: 8px; border-bottom: 1px solid #dddddd;">${preferredDate}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #dddddd; font-weight: bold; background-color: #f2f2f2;">Preferred Time:</td>
                            <td style="padding: 8px; border-bottom: 1px solid #dddddd; background-color: #f2f2f2;">${preferredTime}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #dddddd; font-weight: bold;">Entry Permission:</td>
                            <td style="padding: 8px; border-bottom: 1px solid #dddddd;">${entryPermission === true ? 'Granted' : 'Not Granted'}</td>
                        </tr>
                    </table>
                    
                    <div style="background-color: #e8f0fe; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
                        <p style="margin: 0; font-weight: bold;">Next Steps:</p>
                        <ol style="margin-top: 10px; margin-bottom: 0; padding-left: 20px;">
                            <li>Review the request details</li>
                            <li>Schedule a service appointment</li>
                            <li>Contact the tenant to confirm the appointment</li>
                        </ol>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <a href="#" style="background-color: #4a6fa5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Respond to Request</a>
                    </div>
                    
                    <p style="margin-top: 30px; font-size: 12px; color: #777777; text-align: center;">
                        This is an automated message. Please do not reply directly to this email.
                    </p>
                </div>
            </div>
        `;

        // Log email attempt
        console.log('Attempting to send email from tenant:', tenant_email, 'to owner:', owner_email);

        try {
            await transporter.sendMail({
                from: tenant_email, // Email will be sent from tenant's email
                to: owner_email,    // Email will be sent to the owner's email
                subject: 'New Maintenance Request for Your Property',
                html: emailContent
            });
            console.log('Email sent successfully');
        } catch (emailError) {
            console.error('Error in sendMail:', emailError);
            throw emailError;
        }

        return NextResponse.json({ message: 'Email sent successfully' });
    } catch (error) {
        // Log the full error
        console.error('Full error details:', error);

        return NextResponse.json(
            {
                message: 'Failed to send email',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
