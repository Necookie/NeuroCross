import {
    ACCEL_MAX,
    DECEL_COMF,
    MIN_GAP,
    SAFE_HEADWAY,
    VEHICLE_SPECS,
} from './config';

export class VehicleAgent {
    constructor(id, typeName, laneIdx) {
        this.id = id;
        this.type = typeName;
        this.lane = laneIdx;

        // Derived properties
        this.length = VEHICLE_SPECS[typeName].len;
        this.aggression = 0.1 + Math.random() * 0.8; // random.uniform(0.1, 0.9)
        this.v_desired = VEHICLE_SPECS[typeName].v_max * (0.8 + (this.aggression * 0.3));

        // Dynamic state
        this.pos = 0.0;
        this.speed = this.v_desired * 0.6;
        this.status = 'moving';
    }

    static spawn(vId, typeName, laneIdx) {
        return new VehicleAgent(vId, typeName, laneIdx);
    }

    updatePhysics(dt, leader, stopTarget, friction) {
        let gap = 1000.0;
        let targetSpeed = 0.0;

        if (leader !== null) {
            const distToLeader = (leader.pos - leader.length / 2) - (this.pos + this.length / 2);
            if (distToLeader < gap) {
                gap = distToLeader;
                targetSpeed = leader.speed;
            }
        }

        if (stopTarget !== null) {
            const distToLine = stopTarget - (this.pos + this.length / 2);
            if (distToLine > 0 && distToLine < gap) {
                gap = distToLine;
                targetSpeed = 0.0;
            }
        }

        const s0 = MIN_GAP + (1.0 - this.aggression);
        const deltaV = this.speed - targetSpeed;
        const sStar = s0 + (this.speed * SAFE_HEADWAY) + (
            (this.speed * deltaV) / (2.0 * Math.sqrt(ACCEL_MAX * DECEL_COMF))
        );

        const safeGap = Math.max(0.1, gap);
        let acc = ACCEL_MAX * (1 - Math.pow((this.speed / this.v_desired), 4) - Math.pow((sStar / safeGap), 2));

        if (acc < 0) {
            acc *= friction;
        }

        this.speed = Math.max(0.0, this.speed + acc * dt);
        this.pos += this.speed * dt;

        // Hard stops for unresolvable tight gaps or exact stop line logic
        if (leader !== null) {
            const actualGap = (leader.pos - leader.length / 2) - (this.pos + this.length / 2);
            if (actualGap < 0.5) {
                this.speed = 0.0;
                this.pos = leader.pos - leader.length / 2 - this.length / 2 - 0.5;
                this.status = 'stopped';
                return;
            }
        }

        if (stopTarget !== null) {
            const distToLine = stopTarget - (this.pos + this.length / 2);
            if (distToLine < 0 && distToLine > -2.0) {
                this.speed = 0.0;
                this.pos = stopTarget - this.length / 2;
                this.status = 'stopped';
                return;
            }
        }

        // Status assignment
        if (this.speed < 1) {
            this.status = 'stopped';
        } else if (acc < -1.5) {
            this.status = 'slowing';
        } else {
            this.status = 'moving';
        }
    }
}
