import auditRepository from "./audit.repository";
import { AuditAction } from "./audit.types";

interface AuditContext {
    user?: string;
    ip?: string;
    userAgent?: string;
    requestId?: string;
    metadata?: Record<string, unknown>;
}

class AuditService {
    private async log(
        action: AuditAction,
        resource: string,
        success: boolean,
        context: AuditContext = {}
    ) {
        return auditRepository.create({
            action,
            resource,
            success,
            user: context.user as any,
            ip: context.ip,
            userAgent: context.userAgent,
            requestId: context.requestId,
            metadata: context.metadata,
        });
    }
    logRegister(success: boolean, context: AuditContext = {}) {
        return this.log(
            AuditAction.REGISTER,
            "auth",
            success,
            context
        );
    }

    logLogin(success: boolean, context: AuditContext = {}) {
        return this.log(
            AuditAction.LOGIN,
            "auth",
            success,
            context
        );
    }

    logLogout(success: boolean, context: AuditContext = {}) {
        return this.log(
            AuditAction.LOGOUT,
            "auth",
            success,
            context
        );
    }

    logRefreshToken(success: boolean, context: AuditContext = {}) {
        return this.log(
            AuditAction.REFRESH_TOKEN,
            "auth",
            success,
            context
        );
    }

    logAIRecommendation(success: boolean, context: AuditContext = {}) {
        return this.log(
            AuditAction.AI_RECOMMENDATION,
            "ai",
            success,
            context
        );
    }

    logMovieSync(success: boolean, context: AuditContext = {}) {
        return this.log(
            AuditAction.MOVIE_SYNC,
            "movie",
            success,
            context
        );
    }

    logReviewCreate(
        success: boolean,
        context: AuditContext = {}
    ) {
        return this.log(
            AuditAction.REVIEW_CREATE,
            "review",
            success,
            context
        );
    }

    logReviewDelete(
        success: boolean,
        context: AuditContext = {}
    ) {
        return this.log(
            AuditAction.REVIEW_DELETE,
            "review",
            success,
            context
        );
    }

    logWatchlistAdd(
        success: boolean,
        context: AuditContext = {}
    ) {
        return this.log(
            AuditAction.WATCHLIST_ADD,
            "watchlist",
            success,
            context
        );
    }

    logWatchlistRemove(
        success: boolean,
        context: AuditContext = {}
    ) {
        return this.log(
            AuditAction.WATCHLIST_REMOVE,
            "watchlist",
            success,
            context
        );
    }
}


export default new AuditService();