import authService from "@/modules/auth/auth.service";
import userRepository from "@/modules/user/user.repository";
import refreshTokenRepository from "@/modules/auth/refresh-token.repository";
import auditService from "@/modules/audit/audit.service";

import { comparePassword, hashPassword } from "@/shared/utils/password";
import { generateAuthTokens } from "@/shared/utils/auth";
import { toPublicUser } from "@/shared/utils/user";
import ApiError from "@/shared/errors/ApiError";
import { verifyRefreshToken } from "@/shared/utils/jwt";
import { hashToken } from "@/shared/utils/token";
import { UserRole } from "@/shared/constants/roles";

jest.mock("@/modules/user/user.repository");
jest.mock("@/modules/auth/refresh-token.repository");
jest.mock("@/modules/audit/audit.service");

jest.mock("@/shared/utils/password");
jest.mock("@/shared/utils/auth");
jest.mock("@/shared/utils/user");
jest.mock("@/shared/utils/jwt");
jest.mock("@/shared/utils/token");

const mockedUserRepository = jest.mocked(userRepository);
const mockedRefreshRepository = jest.mocked(refreshTokenRepository);
const mockedAuditService = jest.mocked(auditService);

const mockedHashPassword = jest.mocked(hashPassword);
const mockedGenerateTokens = jest.mocked(generateAuthTokens);
const mockedToPublicUser = jest.mocked(toPublicUser);
const mockedComparePassword = jest.mocked(comparePassword);
const mockedVerifyRefreshToken = jest.mocked(verifyRefreshToken);
const mockedHashToken = jest.mocked(hashToken);

describe("AuthService", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("register", () => {

        it("should register user successfully", async () => {

            const dto = {
                fullName: "Mahipal Singh",
                username: "mahipal",
                email: "mahipal@gmail.com",
                password: "Password123"
            };

            const user: any = {
                id: "user-id",
                fullName: dto.fullName,
                username: dto.username,
                email: dto.email,
                password: "hashed-password"
            };

            mockedUserRepository.existsByEmail
                .mockResolvedValue(null);

            mockedUserRepository.existsByUserName
                .mockResolvedValue(null);

            mockedHashPassword
                .mockResolvedValue("hashed-password");

            mockedUserRepository.create
                .mockResolvedValue(user);

            mockedGenerateTokens.mockReturnValue({
                accessToken: "access-token",
                refreshToken: "refresh-token"
            });

            mockedToPublicUser.mockReturnValue({
                id: user.id,
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                avatar: "",
                role: "USER"
            } as any);

            mockedRefreshRepository.create
                .mockResolvedValue({} as any);

            mockedAuditService.logLogin
                .mockResolvedValue({} as any);

            const result = await authService.register(dto);

            expect(mockedUserRepository.existsByEmail)
                .toHaveBeenCalledWith(dto.email);

            expect(mockedUserRepository.existsByUserName)
                .toHaveBeenCalledWith(dto.username);

            expect(mockedHashPassword)
                .toHaveBeenCalledWith(dto.password);

            expect(mockedUserRepository.create)
                .toHaveBeenCalledWith({
                    ...dto,
                    password: "hashed-password"
                });

            expect(mockedGenerateTokens)
                .toHaveBeenCalled();

            expect(mockedRefreshRepository.create)
                .toHaveBeenCalled();

            expect(mockedAuditService.logLogin)
                .toHaveBeenCalled();

            expect(result.tokens.accessToken)
                .toBe("access-token");

            expect(result.tokens.refreshToken)
                .toBe("refresh-token");

            expect(result.user.email)
                .toBe(dto.email);
        });

        it("should throw if email already exists", async () => {

            const dto = {
                fullName: "Mahipal Singh",
                username: "mahipal",
                email: "mahipal@gmail.com",
                password: "Password123"
            };

            mockedUserRepository.existsByEmail
                .mockResolvedValue({} as any);

            mockedUserRepository.existsByUserName
                .mockResolvedValue(null);

            await expect(
                authService.register(dto)
            ).rejects.toThrow("Email already exists");

            expect(mockedUserRepository.create)
                .not.toHaveBeenCalled();

            expect(mockedHashPassword)
                .not.toHaveBeenCalled();

            expect(mockedGenerateTokens)
                .not.toHaveBeenCalled();
        });

        it("should throw if username already exists", async () => {

            const dto = {
                fullName: "Mahipal Singh",
                username: "mahipal",
                email: "mahipal@gmail.com",
                password: "Password123"
            };

            mockedUserRepository.existsByEmail
                .mockResolvedValue(null);

            mockedUserRepository.existsByUserName
                .mockResolvedValue({} as any);

            await expect(
                authService.register(dto)
            ).rejects.toThrow("Username already exists");

            expect(mockedUserRepository.create)
                .not.toHaveBeenCalled();

            expect(mockedHashPassword)
                .not.toHaveBeenCalled();

            expect(mockedGenerateTokens)
                .not.toHaveBeenCalled();
        });

        it("should hash password before saving user", async () => {

            const dto = {
                fullName: "Mahipal Singh",
                username: "mahipal",
                email: "mahipal@gmail.com",
                password: "Password123"
            };

            const user: any = {
                id: "user-id",
                fullName: dto.fullName,
                username: dto.username,
                email: dto.email,
                password: "hashed-password"
            };

            mockedUserRepository.existsByEmail
                .mockResolvedValue(null);

            mockedUserRepository.existsByUserName
                .mockResolvedValue(null);

            mockedHashPassword
                .mockResolvedValue("hashed-password");

            mockedUserRepository.create
                .mockResolvedValue(user);

            mockedGenerateTokens.mockReturnValue({
                accessToken: "access-token",
                refreshToken: "refresh-token"
            });

            mockedToPublicUser.mockReturnValue({
                id: user.id,
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                avatar: "",
                role: "USER"
            } as any);

            mockedRefreshRepository.create
                .mockResolvedValue({} as any);

            mockedAuditService.logLogin
                .mockResolvedValue({} as any);

            await authService.register(dto);

            expect(mockedHashPassword)
                .toHaveBeenCalledWith(dto.password);

            expect(mockedUserRepository.create)
                .toHaveBeenCalledWith({
                    ...dto,
                    password: "hashed-password"
                });

            expect(mockedUserRepository.create)
                .not.toHaveBeenCalledWith({
                    ...dto,
                    password: dto.password
                });
        });

    });



    describe("login", () => {
        it("should login successfully", async () => {

            const dto = {
                email: "mahipal@gmail.com",
                password: "Password123"
            };

            const user: any = {
                id: "user-id",
                fullName: "Mahipal Singh",
                username: "mahipal",
                email: dto.email,
                password: "hashed-password",
                role: "USER"
            };

            mockedUserRepository.findByEmail
                .mockResolvedValue(user);

            mockedComparePassword
                .mockResolvedValue(true);

            mockedGenerateTokens
                .mockReturnValue({
                    accessToken: "access-token",
                    refreshToken: "refresh-token"
                });

            mockedToPublicUser
                .mockReturnValue({
                    id: user.id,
                    fullName: user.fullName,
                    username: user.username,
                    email: user.email,
                    avatar: "",
                    role: "USER"
                } as any);

            mockedRefreshRepository.create
                .mockResolvedValue({} as any);

            mockedAuditService.logLogin
                .mockResolvedValue({} as any);

            const result = await authService.login(dto);

            expect(mockedUserRepository.findByEmail)
                .toHaveBeenCalledWith(dto.email);

            expect(mockedComparePassword)
                .toHaveBeenCalledWith(
                    dto.password,
                    user.password
                );

            expect(mockedGenerateTokens)
                .toHaveBeenCalled();

            expect(mockedRefreshRepository.create)
                .toHaveBeenCalled();

            expect(result).toEqual({
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    username: user.username,
                    email: user.email,
                    avatar: "",
                    role: "USER"
                },
                tokens: {
                    accessToken: "access-token",
                    refreshToken: "refresh-token"
                }
            });

        });

        it("should throw if user does not exist", async () => {

            const dto = {
                email: "unknown@gmail.com",
                password: "Password123"
            };

            mockedUserRepository.findByEmail
                .mockResolvedValue(null);

            await expect(
                authService.login(dto)
            ).rejects.toThrow(ApiError);

            expect(mockedUserRepository.findByEmail)
                .toHaveBeenCalledWith(dto.email);

            expect(mockedComparePassword)
                .not.toHaveBeenCalled();

            expect(mockedGenerateTokens)
                .not.toHaveBeenCalled();

            expect(mockedRefreshRepository.create)
                .not.toHaveBeenCalled();

            expect(mockedAuditService.logLogin)
                .not.toHaveBeenCalled();

        });
    });

    describe("refreshToken", () => {
        it("should refresh token successfully", async () => {

            const refreshToken = "refresh-token";

            const payload = {
                userId: "1",
                email: "mahipal@gmail.com",
                role: UserRole.USER
            };

            const user: any = {
                id: "user-id",
                fullName: "Mahipal Singh",
                username: "mahipal",
                email: "mahipal@gmail.com",
                role: "USER"
            };

            mockedVerifyRefreshToken
                .mockReturnValue(payload);

            mockedHashToken
                .mockReturnValue("hashed-token");

            mockedRefreshRepository.findAnyByHash
                .mockResolvedValue({
                    revoked: false
                } as any);

            mockedUserRepository.findById
                .mockResolvedValue(user);

            mockedRefreshRepository.revoke
                .mockResolvedValue({} as any);

            mockedGenerateTokens
                .mockReturnValue({
                    accessToken: "new-access-token",
                    refreshToken: "new-refresh-token"
                });

            mockedToPublicUser
                .mockReturnValue({
                    id: user.id,
                    fullName: user.fullName,
                    username: user.username,
                    email: user.email,
                    avatar: "",
                    role: user.role
                } as any);

            mockedRefreshRepository.create
                .mockResolvedValue({} as any);

            mockedAuditService.logRefreshToken.mockResolvedValue({} as any);

            const result = await authService.refreshToken(refreshToken);

            expect(mockedVerifyRefreshToken)
                .toHaveBeenCalledWith(refreshToken);

            expect(mockedHashToken)
                .toHaveBeenCalledWith(refreshToken);

            expect(mockedRefreshRepository.findAnyByHash)
                .toHaveBeenCalledWith("hashed-token");

            expect(mockedRefreshRepository.revoke)
                .toHaveBeenCalledWith("hashed-token");

            expect(mockedRefreshRepository.create)
                .toHaveBeenCalled();

            expect(result).toEqual({
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    username: user.username,
                    email: user.email,
                    avatar: "",
                    role: user.role
                },
                tokens: {
                    accessToken: "new-access-token",
                    refreshToken: "new-refresh-token"
                }
            });

        });

        it("should throw if refresh token is missing", async () => {

            await expect(
                authService.refreshToken("")
            ).rejects.toThrow(ApiError);

            expect(mockedVerifyRefreshToken)
                .not.toHaveBeenCalled();

            expect(mockedHashToken)
                .not.toHaveBeenCalled();

            expect(mockedRefreshRepository.findAnyByHash)
                .not.toHaveBeenCalled();

            expect(mockedUserRepository.findById)
                .not.toHaveBeenCalled();

            expect(mockedRefreshRepository.revoke)
                .not.toHaveBeenCalled();

            expect(mockedRefreshRepository.create)
                .not.toHaveBeenCalled();

            expect(mockedAuditService.logRefreshToken)
                .not.toHaveBeenCalled();

        });

        it("should throw if refresh token is invalid", async () => {

            const refreshToken = "refresh-token";

            mockedVerifyRefreshToken
                .mockReturnValue({
                    userId: "user-id",
                    email: "mahipal@gmail.com",
                    role: UserRole.USER
                });

            mockedHashToken
                .mockReturnValue("hashed-token");

            mockedRefreshRepository.findAnyByHash
                .mockResolvedValue(null);

            await expect(
                authService.refreshToken(refreshToken)
            ).rejects.toThrow(ApiError);

            expect(mockedVerifyRefreshToken)
                .toHaveBeenCalledWith(refreshToken);

            expect(mockedHashToken)
                .toHaveBeenCalledWith(refreshToken);

            expect(mockedRefreshRepository.findAnyByHash)
                .toHaveBeenCalledWith("hashed-token");

            expect(mockedUserRepository.findById)
                .not.toHaveBeenCalled();

            expect(mockedRefreshRepository.revoke)
                .not.toHaveBeenCalled();

            expect(mockedRefreshRepository.create)
                .not.toHaveBeenCalled();

            expect(mockedAuditService.logRefreshToken)
                .not.toHaveBeenCalled();

        });

        it("should throw if refresh token is revoked", async () => {

            const refreshToken = "refresh-token";

            mockedVerifyRefreshToken
                .mockReturnValue({
                    userId: "user-id",
                    email: "mahipal@gmail.com",
                    role: UserRole.USER
                });

            mockedHashToken
                .mockReturnValue("hashed-token");

            mockedRefreshRepository.findAnyByHash
                .mockResolvedValue({
                    revoked: true
                } as any);

            mockedRefreshRepository.revokeAll
                .mockResolvedValue({} as any);

            await expect(
                authService.refreshToken(refreshToken)
            ).rejects.toThrow(ApiError);

            expect(mockedVerifyRefreshToken)
                .toHaveBeenCalledWith(refreshToken);

            expect(mockedHashToken)
                .toHaveBeenCalledWith(refreshToken);

            expect(mockedRefreshRepository.findAnyByHash)
                .toHaveBeenCalledWith("hashed-token");

            expect(mockedRefreshRepository.revokeAll)
                .toHaveBeenCalledWith("user-id");

            expect(mockedUserRepository.findById)
                .not.toHaveBeenCalled();

            expect(mockedRefreshRepository.revoke)
                .not.toHaveBeenCalled();

            expect(mockedRefreshRepository.create)
                .not.toHaveBeenCalled();

            expect(mockedAuditService.logRefreshToken)
                .not.toHaveBeenCalled();

        });

        it("should throw if user is not found during refresh token", async () => {

            const refreshToken = "refresh-token";

            mockedVerifyRefreshToken
                .mockReturnValue({
                    userId: "user-id",
                    email: "mahipal@gmail.com",
                    role: UserRole.USER
                });

            mockedHashToken
                .mockReturnValue("hashed-token");

            mockedRefreshRepository.findAnyByHash
                .mockResolvedValue({
                    revoked: false
                } as any);

            mockedUserRepository.findById
                .mockResolvedValue(null);

            await expect(
                authService.refreshToken(refreshToken)
            ).rejects.toThrow(ApiError);

            expect(mockedVerifyRefreshToken)
                .toHaveBeenCalledWith(refreshToken);

            expect(mockedHashToken)
                .toHaveBeenCalledWith(refreshToken);

            expect(mockedRefreshRepository.findAnyByHash)
                .toHaveBeenCalledWith("hashed-token");

            expect(mockedUserRepository.findById)
                .toHaveBeenCalledWith("user-id");

            expect(mockedRefreshRepository.revoke)
                .not.toHaveBeenCalled();

            expect(mockedRefreshRepository.create)
                .not.toHaveBeenCalled();

            expect(mockedAuditService.logRefreshToken)
                .not.toHaveBeenCalled();

        });

    });

    describe("logout", () => {

        it("should logout successfully", async () => {

            const refreshToken = "refresh-token";

            mockedHashToken
                .mockReturnValue("hashed-token");

            mockedRefreshRepository.revoke
                .mockResolvedValue({} as any);

            mockedAuditService.logLogout.mockResolvedValue({} as any);

            await authService.logout(refreshToken);

            expect(mockedHashToken)
                .toHaveBeenCalledWith(refreshToken);

            expect(mockedRefreshRepository.revoke)
                .toHaveBeenCalledWith("hashed-token");

            expect(mockedAuditService.logLogout)
                .toHaveBeenCalled();

        });

        it("should throw if refresh token is missing", async () => {

            await expect(
                authService.logout("")
            ).rejects.toThrow(ApiError);

            expect(mockedHashToken)
                .not.toHaveBeenCalled();

            expect(mockedRefreshRepository.revoke)
                .not.toHaveBeenCalled();

            expect(mockedAuditService.logLogout)
                .not.toHaveBeenCalled();

        });

        it("should logout from all devices successfully", async () => {

            const userId = "user-id";

            mockedRefreshRepository.revokeAll
                .mockResolvedValue({} as any);

            await authService.logoutAll(userId);

            expect(mockedRefreshRepository.revokeAll)
                .toHaveBeenCalledWith(userId);

        });
    })

    describe("getme", () => {
        it("should return current user successfully", async () => {

            const userId = "user-id";

            const user: any = {
                id: "1",
                fullName: "Mahipal Singh",
                username: "mahipal",
                email: "mahipal@gmail.com",
                avatar: "",
                role: "USER"
            };

            mockedUserRepository.findById
                .mockResolvedValue(user);

            const result = await authService.getMe(userId);

            expect(mockedUserRepository.findById)
                .toHaveBeenCalledWith(userId);

            expect(result).toEqual(user);

        });

        it("should throw if user is not found", async () => {

            const userId = "user-id";

            mockedUserRepository.findById
                .mockResolvedValue(null);

            await expect(
                authService.getMe(userId)
            ).rejects.toThrow(ApiError);

            expect(mockedUserRepository.findById)
                .toHaveBeenCalledWith(userId);

        });
    })

});