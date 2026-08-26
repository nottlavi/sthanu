namespace Sthanu.Application.DTOs;

public record LogDonationRes(
    bool IsTamperFree,
    bool IsIssuerTrusted,
    string? DonationId,
    string? DonorName,
    DateTime? DonationDate,
    string? ErrorMessage
);
