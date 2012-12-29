/*
 * jquery.inputfocus.js - jQuery plugin.
 *
 * Modified by froop http://github.com/froop/jquery-input-focus
 * Created by Hidepyon http://d.hatena.ne.jp/Hidepyon/
 *   See: http://d.hatena.ne.jp/Hidepyon/20090903/1251988911
 *
 * The MIT License (http://www.opensource.org/licenses/mit-license.php)
 */
/*global jQuery, window */
(function ($) {
	"use strict";

	function isFocusable($input) {
		return $input.is(":visible") &&
			$input.is(":enabled") &&
			$input.css("visibility") !== "hidden" &&
			$input.attr("tabindex") !== "-1";
	}

	function findNextFocusByIndex($inputs, shift, baseIdx) {
		var ln = $inputs.length,
			j, guard;

		if (ln === 0) {
			return null;
		}

		function toNextIndex(before) {
			var mv = (shift ? -1 : 1);
			return (ln + before + mv) % ln;
		}

		guard = toNextIndex(baseIdx);
		j = baseIdx;
		while ((j = toNextIndex(j)) !== guard) {
			var $input = $($inputs[j]);
			if	(isFocusable($input)) {
				//対象のオブジェクトを戻す
				return $input;
			}
		};
		//対象オブジェクトなし
		return null;
	}

	function focus($target) {
		$target.focus();
		if ($target.select && !$target.is(":button")) {
			$target.select();
		}
	}

	function focusFirst($parent) {
		var $first = findNextFocusByIndex($(":input", $parent), false, -1);
		if ($first) {
			focus($first);
		}
	}

	$.fn.inputFocus = function (options) {
		var $elements = this;
		var defaults = {
			"enter" : false,
			"tab" : false,
			"focusFirst" : false
		};
		var setting = $.extend(defaults, options);
		var $inputs = $(":input", $elements);

		$elements.on("keydown", function (event) {
			var keyCode = event.keyCode,
				shiftKey = event.shiftKey,
				target = event.target,
				type = target.type,
				$next = null;

			// 次のフォーカス可能要素を探す
			function findNextFocusOnKeydown() {
				var ln = $inputs.length;
				var i;
				for (i = 0; i < ln; i++) {
					if ($inputs[i] === target) {
						break;
					}
				}
				return findNextFocusByIndex($inputs, shiftKey, i);
			}

			function isMoveFocus() {
				var KEY_ENTER = 13,
					KEY_TAB = 9;

				function isMoveFocusKey() {
					if (setting.enter && keyCode === KEY_ENTER) {
						return true;
					}
					if (setting.tab && keyCode === KEY_TAB) {
						return true;
					}
					return false;
				}

				// 現フォーカス要素がenter/tabキーによるフォーカス移動に対応するか
				function isMoveFocusField() {
					if (!$(target).is(":input")) {
						return false;
					}
					if (type === "file") {
						return false;
					}
					if (type === "textarea" && keyCode === KEY_ENTER) {
						return false;
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
			if($.browser.msie) {
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
