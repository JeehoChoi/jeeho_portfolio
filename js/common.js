$(document).ready(function() {
    $(window).on('load', function() { // makes sure the whole site is loaded 
        $('body').addClass('loaded');
        var current = 1;  //현재(최초에) 보여지는 이미지의 숫자
        var maxNum = 6;  //최대 이미지
        var minNum = 1;  //최대 이미지
        var count = 1;
    
        var loading = setInterval(function () {
            current++;
            if (current > maxNum) current = minNum;
            $('#preload div img').attr('src', 'images/preload/load' + current + '.jpg');
            
            count++;
            if (count > 15) clearInterval(loading);
            $('#preload').delay(2000).fadeOut('fast'); //2000
        }, 100);
    })
    var logo = $("#header .logo");

    //about
    var $aboutCover = $('#aboutBtnCover');
    var $aboutBtn = $('#aboutBtn');
    var $about = $('#about')

    $aboutBtn.on('click', function () {
        if ($(this).hasClass('active')) {
            $about.stop().animate({right: '100%', left: 'auto'}, 300, function () {
                $(this).css({visibility: 'hidden'});
            });
            $aboutCover.stop().animate({right: 'auto', left: 90}).children().removeClass('active').find('sr-only').text('introduction');

        } else { //열기
            var $first = $about.find('[data-link="first"]');
            var $last = $about.find('[data-link="last"]');
            
            $(this).addClass('active').parent().stop().animate({right: 0, left: 'auto'}, 300).find('sr-only').text('back to home');

            $about.css({visibility: 'visible'}).stop().animate({right: 365, left: 'auto'}, 300, function () {
                $first.focus(); //대상 엘리먼트에 포커스를 강제로 이동
            });
            
            
            //첫번째 a 태그에서 shift+tab을 눌러 header의 영역으로 포커스가 이동하지 못하게 제한
            $first.on('keydown', function (e) {
                console.log(e.keyCode); //tab을 클릭하면 9를 반환
                if (e.shiftKey && e.keyCode == 9) {
                    e.preventDefault(); //포커스 이동을 강제로 제한
                    $last.focus(); //처음 포커스로 이동, #gnbWrap을 벗어나지 않고 순환됨
                }
            });
            //마지막 버튼 태그에서 tab을 눌러 container의 영역으로 포커스가 이동하지 못하게 제한
            $last.on('keydown', function (e) {
                if (!e.shiftKey && e.keyCode == 9) {
                    e.preventDefault();
                    $aboutBtn.focus();
                }
            });
        }
    });

    //portfolio
    var $win = $(window);
    var $cntWrap = $('#container .cnt_wrap');
    var tgIdx = $cntWrap.find('section').index();  //로딩시 보여지는 섹션의 인덱스 번호
    var total = $cntWrap.children().size(); //섹션의 전체 개수
    var winWidth;   //window의 가로크기를 저장할 전역변수
    var timerResize = 0; //resize이벤트의 실행문 누적을 방지 하기위해 clearTimeout()에서 호출
    var timerWheel = 0; //mousewheel 이벤트의 실행문 누적을 방지
    console.log(total, tgIdx);

    $win.on('resize', function () {
        clearTimeout(timerResize);

        timerResize = setTimeout(function () {
            winWidth = $win.width();
            $cntWrap.css('width', winWidth * total).children().css('width', winWidth);
        }, 100)
    });
    $win.trigger('resize');


    $cntWrap.on('mousewheel DOMMouseScroll', function (e) {
        
        var wheelDelta = e.originalEvent.wheelDelta;
		if(wheelDelta > 0){
			console.log("up");
			$(this).scrollLeft(-wheelDelta + $(this).scrollLeft());
		}else{
		    console.log("down");
			$(this).scrollLeft(-wheelDelta + $(this).scrollLeft());
		}

    });
});

