/*
* @Author: Administrator
* @Date:   2020-06-01 17:15:23
* @Last Modified by:   Administrator
* @Last Modified time: 2020-06-02 17:46:20
*/
$(function(){
	var curPage=1;
	var top=0;
	var left=0;
	var isWarter=false;//能否浇水
	var isClick=false;//能否点击其他土地
	var isFirst=localStorage.getItem('isFirst')||0;//0是第一次进来1不是;

	function guide(step){//引导过程函数
		switch(step){
			case 1:
				$(".guide01-pic").show();
				$(".guide02-pic").hide();
				$(".guide03-pic").hide();
				$(".guide04-pic").hide();
				$(".guide05-pic").hide();
				break;
			case 2:
				$(".guide01-pic").hide();
				$(".guide02-pic").show();
				$(".guide03-pic").hide();
				$(".guide04-pic").hide();
				$(".guide05-pic").hide();
				$(".seed-modal").show();
				break;
			case 3:
				$(".guide01-pic").hide();
				$(".guide02-pic").hide();
				$(".guide03-pic").show();
				$(".guide04-pic").hide();
				$(".guide05-pic").hide();
				$(".seed-modal").hide();
				break;
			case 4:
				$(".guide01-pic").hide();
				$(".guide02-pic").hide();
				$(".guide03-pic").hide();
				$(".guide04-pic").show();
				$(".guide05-pic").hide();
				break;
			case 5:
				$(".guide01-pic").hide();
				$(".guide02-pic").hide();
				$(".guide03-pic").hide();
				$(".guide04-pic").hide();
				$(".guide05-pic").show();
				break;
			case 6:
				$(".guide01-pic").hide();
				$(".guide02-pic").hide();
				$(".guide03-pic").hide();
				$(".guide04-pic").hide();
				$(".guide05-pic").hide();
				$(".guide-modal").hide();
				localStorage.setItem('isFirst',1);
				break;
			default:
				break;
		}
	}
	if(isFirst==0){
		$(".guide-modal").show();
		guide(1);
	}
	
	$(".guide01-pic").click(function(){
		guide(2);
	})
	$(".guide02-pic").click(function(){
		guide(3);
	})
	$(".guide03-pic").click(function(){
		guide(4);
	})
	$(".guide04-pic").click(function(){
		guide(5);
	})
	$(".guide05-pic").click(function(){
		guide(6);
	})



	$('.pagination').pagination({
    	mode: 'fixed',
    	totalData: 50,
	    showData: 5,
	    callback: function (api) {
        	curPage=api.getCurrent();
        	console.log(curPage)
    	}
	});

	function initLand(){//初始化田地布局
		var docH=$(window).height();
		if(docH>750){//兼容全面屏手机
			$(".bottom-btns").css({bottom:'23rem'})
		}
		$(".land").each(function(index, ele) {
			var w=11.9;
			var h=7.7;
			var baseLeft=13.8;
			var baseTop=1.2;
			switch (index) {
				case 0:
					$(ele).css({left:baseLeft+'rem',top:baseTop+'rem'})
					break;
				case 1:
					$(ele).css({left:((0.65*w)+baseLeft)+'rem',top:(baseTop+(0.65*h))+'rem'})
					break;
				case 2:
					$(ele).css({left:(baseLeft-(0.65*w))+'rem',top:(baseTop+(0.6*h))+'rem'})
					break;
				case 3:
					$(ele).css({left:baseLeft+'rem',top:(baseTop+(1.22*h))+'rem'})
					break;
				case 4:
					$(ele).css({left:((0.65*w)+baseLeft)+'rem',top:(baseTop+(1.84*h))+'rem'})
					break;
				case 5:
					$(ele).css({left:(baseLeft-(0.65*w))+'rem',top:(baseTop+(1.85*h))+'rem'})
					break;
				case 6:
					$(ele).css({left:(baseLeft)+'rem',top:(baseTop+(2.47*h))+'rem'})
					break;
				case 7:
					$(ele).css({left:(baseLeft-(0.68*w))+'rem',top:(baseTop+(3*h))+'rem'})
					break;
				case 8:
					$(ele).css({left:baseLeft+'rem',top:(baseTop+(3.62*h))+'rem'})
					break;
				default:
				break;
			}
		});
	}

	initLand();

	/**浇水 */
	$("#kettle").click(function(e){
		e.stopPropagation();
		if(!isWarter){
			isWarter=true;
			isClick=true;
			left=32.8;
			top=55;
			$(this).css({transform:'translate(-20px,-50px) rotate(-30deg)',transition:'.3s'})
			$("#kettleDown").fadeIn(300);
		}
	})

	// $(".water-block").click(function(e){
	// 	e.preventDefault();
	// 	hideKettle();
	// });
	// $("#kettleDown").click(function(e){
	// 	hideKettle();
	// })

	function hideKettle(){
		$("#kettle").css({transform:'translate(0px,0px) rotate(0deg)',transition:'.3s',
		left:0,top:0,background:'url(./images/shuihu.png)','background-size':'100% 100%'});
		$("#kettleDown").fadeOut(300);
		isWarter=false;
	}

	$(".land").click(function(e){
		// e.preventDefault();
		e.stopPropagation();
		var index=$(this).index();
		var curL=0,curT=0;
		switch(index){
			case 0 :
				curL=19.5;
				curT=19.4;
				break;
			case 1 :
				curL=27.5;
				curT=24.4;
				break;
			case 2 :
				curL=11.6;
				curT=23.5;
				break;
			case 3 :
				curL=19.5;
				curT=28.8;
				break;
			case 4 :
				curL=27.5;
				curT=33.6;
				break;
			case 5 :
				curL=11.6;
				curT=33.5;
				break;
			case 6 :
				curL=19.5;
				curT=38;
				break;
			case 7 :
				curL=11.6;
				curT=42.3;
				break;
			case 8 :
				curL=19.5;
				curT=47.2;
				break;
			default:
				break;
		}
		if(isWarter&&isClick){
			var absL=left-curL-2;
			var absT=top-curT+1;
			$("#kettle").css({'left':-absL+'rem','top':-absT+'rem','background':'url(./images/jiaoshui.gif)',
			'background-size':'100% 100%',transform:'rotate(-10deg)', transition:'.3s'});
			isClick=false;
			setTimeout(function(){
				hideKettle();
			},1200)
		}
		
	})

	var data = [
		{
			"value":"0.9",
			"color":"rgba(255,255,255,.6)",
		},
		{
			"value":"0.1",
			"color":"transparent",
		}
	];
	/*浇水饼状图*/
	function drawPie(data){
	   var canvas = document.getElementById("canvas");
	   var w=$("#canvas").width();
	   canvas.width = w;//设置canvas宽
       canvas.height = w;//设置canvas高
        //获取上下文
       var ctx = canvas.getContext("2d");
       //画图
        var x0  = w/2,y0 = w/2;//圆心
        var radius = w/2;
        var tempAngle = -90;//画圆的起始角度
		for(var i = 0;i<data.length;i++){
            var startAngle = tempAngle*Math.PI/180;//起始弧度
            var angle = data[i].value*360;
            var endAngle = (tempAngle+angle)*Math.PI/180;//结束弧度
            ctx.beginPath();
            ctx.moveTo(x0,y0);
            ctx.fillStyle = data[i].color;
            ctx.arc(x0,y0,radius,startAngle,endAngle);
            ctx.fill();
            tempAngle += angle;
        }
	}
	drawPie(data);

	/*打开弹窗*/
	function openModal(el){
		$(el).fadeIn(200);
	}
	/*关闭弹窗*/
	function closeModal(el){
		$(el).fadeOut(200);
	}
	/**打开种子商店弹窗 */
	$(".purchase").click(function(){
		openModal(".seed-modal");
	})
	/**关闭种子商店弹窗 */
	$(".seed-close-btn").click(function(){
		closeModal(".seed-modal");
	})

	/**关闭金币不足弹窗 */
	$(".coin-close-btn").click(function(){
		closeModal(".coin-modal");
	})

	/**关闭水果券弹框 */
	$(".ticket-close-btn").click(function(){
		closeModal(".ticket-modal");
	})

	/**关闭邀请好友解锁土地弹框 */
	$(".invite-close-btn").click(function(){
		closeModal(".invite-modal");
	})

	/**关闭购买种子弹框 */
	$(".buy-close-btn").click(function(){
		closeModal(".buy-modal");
	})

	/**关闭看视频收获水果弹框 */
	$(".video-close-btn").click(function(){
		closeModal(".video-modal");
	})

	/**关闭确认购买种子弹窗 */
	$(".purchase-close-btn").click(function(){
		closeModal(".purchase-modal");
	})
	
})