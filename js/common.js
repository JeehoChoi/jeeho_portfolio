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
    var $aboutCnt = $('#aboutCover');
    var $aboutBtn = $('#aboutBtn');
    var $about = $('#about')
    var aboutsize = $about.width();

    $aboutBtn.on('click', function () {
        if ($(this).hasClass('active')) {
            $about.css({visibility: 'hidden'});
            $aboutCnt.stop().animate({left: 'auto', right: Number(aboutsize)-80}).children($aboutBtn).removeClass('active').find('sr-only').text('자기소개');

        } else { //열기
            var $first = $about.find('[data-link="first"]');
            var $last = $about.find('[data-link="last"]');
            
            $(this).addClass('active').parent($aboutCnt).stop().animate({right: 0, left: 'auto'}, 300).find('sr-only').text('홈화면 돌아가기');

            $about.css({visibility: 'visible'})
            $first.focus(); //대상 엘리먼트에 포커스를 강제로 이동
            
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

    $aboutCnt.on({
        mouseenter: function () {
            $(this).find(':before').addClass('on');
        },
        mouseleave: function () {
            $(this).find(':before').removeClass('on');
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


    /* 
    
    //accordion
    var $Acco = $('#huAcco');

    //1) 초기설정
    $Acco.find('.tit button').attr('aria-expanded', false);
    $Acco.find('.accopanel').attr('aria-hidden', true);

    //2) 키보드 제어 : 왼쪽37, 오른쪽39, home36, end35, enter13 와 spacebar32 
    $Acco.find('.tit button').on('keydown', function (e) {
        var key = e.keyCode;
        console.log(key);
        switch (key) {
            case 37:    //왼쪽방향키 : article로 둘러싸여 parent() X
                if ($(this).hasClass('first')) $Acco.find('.tit .last').focus();
                else $(this).closest('.work').prev().find('.tit button').focus();
                break;
            case 39:    //오른쪽 방향키 : article로 둘러싸여 parent() X
                if ($(this).hasClass('last')) $Acco.find('.tit .first').focus();
                else $(this).closest('.work').next().find('.tit button').focus();
                break;
            case 36:    //home키
                $Acco.find('.tit .first').focus();
                break;
            case 35:    //end키
                $Acco.find('.tit .last').focus();
                break;
            case 13:    //enter
            case 32:    //spacebar
                //나자신이 열려진 경우는 닫기만 처리
                if ($(this).closest('.work').hasClass('on')) {
                    var $tg = $(this).closest('.work');
                    offExpand($tg);
                }
                else {
                    //다른 아코디언 하나가 열려진 상태
                    if ($Acco.children().hasClass('on')) {
                        var $tg = $Acco.children('.on');
                        offExpand($tg);
                    }
                    //아코디언이 하나도 열려지지 않은 상태
                    var $tg = $(this).closest('.work'); //keydown 버튼의 부모인 article
                    onExpand($tg);
                }
            break;     
        }
    });

    //3) 마우스 제어 : article에 마우스 진입과 이탈
    $Acco.children().on({
        mouseenter: function () {
            var $tg = $(this); //마우스가 진입한 article
            onExpand($tg);     //선택한 article 태그를 매개변수로 호출
        },
        mouseleave: function () {
            var $tg = $(this); //마우스가 이탈한 article
            offExpand($tg);     //선택한 article 태그를 매개변수로 호출
        }
    });

    //확장되어 열리기
    function onExpand($target) {
        //console.log($target); //마우스가 진입한 article
        //1) 동영상을 호출해서 play(), 선택하는 요소를 배열로 반환 get(), 동영상 실행 play()
        $target.find('video').get(0).play(); //아직은 투명도 0이므로 보여지지 않는다
        //2) #Acco 가로 48%에서 72%로 animate()
        $Acco.stop().animate({width: '72%'});
        //3) 선택한 article.on 추가 => 가로 25%에서 50%로 animate()
        //4) 나머지 article 가로 16.666667%
        $target.addClass('on').stop().animate({width: '50%'}, function () {
            $(this).find('video').stop().animate({opacity: 0.9}).next().css('display', 'block').stop().animate({right: 10}).attr('tabIndex', 0);
        }).siblings().stop().animate({width: '16.666667%'});
        
        //접근성 추가 : 아코디언 헤더, 아코디언 패널
        $target.find('.tit button').attr({'aria-expanded': true, 'aria-disabled':true});
        
        $target.find('.accopanel').attr({'aria-hidden': false});
    }
    //축소되어 닫기기
    function offExpand($target) {
        console.log($target.index()); //마우스가 이탈한 article
        //1) 동영상을 호출해서 play(), 선택하는 요소를 배열로 반환 get(), 동영상 일시정지 pause()
        $target.find('video').get(0).pause();
        //2) 선택한 article.on 제거 => #Acco 가로 72%에서 48%로 animate()
        $target.removeClass('on').parent().stop().animate({width: '48%'});
        //3)  => 가로 50%에서 25%로 animate(), 나머지 article 가로 25% =>>> 4개의 article 모두
        $Acco.children().stop().animate({width: '25%'});
        //4) 비디오 투명도 0, 텍스트박스 -310 => 완료후 display: none
        $target.find('video').stop().animate({opacity: 0}).next().stop().animate({right: -310}, 'fast', function () {
            $(this).css('display', 'none').attr('tabIndex', -1);
        });
        
        //접근성 추가 : 아코디언 헤더, 아코디언 패널
        $target.find('.tit button').attr({'aria-expanded': false}).removeAttr('aria-disabled');
        
        $target.find('.accopanel').attr({'aria-hidden': true});
    }
    */
});

