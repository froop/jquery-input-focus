/*
* jquery.inputfocus.js - jQuery plugin.
*
* Modified by froop http://github.com/froop/jquery-input-focus
* Created by Hidepyon http://d.hatena.ne.jp/Hidepyon/
*   See: http://d.hatena.ne.jp/Hidepyon/20090903/1251988911
*
* Copyright (c) 2011 Hidepyon
* Copyright (c) 2012-2014 froop
* The MIT License (http://www.opensource.org/licenses/mit-license.php)
*/
/*global jQuery, window */
/// <reference path="d.ts/jquery.d.ts" />
(function ($) {
    "use strict";

    var KEY_TAB = 9, KEY_ENTER = 13, KEY_LEFT = 37, KEY_UP = 38, KEY_RIGHT = 39, KEY_DOWN = 40;

    // http://d.hatena.ne.jp/tubureteru/20110101/p1
    function getCaretPos(item) {
        var caretPos = 0;
        if (document.selection) {
            // IE
            item.focus();
            var Sel = document.selection.createRange();
            Sel.moveStart("character", -item.value.length);
            caretPos = Sel.text.length;
        } else if (item.selectionStart || item.selectionStart === 0) {
            // Firefox, Chrome
            caretPos = item.selectionStart;
        }
        return caretPos;
    }

    function isFocusable($input) {
        return $input.is(":visible") && $input.is(":enabled") && $input.css("visibility") !== "hidden" && $input.attr("type") != "hidden" && $input.attr("tabindex") !== "-1" && !$input.prop("readonly");
    }

    function findNextFocusByIndex($inputs, reverse, loop, baseIdx) {
        var ln = $inputs.length, j, guard;

        if (ln === 0) {
            return null;
        }

        function toNextIndex(before) {
            var mv = (reverse ? -1 : 1);
            var next = before + mv;
            if (next >= 0 && next < ln) {
                return next;
            } else if (loop) {
                return (ln + before + mv) % ln;
            } else {
                return before;
            }
        }

        j = toNextIndex(baseIdx);
        guard = j;
        do {
            var $input = $($inputs[j]);
            if (isFocusable($input)) {
                //対象のオブジェクトを戻す
                return $input;
            }
            j = toNextIndex(j);
        } while(j !== guard);

        //対象オブジェクトなし
        return null;
    }

    function focus($target) {
        // 移動先でkeydownが起こらないようにsetTimeoutする。Firefoxのみの問題
        setTimeout(function () {
            $target.focus();
            if ($target.select && !$target.is(":button")) {
                $target.select();
            }
        }, 0);
    }

    function focusFirst($parent) {
        var $first = findNextFocusByIndex($(":input", $parent), false, true, -1);
        if ($first) {
            focus($first);
        }
    }

    $.fn.inputFocus = function (options) {
        var $elements = this;
        var defaults = {
            "enter": false,
            "tab": false,
            "upDown": false,
            "leftRight": false,
            "focusFirst": false,
            "loop": true
        };
        var setting = $.extend(defaults, options);

        $elements.on("keydown", function (event) {
            var $inputs = $(":input", $elements), keyCode = event.keyCode, shiftKey = event.shiftKey, target = event.target, type = target.type, $next = null;

            // 次のフォーカス可能要素を探す
            function findNextFocusOnKeydown() {
                var reverse = shiftKey || keyCode === KEY_LEFT || keyCode === KEY_UP;
                var ln = $inputs.length;
                var i;
                for (i = 0; i < ln; i++) {
                    if ($inputs[i] === target) {
                        break;
                    }
                }
                return findNextFocusByIndex($inputs, reverse, setting.loop, i);
            }

            function isMoveFocus() {
                function isKeyUpDown() {
                    return keyCode === KEY_UP || keyCode === KEY_DOWN;
                }
                function isKeyLeftRight() {
                    return keyCode === KEY_LEFT || keyCode === KEY_RIGHT;
                }

                function isMoveFocusKey() {
                    if (setting.enter && keyCode === KEY_ENTER) {
                        return true;
                    }
                    if (setting.tab && keyCode === KEY_TAB) {
                        return true;
                    }
                    if (setting.upDown && isKeyUpDown()) {
                        return true;
                    }
                    if (setting.leftRight && isKeyLeftRight()) {
                        return true;
                    }
                    return false;
                }

                // 現フォーカス要素がフォーカス移動に対応するか
                function isMoveFocusField() {
                    if (!$(target).is(":input")) {
                        return false;
                    }
                    if (type === "file") {
                        return false;
                    }
                    if (type === "textarea" && keyCode !== KEY_TAB) {
                        return false;
                    }
                    if ((type === "select-one" || type === "select-multiple") && isKeyUpDown()) {
                        return false;
                    }
                    if (type === "text" || type === "password") {
                        if (keyCode === KEY_LEFT && getCaretPos(target) !== 0) {
                            return false;
                        }
                        if (keyCode === KEY_RIGHT && getCaretPos(target) !== $(target).val().length) {
                            return false;
                        }
                    }
                    return true;
                }

                return isMoveFocusKey() && isMoveFocusField();
            }

            if (isMoveFocus()) {
                //次のフォームオブジェクト探す
                $next = findNextFocusOnKeydown();
            }
            if (!$next) {
                return true;
            }

            //IEのみ問題回避
            if (navigator.userAgent.match(/MSIE/i)) {
                //次フォーカスがtext以外だと選択範囲の青色が残るため解除
                if (type === "text" || type === "password") {
                    var deselectTextForIE = function () {
                        var range = target.createTextRange();
                        range.moveStart("character", $(target).val().length);
                        range.select();
                    };
                    deselectTextForIE();
                }

                //IE規定の動作キャンセル(beep音)
                window.event.keyCode = 0;
            }

            focus($next);

            //イベントを伝播しない
            return false;
        });

        if (setting.focusFirst) {
            focusFirst($elements);
        }

        return this;
    };

    $.fn.inputFocusFirst = function () {
        var $elements = this;
        focusFirst($elements);
        return this;
    };
})(jQuery);
//# sourceMappingURL=jquery.inputfocus.js.map
