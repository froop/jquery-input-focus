jquery-input-focus - jQuery plugin
====================

入力可能なform系要素 (inputやselectなど) 間のフォーカス移動を制御する。

* 先頭オブジェクトにフォーカス設定
* Enterまたは矢印キーで次オブジェクトにフォーカス移動
* Shift+Enterキーで逆方向に移動

Hidepyonさん (http://d.hatena.ne.jp/Hidepyon/) が下記で公開しているコードがベース  
http://d.hatena.ne.jp/Hidepyon/20090903/1251988911


inputFocus
--------------------
入力フォーカスの移動方法を登録する。パラメーターで渡すオプションは以下の通り。

#### enter
`true` の場合、Enter キーでフォーカスを次の項目へ移動する。
Shift キーと同時押しの場合は前の項目へ移動する。
デフォルトは `false`

#### tab
`true` の場合、ブラウザのデフォルトの Tab キー動作を無効とし、上記 Enter キーと同じ動作をする。
デフォルトは `false`

#### upDown
`true` の場合、矢印キーの上下でフォーカスを移動する。
デフォルトは `false`

#### leftRight
`true` の場合、矢印キーの左右でフォーカスを移動する。
デフォルトは `false`

#### focusFirst
`true` の場合、初期状態でフォーカスを先頭項目に設定する。
デフォルトは `false`

#### loop
`true` の場合、最終項目の次に先頭項目へ移動する。
デフォルトは `true`


inputFocusFirst
--------------------
先頭項目に入力フォーカスを設定する。
