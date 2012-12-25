/*
 * jquery.inputfocus.js - jQuery plugin.
 *
 * Modified by froop http://github.com/froop
 * Created by Hidepyon http://d.hatena.ne.jp/Hidepyon/
 *   See: http://d.hatena.ne.jp/Hidepyon/20090903/1251988911
 *
 * The MIT License (http://www.opensource.org/licenses/mit-license.php)
 */
(function($){
	function findNextFocusByIndex($inputs, shift, baseIdx) {
		var ln = $inputs.length;
		//フォーカスを取得できないものは飛ばす
		var mv = (shift ? -1 : 1);
		var j = (ln + baseIdx + mv) % ln;
		var guard = j; //無限ループ防止
		function isFocusable($input) {
			return $input.is(":visible") &&
				$input.is(":enabled") &&
				$input.css("visibility") != "hidden" &&
				$input.attr("tabindex") != -1;
		}
		if (ln === 0) {
			return null;
		}
		while(true){
			var $input = $($inputs[j]);
			if	(isFocusable($input)) {
				//対象のオブジェクトを戻す
				return $input;
			}
			j = (j + mv + ln) % ln;
			if (j === guard) {
				return null;
			}
		}
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

	$.fn.inputFocus = function(options){
		var defaults = {
			"enter":false
			,"tab":false
			,"focusFirst":false
		};
		var setting = $.extend(defaults,options);
		var $inputs = $(":input", this);

		$(this).on("keydown", function (e) {
			var findNextFocusOnKeydown = function(shift) {
				//フォームオブジェクトが何番目か探す
				var ln = $inputs.length;
				var i;
				for (i = 0; i < ln; i++) {
					if ($inputs[i] == e.target) break;
				}
				return findNextFocusByIndex($inputs, shift, i);
			};
			var	k	=	e.keyCode;
			var	s	=	e.shiftKey;
			var	$next	=	null;
			var blKey	=	true;
			if (!setting.enter && k == 13) return true;
			if (!setting.tab && k == 9) return true;
			switch(k){
				case 13:
					switch(e.target.type){
					case"file":case"textarea":
						blKey = true;
						break;
					default:
						blKey = false;
						break;
					}
					//keyイベントを処理するもののみ抽出
					if (!blKey){
						//次のフォームオブジェクト探す
						$next = findNextFocusOnKeydown(s);
					}
				break;
				case 9:		//tab
					switch(e.target.type){
					case"file":
						blKey = true;
						break;
					default:
						//次のフォームオブジェクト探す
						$next = findNextFocusOnKeydown(s);
						blKey = false;
						break;
					}

				break;
			}

			if(!blKey && $next){
				//イベントを伝播しない
				if($.browser.msie) {
					//次フォーカスがtext以外だと選択範囲の青色が残るため解除
					if (e.target.type === "text") {
						function deselectTextForIE() {
							var range = e.target.createTextRange();
							range.moveStart("character", $(e.target).val().length);
							range.select();
						}
						deselectTextForIE();
					}

					//IE規定の動作キャンセル(beep音)
					window.event.keyCode = 0;
				}
				focus($next);
			}
			return blKey;
		});

		if (setting.focusFirst) {
			focusFirst(this);
		}
	};

	$.fn.inputFocusFirst = function () {
		focusFirst(this);
	};
})(jQuery);
