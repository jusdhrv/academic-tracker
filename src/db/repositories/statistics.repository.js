"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.statisticsRepository = exports.StatisticsRepository = void 0;
var client_1 = require("@/db/prisma/client");
var accuracy_1 = require("@/lib/analytics/accuracy");
var study_time_1 = require("@/lib/analytics/study-time");
var aggregators_1 = require("@/lib/analytics/aggregators");
var SOLVED_OUTCOMES = ['solved-fast', 'solved-slow'];
var StatisticsRepository = /** @class */ (function () {
    function StatisticsRepository() {
    }
    StatisticsRepository.prototype.getAnalyticsData = function () {
        return __awaiter(this, arguments, void 0, function (filters) {
            var _a, currentRangeAttempts, previousRangeAttempts, reviewQueueSize, overdueReviews, currentStats;
            if (filters === void 0) { filters = {}; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            this.getAttemptRecords(filters),
                            this.getAttemptRecords(this.getPreviousRange(filters)),
                            client_1.prisma.flashcard.count({
                                where: {
                                    OR: [{ nextReviewAt: null }, { nextReviewAt: { lte: new Date() } }],
                                },
                            }),
                            client_1.prisma.flashcard.count({
                                where: { nextReviewAt: { lte: new Date() } },
                            }),
                        ])];
                    case 1:
                        _a = _b.sent(), currentRangeAttempts = _a[0], previousRangeAttempts = _a[1], reviewQueueSize = _a[2], overdueReviews = _a[3];
                        currentStats = this.buildMetrics(currentRangeAttempts, previousRangeAttempts, reviewQueueSize, overdueReviews);
                        return [2 /*return*/, {
                                metrics: currentStats,
                                dailyStudyData: this.buildDailyStudyPoints(currentRangeAttempts, filters),
                                questionsData: this.buildQuestionsAttemptedPoints(currentRangeAttempts, filters),
                                accuracyTrendData: this.buildAccuracyTrendPoints(currentRangeAttempts, filters),
                                solveTimeData: this.buildSolveTimeByDifficulty(currentRangeAttempts),
                                weakestChapters: this.buildWeakestChapters(currentRangeAttempts),
                                errorAnalysis: this.buildErrorAnalysis(currentRangeAttempts),
                            }];
                }
            });
        });
    };
    StatisticsRepository.prototype.getSubjectOptions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var subjects;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client_1.prisma.subject.findMany({ orderBy: { name: 'asc' } })];
                    case 1:
                        subjects = _a.sent();
                        return [2 /*return*/, subjects.map(function (subject) { return ({ id: subject.id, name: subject.name }); })];
                }
            });
        });
    };
    StatisticsRepository.prototype.getChapterOptions = function (subjectId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, client_1.prisma.chapter.findMany({
                        where: subjectId ? { subjectId: subjectId } : {},
                        orderBy: { name: 'asc' },
                        select: { id: true, name: true, subjectId: true },
                    })];
            });
        });
    };
    StatisticsRepository.prototype.getAttemptRecords = function () {
        return __awaiter(this, arguments, void 0, function (filters) {
            var where;
            if (filters === void 0) { filters = {}; }
            return __generator(this, function (_a) {
                where = this.buildAttemptFilter(filters);
                return [2 /*return*/, client_1.prisma.practiceQuestionAttempt.findMany({
                        where: where,
                        select: {
                            startedAt: true,
                            elapsedSeconds: true,
                            outcome: true,
                            errorType: true,
                            questionType: true,
                            question: {
                                select: {
                                    difficulty: { select: { name: true } },
                                    masteryScore: true,
                                    chapters: {
                                        select: {
                                            chapter: { select: { id: true, name: true, subjectId: true } },
                                        },
                                    },
                                },
                            },
                        },
                    })];
            });
        });
    };
    StatisticsRepository.prototype.getPreviousRange = function (filters) {
        if (!filters.startDate || !filters.endDate)
            return {};
        var start = new Date(filters.startDate);
        var end = new Date(filters.endDate);
        var delta = end.getTime() - start.getTime();
        var previousEnd = new Date(start.getTime() - 1);
        var previousStart = new Date(previousEnd.getTime() - delta);
        return __assign(__assign({}, filters), { startDate: previousStart.toISOString().slice(0, 10), endDate: previousEnd.toISOString().slice(0, 10) });
    };
    StatisticsRepository.prototype.buildAttemptFilter = function (filters) {
        var where = {};
        if (filters.startDate || filters.endDate) {
            where.startedAt = {};
            if (filters.startDate)
                where.startedAt.gte = new Date(filters.startDate);
            if (filters.endDate) {
                var end = new Date(filters.endDate);
                end.setHours(23, 59, 59, 999);
                where.startedAt.lte = end;
            }
        }
        if (filters.chapterId) {
            where.question = {
                chapters: {
                    some: { chapterId: filters.chapterId },
                },
            };
        }
        else if (filters.subjectId) {
            where.question = {
                chapters: {
                    some: {
                        chapter: {
                            subjectId: filters.subjectId,
                        },
                    },
                },
            };
        }
        return where;
    };
    StatisticsRepository.prototype.buildMetrics = function (currentAttempts, previousAttempts, reviewQueueSize, overdueReviews) {
        var currentMinutes = currentAttempts.reduce(function (sum, attempt) { return sum + attempt.elapsedSeconds; }, 0) / 60;
        var previousMinutes = previousAttempts.reduce(function (sum, attempt) { return sum + attempt.elapsedSeconds; }, 0) / 60;
        var currentSolved = currentAttempts.filter(function (attempt) { return SOLVED_OUTCOMES.includes(attempt.outcome); }).length;
        var currentTotal = currentAttempts.filter(function (attempt) { return attempt.outcome !== 'skipped'; }).length;
        var previousSolved = previousAttempts.filter(function (attempt) { return SOLVED_OUTCOMES.includes(attempt.outcome); }).length;
        var previousTotal = previousAttempts.filter(function (attempt) { return attempt.outcome !== 'skipped'; }).length;
        var currentAvgSolve = this.calculateAverageSolveTime(currentAttempts);
        var previousAvgSolve = this.calculateAverageSolveTime(previousAttempts);
        var currentMastery = this.calculateAverageMastery(currentAttempts);
        var previousMastery = this.calculateAverageMastery(previousAttempts);
        var accuracy = (0, accuracy_1.calculateAccuracy)(currentSolved, currentTotal);
        var previousAccuracy = (0, accuracy_1.calculateAccuracy)(previousSolved, previousTotal);
        return {
            totalStudyTime: (0, study_time_1.formatStudyDuration)(Math.round(currentMinutes)),
            studyTimeDelta: this.renderDelta(currentMinutes, previousMinutes, 'm'),
            questionsAttempted: currentAttempts.length,
            reviewQueueSize: reviewQueueSize,
            overdueReviews: overdueReviews,
            overallAccuracy: "".concat(accuracy, "%"),
            accuracyDelta: this.renderDelta(accuracy, previousAccuracy, '%'),
            avgSolveTime: "".concat(Math.round(currentAvgSolve), "m"),
            solveTimeDelta: this.renderDelta(previousAvgSolve - currentAvgSolve, 0, 'm', true),
            masteryGrowth: "".concat(this.renderDelta(currentMastery, previousMastery, '%', false)),
        };
    };
    StatisticsRepository.prototype.calculateAverageSolveTime = function (attempts) {
        var solvedAttempts = attempts.filter(function (attempt) { return SOLVED_OUTCOMES.includes(attempt.outcome); });
        if (!solvedAttempts.length)
            return 0;
        return solvedAttempts.reduce(function (sum, attempt) { return sum + attempt.elapsedSeconds; }, 0) / solvedAttempts.length / 60;
    };
    StatisticsRepository.prototype.calculateAverageMastery = function (attempts) {
        var masteries = attempts
            .map(function (attempt) { return attempt.question.masteryScore; })
            .filter(function (score) { return typeof score === 'number'; });
        if (!masteries.length)
            return 0;
        return Math.round((masteries.reduce(function (sum, score) { return sum + score; }, 0) / masteries.length) * 100);
    };
    StatisticsRepository.prototype.renderDelta = function (current, previous, unit, invert) {
        if (invert === void 0) { invert = false; }
        if (previous === 0) {
            if (current === 0)
                return "0".concat(unit);
            return "+".concat(current.toFixed(1)).concat(unit, " vs prior");
        }
        var diff = +(current - previous).toFixed(1);
        var sign = diff === 0 ? '' : diff > 0 ? '+' : '';
        if (invert) {
            return "".concat(sign).concat(diff).concat(unit, " vs prior");
        }
        return "".concat(sign).concat(diff).concat(unit, " vs prior");
    };
    StatisticsRepository.prototype.buildDailyStudyPoints = function (attempts, filters) {
        return (0, aggregators_1.groupAttemptsByDay)(attempts, filters.startDate, filters.endDate);
    };
    StatisticsRepository.prototype.buildQuestionsAttemptedPoints = function (attempts, filters) {
        return (0, aggregators_1.groupQuestionsByDay)(attempts, filters.startDate, filters.endDate);
    };
    StatisticsRepository.prototype.buildAccuracyTrendPoints = function (attempts, filters) {
        return (0, aggregators_1.groupAttemptsByWeek)(attempts, filters.startDate, filters.endDate);
    };
    StatisticsRepository.prototype.buildSolveTimeByDifficulty = function (attempts) {
        return (0, aggregators_1.groupAttemptsByDifficulty)(attempts);
    };
    StatisticsRepository.prototype.buildWeakestChapters = function (attempts) {
        return (0, aggregators_1.buildWeakChapterStats)(attempts);
    };
    StatisticsRepository.prototype.buildErrorAnalysis = function (attempts) {
        return (0, aggregators_1.buildErrorBreakdown)(attempts);
    };
    return StatisticsRepository;
}());
exports.StatisticsRepository = StatisticsRepository;
exports.statisticsRepository = new StatisticsRepository();
