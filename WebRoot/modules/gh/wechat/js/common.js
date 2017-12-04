

function bindGalleryEvent() {
    if (!document.getElementById('pagenavi') || !document.getElementById('pagenavi').getElementsByTagName('a')) return false;
    var active = 0,
    as = document.getElementById('pagenavi').getElementsByTagName('a');
    for (var i = 0; i < as.length; i++) { (function() {
            var j = i;
            as[i].onclick = function() {
                t2.slide(j);
                return false;
            }
        })();
    }
    var t2 = new TouchSlider({
        id: 'slider',
        speed: 600,
        timeout: 6000,
        before: function(index) {
            as[active].className = '';
            active = index;
            as[active].className = 'active';
        }
    });
    var t2 = new TouchSlider({
        id: 'slider2',
        speed: 600,
        timeout: 6000,
        before: function(index) {
            as[active].className = '';
            active = index;
            as[active].className = 'active';
        }
    });
}
bindGalleryEvent();
