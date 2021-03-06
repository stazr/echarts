define(function (require) {

    'use strict';

    var ComponentModel = require('../../model/Component');
    var zrUtil = require('zrender/core/util');
    var layout = require('../../util/layout');

    var CalendarModel = ComponentModel.extend({

        type: 'calendar',

        /**
         * @type {module:echarts/coord/calendar/Calendar}
         */
        coordinateSystem: null,

        defaultOption: {
            zlevel: 0,
            z: 2,
            left: 80,
            top: 60,

            cellSize: 20,

            // horizontal vertical
            orient: 'horizontal',

            // month separate line style
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#000',
                    width: 1,
                    type: 'solid'
                }
            },

            // rect style  temporarily unused emphasis
            itemStyle: {
                normal: {
                    color: '#fff',
                    borderWidth: 1,
                    borderColor: '#ccc'
                }
            },

            // week text style
            dayLabel: {
                show: true,

                // a week first day
                firstDay: 0,

                // start end
                position: 'start',
                margin: 0,
                nameMap: 'en',
                textStyle: {
                    color: '#000'
                }
            },

            // month text style
            monthLabel: {
                show: true,

                // start end
                position: 'start',
                margin: 5,

                // center or left
                align: 'center',

                // cn en []
                nameMap: 'en',
                formatter: null,
                textStyle: {
                    color: '#000'
                }
            },

            // year text style
            yearLabel: {
                show: true,

                // top bottom left right
                position: null,
                margin: 30,
                formatter: null,
                textStyle: {
                    color: '#ccc',
                    fontFamily: 'sans-serif',
                    fontWeight: 'bolder',
                    fontSize: 20
                }
            }
        },

        /**
         * @override
         */
        init: function (option, parentModel, ecModel, extraOpt) {
            var inputPositionParams = layout.getLayoutParams(option);

            CalendarModel.superApply(this, 'init', arguments);

            mergeAndNormalizeLayoutParams(option, inputPositionParams);
        },

        /**
         * @override
         */
        mergeOption: function (option, extraOpt) {
            CalendarModel.superApply(this, 'mergeOption', arguments);

            mergeAndNormalizeLayoutParams(this.option, option);
        }
    });

    function mergeAndNormalizeLayoutParams(target, raw) {
        // Normalize cellSize
        var cellSize = target.cellSize;

        if (!zrUtil.isArray(cellSize)) {
            cellSize = target.cellSize = [cellSize, cellSize];
        }
        else if (cellSize.length === 1) {
            cellSize[1] = cellSize[0];
        }

        var ignoreSize = zrUtil.map([0, 1], function (hvIdx) {
            // If user have set `width` or both `left` and `right`, cellSize
            // will be automatically set to 'auto', otherwise the default
            // setting of cellSize will make `width` setting not work.
            if (layout.sizeCalculable(raw, hvIdx)) {
                cellSize[hvIdx] = 'auto';
            }
            return cellSize[hvIdx] != null && cellSize[hvIdx] !== 'auto';
        });

        layout.mergeLayoutParam(target, raw, {
            type: 'box', ignoreSize: ignoreSize
        });
    }

    return CalendarModel;

});
