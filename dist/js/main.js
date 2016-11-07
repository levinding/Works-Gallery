 /**
 * Main page javascript begin
 * Author:levin Ding
 * Project: Verp VP 2.0 version
 * Date:Sept 2015
 */

/**
 * Global variables for all functions to use. All developers who contribute his code in this file
 * should prevent from naming the same name of following variables in his or her codes
 * for the reason of avoid of possible unknow error happen
 */
  //Check the list hover status for left side lists
  var listHover = false,
      childHover = false,
      secondListHover = false,
      secondChildHover = false;

  //Check the check all radios checked status
  var checkAllStatus = 'unchecked',
      checkListStatus = 'unchecked';
  
  //Datetimepicker global variables
  var startDate = '',
      endDate = '';

/**
 * The main functions begin
 */
$(function(){
	//Recall the main structure layout calculation function
	layout();
	
	//Ajust the left aside row height to equal right side table cells height
	leftRowHeight();
    leftListChild();
	
	//init the niceScroll bar
	scroll();
    
    //Public selection list initialize
    selection();
	
	//Left side block display toggole function
	$('header').on('click', '.switch, .title', function(){
		var win = $(window),
		    winW = win.width(),
		    aside = $("#main-content aside"),
		    article = $("#main-content article"),
		    asideScroll = aside.children('.scroll'),
		    asideFooter = aside.children('footer'),
		    contact = $("#main-content > header .count"),
		    title = $('#main-content > header .title'),
			isdh = aside.data("isdh");
			if(isdh){
				return false;
			}
			aside.data("isdh",true);
			if(aside.outerWidth() == 42) {
				aside.add(contact).removeClass('open');
				aside.animate({width:"216px"},'fast', function(){
					asideScroll.height(aside.height() - asideFooter.height()).getNiceScroll().resize();
				});
				article.animate({left: "216px", width:winW - 216 + "px"},'fast', function(){
					aside.data("isdh",false);
                    scroll();
				});
				if(title.is(':hidden')) title.removeClass('hidden');
			}else{
				aside.add(contact).addClass('open');
				var FooterHeight = $('aside footer').height();
				aside.animate({width:"42px"},'fast', function(){
					asideScroll.height(aside.height() - asideFooter.height()).getNiceScroll().resize();
				});
				article.animate({left: "42px", width:winW - 42 + "px"},'fast', function(){
					aside.data("isdh",false);
                    scroll();
				});
				if(contact.is(':visible')) title.addClass('hidden');
			}
	});
	
	//The left side list selection hover and click event function to display her children and choosing terms
	if($('#main-content > aside .list').length > 0){
		var list = $('#main-content > aside .addkey').add($('#main-content > aside .list > li')),
		    children = $('#main-content > aside > .list-children'),
            popover = children.children('.popover'),
            select = $('#main-content > aside .selected'),
            checkDate = children.find('> .data-stage > li').not('.date-time-picker'),
            checkBox = checkDate.find('input[type="checkbox"]'),
            dateCheck = children.find('> .data-stage > li.date-time-picker').find('input[type="checkbox"]'),
            clear = select.next('.clear');
        
        $('#main-content > aside').on('mouseenter mouseleave', '.list > li, >.list-children > .custom li', function(e){
            var _this = $(this);
            var index = _this.index() -1;
            var neighbour = _this.siblings().children('span:first-child');
            var span = _this.children('span:first-child');
            var popover = children.find('> .addkey');
            
            if(e.type == 'mouseenter'){
                _this.find('.am-icon-pencil-square-o, .am-icon-trash-o').removeClass('hidden');
                if(_this.closest('.list-children').length){
                   if(neighbour.hasClass('hover')){
                        neighbour.removeClass('hover');
                        neighbour.siblings('span').addClass('hidden');
                        popover.removeClass('in second');
                    } 
                }
            }else{
                setTimeout(function(){
                    if(!secondChildHover){
                        _this.find('.am-icon-pencil-square-o, .am-icon-trash-o').addClass('hidden');
                        if(_this.closest('.list-children').length){
                            if(popover.hasClass('in')){
                                popover.removeClass('in second');
                            }
                            span.removeClass('hover');
                        }
                    }
                }, 50);
            }
        });
        
        $('#main-content > aside >.list-children > .custom').on('click', 'li .am-icon-pencil-square-o', function(e) {
            var _this =$(this);
            var activeList = _this.parent().children('span:first-child');
            var index = _this.index();
            var neighbour = _this.parent().siblings().children('span:first-child');
            var popover = children.find('> .addkey');
            var text = _this.parent('li').text();
            text = (text.indexOf('(') > 0)? text.substring(0, text.indexOf('(')) : text;
            popover.addClass('second');
            popOver(activeList, popover, index, neighbour);
            popover.find('input[type="text"]').val(text);
            e.stopPropagation();
        });
        
        $('#main-content > aside').on('click', '.myself .am-icon-pencil-square-o', function(e) {
            var index = $(this).index();
            var popover = children.find('> .myself');
            var neighbour = $(this).siblings('div');
            var text = $(this).parent().text();
            popOver($(this).parent(), popover, index, neighbour);
            popover.find('input[type="text"]').val(text);
            e.stopPropagation();
        }).on('mouseenter mouseleave', '.myself', function(e){
            var _this = $(this);
            var addkey = _this.siblings('.addkey');
            var popover = children.find('> .addkey');
            var trash = $(this).children('.am-icon-pencil-square-o');
            if(e.type=='mouseenter') {
                listHover = true;
                trash.removeClass('hidden');
                if(addkey.hasClass('hover')) {
                    addkey.removeClass('hover');
                    popover.removeClass('in');
                }
                
            }else{
                setTimeout(function(){
                    if(!childHover){
                        trash.addClass('hidden');
                        _this.removeClass('hover');
                        children.find('> .myself').removeClass('in');
                    }
                }, 50);
            }
        });
        
        $('#main-content > aside > .list-children > .custom').on('click', '> li .am-icon-trash-o', function(e){
            var group = $(this).closest('ul');
            var items = group.children('li');
            var addKey = $(this).closest('.custom').siblings('.addkey');
            var selectKey = select.find('.custom > .term');
            
            if(selectKey.length > 0 && selectKey.text() == $(this).parent('li').text()) {
                unCheck('custom', $('#main-content > aside .list > .custom'));
            }
            if(addKey.hasClass('in')) addKey.removeClass('in');
            e.stopPropagation();
        });
        
        $('#main-content > aside .list').on('click', '> li .am-icon-trash-o', function(){
            $(this).closest('li').remove();
        });
        
        list.each(function(){
            var _this = $(this);
            var span = (_this.children('span').length > 0)? _this.children('span') : _this;
            var index = (_this.hasClass('addkey'))? 0 : _this.index() + 1;
            var className = _this.attr('class');
            var neighbour = _this.siblings('li').children('span');
			var popover = children.find('> .'+ className);
			
			_this.hoverDelay({
            hoverDuring: 0,
            outDuring: 0,
				hoverEvent: function(){
					popOver(_this, popover, index, neighbour);
				},
				outEvent: function(){
					popOut(popover, span);
				}
			});
		});
        
        children.on('click', '> .addkey .confirm', function(){
            var active = $('#main-content > aside > .wrapper > .section .hover');
            var custom = $('#main-content > aside > .list-children > .custom');
            var keywordList = (custom.length)?custom : $('#main-content > aside .list');
            var term = $('#main-content > aside > .list-children > .custom span.hover'); 
            var input = $(this).parent('li').siblings().children('input');
            var popover = children.children('.addkey');
            var selectKey = select.find('.custom > .term');
            var text = input.val();
            if(text !==''){
                if(active.length && active.hasClass('addkey')){
                    popover.removeClass('in');
					var item = '<li class="keylist"><span>'+text+'</span><span class="am-icon-pencil-square-o hidden"></span><span class="am-icon-trash-o hidden"></span></li>';
					custom.append(item)
                }else{
					term.text(text);
				}
                input.val('');
                //popover.removeClass('in');
            } 
        }).on('click', '> .myself .confirm', function(){
            var list = $('#main-content > aside .myself > .text');
            var input = $(this).parent('li').siblings().children('input');
            var text = input.val();
            if(text !=='') {
                list.text(text);
                $(this).closest('.popover').removeClass('in');
            }
        });
        
        children.on('click', '> .popover .cancel', function(){
            $(this).parent('li').siblings().children('input').val('');
            $(this).closest('.popover').removeClass('in');
        });
        
        //popover list click event on left side
        $('#main-content > aside > .list-children > .popover').not('.second-child, custom').on('click', '> li > .am-checkbox > input[type="checkbox"]', function(e){
            var _this = $(this),
                popover = _this.closest('.popover'),
                className = popover.attr('class'),
                className = getClass(className, 2),
                menu = $('#main-content > aside .list > li.'+className),
                term = select.children('.'+className).children('.term'),
                title = menu.text(),
                text = (_this.parent('li').hasClass('date-time-picker'))? '自定义时间段': _this.parent().text();
            
            showSwitch();
            if(_this.is(':checked')){
                if(className !== 'rate'){
                    if(_this.closest('li').hasClass('all')) {
                        _this.closest('li').siblings('li').find('.am-checkbox').children().uCheck('check');
                    }else{
                        _this.closest('li').siblings('li').find('.am-checkbox').children().uCheck('uncheck');
                    }
                }
                selected(className, menu, term, title, text);
            }else{
                var checked = popover.find('.am-checkbox').children('input[type="checkbox"]:checked');
                if(className != 'rate'){
                   if(_this.closest('li').hasClass('all')) {
                        _this.closest('li').siblings('li').find('.am-checkbox').children().uCheck('uncheck');
                       term.text('');
                    }else{
                        var checkAll = _this.closest('li').siblings('li.all').find('> .am-checkbox').children();
                        var checked = popover.find('.am-checkbox').children('input[type="checkbox"]:checked');
                        var newText = '';
                        if(checkAll.is(':checked')){
                            checkAll.uCheck('uncheck');
                            checked = popover.find('.am-checkbox').children('input[type="checkbox"]:checked');
                        }
                        if(checked.length > 0){
                            checked.each(function(){
                                newText += $(this).closest('li').text() + ', ';
                            });
                            newText = newText.substring(0, newText.lastIndexOf(', '));
                            term.text(newText);
                        }else{
                            term.text('');
                        }
                    }
                }else{
                    var newText = '';
                    checked.each(function(){
                        newText += $(this).closest('li').text() + ', ';
                    });
                    newText = newText.substring(0, newText.lastIndexOf(', '));
                    term.text(newText);
                }
                if(term.text() == ''){
                    unCheck(className, menu);
                }
            }
            e.stopPropagation();
        });
        
        $('#main-content > aside > .list-children > .secondary').on('mouseenter', '> li', function(){
            var _this =$(this);
            var className = getClass(_this.attr('class'), 0);
            var index = _this.index() - 2;
            var neighbour = _this.siblings();
            var popover = children.find('> .'+className);
            
            if(popover.length) {
                popover.addClass('second');
                popOver(_this, popover, index, neighbour);
                popover.siblings('.second-child.in').removeClass('in');
            }else{
                children.find('.second-child.in').removeClass('in');
            }
            _this.siblings().removeClass('hover');
        });

        $('#main-content > aside > .list-children > .popover.custom').on('click', '> li', function(){
            var _this = $(this),
                popover = _this.closest('.popover'),
                className = popover.attr('class'),
                className = getClass(className, 2),
                menu = $('#main-content > aside .list > li.'+className),
                term = select.children('.'+className).children('.term'),
                title = menu.text(),
                text = _this.text();

            showSwitch();
            if(!_this.hasClass('hover')) {
                _this.addClass('hover');
                _this.siblings().removeClass('hover');
                selected(className, menu, term, title, text);
                _this.children('.am-icon-trash-o').click(function(){
                    if(_this.hasClass('hover')) {
                       unCheck(className, menu);
                    }
                });
            }else{
                _this.removeClass('hover');
                unCheck(className, menu);
            }
        });
        
        //Clear the selected terms
        clear.on('click', function(){
            var checkBox = popover.find('.am-checkbox').children();
            select.empty();
            if(popover.children('li.active').length > 0){
                popover.children('li.active').removeClass('active');
            }
            if(checkBox.is(':checked')){
                checkBox.uCheck('uncheck');
            }
            if(list.hasClass('hidden')){
            	list.removeClass('hidden');
            }
            select.add(clear).addClass('hidden');
            startDate = endDate = '';
        });
        
        //close event at term boxs on left side
        select.on('click', '.group > .am-icon-close', function(){
        	var className = getClass($(this).parent().attr('class'), 1);
        	var popover = children.children('.'+className);
        	var checkBox = popover.find('.am-checkbox > input[type="checkbox"]');
        	var menu  = select.siblings('.list').children('.'+className);
        	$(this).parent('.group').remove();
        	menu.removeClass('hidden');
        	popover.removeClass('in');
        	if(checkBox.is(':checked')){
        		checkBox.uCheck('uncheck');
    			checkBox.parents('li').removeClass('active');
        	}
        	if(select.html() == '') {
                select.add(clear).addClass('hidden');
            }
        	startDate = endDate = '';
            //qzl 关键词分页数据
            //SerachKeyWord();
        });
        
        //AmazeUI Datepicker initialize
        $('#start-date').datetimepicker({
            format: 'yyyy-mm-dd',
            minView: 'month'
        });
        $('#end-date').datetimepicker({
            format: 'yyyy-mm-dd',
            minView: 'month'
        });
        
        $('#main-content > aside > .list-children > .date-time-picker').on('changeDate', '#start-date, #end-date', function(){
            var _this = $(this);
            var className = 'data-stage';
            var menu = $('#main-content > aside .list > .data-stage');
            var term = $('#main-content > aside .selected > .data-stage > .term');
            var title = menu.text();
            
            var callback = function(text){
                                showSwitch();
                                selected(className, menu, term, title, text);
                                checkStatus();
                            };
            
            changeDate(_this, callback);
        });
        
        $('#main-content > article > .proeffect').on('mouseenter', '.selection .options li', function(e){
            var _this = $(this);
            var selection = _this.closest('.selection');
            var _start = selection.find('#start-date');
			var	_end = selection.find('#end-date');
			var	term = selection.find('.selected');
            
            var popover = _this.closest('.headinfo').find('.popover.'+getClass(_this.attr('class'), 0));
            var index = _this.index()+9;
            var neighbour = _this.siblings();
            if(popover.length){
                popOver(_this, popover, index, neighbour);
            }else{
                _this.closest('.headinfo').find('.popover.in').removeClass('in');
                _this.siblings().removeClass('hover');
            }
        }).on('mouseover mouseout', '.selection .options', function(e){
            var _this = $(this);
            if(e.type=='mouseover'){
                secondListHover = true;
            }else{
                secondListHover = false;
                setTimeout(function(){
                    if(!secondListHover){
                        _this.add(_this.siblings('.popover')).removeClass('in');
                    }
                }, 100);
            }
        }).on('changeDate', '#start-date, #end-date', function(){
            var _this = $(this);
            changeDate(_this, function(text){
                _this.closest('.popover').siblings('.selected').text(text);
                _this.closest('.headinfo').siblings('.chartinfo').children('.lateexplodetitle').text(text+'曝光量');
            });
        }).on('click', function(e){
            var target = $(e.target);
            var options = target.closest('.options');
            if(options.length) {
                options.closest('.headinfo').siblings('.chartinfo').children('.lateexplodetitle').text(target.text()+'曝光量');
            }
        });
        
        //Time picker function for bidding time setting
        if($('#timepicker').length) {
            var time = '';
            var hour, minute;
            var h = 0;
            var m = 0;
            for(h; h<24; h++) {
                if(h<10) {
                    hour = '0'+h;
                }else{
                    hour =h;
                }
                for(m; m<2; m++){
                    minute = (m==0)? '00' : '30';
                    time += '<span>'+hour+':'+minute+'</span>';
                    if(m==1) {
                        m = 0;
                        break;
                    }
                }
            }
            $('#timepicker .popover-content').append(time);
        }
        
        $("#main-content > .modal .select-time").on('click', '.select > .am-icon-caret-down', function(){
            var _this = $(this);
            var td = _this.parent('td');
            var popover = $('#timepicker').children('.popover');
            var scroll = popover.children('.scroll');
            var positionTop = td.position().top;
            var positionLeft = td.position().left;
            
            td.addClass('active');
            td.siblings().add(td.parent('tr').siblings().find('td.active')).add(td.closest('div').siblings('div').find('td.active')).removeClass('active');
            if(!popover.hasClass('in')){
                popover.addClass('in').css({'top':positionTop+26+'px', 'left':positionLeft+8+'px', 'width':td.width()+'px'});
                setTimeout(function(){
                    scroll.removeClass('hidden').scrollTop(0);
                    initScroll(scroll);
                }, 20); 
            }else{
                popover.removeClass('in');
                scroll.addClass('hidden');
            }
        }).on('click', '#timepicker .popover-content > span', function(){
            var _this = $(this);
            var select = _this.closest('#timepicker').siblings('.tbody').add(_this.closest('#timepicker').siblings('.set-time')).find('td.active');
            var time = _this.text();
            
            select.children('.time').val(time);
            _this.closest('.popover').removeClass('in');
            _this.parent().addClass('hidden');
			var $tr = select.parent();
			CompareTime($tr,$tr.find("td").index(select));
            
        }).on('click', '.am-icon-plus', function(){
            var _this = $(this);
            var start = _this.parent().siblings('.begin-time').children('.time');
            var end = _this.parent().siblings('.end-time').children('.time');
            var position = (_this.closest('tbody').children('tr').length > 1)?'top':'bottom';
            var content = '<tr>'
                          +'  <td><label class="am-checkbox"><input type="checkbox" value="" data-am-ucheck></label></td>'
                          +'  <td class="select"><input type="text" class="time tooltips" value="'+start.val()+'"  placeholder="请选择" /><span class="am-icon-caret-down"></span></td>'
                          +'  <td class="select"><input type="text" class="time tooltips" value="'+end.val()+'"   placeholder="请选择"/><span class="am-icon-caret-down"></span></td>'
                          +'  <td><span class="am-icon-trash-o"></span></td>'
                          +'</tr>';
			if(CompareTimeAll(_this.parent().parent())){
				var tbody = $("#main-content > .modal .select-time .tbody tbody");
				tbody.prepend(content).find('input[type="checkbox"]').uCheck();
				initScroll(tbody);
				_this.parent().siblings().find('.time').val('');
			}
           
        }).on('click', function(e){
            var popover = $(this).find('.popover');
            if(!$(e.target).closest('.active').length) {
                popover.removeClass('in');
                popover.children('.scroll').addClass('hidden');
            }
            
        }).on('click','.am-icon-trash-o', function(){
            $(this).closest('tr').remove();
        });
        
        //Public callback function for select event at left side bar
        function getClass(_class, num){
        	var className = _class.split(' '),
        	    className = className[num];
        	return className;
        }
        
        function checkStatus(){
            if(checkBox.is(':checked')) checkBox.uCheck('uncheck');
            checkDate.removeClass('hover');
            if(!dateCheck.is(':checked')) {
                dateCheck.uCheck('check');
            }
        }
        
        //Public Change datetime function
        function changeDate(obj, callback){
            var text = '';
            if(obj.attr('id') == 'start-date'){
                var _end = obj.parent().siblings().find('#end-date');
                startDate = obj.data('date');
                if(endDate == '' || endDate.valueOf() < startDate.valueOf()){
					text = startDate+' 至 '+startDate;
					_end.datetimepicker('update', startDate);
				}else{
					text = startDate+' 至 '+endDate;
				}
                if(callback){
                    callback(text);
                }
				_end.datetimepicker('setStartDate', startDate);
            }else{
                endDate = obj.data('date');
                if(startDate == ''){
					text = endDate+' 至 '+endDate;
				}else{
					text = startDate+' 至 '+endDate;
				}
                if(callback){
                    callback(text);
                }
            }
        }
        
        function popOver(_this, popover, index, neighbour){
            var close = _this.children('.am-icon-close');
            
            listHover = true;
            if(_this.children('span').length > 0 && _this.closest('.list').length){
                if(!_this.children('span').hasClass('hover')){
                    _this.children('span').addClass('hover');
                }
            }else{
                if(!_this.hasClass('hover')){
                    _this.addClass('hover');
                }
            }
            if(!popover.hasClass('in')){
                popover.addClass('in');
            }
			if(!_this.closest('.popover').hasClass('secondary')){
				if(popover.siblings('.popover').hasClass('in')){
					popover.siblings('.popover').removeClass('in');
				}
			}
            if(neighbour.hasClass('hover')){
                neighbour.removeClass('hover');
            }
            if(close.length > 0){
            	close.removeClass('hidden');
            }
            
			position(_this, popover, index);
            
			popover.on('mouseenter', function(){
                if($(this).hasClass('second-child')) {
                    secondChildHover = true;
                    secondListHover = true;
                };
                if($(this).hasClass('secondary')){
                    secondListHover = true;
                }
                listHover = true;
                childHover = true; 
			}).on('mouseleave', function() {
                if($(this).hasClass('second-child')) {
                    secondChildHover = false;
                    secondListHover = false;
                };
                if($(this).hasClass('secondary')){
                    secondListHover = false;
                }
                listHover = false;
                childHover = false;
				delayHide(_this, popover);
			});
            
            $(document).on('mouseover', '.nicescroll-rails', function(){
                listHover = true;
                childHover = true;
                secondListHover = true;
                secondChildHover = true;
            }).on('mouseout', '.nicescroll-rails',  function(){
            	listHover = false;
                childHover = false;
                secondListHover = false;
                secondChildHover = false;
            	delayHide(_this, popover);
            });
		}
        
        function delayHide(_this, popover){
            var span = (_this.children('span').length > 0 && _this.closest('.list').length)? _this.children('span') : _this;
            var close = _this.children('.am-icon-close');
            var hoverIcon = _this.children('.am-icon-pencil-square-o');
            setTimeout(function(){
                if(!listHover){
                    popover.removeClass('in second').css('height','auto');
                    popover.siblings('.second-child.in').removeClass('second in');
                    if(popover.hasClass('secondary')) popover.children('li').removeClass('hover');
                    span.removeClass('hover');
                    if(close.length > 0){
                        close.addClass('hidden');
                    }
                    if(hoverIcon.length > 0){
                        hoverIcon.addClass('hidden');
                    }
                }
                if(popover.hasClass('second-child')) {
                    if(!secondListHover){
                        popover.siblings('.secondary.in').removeClass('in');
                        if(popover.hasClass('addkey')){
                            $('#main-content > aside >.list-children > .custom').find('.am-icon-pencil-square-o, .am-icon-trash-o').addClass('hidden');
                        }
                        $('#main-content > aside .list li > span.hover').removeClass('hover');
                        if(select.is(':visible')) {
                            select.children('.group.hover').removeClass('hover').children('.am-icon-close').addClass('hidden');
                        }
                    }
                }
            }, 0);
        }
        
        function popOut(popover, hoverTag){
            var close = hoverTag.children('.am-icon-close');
        	if(!childHover){
				popover.removeClass('in').css('height','auto');
				hoverTag.removeClass('hover');
                if(close.length > 0){
	            	close.addClass('hidden');
	            }
			}
        }
        
        function showSwitch(){
        	if(select.hasClass('hidden') && $('#main-content > article .date-time-picker:visible').length == 0) {
                select.add(clear).removeClass('hidden');
            }
        }
        
        function selected(className, menu, term, title, text){
        	if(menu.is(':visible') && menu.closest('.proeffect').length == 0){
    			menu.addClass('hidden');
    		}
        	if(!term.length){
                select.append('<div class="group ' + className+'"><div class="am-icon-close hidden"></div><div class="title">'+title+'</div><div class="term"></div></div>');
                term = select.children('.' + className).children('.term');
                term.append(text);
            }else{
            	if(text == '所有'){
            		term.text(text);
            	}else{
                    if(className == 'rate'){
                        if(term.text() == '') {
                            term.text(text);
                        }else{
                            term.append(', ' + text);
                        }
                    }else{
                        term.text(text);
                    }
            	}
            }
            
            //The selected group hover event to replace the hidden list hover event for display popover on left side
			select.children('.group').each(function(){
	            var _this = $(this);
                var neighbour = _this.siblings('.group');
	            var index = (_this.index() == 0)? 1 : 0;
	            var className = getClass(_this.attr('class'), 1);
				var popover = children.find('> .'+className);
				
				_this.hoverDelay({
                    hoverDuring: 0,
                    outDuring: 0,
					hoverEvent: function(){
						popOver(_this, popover, index, neighbour);
					},
					outEvent: function(){
						popOut(popover, _this);
					}
				});
			});
        }
        
        function unCheck(className, menu){
            select.children('.'+className).remove();
            menu.removeClass('hidden');
            if(select.html() == '') {
                select.add(clear).addClass('hidden');
            }
        }
        
        function position(_this, popover, index){
            var winH = $(window).height();
            var offsetTop = _this.offset().top;
            var offsetBottom = winH - _this.offset().top;
            
            if(popover.outerHeight() >= offsetBottom) {
                if(offsetTop >= 1/2 * winH - 40){
                    if(popover.outerHeight() >= offsetTop){
                        popover.css({'top': 2 - index + 'px', 'height':offsetTop + 'px'});
                    }else{
                        popover.css({'top':offsetTop - 40 - popover.outerHeight() + 42 - index + 'px', 'height':'auto'});
                    }
                }else{
                    popover.css({'top':offsetTop - 40 - index +'px', 'height':offsetBottom - 40 + 'px'});
                }
                
				initScroll(popover);
				
			}else{
                popover.css('top',offsetTop - 40 - index +'px');
            }
        }
	}
	
	//Hover function for elements display toggle
	if($('.hover').length > 0) {
		var element = $('.hover');
		element.each(function(){
			var _this = $(this);
			hover(_this);
		});
	}
    
    //Special thead checkeall hover function on Peerkey page
    $('#main-content > article .peerkey th > label').each(function(){
        var _this = $(this);
        var thWidth = $('#main-content > article .peerkey th').width();
        var showBox = _this.closest('div').find('.popover');
        _this.add(showBox).hoverDelay({
            hoverDuring: 10,
            outDuring: 200,
            hoverEvent: function(){
                listHover = true;
                if(!showBox.hasClass('in')){
                    showBox.css('left', _this.parent('th').index() * thWidth + 18 + 'px');
                    showBox.addClass('in');
                }
            },
            outEvent: function(){
                listHover = false;
                if(!listHover){
                    showBox.removeClass('in');
                }
            }
    	});
    });
	
	//Click the checkbox to process the function related to body table.
	if($("#main-content > article .check-all input[type='checkbox']").length > 0) {
		//Place below checkAll function in the code written by backend developer where get the tobody content
		checkAll();
        
        $('.tbody .am-checkbox').on('click', "input[type='checkbox']", function(){
            if($(this).is(':checked')) showHeader()
            else {
                if(!$(this).closest('tr').siblings().find('input[type="checkbox"]').is(':checked')){
                    hideHeader();
                }
            }
        });
	}
    
    //Click function for displaying slide window of index page
    $("#main-content > article .slide-on").click(function(){
        var buttonGroup = $("#frame").contents().find("#main-content > article > footer .btn-group");
        var headerCount = $("#frame").contents().find("#main-content > header > .count");
        $('#frame-page').offCanvas('open');
        buttonGroup.removeClass('hidden');
        headerCount.addClass('hidden');
        buttonGroup.children('.cancel').click(function(){
            $('#frame-page').offCanvas('close');
        })
    });
    
    //Modal open function
    $(document).on('click', '.open-modal', function(){
        var className = getClass($(this).attr('class'), 0);
        var modal = $('.modal.popwindow');
        var modalDialog = modal.children('.modal-dialog');
        var modalContent = modalDialog.children('.' + className);
        var scroll = modalContent.find('.scroll');
        
        if(className == 'modify-group'){
            modalDialog.removeClass('bidding');
        }
        if(className == 'batch-bidding'){
            if(!modalDialog.hasClass('bidding')) {
                modalDialog.addClass('bidding');
            }
        }
        modalContent.removeClass('hidden');
        modal.modal().on('hidden.bs.modal', function(){
            modalContent.addClass('hidden');
            if(scroll.length){
                scroll.removeClass('in');
            }
        });
        if(scroll.length){
            setTimeout(function(){
                scroll.addClass('in');
            }, 300);
        }
        modalMiddle();
    }).on('click', '.modal input.adjustprice, .modal input.modifyprice', function(){
        var _this = $(this);
        var custom = _this.closest('li').siblings('.custom-price').children('.price');
        var modify = _this.closest('li').siblings('.modify-price').children('.price');
        if(_this.is(':checked')) {
            if(_this.hasClass('adjustprice')){
                custom.removeAttr('disabled');
                modify.attr('disabled', 'disabled');
            }else{
                custom.attr('disabled', 'disabled');
                modify.removeAttr('disabled');
            }
        }
    }).on('click', '.modal .add-group > .plus', function(){
        $(this).siblings('.add-editor').toggleClass('in');
    }).on('click', '.modal .add-group .add-confirm', function(){
        var addBox = $(this).closest('.add-editor');
        var input = $(this).siblings('.form-control');
        var tbody = $(this).closest('.add-group').siblings('.scroll').find('.table > tbody');
        var td = tbody.find('td');
        if(!input.val() == '') {
            if((td.length)%3) {
                tbody.children('tr:last-child').append('<td><label class="am-checkbox"><input type="checkbox" data-am-ucheck></label><span>' +input.val() + '</span></td>');
            }else{
                tbody.append('<tr><td><label class="am-checkbox"><input type="checkbox" data-am-ucheck></label><span>' + input.val() + '</span></td></tr>');
            }
            tbody.find('input[type="checkbox"]').uCheck();
            input.val('');
            addBox.removeClass('in');
        }
    }).on('click', '.modal .add-group .add-cancel', function(){
        $(this).closest('.add-editor').removeClass('in');
    });
    
    //Hover event function for bidding button in table body
    $("#main-content > article .tbody .bidding").each(function(){
        var _this = $(this);
        var icon = _this.children('.am-icon-pencil');
        _this.hoverDelay({
            hoverDuring: 100,
            outDuring: 100,
            hoverEvent: function(){
                icon.removeClass('hidden');
            },
            outEvent: function(){
                icon.addClass('hidden');
            }
        });
    }); 
    //Click event function for bidding button in table body
    $('#main-content > article .tbody').on('click', '.bidding', function(){
        var _this = $(this);
        var text = _this.text();
        var modal = $('#main-content > article > .modal.popwindow');
        var modalDialog = modal.children('.modal-dialog');
        var keyword = _this.closest('td').siblings().eq(3).text();
        
        if(!modalDialog.hasClass('bidding')) {
            modalDialog.addClass('bidding');
        }
        modal.find('.modify-bidding').removeClass('hidden');
        modal.modal().on('hidden.bs.modal', function(){
            modal.find('.modify-bidding').addClass('hidden');
        });
        modalMiddle();
        modal.find('.keywords > span:last-child').text(keyword)
        modal.find('.price').val(text);
    });
    
    //Adjust modal window to align the middle of window
    if($('.modal').length > 0){
		$('.modal').on('shown.bs.modal', function(){
			modalMiddle();
		});
    }
    
    //Statistics chart function on myP4P pages which have charts graph
    $('#lateexplodenum').highcharts({
        title: {
            text:""
        },
        xAxis: {
                title:{
                    text:''
                },
            categories: ['2015-10-18','2015-10-19', '2015-10-20', '2015-10-21', '2015-10-22', '2015-10-23','2015-10-24']
        },
        yAxis:{
                title:{
                    text:''
                }
            },
        plotOptions:{//绘图线条控制
            pointStart:'2015-10-19'
        },
		legend: {
            enabled: 0,
        },
        series: [{
            data: [2.0,2.9, 1.5, 4.5, 3.2,5.5,3.4],
            min:'2'
        }]
    });
    $('#explodenum').highcharts({
        title: { 
            text:""
        }, 
        xAxis: {
            categories: ['1', '2', '3', '4', '5']
        }, 
        yAxis:{
           title:{
               text:''
           }
        },
        series: [{ 
            data: [2.0,2.9, 1.5, 4.5, 6.2]
        }]
    }); 
    $('#clicknum').highcharts({
        title: { 
            text:""
        }, 
        xAxis: {
            categories: ['1', '2', '3', '4', '5']
        }, 
        yAxis:{
           title:{
               text:''
           }
        },
        series: [{ 
            data: [4.0,3.1, 1.3, 4.5, 6.2]
        }]
    });
    $('#fee').highcharts({
        title: { 
            text:""
        }, 
        xAxis: {
            categories: ['1', '2', '3', '4', '5']
        }, 
        yAxis:{
           title:{
               text:''
           }
        },
        series: [{ 
            data: [4.0,1.9, 2.5, 4.5, 6.2]
        }]
    });
    $('#avgfee').highcharts({
        title: { 
            text:""
        }, 
        xAxis: {
            categories: ['1', '2', '3', '4', '5']
        }, 
        yAxis:{
           title:{
               text:''
           }
        },
        series: [{ 
            data: [2.0,4.9, 1.5, 3.5, 6.2]
        }]
    });
    $('#match').highcharts({
        title: { 
            text:""
        }, 
        xAxis: {
            categories: ['1', '2', '3', '4', '5']
        }, 
        yAxis:{
           title:{
               text:''
           }
        },
        series: [{ 
            data: [1.0,2.9, 1.5, 4.3, 6.4]
        }]
    });
    $('#avgmatch').highcharts({
        title: { 
            text:""
        }, 
        xAxis: {
            categories: ['1', '2', '3', '4', '5']
        }, 
        yAxis:{
           title:{
               text:''
           }
        },
        series: [{ 
            data: [2.5,1.9, 3.5, 1.4, 5.2]
        }]
    });
    
});

//Ajust the layout dynamically when window size change
$(window).resize(function() {
	layout();
    modalMiddle();
});

//The main structure default layout of page function
function layout(){
	var win = $(window),
	    winH = win.height(),
	    winW = win.width(),
	    header = $('#main-content header'),
	    left = $('#main-content aside'),
	    right = $('#main-content article'),
        footerLeft = left.find('.scroll').siblings('footer'),
	    footerLH = footerLeft.height();
    
	right.width(winW - left.outerWidth());
	left.add(right).height(winH - header.height());
	left.find('.scroll').height(left.height()- footerLH);
    
    right.find('.scroll').each(function(){
        var _this = $(this);
        var thead = _this.siblings('.scroll-head');
        var footer = _this.siblings('footer');
        
        if(thead.length && footer.length) {
            _this.height(right.height() - thead.height() - footer.height());
        }else if(thead.length && !footer.length){
            _this.height(right.height() - thead.height());
        }else if(!thead.length && footer.length){
            _this.height(right.height() - footer.height());
        }else{
            _this.height(right.height());
        }
    });
	
    /**
    * Call mailNote function for mail number appear in the tabel column in the html exsample layout file.
    * This function should be removed from below by Backend developer as it will be recalled later in the function
    * in which mail note number was appened.
    */
    //mailNote();
}

//Initiate nicescoll settings
function scroll() {
	var scrollObj = $(".scroll");
	if(scrollObj.length > 0){
		scrollObj.each(function(){
			var _this =$(this),
			    arr = '';
			if(!_this.data('scroll') == '' || !_this.data('scroll') == 'undefined') arr = _this.data('scroll');
			initScroll(_this, arr);
		});
	}
}
function initScroll(obj, options){
	var _this = obj,
	    opt = $.extend(
			{},
			{
				cursorcolor: "#CCE3F5",
				cursorwidth: "5px",
				cursorborderradius: "5px",
				autohidemode: false,
				background: "",
				horizrailenabled: false,
				cursorborder: "1px solid #fff",
				railoffset: false,
                cursorborderradius: "5px",
                railpadding: {right: 0}
			},
			options
		);
	_this.niceScroll(opt);
	_this.getNiceScroll().resize()
}

//Adjust the row height of lists in left side to equal to table cells in right side
function leftRowHeight(){
	var aside = $('#main-content > aside');
	var list = aside.find('.list > li');
	var _length = list.length;
	var i = 0;
	if(aside.length > 0){
		for(i; i < _length; i++){
			list.eq(i).children('span').css('top', -(i+1)+'px');
		}
	}
}

//Public modal middle position function
function modalMiddle(){
    var winH = $(window).height();
	var modalDialog = $('.modal.in > .modal-dialog');
    marginTop = (winH - modalDialog.height() > 0)? (winH - modalDialog.height())/2 : 0;
	modalDialog.removeAttr('style').css('top', marginTop + 'px');
}

//Public modal confirm button function
function modalConfirm(callback){
    var modal = $('.modal.in');
    modal.find('.confirm').on('click', function(e){
        var pass = callback();
        if(pass == true) {
            modal.modal('hide');
        }
        e.stopPropagation();
    });
}

//Public modal window
function message(title){
    var template = '<div class="modal fade message" tabindex="-1">'
                  +'  <div class="modal-dialog">'
                  +'     <div class="modal-content">'
                  +'        <div class="message">'+title+'</div>'
                  +'     </div>'
                  +'  </div>'
                  +'</div>';
    $('#main-content').append(template);
    $('.modal.message').modal('show').on('hidden.bs.modal', function(){
        $('#main-content > .modal.message').remove();
    });
    modalMiddle();
    setTimeout(function(){
        $('.modal.message').modal('hide')
    }, 2000);
}

function confirm(title){
    var template = '<div class="modal fade confirm" tabindex="-1">'
                  +'  <div class="modal-dialog">'
                  +'     <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
                  +'     <div class="modal-content">'
                  +'        <div class="message">'+title+'</div>'
                  +'        <div class="btn-group">'
                  +'            <button type="button" class="btn btn-primary confirm">确认</button>'
                  +'            <button type="button" class="btn btn-grey cancel" data-dismiss="modal">取消</button>'
                  +'        </div>'
                  +'     </div>'
                  +'  </div>'
                  +'</div>';

    $('#main-content').append(template);
    $('.modal.confirm').modal('show').on('hidden.bs.modal', function(){
        $('#main-content > .modal.confirm').remove();
    });
    modalMiddle();
}

//Ajust the list children position to align with each related list on left side
function leftListChild(){
    var aside = $('#main-content > aside');
	var list = aside.find('.list > li');
    var children = aside.children('.list-children');
    list.each(function(){
        var _this = $(this);
        var className = _this.attr('class');
        var offset = _this.offset().top - 40;
        children.find('.'+className).css('top', offset+'px');
    });
}

//initillize the table cell size to be same between thead and tbody
 function tableCell(){
	var scroll = $('.tbody.scroll');
	if(scroll.length > 0){
		var th = $('.thead th'),
		    td = scroll.find('tr:first-child td');
		for(var i=0; i<th.length; i++){
			th.eq(i).width(td.eq(i).width());
		}
	}
}
 
/**
 * Dynamically ajust the table cell unit width in email column.
 * This function should be called in the function in which the note numbber is appened into the mail column.
 * See example layout in html file for this section
 */
function mailNote(){
	var note = $('.table span.note');
	note.children('span:first-child').css('width', '');
	note.each(function(){
		var _this = $(this),
		    mail = _this.children('span:first-child');
		if(mail.outerWidth() > _this.outerWidth() - _this.children('span:last-child').width() - 19) {
			mail.css('width', _this.outerWidth() - _this.children('span:last-child').width() - 20);
		}
	});
}

//Public selection list function
function selection(){
    $(document).on('click', '.selection > .selected, .selection > .am-icon-caret-down', function(){
        var _this = $(this);
        var selected = (_this.hasClass('.selected'))? _this : _this.closest('.selection').children('.selected');
        var options = _this.closest('.selection').children('.options');
        if(options.hasClass('in')){
            options.removeClass('in');
            _this.closest('.selection').siblings().children('.options').removeClass('in');
        }else{
            options.addClass('in');
        }
    }).on('click', '.selection > .options > li', function(e){
        var _this = $(this);
        if(!_this.hasClass('more')) {
            _this.parent('.options').siblings('.selected').text($(this).text());
            _this.parent('.options').removeClass('in');
        }
        e.stopPropagation();
    }).on('click', function(e){
        if(!$(e.target).closest('.selection').length) {
            $('.selection > .options').removeClass('in');
        }
    });
}

//Hover dispaly function
function hover(obj) {
	var _this = obj,
	    showBox = _this.closest('div').find('.popover');
    if(_this.children('.popover').length > 0){
    	_this.hover(function(){
    		showBox.toggleClass('in');
	    });
    }else{
    	_this.add(showBox).hoverDelay({
            hoverDuring: 10,
            outDuring: 50,
            hoverEvent: function(){
                listHover = true;
                if(!showBox.hasClass('in')){
                    showBox.addClass('in');
                }
            },
            outEvent: function(){
                listHover = false;
                if(!listHover){
                    showBox.removeClass('in');
                }
            }
    	});
    }
}

$.fn.hoverDelay = function(options){
	var defaults = {
		hoverDuring: 200,
		outDuring: 200,
		hoverEvent: function(){
			$.noop();
		},
		outEvent: function(){
			$.noop();
		}
    };
    var sets = $.extend(defaults,options || {});
    var hoverTimer, outTimer;
    return $(this).each(function(){
    	$(this).hover(function(){
    		clearTimeout(outTimer);
    		hoverTimer = setTimeout(sets.hoverEvent, sets.hoverDuring);
    	},function(){
    		clearTimeout(hoverTimer);
    		outTimer = setTimeout(sets.outEvent, sets.outDuring);
    	});
    });
}

Date.prototype.Format = function(fmt) { //author: meizz  
	 var o = {
		 "M+": this.getMonth() + 1,  
		 "d+": this.getDate(), 
		 "h+": this.getHours(),   
		 "m+": this.getMinutes(), 
		 "s+": this.getSeconds(),   
		 "q+": Math.floor((this.getMonth() + 3) / 3), 
		 "S": this.getMilliseconds() 
	 };
	 if (/(y+)/.test(fmt))
		 fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	 for (var k in o)
		 if (new RegExp("(" + k + ")").test(fmt))
			 fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	 return fmt;
}//Toggle header content
function showHeader(){
    var count = $('header .count > ul');
    if(count.length > 1) {
        count.eq(0).addClass('hidden');
        count.eq(1).removeClass('hidden');
    }else{
        count.removeClass('hidden');
    }
}

function hideHeader(){
    var count = $('header .count > ul');
    if(count.length > 1) {
        count.eq(0).removeClass('hidden');
        count.eq(1).addClass('hidden');
    }else{
        count.addClass('hidden');
    }
}

//Auto hide tooltips after event
function hideTips(){
    var tooltips = $('.tooltips');
    if(tooltips.is(':visible')){
        setTimeout(function(){
            tooltips.tooltip('destroy'); 
        }, 2000);
    }
}

//Public checkAll function
function checkAll(){
    var checkAll = $("#main-content > article .check-all input[type='checkbox']");
    var options = checkAll.closest('div').find('.popover');
    var checkList = $('.tbody .am-checkbox');
    var CheckBox = checkList.children("input[type='checkbox']");
    var defaultCheck = options.children('li:first-child');
    var count = $('header .count > ul');
    var title = $('header .title');

    checkAll.each(function(){
        var _this = $(this);
        _this.click(function(){
            if(_this.is(':checked')){
                defaultCheck.addClass('active');
                _this.val(defaultCheck.html());
                showHeader();
                CheckBox.uCheck('check');
                checkAll.uCheck('check');
            }else{
                options.children('li').removeClass('active');
                _this.val('');
                hideHeader();
                CheckBox.uCheck('uncheck');
                checkAll.uCheck('uncheck');
            }
        });
    });
    options.each(function(){
        var opt = $(this);
        var li = opt.children('li');
        var nextOption = (opt.parents('footer').length > 0)? opt.parents('footer').siblings('div').find('.popover') : opt.parent('div').siblings('footer').find('.popover');
        li.each(function(){
            var _this = $(this);
            _this.click(function(){
                var nextList = nextOption.children('li').eq(_this.index());
                if(_this.index() !== 2){
                    _this.addClass('active').siblings().removeClass('active');
                    nextList.addClass('active').siblings().removeClass('active');
                    showHeader();
                    checkAll.uCheck('check').val(_this.html());
                    CheckBox.uCheck('check');
                }else{
                    _this.siblings().removeClass('active');
                    nextList.siblings().removeClass('active');
                    hideHeader();
                    checkAll.uCheck('uncheck').val('');
                    CheckBox.uCheck('uncheck');
                }
            });
        });
    });
}


function CompareTime($tr,_index){
		var	$input = $tr.find("input:text.time"),
			$tbody = $tr.parent(),
			position = ($tbody.find("tr").index($tr) > 0)?'top':'bottom',
			_begin = $.trim($input.eq(0).val()),
			_end =  $.trim($input.eq(1).val());
		if(typeof(_index)=="undefined"){
			if(_begin==""){
				$input.eq(0).tooltip({title: "请输入开始时间,如:09:00", placement: "bottom"}).tooltip('show');
				hideTips();
				return false;
			}else if(!checkTime(_begin)){
				$input.eq(0).tooltip({title: "开始时间格式不正确", placement: "bottom"}).tooltip('show');
				hideTips();
				return false;
			}
			if(_end==""){
				$input.eq(1).tooltip({title: "请输入结束时间,如:09:00", placement: "bottom"}).tooltip('show');
				hideTips();
				return false;
			}else if(!checkTime(_end)){
				$input.eq(1).tooltip({title: "结束时间格式不正确", placement: "bottom"}).tooltip('show');
				hideTips();
				return false;
			}
			var _begintime = new Date((new Date()).Format("yyyy/MM/dd")+" "+_begin),
			_endtime= new Date((new Date()).Format("yyyy/MM/dd")+" "+_end);
			if(_begintime>_endtime){
				$input.eq(0).tooltip({title: "开始时间不能小于或等于结束时间", placement: position}).tooltip('show');
				hideTips();
				return false;
			}
		}else if(checkTime(_begin)&&checkTime(_end)){
			var _begintime = new Date((new Date()).Format("yyyy/MM/dd")+" "+_begin),
			_endtime= new Date((new Date()).Format("yyyy/MM/dd")+" "+_end);
			if(_begintime>=_endtime){
				if(_index==0){
					$input.eq(0).tooltip({title: "开始时间不能大于或等于结束时间", placement: "bottom"}).tooltip('show');
				}else{
					$input.eq(1).tooltip({title: "结束时间不能小于或等于开始时间", placement: "bottom"}).tooltip('show');
				}
				hideTips();
				return false;
			}
		}
		return true;
}


function CompareTimeAll($tr){
	if(typeof($tr)!='undefined'){
		var	$input = $tr.find("input:text.time"),
			$tbody = $tr.parent(),
			position = ($tbody.find("tr").index($tr) > 0)?'top':'bottom',
			_begin = $.trim($input.eq(0).val()),
			_end =  $.trim($input.eq(1).val())
			_IsError=false;
			
			if(_begin==""){
				$input.eq(0).tooltip({title: "请输入开始时间,如:09:00", placement: "bottom"}).tooltip('show');
				hideTips();
				_IsError = true;
			}else if(!checkTime(_begin)){
				$input.eq(0).tooltip({title: "开始时间格式不正确", placement: "bottom"}).tooltip('show');
				hideTips();
				_IsError = true;
			}
			if(_end==""){
				$input.eq(1).tooltip({title: "请输入结束时间,如:09:00", placement: "bottom"}).tooltip('show');
				hideTips();
				_IsError = true;
			}else if(!checkTime(_end)){
				$input.eq(1).tooltip({title: "结束时间格式不正确", placement: "bottom"}).tooltip('show');
				hideTips();
				_IsError = true;
			}
			if(_IsError){
				return false;
			}
			var _begintime = new Date((new Date()).Format("yyyy/MM/dd")+" "+_begin),
			_endtime= new Date((new Date()).Format("yyyy/MM/dd")+" "+_end);
			if(_begintime>_endtime){
				$input.eq(0).tooltip({title: "开始时间不能小于或等于结束时间", placement: "bottom"}).tooltip('show');
				hideTips();
				return false;
			}
	}else{
		var $trs = $("#main-content div.popwindow div.select-time table.table tbody tr:not(:last)"),
			len = $trs.length,
			_IsError=false;
		if(len==0){
			 $("#main-content div.popwindow div.select-time table.table tbody tr:first").tooltip({title: "请添加推广时间", placement: "bottom"}).tooltip('show');
			 hideTips();
			 return false;
		}

		for(i=0;i<len;i++){
			if(!CompareTimeAll($trs.eq(i))){
				_IsError = true;
			}
		}
		if(_IsError){
			return false;
		}else{
			var arrtime=new Array(),
				_IsError = false;
			for(i=0; i< len ;i++){
				var _arry = new Array(),
					$trChild = $trs.eq(i).find("input:text.time"),
					_beginTimeInt = ReturnTimeInt($trChild.eq(0)),
					_endTimeInt = ReturnTimeInt($trChild.eq(1)),
					_arrtimearrlen = arrtime.length;
				for(var j=0;j < _arrtimearrlen;j++){
						var _arrrtimebegin = arrtime[j][0],
							_arrrtimeend = arrtime[j][1];
							
						if(_arrrtimebegin<_beginTimeInt&&_beginTimeInt<_arrrtimeend){
							$trChild.eq(0).tooltip({title: "开始时间不允许与其他时间段交叉", placement: "bottom"}).tooltip('show');
							_IsError=true;
						}
						if(_arrrtimebegin<_endTimeInt&&_endTimeInt<_arrrtimeend){
							$trChild.eq(1).tooltip({title: "结束时间不允许与其他时间段交叉", placement: "bottom"}).tooltip('show');
							_IsError=true;
						}
						if(_beginTimeInt<=_arrrtimebegin&&_endTimeInt>=_arrrtimeend){
							$trs.eq(j).find("input:text.time").eq(0).tooltip({title: "开始时间不允许与其他时间段交叉", placement: "bottom"}).tooltip('show');
							_IsError=true;
						}

				}
				_arry.push(_beginTimeInt);
				_arry.push(_endTimeInt);
				arrtime.push(_arry);
			}
			if(_IsError){
				hideTips();
				return false;
			}
		}

	}
	hideTips();
	return true;
}
function GetTimeInt(time){
	var strs = time.split(":"),
		_minute = parseInt(strs[0]),
		_second = parseInt(strs[1]);
		return _minute * 60 + _second;
}
function ReturnTimeInt(timeInt){
		var _minute = parseInt(timeInt/60);
		var _second = timeInt%60;
		return (_minute<10?"0":"") + _minute + ":" + (_second<10?"0":"") + _second;
}

function checkTime(time){
	var regTime = /^((1|0?)[0-9]|2[0-3]):([0-5]?[0-9])$/;
	var result = false;
	if (regTime.test(time)) {
		return true;
	}
	return false;
}
