using Sthanu.Domain.Enums;

namespace Sthanu.Application.DTOs;

public record LogDonationRes(
    bool IsTamperFree,
    bool IsIssuerTrusted,
    string? DonationId,
    string? DonorName,
    DateTime? DonationDate,
    string? ErrorMessage,
    DonationStatus Status
);

public record UserDonationDto(
    Guid Id,
    string DonationIdNumber,
    string DonorName,
    DateTime DonatedAtUtc,
    string? BloodBankLicense,
    DonationStatus Status
);

public record UserDonationList(
    IReadOnlyList<UserDonationDto> Items, int TotalCount, int Page, int PageSize
);
