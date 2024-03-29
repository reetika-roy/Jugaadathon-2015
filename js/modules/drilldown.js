(function(f) {
    function A(b, a, c) {
        var d;
        !a.rgba.length || !b.rgba.length ? b = a.raw || "none" : (b = b.rgba, a = a.rgba, d = a[3] !== 1 || b[3] !== 1, b = (d ? "rgba(" : "rgb(") + Math.round(a[0] + (b[0] - a[0]) * (1 - c)) + "," + Math.round(a[1] + (b[1] - a[1]) * (1 - c)) + "," + Math.round(a[2] + (b[2] - a[2]) * (1 - c)) + (d ? "," + (a[3] + (b[3] - a[3]) * (1 - c)) : "") + ")");
        return b
    }
    var t = function() {},
        q = f.getOptions(),
        h = f.each,
        l = f.extend,
        B = f.format,
        u = f.pick,
        r = f.wrap,
        m = f.Chart,
        p = f.seriesTypes,
        v = p.pie,
        n = p.column,
        w = f.Tick,
        x = HighchartsAdapter.fireEvent,
        y = HighchartsAdapter.inArray,
        z = 1;
    h(["fill", "stroke"], function(b) {
        HighchartsAdapter.addAnimSetter(b, function(a) {
            a.elem.attr(b, A(f.Color(a.start), f.Color(a.end), a.pos))
        })
    });
    l(q.lang, {
        drillUpText: "◁ Back to {series.name}"
    });
    q.drilldown = {
        activeAxisLabelStyle: {
            cursor: "pointer",
            color: "#0d233a",
            fontWeight: "bold",
            textDecoration: "underline"
        },
        activeDataLabelStyle: {
            cursor: "pointer",
            color: "#0d233a",
            fontWeight: "bold",
            textDecoration: "underline"
        },
        animation: {
            duration: 500
        },
        drillUpButton: {
            position: {
                align: "right",
                x: -10,
                y: 10
            }
        }
    };
    f.SVGRenderer.prototype.Element.prototype.fadeIn =
        function(b) {
            this.attr({
                opacity: 0.1,
                visibility: "inherit"
            }).animate({
                opacity: u(this.newOpacity, 1)
            }, b || {
                duration: 250
            })
        };
    m.prototype.addSeriesAsDrilldown = function(b, a) {
        this.addSingleSeriesAsDrilldown(b, a);
        this.applyDrilldown()
    };
    m.prototype.addSingleSeriesAsDrilldown = function(b, a) {
        var c = b.series,
            d = c.xAxis,
            g = c.yAxis,
            e;
        e = b.color || c.color;
        var i, f = [],
            j = [],
            k, o;
        if (!this.drilldownLevels) this.drilldownLevels = [];
        k = c.options._levelNumber || 0;
        (o = this.drilldownLevels[this.drilldownLevels.length - 1]) && o.levelNumber !==
            k && (o = void 0);
        a = l({
            color: e,
            _ddSeriesId: z++
        }, a);
        i = y(b, c.points);
        h(c.chart.series, function(a) {
            if (a.xAxis === d && !a.isDrilling) a.options._ddSeriesId = a.options._ddSeriesId || z++, a.options._colorIndex = a.userOptions._colorIndex, a.options._levelNumber = a.options._levelNumber || k, o ? (f = o.levelSeries, j = o.levelSeriesOptions) : (f.push(a), j.push(a.options))
        });
        e = {
            levelNumber: k,
            seriesOptions: c.options,
            levelSeriesOptions: j,
            levelSeries: f,
            shapeArgs: b.shapeArgs,
            bBox: b.graphic ? b.graphic.getBBox() : {},
            color: e,
            lowerSeriesOptions: a,
            pointOptions: c.options.data[i],
            pointIndex: i,
            oldExtremes: {
                xMin: d && d.userMin,
                xMax: d && d.userMax,
                yMin: g && g.userMin,
                yMax: g && g.userMax
            }
        };
        this.drilldownLevels.push(e);
        e = e.lowerSeries = this.addSeries(a, !1);
        e.options._levelNumber = k + 1;
        if (d) d.oldPos = d.pos, d.userMin = d.userMax = null, g.userMin = g.userMax = null;
        if (c.type === e.type) e.animate = e.animateDrilldown || t, e.options.animation = !0
    };
    m.prototype.applyDrilldown = function() {
        var b = this.drilldownLevels,
            a;
        if (b && b.length > 0) a = b[b.length - 1].levelNumber, h(this.drilldownLevels,
            function(b) {
                b.levelNumber === a && h(b.levelSeries, function(b) {
                    b.options && b.options._levelNumber === a && b.remove(!1)
                })
            });
        this.redraw();
        this.showDrillUpButton()
    };
    m.prototype.getDrilldownBackText = function() {
        var b = this.drilldownLevels;
        if (b && b.length > 0) return b = b[b.length - 1], b.series = b.seriesOptions, B(this.options.lang.drillUpText, b)
    };
    m.prototype.showDrillUpButton = function() {
        var b = this,
            a = this.getDrilldownBackText(),
            c = b.options.drilldown.drillUpButton,
            d, g;
        this.drillUpButton ? this.drillUpButton.attr({
                text: a
            }).align() :
            (g = (d = c.theme) && d.states, this.drillUpButton = this.renderer.button(a, null, null, function() {
                b.drillUp()
            }, d, g && g.hover, g && g.select).attr({
                align: c.position.align,
                zIndex: 9
            }).add().align(c.position, !1, c.relativeTo || "plotBox"))
    };
    m.prototype.drillUp = function() {
        for (var b = this, a = b.drilldownLevels, c = a[a.length - 1].levelNumber, d = a.length, g = b.series, e, i, f, j, k = function(a) {
                var c;
                h(g, function(b) {
                    b.options._ddSeriesId === a._ddSeriesId && (c = b)
                });
                c = c || b.addSeries(a, !1);
                if (c.type === f.type && c.animateDrillupTo) c.animate = c.animateDrillupTo;
                a === i.seriesOptions && (j = c)
            }; d--;)
            if (i = a[d], i.levelNumber === c) {
                a.pop();
                f = i.lowerSeries;
                if (!f.chart)
                    for (e = g.length; e--;)
                        if (g[e].options.id === i.lowerSeriesOptions.id && g[e].options._levelNumber === c + 1) {
                            f = g[e];
                            break
                        }
                f.xData = [];
                h(i.levelSeriesOptions, k);
                x(b, "drillup", {
                    seriesOptions: i.seriesOptions
                });
                if (j.type === f.type) j.drilldownLevel = i, j.options.animation = b.options.drilldown.animation, f.animateDrillupFrom && f.chart && f.animateDrillupFrom(i);
                j.options._levelNumber = c;
                f.remove(!1);
                if (j.xAxis) e = i.oldExtremes,
                    j.xAxis.setExtremes(e.xMin, e.xMax, !1), j.yAxis.setExtremes(e.yMin, e.yMax, !1)
            }
        this.redraw();
        this.drilldownLevels.length === 0 ? this.drillUpButton = this.drillUpButton.destroy() : this.drillUpButton.attr({
            text: this.getDrilldownBackText()
        }).align();
        this.ddDupes.length = []
    };
    n.prototype.supportsDrilldown = !0;
    n.prototype.animateDrillupTo = function(b) {
        if (!b) {
            var a = this,
                c = a.drilldownLevel;
            h(this.points, function(a) {
                a.graphic && a.graphic.hide();
                a.dataLabel && a.dataLabel.hide();
                a.connector && a.connector.hide()
            });
            setTimeout(function() {
                a.points &&
                    h(a.points, function(a, b) {
                        var e = b === (c && c.pointIndex) ? "show" : "fadeIn",
                            f = e === "show" ? !0 : void 0;
                        if (a.graphic) a.graphic[e](f);
                        if (a.dataLabel) a.dataLabel[e](f);
                        if (a.connector) a.connector[e](f)
                    })
            }, Math.max(this.chart.options.drilldown.animation.duration - 50, 0));
            this.animate = t
        }
    };
    n.prototype.animateDrilldown = function(b) {
        var a = this,
            c = this.chart.drilldownLevels,
            d, g = this.chart.options.drilldown.animation,
            e = this.xAxis;
        if (!b) h(c, function(b) {
            if (a.options._ddSeriesId === b.lowerSeriesOptions._ddSeriesId) d = b.shapeArgs,
                d.fill = b.color
        }), d.x += u(e.oldPos, e.pos) - e.pos, h(this.points, function(a) {
            a.graphic && a.graphic.attr(d).animate(l(a.shapeArgs, {
                fill: a.color
            }), g);
            a.dataLabel && a.dataLabel.fadeIn(g)
        }), this.animate = null
    };
    n.prototype.animateDrillupFrom = function(b) {
        var a = this.chart.options.drilldown.animation,
            c = this.group,
            d = this;
        h(d.trackerGroups, function(a) {
            if (d[a]) d[a].on("mouseover")
        });
        delete this.group;
        h(this.points, function(d) {
            var e = d.graphic,
                i = function() {
                    e.destroy();
                    c && (c = c.destroy())
                };
            e && (delete d.graphic, a ? e.animate(l(b.shapeArgs, {
                fill: b.color
            }), f.merge(a, {
                complete: i
            })) : (e.attr(b.shapeArgs), i()))
        })
    };
    v && l(v.prototype, {
        supportsDrilldown: !0,
        animateDrillupTo: n.prototype.animateDrillupTo,
        animateDrillupFrom: n.prototype.animateDrillupFrom,
        animateDrilldown: function(b) {
            var a = this.chart.drilldownLevels[this.chart.drilldownLevels.length - 1],
                c = this.chart.options.drilldown.animation,
                d = a.shapeArgs,
                g = d.start,
                e = (d.end - g) / this.points.length;
            if (!b) h(this.points, function(b, h) {
                b.graphic.attr(f.merge(d, {
                    start: g + h * e,
                    end: g + (h + 1) * e,
                    fill: a.color
                }))[c ?
                    "animate" : "attr"](l(b.shapeArgs, {
                    fill: b.color
                }), c)
            }), this.animate = null
        }
    });
    f.Point.prototype.doDrilldown = function(b, a) {
        var c = this.series.chart,
            d = c.options.drilldown,
            f = (d.series || []).length,
            e;
        if (!c.ddDupes) c.ddDupes = [];
        for (; f-- && !e;) d.series[f].id === this.drilldown && y(this.drilldown, c.ddDupes) === -1 && (e = d.series[f], c.ddDupes.push(this.drilldown));
        x(c, "drilldown", {
            point: this,
            seriesOptions: e,
            category: a,
            points: a !== void 0 && this.series.xAxis.ddPoints[a].slice(0)
        });
        e && (b ? c.addSingleSeriesAsDrilldown(this, e) :
            c.addSeriesAsDrilldown(this, e))
    };
    f.Axis.prototype.drilldownCategory = function(b) {
        var a, c, d = this.ddPoints[b];
        for (a in d)(c = d[a]) && c.series && c.series.visible && c.doDrilldown && c.doDrilldown(!0, b);
        this.chart.applyDrilldown()
    };
    f.Axis.prototype.getDDPoints = function(b, a) {
        var c = this.ddPoints;
        if (!c) this.ddPoints = c = {};
        c[b] || (c[b] = []);
        if (c[b].levelNumber !== a) c[b].length = 0;
        return c[b]
    };
    w.prototype.drillable = function() {
        var b = this.pos,
            a = this.label,
            c = this.axis,
            d = c.ddPoints && c.ddPoints[b];
        if (a && d && d.length) {
            if (!a.basicStyles) a.basicStyles =
                f.merge(a.styles);
            a.addClass("highcharts-drilldown-axis-label").css(c.chart.options.drilldown.activeAxisLabelStyle).on("click", function() {
                c.drilldownCategory(b)
            })
        } else if (a && a.basicStyles) a.styles = {}, a.css(a.basicStyles), a.on("click", null)
    };
    r(w.prototype, "addLabel", function(b) {
        b.call(this);
        this.drillable()
    });
    r(f.Point.prototype, "init", function(b, a, c, d) {
        var g = b.call(this, a, c, d),
            b = (c = a.xAxis) && c.ticks[d],
            c = c && c.getDDPoints(d, a.options._levelNumber);
        if (g.drilldown && (f.addEvent(g, "click", function() {
                a.xAxis &&
                    a.chart.options.drilldown.allowPointDrilldown === !1 ? a.xAxis.drilldownCategory(d) : g.doDrilldown()
            }), c)) c.push(g), c.levelNumber = a.options._levelNumber;
        b && b.drillable();
        return g
    });
    r(f.Series.prototype, "drawDataLabels", function(b) {
        var a = this.chart.options.drilldown.activeDataLabelStyle;
        b.call(this);
        h(this.points, function(b) {
            b.drilldown && b.dataLabel && b.dataLabel.attr({
                "class": "highcharts-drilldown-data-label"
            }).css(a)
        })
    });
    var s, q = function(b) {
        b.call(this);
        h(this.points, function(a) {
            a.drilldown && a.graphic &&
                a.graphic.attr({
                    "class": "highcharts-drilldown-point"
                }).css({
                    cursor: "pointer"
                })
        })
    };
    for (s in p) p[s].prototype.supportsDrilldown && r(p[s].prototype, "drawTracker", q)
})(Highcharts);