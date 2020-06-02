/*
* @Author: Administrator
* @Date:   2020-06-01 17:15:23
* @Last Modified by:   Administrator
* @Last Modified time: 2020-06-02 17:35:21
*/
$(function(){
	var curPage=1;

	// $('.pagination').pagination({
 //    	mode: 'fixed',
 //    	totalData: 50,
	//     showData: 5,
	//     callback: function (api) {
 //        	curPage=api.getCurrent();
 //        	console.log(curPage)
 //    	}
	// });

	function initLand(){//初始化田地布局
		$(".land").each(function(index, ele) {
			var w=(($(ele).width())*1.42)/10;
			
			switch (index) {
				case 0:
				$(ele).css({left:0,top:0})
				break;
				case 1:
				$(ele).css({left:0.6*w+'rem',top:0.6*w+'rem'})
				break;
				case 2:
				$(ele).css({left:-0.6*w+'rem',top:0.6*w+'rem'})
				break;
				case 3:
				$(ele).css({left:0,top:1.2*w+'rem'})
				break;
				case 4:
				$(ele).css({left:0.6*w+'rem',top:1.8*w+'rem'})
				break;
				case 5:
				$(ele).css({left:-0.6*w+'rem',top:1.8*w+'rem'})
				break;
				case 6:
				$(ele).css({left:0,top:2.4*w+'rem'})
				break;
				case 7:
				$(ele).css({left:-0.6*w+'rem',top:3*w+'rem'})
				break;
				case 8:
				$(ele).css({left:0,top:3.6*w+'rem'})
				break;
				default:
				break;
			}
		});
	}

	initLand();
})