import {
    ACCEL_MAX,
    DECEL_COMF,
    MIN_GAP,
    SAFE_HEADWAY,
    VEHICLE_SPECS,
} from './config';

export class VehicleAgent {
    constructor(id, typeName, laneIdx, route = 'straight', direction = 'north') {
        this.id = id;
        this.type = typeName;
        this.lane = laneIdx;
        this.route = route;
        this.direction = direction; // 'north', 'south', 'east', 'west'

        // Derived properties
        this.length = VEHICLE_SPECS[typeName].len;
        this.aggression = 0.1 + Math.random() * 0.8;
        this.v_desired = VEHICLE_SPECS[typeName].v_max * (0.8 + (this.aggression * 0.3));

        // Dynamic 1D State (distance traveled along its specific path curve)
        this.pos = 0.0;
        this.speed = this.v_desired * 0.6;
        this.status = 'moving';

        // Dynamic 2D State (for collision and rendering)
        this.x = 0;
        this.y = 0;
        this.angle = 0; // rotation in degrees
    }

    static spawn(vId, typeName, laneIdx, route = 'straight', direction = 'north') {
        return new VehicleAgent(vId, typeName, laneIdx, route, direction);
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

        // After updating the 1D path distance (this.pos), 
        // we project it into 2D space for rendering
        this._update2DCoords();
    }

    _update2DCoords() {
        // Maps 1D "pos" (0 -> 400) into X,Y coordinates
        const scaledPos = (this.pos / 400) * 800;

        // Hardcoded intersection boundaries based on React UI mapping (800x800 canvas)
        const CENTER = 400;
        const APPROACH_END = 240;
        const INTERSECTION_SIZE = 320;
        const EXIT_START = APPROACH_END + INTERSECTION_SIZE;

        const POS_IN_INTERSECTION = scaledPos - APPROACH_END;
        const LANE_OFFSET = this.lane === 1 ? 5 : 15; // Inner vs Outer lane (percentage of 800 = 40px or 120px)

        // Math helpers
        const innerPx = 40;
        const outerPx = 120;
        const offsetPx = this.lane === 1 ? innerPx : outerPx;

        // 1. Straight Line Geometry
        if (this.route === 'straight' || scaledPos <= APPROACH_END) {
            this._calculateStraightLine(offsetPx, CENTER, null, scaledPos);
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
        const { p0, p1, p2, exitDirection } = this._getCurvePoints(CENTER, offsetPx, INTERSECTION_SIZE);

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
            this._calculateStraightLine(offsetPx, CENTER, exitDirection, scaledPos, remainingDist, p2);
        }
    }

    _calculateStraightLine(offsetPx, CENTER, overrideDirection = null, scaledPos = 0, extraDist = 0, anchor = null) {
        const dir = overrideDirection || this.direction;

        if (anchor) {
            // If driving straight out of a finished turn, start from the anchor point
            if (dir === 'north') { this.x = anchor.x; this.y = anchor.y - extraDist; this.angle = -90; }
            else if (dir === 'south') { this.x = anchor.x; this.y = anchor.y + extraDist; this.angle = 90; }
            else if (dir === 'east') { this.x = anchor.x + extraDist; this.y = anchor.y; this.angle = 0; }
            else if (dir === 'west') { this.x = anchor.x - extraDist; this.y = anchor.y; this.angle = 180; }
            return;
        }
        // Maps 1D "pos" (0 -> 800) into X,Y coordinates
        // Assuming road total length is 800 across the whole screen. 
        // Frontend uses Top/Left percentages, but we will store direct pixels here,
        // and let frontend convert or just use these.
        // For simplicity, pos 0 to 400 is the entry road. 400 to 800 is the exit road.

        if (this.direction === 'north') {
            this.y = 800 - scaledPos;
            this.x = CENTER + offsetPx;
            this.angle = -90;
        } else if (this.direction === 'south') {
            this.y = scaledPos;
            this.x = CENTER - offsetPx;
            this.angle = 90;
        } else if (this.direction === 'east') {
            this.x = scaledPos;
            this.y = CENTER + offsetPx;
            this.angle = 0;
        } else if (this.direction === 'west') {
            this.x = 800 - scaledPos;
            this.y = CENTER - offsetPx;
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

    _getCurvePoints(center, offset, size) {
        // Defines the Entry (p0), Corner (p1), and Exit (p2) points for a turn
        const half = size / 2;
        let p0 = { x: 0, y: 0 };
        let p1 = { x: 0, y: 0 };
        let p2 = { x: 0, y: 0 };
        let exitDirection = 'north';

        if (this.direction === 'north') { // Approaching from Bottom
            p0 = { x: center + offset, y: center + half };
            if (this.route === 'left') { // Go West
                p1 = { x: center + offset, y: center - offset };
                p2 = { x: center - half, y: center - offset };
                exitDirection = 'west';
            } else { // Go East (Right Turn)
                p1 = { x: center + offset, y: center + offset };
                p2 = { x: center + half, y: center + offset };
                exitDirection = 'east';
            }
        } else if (this.direction === 'south') { // Approaching from Top
            p0 = { x: center - offset, y: center - half };
            if (this.route === 'left') { // Go East
                p1 = { x: center - offset, y: center + offset };
                p2 = { x: center + half, y: center + offset };
                exitDirection = 'east';
            } else { // Go West (Right turn)
                p1 = { x: center - offset, y: center - offset };
                p2 = { x: center - half, y: center - offset };
                exitDirection = 'west';
            }
        } else if (this.direction === 'east') { // Approaching from Left
            p0 = { x: center - half, y: center + offset };
            if (this.route === 'left') { // Go North
                p1 = { x: center + offset, y: center + offset };
                p2 = { x: center + offset, y: center - half };
                exitDirection = 'north';
            } else { // Go South (Right Turn)
                p1 = { x: center - offset, y: center + offset };
                p2 = { x: center - offset, y: center + half };
                exitDirection = 'south';
            }
        } else if (this.direction === 'west') { // Approaching from Right
            p0 = { x: center + half, y: center - offset };
            if (this.route === 'left') { // Go South
                p1 = { x: center - offset, y: center - offset };
                p2 = { x: center - offset, y: center + half };
                exitDirection = 'south';
            } else { // Go North (Right turn)
                p1 = { x: center + offset, y: center - offset };
                p2 = { x: center + offset, y: center - half };
                exitDirection = 'north';
            }
        }

        return { p0, p1, p2, exitDirection };
    }
}
