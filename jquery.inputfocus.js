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
	function findNextCanFocus($inputs, shift, baseIdx) {
		var ln = $inputs.length;
		//フォーカスを取得できないものは飛ばす
		var mv = (shift?-1:1);
		var j = (ln+baseIdx+mv) % ln;
		function isFocusable(Fo) {
			var Fs = Fo.style;
			return Fo.type!="hidden" &&
				!Fo.disabled &&
				Fo.tabIndex!=-1 &&
				Fs.visibility!="hidden" &&
				Fs.display!="none";
		}
		while(true){
			if	(isFocusable($inputs[j])){
				//対象のオブジェクトを戻す
				return $($inputs[j]);
			}
			j=(j+mv+ln) % ln;
		}
		//Hitしない場合
		return $inputs.eq(i);
	}

	function focus($target) {
		$target.focus();
		if ($target.select && !$target.is(":button")) {
			$target.select();
		}
	}

	function focusFirst($parent) {
		var $first = findNextCanFocus($(":input", $parent), false, -1);
		focus($first);
	}

	$.fn.inputFocus = function(options){
		var defaults = {
			"enter":false
			,"tab":false
			,"focusFirst":false
		};
		var setting = $.extend(defaults,options);
		var $inputs = $(":input", this);
		var method = function(e){

			var Focus_Move = function(shift){
				//フォームオブジェクトが何番目か探す
				var ln = $inputs.length;
				var i;
				for (i=0;i<ln;i++){
					if ($inputs[i]==e.target) break;
				}
				return findNextCanFocus($inputs, shift, i);
			};
			var	k	=	e.keyCode;
			var	s	=	e.shiftKey;
			var	next	=	null;
			var blKey	=	true;
			if (!setting.enter&&k==13) return true;
			if (!setting.tab&&k==9) return true;
			switch(k){
				case 13:
					switch(e.target.type){
					case"button":
						blKey = false;
						break;
					case"file":case"textarea":
						blKey = true;
						break;
					case"radio":case"checkbox":
//						setTimeout(function(){e.target.click();},1)
//						blKey = true;
//						break;
					case"text":case"select-one":case"select-multiple":
						blKey = false;
						break;
					default:
						blKey = false;
						break;
					}
					//keyイベントを処理するもののみ抽出
					if (!blKey){
						//次のフォームオブジェクト探す
						next = Focus_Move(s);
					}
				break;
				case 9:		//tab
					switch(e.target.type){
					case"file":
						blKey = true;
						break;
					default:
						//次のフォームオブジェクト探す
						next = Focus_Move(s);
						blKey = false;
						break;
					}

				break;
			}

			if(!blKey){
				//イベントを伝播しない
				//IE規定の動作キャンセル(beep音)
				if($.browser.msie) {
					window.event.keyCode = 0;
				}
				focus(next);
			}
			return blKey;
		};

		$(this).on("keydown", function(e){
			var ret = method(e);
			return ret;
		});

		if (setting.focusFirst) {
			focusFirst(this);
		}
	};

	$.fn.inputFocusFirst = function () {
		focusFirst(this);
	};
})(jQuery);
