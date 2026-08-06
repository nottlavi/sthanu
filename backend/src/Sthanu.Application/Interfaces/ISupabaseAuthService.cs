namespace Sthanu.Application.Interfaces;

public interface ISupabaseAuthService
{
    Task<(bool Success, string Message)> SendOtpAsync(string phoneNumber);
    Task<(bool Success, string? AccessToken, string Message)> VerifyOtpAsync(string phoneNumber, string otpCode);
}
