import {
    ACCEL_MAX,
    DECEL_COMF,
    MIN_GAP,
    ROAD_LENGTH,
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
        this.pathMode = 'cross';
        this.singleRoundabout = false;
        this.singleCross = false;

        // Dynamic 2D State (for collision and rendering)
        this.x = 0;
        this.y = 0;
        this.angle = 0; // rotation in degrees
        this._smoothedAngle = 0;
        this._hasAngle = false;
    }

    static spawn(vId, typeName, laneIdx, route = 'straight', direction = 'north', intersectionIdx = 0) {
        return new VehicleAgent(vId, typeName, laneIdx, route, direction, intersectionIdx);
    }

    updatePhysics(dt, leader, stopTarget, friction) {
        const isRoundabout = this.pathMode === 'roundabout';
        const previousPos = this.pos;
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

        const s0 = MIN_GAP + (1.0 - this.aggression) + (isRoundabout ? 8.0 : 0.0);
        const deltaV = this.speed - targetSpeed;
        const sStar = s0 + (this.speed * SAFE_HEADWAY) + (
            (this.speed * deltaV) / (2.0 * Math.sqrt(ACCEL_MAX * DECEL_COMF))
        );

        const safeGap = Math.max(0.1, gap);
        let acc = ACCEL_MAX * (1 - Math.pow((this.speed / this.v_desired), 4) - Math.pow((sStar / safeGap), 2));

        if (acc < 0) {
            acc *= friction;
        }

        const speedCap = this.v_desired * (isRoundabout ? 0.72 : 1.0);
        this.speed = Math.max(0.0, Math.min(speedCap, this.speed + acc * dt));
        this.pos += this.speed * dt;

        // Hard stops for unresolvable tight gaps or exact stop line logic
        if (leader !== null) {
            const actualGap = (leader.pos - leader.length / 2) - (this.pos + this.length / 2);
            if (actualGap < (isRoundabout ? 7.0 : 4.0)) {
                this.speed = 0.0;
                if (isRoundabout) {
                    this.pos = Math.max(0, previousPos);
                } else {
                    this.pos = leader.pos - leader.length / 2 - this.length / 2 - 4.0;
                }
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
        if (this.pathMode === 'roundabout') {
            this._updateRoundaboutCoords();
            return;
        }

        if (this.pathMode === 'tintersection') {
            this._updateTIntersectionCoords();
            return;
        }

        // Maps 1D "pos" (0 -> 400) into coordinates on 1600x800 canvas
        const scaledPos = (this.pos / ROAD_LENGTH) * 800;
        const intOffset = this.singleCross ? 400 : (this.intersectionIdx * 800);
        const CX = intOffset + 400; // center X for this intersection
        const CY = 400;             // center Y (same for both)

        const APPROACH_END = 208;
        const INTERSECTION_SIZE = 384;

        const POS_IN_INTERSECTION = scaledPos - APPROACH_END;

        // 2 lanes: lane 0 = outer, lane 1 = inner
        // Cross roads are 384px wide/tall, leaving a 384px square center box.
        // Half-road = 192px per side. Keep lane centers at the same relative depth.
        const halfRoad = INTERSECTION_SIZE / 2;
        const offsetPx = this.lane === 1 ? (halfRoad * 0.34375) : (halfRoad * 0.6875);

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
            else if (dir === 'east') {
                const stretch = this.singleCross ? (1600 - anchor.x) / (intOffset + 800 - anchor.x || 1) : 1;
                this.x = anchor.x + extraDist * stretch; this.y = anchor.y; this.angle = 0;
            }
            else if (dir === 'west') {
                const stretch = this.singleCross ? anchor.x / (anchor.x - intOffset || 1) : 1;
                this.x = anchor.x - extraDist * stretch; this.y = anchor.y; this.angle = 180;
            }
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
            if (this.singleCross) {
                const approachEnd = 208;
                const intersectionEdge = CX - 192; // = 608
                const exitStart = approachEnd + 384; // = 592
                const exitEdge = CX + 192; // = 992
                if (scaledPos <= approachEnd) {
                    // Approach: lerp from x=0 to intersection left edge (608)
                    this.x = (scaledPos / approachEnd) * intersectionEdge;
                } else if (scaledPos <= exitStart) {
                    // Inside intersection: lerp from 608 to 992
                    const t = (scaledPos - approachEnd) / (exitStart - approachEnd);
                    this.x = intersectionEdge + t * (exitEdge - intersectionEdge);
                } else {
                    // Exit: lerp from intersection right edge (992) to 1600
                    const exitProgress = (scaledPos - exitStart) / (800 - exitStart);
                    this.x = exitEdge + exitProgress * (1600 - exitEdge);
                }
            } else {
                this.x = intOffset + scaledPos;
            }
            this.y = CY + offsetPx;
            this.angle = 0;
        } else if (dir === 'west') {
            if (this.singleCross) {
                const approachEnd = 208;
                const intersectionEdge = CX + 192; // = 992
                const exitStart = approachEnd + 384; // = 592
                const exitEdge = CX - 192; // = 608
                if (scaledPos <= approachEnd) {
                    // Approach: lerp from x=1600 to intersection right edge (992)
                    this.x = 1600 - (scaledPos / approachEnd) * (1600 - intersectionEdge);
                } else if (scaledPos <= exitStart) {
                    // Inside intersection: lerp from 992 to 608
                    const t = (scaledPos - approachEnd) / (exitStart - approachEnd);
                    this.x = intersectionEdge - t * (intersectionEdge - exitEdge);
                } else {
                    // Exit: lerp from intersection left edge (608) to 0
                    const exitProgress = (scaledPos - exitStart) / (800 - exitStart);
                    this.x = exitEdge - exitProgress * exitEdge;
                }
            } else {
                this.x = intOffset + (800 - scaledPos);
            }
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

    _updateRoundaboutCoords() {
        const scaledPos = (this.pos / ROAD_LENGTH) * 800;
        const isSingleRoundabout = this.singleRoundabout === true;
        const intOffset = this.intersectionIdx * 800;
        const minX = isSingleRoundabout ? 0 : intOffset;
        const maxX = isSingleRoundabout ? 1600 : (intOffset + 800);
        const CX = isSingleRoundabout ? 800 : (intOffset + 400);
        const CY = 400;

        const approachOffset = isSingleRoundabout
            ? 52
            : (this.lane === 1 ? 16 : 24);
        const radius = isSingleRoundabout
            ? 200
            : (this.lane === 1 ? 100 : 128);

        const h = Math.sqrt(Math.max(0, radius * radius - approachOffset * approachOffset));

        let entryTheta = 0;
        if (this.direction === 'north') entryTheta = Math.atan2(-h, approachOffset);
        else if (this.direction === 'south') entryTheta = Math.atan2(h, -approachOffset);
        else if (this.direction === 'east') entryTheta = Math.atan2(-approachOffset, -h);
        else if (this.direction === 'west') entryTheta = Math.atan2(approachOffset, h);

        const exitDirection = this._getRoundaboutExitDirection();
        let exitTheta = 0;
        if (exitDirection === 'north') exitTheta = Math.atan2(h, approachOffset);
        else if (exitDirection === 'south') exitTheta = Math.atan2(-h, -approachOffset);
        else if (exitDirection === 'east') exitTheta = Math.atan2(-approachOffset, h);
        else if (exitDirection === 'west') exitTheta = Math.atan2(approachOffset, -h);

        let entryDeg = entryTheta * 180 / Math.PI;
        let exitDeg = exitTheta * 180 / Math.PI;
        if (entryDeg < 0) entryDeg += 360;
        if (exitDeg < 0) exitDeg += 360;

        let travelDeg = exitDeg - entryDeg;
        if (travelDeg <= 0) travelDeg += 360;

        const APPROACH_SEG = 200;
        const ARC_QUARTER_SEG = 145;
        const EXIT_SEG = 220;

        const arcSeg = (travelDeg / 90) * ARC_QUARTER_SEG;
        const arcStart = APPROACH_SEG;
        const arcEnd = arcStart + arcSeg;

        if (scaledPos <= arcStart) {
            const t = Math.max(0, Math.min(scaledPos / APPROACH_SEG, 1));
            this._setRoundaboutApproachCoords(t, CX, CY, h, approachOffset, minX, maxX);
            return;
        }

        if (scaledPos <= arcEnd) {
            const t = Math.max(0, Math.min((scaledPos - arcStart) / Math.max(1, arcSeg), 1));
            const thetaDeg = entryDeg + (travelDeg * t);
            const theta = (thetaDeg * Math.PI) / 180;

            this.x = CX + (radius * Math.cos(theta));
            this.y = CY - (radius * Math.sin(theta));

            const dx = -Math.sin(theta);
            const dy = -Math.cos(theta);
            this._setAngle(Math.atan2(dy, dx) * (180 / Math.PI));
            return;
        }

        const exitT = Math.max(0, Math.min((scaledPos - arcEnd) / EXIT_SEG, 1));
        this._setRoundaboutExitCoords(exitT, exitDirection, CX, CY, h, approachOffset, minX, maxX);
    }

    _getRoundaboutExitDirection() {
        if (this.route === 'straight') {
            return this.direction;
        }

        const turns = {
            north: { left: 'west', right: 'east' },
            south: { left: 'east', right: 'west' },
            east: { left: 'north', right: 'south' },
            west: { left: 'south', right: 'north' },
        };

        return turns[this.direction]?.[this.route] ?? this.direction;
    }

    _setRoundaboutApproachCoords(t, CX, CY, h, approachOffset, minX, maxX) {
        if (this.direction === 'north') {
            this.x = CX + approachOffset;
            this.y = 800 - ((800 - (CY + h)) * t);
            this._setAngle(-90);
            return;
        }
        if (this.direction === 'south') {
            this.x = CX - approachOffset;
            this.y = (CY - h) * t;
            this._setAngle(90);
            return;
        }
        if (this.direction === 'east') {
            this.x = (minX * (1 - t)) + ((CX - h) * t);
            this.y = CY + approachOffset;
            this._setAngle(0);
            return;
        }

        this.x = maxX - ((maxX - (CX + h)) * t);
        this.y = CY - approachOffset;
        this._setAngle(180);
    }

    _updateTIntersectionCoords() {
        const t = Math.max(0, Math.min(this.pos / ROAD_LENGTH, 1));
        const CX = 800;
        const CY = 320;
        
        const laneOffsetHorizontal = this.lane === 1 ? 40 : 80;
        const laneOffsetVertical = this.lane === 1 ? 50 : 100;

        if (this.route === 'straight') {
            if (this.direction === 'east') {
                this.x = t * 1600;
                this.y = CY + laneOffsetHorizontal;
                this._setAngle(0);
            } else if (this.direction === 'west') {
                this.x = 1600 - (t * 1600);
                this.y = CY - laneOffsetHorizontal;
                this._setAngle(180);
            }
            return;
        }

        const turnStart = 0.38; 
        const turnEnd = 0.62;   

        let p0, p1, p2, startAngle, endAngle;

        if (this.direction === 'east' && this.route === 'right') {
            p0 = { x: turnStart * 1600, y: CY + laneOffsetHorizontal };
            p1 = { x: CX - laneOffsetVertical, y: CY + laneOffsetHorizontal };
            p2 = { x: CX - laneOffsetVertical, y: CY + 140 };
            startAngle = 0;
            endAngle = 90;
        } else if (this.direction === 'west' && this.route === 'left') {
            p0 = { x: 1600 - turnStart * 1600, y: CY - laneOffsetHorizontal };
            p1 = { x: CX - laneOffsetVertical, y: CY - laneOffsetHorizontal };
            p2 = { x: CX - laneOffsetVertical, y: CY + 140 };
            startAngle = 180;
            endAngle = 90;
        } else if (this.direction === 'north') {
            p0 = { x: CX + laneOffsetVertical, y: CY + 140 };
            if (this.route === 'left') {
                p1 = { x: CX + laneOffsetVertical, y: CY - laneOffsetHorizontal };
                p2 = { x: 1600 - turnEnd * 1600, y: CY - laneOffsetHorizontal };
                startAngle = -90;
                endAngle = 180;
            } else {
                p1 = { x: CX + laneOffsetVertical, y: CY + laneOffsetHorizontal };
                p2 = { x: turnEnd * 1600, y: CY + laneOffsetHorizontal };
                startAngle = -90;
                endAngle = 0;
            }
        }

        if (t <= turnStart) {
            const p = t / turnStart;
            if (this.direction === 'east') {
                this.x = p * p0.x;
                this.y = p0.y;
            } else if (this.direction === 'west') {
                this.x = 1600 - p * (1600 - p0.x);
                this.y = p0.y;
            } else if (this.direction === 'north') {
                this.x = p0.x;
                this.y = 800 - p * (800 - p0.y);
            }
            this._setAngle(startAngle);
        } else if (t >= turnEnd) {
            const p = (t - turnEnd) / (1 - turnEnd);
            if (endAngle === 90) { 
                this.x = p2.x;
                this.y = p2.y + p * (800 - p2.y);
            } else if (endAngle === 180) { 
                this.x = p2.x - p * p2.x;
                this.y = p2.y;
            } else if (endAngle === 0) { 
                this.x = p2.x + p * (1600 - p2.x);
                this.y = p2.y;
            }
            this._setAngle(endAngle);
        } else {
            const curveT = (t - turnStart) / (turnEnd - turnStart);
            this._calculateCurve(curveT, p0, p1, p2);
        }
    }

    _setRoundaboutExitCoords(t, exitDirection, CX, CY, h, approachOffset, minX, maxX) {
        const lerp = (a, b, ratio) => a + ((b - a) * ratio);

        if (exitDirection === 'north') {
            const startX = CX + approachOffset;
            const startY = CY - h;
            this.x = lerp(startX, startX, t);
            this.y = lerp(startY, 0, t);
            this._setAngle(-90);
            return;
        }

        if (exitDirection === 'south') {
            const startX = CX - approachOffset;
            const startY = CY + h;
            this.x = lerp(startX, startX, t);
            this.y = lerp(startY, 800, t);
            this._setAngle(90);
            return;
        }

        if (exitDirection === 'east') {
            const startX = CX + h;
            const startY = CY + approachOffset;
            this.x = lerp(startX, maxX, t);
            this.y = lerp(startY, startY, t);
            this._setAngle(0);
            return;
        }

        const startX = CX - h;
        const startY = CY - approachOffset;
        this.x = lerp(startX, minX, t);
        this.y = lerp(startY, startY, t);
        this._setAngle(180);
    }

    _setAngle(nextAngle) {
        if (!this._hasAngle) {
            this._smoothedAngle = nextAngle;
            this._hasAngle = true;
            this.angle = nextAngle;
            return;
        }

        let delta = nextAngle - this._smoothedAngle;
        while (delta > 180) delta -= 360;
        while (delta < -180) delta += 360;

        this._smoothedAngle += delta * 0.25;
        this.angle = this._smoothedAngle;
    }
}
