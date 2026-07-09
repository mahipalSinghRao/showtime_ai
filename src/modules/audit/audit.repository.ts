import { Audit } from "./audit.model";
import { CreateAuditDto } from "./audit.types";

class AuditRepository {
    async create(data: CreateAuditDto) {
        return Audit.create(data)
    }

    async findLatest(limit: number = 100) {
        return Audit.find().sort({ createdAt: 1 }).limit(limit);
    }

    async findByUser(userId: string) {
        return Audit.find({
            user: userId,
        }).sort({
            createdAt: -1,
        });
    }

    async findByAction(action: string) {
        return Audit.find({
            action,
        }).sort({
            createdAt: -1,
        });
    }
}

export default new AuditRepository();