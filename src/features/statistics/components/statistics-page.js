'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatisticsPage = StatisticsPage;
var recharts_1 = require("recharts");
var lucide_react_1 = require("lucide-react");
var app_shell_1 = require("@/components/layout/app-shell");
var input_1 = require("@/components/ui/input");
var chart_theme_1 = require("@/constants/chart-theme");
var ERROR_CHART_COLORS = ['#7a6ee8', '#65b741', '#f59e0b', '#ef5350'];
function StatisticsPage(_a) {
    var metrics = _a.metrics, dailyStudyData = _a.dailyStudyData, questionsData = _a.questionsData, accuracyTrendData = _a.accuracyTrendData, solveTimeData = _a.solveTimeData, weakestChapters = _a.weakestChapters, errorAnalysis = _a.errorAnalysis;
    return (<app_shell_1.AppShell>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Statistics & Analytics</h1>
            <p className="text-muted-foreground mt-1">Comprehensive analysis of your study performance.</p>
          </div>
          <form className="flex flex-wrap items-center gap-2" method="get">
            <lucide_react_1.Calendar className="w-4 h-4 text-muted-foreground"/>
            <input_1.Input name="startDate" type="date" defaultValue={startDate !== null && startDate !== void 0 ? startDate : ''} className="bg-card border-border text-foreground text-sm w-32"/>
            <span className="text-muted-foreground">to</span>
            <input_1.Input name="endDate" type="date" defaultValue={endDate !== null && endDate !== void 0 ? endDate : ''} className="bg-card border-border text-foreground text-sm w-32"/>
            <select name="subjectId" defaultValue={selectedSubjectId !== null && selectedSubjectId !== void 0 ? selectedSubjectId : ''} className="bg-card border border-border text-foreground text-sm rounded-lg px-3 py-2">
              <option value="">All subjects</option>
              {subjectOptions.map(function (subject) { return (<option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>); })}
            </select>
            <select name="chapterId" defaultValue={selectedChapterId !== null && selectedChapterId !== void 0 ? selectedChapterId : ''} className="bg-card border border-border text-foreground text-sm rounded-lg px-3 py-2">
              <option value="">All chapters</option>
              {chapterOptions.map(function (chapter) { return (<option key={chapter.id} value={chapter.id}>
                  {chapter.name}
                </option>); })}
            </select>
            <button type="submit" className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90">
              Apply
            </button>
          </form>
        </div>

        <div className="grid grid-cols-5 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-xs text-muted-foreground mb-1">Total Study Time</div>
            <div className="text-2xl font-bold text-foreground">{metrics.totalStudyTime}</div>
            <div className="text-xs text-primary mt-1 flex items-center gap-1">
              <lucide_react_1.TrendingUp className="w-3 h-3"/>
              {metrics.studyTimeDelta}
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-xs text-muted-foreground mb-1">Questions Attempted</div>
            <div className="text-2xl font-bold text-foreground">{metrics.questionsAttempted}</div>
            <div className="text-xs text-muted-foreground mt-1">Total in period</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-xs text-muted-foreground mb-1">Flashcards Reviewed</div>
            <div className="text-2xl font-bold text-foreground">{metrics.flashcardsReviewed}</div>
            <div className="text-xs text-muted-foreground mt-1">Total in period</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-xs text-muted-foreground mb-1">Overall Accuracy</div>
            <div className="text-2xl font-bold text-foreground">{metrics.overallAccuracy}</div>
            <div className="text-xs text-primary mt-1 flex items-center gap-1">
              <lucide_react_1.TrendingUp className="w-3 h-3"/>
              {metrics.accuracyDelta}
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-xs text-muted-foreground mb-1">Avg Solve Time</div>
            <div className="text-2xl font-bold text-foreground">{metrics.avgSolveTime}</div>
            <div className="text-xs text-destructive mt-1 flex items-center gap-1">
              <lucide_react_1.TrendingDown className="w-3 h-3"/>
              {metrics.solveTimeDelta}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Daily Study Time (Last 7 Days)</h2>
            <recharts_1.ResponsiveContainer width="100%" height={250}>
              <recharts_1.AreaChart data={dailyStudyData}>
                <defs>
                  <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7a6ee8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#7a6ee8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <recharts_1.CartesianGrid strokeDasharray="3 3" stroke={chart_theme_1.CHART_GRID_STROKE}/>
                <recharts_1.XAxis dataKey="date" stroke={chart_theme_1.CHART_AXIS_STROKE} style={{ fontSize: '12px' }}/>
                <recharts_1.YAxis stroke={chart_theme_1.CHART_AXIS_STROKE} style={{ fontSize: '12px' }}/>
                <recharts_1.Tooltip contentStyle={chart_theme_1.CHART_TOOLTIP_STYLE}/>
                <recharts_1.Area type="monotone" dataKey="minutes" stroke="#7a6ee8" fillOpacity={1} fill="url(#colorMinutes)"/>
              </recharts_1.AreaChart>
            </recharts_1.ResponsiveContainer>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Questions Attempted (Last 7 Days)</h2>
            <recharts_1.ResponsiveContainer width="100%" height={250}>
              <recharts_1.BarChart data={questionsData}>
                <recharts_1.CartesianGrid strokeDasharray="3 3" stroke={chart_theme_1.CHART_GRID_STROKE}/>
                <recharts_1.XAxis dataKey="date" stroke={chart_theme_1.CHART_AXIS_STROKE} style={{ fontSize: '12px' }}/>
                <recharts_1.YAxis stroke={chart_theme_1.CHART_AXIS_STROKE} style={{ fontSize: '12px' }}/>
                <recharts_1.Tooltip contentStyle={chart_theme_1.CHART_TOOLTIP_STYLE}/>
                <recharts_1.Bar dataKey="attempted" fill="#65b741" radius={[4, 4, 0, 0]}/>
              </recharts_1.BarChart>
            </recharts_1.ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Accuracy Trend</h2>
            <recharts_1.ResponsiveContainer width="100%" height={280}>
              <recharts_1.LineChart data={accuracyTrendData}>
                <recharts_1.CartesianGrid strokeDasharray="3 3" stroke={chart_theme_1.CHART_GRID_STROKE}/>
                <recharts_1.XAxis dataKey="date" stroke={chart_theme_1.CHART_AXIS_STROKE} style={{ fontSize: '12px' }}/>
                <recharts_1.YAxis stroke={chart_theme_1.CHART_AXIS_STROKE} style={{ fontSize: '12px' }} domain={[60, 90]}/>
                <recharts_1.Tooltip contentStyle={chart_theme_1.CHART_TOOLTIP_STYLE}/>
                <recharts_1.Line type="monotone" dataKey="accuracy" stroke="#65b741" strokeWidth={3} dot={{ fill: '#65b741', r: 5 }}/>
              </recharts_1.LineChart>
            </recharts_1.ResponsiveContainer>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Avg Solve Time by Difficulty</h2>
            <recharts_1.ResponsiveContainer width="100%" height={280}>
              <recharts_1.BarChart data={solveTimeData}>
                <recharts_1.CartesianGrid strokeDasharray="3 3" stroke={chart_theme_1.CHART_GRID_STROKE}/>
                <recharts_1.XAxis dataKey="difficulty" stroke={chart_theme_1.CHART_AXIS_STROKE} style={{ fontSize: '12px' }}/>
                <recharts_1.YAxis stroke={chart_theme_1.CHART_AXIS_STROKE} style={{ fontSize: '12px' }}/>
                <recharts_1.Tooltip contentStyle={chart_theme_1.CHART_TOOLTIP_STYLE}/>
                <recharts_1.Bar dataKey="avgTime" fill="#f59e0b" radius={[4, 4, 0, 0]}/>
              </recharts_1.BarChart>
            </recharts_1.ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Weakest Chapters</h2>
            <div className="space-y-3">
              {weakestChapters.map(function (chapter, idx) { return (<div key={idx} className="flex items-center justify-between p-3 bg-secondary rounded">
                  <div>
                    <div className="text-sm font-medium text-foreground">{chapter.chapter}</div>
                    <div className="text-xs text-muted-foreground">{chapter.attempted} attempts</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className={"text-sm font-bold ".concat(chapter.accuracy >= 70 ? 'text-green-400' : 'text-red-400')}>
                        {chapter.accuracy}%
                      </div>
                    </div>
                    <div className="w-16 h-2 bg-border rounded-full overflow-hidden">
                      <div className={"h-full transition-all ".concat(chapter.accuracy >= 70 ? 'bg-green-500' : 'bg-red-500')} style={{ width: "".concat(chapter.accuracy, "%") }}/>
                    </div>
                  </div>
                </div>); })}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Error Analysis</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <recharts_1.ResponsiveContainer width="100%" height={200}>
                  <recharts_1.PieChart>
                    <recharts_1.Pie data={errorAnalysis} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2} dataKey="count">
                      {errorAnalysis.map(function (_, idx) { return (<recharts_1.Cell key={idx} fill={ERROR_CHART_COLORS[idx]}/>); })}
                    </recharts_1.Pie>
                  </recharts_1.PieChart>
                </recharts_1.ResponsiveContainer>
              </div>
              <div className="flex flex-col justify-center space-y-2">
                {errorAnalysis.map(function (error, idx) { return (<div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ERROR_CHART_COLORS[idx] }}/>
                      <span className="text-muted-foreground">{error.errorType}</span>
                    </div>
                    <span className="text-foreground font-semibold">{error.percentage}%</span>
                  </div>); })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </app_shell_1.AppShell>);
}
