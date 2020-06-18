/*
* @Author: Administrator
* @Date:   2020-06-01 17:15:23
* @Last Modified by:   Administrator
* @Last Modified time: 2020-06-15 21:07:09
*/

	var curPage=1;
	var isWarter=false;//能否浇水
	var isClick=false;//能否点击其他土地
	var isFirst=window.localStorage.getItem('isFirst')||0;//0是第一次进来1不是;
	var isWarting=false;//是否正在浇水;
	var farmType=1;//1是果场，2是菜场;
	var uid="";
	var token="";
	var totaNums=0;//种子商店总条数
	var curTimes=Date.now();//当前时间毫秒数；
	var seedId;//购买的种子Id;
	var farmDatas=[];//土地初始数据;
	var curFarmId=0;//当前收获水果的土地Id
	var Top=0;
	var Left=0;
	var totalCoin=0;//自己总的金币

	uid=getRequest().uid;
	token=getRequest().token;
	
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
				break;
			case 3:
				$(".guide01-pic").hide();
				$(".guide02-pic").hide();
				$(".guide03-pic").show();
				$(".guide04-pic").hide();
				$(".guide05-pic").hide();
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
				window.localStorage.setItem('isFirst',1);
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

	$(".foodgrocery").click(function(){//农场类型切换
		$(".load-modal").fadeIn(200);
		if(farmType==1){//农场时请求农场的数据
			farmType=2;
			$("#framType").attr('src','./images/nongcang.png');
		}else{//菜场时请求菜场的数据;
			farmType=1;
			$("#framType").attr('src','./images/caicang.png');
		}
		initGame(function(){//这里面执行初始化后的异步操作；
			setTimeout(function(){
				buyOperate();
				operate();
			},500)
		});
		hideKettle();
		
	})

	
	function fetchList(type,callback){//获取土地列表
		var postData={
			url:'/api/farm/FarmList',
			datas:{
				uid:uid,
				token:token,
				type:type
			}
		}
		requestFunc(postData,function(data){
			if(data.code==200){
				var result=data.data;
				farmDatas=[];
				farmDatas=farmArr.slice(0, farmArr.length);
				for (var i=0;i<farmDatas.length;i++){
					for(var j=0;j<result.length;j++){
						if(farmDatas[i].field_num==result[j].field_num){
							result[j].fieldNumber=farmDatas[i].fieldNumber;
							farmDatas[i]=result[j];
							farmDatas[i].is_lock=1;
						}
					}
				}
				callback&&callback(farmDatas)
				
			}else{
				toggleModal(data.message)
			}
		})
	}

	function fetchShop(page){//获取种子商店列表
		var postData={
			url:'/api/farm/SeedList',
			datas:{
				uid:uid,
				token:token,
				page:page,
				type:farmType
			}
		}
		requestFunc(postData,function(data){
			if(data.code==200){
				var result=data.data;
				var list=data.data.data;
				totaNums=result.total;
				var html="";
				list=list.filter(function(item,index) {
					return item.time*1000>curTimes;
				});
				list.forEach(function(ele,index) {
					var lastTimes="";
					var seedTimes=ele.time*1000;
					lastTimes=Math.ceil((seedTimes-curTimes)/(1000*86400));
					html+='<li>'+
							'<div class="seed-icon"><img src="'+ele.pic+'" alt=""></div>'+
							'<span class="seed-name">'+ele.name+'</span>'+
							'<div class="last-times-wraps">剩余：<span class="last-times">'+lastTimes+'</span>天</div>'+
							'<div class="cost-wraps" seedPic="'+ele.pic+'" seedId="'+ele.seed_id+'" seedName="'+ele.name+'"><span class="seed-cost">'+ele.gold+'</span>金币</div>'+
						'</li>'
				});
				$(".seed-list1").html(html);
			}else{
				toggleModal(data.message);
			}
		})
	}
	function buyOperate(){//购买种子点击回调
			$('.pagination').pagination({
		    	mode: 'fixed',
		    	totalData: totaNums,
			    showData: 5,
			    callback: function (api) {
		        	curPage=api.getCurrent();
		        	fetchShop(curPage);
		    	}
			});
			
		$(".seed-list").on('click','.cost-wraps',function(){
			closeModal(".seed-modal");
			var seedPic=$(this).attr('seedPic');
			var seedName=$(this).attr('seedName');
			var costGold=$(this).text();
			 seedId=$(this).attr('seedId');
			$("#seedIcon").attr('src',seedPic);
			$(".cost-coin").text(costGold);
			$(".fruit-name").text(seedName);
			openModal(".purchase-modal");

		})
	}
	function buySeed(seedId){//确定购买种子并播种
		var postData={
			url:'/api/farm/BuySeed',
			datas:{
				uid:uid,
				token:token,
				seed_id:seedId
			}
		}

		requestFunc(postData,function(data){
			if(data.code==200){
				$("#seedIcon").attr('src',"");
				$(".cost-coin").text("");
				$(".fruit-name").text("");
				$(".surelBtn").removeAttr('disabled');
				initGame();
			}else if(data.code==201){
				$(".surelBtn").removeAttr('disabled');
				$(".invite-modal").fadeIn(200);
			}else if(data.code==202){
				$(".surelBtn").removeAttr('disabled');
				$(".coin-modal").fadeIn(200);
			}
		})
	}

	function warting(framId,callback){//浇水
		var postData={
			url:'/api/farm/Watering',
			datas:{
				uid:uid,
				token:token,
				farm_id:framId
			}
		}

		requestFunc(postData,function(data){
			if(data.code==200){
				callback&&callback();
			}else if(data.code==202){
				openModal(".coin-modal");
				setTimeout(function(){
					hideKettle();
				},1200);
			}else{
				toggleModal(data.message);
				setTimeout(function(){
					hideKettle();
				},1200);
			}
		})
	}

	function gain(uid,token,farmId){//收获
		
		var postData={
			url:'/api/farm/Reap',
			datas:{
				uid:uid,
				token:token,
				farm_id:farmId
			}
		}
		requestFunc(postData,function(data){
			if(data.code==200){
				var goods=data.data;
				$(".fruit").text(goods.name+goods.num+'斤');
				openModal('.ticket-modal');
			}else{
				toggleModal(data.message);
			}
		})
	}

	function inviteFriends(){//邀请好友
		var env=judgeEnviron();
		closeModal(".invite-modal");
		if(env==='android'){
			window.injectedObject.openMyQrCode();
		}else if(env==='ios'){
			window.webkit.messageHandlers.jumpVistFriend.postMessage('333');
		}
	}

	function seeAD(){//看广告看金币
		var env=judgeEnviron();
		if(env==='android'){
			window.injectedObject.openAd();
		}else if(env==='ios'){

		}
	}

	function renderLand(){//渲染页面
		fetchList(farmType,function(farms){
			var html="";
			farms.forEach(function(ele,index) {
				var landHtml="";
				var shareHtml="";
				var numHtml="";
				var coinHtml="";
				var nameHtml="";
				var picHtml="";
				var handHtml="";
				var seedName=ele.name?ele.name:"";

				if(ele.is_lock==1){
					landHtml='<div class="lock-pic land-pic"><img src="./images/tdjs.png" alt=""></div>'
				}else{
					landHtml='<div class="unlock-pic land-pic"><img src="./images/tdwjs.png" alt=""></div>'
					numHtml='<span class="land-number">'+ele.fieldNumber+'</span>';
					shareHtml='<span class="share-label">分享好友<br/>解锁</span>';
				}

				if(ele.seed_id!=0&&ele.seed_state!=5){
					coinHtml='<div class="coin-icon-wraps">'+
							'<div class="coin-icon" id="coin-icon-'+(index+1)+'"></div>'+
							'<span class="coin-number">'+ele.water_coin+'</span>'+
						'</div>';
					if(ele.seed_state==0){
						picHtml='<div class="seed-pic"><img src="./images/miao.png"  class="seed" alt=""/></div>';
						nameHtml='<span class="seed-name-label">再浇水3次免费领<br/>'+seedName+'</span>';
					}else if(ele.seed_state==1){
						picHtml='<div class="seed-pic"><img src="./images/shu.png"  class="seed" alt=""/></div>';
						nameHtml='<span class="seed-name-label">再浇水2次免费领<br/>'+seedName+'</span>';
					}else if(ele.seed_state==2){
						picHtml='<div class="seed-pic"><img src="./images/hua.png"  class="seed" alt=""/></div>';
						nameHtml='<span class="seed-name-label">再浇水1次免费领<br/>'+seedName+'</span>';
					}else if(ele.seed_state==3){
						picHtml='<div class="seed-pic"><img src="./images/guo.png"  class="seed" alt=""/></div>';
						nameHtml='<span class="seed-name-label">免费领'+seedName+'</span>';
						handHtml='<span class="hand-icon hand-move" landid="'+ele.field_id+'"><img src="./images/hands1.png" class="hand"/></span>'
						coinHtml='<div class="coin-icon-wraps shule">'+
							'<div class="coin-icon" id="coin-icon-'+(index+1)+'"></div>'+
							'<span class="coin-number">'+ele.water_coin+'</span>'+
						'</div>';
					}
					
				}
				

				html+='<li class="land" landid="'+ele.field_id+'" seedid="'+ele.seed_id+'" seedstate="'+ele.seed_state+'" isLock="'+ele.is_lock+'" coin="'+ele.water_coin+'">'+
					'<div class="wrap">'+picHtml+landHtml+coinHtml+numHtml+shareHtml+nameHtml+handHtml+'</div></li>'
			});

			$(".land-list").html(html);
			initLand();
			
		});
	}
	function fetchUserInfo(){//获取用户信息
		var postData={
			url:'/api/farm/UserInfo',
			datas:{
				uid:uid,
				token:token
			}
		}
		
		requestFunc(postData,function(data){
			if(data.code==200){
				var userInfo=data.data;
				$("#avtar").attr('src',userInfo.HeadPortrait);
				totalCoin=parseInt(userInfo.Balance);
				$(".coin-nums").text(parseFloat(userInfo.Balance));
				$(".user-name").text(userInfo.NickName);
			}else{
				// toggleModal(data.message);
			}
		})
	}
	function initGame(callback){
		 var docH=$(window).height();
		 if(docH>750){//兼容全面屏手机
            $(".land-wraper").css({'padding-top':'9rem'});
            $(".top-btns").css({'top':'14rem'});
            $(".user-info-block").css({'top':'3.8rem'});
            $(".guide-point").css({'top':'3.8rem'});
            $(".guide02-pic").css({'top':'14rem'});
            $(".guide01-pic").css({'top':'49rem'});
            $(".guide03-pic").css({'top':'43rem'});
            $(".guide04-pic").css({'top':'56.5rem'});
            $(".guide05-pic").css({'top':'36rem'});
		}
		fetchUserInfo();
		renderLand();
		fetchShop(curPage);
		callback&&callback();
	}

	$(".surelBtn").click(function() {//点击确定购买种子
		$(this).attr('disabled',true);
		closeModal('.purchase-modal');
		buySeed(seedId);
		
	});
	function hideKettle(){//回归水壶位置
		$("#kettle").css({transform:'scale(1) rotate(0deg)',transition:'.3s',
		left:0,top:0,background:'url(./images/shuihu.png)','background-size':'100% 100%'});
		$("#kettleDown").fadeOut(300);
		$(".coin-icon-wraps").fadeOut(300);
		isWarter=false;
		isWarting=false;
	}
	function operate(){//数据获取后的所有异步操作都在这里
		var docH=$(window).height();
		if(docH>700){
			$("#guid1").attr("src",'./images/yind01.png');
			$("#guid2").attr("src",'./images/yind02.png');
			$("#guid3").attr("src",'./images/yind03.png');
			$("#guid4").attr("src",'./images/yind04.png');
			$("#guid5").attr("src",'./images/yind05.png');
		}
			/**浇水 */
		$("#kettle").click(function(e){//端起水壶
				Top=parseInt($(this).offset().top);
				Left=parseInt($(this).offset().left);
				e.stopPropagation();
				if(!isWarter){
					isWarter=true;
					isClick=true;
					isPort=true;
					$(this).css({transform:'translate(-20px,-50px) rotate(-30deg)',transition:'.3s'});
					$(".coin-icon-wraps").fadeIn(300);
					$(".shule").hide();
					$("#kettleDown").fadeIn(300);
				}
		})

		$(".land-list").on('click','.land',function(e){//点击土地浇水
			e.stopPropagation();
			var w=$(this).width()/3;
			var h=$(this).height()/2;
			var curL=parseInt($(this).offset().left);
			var curT=parseInt($(this).offset().top);
			var seedId=$(this).attr('seedid');
			var farmId=$(this).attr("landid");
			var seedState=$(this).attr("seedstate");
			var isLock=$(this).attr("isLock");
			var coin=parseInt($(this).attr('coin'));
			if(isLock==0){
				openModal(".invite-modal");
			}else{
				if(seedId!=0){
					if(isWarter){
						if(seedState!=5&&seedState!=3){
							if(totalCoin>coin){
								if(isWarter&&isClick){
									var absL=Left-curL-w;
									var absT=Top-curT+h;
									$("#kettle").css({'left':-absL+'px','top':-absT+'px','background':'url(./images/jiaoshui2.gif)',
									'background-size':'100% 100%','z-index':"500",transform:'rotate(-10deg) scale(1.6)', transition:'.3s'});
									isClick=false;
									isWarting=true;
									warting(farmId,function(){
										setTimeout(function(){
											hideKettle();
											initGame();
										},1000);
									})
								}
							}else{
								openModal(".coin-modal");
								hideKettle();
							}
						}
					}
				}else{
					openModal(".buy-modal");
					hideKettle();
				}
			}
		})

		$(".land-list").on('click','.hand-icon',function() {
			curFarmId=$(this).attr('landid');
			$(this).removeClass('hand-move');
			$(this).find('.hand').attr("src",'./images/hands2.png');
			openModal(".video-modal");
		});

		$(".ad-btn").click(function() {//看广告赚金币
			closeModal(".coin-modal");
			seeAD();
		});

		$(".shopping").click(function() {//跳转鲫鱼商城
			var env=judgeEnviron();
			if(env==='android'){
				window.injectedObject.openMall();
			}else if(env==='ios'){
				window.webkit.messageHandlers.jumpJiYuShop.postMessage('333');
			}
		});

		$(".invite-btn").click(function() {//跳转邀请好友
			inviteFriends();
		});

		$(".video-btn").click(function() {
			closeModal(".video-modal");
			$('.hand-icon').addClass('hand-move');
			$('.hand-icon').find('.hand').attr("src",'./images/hands1.png');
			var env=judgeEnviron();
			if(env==='android'){
				window.injectedObject.harvestFruit(curFarmId);
			}else if(env==='ios'){
				window.webkit.messageHandlers.watchAd.postMessage(curFarmId);
			}
		});

	
		$(".water-block").click(function(e){//点击是水壶回到初始位置
			e.preventDefault();
			if(!isWarting){
				hideKettle();
			}
			
		});
		$("#kettleDown").click(function(e){//点击是水壶回到初始位置
			if(!isWarting){
				hideKettle();
			}
		})

	}

	function initLand(){//初始化田地布局
		var docH=$(window).height();
		if(docH>750){//兼容全面屏手机
			$(".bottom-btns").css({bottom:'16rem'});
		}
		$(".land").each(function(index, ele) {
			var w=11.9;
			var h=7.7;
			var baseLeft=13.8;
			var baseTop=8.6;
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

		initCoin();
		$(".load-modal").fadeOut(200);
	}

	function initCoin(){
		for(var i=1;i<=9;i++){
			var elem="coin-icon-"+i;
			drawCoin(i,elem);
		}
	}

	function drawCoin(num,ele){
		var lotties= lottie.loadAnimation({
	        container: document.getElementById(ele),
	        renderer: 'svg',
	        loop: true,  
	        autoplay: true,
	        path: './datas/data.json'
    	});
	}
	
	initGame(function(){//这里面执行初始化后的异步操作；
		setTimeout(function(){
			buyOperate();
			operate();
		},500)
	});
	
	$(".seek-btn").click(function(){
		closeModal(".ticket-modal");
		initGame();
		var env=judgeEnviron();
		if(env==='android'){
			window.injectedObject.openCoupons();
		}else if(env==='ios'){
			window.webkit.messageHandlers.jumpKaQuan.postMessage('333');
		}
	})



	

	

	/*打开弹窗*/
	function openModal(el){
		$(el).fadeIn(200);
	}
	/*关闭弹窗*/
	function closeModal(el){
		$(el).fadeOut(200);
		hideKettle();
	}
	/**打开种子商店弹窗 */
	$(".purchase").click(function(){
		var arr=[];
		arr=farmDatas.filter( function(ele,index) {
			return ele.is_lock==1&&ele.seed_id==0
		});
		if(arr.length>0){
			if(!isWarter){
				openModal(".seed-modal");
			}
		}else{
			openModal('.over-modal');
		}
		
		
	})
	/**关闭种子商店弹窗 */
	$(".seed-close-btn").click(function(){
		closeModal(".seed-modal");
	})

	/*关闭土地不够用弹框*/
	$(".over-close-btn").click(function(){
		closeModal(".over-modal");
	});
	$(".know-btn").click(function() {
		closeModal(".over-modal");
	});
	//取消购买种子
	$(".cancelBtn").click(function() {
		closeModal(".purchase-modal");
		$("#seedIcon").attr('src',"");
		$(".cost-coin").text("");
		$(".fruit-name").text("");
	});

	/**关闭金币不足弹窗 */
	$(".coin-close-btn").click(function(){
		closeModal(".coin-modal");
	})

	/**关闭水果券弹框 */
	$(".ticket-close-btn").click(function(){
		closeModal(".ticket-modal");
		initGame();
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
		$(".hand-icon").addClass('hand-move');
		$(".hand-icon").find('.hand').attr("src",'./images/hands1.png');
	})

	/**关闭确认购买种子弹窗 */
	$(".purchase-close-btn").click(function(){
		closeModal(".purchase-modal");
	})

	/*游戏引导*/
	$(".guide-point").click(function(){
		$(".guide-modal").show();
		guide(1)
	})
	
