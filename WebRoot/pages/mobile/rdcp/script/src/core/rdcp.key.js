rdcp.key = {
    onEnterPress: []
}

rdcp.key.enter = function (onPress) {
    rdcp.key.onEnterPress.push(onPress);

    $(document).keypress(function (e) {
        if (e.which == 13) {
            rdcp.each(rdcp.key.onEnterPress, function (i) {
                rdcp.key.onEnterPress[i]();
            });
        }
    });
}