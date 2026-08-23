namespace Sthanu.Application.DTOs;


public record LogDonationReq
(
    Stream pdfStream,
    CancellationToken ct = default
);

public record LogDonationRes(
    bool isTamperFree,
    bool isIssuerTrusted,
    string? DonationId,
    string? DonorName,
    DateTime DonationDate,
    string? ErrorMessage
);
