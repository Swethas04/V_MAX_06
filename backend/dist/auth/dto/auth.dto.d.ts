export declare class SendOtpDto {
    phone: string;
}
export declare class VerifyOtpDto {
    phone: string;
    otp: string;
    name?: string;
}
export declare class SelectRoleDto {
    role: string;
    orgAffiliation?: string;
}
