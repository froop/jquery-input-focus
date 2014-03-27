/// <reference path="jquery.inputfocus.ts" />

module ExampleMain {

    $("#form1").inputFocus({
        enter : true,
        tab : true,
        upDown : true,
        leftRight : true,
        focusFirst : true
    });

    $("#single-input-form").inputFocus({
        enter : true
    }).css({
        backgroundColor : "lightgray"
    });

    $("#focus-link").on("click", function () {
        $('#single-input-form')
            .inputFocusFirst()
            .css({
                backgroundColor: "yellow"
            });
    });

    $("#empty-form").inputFocusFirst();
}
