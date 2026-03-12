import {
    ACCEL_MAX,
    DECEL_COMF,
    MIN_GAP,
    SAFE_HEADWAY,
    VEHICLE_SPECS,
} from './config';

export class VehicleAgent {
    constructor(id, typeName, laneIdx, route = 'straight', direction = 'north', intersectionIdx = 0) {
        this.id = id;
        this.type = typeName;
        this.lane = laneIdx;
        this.route = route;
        this.direction = direction;
        this.intersectionIdx = intersectionIdx;

        // Derived properties (more human variability, faster overall)
        this.length = VEHICLE_SPECS[typeName].len;
        this.aggression = Math.random(); // 0.0 to 1.0
        this.v_desired = VEHICLE_SPECS[typeName].v_max * (0.85 + (this.aggression * 0.45));

        // Dynamic 1D State (distance traveled along its specific path curve)
        this.pos = 0.0;
        this.speed = this.v_desired * 0.6;
        this.status = 'moving';

        // Dynamic 2D State (for collision and rendering)
        this.x = 0;
        this.y = 0;
        this.angle = 0; // rotation in degrees
    }

    static spawn(vId, typeName, laneIdx, route = 'straight', direction = 'north', intersectionIdx = 0) {
        return new VehicleAgent(vId, typeName, laneIdx, route, direction, intersectionIdx);
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
            if (actualGap < 4.0) {
                this.speed = 0.0;
                this.pos = leader.pos - leader.length / 2 - this.length / 2 - 4.0;
                this.status = 'stopped';
                this._update2DCoords();
                return;
            }
        }

        if (stopTarget !== null) {
            const distToLine = stopTarget - (this.pos + this.length / 2);
            if (distToLine < 0 && distToLine > -2.0) {
                this.speed = 0.0;
                this.pos = stopTarget - this.length / 2;
                this.status = 'stopped';
                this._update2DCoords();
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

        // After updating the 1D path distance (this.pos), 
        // we project it into 2D space for rendering
        this._update2DCoords();
    }

    _update2DCoords() {
        // Maps 1D "pos" (0 -> 400) into coordinates on 1600x800 canvas
        const scaledPos = (this.pos / 400) * 800;
        const intOffset = this.intersectionIdx * 800;
        const CX = intOffset + 400; // center X for this intersection
        const CY = 400;             // center Y (same for both)

        const APPROACH_END = 240;
        const INTERSECTION_SIZE = 320;

        const POS_IN_INTERSECTION = scaledPos - APPROACH_END;

        // 2 lanes: lane 0 = outer, lane 1 = inner
        // N-S roads are 320px wide (20% of 1600), E-W road is 320px tall (40% of 800)
        // Half-road = 160px per side. Place lanes at ~35% and ~75% of each half.
        const offsetPx = this.lane === 1 ? 55 : 110;

        // 1. Straight Line Geometry
        if (this.route === 'straight' || scaledPos <= APPROACH_END) {
            this._calculateStraightLine(offsetPx, CX, CY, null, scaledPos, intOffset);
            return;
        }

        // 2. Turning Geometry inside intersection (Bezier Curves)
        // Find what the progress is through the true geometry of the turn (the length of the arc)
        // For simplicity, we map the progress 0-1 through the intersection box itself
        let progress = 0;
        if (this.route === 'left') {
            progress = POS_IN_INTERSECTION / INTERSECTION_SIZE;
        } else if (this.route === 'right') {
            progress = POS_IN_INTERSECTION / (INTERSECTION_SIZE * 0.5); // Right turn completes halfway through
        }

        const clampedProg = Math.max(0, Math.min(progress, 1.0));

        // Get the geometry anchors
        const { p0, p1, p2, exitDirection } = this._getCurvePoints(CX, CY, offsetPx, INTERSECTION_SIZE);

        if (clampedProg < 1.0) {
            // We are actively inside the curve
            this._calculateCurve(clampedProg, p0, p1, p2);
        } else {
            // We finished the curve and are continuing straight along the new exit path
            let remainingDist = 0;
            if (this.route === 'left') {
                remainingDist = POS_IN_INTERSECTION - INTERSECTION_SIZE;
            } else if (this.route === 'right') {
                remainingDist = POS_IN_INTERSECTION - (INTERSECTION_SIZE * 0.5);
            }
            this._calculateStraightLine(offsetPx, CX, CY, exitDirection, scaledPos, intOffset, remainingDist, p2);
        }
    }

    _calculateStraightLine(offsetPx, CX, CY, overrideDirection = null, scaledPos = 0, intOffset = 0, extraDist = 0, anchor = null) {
        const dir = overrideDirection || this.direction;

        if (anchor) {
            if (dir === 'north') { this.x = anchor.x; this.y = anchor.y - extraDist; this.angle = -90; }
            else if (dir === 'south') { this.x = anchor.x; this.y = anchor.y + extraDist; this.angle = 90; }
            else if (dir === 'east') { this.x = anchor.x + extraDist; this.y = anchor.y; this.angle = 0; }
            else if (dir === 'west') { this.x = anchor.x - extraDist; this.y = anchor.y; this.angle = 180; }
            return;
        }

        if (dir === 'north') {
            this.y = 800 - scaledPos;
            this.x = CX + offsetPx;
            this.angle = -90;
        } else if (dir === 'south') {
            this.y = scaledPos;
            this.x = CX - offsetPx;
            this.angle = 90;
        } else if (dir === 'east') {
            this.x = intOffset + scaledPos;
            this.y = CY + offsetPx;
            this.angle = 0;
        } else if (dir === 'west') {
            this.x = intOffset + (800 - scaledPos);
            this.y = CY - offsetPx;
            this.angle = 180;
        }
    }

    _calculateCurve(t, p0, p1, p2) {
        // Quadratic Bezier Curve Formula: B(t) = (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
        const mt = 1 - t;

        this.x = (mt * mt * p0.x) + (2 * mt * t * p1.x) + (t * t * p2.x);
        this.y = (mt * mt * p0.y) + (2 * mt * t * p1.y) + (t * t * p2.y);

        // Derivative (Tangent) Formula to find the perfect rotation angle
        // B'(t) = 2(1-t)(P1 - P0) + 2t(P2 - P1)
        const dx = 2 * mt * (p1.x - p0.x) + 2 * t * (p2.x - p1.x);
        const dy = 2 * mt * (p1.y - p0.y) + 2 * t * (p2.y - p1.y);

        // Convert Radians to Degrees
        const rad = Math.atan2(dy, dx);
        this.angle = rad * (180 / Math.PI);
    }

    _getCurvePoints(CX, CY, offset, size) {
        const half = size / 2;
        let p0 = { x: 0, y: 0 };
        let p1 = { x: 0, y: 0 };
        let p2 = { x: 0, y: 0 };
        let exitDirection = 'north';

        if (this.direction === 'north') {
            p0 = { x: CX + offset, y: CY + half };
            if (this.route === 'left') {
                p1 = { x: CX + offset, y: CY - offset };
                p2 = { x: CX - half, y: CY - offset };
                exitDirection = 'west';
            } else {
                p1 = { x: CX + offset, y: CY + offset };
                p2 = { x: CX + half, y: CY + offset };
                exitDirection = 'east';
            }
        } else if (this.direction === 'south') {
            p0 = { x: CX - offset, y: CY - half };
            if (this.route === 'left') {
                p1 = { x: CX - offset, y: CY + offset };
                p2 = { x: CX + half, y: CY + offset };
                exitDirection = 'east';
            } else {
                p1 = { x: CX - offset, y: CY - offset };
                p2 = { x: CX - half, y: CY - offset };
                exitDirection = 'west';
            }
        } else if (this.direction === 'east') {
            p0 = { x: CX - half, y: CY + offset };
            if (this.route === 'left') {
                p1 = { x: CX + offset, y: CY + offset };
                p2 = { x: CX + offset, y: CY - half };
                exitDirection = 'north';
            } else {
                p1 = { x: CX - offset, y: CY + offset };
                p2 = { x: CX - offset, y: CY + half };
                exitDirection = 'south';
            }
        } else if (this.direction === 'west') {
            p0 = { x: CX + half, y: CY - offset };
            if (this.route === 'left') {
                p1 = { x: CX - offset, y: CY - offset };
                p2 = { x: CX - offset, y: CY + half };
                exitDirection = 'south';
            } else {
                p1 = { x: CX + offset, y: CY - offset };
                p2 = { x: CX + offset, y: CY - half };
                exitDirection = 'north';
            }
        }

        return { p0, p1, p2, exitDirection };
    }
}
