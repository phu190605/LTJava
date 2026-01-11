package com.aesp.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.aesp.backend.entity.User;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // Lấy email người gửi từ file properties
    @Value("${app.mail.from}")
    private String fromEmail;

    // Hàm gửi email chung (Hỗ trợ HTML)
    public boolean sendEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // true = bật chế độ HTML

            mailSender.send(mimeMessage);
            return true;
        } catch (MessagingException e) {
            e.printStackTrace();
            return false;
        }
    }

    // --- HÀM GỬI OTP CHO POPUP (Quan trọng) ---
    public void sendPasswordResetOtpEmail(User user, String otp) {
        String subject = "AESP - Mã xác thực đặt lại mật khẩu";
        
        // Thiết kế email HTML đẹp mắt
        String content = """
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #2B4DFF; text-align: center;">Yêu cầu đặt lại mật khẩu</h2>
                <p>Xin chào <b>%s</b>,</p>
                <p>Chúng tôi nhận được yêu cầu khôi phục mật khẩu cho tài khoản của bạn.</p>
                <p>Đây là mã OTP xác thực của bạn (có hiệu lực trong 15 phút):</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2B4DFF; background: #f0f2f5; padding: 10px 20px; border-radius: 8px;">
                        %s
                    </span>
                </div>
                
                <p>Vui lòng nhập mã này vào màn hình xác thực trên website.</p>
                <p style="color: #666; font-size: 12px; margin-top: 30px;">Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
            </div>
        """.formatted(user.getFullName() != null ? user.getFullName() : "bạn", otp);

        sendEmail(user.getEmail(), subject, content);
    }
    
    // Hàm test debug
    public boolean sendTestEmail(String to, String subject, String message) {
        return sendEmail(to, subject, message);
    }
}