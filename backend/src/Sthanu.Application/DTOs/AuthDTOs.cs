namespace Sthanu.Application.DTOs;

public record SendOtpRequest(
    string PhoneNumber
);

public record VerifyOtpRequest(string PhoneNumber, string OtpCode);

public record CompleteProfileRequest(
    string FirstName,
    string LastName
);



