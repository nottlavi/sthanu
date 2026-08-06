namespace Sthanu.Infrastructure.Services;

using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Sthanu.Application.Interfaces;

public class SupabaseAuthService : ISupabaseAuthService
{
    private readonly HttpClient _httpClient;
    private readonly string _supabaseUrl;
    private readonly string _anonKey;

    public SupabaseAuthService(HttpClient httpClient, IConfiguration config)
    {
        _httpClient = httpClient;
        _supabaseUrl = config["Supabase:Url"]!;
        _anonKey = config["Supabase:AnonKey"]!;
    }

    public async Task<(bool Success, string Message)> SendOtpAsync(string phoneNumber)
    {
        var url = $"{_supabaseUrl}/auth/v1/otp";
        var payload = JsonSerializer.Serialize(new { phone = phoneNumber });
        var content = new StringContent(payload, Encoding.UTF8, "application/json");

        using var request = new HttpRequestMessage(HttpMethod.Post, url);
        request.Headers.Add("apikey", _anonKey);
        request.Content = content;

        using var response = await _httpClient.SendAsync(request);
        var responseString = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            return (false, responseString);
        }

        return (true, "OTP Sent successfully.");
    }

    public async Task<(bool Success, string? AccessToken, string Message)> VerifyOtpAsync(string phoneNumber, string otpCode)
    {
        var url = $"{_supabaseUrl}/auth/v1/verify";
        var payload = JsonSerializer.Serialize(new
        {
            type = "sms",
            phone = phoneNumber,
            token = otpCode
        });

        var content = new StringContent(payload, Encoding.UTF8, "application/json");

        using var request = new HttpRequestMessage(HttpMethod.Post, url);
        request.Headers.Add("apikey", _anonKey);
        request.Content = content;

        var response = await _httpClient.SendAsync(request);
        var responseString = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            return (false, null, responseString);
        }

        using var doc = JsonDocument.Parse(responseString);
        var accessToken = doc.RootElement.GetProperty("access_token").GetString();

        return (true, accessToken, "OTP verified successfully.");
    }
}